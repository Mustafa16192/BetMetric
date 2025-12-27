"""Add zombie status and transaction fields

Revision ID: 4f5d2e9e3c62
Revises: 2d2b78433a88
Create Date: 2025-01-07 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "4f5d2e9e3c62"
down_revision: Union[str, Sequence[str], None] = "2d2b78433a88"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TYPE betstatus ADD VALUE IF NOT EXISTS 'ZOMBIE'")
    op.add_column("transactions", sa.Column("source", sa.String(), nullable=True))
    op.add_column("transactions", sa.Column("created_at", sa.DateTime(), nullable=True))
    op.add_column("transactions", sa.Column("updated_at", sa.DateTime(), nullable=True))


def downgrade() -> None:
    op.drop_column("transactions", "updated_at")
    op.drop_column("transactions", "created_at")
    op.drop_column("transactions", "source")
    # Removing enum values is not supported in-place; leave betstatus as-is.
