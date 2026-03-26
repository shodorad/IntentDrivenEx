# ClearPath AI — Claude Code Project Context

This file gives Claude Code persistent context about the ClearPath AI prototype.
Read this before making any changes to the codebase.

---

## What This Project Is

ClearPath AI is a full site replacement for Total Wireless (Verizon Value).
It is NOT a chatbot companion sitting alongside the existing website — it IS the website.

Core design philosophy: **Intent-Driven Experience (IDE)**
- Customer states their intent in natural language ("I run out of data")
- AI finds the most affordable solution first — no upsells, no confusion
- Traditional nav (Shop, Deals, Pay, Account) is completely removed
- The conversation IS the UI

Live prototype URL: `https://clearpath-ai-pearl.vercel.app/`

---

## Design System Tokens

```
Primary brand:     #CC0000  (Total Wireless red — logo only)
Interaction teal:  #00B5AD  (active states, CTAs, AI bubbles, highlights)
Background:        #F8F9FA  (off-white page background)
Card surface:      #FFFFFF
User bubble:       teal (#00B5AD), right-aligned
AI bubble:         white with border, left-aligned
Success:           #28A745
Warning:           #FFC107
Error:             #DC3545
Font:              Inter (system fallback: -apple-system, sans-serif)
Border radius:     12px (cards), 20px (pills/bubbles), 8px (inputs)
```

---

## Key Components and Where They Live

When Claude Code needs to edit something, look here first:

| PRD Feature | Likely component path |
|-------------|----------------------|
| Header (logo + EN/ES toggle + user chip) | `components/Header.jsx` or `components/layout/Header.jsx` |
| Landing screen (hero + subhead) | `components/Landing.jsx` or `pages/index.jsx` |
| Signal banner | `components/SignalBanner.jsx` or inside `Landing.jsx` |
| Intent pills grid | `components/IntentPills.jsx` or `components/PillGrid.jsx` |
| Conversational flow / chat | `components/Chat.jsx`, `components/ConversationFlow.jsx`, or `components/ChatInterface.jsx` |
| Recommendation card | `components/RecommendationCard.jsx` or `components/PlanCard.jsx` |
| Payment / confirmation flow | `components/PaymentFlow.jsx`, `components/ConfirmationModal.jsx` |
| iPhone SMS modal | `components/IphoneModal.jsx`, `components/SMSConfirmation.jsx` |
| Trust banner | `components/TrustBanner.jsx` or `components/TrustPanel.jsx` |
| Transparency panel (drawer) | `components/TransparencyPanel.jsx` or `components/SideDrawer.jsx` |
| Mini dashboard / account widget | `components/MiniDashboard.jsx` or `components/AccountWidget.jsx` |
| Language toggle logic | `contexts/LanguageContext.jsx`, `hooks/useLanguage.js`, or `i18n/` folder |
| Persona/URL routing | `pages/index.jsx` (URL params) or `middleware.js` |

> If you can't find a component at the exact path, run:
> `find . -name "*.jsx" -o -name "*.tsx" | xargs grep -l "Quick Refill\|intent\|ClearPath" | head -20`
> to locate the relevant files.

---

## PRD Acceptance Criteria (Single Source of Truth)

These are the 30 checks the prototype must pass. Grouped by feature area.

### A: Header
- **A1** Total Wireless red logo, left-anchored
- **A2** EN/ES toggle pill, top-right
- **A3** EN active by default (teal fill)
- **A4** "Maria R." user chip, teal avatar, green online dot
- **A5** No traditional nav items (Shop / Deals / Pay / Account)

### B: Landing Screen
- **B1** ClearPath AI logo centered (teal sparkle + wordmark)
- **B2** Headline: `"Tell us what's going on. We'll figure out the rest."`
- **B3** Subhead contains `"Hi. I am ClearPath AI"` and `"most affordable path first"`
- **B4** Signal banner (bold headline + subtext + CTA button)
- **B5** Exactly 8 intent pills in a 2×4 grid
- **B6** Trust banner fixed bottom-right: `"ClearPath AI | How this works"`
- **B7** Fixed chat input bar at bottom: `"Type your message..."`

### C: Language Toggle (EN → ES)
- **C1** ES pill becomes teal/active on click
- **C2** Headline: `"Cuéntanos qué está pasando. Nosotros nos encargamos del resto."`
- **C3** Subhead contains `"Soy ClearPath AI"`
- **C4** Signal banner CTA: `"Recarga Rápida"`
- **C5** Pills translate: `"Mi internet está lento"`, `"Me quedo sin datos"`, `"Quiero gastar menos"`
- **C6** Trust banner: `"ClearPath AI | Cómo funciona"`
- **C7** Input placeholder: `"Escribe tu mensaje..."`

### D: Transparency Panel
- **D1** Side drawer slides in from right on trust banner click
- **D2** Panel header: `"Why ClearPath AI exists"`
- **D3** At least 4 numbered rules visible
- **D4** A rule mentions understanding the problem before recommending
- **D5** A rule mentions showing the lowest-cost option first

### E: Conversational Flow
- **E1** Landing content animates upward (no hard jump)
- **E2** User message: right-aligned teal bubble
- **E3** AI message: left-aligned with ClearPath AI label
- **E4** 🔴 AI asks a clarifying question BEFORE showing any recommendation or CTA
- **E5** 2–3 quick reply pills appear after AI response
- **E6** Input bar stays fixed at bottom throughout

### F: Payment Confirmation Flow
- **F1** Recommendation card renders inline in conversation
- **F2** Card shows: plan name (`Total Base 5G`), price (`$15.00`), CTA (`Continue — $15`)
- **F3** 🔴 Clicking CTA shows ~1.5s processing animation (spinner or pulse)
- **F4** 🔴 Success message appears in conversation after processing
- **F5** 🔴 iPhone SMS modal appears with:
  - iPhone frame with Dynamic Island at top
  - Green SMS bubble (not blue iMessage)
  - Message text: refill confirmed, data added, expiry date
  - Backdrop blur behind modal
- **F6** Modal has X button to dismiss
- **F7** Caption: `"Confirmation sent to your phone on file."`

### G: Mini Dashboard
- **G1** Compact account widget visible between signal banner and pills grid
  - Shows: data remaining, plan name, renewal/cycle date

### H: Persona URLs
- **H1** At least one of these loads a different account state:
  - `?persona=maria` / `?user=1` / `/us-001`
  - Account states: US-001 (low data, urgent), US-006 (at cap, upsell candidate), US-007 (international calling)

---

## Implementation Notes Per Critical Check

### E4 — Clarifying question before recommendation
The AI must ask at least one follow-up before surfacing a plan card.
```js
// In the chat state machine, add a "clarifying" step before "recommendation"
// Example clarifying questions:
// "Does this happen most months, or is this a one-time thing?"
// "Are you looking to add data now, or change your plan?"
// Show 2–3 quick reply chips after the clarifying question.
```

### F3–F7 — Processing animation + iPhone SMS modal
```jsx
// onClick handler for "Continue — $15":
// 1. Set state: processing = true
// 2. After 1500ms: processing = false, showSuccess = true, showIphoneModal = true
// iPhone modal:
//   - Fixed overlay, z-index: 9999, backdrop blur
//   - iPhone SVG/div with Dynamic Island notch at top center
//   - Green (#28A745) SMS bubble (NOT blue)
//   - Text: "Your Total Wireless account has been refilled. 5GB added. Valid through [date+30d]."
//   - X button top-right dismisses modal
//   - Caption below frame (outside iPhone): "Confirmation sent to your phone on file."
```

### G1 — Mini Dashboard
```jsx
// Insert between <SignalBanner /> and <PillGrid /> in Landing.jsx:
// <MiniDashboard
//   dataRemaining="0.8 GB"
//   dataTotal="5 GB"
//   planName="Total Base 5G"
//   renewalDate="Apr 9, 2026"
// />
// Style: compact card, 1 row, teal progress bar for data, small text
```

### H1 — Persona URLs
```js
// In pages/index.jsx (or middleware):
const params = new URLSearchParams(window.location.search);
const persona = params.get('persona') || params.get('user');
const PERSONAS = {
  'maria': { name: 'Maria R.', dataRemaining: '0.8 GB', plan: 'Total Base 5G', urgency: 'high' },
  '1':     { name: 'Maria R.', dataRemaining: '0.8 GB', plan: 'Total Base 5G', urgency: 'high' },
  'us-006':{ name: 'James T.', dataRemaining: '0 GB',   plan: 'Total Base 5G', urgency: 'upsell' },
  'us-007':{ name: 'Ana G.',   dataRemaining: '3.2 GB', plan: 'Total Connect', urgency: 'international' },
};
```

---

## Dev Commands

```bash
npm run dev        # Start local dev server
npm run build      # Production build
npm run lint       # Lint check
```

Prototype runs on Next.js (likely). Check `package.json` to confirm framework.

---

## What NOT to Change

- The Total Wireless red (`#CC0000`) is brand-locked — only use it for the logo
- Do not add back any traditional nav items
- The AI must never recommend a more expensive plan without first acknowledging the customer's stated problem
- The EN/ES toggle is a two-state pill — do not add more languages or a dropdown
