# ClearPath AI — Updated Product Requirements Document
**Product:** ClearPath AI · Total Wireless Intent-Driven Experience
**Client:** Verizon Value / Total Wireless (prepaid segment)
**Version:** 2.0 — Updated after Mar 26, 2026 review session
**Previous version:** `ClearPath_AI_PRD.docx` (v1.0, March 2026)
**Prototype URL:** https://clearpath-ai-pearl.vercel.app/
**Sprint target:** Thu Mar 27 → Mon Mar 30 (Srini review)

**Stakeholders:**
| Name | Role |
|------|------|
| Lam Huynh | Lead Designer / Project Driver — lam.huynh@radiant.digital |
| Srinivas Chamarthi | Client-facing PM, Radiant Digital |
| Shobhit Singh | UX Designer / Prototype Builder |
| Rajat | Client Stakeholder, Verizon Value |
| David Kim (DK) | President, Verizon Value |

---

## What Changed in v2.0

This document supersedes `ClearPath_AI_PRD.docx` for all features related to the
persona-driven iteration. The following table summarises what is new, changed, or
carried forward from v1.0.

| Area | v1.0 Status | v2.0 Change |
|------|------------|-------------|
| Persona dropdown | ❌ Not built | **NEW — Required** |
| Multi-signal surfacing | Single alert | **UPDATED — 3 signals per persona** |
| Sensible defaults | Not specified | **NEW — Required** |
| Diagnostics before upsell | Not specified | **NEW — Required gate** |
| Phone purchase flow | Partial | **UPDATED — 2 entry points + text input** |
| Refill confirmation | Partial | **UPDATED — explicit user permission gate** |
| Mini dashboard | ❌ Not built | Carried forward — still required |
| Processing animation (1.5s) | ❌ Not built | Carried forward — still required |
| iPhone SMS modal | ❌ Not built | Carried forward — still required |
| Persona-specific URLs | ❌ Not built | Carried forward — still required |
| All v1.0 ✅ items | Complete | Preserved — do not regress |

---

## Product Vision (Unchanged)

ClearPath AI is a full replacement of the Total Wireless website experience. It is NOT
a companion feature. The conversational AI interface replaces all traditional navigation.

**Core philosophy:** The customer states their intent in natural language. The AI:
1. Reads what it already knows about them — it never asks what the provider has
2. Diagnoses the problem before recommending anything
3. Always shows the most affordable path first
4. Gets explicit permission before surfacing any upsell or plan change
5. Is transparent about how it makes decisions

---

## Design Tokens (Unchanged)

```
Primary brand:     #CC0000   (Total Wireless red — logo only)
Interaction teal:  #00B5AD   (CTAs, AI bubbles, active states, highlights)
Background:        #F8F9FA   (off-white page background)
Card surface:      #FFFFFF
User bubble:       teal (#00B5AD), right-aligned
AI bubble:         white with border, left-aligned
Success:           #28A745
Warning:           #FFC107
Error:             #DC3545
Font:              Inter (fallback: -apple-system, sans-serif)
Border radius:     12px (cards) · 20px (pills/bubbles) · 8px (inputs)
```

---

## Section 1 — Header

**v1.0 status: ✅ Complete**
**v2.0 change: Add persona dropdown**

### 1.1 Existing requirements (preserved)
- Total Wireless red logo, left-anchored
- EN/ES toggle pill, top-right — EN active by default (teal fill)
- "Maria R." user chip, teal avatar, green online dot
- No traditional nav items (Shop / Deals / Pay / Account)

### 1.2 NEW — Persona Dropdown
**Source:** Lam Huynh meeting, Mar 26 · Email from Lam, Mar 26

A persona selector must be added to the Header. It functions like the persona/role
dropdown used in the BI Fabric prototype (marketer / admin pattern).

**Requirements:**
- Dropdown appears in the Header alongside the user chip
- Lists all 8 personas by name with a one-line hint describing their scenario
- Format: `[Name] — [intent hint]` e.g. "Maria R. — Running out of data"
- Selecting a persona updates the entire app state: dashboard, signals, intent pills,
  conversation context, and URL param
- The hint text tells the reviewer what user flow to expect before they select it
- Default on load: Maria R. (us-001) unless a URL param overrides

**Persona list for dropdown:**

| ID | Display name | Hint shown in dropdown |
|----|-------------|----------------------|
| us-001 | Maria R. | Running out of data — plan renews in 14 days |
| us-002 | Carlos M. | Plan expires in 2 days |
| us-003 | Priya S. | Ready to pay — has 1,020 Rewards Points |
| us-004 | James T. | New customer — activating SIM |
| us-005 | Angela K. | Connectivity issues — called support 5× this month |
| us-006 | Derek W. | Hit data cap 3 months in a row |
| us-007 | Ana G. | International caller — Colombia |
| us-008 | Robert L. | Comparing plans — 4-line family |

### 1.3 Acceptance criteria — Header

| # | Requirement | Priority |
|---|-------------|----------|
| A1 | Total Wireless red logo, left-anchored | P1 |
| A2 | EN/ES toggle pill, top-right | P1 |
| A3 | EN active by default (teal fill) | P1 |
| A4 | User chip with name, teal avatar, green dot | P1 |
| A5 | No traditional nav items | P1 |
| **A6** | **Persona dropdown renders all 8 personas with hint text** | **P1 NEW** |
| **A7** | **Selecting a persona updates dashboard, signals, pills, and URL** | **P1 NEW** |
| **A8** | **Default persona on load is us-001 (Maria R.) when no URL param present** | **P1 NEW** |

---

## Section 2 — Mini Dashboard

**v1.0 status: ❌ Not built**
**v2.0 change: Updated with signal requirements and persona-specific data**

### 2.1 Requirements
- Compact account widget positioned between the Signal Banner and the Intent Pills grid
- Reads all values from the selected persona's `account` object — never hardcoded
- Shows: data remaining, data total, progress bar (colored by threshold), plan name,
  renewal date

### 2.2 NEW — 3-Signal Composite Display
**Source:** Srinivas feedback, Mar 26 — "put some three messages out"

Each persona's dashboard must surface **exactly 3 intent signals** — not one.
The point is that the AI recognises a composite picture of why someone came in,
not just a single alert.

**Signal severity styling:**
- `critical` — red background/border, urgent icon
- `warning` — amber background/border
- `info` — neutral/blue background/border

**Signal content:** Each signal has a headline and a subtext. Both must match
the text defined in `Assets/personas.js` → `persona.signals[]` exactly.

**Optional — Combined Signal Strength Indicator:**
Consider showing a single composite signal strength icon in the dashboard header
that reflects the highest severity across the 3 active signals. This is a stretch
goal for the Thursday review.

### 2.3 Data meter thresholds
- Green: dataPercent > 50%
- Amber: dataPercent 20–50%
- Red: dataPercent < 20%
- Neutral / empty: dataPercent is null (new customer, us-004 only)

### 2.4 Acceptance criteria — Mini Dashboard

| # | Requirement | Priority |
|---|-------------|----------|
| G1 | Dashboard visible between Signal Banner and pills grid | P1 |
| G2 | Shows data remaining, plan name, renewal/cycle date | P1 |
| G3 | Data meter color matches threshold (green/amber/red/neutral) | P1 |
| **G4** | **Exactly 3 intent signals rendered per persona — not 1, not 2** | **P1 NEW** |
| **G5** | **Signal severity styling correct (critical/warning/info)** | **P1 NEW** |
| **G6** | **Signal text matches personas.js exactly — no paraphrasing** | **P1 NEW** |
| **G7** | **Empty state renders correctly for us-004 (no meter, no plan, no renewal)** | **P1 NEW** |

---

## Section 3 — Intent Pills

**v1.0 status: ✅ Complete (generic pills)**
**v2.0 change: Pills must be personalized per persona**

### 3.1 Requirements
- 8 pills in a 2×4 grid — this layout is unchanged
- **NEW:** Pill labels must be driven by the selected persona's `suggestedActions[]`
  in `personas.js` — not generic hardcoded labels
- Each persona has different pills reflecting their specific context and urgency
- Every persona must include at least one "Show me everything" or equivalent direct-access
  escape pill that bypasses the diagnostic flow

### 3.2 Escape hatch rule
**Source:** Lam Huynh meeting — "don't force them down that path"

If a customer knows exactly what they want (e.g. "I want to see all your phones"),
tapping a direct pill must show a gallery/list immediately — no diagnosis required.
The AI should never gate a direct request behind a series of questions.

### 3.3 Acceptance criteria — Intent Pills

| # | Requirement | Priority |
|---|-------------|----------|
| B5 | Exactly 8 intent pills in a 2×4 grid | P1 |
| **B6** | **Pills rendered from persona.suggestedActions — not hardcoded** | **P1 NEW** |
| **B7** | **Each persona has an escape-hatch pill for direct access** | **P1 NEW** |
| C5 | Pills translate correctly in ES mode | P1 |

---

## Section 4 — Conversational Flow

**v1.0 status: ⚠️ Partially complete**
**v2.0 change: Significant new rules around question gating, defaults, and diagnostics**

### 4.1 Clarifying question before recommendation (PRD red check — E4)
**Preserved from v1.0, now more precisely specified**

The AI must ask at least one clarifying question before surfacing any recommendation
card, plan card, refill card, or upsell CTA. This is a hard gate — not optional.

### 4.2 NEW — Sensible defaults with confirmation
**Source:** Lam Huynh meeting + email, Mar 26

The AI must never ask the customer to provide information the provider already has.
Before asking any question, the AI must first check: *would Total Wireless know this?*
If yes — present the known value as a default and let the customer confirm or correct.

**Examples:**
```
✗  AI: "How much data does your plan include?"
✓  AI: "I can see you're on Total Base 5G — 5 GB per month. Does that sound right?"

✗  AI: "How often does this happen?"
✓  AI: "I can see this has happened 11 of the last 12 months. So you're a regular here."

✗  AI: "What phone do you have?"
✓  AI: "You're currently on a Samsung Galaxy A14 — want me to use that as the starting
        point, or do you have something else in mind?"
```

**What the system knows (and must use):**
- Current plan name and price
- Data remaining and total
- Renewal date and days until renewal
- Device on file and storage used
- Historical usage patterns (cap hits, support calls, international calls)
- Saved payment method (last 4 digits)
- Rewards points balance
- AutoPay enrollment status

### 4.3 NEW — Diagnostics before upsell (gate)
**Source:** Lam Huynh meeting + Srinivas + email, Mar 26

For any support or troubleshooting intent, the AI must attempt diagnostic steps
and offer self-fix options **before** surfacing any upgrade, plan change, or paid
add-on. The order is fixed:

```
1. Acknowledge the problem using known account data
2. Check for network outage (API call — silent, then present result)
3. Walk through self-fix checklist (restart, APN reset, SIM re-seat)
4. If resolved → end flow
5. If not resolved → AI asks: "Do you want me to show you plan options that
   might fix this?" ← explicit permission required
6. Only after yes → show plan cards
```

This gate applies to: connectivity issues, slow data, dropped calls, and any
support-category intent. It does **not** apply to direct-intent flows (e.g. a customer
who explicitly says "I want to upgrade" bypasses the diagnosis).

### 4.4 NEW — Ask permission before any upsell
**Source:** Lam Huynh meeting + email, Mar 26 — "ask before initiating any upsell"

No plan card, refill CTA, or upgrade card may appear in the conversation thread
without the customer selecting an option that explicitly leads to it. The AI must
always offer the choice and wait for a "yes" — not auto-surface.

**Examples of correct permission gate:**
```
AI: "We've tried everything to fix your connection. Would you like me to
     show you plans that include Wi-Fi Calling? That sometimes resolves
     persistent signal issues."
QUICK REPLIES: [ Yes, show me ] [ No, try something else ]

AI: "Based on your usage, I can show you plans that would stop this from
     happening every month. Want to see them?"
QUICK REPLIES: [ Yes ] [ Not right now ]
```

### 4.5 Conversation UI rules (unchanged from v1.0)
- Landing content animates upward — no hard jump
- User messages: right-aligned teal bubble
- AI messages: left-aligned with ClearPath AI label
- 2–3 quick reply pills appear after every AI response
- Input bar stays fixed at bottom throughout

### 4.6 Acceptance criteria — Conversational Flow

| # | Requirement | Priority |
|---|-------------|----------|
| E1 | Landing content animates upward smoothly | P1 |
| E2 | User message: right-aligned teal bubble | P1 |
| E3 | AI message: left-aligned with ClearPath AI label | P1 |
| **E4** | **AI asks clarifying question BEFORE any recommendation/CTA — hard gate** | **P1 RED** |
| E5 | 2–3 quick reply pills after AI response | P1 |
| E6 | Input bar fixed at bottom throughout | P1 |
| **E7** | **AI never asks about info the provider already has — uses sensible defaults** | **P1 NEW** |
| **E8** | **Diagnostics gate fires before any upsell in support flows** | **P1 NEW** |
| **E9** | **AI asks explicit permission before surfacing any plan card or upsell CTA** | **P1 NEW** |

---

## Section 5 — Payment & Confirmation Flow

**v1.0 status: ❌ Not built**
**v2.0 change: Refill flow now requires explicit confirmation step before CTA appears**

### 5.1 NEW — Refill confirmation gate
**Source:** Lam Huynh + Srinivas meeting + email, Mar 26

Before the Quick Refill card or any refill CTA is presented, the AI must ask
the customer which path they want. This is especially important when account data
shows a recurring pattern.

**When data shows recurring cap hits:**
```
AI: "I can see you've run out of data 11 of the last 12 months.
     Would you like a one-time refill to get through this cycle,
     or would a plan change make more sense long-term?"
QUICK REPLIES: [ Quick refill — $15 ] [ Look at plan options ] [ Not right now ]
```

**When data shows a one-time or less-clear pattern:**
```
AI: "Want me to add data to your account right now, or would you prefer
     to look at other options first?"
QUICK REPLIES: [ Add data now ] [ Show me options ] [ Never mind ]
```

### 5.2 Processing animation (carried from v1.0)
- CTA click triggers minimum 1.5-second processing animation
- Must not flash through even if API responds faster
- If processing exceeds 5 seconds: show "Still working — this is taking longer than usual"

### 5.3 iPhone SMS modal (carried from v1.0)
- Appears after every successful transaction (refill, plan change, add-on purchase)
- iPhone frame with Dynamic Island at top center
- Green SMS bubble — NOT blue iMessage
- Message text: confirms action, data added, expiry date
- Backdrop blur behind modal
- X button dismisses
- Caption below frame: "Confirmation sent to your phone on file."

### 5.4 Acceptance criteria — Payment Flow

| # | Requirement | Priority |
|---|-------------|----------|
| **F0** | **AI asks permission / confirms intent before presenting any refill CTA** | **P1 NEW** |
| F1 | Recommendation card renders inline in conversation | P1 |
| F2 | Card shows: plan name, price, CTA label | P1 |
| **F3** | **CTA click shows minimum 1.5s processing animation — timed** | **P1 RED** |
| **F4** | **Success message appears in conversation after processing** | **P1 RED** |
| **F5** | **iPhone SMS modal: Dynamic Island, green bubble, correct text, backdrop blur** | **P1 RED** |
| **F6** | **Modal X button dismisses cleanly** | **P1 RED** |
| **F7** | **Caption: "Confirmation sent to your phone on file."** | **P1 RED** |

---

## Section 6 — Phone Purchase Flow

**v1.0 status: Partial**
**v2.0 change: Two entry points, surface device data from account, accept free-text input**

### 6.1 NEW — Two entry points
**Source:** Lam Huynh meeting, Mar 26 — "don't force them down that path"

When a customer says "I need a new phone" or taps a phone-related pill, the AI must
immediately offer **two paths** — not funnel them through diagnosis:

```
AI: "Happy to help. Do you already know what you're looking for,
     or would you like help figuring it out?"

QUICK REPLIES:
[ Show me all your phones ]         ← opens full phone gallery immediately
[ Help me figure out what I need ]  ← starts guided flow
```

The "Show me all your phones" path must open a gallery view directly. No questions
asked first.

### 6.2 NEW — Surface device data from account
**Source:** Lam Huynh meeting, Mar 26

When entering the phone purchase flow, the AI must open by surfacing the customer's
current device from `persona.account.device` and `persona.account.deviceStorage`:

```
AI: "You're currently on a Samsung Galaxy A14 (128 GB, 112 GB used).
     Want to use that as a starting point, or do you have a
     specific phone in mind?"
```

### 6.3 NEW — Accept free-text and pasted URL
**Source:** Lam Huynh meeting + Srinivas, Mar 26

The input bar must accept:
- Free-text description: "I want an iPhone, blue color, 256 GB"
- Pasted product URL: system extracts model from URL and confirms
- Natural language spec: "something like my current phone but with more storage"

The AI must respond to specific requests immediately — not deflect to a questionnaire.

### 6.4 Acceptance criteria — Phone Purchase Flow

| # | Requirement | Priority |
|---|-------------|----------|
| **P1** | **Two entry points: "Show me all phones" (direct gallery) and guided flow** | **P1 NEW** |
| **P2** | **Current device specs surfaced from account at flow start** | **P1 NEW** |
| **P3** | **Free-text phone description accepted as valid input** | **P1 NEW** |
| **P4** | **"Show me all phones" opens gallery immediately — no questions first** | **P1 NEW** |
| **P5** | **Pasted URL or specific model description handled without redirection** | **P2 NEW** |

---

## Section 7 — Persona-Specific URLs

**v1.0 status: ❌ Not built**
**v2.0 change: Expanded from 3 personas to all 8, with full account state per persona**

### 7.1 URL routing
All URL formats below must resolve to the correct persona:

| URL format | Resolves to |
|-----------|-------------|
| `?persona=maria` | us-001 Maria R. |
| `?user=1` | us-001 Maria R. |
| `?persona=us-001` | us-001 Maria R. |
| `?persona=us-006` | us-006 Derek W. |
| `?persona=us-007` | us-007 Ana G. |
| `?persona=derek` | us-006 Derek W. |
| `?persona=ana` | us-007 Ana G. |
| *(no param)* | us-001 Maria R. (default) |

Full alias mapping defined in `Assets/personas.js` → `getPersonaFromURL()`.

### 7.2 Priority for demo polish

| Priority | Persona | Reason |
|---------|---------|--------|
| P1 — Fully polished | us-001 Maria R. | Core refill flow — most common use case |
| P1 — Fully polished | us-002 Carlos M. | Expiry urgency flow |
| P1 — Fully polished | us-003 Priya S. | Rewards redemption flow |
| P1 — Fully polished | us-006 Derek W. | Smart upsell flow |
| P2 — Polished | us-007 Ana G. | International add-on flow |
| P3 — Walkable | us-005 Angela K. | Support/diagnostics flow |
| P3 — Walkable | us-008 Robert L. | Plan comparison flow |
| P3 — Present | us-004 James T. | Activation flow |

### 7.3 Acceptance criteria — Persona URLs

| # | Requirement | Priority |
|---|-------------|----------|
| H1 | `?persona=maria` loads Maria R. account state (us-001) | P1 |
| H2 | `?persona=us-006` loads Derek W. account state | P1 |
| H3 | `?persona=us-007` loads Ana G. account state | P1 |
| **H4** | **All 8 persona URL aliases resolve correctly** | **P1 NEW** |
| **H5** | **No-param default loads us-001 (Maria R.)** | **P1 NEW** |
| **H6** | **Persona dropdown selection updates URL param** | **P2 NEW** |

---

## Section 8 — Language Toggle (EN / ES)

**v1.0 status: ✅ Complete**
**v2.0 change: None — preserved, do not regress**

| # | Requirement |
|---|-------------|
| C1 | ES pill becomes teal/active on click |
| C2 | Headline translates: "Cuéntanos qué está pasando. Nosotros nos encargamos del resto." |
| C3 | Subhead contains "Soy ClearPath AI" |
| C4 | Signal banner CTA: "Recarga Rápida" |
| C5 | Pills translate: "Mi internet está lento", "Me quedo sin datos", "Quiero gastar menos" |
| C6 | Trust banner: "ClearPath AI \| Cómo funciona" |
| C7 | Input placeholder: "Escribe tu mensaje..." |

---

## Section 9 — Trust Banner & Transparency Panel

**v1.0 status: ✅ Complete**
**v2.0 change: None — preserved, do not regress**

| # | Requirement |
|---|-------------|
| D1 | Side drawer slides in from right on trust banner click |
| D2 | Panel header: "Why ClearPath AI exists" |
| D3 | At least 4 numbered rules visible |
| D4 | A rule mentions understanding the problem before recommending |
| D5 | A rule mentions showing the lowest-cost option first |

---

## Full Acceptance Criteria — Master Checklist

Status key: `✅ Complete` · `⚠️ Partial` · `❌ Not built` · `🆕 New in v2.0`

### Header
| ID | Requirement | Status |
|----|-------------|--------|
| A1 | Total Wireless red logo, left-anchored | ✅ |
| A2 | EN/ES toggle pill, top-right | ✅ |
| A3 | EN active by default (teal fill) | ✅ |
| A4 | User chip: name, teal avatar, green dot | ✅ |
| A5 | No traditional nav items | ✅ |
| A6 | Persona dropdown with 8 entries + hint text | 🆕 ❌ |
| A7 | Selecting persona updates full app state + URL | 🆕 ❌ |
| A8 | Default persona on load = us-001 | 🆕 ❌ |

### Mini Dashboard & Signals
| ID | Requirement | Status |
|----|-------------|--------|
| G1 | Dashboard between Signal Banner and pills grid | ❌ |
| G2 | Shows data remaining, plan name, renewal date | ❌ |
| G3 | Data meter color: green/amber/red/neutral thresholds | ❌ |
| G4 | Exactly 3 intent signals per persona | 🆕 ❌ |
| G5 | Signal severity styling (critical/warning/info) | 🆕 ❌ |
| G6 | Signal text matches personas.js exactly | 🆕 ❌ |
| G7 | Empty state for us-004 (no meter, no plan) | 🆕 ❌ |

### Landing Screen
| ID | Requirement | Status |
|----|-------------|--------|
| B1 | ClearPath AI logo centered (teal sparkle + wordmark) | ✅ |
| B2 | Headline: "Tell us what's going on. We'll figure out the rest." | ✅ |
| B3 | Subhead contains "Hi. I am ClearPath AI" and "most affordable path first" | ✅ |
| B4 | Signal banner (bold headline + subtext + CTA) | ✅ |
| B5 | Exactly 8 intent pills in 2×4 grid | ✅ |
| B6 | Pills driven by persona.suggestedActions — not hardcoded | 🆕 ❌ |
| B7 | Escape-hatch pill present on every persona | 🆕 ❌ |
| B8 | Trust banner fixed bottom-right | ✅ |
| B9 | Fixed chat input bar at bottom | ✅ |

### Language Toggle
| ID | Requirement | Status |
|----|-------------|--------|
| C1–C7 | Full EN/ES translation (all checks) | ✅ |

### Transparency Panel
| ID | Requirement | Status |
|----|-------------|--------|
| D1–D5 | Transparency panel (all checks) | ✅ |

### Conversational Flow
| ID | Requirement | Status |
|----|-------------|--------|
| E1 | Landing content animates upward | ✅ |
| E2 | User bubble: right-aligned teal | ✅ |
| E3 | AI bubble: left-aligned with label | ✅ |
| E4 | 🔴 Clarifying question BEFORE any recommendation — hard gate | ⚠️ |
| E5 | 2–3 quick reply pills after AI response | ✅ |
| E6 | Input bar fixed at bottom throughout | ✅ |
| E7 | AI never asks what provider already knows — sensible defaults | 🆕 ❌ |
| E8 | Diagnostics gate before any upsell in support flows | 🆕 ❌ |
| E9 | Explicit permission required before plan card / upsell CTA appears | 🆕 ❌ |

### Payment & Confirmation
| ID | Requirement | Status |
|----|-------------|--------|
| F0 | AI asks intent confirmation before presenting refill CTA | 🆕 ❌ |
| F1 | Recommendation card renders inline | ⚠️ |
| F2 | Card shows plan name, price, CTA | ⚠️ |
| F3 | 🔴 CTA click → 1.5s processing animation minimum | ❌ |
| F4 | 🔴 Success message in conversation after processing | ❌ |
| F5 | 🔴 iPhone SMS modal: Dynamic Island, green bubble, correct text, blur | ❌ |
| F6 | 🔴 Modal X button dismisses | ❌ |
| F7 | 🔴 Caption: "Confirmation sent to your phone on file." | ❌ |

### Phone Purchase Flow
| ID | Requirement | Status |
|----|-------------|--------|
| P1 | Two entry points: direct gallery + guided flow | 🆕 ❌ |
| P2 | Current device specs surfaced from account | 🆕 ❌ |
| P3 | Free-text phone description accepted as input | 🆕 ❌ |
| P4 | "Show me all phones" → gallery immediately, no questions | 🆕 ❌ |
| P5 | Pasted URL or model name handled directly | 🆕 ❌ |

### Persona URLs
| ID | Requirement | Status |
|----|-------------|--------|
| H1 | ?persona=maria → us-001 | ❌ |
| H2 | ?persona=us-006 → us-006 | ❌ |
| H3 | ?persona=us-007 → us-007 | ❌ |
| H4 | All 8 persona URL aliases resolve correctly | 🆕 ❌ |
| H5 | No-param default → us-001 | 🆕 ❌ |
| H6 | Persona dropdown selection updates URL param | 🆕 ❌ |

---

## Implementation References

The following files in `Assets/` expand on this PRD for implementation:

| File | Purpose |
|------|---------|
| `Assets/personas.js` | Data structure for all 8 personas — account data, signals, actions |
| `Assets/persona-flows.md` | Full conversation flow scripts for all 8 personas — every branch |
| `Assets/dev-agent.md` | Developer Agent workflow — how to implement against this PRD |
| `Assets/qa-agent.md` | QA Agent workflow — how to verify against this PRD |
| `Assets/tasklist.md` | Shared dev/QA task log — live status of all 20 implementation tasks |

---

## Timeline

| Date | Milestone |
|------|-----------|
| Thu Mar 26 | PRD v2.0 complete · Assets folder ready · Dev agent starts |
| Thu Mar 27 | Initial build pass on P1 personas (us-001, us-002, us-003, us-006) |
| Thu Mar 27 (EOD) | Lam review — Thu or Fri |
| Fri Mar 28 | QA pass · Fixes · Second Lam review if needed |
| Mon Mar 30 | Srini review — final iteration before client demo |

---

## What NOT to Change

- The Total Wireless red (`#CC0000`) is brand-locked — logo only
- Do not add traditional nav items back
- Do not add more than 2 language options or change toggle to a dropdown
- The AI must never recommend a more expensive plan without first acknowledging
  the customer's stated problem
- All ✅ Complete items from v1.0 must be preserved — do not regress

---

*ClearPath AI · PRD v2.0 · Radiant Digital · March 2026*
*Supersedes ClearPath_AI_PRD.docx (v1.0)*
