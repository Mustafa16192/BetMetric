import asyncio
import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from alembic import command
from alembic.config import Config

from .api.v1.api import api_router
from .database import Base, engine

app = FastAPI(
    title="BetMetric API",
    description="The Financial Control Tower for Strategic Bets",
    version="0.1.0"
)

# Configure CORS
origins = ["*"] # Temporarily allow all origins for debugging

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/v1")

@app.on_event("startup")
async def on_startup():
    if os.getenv("AUTO_RUN_MIGRATIONS", "true").lower() in {"1", "true", "yes"}:
        alembic_cfg = Config(str(Path(__file__).resolve().parents[1] / "alembic.ini"))
        await asyncio.to_thread(command.upgrade, alembic_cfg, "head")
    elif os.getenv("AUTO_CREATE_TABLES", "true").lower() in {"1", "true", "yes"}:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

@app.get("/")
async def root():
    return {"message": "Welcome to BetMetric API. Access docs at /docs"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
