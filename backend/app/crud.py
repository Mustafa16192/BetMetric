from __future__ import annotations

from datetime import datetime, timedelta
from decimal import Decimal
from typing import Dict, List, Optional
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import Bet, Transaction, BetStatus, TransactionType
from .schemas import (
    BetCreate,
    BetUpdate,
    BetFinancials,
    BetSummary,
    BetTree,
    BetHealth,
    SummaryMetrics,
    TransactionCreate,
    TransactionOut,
)

ZOMBIE_DAYS = 30
WARNING_THRESHOLD = Decimal("0.80")


def _calculate_inactive_days(last_activity: Optional[datetime], now: datetime) -> Optional[int]:
    if last_activity is None:
        return None
    delta = now - last_activity
    return max(delta.days, 0)


def _health_for_bet(
    status: BetStatus,
    total_expenses: Decimal,
    total_revenue: Decimal,
    budget: Decimal,
    inactive_days: Optional[int],
) -> BetHealth:
    if inactive_days is not None and inactive_days >= ZOMBIE_DAYS and status not in (BetStatus.WON, BetStatus.LOST):
        return BetHealth.ZOMBIE
    if budget > 0 and total_expenses >= budget * WARNING_THRESHOLD:
        return BetHealth.WARNING
    if total_revenue > total_expenses:
        return BetHealth.PROFIT
    if total_expenses > total_revenue:
        return BetHealth.BURN
    return BetHealth.WARNING


async def _load_bets_and_transactions(db: AsyncSession) -> tuple[list[Bet], list[Transaction]]:
    result_bets = await db.execute(select(Bet))
    result_txs = await db.execute(select(Transaction))
    return result_bets.scalars().all(), result_txs.scalars().all()


def _build_maps(
    bets: list[Bet],
    transactions: list[Transaction],
) -> tuple[dict[UUID, list[UUID]], dict[UUID, list[Transaction]], dict[UUID, Optional[datetime]]]:
    children_map: dict[UUID, list[UUID]] = {bet.id: [] for bet in bets}
    transactions_map: dict[UUID, list[Transaction]] = {bet.id: [] for bet in bets}
    last_tx_map: dict[UUID, Optional[datetime]] = {bet.id: None for bet in bets}

    for bet in bets:
        if bet.parent_id and bet.parent_id in children_map:
            children_map[bet.parent_id].append(bet.id)

    for tx in transactions:
        if tx.bet_id in transactions_map:
            transactions_map[tx.bet_id].append(tx)
            current_last = last_tx_map[tx.bet_id]
            if current_last is None or (tx.date and tx.date > current_last):
                last_tx_map[tx.bet_id] = tx.date

    return children_map, transactions_map, last_tx_map


def _calculate_totals(
    bet_id: UUID,
    children_map: dict[UUID, list[UUID]],
    transactions_map: dict[UUID, list[Transaction]],
    cache: dict[UUID, dict[str, Decimal]],
) -> dict[str, Decimal]:
    if bet_id in cache:
        return cache[bet_id]

    direct_revenue = sum(
        (tx.amount for tx in transactions_map.get(bet_id, []) if tx.type == TransactionType.REVENUE),
        Decimal("0"),
    )
    direct_expenses = sum(
        (tx.amount for tx in transactions_map.get(bet_id, []) if tx.type == TransactionType.EXPENSE),
        Decimal("0"),
    )

    total_revenue = direct_revenue
    total_expenses = direct_expenses

    for child_id in children_map.get(bet_id, []):
        child_totals = _calculate_totals(child_id, children_map, transactions_map, cache)
        total_revenue += child_totals["total_revenue"]
        total_expenses += child_totals["total_expenses"]

    cache[bet_id] = {
        "direct_revenue": direct_revenue,
        "direct_expenses": direct_expenses,
        "total_revenue": total_revenue,
        "total_expenses": total_expenses,
    }
    return cache[bet_id]


def _apply_zombie_statuses(
    bets: list[Bet],
    last_tx_map: dict[UUID, Optional[datetime]],
    now: datetime,
) -> tuple[dict[UUID, Optional[int]], bool]:
    inactive_days_map: dict[UUID, Optional[int]] = {}
    changed = False
    for bet in bets:
        last_activity = last_tx_map.get(bet.id) or bet.created_at
        inactive_days = _calculate_inactive_days(last_activity, now)
        inactive_days_map[bet.id] = inactive_days

        if bet.status in (BetStatus.WON, BetStatus.LOST):
            continue
        if inactive_days is None:
            continue
        if inactive_days >= ZOMBIE_DAYS and bet.status != BetStatus.ZOMBIE:
            bet.status = BetStatus.ZOMBIE
            changed = True
        elif inactive_days < ZOMBIE_DAYS and bet.status == BetStatus.ZOMBIE:
            bet.status = BetStatus.ACTIVE
            changed = True

    return inactive_days_map, changed


async def _build_bet_summaries(db: AsyncSession) -> tuple[list[Bet], dict[UUID, BetSummary]]:
    bets, transactions = await _load_bets_and_transactions(db)
    if not bets:
        return [], {}

    children_map, transactions_map, last_tx_map = _build_maps(bets, transactions)
    now = datetime.utcnow()
    inactive_days_map, changed = _apply_zombie_statuses(bets, last_tx_map, now)

    totals_cache: dict[UUID, dict[str, Decimal]] = {}
    summaries: dict[UUID, BetSummary] = {}

    for bet in bets:
        totals = _calculate_totals(bet.id, children_map, transactions_map, totals_cache)
        net_profit = totals["total_revenue"] - totals["total_expenses"]
        roi = 0.0
        if totals["total_expenses"] > 0:
            roi = float((net_profit / totals["total_expenses"]) * 100)

        inactive_days = inactive_days_map.get(bet.id)
        health = _health_for_bet(bet.status, totals["total_expenses"], totals["total_revenue"], bet.budget, inactive_days)

        summaries[bet.id] = BetSummary(
            id=bet.id,
            name=bet.name,
            description=bet.description,
            budget=bet.budget,
            status=bet.status,
            flagged=bet.flagged,
            parent_id=bet.parent_id,
            created_at=bet.created_at,
            updated_at=bet.updated_at,
            direct_revenue=totals["direct_revenue"],
            direct_expenses=totals["direct_expenses"],
            total_revenue=totals["total_revenue"],
            total_expenses=totals["total_expenses"],
            net_profit=net_profit,
            roi=roi,
            health=health,
            last_transaction_at=last_tx_map.get(bet.id),
            inactive_days=inactive_days,
        )

    if changed:
        await db.commit()

    return bets, summaries


async def get_bet_financials(db: AsyncSession, bet_id: UUID) -> Optional[BetFinancials]:
    _, summaries = await _build_bet_summaries(db)
    summary = summaries.get(bet_id)
    if summary is None:
        return None

    return BetFinancials(
        bet_id=summary.id,
        direct_revenue=summary.direct_revenue,
        direct_expenses=summary.direct_expenses,
        total_revenue=summary.total_revenue,
        total_expenses=summary.total_expenses,
        net_profit=summary.net_profit,
        roi=summary.roi,
        health=summary.health,
        last_transaction_at=summary.last_transaction_at,
        inactive_days=summary.inactive_days,
    )


# --- Bet CRUD Operations ---
async def get_bet(db: AsyncSession, bet_id: UUID) -> Optional[Bet]:
    result = await db.execute(select(Bet).filter(Bet.id == bet_id))
    return result.scalar_one_or_none()


async def get_bet_by_name(db: AsyncSession, name: str) -> Optional[Bet]:
    result = await db.execute(select(Bet).filter(Bet.name == name))
    return result.scalar_one_or_none()


async def _sum_children_budgets(db: AsyncSession, parent_id: UUID, exclude_id: Optional[UUID] = None) -> Decimal:
    query = select(func.coalesce(func.sum(Bet.budget), 0)).where(Bet.parent_id == parent_id)
    if exclude_id:
        query = query.where(Bet.id != exclude_id)
    result = await db.execute(query)
    return result.scalar_one() or Decimal("0")


async def _validate_no_cycle(db: AsyncSession, bet_id: UUID, parent_id: UUID) -> None:
    result = await db.execute(select(Bet.id, Bet.parent_id))
    parent_map = {row.id: row.parent_id for row in result}
    current = parent_id
    while current is not None:
        if current == bet_id:
            raise ValueError("A bet cannot be its own ancestor")
        current = parent_map.get(current)


async def _validate_parent_budget(db: AsyncSession, parent_id: UUID, budget: Decimal, exclude_id: Optional[UUID] = None) -> None:
    parent_bet = await get_bet(db, parent_id)
    if parent_bet is None:
        raise ValueError("Parent bet not found")
    allocated = await _sum_children_budgets(db, parent_id, exclude_id=exclude_id)
    if allocated + budget > parent_bet.budget:
        raise ValueError("Child budget exceeds parent remaining allocation")


async def _validate_children_budget(db: AsyncSession, bet_id: UUID, new_budget: Decimal) -> None:
    allocated = await _sum_children_budgets(db, bet_id)
    if allocated > new_budget:
        raise ValueError("Bet budget cannot be lower than allocated child budgets")


async def get_bet_summaries(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 100,
    status: Optional[BetStatus] = None,
) -> List[BetSummary]:
    bets, summaries = await _build_bet_summaries(db)
    if not bets:
        return []

    filtered = [bet for bet in bets if status is None or bet.status == status]
    filtered.sort(key=lambda bet: bet.created_at or datetime.min)
    paged = filtered[skip : skip + limit]
    return [summaries[bet.id] for bet in paged]


async def get_bet_summary(db: AsyncSession, bet_id: UUID) -> Optional[BetSummary]:
    _, summaries = await _build_bet_summaries(db)
    return summaries.get(bet_id)


async def create_bet(db: AsyncSession, bet: BetCreate) -> Bet:
    if bet.parent_id:
        await _validate_parent_budget(db, bet.parent_id, bet.budget)

    db_bet = Bet(**bet.model_dump())
    db.add(db_bet)
    await db.commit()
    await db.refresh(db_bet)
    return db_bet


async def update_bet(db: AsyncSession, bet_id: UUID, bet_update: BetUpdate) -> Optional[Bet]:
    db_bet = await get_bet(db, bet_id)
    if not db_bet:
        return None

    update_data = bet_update.model_dump(exclude_unset=True)
    if "budget" in update_data and update_data["budget"] is None:
        raise ValueError("Budget must be greater than 0")
    new_parent_id = update_data.get("parent_id", db_bet.parent_id)
    new_budget = update_data.get("budget", db_bet.budget)

    if new_parent_id:
        await _validate_no_cycle(db, db_bet.id, new_parent_id)
        await _validate_parent_budget(db, new_parent_id, new_budget, exclude_id=db_bet.id)
    await _validate_children_budget(db, db_bet.id, new_budget)

    for key, value in update_data.items():
        setattr(db_bet, key, value)

    await db.commit()
    await db.refresh(db_bet)
    return db_bet


async def delete_bet(db: AsyncSession, bet_id: UUID) -> Optional[Bet]:
    db_bet = await get_bet(db, bet_id)
    if db_bet:
        db_bet.status = BetStatus.LOST
        await db.commit()
        await db.refresh(db_bet)
    return db_bet


# --- Transaction CRUD Operations ---
async def get_transaction(db: AsyncSession, transaction_id: UUID) -> Optional[Transaction]:
    result = await db.execute(select(Transaction).filter(Transaction.id == transaction_id))
    return result.scalar_one_or_none()


async def get_transactions_with_bet(
    db: AsyncSession,
    bet_id: Optional[UUID] = None,
    skip: int = 0,
    limit: int = 100,
) -> List[TransactionOut]:
    query = select(Transaction, Bet.name).join(Bet, Transaction.bet_id == Bet.id)
    if bet_id:
        query = query.where(Transaction.bet_id == bet_id)
    query = query.order_by(Transaction.date.desc()).offset(skip).limit(limit)

    result = await db.execute(query)
    items: List[TransactionOut] = []
    for transaction, bet_name in result.all():
        items.append(
            TransactionOut(
                id=transaction.id,
                bet_id=transaction.bet_id,
                amount=transaction.amount,
                type=transaction.type,
                description=transaction.description,
                source=transaction.source,
                date=transaction.date,
                created_at=transaction.created_at,
                updated_at=transaction.updated_at,
                bet_name=bet_name,
            )
        )
    return items


async def create_transaction(db: AsyncSession, transaction: TransactionCreate) -> Transaction:
    db_transaction = Transaction(**transaction.model_dump())
    db.add(db_transaction)
    await db.commit()
    await db.refresh(db_transaction)
    return db_transaction


async def delete_transaction(db: AsyncSession, transaction_id: UUID) -> Optional[Transaction]:
    db_transaction = await get_transaction(db, transaction_id)
    if db_transaction:
        await db.delete(db_transaction)
        await db.commit()
    return db_transaction


# --- Tree Operations ---
async def get_full_bet_tree(db: AsyncSession) -> List[BetTree]:
    bets, summaries = await _build_bet_summaries(db)
    visible_bets = [bet for bet in bets if bet.status != BetStatus.LOST]
    if not visible_bets:
        return []

    nodes: dict[UUID, BetTree] = {
        bet.id: BetTree(**summaries[bet.id].model_dump(), children=[])
        for bet in visible_bets
    }

    for bet in visible_bets:
        if bet.parent_id and bet.parent_id in nodes:
            nodes[bet.parent_id].children.append(nodes[bet.id])

    roots = [nodes[bet.id] for bet in visible_bets if bet.parent_id is None]
    roots.sort(key=lambda node: node.created_at or datetime.min)
    return roots


async def get_bet_tree(db: AsyncSession, bet_id: UUID) -> Optional[BetTree]:
    full_tree = await get_full_bet_tree(db)

    def find_node(nodes: list[BetTree], target: UUID) -> Optional[BetTree]:
        for node in nodes:
            if node.id == target:
                return node
            child_match = find_node(node.children, target)
            if child_match:
                return child_match
        return None

    return find_node(full_tree, bet_id)


async def get_root_bets(db: AsyncSession) -> List[Bet]:
    result = await db.execute(select(Bet).filter(Bet.parent_id.is_(None)))
    return result.scalars().all()


async def get_summary_metrics(db: AsyncSession) -> SummaryMetrics:
    bets, transactions = await _load_bets_and_transactions(db)
    if not bets:
        return SummaryMetrics()

    now = datetime.utcnow()
    children_map, transactions_map, last_tx_map = _build_maps(bets, transactions)
    _, changed = _apply_zombie_statuses(bets, last_tx_map, now)

    totals_cache: dict[UUID, dict[str, Decimal]] = {}
    total_expenses = Decimal("0")
    total_revenue = Decimal("0")

    for bet in bets:
        totals = _calculate_totals(bet.id, children_map, transactions_map, totals_cache)
        total_expenses += totals["direct_expenses"]
        total_revenue += totals["direct_revenue"]

    active_bets = len([bet for bet in bets if bet.status not in (BetStatus.LOST, BetStatus.WON, BetStatus.ZOMBIE)])

    thirty_days_ago = now - timedelta(days=30)
    recent_burn = sum(
        (tx.amount for tx in transactions if tx.type == TransactionType.EXPENSE and tx.date and tx.date >= thirty_days_ago),
        Decimal("0"),
    )

    root_budgets = sum((bet.budget for bet in bets if bet.parent_id is None), Decimal("0"))
    root_spend = sum(
        (totals_cache[bet.id]["total_expenses"] for bet in bets if bet.parent_id is None),
        Decimal("0"),
    )
    remaining_budget = max(root_budgets - root_spend, Decimal("0"))

    runway_months: Optional[float] = None
    if recent_burn > 0:
        runway_months = float(remaining_budget / recent_burn)

    if changed:
        await db.commit()

    return SummaryMetrics(
        total_burn=total_expenses,
        total_revenue=total_revenue,
        active_bets=active_bets,
        runway_months=runway_months,
        last_refreshed_at=now,
    )
