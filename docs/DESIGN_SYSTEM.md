# DESIGN SYSTEM SPECIFICATION: BetMetric
**Version:** 1.0
**Aesthetic Inspiration:** Modern Dark Mode Fintech, High-Fidelity Data Viz, "Neon on Void."

---

## 1. Brand Philosophy & Voice

### 1.1 The Vibe
BetMetric is a financial control tower. It is not playful, cute, or chatty. It is a serious tool for serious executives.
* **Keywords:** Authoritative, Precise, Futuristic, High-Signal, Deep Tech.
* **The Metaphor:** The interface should feel like looking at the instrument panel of an advanced spacecraft. It is dark, the data glows, and everything has a purpose.

### 1.2 Design Principles
1.  **The Void is Canvas:** The default state is total darkness. Light is only introduced by data. If it doesn't represent value or action, it shouldn't be lit.
2.  **Data is Bioluminescent:** Financial flows shouldn't just be colored shapes; they should appear to emit their own light, glowing against the dark background (like the example image).
3.  **Fluidity over Rigidity:** While the layout grid is strict, the data visualizations within it should feel organic and fluid (e.g., curved Sankey paths vs. blocky bar charts).
4.  **Density without Clutter:** We cater to power users (CEOs). We prefer high data density (a lot of information on one screen) achieved through clean typography and spacing, rather than spreading data across many pages with lots of whitespace.

---

## 2. Design Requirements

### 2.1 Functional Design Requirements (FR-D)
| ID | Requirement | Description |
| :--- | :--- | :--- |
| **FR-D-01** | **Dark Mode Default** | The application must launch in dark mode. There is no light mode in MVP. |
| **FR-D-02** | **Semantic Color Coding** | Financial data must strictly adhere to semantic color rules: Green for positive cash flow/profit, Red/Orange for negative cash flow/burn. |
| **FR-D-03** | **Fluid Visualization** | The primary visualization for strategy flow must use fluid connectors (Sankey diagrams or curved lines), not sharp angles. |
| **FR-D-04** | **Dormant State Visuals** | Inactive "Dormant" bets must visually decay—becoming desaturated, ghostly, or semi-transparent. |

### 2.2 Non-Functional Design Requirements (NFR-D)
| ID | Requirement | Description |
| :--- | :--- | :--- |
| **NFR-D-01** | **Contrast Accessibility** | Despite the neon aesthetic, text contrast must meet WCAG AA standards (4.5:1 for normal text). Neon colors should be used for graphic elements, not primary reading text. |
| **NFR-D-02** | **Performance V-Sync** | Data visualizations (like chart animations) must run smoothly at 60fps. Janky animations break the "premium" illusion. |
| **NFR-D-03** | **Eye Strain Reduction** | Avoid pure white (`#FFFFFF`) text on pure black (`#000000`) backgrounds for long reading blocks, as this causes halation/vibration. Use off-white. |

---

## 3. Foundations: Color System
*Implement these exact hex codes into the Tailwind configuration.*

### 3.1 The Void (Backgrounds)
We do not use a single flat black. We use layers of depth.
| Token | Value | Usage |
| :--- | :--- | :--- |
| `bg-void` | `#050505` | The deepest background layer (the "app body"). |
| `bg-surface-100` | `#121212` | Cards, sidebars, elevated surfaces. |
| `bg-surface-200` | `#1E1E1E` | Modals, dropdowns, hover states. |
| `border-subtle` | `#27272a` | Subtle dividers between dark elements. |

### 3.2 The Data Glow (Semantic Gradients)
Data is rarely solid; it should have a gradient flow.
| Semantic | Gradient Start | Gradient End | Usage |
| :--- | :--- | :--- | :--- |
| **Profit / Flow (Success)** | `#22c55e` (Green-500) | `#86efac` (Green-300) | Positive ROI, incoming revenue flows. |
| **Burn / Loss (Danger)** | `#ef4444` (Red-500) | `#f97316` (Orange-500) | Negative ROI, expense flows, critical alerts. |
| **Stagnant (Dormant)** | `#64748b` (Slate-500) | `#94a3b8` (Slate-400) | Inactive bets, unallocated funds. |
| **AI (The Agent)** | `#8b5cf6` (Violet-500)| `#d946ef` (Fuchsia-500) | The Escrow Agent interface elements. |

### 3.3 Typography Colors
| Token | Value | Usage |
| :--- | :--- | :--- |
| `text-primary` | `#F8FAFC` (Slate-50) | Main headers, key financial figures. |
| `text-secondary` | `#94A3B8` (Slate-400)| Labels, secondary data, descriptions. |
| `text-tertiary` | `#64748B` (Slate-500)| Placeholder text, subtle metadata. |

---

## 4. Foundations: Typography
**Font Family:** **Inter** (or alternatives like *Geist Sans* or *San Francisco*).
**Style:** Neo-grotesque, clean, highly legible numbers.

### 4.1 Scale & Weight
We rely on font weight to create hierarchy, rather than dramatic size differences.

| Role | Size / Line Height | Weight | Example Usage |
| :--- | :--- | :--- | :--- |
| **Metric Hero** | 36px / 40px | Bold (700) | The main "$1.2M Burn" figure on a dashboard. |
| **H1 (Page Title)**| 24px / 32px | Semibold (600)| "Strategy Overview" |
| **H2 (Card Title)**| 18px / 28px | Medium (500) | "Q3 Marketing Bet" |
| **Body Default** | 14px / 20px | Regular (400) | Standard descriptions. |
| **Caption/Label**| 12px / 16px | Medium (500) | Axis labels, metadata tags. |

---

## 5. Components & Patterns

### 5.1 Data Visualization (The Hero Element)
This is the most critical part of the BetMetric brand.
* **Sankey Diagrams over Pie Charts:** As seen in the inspiration image, use Sankey diagrams to show the flow of money from origin -> bet -> outcome.
* **Gradients follow flow:** The color of a flow path should be a horizontal gradient from left to right, enhancing the feeling of movement.
* **Minimal Axes:** Remove gridlines and obtrusive axis labels on charts. Let the data shape speak for itself. Use tooltips for precise values.

### 5.2 Cards & Containers
* **Corner Radius:** Moderately rounded (`rounded-lg` or `12px`). Softens the harshness of the dark UI.
* **Borders vs. Shadows:** Do not use drop shadows to create depth (they look muddy in dark mode). Use subtle 1px borders (`border-subtle`) or slightly lighter background colors (`bg-surface-100`) to define edges.

### 5.3 The Escrow Agent (Chat UI)
* Should feel distinct from the rest of the dashboard.
* Use the **Violet/Fuchsia gradient** for its presence icon and user input highlights to indicate "AI Magic."
* Responses should type out like a retro terminal, but faster.

### 5.4 Dormancy States
* When a Bet node is flagged as "Dormant":
    * Desaturate its colors to grayscale/slate.
    * Reduce opacity to 60%.
    * Add a subtle "pulse" animation on the border to draw negative attention.

---

## 6. Implementation Summary (Tailwind CSS Config)
*A quick reference for the developer setup.*

```javascript
// tailwind.config.js snippet
theme: {
  colors: {
    // The Void
    void: '#050505',
    surface: {
      100: '#121212',
      200: '#1E1E1E',
    },
    // Typography
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    // Semantic (Use as gradient stops)
    profit: { start: '#22c55e', end: '#86efac' },
    burn: { start: '#ef4444', end: '#f97316' },
    ai: { start: '#8b5cf6', end: '#d946ef' },
  },
  fontFamily: {
    sans: ['Inter', 'sans-serif'],
  }
}
