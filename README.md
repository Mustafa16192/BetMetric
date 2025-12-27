# BetMetric: The Financial Control Tower for Strategic Bets

## Overview

**BetMetric** bridges the critical gap between **Strategy** and **Finance**. It empowers executives to manage every strategic initiative ("Bet") like a mini-company, complete with its own Profit & Loss (P&L) statement. Instead of just tracking tasks or overall bank balances, BetMetric provides real-time, granular financial truth for every investment.

The core problem it solves is the widespread blindness in modern organizations: knowing *that* money is being spent, but not *where* or *how effectively* across individual projects.

## Product Vision & Pillars

BetMetric is built on four core pillars:

1.  **The Strategy Tree (The Map):** A dynamic, hierarchical visualization of all strategic bets (e.g., Vision -> Growth -> Paid Ads). It instantly shows the organizational strategy, with nodes representing bets, sized by budget, and colored by financial health.
2.  **The Truth Ledger (The Data):** A strict, dual-entry ledger where every dollar spent (Expense) and earned (Revenue) is meticulously tagged to a specific Bet. This moves beyond vague project status updates to hard financial reality.
3.  **The "Escrow" Agent (The Oracle):** An AI-powered assistant with read-only access to all financial data. Executives can query it in natural language (e.g., "Which initiatives are losing money?") and receive verified, factual answers instantly.
4.  **The Dormancy Monitor (The Accountability):** An automated system that flags inactive projects. If a Bet hasn't generated revenue or received an update in 30 days, it's flagged as "Dormant," prompting leadership to either revive or decommission it, thus eliminating resource drain.

**UX Goal:** Minimalist, "Deep Tech," High-Contrast. Think "Bloomberg Terminal meets Apple Design."

## Tech Stack

BetMetric is built with a modern, robust, and scalable technology stack:

*   **Frontend:** `React (Vite + TypeScript)` for a rich, dashboard-style UI.
    *   `Tailwind CSS` for rapid, high-contrast dark mode development.
    *   `React Flow` for the Strategy Tree visualization.
*   **Backend:** `FastAPI (Python)` for high-performance API services, data validation (Pydantic), and AI integration.
    *   `Poetry` for dependency management.
    *   `SQLAlchemy` with `asyncpg` for asynchronous ORM.
    *   `Alembic` for database migrations.
*   **Database:** `PostgreSQL` for robust, relational financial data and hierarchical queries.
*   **AI:** `LangChain + OpenAI` (or equivalent LLMs) for the "Escrow Agent."
*   **DevOps:** `Docker Compose` for a unified local development environment.

## Getting Started (Local Development)

To get BetMetric up and running on your local machine, follow these steps:

### Prerequisites

*   **Docker Desktop:** Ensure Docker is installed and running on your system.
*   **Node.js & npm:** (Optional, but recommended if you plan to run Frontend outside Docker)

### 1. Clone the Repository

```bash
git clone https://github.com/Mustafa16192/BetMetric.git
cd BetMetric
```

### 2. Setup and Start Services with Docker Compose

This will build the necessary Docker images and start the PostgreSQL database, FastAPI backend, and React frontend services.

```bash
docker compose up -d --build
```

**Note on Port Conflicts:** If you have another PostgreSQL instance running on your host machine on port `5432`, you might encounter a port conflict. We've configured the `db` service to use host port `5433` to avoid this.

### 3. Initialize the Database Schema (Migrations)

Once the containers are running, you need to apply the database schema.

```bash
# Generate the initial migration script (if not already done)
# This command compares your models.py with the database and creates a migration file.
docker compose run --rm backend poetry run alembic revision --autogenerate -m "Initial tables"

# Apply the migration to your PostgreSQL database
# This executes the SQL commands to create your tables.
docker compose run --rm backend poetry run alembic upgrade head
```

### 4. Verify Services

*   **Backend API:** Access the interactive API documentation (Swagger UI):
    [http://localhost:8000/docs](http://localhost:8000/docs)
    You should see endpoints for Bets and Transactions under `/v1/`.

*   **Frontend Application:** Access the BetMetric UI:
    [http://localhost:3000](http://localhost:3000)
    On the landing page, you should see "System: Online" in the bottom right, confirming connectivity to the backend.

### 5. Connect to the Database with DataGrip (Optional)

You can inspect the database directly using DataGrip or any other PostgreSQL client.

*   **Host:** `localhost`
*   **Port:** `5433` (This is the host port mapped to the container's 5432)
*   **User:** `user`
*   **Password:** `password`
*   **Database:** `betmetric_db`

You should find the `bets` and `transactions` tables in the `public` schema.

## Basic Usage Workflow (MVP)

1.  **Create a Bet:** Go to [http://localhost:8000/docs](http://localhost:8000/docs), expand the `/v1/bets` section, and use the `POST /v1/bets/` endpoint to create your first bet (e.g., `name: "Company Vision 2025", budget: 1000000, status: "active"`).
2.  **Add Transactions:** Navigate to the `Ledger` page in the frontend UI (`http://localhost:3000/ledger`). Click "+ Add Transaction", select your newly created Bet from the dropdown, and add some revenue or expense entries.
3.  **View Financials:** On the API docs, use `GET /v1/bets/{bet_id}/financials` with the ID of your created bet to see the recursive P&L calculation.

## What's Next?

*   Wiring up the Frontend Dashboard to display the real Strategy Tree.
*   Implementing the "Create Root Bet" UI.
*   Further development of the Escrow Agent (AI) and Dormancy Monitor features.

## License

[MIT License](LICENSE) - (Assuming this is the desired license. A `LICENSE` file should be created.)
