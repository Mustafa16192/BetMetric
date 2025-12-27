"""Add bet flagged column

Revision ID: 7f9c4b7c1c2a
Revises: 4f5d2e9e3c62
Create Date: 2025-12-27 14:15:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "7f9c4b7c1c2a"
down_revision: Union[str, Sequence[str], None] = "4f5d2e9e3c62"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("bets", sa.Column("flagged", sa.Boolean(), nullable=False, server_default=sa.false()))


def downgrade() -> None:
    op.drop_column("bets", "flagged")
