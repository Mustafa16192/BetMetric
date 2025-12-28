import uuid
from datetime import datetime
from enum import Enum
from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey, Text, Enum as SQLEnum, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .database import Base

class BetStatus(str, Enum):
    ACTIVE = "ACTIVE"
    DORMANT = "DORMANT"
    ZOMBIE = "ZOMBIE"
    WON = "WON"
    LOST = "LOST"

class TransactionType(str, Enum):
    REVENUE = "REVENUE"
    EXPENSE = "EXPENSE"

class Bet(Base):
    __tablename__ = "bets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    budget = Column(Numeric(14, 2), nullable=False, default=0.00)
    status = Column(SQLEnum(BetStatus), default=BetStatus.ACTIVE, nullable=False)
    flagged = Column(Boolean, default=False, nullable=False)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("bets.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    children = relationship("Bet", backref="parent", remote_side=[id])
    transactions = relationship("Transaction", back_populates="bet")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bet_id = Column(UUID(as_uuid=True), ForeignKey("bets.id"), nullable=False)
    amount = Column(Numeric(14, 2), nullable=False)
    type = Column(SQLEnum(TransactionType), nullable=False)
    description = Column(String, nullable=False)
    source = Column(String, nullable=True)
    date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    bet = relationship("Bet", back_populates="transactions")
