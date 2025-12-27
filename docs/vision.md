# Product Vision: BetMetric
**The Financial Control Tower for Strategic Bets**

## 1. The Core Philosophy
Modern companies are flying blind. They run 15 to 50 strategic initiatives ("Bets") simultaneously—launching new features, expanding to new markets, or testing marketing channels.

While they know their *total* bank balance, they have no idea which specific Bet is making money and which is bleeding cash.

**BetMetric** solves this by treating every strategic initiative as a mini-company with its own P&L. It bridges the gap between **Strategy** (what we want to do) and **Finance** (what we are actually spending).

## 2. The Four Pillars of BetMetric

### I. The Strategy Tree (The Map)
Business isn't a linear list of tasks; it's a hierarchy.
* **Vision:** Users build a visual "Tree of Bets."
* **Example:** A "Growth" bet breaks down into "Paid Ads" and "Content Marketing."
* **The Insight:** At a glance, a CEO can see the entire organization's strategy. The size of the box represents the budget; the color represents the health. It is a living map of the company's focus.

### II. The Truth Ledger (The Data)
Strategy without numbers is just hallucination.
* **Vision:** A simple, unforgiving ledger where every dollar spent (Expenses) and every dollar earned (Revenue) is tagged to a specific Bet.
* **The Insight:** We move away from vague "project status updates" to hard financial truth. If a Bet has spent $50k and earned $0, the dashboard shows it in bright red, regardless of how "optimistic" the project manager feels.

### III. The "Escrow" Agent (The Oracle)
Executives don't have time to filter through 50 charts. They need a trusted, neutral partner.
* **Vision:** An AI-powered voice/text assistant that acts as a neutral third party (an "Escrow"). It has read-only access to all the data.
* **The Behavior:** You ask it hard questions: *"Which initiatives are currently losing money?"* or *"Who is in charge of the zombie projects?"* It answers instantly with facts, not opinions.

### IV. The Dormancy Monitor (The Accountability)
Projects rarely fail loudly; they just quietly consume resources forever.
* **Vision:** An automated system that monitors activity.
* **The Behavior:** If a Bet hasn't generated revenue or had a status update in 30 days, the system flags it as "Dormant." It alerts leadership to either decommission the bet or revive it.

## 3. The User Experience (UX)
* **The Vibe:** Minimalist, "Deep Tech," and high-contrast. Think "Bloomberg Terminal meets Apple Design." Dark mode by default.
* **The Feeling:** The user should feel powerful and informed. No clutter. Just the signal.
* **The Flow:**
    1.  **Morning Check:** CEO logs in. The Dashboard shows a heat map of all active bets.
    2.  **Investigation:** They see a red block (a failing bet). They click it to see the "Mini P&L."
    3.  **Interrogation:** They activate the **Escrow Agent**: *"Why is the Mobile App launch over budget?"*
    4.  **Action:** The Agent pulls the ledger data: *"Server costs are 200% higher than projected."* The CEO marks the bet for review.

## 4. Why This Matters
Most tools track **Work** (Jira) or **Money** (Xero). No tool tracks **The Value of Work**. BetMetric is the missing link that tells a company if their hard work is actually worth it.

# PROJECT BLUEPRINT: BetMetric
**Document Type:** Product Requirement Blueprint (PM View)
**Purpose:** To define the Jobs To Be Done (JTBD), Functional Logic, and User Stories for the AI Developer.
**Scope:** MVP (Minimum Viable Product)

---

## 1. Executive Context
**BetMetric** is a Business Intelligence & Strategy Execution platform.
* **The Core Problem:** Executives cannot connect "Strategic Initiatives" (Bets) to "Financial Outcomes" (P&L).
* **The Solution:** A hierarchical dashboard that treats every project as a financial investment with a strict "Burn vs. Return" calculation.
* **The Metaphor:** "A Bloomberg Terminal for Project Management."

---

## 2. Jobs To Be Done (JTBD) framework
*This section tells the AI **why** users are here, so it can prioritize workflows.*

### JTBD 1: The "Stop the Bleeding" Job
* **Trigger:** The CEO notices the bank balance is dropping faster than expected.
* **Goal:** Identify exactly which strategic initiative is consuming the most cash with the least return.
* **Outcome:** The CEO decommissions the "Dormant" project within 5 minutes of logging in.

### JTBD 2: The "Proof of Value" Job
* **Trigger:** A Product Manager wants to request more budget for their initiative.
* **Goal:** Attribute specific revenue transactions to their initiative to prove ROI.
* **Outcome:** A green "Profitable" status on the dashboard that justifies further investment.

### JTBD 3: The "Instant Answers" Job
* **Trigger:** An executive is in a board meeting and gets asked a hard financial question.
* **Goal:** Ask a trusted agent (The Escrow AI) a complex question in plain English and get a verified financial figure immediately.
* **Outcome:** The executive looks competent and informed without opening Excel.

---

## 3. The "Bet" Domain Logic (The Physics of the System)
*The AI must enforce these logical rules in the backend.*

1.  **The Recursive Rule:**
    * Bets are not flat; they are a Tree.
    * *Logic:* `Total Spend of Parent Bet` = `Direct Spend of Parent` + `Sum(Total Spend of all Children)`.
    * *Implication:* You cannot calculate the health of the company without rolling up the health of the leaves of the tree.

2.  **The Immortality Constraint (The Dormancy Logic):**
    * Bets default to "Active."
    * *Logic:* IF (`Last Transaction Date` > 30 days ago) AND (`Status` != 'Won/Lost'), THEN System forces Status to `Dormant`.
    * *UI Impact:* Dormant nodes must visually decay (turn gray/desaturated) to annoy the user into taking action.

3.  **The Ledger Integrity:**
    * A Bet cannot exist without a Budget (Allocation).
    * A Transaction cannot exist without being tagged to a Bet.
    * *Logic:* `ROI` = `(Sum of Revenue - Sum of Expenses) / Sum of Expenses`.

---

## 4. User Personas

* **The Architect (CEO/COO):**
    * *Behavior:* Creates the high-level strategy. Checks the dashboard once a day. Uses the AI Chat heavily.
    * *Pain Point:* Noise. They only want to see Red (Failure) or Green (Success).

* **The Builder (Product Lead):**
    * *Behavior:* Manually inputs expenses. Fights to keep their bet "Green."
    * *Pain Point:* tedious data entry. Needs the "Add Transaction" flow to be 2 clicks max.

---

## 5. Functional Requirements (FRs)

### FR-01: Strategic Hierarchy Builder
* **Description:** A drag-and-drop or parent-selector interface to build the Tree of Bets.
* **Constraint:** A Child Bet cannot have a larger budget than its Parent's *remaining* unallocated budget.

### FR-02: The Truth Ledger
* **Description:** A dual-entry ledger (Revenue vs. Expense) for every node.
* **Requirement:** Visual separation of "Burn" (Money out) and "Yield" (Money in).

### FR-03: The Escrow Agent (Text-to-SQL)
* **Description:** An LLM-powered query engine.
* **Security:** Must be strictly READ-ONLY.
* **Intelligence:** Must understand synonyms. (e.g., "Burn", "Spend", "Cost", "Bleed" all map to the sum of negative transactions).

### FR-04: Visual Health Indicators
* **Description:** The Tree Visualization must auto-color based on data.
* **Logic:**
    * **Green:** `Revenue > Expense`
    * **Red:** `Expense > Revenue`
    * **Yellow:** `Expense > 80% of Budget` (Warning)

---

## 6. Detailed User Stories

### Story A: The Board Meeting Panic
> **As a** CEO,
> **I want to** ask the AI "Which three bets account for 50% of our burn rate?",
> **So that** I can present accurate data to the board without waiting for the CFO.
> **Acceptance Criteria:**
> 1. User types query in natural language.
> 2. System returns a specific list of 3 Bets with dollar amounts.
> 3. Response time is under 3 seconds.

### Story B: The Dormancy Hunt
> **As a** COO,
> **I want to** see a filtered view of all "Dormant" projects,
> **So that** I can shut them down and reclaim their budget.
> **Acceptance Criteria:**
> 1. Dashboard has a toggle/filter for "Dormant".
> 2. Dormant bets show "Days Inactive" count (e.g., "Inactive for 42 days").

### Story C: The Expense Log
> **As a** Product Lead,
> **I want to** log a $5,000 server bill to my "AI Feature" bet,
> **So that** the system reflects the true cost of my initiative.
> **Acceptance Criteria:**
> 1. Input form requires: Amount, Date, Description, Source (Manual).
> 2. Upon save, the Bet's "Available Budget" progress bar updates instantly.

---

## 7. Non-Functional Requirements (NFRs)

1.  **Trust:** The AI must **never** hallucinate a number. If the query is ambiguous, it must ask for clarification.
2.  **Speed:** The Strategy Tree load time must be < 1.5s for a company with 100 bets.
3.  **Aesthetics:** "Data Density." Avoid whitespace. Use a dark, high-contrast theme suitable for financial data visualization.
