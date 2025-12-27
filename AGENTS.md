# Repository Guidelines

BetMetric is a financial control tower for strategic initiatives ("bets"). The product vision, UX targets, and domain rules live in `vision.md`. Keep this document aligned as the codebase grows.

## Project Structure & Module Organization
- Current layout: `frontend/` (React app), `backend/` (FastAPI app), `docker-compose.yml`, plus `vision.md` and `gameplan.md`.
- Suggested additions as the project grows: `tests/` mirroring modules, `docs/` for ADRs, and `scripts/` for utilities.

## Build, Test, and Development Commands
- No toolchain is configured yet.
- When tooling is added, document exact commands here and in the README. Example: `make test` — run the test suite.

## Domain Rules & Data Integrity
- Bets are hierarchical: `total_spend(parent) = direct_spend(parent) + sum(total_spend(children))`.
- A bet requires a budget; every transaction must be tagged; `ROI = (revenue - expenses) / expenses`.
- Dormancy logic: if `last_transaction > 30 days` and status is not `Won/Lost`, force status `Dormant` and visually desaturate.
- Health colors: Green if `revenue > expense`, Red if `expense > revenue`, Yellow if `expense > 80% budget`.

## Escrow Agent (AI) Requirements
- Read-only access; never write or mutate data.
- Must not hallucinate numbers. If a query is ambiguous, ask a clarifying question.
- Accept synonyms for spend (burn/cost/bleed) and map them to negative transactions; target <3s for common queries.

## UX & Performance Targets
- Dark, high-contrast, data-dense interface; minimal whitespace; tree load time <1.5s for 100 bets.

## Coding Style & Naming Conventions
- Follow the conventions of the primary language once selected; adopt a formatter/linter early and record it here.
- Avoid spaces in file names; use lowercase with separators (e.g., `bet_tree.ts`).

## Testing Guidelines
- Place tests under `tests/` and mirror module paths.
- Prioritize invariants: tree rollups, dormant status, ledger tagging, ROI, and health color rules.

## Commit & Pull Request Guidelines
- This directory is not currently a Git repository, so no commit history is available.
- Once Git is initialized, keep commits imperative and scoped (e.g., `ledger: enforce tagged transactions`).
- Pull requests should include purpose, scope, test results, and linked issues; add screenshots for UI changes.

## Configuration & Security
- Do not commit secrets. Provide `.env.example` for required variables with safe placeholders.
- Document required config keys and defaults in `docs/` or the README.
