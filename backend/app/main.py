import asyncio
import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

print("Main module loading...")

from app.api.v1.api import api_router

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
async def startup_event():
    print("Application startup event triggered!")
    print("Connecting to DB...")

@app.get("/")
async def root():
    return {"message": "Welcome to BetMetric API. Access docs at /docs"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
