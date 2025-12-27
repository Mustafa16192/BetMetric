from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud, schemas
from app.database import get_db

router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"],
    responses={404: {"description": "Transaction not found"}},
)

@router.post("/", response_model=schemas.TransactionOut, status_code=status.HTTP_201_CREATED)
async def create_transaction(transaction: schemas.TransactionCreate, db: AsyncSession = Depends(get_db)):
    # Optional: Check if bet_id exists
    bet = await crud.get_bet(db, transaction.bet_id)
    if not bet:
        raise HTTPException(status_code=404, detail=f"Bet with id {transaction.bet_id} not found")
    
    db_tx = await crud.create_transaction(db=db, transaction=transaction)
    return schemas.TransactionOut(
        id=db_tx.id,
        bet_id=db_tx.bet_id,
        amount=db_tx.amount,
        type=db_tx.type,
        description=db_tx.description,
        source=db_tx.source,
        date=db_tx.date,
        created_at=db_tx.created_at,
        updated_at=db_tx.updated_at,
        bet_name=bet.name,
    )

@router.get("/", response_model=List[schemas.TransactionOut])
async def read_transactions(
    bet_id: Optional[UUID] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    return await crud.get_transactions_with_bet(db, bet_id=bet_id, skip=skip, limit=limit)

@router.get("/{transaction_id}", response_model=schemas.TransactionInDB)
async def read_transaction(transaction_id: UUID, db: AsyncSession = Depends(get_db)):
    db_transaction = await crud.get_transaction(db, transaction_id=transaction_id)
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return db_transaction

@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction(transaction_id: UUID, db: AsyncSession = Depends(get_db)):
    db_transaction = await crud.delete_transaction(db, transaction_id=transaction_id)
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    # 204 No Content means no body is returned.
    return 
