from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud, schemas
from app.models import BetStatus
from app.database import get_db

router = APIRouter(
    prefix="/bets",
    tags=["Bets"],
    responses={404: {"description": "Bet not found"}},
)

@router.get("/tree", response_model=List[schemas.BetTree])
async def get_full_tree(db: AsyncSession = Depends(get_db)):
    return await crud.get_full_bet_tree(db)

@router.get("/tree/{bet_id}", response_model=schemas.BetTree)
async def get_bet_subtree(bet_id: UUID, db: AsyncSession = Depends(get_db)):
    bet = await crud.get_bet_tree(db, bet_id)
    if bet is None:
        raise HTTPException(status_code=404, detail="Bet not found")
    return bet

@router.get("/root", response_model=List[schemas.BetInDB])
async def get_root_bets(db: AsyncSession = Depends(get_db)):
    return await crud.get_root_bets(db)

@router.post("/", response_model=schemas.BetInDB, status_code=status.HTTP_201_CREATED)
async def create_bet(bet: schemas.BetCreate, db: AsyncSession = Depends(get_db)):
    db_bet = await crud.get_bet_by_name(db, name=bet.name)
    if db_bet:
        raise HTTPException(status_code=400, detail="Bet with this name already registered")
    try:
        return await crud.create_bet(db=db, bet=bet)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

@router.get("/", response_model=List[schemas.BetSummary])
async def read_bets(
    skip: int = 0, 
    limit: int = 100, 
    status: Optional[BetStatus] = None, 
    db: AsyncSession = Depends(get_db)
):
    try:
        return await crud.get_bet_summaries(db, skip=skip, limit=limit, status=status)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"INTERNAL ERROR DEBUG: {str(e)} Type: {type(e).__name__}")

@router.get("/{bet_id}", response_model=schemas.BetSummary)
async def read_bet(bet_id: UUID, db: AsyncSession = Depends(get_db)):
    summary = await crud.get_bet_summary(db, bet_id)
    if summary is None:
        raise HTTPException(status_code=404, detail="Bet not found")
    return summary

@router.get("/{bet_id}/financials", response_model=schemas.BetFinancials)
async def get_bet_financials(bet_id: UUID, db: AsyncSession = Depends(get_db)):
    financials = await crud.get_bet_financials(db, bet_id=bet_id)
    if financials is None:
        raise HTTPException(status_code=404, detail="Bet not found")
    return financials

@router.patch("/{bet_id}", response_model=schemas.BetInDB)
async def update_bet(bet_id: UUID, bet_update: schemas.BetUpdate, db: AsyncSession = Depends(get_db)):
    try:
        db_bet = await crud.update_bet(db, bet_id=bet_id, bet_update=bet_update)
        if db_bet is None:
            raise HTTPException(status_code=404, detail="Bet not found")
        return db_bet
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

@router.delete("/{bet_id}", status_code=status.HTTP_200_OK)
async def delete_bet(bet_id: UUID, db: AsyncSession = Depends(get_db)):
    # In BetMetric, we prefer marking as LOST instead of actual deletion for financial integrity
    db_bet = await crud.delete_bet(db, bet_id=bet_id)
    if db_bet is None:
        raise HTTPException(status_code=404, detail="Bet not found")
    return {"message": "Bet status updated to LOST"}
