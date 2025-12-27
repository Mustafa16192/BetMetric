from fastapi import APIRouter

from app.api.v1.endpoints import bets, transactions, metrics

api_router = APIRouter()
api_router.include_router(bets.router)
api_router.include_router(transactions.router)
api_router.include_router(metrics.router)
