from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud, schemas
from app.database import get_db

router = APIRouter(
    prefix="/metrics",
    tags=["Metrics"],
)


@router.get("/summary", response_model=schemas.SummaryMetrics)
async def get_summary(db: AsyncSession = Depends(get_db)):
    return await crud.get_summary_metrics(db)
