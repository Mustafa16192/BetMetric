# USER EXPERIENCE & JOURNEY SPECIFICATION: BetMetric
**Version:** 1.0
**Focus:** User Flows, Navigation Topology, and Interaction Design.

---

## 1. High-Level Navigation Topology
The app is a "Single Page Application" (SPA) with a persistent Sidebar navigation.

* **Public Zone**
    * `Landing Page` (Marketing)
    * `Auth` (Login / Sign Up)
* **Private Zone (App Shell)**
    * `Dashboard` (Home / The Strategy Tree)
    * `Ledger` (All Transactions List)
    * `Settings` (Team Management)
    * `Bet Detail View` (Modal/Drawer overlay)
    * `Escrow Chat` (Floating Widget)

---

## 2. Journey 1: The "First Time" Onboarding (The Zero State)
*Goal: Get the user from "Empty Account" to "First Bet Created" in < 60 seconds.*

### 2.1 The Landing (Auth)
* **User Lands:** Sees a minimalist login screen. Black background. Glowing BetMetric Logo.
* **Action:** Enters email/password.
* **System:** Authenticates and redirects to `/dashboard`.

### 2.2 The Zero State Dashboard
* **What they see:** The "Void." An empty black canvas where the Strategy Tree usually lives.
* **The Call to Action (CTA):** A single, pulsating neon button in the center: `[ + Initialize Strategy ]`.
* **Interaction:**
    1.  User clicks `[ + Initialize Strategy ]`.
    2.  **Modal Opens:** "Create Root Bet."
    3.  **Input:** User types "Company Growth 2025" and Budget "$1,000,000".
    4.  **Submit:** The first Node appears on the canvas, glowing Green (because Spend is $0).

---

## 3. Journey 2: The "Morning Coffee" Check (CEO Persona)
*Goal: The daily health check. Find the "Red" signals immediately.*

### 3.1 Dashboard Overview
* **User Lands:** `/dashboard`.
* **Visual Priority:**
    * **Top Bar (KPIs):** "Total Burn" (Red Text), "Runway" (White Text), "Active Bets" (White Text).
    * **Main Canvas (Sankey/Tree):** The user sees the flow of money.
* **The Hook:** The user notices a large **RED** path in the diagram. This represents the "Mobile App Launch" bet.

### 3.2 The Drill Down
* **Action:** User hovers over the Red Node.
* **System Feedback:** A tooltip appears:
    * *Spend: $150k / Budget: $100k (150%)*
    * *Revenue: $0*
    * *Status: Critical*
* **Action:** User **clicks** the Red Node.
* **System Action:** Opens the **Bet Detail Drawer** (slides in from the right).
    * The background blurs slightly.
    * The Drawer shows the "Mini P&L" and a list of recent expenses.

### 3.3 The Investigation (Using AI)
* **Context:** The CEO sees high server costs but doesn't know why.
* **Action:** Clicks the glowing **Escrow Agent** icon (bottom right).
* **Interaction:**
    * User asks: *"Why is the Mobile App over budget?"*
    * **AI Response:** *"The 'Mobile App' bet has logged $40k in 'AWS EC2' charges in the last 7 days, which is 300% higher than the monthly average."*
* **Resolution:** CEO clicks a "Flag for Review" button in the chat. The Node gets a "⚠️" badge on the main dashboard.

---

## 4. Journey 3: The "Evidence" Loop (Product Lead Persona)
*Goal: Input data to prove a bet is profitable.*

### 4.1 Accessing the Ledger
* **User Lands:** `/ledger` (via Sidebar).
* **What they see:** A dense, Bloomberg-style table of rows. High contrast.
    * Columns: Date | Amount | Description | **Bet Tag** | Type.

### 4.2 Logging Revenue
* **Action:** Clicks `[ + Add Transaction ]` (Top Right).
* **Form Modal:**
    * **Type:** Selects "Revenue" (Toggle turns Green).
    * **Amount:** Enters "$25,000".
    * **Bet Tag:** Searchable Dropdown. User types "Mob..." -> Selects "Mobile App Launch".
    * **Description:** "Q3 Enterprise Contract".
* **Submit:** User hits Enter.

### 4.3 The Reward (Feedback Loop)
* **System Action:**
    * Table updates instantly.
    * User navigates back to `/dashboard`.
* **Visual Payoff:** The "Mobile App" node, which was Red, flashes and turns **Green** (or less Red). The user feels a dopamine hit—they have "fixed" the strategy.

---

## 5. Journey 4: The "Dormancy Monitor" (Automated Flow)
*Goal: Reactivating or Decommissioning dead projects.*

### 5.1 The Alert
* **Trigger:** User logs in.
* **Notification:** A small "Bell" icon has a red dot.
* **What they see:** "Dormancy Alert: 'Influencer Campaign' has been inactive for 45 days."

### 5.2 The Decision
* **Action:** User clicks the notification.
* **System Action:** Focuses the Strategy Tree on the specific "Grayed Out" (Dormant) node.
* **Prompt:** A modal appears: *"This bet is Dormant. It ties up $20k in budget. What do you want to do?"*
    * Option A: `[ Revive ]` (Keep Active, reset timer).
    * Option B: `[ Decommission Bet ]` (Mark as Lost, release budget back to Parent).
* **Action:** User clicks `[ Decommission Bet ]`.
* **Visual Feedback:** The Gray Node dissolves (animation), and the Parent Node gets larger (absorbing the released budget).

---

## 6. Interaction Specifications

### 6.1 The "Sankey" Interaction
* **Hover:** Hovering a parent node highlights *all* child paths (downstream).
* **Click:** Clicking a node "locks" the view to that specific branch (zooms in).
* **Right Click:** Opens Context Menu (`Add Child Bet`, `Edit Budget`, `View Ledger`).

### 6.2 The Escrow Chat Widget
* **State: Idle:** A small, floating orb or icon.
* **State: Active:** Expands to a chat window.
* **State: Thinking:** The orb pulses with the "AI Gradient" (Violet/Fuchsia).
* **State: Data Response:** When the AI returns a number (e.g., "$50k"), that number is clickable. Clicking it opens the relevant Ledger view that proves the number.

---

## 7. Wireframe Description (For Implementation)

### Screen: Main Dashboard
```text
+-------------------------------------------------------+
|  [Logo]  [Dashboard] [Ledger] [Settings]      [User]  |  <-- Nav
+-------------------------------------------------------+
|  KPIs: [ Burn: $50k ]  [ Runway: 12m ]  [ ROI: -10% ] |  <-- Header
+-------------------------------------------------------+
|                                                       |
|        [ ROOT: COMPANY ($1M) ]                        |
|               |                                       |
|      +--------+--------+                              |
|      |                 |                              |
| [ GROWTH ]          [ PRODUCT ]                       |
| (Green Flow)        (Red Flow - Alert!)               |
|      |                 |                              |
|   [ Ads ]           [ App ]                           |
|                                                       |
|                                         ( + )         |  <-- FAB (Quick Add)
+-------------------------------------------------------+
|                                        [ AI Chat ]    |  <-- Floating Widget
+-------------------------------------------------------+
