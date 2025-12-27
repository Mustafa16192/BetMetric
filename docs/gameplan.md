# BetMetric Development Gameplan

## Tech Stack Strategy
To achieve the "Bloomberg Terminal meets Apple Design" vibe with robust financial logic and AI capabilities, we will use the following stack:

*   **Frontend:** **React (Vite + TypeScript)**
    *   *Why:* Lightweight SPA setup for complex UI (Tree visualizations) with TypeScript for financial safety and fast dev server iteration.
    *   *Styling:* **Tailwind CSS** (for rapid, high-contrast dark mode development) + **Shadcn/UI** (for robust, accessible components).
    *   *Visualization:* **React Flow** (for the Strategy Tree) and **Recharts** (for financial charts).
*   **Backend:** **FastAPI (Python)**
    *   *Why:* Python is native to AI/LLM development (The "Escrow Agent"). FastAPI provides high performance, auto-documentation, and Pydantic for strict data validation (The "Truth Ledger").
*   **Database:** **PostgreSQL**
    *   *Why:* Relational integrity is non-negotiable for financial data. Robust support for recursive queries (CTEs) is essential for the "Strategy Tree" hierarchy.
*   **AI:** **LangChain + OpenAI (or equivalent)**
    *   *Why:* For building the Text-to-SQL "Escrow Agent".
*   **DevOps:** **Docker Compose**
    *   *Why:* Unified local development environment.

---

## MVP Scope (Explicit)
**In scope:** Single-tenant MVP, manual ledger entry, single currency, internal users only, core Strategy Tree + Ledger + Dormancy detection + Escrow read-only queries.

**Out of scope (for MVP):** Bank integrations, multi-currency conversion, advanced permissions, real-time streaming finance feeds, mobile app.

## Phase 1: Infrastructure & Skeleton (Days 1-2)
**Goal:** A running mono-repo with Frontend, Backend, and Database talking to each other.

1.  **Repository Setup**
    *   Initialize git.
    *   Structure: `/frontend`, `/backend`, `/docker`.
    *   `docker-compose.yml` to orchestrate React (Vite), FastAPI, and Postgres.

2.  **Backend Initialization (FastAPI)**
    *   Setup `poetry` for dependency management.
    *   Basic Health Check endpoint (`GET /health`).
    *   Database connection setup (SQLAlchemy + AsyncPG).
    *   Migration system setup (Alembic).

3.  **Frontend Initialization (React)**
    *   `npm create vite@latest` with React + TypeScript.
    *   Install generic UI components (Buttons, Inputs, Cards).
    *   Setup API client (Axios/Fetch wrapper) pointing to the Backend.

---

## Phase 2: Domain Modeling & Database (The Truth Ledger)
**Goal:** A strict database schema that enforces the "Physics of the System."

1.  **Schema Design**
    *   `Organizations`, `Users`, `Roles`: Minimal access control.
    *   `Bets`: Recursive table (id, parent_id, name, description, budget, status, created_at).
    *   `Transactions`: Ledger (id, bet_id, amount, type [revenue/expense], date, description, source).
    *   `StatusHistory` or `AuditLog`: Changes to bet status, budget, and ownership.
    *   *Constraints:* DECIMAL for money, FK integrity, `budget > 0`, `child_budget <= parent_remaining`.
    *   *Ledger rule:* Either enforce `amount > 0` + `type`, or signed `amount` + `direction`. Pick one and document it.

2.  **Core API Logic**
    *   **CRUD for Bets:** Create, Read, Update (Soft Delete only).
    *   **Tree Logic:** Endpoint to fetch the full nested tree structure.
    *   **Recursive Aggregation:** Choose strategy (CTE on read vs cached rollups + job); align with <1.5s tree load.
    *   **API shape:** `GET /bets/tree`, `GET /bets/{id}/pnl`, `POST /transactions`, `GET /bets?status=dormant`.

---

## Phase 3: The "Strategy Tree" UI (The Map)
**Goal:** Users can visualize and manipulate the hierarchy.

1.  **Visualization Component**
    *   Implement **React Flow** to render the `Bets` tree.
    *   Nodes show: Name, Health Color (Green/Red), and Budget Bar.

2.  **Interaction**
    *   Click node -> Open "Mini P&L" side drawer.
    *   Drag-and-drop to re-parent a bet (Backend must handle budget validation logic).

---

## Phase 4: Financial Logic & "Dormancy Monitor"
**Goal:** The system starts providing value and accountability.

1.  **Transaction Entry**
    *   UI: Quick-add form for Expenses/Revenue.
    *   Backend: Update running totals.

2.  **The Dormancy Service**
    *   Background task (Celery/Redis or simple Cron) to check `last_transaction_date`.
    *   Logic: Mark as `Dormant` if inactive > 30 days.
    *   UI: Visual decay for Dormant nodes.

---

## Phase 5: The "Escrow Agent" (AI)
**Goal:** Natural language interrogation of the data.

1.  **Text-to-SQL Pipeline**
    *   Setup LangChain SQLDatabase chain with a **read-only DB role** and table allowlist.
    *   Prompt: "You are a financial auditor. Only answer based on data."
    *   Guardrails: query validation, max rows, execution timeouts, and full audit logging.

2.  **Chat UI**
    *   Floating chat widget or dedicated "Interrogation Room" page.
    *   Streaming responses.

---

## Testing & Verification
*   Core invariants: tree rollups, dormant status transition, ROI formula, health color rules.
*   Add fixtures/seed data for demo realism (10-20 bets, mixed revenue/expense).
*   Add performance checks for tree load with 100 bets.

## UX Tokens & Visual System
*   Define status colors (Green/Red/Yellow) and dormant desaturation tokens.
*   Enforce data-dense layout (minimal whitespace, high contrast).

## Configuration & Environment
*   Provide `.env.example` with defaults for DB/AI keys.
*   Document migrations and seed workflow (`scripts/seed_*`).
*   Use Docker volumes for Postgres data persistence in dev.

## Current Immediate Tasks (To Start)
1.  Create the directory structure.
2.  Create `docker-compose.yml`.
3.  Initialize the FastAPI app.
4.  Initialize the React app (Vite + TypeScript).
