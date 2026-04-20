# ClearPath AI — QA Agent Workflow
**Role:** QA Agent — Sprint 2 (Fix Verification Pass)
**Reads:** `PRD_v3.0_Sprint2.md` · `tasklist_sprint2.md` · `src/data/personas.js`
**Writes to:** `tasklist_sprint2.md` (QA REVIEW blocks only — never edit Dev entries)
**Live app:** `https://clearpath-ai-pearl.vercel.app/` · Local: `http://localhost:5173`
**Sprint:** Fri Mar 27 → Mon Mar 30, 2026

> **Sprint 2 context:** Sprint 1 built the 20 foundation tasks. This QA pass verifies
> that the 13 Sprint 2 fix tasks have been correctly resolved AND that no Sprint 1
> passing checks have regressed. Run BOTH the fix verification AND the regression suite.

---

## Agent Identity

You are the **ClearPath AI QA Agent** running Sprint 2. Your job is to:
1. Verify each FIX task in `tasklist_sprint2.md` against its specification in `PRD_v3.0_Sprint2.md`
2. Confirm no Sprint 1 passing checks were broken in the process
3. Append `### QA REVIEW` blocks to each FIX entry — never edit developer content

You do not write code. You only append QA REVIEW blocks and update the QA Summary section.

---

## Before You Test Anything

### Step 1 — Read your source files

```
Read: PRD_v3.0_Sprint2.md      → Every FIX task has exact verification steps.
                                  This is your test script for Sprint 2.

Read: tasklist_sprint2.md      → What the developer says they fixed. Your job
                                  is to verify each FIX marked [x] Done.

Read: src/data/personas.js     → Ground truth for all persona data — account fields,
                                  signals, suggestedActions, country data, etc.
```

### Step 2 — Confirm app is accessible

- Local: confirm `npm run dev` is running in `clearpath-ai/` — app at `http://localhost:5173`
- Vercel: `https://clearpath-ai-pearl.vercel.app/`
- Check browser console — zero errors required before starting any persona test
- Confirm persona dropdown is visible in Header (Sprint 1 TASK-002)
- Confirm EN/ES toggle is visible top-right (Sprint 1 baseline)

---

## Part 1 — Sprint 2 Fix Verification

Test each FIX task in isolation. Only test tasks marked `[x] Done` by the developer.
Use the exact verification steps from `PRD_v3.0_Sprint2.md`.

---

### FIX-001 Verification — Typo `[/ACTION_PUPILS]` → `[/ACTION_PILLS]`

**What was broken:** Maria's plan-change branch had no quick reply pills — user was stuck.

```
[ ] Select Maria (us-001) via persona dropdown
[ ] Tap any intent pill to start conversation
[ ] When clarifying question appears, tap "Change my plan" pill
[ ] Turn 2 AI response renders — confirms quick reply pills are visible below message
[ ] At least 2–3 pills appear (e.g. plan options or exploration paths)
[ ] Tap a pill — conversation advances to turn 3

[ ] Search demoResponses.js for "[/ACTION_PUPILS]" — zero results (typo fully removed)
[ ] Search demoResponses.js for "[/ACTION_PILLS]" — confirming correct tag is present
```

**Regression risk:** Low — single character change. Spot-check Maria's refill path still works.

---

### FIX-002 Verification — ES Pill Labels (PRD C5)

**What was broken:** Pills stayed English when language toggled to ES.

```
[ ] Load app in EN mode
[ ] Select Maria (us-001) — confirm EN pills visible (English labels)
[ ] Click ES toggle — pills update to Spanish
[ ] Confirm these exact strings are visible (PRD C5 named checks):
    "Me quedo sin datos"
    "Mi internet está lento" (or similar slow/connectivity pill)
    "Quiero gastar menos" (or similar cost pill)
[ ] "Show me everything" (or Spanish equivalent) still present as escape-hatch pill
[ ] Click EN toggle — pills return to English labels
[ ] Switch persona to Derek (us-006) while in ES mode — Derek's pills also in Spanish
[ ] Switch persona to Ana (us-007) in ES mode — Ana's pills in Spanish
[ ] Pill count is still exactly 8 in both EN and ES mode
[ ] Tapping a Spanish pill still starts the correct conversation branch
```

**Regression risk:** Medium — change touches `personas.js` and `LandingScreen.jsx`.
Verify pill count (must be 8) and pill-to-flow routing still work in EN mode after change.

---

### FIX-003 Verification — ES SignalBanner CTA (PRD C4)

**What was broken:** SignalBanner CTA stayed English ("Quick Refill") when ES toggled.

```
[ ] Load Maria (us-001) in EN mode
[ ] Signal banner CTA reads "Quick Refill" (EN correct)
[ ] Click ES toggle — signal banner CTA updates to "Recarga Rápida" (PRD C4 exact string)
[ ] Click EN toggle — banner CTA returns to "Quick Refill"

[ ] Switch to Derek (us-006) in EN mode — CTA reads "See Options" (or upgrade-intent CTA)
[ ] Toggle to ES — Derek's banner CTA translates correctly
[ ] Switch to Ana (us-007) in EN mode — CTA reads "Add International" (or addon-intent CTA)
[ ] Toggle to ES — Ana's banner CTA translates correctly

[ ] Language toggle does NOT reset the persona selection
[ ] Language toggle does NOT clear the conversation history
[ ] Banner headline/subtext also update on language toggle (or gracefully fallback to English)
```

**Regression risk:** Medium — change touches `LandingScreen.jsx` and `SignalBanner.jsx`.
Verify `SET_SIGNAL_BANNER` dispatch still fires on persona change in EN mode.
Verify PRD B4 (signal banner visible with correct persona content) still passes.

---

### FIX-004 Verification — Derek flowKey Routing

**What was broken:** Derek's upgrade pill routed to new-phone flow — upgrade branch unreachable.

```
[ ] Select Derek (us-006) via persona dropdown
[ ] Tap upgrade-intent pill (e.g. "Upgrade to Unlimited — $55/mo" or similar)
[ ] Turn 2 AI response must show UPGRADE options — NOT phone-related questions
[ ] Confirm upgrade-specific quick replies appear:
    — "Upgrade now — pay prorated ~$5 today" (or similar)
    — "Upgrade at renewal — no charge today"
    — "Just exploring" or similar
[ ] Tap "Upgrade now" — turn 3 triggers [UPGRADE_FLOW] or shows plan card
[ ] Tap "Upgrade at renewal" — turn 3 shows renewal-timing confirmation

[ ] Does NOT route to: "What kind of phone are you looking for?" or any phone questions
[ ] Clarifying question still fires before plan card (PRD E4 — must not regress)
```

**Regression risk:** High — change touches `generateDemoResponse()` in `demoResponses.js`.
Run quick spot-checks on Maria (refill) and Priya (rewards) turn 2 to confirm their
routing was not affected by the intentCategory override addition.

---

### FIX-005 Verification — Robert UpgradeFlow: 3-Plan + Line Toggle

**What was broken:** Wrong prices ($40/$50), only 2 plans, no 4-line toggle, no line count selector.

```
[ ] Select Robert (us-008) via persona dropdown
[ ] Walk conversation to turn 3 (tap plan-comparison pill → turn 2 → confirm → turn 3)
[ ] Plan comparison UI renders with 3 columns:
    — Total Base 5G (current plan — badge visible)
    — 5G Unlimited (recommended — badge visible)
    — 5G+ (third option)

[ ] Default line count = 4 — verify these 4-line prices:
    — Total Base 5G: $160/mo
    — 5G Unlimited: $110/mo ← saves $50/mo
    — 5G+: $130/mo

[ ] Tap "3 lines" stepper — all 3 columns update simultaneously:
    — Total Base 5G: $120/mo
    — 5G Unlimited: $100/mo
    — 5G+: $120/mo

[ ] Tap "1 line" stepper — all 3 columns update:
    — Total Base 5G: $40/mo
    — 5G Unlimited: $55/mo
    — 5G+: $65/mo

[ ] Return to 4 lines — prices return to $160 / $110 / $130
[ ] "Your plan" badge on Total Base 5G column (reads from persona.account.plan — not hardcoded)
[ ] Tapping CTA on 5G Unlimited: 1.8s processing animation fires
[ ] Success screen appears → SMS modal fires (transactionType: 'upgrade')
[ ] SMS modal message references the upgraded plan name — NOT refill language
```

**Regression risk:** High — significant UpgradeFlow work. Spot-check Derek's upgrade flow
still renders correctly (Derek is a separate P1 persona using the same component).

---

### FIX-006 Verification — RefillFlow Reads persona.account.savedCard

**What was broken:** Refill confirmation screen hardcoded "Visa ····4821" for all personas.

```
[ ] Select Carlos (us-002) via persona dropdown
[ ] Walk refill path to confirmation screen
[ ] Card label reads Carlos's saved card — NOT "Visa ····4821" (unless that IS Carlos's card)
[ ] Plan name on confirmation reads Carlos's plan name from persona.account.plan
[ ] Plan price reads from persona.account.planPrice

[ ] Select Priya (us-003) — points redemption path
[ ] If user selects the free points option: no payment card should be shown
[ ] If user selects the $15 pay option: Priya's saved card shown

[ ] Select Maria (us-001) — confirm Maria's card still shows correctly (regression check)

[ ] No hardcoded "4821" visible for any non-Maria persona
```

**Regression risk:** Low — isolated to RefillFlow.jsx.

---

### FIX-007 Verification — UpgradeFlow Reads persona.account Plan Data

**What was broken:** UpgradeFlow showed hardcoded "5 GB high-speed data" and "No hotspot" — not Derek's plan.

```
[ ] Select Derek (us-006) via persona dropdown
[ ] Walk conversation to UpgradeFlow ([UPGRADE_FLOW] renders in chat)
[ ] "Current plan" column (left) shows:
    — Plan name: "Total Base 5G" (from persona.account.plan — not hardcoded generic)
    — Price: "$40/mo" (from persona.account.planPrice)
[ ] "Upgrade to" column (right) shows Derek's upgrade target (not a generic plan name)
[ ] Payment card on confirmation reads Derek's saved card (same as FIX-006 logic)

[ ] No occurrence of hardcoded "5 GB high-speed data" visible in Derek's upgrade flow
[ ] No occurrence of hardcoded "No hotspot" visible (unless that's actually in personas.js)
```

**Regression risk:** Low if done before FIX-005; Medium if FIX-005 was done first — confirm
they don't conflict in UpgradeFlow.jsx.

---

### FIX-008 Verification — SMS Modal Context-Aware by Transaction Type

**What was broken:** All 3 transaction types showed refill-confirmation text in the SMS modal.

```
--- REFILL (Maria us-001) ---
[ ] Run refill flow to success
[ ] SMS modal text includes: "refilled" or "5 GB added" and expiry date
[ ] Does NOT say anything about plan upgrades or calling cards

--- UPGRADE (Derek us-006) ---
[ ] Run upgrade flow to success
[ ] SMS modal text includes upgrade confirmation — plan name, NOT "refilled" language
[ ] References the new plan name (e.g. "Unlimited")

--- INTERNATIONAL (Ana us-007) ---
[ ] Run international add-on flow to success
[ ] SMS modal text includes "Calling Card activated" or equivalent
[ ] References Colombia (not Mexico — see FIX-009)
[ ] Does NOT say "refilled" or data-related language

--- SHARED CHECKS (all 3) ---
[ ] iPhone frame visible with Dynamic Island at top (PRD F5 — must not regress)
[ ] GREEN SMS bubble — NOT blue iMessage (PRD F5 — must not regress)
[ ] Backdrop blur behind modal (PRD F5 — must not regress)
[ ] X button dismisses cleanly — smsModalData cleared from state (PRD F6)
[ ] Caption: "Confirmation sent to your phone on file." (PRD F7 — must not regress)

[ ] Confirm HIDE_SMS_MODAL clears smsModalData — reopening modal after dismiss
    does not show stale content from the previous transaction
```

**Regression risk:** High — touches ChatContext reducer, 3 flow components, and IPhoneSMSModal.
Must verify all 3 flows dispatch `SHOW_SMS_MODAL` correctly after the change.

---

### FIX-009 Verification — InternationalFlow Country "Mexico" → Persona Country

**What was broken:** InternationalFlow showed "Mexico" for Ana who calls Colombia.

```
[ ] Select Ana (us-007) via persona dropdown
[ ] Walk conversation to InternationalFlow ([INTERNATIONAL_FLOW] renders)
[ ] Signal note / card body references "Colombia" — NOT "Mexico"
[ ] Card headline references Colombia calling
[ ] Success message references Colombia
[ ] Success screen: "Your Colombia calls are covered" or equivalent

[ ] Search InternationalFlow.jsx for hardcoded "Mexico" — zero results
[ ] If another persona had international data referencing a different country,
    confirm their country shows correctly (not Colombia)
```

**Regression risk:** Low — isolated to InternationalFlow.jsx.

---

### FIX-010 Verification — Carlos flowKey Routing (Demo Fallback)

**What was broken:** Carlos's "Renew Total Base 5G — $40/mo" pill routed to generic cost flow in demo mode.

**Note:** FIX-004 may have already resolved this as a side effect of the intentCategory override.
Check FIX-004 first — if Carlos's turn 2 routing already works, FIX-010 may be a no-op.

```
[ ] Select Carlos (us-002) via persona dropdown
[ ] Tap renewal-intent pill (e.g. "Renew Total Base 5G — $40/mo" or "Keep my plan")
[ ] Turn 2 AI response shows Carlos-specific renewal options:
    — Option to renew same plan
    — Option to enable AutoPay and save $5/mo
    — Option to explore other plans
[ ] Does NOT show generic questions like "What's your monthly budget?"
[ ] AutoPay savings pill is visible: "Enable AutoPay & save $5/mo"

[ ] Clarifying Q fires before any plan card (PRD E4 — must not regress)
```

**Regression risk:** Low if FIX-004 already covers this via intentCategory override.
Confirm Maria's turn 2 routing is not affected.

---

### FIX-011 Verification — Persona Dropdown Custom Styled

**What was built:** Native `<select>` replaced with a custom `<div>`-based dropdown.

```
[ ] Persona dropdown trigger button visible in Header (not a native OS select widget)
[ ] Trigger button uses teal brand styling consistent with EN/ES toggle pill
[ ] Click trigger — dropdown panel opens
[ ] Panel shows all 8 personas with name and hint text (e.g. "Maria R. — Running low on data")
[ ] Selected persona is visually highlighted (teal left-border or similar active state)
[ ] Click a persona — panel closes and app state updates (same as before)
[ ] Click outside the panel — panel closes without selecting
[ ] Panel does not overflow viewport on a 375px (mobile) width screen
[ ] Keyboard: Tab to trigger, Enter/Space opens, arrow keys navigate, Enter selects (nice-to-have)
[ ] No OS-native select widget visible on any browser
```

**Regression risk:** Low — cosmetic change only; persona switching logic unchanged.
Confirm all 8 personas still selectable and state still updates on selection.

---

### FIX-012 Verification — James Activation Inline Card (if built)

**Note:** This is a Low priority nice-to-have. Only test if the developer marked it [x] Done.

```
[ ] Select James (us-004) via persona dropdown
[ ] Walk conversation to turn 3 (eSIM or port-in path)
[ ] ActivationFlow inline card renders in conversation (not text-only)
[ ] Card shows step indicators: SIM type → Activate → Choose plan → Done
[ ] eSIM and physical SIM paths both selectable
[ ] Plan selection step shows plan options with prices
[ ] Success screen shows success state → SMS modal fires
[ ] Empty dashboard still renders correctly — no meter, no plan, no renewal (no regression)
```

---

### FIX-013 Verification — Angela Live Chat Hours (if built)

**Note:** Low priority. Only test if developer marked [x] Done.

```
Run during business hours (8 AM – 10 PM local time):
[ ] Select Angela (us-005) → run to turn 3
[ ] "Live Chat: Available now" pill visible

Run outside business hours (or temporarily mock hour to 23):
[ ] "Request callback tomorrow" pill shows — Live Chat pill hidden
[ ] Other support options (ticket, callback) still present
```

---

## Part 2 — Sprint 1 Regression Suite

After verifying all FIX tasks, run this regression suite to confirm Sprint 1
passing checks have not been broken by Sprint 2 changes.

```
REGRESSION — Persona Data & State
[ ] ?persona=maria loads Maria R. (us-001) account state
[ ] ?persona=us-006 loads Derek W. (us-006) account state
[ ] ?persona=us-007 loads Ana G. (us-007) account state
[ ] No URL param → defaults to Maria R. (us-001)
[ ] Persona dropdown selection updates app state (dashboard, signals, pills, URL)

REGRESSION — MiniDashboard (TASK-004, 005, 006)
[ ] MiniDashboard visible between SignalBanner and pills grid
[ ] Exactly 3 signals per persona (spot-check us-001, us-006)
[ ] Data meter color: Maria 16% → red, Derek 0% → red, Ana 64% → teal
[ ] us-004 James: empty state — no meter, no plan, no renewal date

REGRESSION — Conversational Flow (TASK-017)
[ ] Tapping any intent pill → AI asks clarifying Q BEFORE plan card (PRD E4)
[ ] Test with Maria: "I'm running out of data" → confirm no card until turn 3+

REGRESSION — Transaction Flows (TASK-018, 019)
[ ] RefillFlow CTA click → processing animation visible for 1.5s+ (time it)
[ ] IPhoneSMSModal appears after refill success:
    — iPhone frame + Dynamic Island ✓
    — Green SMS bubble (not blue) ✓
    — Backdrop blur ✓
    — X button dismisses ✓
    — Caption: "Confirmation sent to your phone on file." ✓

REGRESSION — Priya rewards (TASK-011)
[ ] Select Priya (us-003) → free redemption option (1,000 pts) surfaced FIRST
[ ] $15 pay option present as second choice

REGRESSION — Language toggle (TASK-007 baseline, Sprint 1 passes)
[ ] C1: ES pill becomes active (teal) on click
[ ] C2: Headline: "Cuéntanos qué está pasando. Nosotros nos encargamos del resto."
[ ] C3: Subhead contains "Soy ClearPath AI"
[ ] C6: Trust banner: "ClearPath AI | Cómo funciona"
[ ] C7: Input placeholder: "Escribe tu mensaje..."

REGRESSION — Transparency Panel
[ ] Trust banner click → side drawer slides in from right
[ ] Panel header: "Why ClearPath AI exists"
[ ] At least 4 numbered rules visible
[ ] X or outside-click dismisses panel
```

---

## Part 3 — Full Persona Demo Run (pre-review smoke test)

Run this quick end-to-end smoke test for the P1 personas before each review session.
This tests the full happy path, not individual components.

### us-001 Maria R. — Refill happy path
```
[ ] Load ?persona=maria → dashboard shows 0.8 GB, Apr 9 renewal, 3 signals
[ ] Tap data-related pill → AI opens with pattern acknowledgement (11/12 months)
[ ] Clarifying Q fires → tap "Quick fix — add data now"
[ ] Turn 2 shows refill confirmation question → tap confirm
[ ] Turn 3 → RefillFlow renders inline
[ ] Tap "Continue — $15" → 1.8s animation → success → SMS modal fires
[ ] SMS modal: refill-specific text, green bubble, X button works
[ ] Plan-change branch: tap "Change my plan" → quick reply pills render (FIX-001)
```

### us-002 Carlos M. — Expiry happy path
```
[ ] Load ?persona=carlos → dashboard shows 2-day expiry urgency signal
[ ] Tap renewal-intent pill → turn 2 shows renewal options + AutoPay savings
[ ] AutoPay pill: "Enable AutoPay & save $5/mo" visible
[ ] Conversation proceeds correctly to turn 3+ without routing to generic flow
```

### us-003 Priya S. — Rewards happy path
```
[ ] Load ?persona=priya → dashboard shows 1,020 rewards points
[ ] Tap refill pill → AI surfaces "Redeem 1,000 pts — free 5 GB" FIRST
[ ] $15 pay option present as second pill
[ ] Select free option → proceeds to redemption flow
```

### us-006 Derek W. — Upsell happy path
```
[ ] Load ?persona=derek → dashboard shows 0 GB, 3-month cap hit signals
[ ] Tap upgrade pill → turn 2 shows prorate vs renewal choice (NOT phone questions)
[ ] UpgradeFlow shows "Total Base 5G" as current plan (FIX-007)
[ ] 1.8s animation → success → SMS modal: upgrade-specific text (FIX-008)
```

### us-007 Ana G. — International add-on happy path
```
[ ] Load ?persona=ana → dashboard shows Colombia calling signal
[ ] Tap international pill → AI surfaces points redemption option FIRST
[ ] InternationalFlow: "Colombia" visible — NOT "Mexico" (FIX-009)
[ ] SMS modal after success: Colombia-specific message (FIX-008)
```

---

## How to Write a QA REVIEW Entry — Sprint 2

Append a `### QA REVIEW` block immediately after the developer's FIX entry.
Never edit the developer's content.

```markdown
### QA REVIEW — FIX-NNN
**QA Status:** ✅ Passed | ⚠️ Passed with notes | ❌ Failed | ⏭️ Not yet testable
**Tested on:** [Local / Vercel] · [Date] · [Persona(s) tested]

**Fix verification checks:**
- [x] [Specific check from PRD_v3.0_Sprint2.md] — PASS
- [x] [Another check] — PASS
- [ ] [Failed check] — FAIL — see issue below

**Regression checks (R9):**
- [x] TASK-001 persona data — no regression
- [x] TASK-017 clarifying Q gate — no regression
- [ ] TASK-XXX — REGRESSION — see issue below

**Issues found:**
→ Issue: [what is wrong]
→ Expected: [what PRD_v3.0_Sprint2.md or personas.js says should happen]
→ Actual: [what actually happened]
→ Severity: Critical | High | Medium | Low
→ Suggested fix: [if obvious]

**Passed checks:**
Brief note on what is working correctly.

**QA recommendation:**
Approved / Approved with notes / Revisions required / Blocked
```

---

## QA Summary — Sprint 2

After completing all FIX verifications and regressions, update the `## QA Summary`
section in `tasklist_sprint2.md`:

```markdown
## QA Summary — Sprint 2

**Last QA run:** [Date]
**Tested by:** QA Agent
**App state:** Local dev / Vercel

| FIX | Description | Dev Status | QA Status | Severity |
|-----|-------------|-----------|-----------|----------|
| FIX-001 | Typo ACTION_PUPILS | [x] Done | ✅ / ⚠️ / ❌ | — |
| FIX-002 | ES pill labels | [x] Done | ... | ... |
...

**Sprint 2 demo readiness:**
[ ] Ready for Lam review (FIX-001 through FIX-004 must pass)
[ ] Ready for Srini review (FIX-001 through FIX-010 must pass)

**Regression status:**
[ ] All Sprint 1 passing checks confirmed — no regressions
[ ] Regressions found — list here

**Critical blockers:**
Any FIX that failed or any Sprint 1 regression that was introduced.

**Notes for next dev pass:**
Patterns observed, systemic issues, or remaining low-priority items.
```

---

## Severity Definitions — Sprint 2

| Severity | Definition | Example |
|---|---|---|
| **Critical** | Re-introduces a PRD red check failure OR breaks a Sprint 1 passing check | E4 clarifying gate breaks, SMS modal no longer fires |
| **High** | Fix did not resolve the original Sprint 1 defect | Derek still routes to phone flow |
| **Medium** | Fix partially resolves — edge cases remain | ES pills work for Maria but not Derek |
| **Low** | Minor cosmetic issue introduced by the fix | Styling slightly off in custom dropdown |

---

## QA Agent Rules — Sprint 2

- **Never edit a developer's FIX entry.** Only append QA REVIEW blocks below them.
- **Always run the regression suite.** A fix that breaks a Sprint 1 pass is worse than the original bug.
- **Mark Critical for any Sprint 1 regression.** Do not let regressions slide to Medium.
- **Test the fix for ALL affected personas** — not just the primary one named in the task.
- **Time the processing animation with a real timer** every sprint. "Looked fine" is not a pass.
- **Retest after any Critical fix is resolved.** A fix isn't done until QA re-verifies.
- **If FIX-010 is resolved by FIX-004**, document this explicitly in the FIX-010 QA REVIEW
  as "Resolved as side effect of FIX-004 — no additional code change needed."

---

*ClearPath AI · QA Agent · v2.0 · Sprint 2 · March 2026*
*Previous version: qa-agent.md v1.0 (Sprint 1)*
