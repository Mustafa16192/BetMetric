# Project: BetMetric

## Overview
**The Financial Control Tower for Strategic Bets.**

BetMetric bridges the gap between **Strategy** and **Finance** by treating every strategic initiative ("Bet") as a mini-company with its own Profit & Loss (P&L) statement. It allows executives to visualize strategy as a tree, track real financial truth (Burn vs. Return), and use AI to interrogate data.

## Product Vision & Pillars
1.  **The Strategy Tree (The Map):** A hierarchical visualization of bets (Vision -> Growth -> Paid Ads).
2.  **The Truth Ledger (The Data):** A dual-entry ledger tracking every dollar spent and earned per bet.
3.  **The "Escrow" Agent (The Oracle):** A neutral, read-only AI assistant that answers financial questions with facts.
4.  **The Dormancy Monitor (The Accountability):** Automated flagging of inactive ("Dormant") projects that consume resources without updates.

## Core Domain Logic
-   **Recursive P&L:** `Total Spend of Parent` = `Direct Spend` + `Sum(Children Spend)`.
-   **Dormancy Logic:** If a bet has no transactions/updates > 30 days and isn't "Won/Lost", it becomes "Dormant".
-   **Ledger Integrity:** Every transaction must be tagged to a Bet. `ROI` = `(Revenue - Expenses) / Expenses`.

## User Experience (UX) Goals
-   **Vibe:** Minimalist, "Deep Tech", High-Contrast. "Bloomberg Terminal meets Apple Design".
-   **Theme:** Dark mode by default. Data density over whitespace.

## Functional Requirements (MVP)
-   **Strategic Hierarchy Builder:** Drag-and-drop interface for the Tree of Bets.
-   **Truth Ledger:** Input and tracking for Revenue vs. Expense.
-   **Escrow Agent:** Text-to-SQL style AI query engine (Read-Only).
-   **Visual Health Indicators:**
    -   **Green:** Revenue > Expense
    -   **Red:** Expense > Revenue
    -   **Yellow:** Expense > 80% Budget

## Tech Stack (Inferred/Proposed)
*Note: To be solidified during initialization.*
-   **Frontend:** React / Next.js (for the rich, dashboard-style UI).
-   **Backend:** Node.js or Python (FastAPI/Django) to handle the logic and AI integration.
-   **Database:** PostgreSQL (Ideal for structured financial/ledger data and hierarchical queries).
-   **AI:** Integration with LLMs for the "Escrow Agent".

## Directory Structure
-   `GEMINI.md`: Project documentation and AI context.
-   `vision.md`: Original product vision and requirements.