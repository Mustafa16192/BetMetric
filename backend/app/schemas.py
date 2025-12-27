from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel, Field

from .models import BetStatus, TransactionType

# --- Bet Schemas ---
class BetBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    budget: Decimal = Field(Decimal("0.00"), gt=0)
    status: BetStatus = BetStatus.ACTIVE
    flagged: bool = False
    parent_id: Optional[UUID] = None

class BetCreate(BetBase):
    pass

class BetUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    budget: Optional[Decimal] = Field(None, gt=0)
    status: Optional[BetStatus] = None
    flagged: Optional[bool] = None
    parent_id: Optional[UUID] = None

class BetInDB(BetBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True # Allow SQLAlchemy models to be converted to Pydantic

# --- Transaction Schemas ---
class TransactionBase(BaseModel):
    bet_id: UUID
    amount: Decimal = Field(..., gt=0)
    type: TransactionType
    description: str = Field(..., min_length=1, max_length=500)
    source: Optional[str] = Field(None, max_length=255)
    date: datetime = Field(default_factory=datetime.utcnow) # Default to current UTC time

class TransactionCreate(TransactionBase):
    pass

class TransactionInDB(TransactionBase):
    id: UUID
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True # Allow SQLAlchemy models to be converted to Pydantic

class BetHealth(str, Enum):
    PROFIT = "profit"
    BURN = "burn"
    WARNING = "warning"
    ZOMBIE = "zombie"

class BetFinancials(BaseModel):
    bet_id: UUID
    # Direct P&L (This bet only)
    direct_revenue: Decimal = Decimal('0.00')
    direct_expenses: Decimal = Decimal('0.00')
    
    # Recursive P&L (This bet + all children)
    total_revenue: Decimal = Decimal('0.00')
    total_expenses: Decimal = Decimal('0.00')
    
    # Calculated Metrics
    roi: float = 0.0
    net_profit: Decimal = Decimal('0.00')
    health: BetHealth = BetHealth.WARNING
    last_transaction_at: Optional[datetime] = None
    inactive_days: Optional[int] = None

class BetSummary(BetInDB):
    direct_revenue: Decimal = Decimal("0.00")
    direct_expenses: Decimal = Decimal("0.00")
    total_revenue: Decimal = Decimal("0.00")
    total_expenses: Decimal = Decimal("0.00")
    net_profit: Decimal = Decimal("0.00")
    roi: float = 0.0
    health: BetHealth = BetHealth.WARNING
    last_transaction_at: Optional[datetime] = None
    inactive_days: Optional[int] = None

# For tree structure (forward reference)
class BetTree(BetSummary):
    children: List["BetTree"] = Field(default_factory=list)

class TransactionOut(TransactionInDB):
    bet_name: str

class SummaryMetrics(BaseModel):
    total_burn: Decimal = Decimal("0.00")
    total_revenue: Decimal = Decimal("0.00")
    active_bets: int = 0
    runway_months: Optional[float] = None
    last_refreshed_at: datetime = Field(default_factory=datetime.utcnow)

BetTree.model_rebuild() # Rebuild to resolve forward reference
