# ClearPath AI — Shared Agent Task Log
**Shared between:** Developer Agent (`dev-agent.md`) · QA Agent (`qa-agent.md`)
**Last updated:** Mar 26, 2026
**Sprint target:** Thu Mar 26 → Mon Mar 30, 2026 (Srini review)

> **Writing rules:**
> - Developer Agent: fills in task entries, marks status, logs files changed
> - QA Agent: appends `### QA REVIEW` blocks only — never edits Dev content
> - Neither agent deletes entries — use `[!] Blocked` or `[~] Superseded` if needed

---

## Codebase Audit

**Persona dropdown in Header:**
NOT PRESENT before this sprint. Header only had EN/ES toggle + UserChip. Added persona select dropdown.

**ChatContext.jsx — currentPersona state:**
EXISTS but used a simplified flat persona shape (name, initials, dataRemaining, dataTotal, planName, planPrice, renewalDate, addons). Did NOT match the full personas.js structure. Replaced with full PERSONAS from src/data/personas.js.

**MiniDashboard — accepts signals prop:**
DID NOT accept signals. Reads from state.persona but showed derived tiles only. Now reads from persona.account.* and renders 3-signal composite row.

**IntentPills — dynamic or hardcoded:**
HARDCODED — LandingScreen used INTENT_PILLS from products.js (8 generic pills). Now replaced with persona.suggestedActions + category-specific extras + "Show me everything" = 8 pills per persona.

**Chat state machine — clarifying step:**
PARTIAL — demo responses had clarifying steps for refill/upgrade/international only. Updated to be persona-aware per R1 (never ask what provider knows). System prompt now includes persona account data.

**IPhoneSMSModal — wired to transactions:**
ONLY wired to RefillFlow. UpgradeFlow and InternationalFlow did NOT dispatch SHOW_SMS_MODAL. Fixed.

**Other findings:**
- SignalBanner used translation keys only; now supports direct headline/subtext/cta from persona.signals
- Signal banners were hardcoded (urgent/smartTip/savings); now derived from persona.signals[0] on persona change
- Keyboard shortcuts (1/2/3) now dispatch full persona objects from personas.js
- systemPrompt.js now includes persona account context to drive personalized AI responses

---

## QA Summary

**Last QA run:** Mar 26, 2026
**Tested by:** QA Agent (code-level audit — local build verified clean)
**App state:** Local dev · `npm run build` passes with 0 errors

| Task | Dev Status | QA Status | Top Issue Severity |
|------|-----------|-----------|-------------------|
| TASK-001 | [x] Done | ✅ Passed | — |
| TASK-002 | [x] Done | ⚠️ Notes | Low |
| TASK-003 | [x] Done | ✅ Passed | — |
| TASK-004 | [x] Done | ✅ Passed | — |
| TASK-005 | [x] Done | ✅ Passed | — |
| TASK-006 | [x] Done | ✅ Passed | — |
| TASK-007 | [x] Done | ❌ Failed | High |
| TASK-008 | [x] Done | ❌ Failed | Medium |
| TASK-009 | [x] Done | ❌ Failed | High |
| TASK-010 | [x] Done | ⚠️ Notes | Medium |
| TASK-011 | [x] Done | ✅ Passed | — |
| TASK-012 | [x] Done | ⚠️ Notes | Medium |
| TASK-013 | [x] Done | ⚠️ Notes | Medium |
| TASK-014 | [x] Done | ❌ Failed | High |
| TASK-015 | [x] Done | ⚠️ Notes | Medium |
| TASK-016 | [~] Partial | ❌ Failed | High |
| TASK-017 | [x] Done | ✅ Passed | — |
| TASK-018 | [x] Done | ✅ Passed | — |
| TASK-019 | [x] Done | ⚠️ Notes | Medium |
| TASK-020 | [x] Done | ✅ Passed | — |

**Demo readiness:**
- [ ] Ready for Lam review
- [ ] Ready for Srini review
- [x] Needs fixes before review — see High severity items below

**Critical blockers for next dev pass (fix before any review):**
1. **TASK-009 / TASK-014** — Typo `[/ACTION_PUPILS]` in `demoResponses.js` plan-change branch — quick reply pills won't render for "Change my plan" flow (Maria) and "upgrade at renewal" branch (Derek). Fix: rename to `[/ACTION_PILLS]`.
2. **TASK-007** — Language toggle (ES) breaks for pills. `LandingScreen` uses `pill.label` directly (always English); PRD C5 fails. Fix: add ES pill labels to persona data or derive from translation map by intentCategory.
3. **TASK-008** — SignalBanner ignores language toggle. `banner.headline` from persona (English) always wins over `t()`. PRD C4 ("Recarga Rápida" CTA) fails in ES mode. Fix: wrap direct content in language-aware lookup.
4. **TASK-016** — Robert's UpgradeFlow shows hardcoded "Value 5 GB" as current plan and `Visa ending in 4821` as card — not reading from `persona.account`. 4-line toggle still not implemented.

**High severity items (should fix before review):**
- RefillFlow confirmation screen shows hardcoded `Visa ending in 4821` — not persona.account.savedCard (affects Carlos, Priya, all non-Maria refills)
- UpgradeFlow plan names and pricing hardcoded to generic Values, not persona-specific Total Wireless branding

**Medium severity (fix in next pass, won't block demo):**
- SMS modal shows refill text for ALL transaction types (upgrade / international add-on show wrong message)
- InternationalFlow signal note says "Mexico" but Ana (us-007) is calling Colombia (country mismatch)
- PRD B3 subhead missing required "Hi. I am ClearPath AI" copy — hardcoded to abbreviated version
- Demo fallback `flowKey` detection fails on pill labels like "Quick Refill — $15" (no 'data' keyword); follow-up turns fall to generic 'cost' flow (API mode unaffected)

**Notes for next dev pass:**
- Fix `[/ACTION_PUPILS]` typo in `demoResponses.js` — immediate fix, 1 line
- Add ES pill label support — either add `labelEs` to suggestedActions or use a per-intentCategory translation map
- Make RefillFlow read `persona.account.savedCard` and `persona.account.plan` instead of hardcoded translation strings
- Make SMS modal message context-aware (refill vs upgrade vs add-on)
- Fix InternationalFlow to use persona's actual `internationalCallsThisMonth[0].country`
- TASK-016 Robert: implement interactive line count slider in UpgradeFlow (or a standalone PlanCompare component)

---

## Task Backlog

> Developer Agent: update this index as tasks move through states.
> Status key: `[ ] Pending` · `[~] In Progress` · `[x] Done` · `[!] Blocked`

```
Priority 1 — Foundation
  [x] TASK-001  Persona data import into app
  [x] TASK-002  Persona dropdown in Header component
  [x] TASK-003  App state wired to selected persona (ChatContext)

Priority 2 — Dashboard & Signals
  [x] TASK-004  MiniDashboard reads from persona.account
  [x] TASK-005  3-signal composite display in MiniDashboard
  [x] TASK-006  Data meter color tied to persona.account.dataPercent

Priority 3 — Personalized Landing
  [x] TASK-007  IntentPills rendered from persona.suggestedActions
  [x] TASK-008  SignalBanner copy tied to persona.signals[0]

Priority 4 — Conversation Flows
  [x] TASK-009  US-001 Maria R. — refill + plan change branches
  [x] TASK-010  US-002 Carlos M. — expiry + AutoPay branch
  [x] TASK-011  US-003 Priya S. — rewards redemption branch
  [x] TASK-012  US-004 James T. — activation flow + empty dashboard
  [x] TASK-013  US-005 Angela K. — diagnostics gate + outage check
  [x] TASK-014  US-006 Derek W. — upsell with prorate/renewal choice
  [x] TASK-015  US-007 Ana G. — international add-on + points redemption
  [~] TASK-016  US-008 Robert L. — plan comparison + 4-line toggle (partial)

Priority 5 — Clarifying question gate
  [x] TASK-017  Chat state machine — clarifying step before recommendation

Priority 6 — Transaction flows
  [x] TASK-018  Processing animation enforced at 1.5s minimum
  [x] TASK-019  iPhone SMS modal wired to all successful transactions

Priority 7 — URL routing
  [x] TASK-020  getPersonaFromURL() wired at app init
```

---

## Task Entries

---

### TASK-001 — Persona data import into app
**Status:** [x] Done
**Priority:** 1
**Persona(s):** All
**Files changed:**
  - `src/data/personas.js` (new — copied from Assets/personas.js)
  - `src/context/ChatContext.jsx`

**What I did:**
Copied the full personas.js (8 personas with full account, signals, suggestedActions, conversationContext) from Assets/ into src/data/. Updated ChatContext to import PERSONAS and getPersonaFromURL from this file and re-export PERSONAS for backward compatibility.

**Known gaps / QA focus:**
Verify that switching personas via dropdown sets the full persona object (not a partial).

**Dev notes:**
Old ChatContext had simplified flat persona shapes. New shape is nested under persona.account.*. All components updated accordingly.

### QA REVIEW — TASK-001
**QA Status:** ✅ Passed
**Tested on:** Local · Mar 26, 2026 · All 8 personas (code audit)

**Checks run:**
- [x] `src/data/personas.js` exists and matches Assets/personas.js exactly — confirmed via file copy
- [x] `ChatContext.jsx` imports `PERSONAS` and `getPersonaFromURL` from `src/data/personas.js`
- [x] `PERSONAS` re-exported from `ChatContext` for backward-compat imports (LandingScreen uses it)
- [x] `initialState.persona` calls `getPersonaFromURL()` at app init
- [x] `SET_PERSONA` action preserves in `RESET_CHAT` (reducer spreads `persona: state.persona`)

**Passed checks:**
Full persona shape (id, name, avatar, account, signals, suggestedActions, conversationContext) is now available throughout the app. Clean import chain with no circular dependencies detected.

**QA recommendation:**
Approved — ready for dependent tasks to build on.

---

### TASK-002 — Persona dropdown in Header component
**Status:** [x] Done
**Priority:** 1
**Persona(s):** All
**Files changed:**
  - `src/components/Header/Header.jsx`
  - `src/components/Header/Header.module.css`

**What I did:**
Added a `<select>` dropdown to Header right side, populated from PERSONA_LIST. Selecting a persona dispatches SET_PERSONA + RESET_CHAT so the app reinitializes with the new persona state. Added .personaSelect CSS with hover/focus states matching the teal brand color.

**Known gaps / QA focus:**
Verify all 8 personas appear in dropdown with correct dropdownLabel. Verify selecting a persona updates MiniDashboard, SignalBanner, and pills.

**Dev notes:**
Positioned before langToggle on the right side. Uses a native `<select>` for simplicity and accessibility. Could be upgraded to a custom styled dropdown in a future polish pass.

### QA REVIEW — TASK-002
**QA Status:** ⚠️ Passed with notes
**Tested on:** Local · Mar 26, 2026 · Code audit

**Checks run:**
- [x] All 8 personas appear in dropdown — PERSONA_LIST exports all 8 in order
- [x] `dropdownLabel` used as option text (e.g. "Maria R. — Running low on data")
- [x] Selecting a persona dispatches SET_PERSONA then RESET_CHAT
- [x] RESET_CHAT preserves `state.persona` (confirmed in reducer: `persona: state.persona`)
- [x] Dropdown `value` bound to `state.persona?.id || 'us-001'` — stays in sync
- [x] CSS hover/focus states use teal brand color ✓

**Issues found:**
→ Issue: Dropdown is a native `<select>` element — styling is OS-dependent (especially on Windows/Android browsers), making it look visually inconsistent with the rest of the pill-based UI.
→ Expected: A styled dropdown consistent with the teal design system
→ Actual: Renders as OS native select — acceptable for a demo tool, but inconsistent polish
→ Severity: Low
→ Suggested fix: Replace with a custom `<div>`-based dropdown in the next polish pass. No blocker for demo.

**Passed checks:**
All 8 personas visible and selectable. State correctly updates MiniDashboard, SignalBanner, and pills on selection (verified via data flow trace).

**QA recommendation:**
Approved with minor notes — acceptable for demo. Cosmetic upgrade recommended before Srini review.

---

### TASK-003 — App state wired to selected persona
**Status:** [x] Done
**Priority:** 1
**Persona(s):** All
**Files changed:**
  - `src/context/ChatContext.jsx`

**What I did:**
Replaced the inline simplified PERSONAS object with an import from src/data/personas.js. The initial state now calls getPersonaFromURL() from personas.js which supports all URL formats (?persona=maria, ?persona=us-001, ?user=1, /us-001 path). SET_PERSONA also clears signalBanner (null) so LandingScreen re-derives it from the new persona.

**Known gaps / QA focus:**
Test all URL alias formats from TASK-020 requirements.

**Dev notes:**
None.

### QA REVIEW — TASK-003
**QA Status:** ✅ Passed
**Tested on:** Local · Mar 26, 2026 · Code audit

**Checks run:**
- [x] `getPersonaFromURL()` imported from `src/data/personas.js` — correct source
- [x] ALIASES in `personas.js` cover all required formats: maria→us-001, carlos→us-002, angela→us-005, derek→us-006, ana→us-007, robert→us-008, and numeric 1-8
- [x] Path-based routing (`window.location.pathname.split('/')`) also supported
- [x] Default fallback = us-001 (Maria R.) when no param present
- [x] `SET_PERSONA` action clears `signalBanner: null` — confirmed in reducer

**Passed checks:**
State initialization, URL routing, and persona persistence on reset all verified correct via code trace.

**QA recommendation:**
Approved.

---

### TASK-004 — MiniDashboard reads from persona.account
**Status:** [x] Done
**Priority:** 2
**Persona(s):** All
**Files changed:**
  - `src/components/MiniDashboard/MiniDashboard.jsx`

**What I did:**
Updated MiniDashboard to read from `persona.account.*` instead of flat `persona.*`. Added backward compat fallback: `const account = persona.account || persona` so it works with both shapes. Updated field names: plan (was planName), daysUntilRenewal (now read from account directly).

**Known gaps / QA focus:**
Test with us-004 (James — null account fields) to confirm empty state renders cleanly.

**Dev notes:**
parseFloat('0.8 GB') = 0.8 — works correctly since parseFloat stops at non-numeric chars.

### QA REVIEW — TASK-004
**QA Status:** ✅ Passed
**Tested on:** Local · Mar 26, 2026 · Code audit — all 8 personas

**Checks run:**
- [x] `const account = persona.account || persona` fallback preserves backward compat
- [x] `account.plan` used for plan name (was `p.planName`) — correct
- [x] `account.dataRemaining` / `account.dataTotal` read correctly; `parseFloat('0.8 GB')` = 0.8 ✓
- [x] `account.daysUntilRenewal` used directly when available (avoids date math drift)
- [x] `account.planPrice` parsed with regex `replace(/[^0-9.]/g, '')` → handles "$40/mo" format ✓
- [x] `account.activeAddons` with fallback to `account.addons` (legacy compat) ✓
- [x] Empty state for us-004: `isEmpty = !account.plan && account.plan !== undefined` = `true` when plan is null ✓
- [x] us-004 empty state renders all 5 tiles with neutral text (no data bars, "Not activated" label) ✓

**Passed checks:**
All persona account fields correctly mapped and rendered. Empty state logic is sound.

**QA recommendation:**
Approved.

---

### TASK-005 — 3-signal composite display in MiniDashboard
**Status:** [x] Done
**Priority:** 2
**Persona(s):** All
**Files changed:**
  - `src/components/MiniDashboard/MiniDashboard.jsx`

**What I did:**
Added SignalRow component inside MiniDashboard that renders persona.signals.slice(0,3) below the mosaic tiles. Each signal shows: severity-colored left border, emoji icon, headline (bold, severity color), subtext (gray). Severity color map: critical→red, warning→amber, info→teal.

**Known gaps / QA focus:**
Verify all 3 signals show for each persona. Verify signals don't show for us-004 (empty state handles separately).

**Dev notes:**
SignalRow is a local sub-component for simplicity. Signals are from persona.signals[] not account fields.

### QA REVIEW — TASK-005
**QA Status:** ✅ Passed
**Tested on:** Local · Mar 26, 2026 · Code audit — all 8 personas

**Checks run:**
- [x] `persona.signals.slice(0, 3)` — always exactly 3, never more ✓
- [x] `SignalRow` renders severity-colored left border per `SEVERITY_COLOR` map ✓
- [x] critical → `#DC3545` (red), warning → `#FFC107` (amber), info → `#00B5AD` (teal) ✓
- [x] Signal headlines match `personas.js` text exactly (direct pass-through, no transform) ✓
- [x] Signal subtexts match `personas.js` text exactly ✓
- [x] us-004 empty state also renders signals via `{signals.length > 0 && <SignalRow />}` — 3 signals shown ✓
- [x] Signals appear below mosaic tiles, above add-ons row (correct placement per PRD G1) ✓

**Cross-ref spot-checks against personas.js:**
- us-001 sig[0]: "Only 0.8 GB left" · critical · red ✓
- us-006 sig[0]: "You hit your data cap again — 0 GB left" · critical · red ✓
- us-007 sig[0]: "You called Colombia 8 times this month" · warning · amber ✓

**Passed checks:**
All 3 signals per persona render with correct severity styling and exact text.

**QA recommendation:**
Approved.

---

### TASK-006 — Data meter color tied to persona.account.dataPercent
**Status:** [x] Done
**Priority:** 2
**Persona(s):** All
**Files changed:**
  - `src/components/MiniDashboard/MiniDashboard.jsx`

**What I did:**
Updated getDataColor thresholds to match spec: green (teal) > 50%, amber 20-50%, red < 20%, neutral gray for null. Now uses persona.account.dataPercent directly when available, falls back to calculation.

**Known gaps / QA focus:**
Thresholds: us-001 (16%) → red, us-002 (42%) → amber, us-003 (6%) → red, us-005 (68%) → teal, us-006 (0%) → red (cap), us-007 (64%) → teal, us-008 (82%) → teal.

**Dev notes:**
Old thresholds were >30 teal / >=10 amber / else red. Spec is >50 / >20 / else. Fixed.

### QA REVIEW — TASK-006
**QA Status:** ✅ Passed
**Tested on:** Local · Mar 26, 2026 · Code audit — all 8 personas

**Checks run:**
- [x] `getDataColor()` thresholds: `>50` → teal, `>20` → amber, else → red, `null` → neutral gray (#9ca3af) ✓
- [x] `account.dataPercent` read directly when available; falls back to `(rem/tot)*100` calculation ✓
- [x] Null case handled: `if (pct === null || pct === undefined) return '#9ca3af'` ✓

**Persona spot-checks against getDataColor thresholds:**
- us-001 Maria: 16% → red (#DC3545) ✓
- us-002 Carlos: 42% (derived from 2.1/5 GB) → amber (#FFC107) ✓
- us-003 Priya: 6% (0.3/5 GB) → red (#DC3545) ✓
- us-004 James: null (no plan) → neutral gray ✓
- us-005 Angela: 68% → teal (#00B5AD) ✓
- us-006 Derek: 0% → red (#DC3545) ✓
- us-007 Ana: 64% → teal (#00B5AD) ✓
- us-008 Robert: 82% → teal (#00B5AD) ✓

**Passed checks:**
All 8 personas map to the correct color tier. Null/empty state returns neutral gray (no false urgency for James). Calculation fallback is mathematically correct — `parseFloat('0.8 GB')` = 0.8.

**QA recommendation:**
Approved.

---

### TASK-007 — IntentPills rendered from persona.suggestedActions
**Status:** [x] Done
**Priority:** 3
**Persona(s):** All
**Files changed:**
  - `src/components/LandingScreen/LandingScreen.jsx`

**What I did:**
Added getPersonaPills(persona) helper that combines persona.suggestedActions (3 pills) with EXTRA_PILLS[intentCategory] (5 pills per category) and always ends with "Show me everything". Truncated to 8. LandingScreen now uses getPersonaPills(state.persona) instead of INTENT_PILLS constant.

**Known gaps / QA focus:**
Verify "Show me everything" is always the last pill. Verify pills change when persona is switched. 8 pills maintained for 2×4 grid layout.

**Dev notes:**
Falls back to EXTRA_PILLS['refill'] if intentCategory is unknown.

### QA REVIEW — TASK-007
**QA Status:** ❌ Failed
**Tested on:** Local · Mar 26, 2026 · Code audit — all 8 personas + ES language toggle

**Checks run:**
- [x] `getPersonaPills(persona)` defined and called in LandingScreen ✓
- [x] Combines `persona.suggestedActions` (3) + `EXTRA_PILLS[category]` (5) → exactly 8 pills ✓
- [x] "Show me everything" always last in EXTRA_PILLS for all 6 categories ✓
- [x] Pills update when persona changes via dropdown ✓ (re-derived from new persona on render)
- [x] Keyboard shortcuts 1/2/3 update persona → pills re-derive correctly ✓
- [x] PRD B5 — exactly 8 pills ✓
- [x] 2×4 grid layout maintained ✓
- [ ] PRD C5 — ES pill translation ❌

**Issues found:**
→ Issue: `pill.label` is always the English string from `personas.js` `suggestedActions[].label`. When language toggles to ES, pills remain in English.
→ Expected (PRD C5): Pills translate — `"Mi internet está lento"`, `"Me quedo sin datos"`, `"Quiero gastar menos"` visible in ES mode
→ Actual: Same English labels regardless of language selection
→ Root cause: `getPersonaPills()` returns `{ label: a.label }` directly from persona data; no ES label field exists; EXTRA_PILLS also hardcoded English only
→ Severity: **High** — PRD C5 acceptance criterion fails
→ Suggested fix: Add `labelEs` field to `suggestedActions` in personas.js, or build an ES override map keyed by intentCategory in EXTRA_PILLS. Use `const { lang } = useLanguage()` and `pill.labelEs || pill.label` when `lang === 'es'`.

**Passed checks:**
Functional pill behavior (count, order, click → startChat, persona-switching) all correct. Only translation path breaks.

**QA recommendation:**
Fix ES pill labels before any review session — PRD C5 is a named acceptance criterion.

---

### TASK-008 — SignalBanner copy tied to persona.signals[0]
**Status:** [x] Done
**Priority:** 3
**Persona(s):** All
**Files changed:**
  - `src/components/LandingScreen/LandingScreen.jsx`
  - `src/components/SignalBanner/SignalBanner.jsx`

**What I did:**
LandingScreen useEffect now watches state.persona and dispatches SET_SIGNAL_BANNER with headline/subtext/cta derived from persona.signals[0] and persona.intentCategory. SignalBanner updated to use direct content (banner.headline/subtext/cta) instead of translation key lookups when available.

**Known gaps / QA focus:**
Verify banner updates when persona changes via dropdown. Verify keyboard shortcut 1/2/3 also updates banner.

**Dev notes:**
CTA labels map: refill→"Quick Refill", upgrade→"See Upgrade Options", addon→"Add International", etc.

### QA REVIEW — TASK-008
**QA Status:** ❌ Failed
**Tested on:** Local · Mar 26, 2026 · Code audit — persona switching + ES language toggle

**Checks run:**
- [x] LandingScreen `useEffect` watches `state.persona` and dispatches `SET_SIGNAL_BANNER` with derived content ✓
- [x] `sig.headline`, `sig.subtext` passed directly from persona.signals[0] ✓
- [x] `cta` derived from `CTA_BY_INTENT[persona.intentCategory]` ✓
- [x] Banner updates on persona dropdown change ✓
- [x] Keyboard shortcuts 1/2/3 dispatch SET_PERSONA → triggers effect → banner updates ✓
- [x] SignalBanner uses `banner.headline || t(signalKey.headline)` — direct content takes priority ✓
- [x] PRD B4 — signal banner present and showing correct persona content ✓
- [ ] PRD C4 — signal banner CTA translates to ES ❌

**Issues found:**
→ Issue: `banner.headline`, `banner.subtext`, and `banner.cta` are English strings from personas.js. They are set into state via SET_SIGNAL_BANNER and always take priority over `t()` lookups in SignalBanner.
→ Expected (PRD C4): In ES mode, signal banner CTA shows `"Recarga Rápida"` (not "Quick Refill")
→ Actual: CTA remains "Quick Refill" in ES mode because `banner.cta` is pre-set English text
→ Root cause: `CTA_BY_INTENT` in LandingScreen is English-only. Banner dispatched once on persona load; language toggle does not re-derive it.
→ Severity: **Medium** — PRD C4 fails in ES mode; banner headline/subtext also stay English
→ Suggested fix: Move banner derivation into a computed selector that runs on both persona AND language change. OR derive `cta` using `t('signal.cta.refill')` inside SignalBanner based on `banner.flowId` instead of storing the CTA string in state.

**Passed checks:**
English-mode banner behavior fully correct — content, severity color, and CTA routing all match persona data. Language toggle is the only failure path.

**QA recommendation:**
Fix before any ES-mode demo walkthrough. The CTA is the most visible translated element and is specifically named in PRD C4.

---

### TASK-009 — US-001 Maria R. — refill + plan change branches
**Status:** [x] Done
**Priority:** 4
**Persona(s):** us-001
**Files changed:**
  - `src/utils/demoResponses.js`
  - `src/data/systemPrompt.js`

**What I did:**
Added persona-specific opening response for us-001: references 0.8 GB remaining, Apr 9 renewal, 14 days, and the 11/12 month pattern. Branches on "quick fix" vs "change my plan" in turn 2. Clarifying question fires before refill card. SMS modal fires after refill success.

**Known gaps / QA focus:**
- AI must NOT ask how often she runs out (R1) — it leads with the pattern
- Clarifying Q must fire before refill card (PRD E4)
- After refill success: offer plan change as follow-up (not upfront)

**Dev notes:**
Demo response fallback only. When API is live, systemPrompt.js includes persona.conversationContext for Claude to follow.

### QA REVIEW — TASK-009
**QA Status:** ❌ Failed
**Tested on:** Local · Mar 26, 2026 · Code audit — us-001 Maria, both conversation branches

**Checks run:**
- [x] Turn 1 opening response fires for Maria (us-001) ✓
- [x] References 0.8 GB remaining, Apr 9 renewal, 14 days, 11/12 pattern ✓
- [x] Does NOT ask "do you often run out?" (R1 compliance) ✓
- [x] Clarifying Q fires before refill card (PRD E4) ✓ — pills: ['Quick fix — add data now', 'Change my plan', ...]
- [x] Quick fix → turn 2 refill branch → references savedCard from persona ✓
- [x] Quick fix → turn 3 → `[REFILL_FLOW]` triggered ✓
- [x] SMS modal dispatched after RefillFlow success (2s delay) ✓
- [ ] Plan change → turn 2 branch → closing tag typo ❌

**Issues found:**
→ Issue: Line 209 in `demoResponses.js` — plan-change branch response ends with `[/ACTION_PUPILS]` instead of `[/ACTION_PILLS]`
→ Expected: Quick reply pills render after plan-change message
→ Actual: `parseResponse()` will not match the malformed tag; pills array returns null; user sees only the message text with no quick reply options
→ Severity: **High** — plan-change path for Maria is broken in demo fallback mode; user is stuck
→ Fix: One-character change — `[/ACTION_PUPILS]` → `[/ACTION_PILLS]` at demoResponses.js line 209
→ Note: API (live Claude) mode is unaffected since Claude generates its own properly formatted tags

**Passed checks:**
Quick fix / refill path (the primary Maria use case) works end-to-end. Typo only affects the secondary "Change my plan" branch.

**QA recommendation:**
Fix the typo immediately — 1-line change. It's the highest-priority code fix in the sprint.

---

### TASK-010 — US-002 Carlos M. — expiry + AutoPay branch
**Status:** [x] Done
**Priority:** 4
**Persona(s):** us-002
**Files changed:**
  - `src/utils/demoResponses.js`

**What I did:**
Opening response references 2-day expiry, current plan (Total Base 5G), and AutoPay savings ($5/mo). Pre-selects last plan as default option. All via persona-specific opening in getPersonaOpeningResponse().

**Known gaps / QA focus:**
AutoPay savings ($5/mo) surfaced during renewal — verify it shows in quick reply pills.

**Dev notes:**
None.

### QA REVIEW — TASK-010
**QA Status:** ⚠️ Passed with notes
**Tested on:** Local · Mar 26, 2026 · Code audit — us-002 Carlos, expiry + AutoPay paths

**Checks run:**
- [x] Turn 1 opening response fires for Carlos (us-002) ✓
- [x] References daysUntilRenewal (2), renewalDate, dataRemaining, plan, planPrice from account ✓
- [x] Pre-selects last plan as default pill option ✓
- [x] AutoPay savings ($5/mo) shown in quick reply pill ✓ — `"Enable AutoPay & save $5/mo"`
- [x] Upgrade to Unlimited option in pills ✓
- [ ] Turn 2 demo routing — flowKey detection issue ⚠️

**Issues found:**
→ Issue: `getFlowKey(firstUserMsg)` requires `msg.includes('refill') && msg.includes('data')` to route to the 'refill' turn 2 branch. Carlos's pill prompts (e.g. "Renew Total Base 5G — $40/mo") don't contain both keywords.
→ Expected: Turn 2 should use the `flowKey === 'refill'` branch with renewal-specific options
→ Actual: In demo mode, firstUserMsg doesn't trigger 'refill' flowKey if it's a pill label → falls back to 'cost' flow (generic questions)
→ Severity: **Medium** — affects demo fallback only; API (live Claude) mode unaffected since Claude uses context
→ Suggested fix: Expand `getFlowKey()` detection for renewal signals: add `msg.includes('renew') || msg.includes('expir')` to the refill condition OR route by `persona.intentCategory` directly in `generateDemoResponse()`

**Passed checks:**
Turn 1 persona-specific response is excellent — all account data correctly referenced. AutoPay mention correct. Issue only surfaces at turn 2+ in demo fallback mode.

**QA recommendation:**
Acceptable for demo if demoing with live API. Flag for dev to fix flowKey routing if demo-only mode is needed.

---

### TASK-011 — US-003 Priya S. — rewards redemption branch
**Status:** [x] Done
**Priority:** 4
**Persona(s):** us-003
**Files changed:**
  - `src/utils/demoResponses.js`

**What I did:**
Opening response surfaces the free redemption option (1,020 pts) FIRST before the $15 pay option. References 0.3 GB remaining and points balance.

**Known gaps / QA focus:**
Free redemption option must be surfaced FIRST — verify pill order in opening response.

**Dev notes:**
None.

### QA REVIEW — TASK-011
**QA Status:** ✅ Passed
**Tested on:** Local · Mar 26, 2026 · Code audit — us-003 Priya, rewards redemption path

**Checks run:**
- [x] Turn 1 opening fires for Priya (us-003) ✓
- [x] References `a.dataRemaining` (0.3 GB) ✓
- [x] References `a.rewardsPoints` (1,020 pts) dynamically from persona.account ✓
- [x] Free redemption option surfaced FIRST in pill order: `['Redeem 1,000 pts — free 5 GB', 'Pay $15 for data add-on', ...]` ✓
- [x] $15 pay option present as second pill (not hidden) ✓
- [x] R2 (diagnostics before upsell) — N/A for refill; points-first satisfies lowest-cost-first principle ✓
- [x] Turn 2 if user selects 'points' or 'free' → `[REFILL_FLOW]` triggers at turn 3 ✓ (via refill flowKey path)

**Cross-check against personas.js:**
- us-003 signals[0]: "You have 1,020 Rewards Points" · info · teal → shown in MiniDashboard signals ✓
- Free option costs 1,000 pts (message says "1,000 pts") vs account shows 1,020 pts (enough) ✓

**Passed checks:**
All Priya-specific checks pass. Lowest-cost-first ordering (free before paid) correctly implemented. Points balance referenced dynamically from persona.account.

**QA recommendation:**
Approved.

---

### TASK-012 — US-004 James T. — activation flow + empty dashboard
**Status:** [x] Done
**Priority:** 4
**Persona(s):** us-004
**Files changed:**
  - `src/utils/demoResponses.js`
  - `src/components/MiniDashboard/MiniDashboard.jsx`

**What I did:**
MiniDashboard empty state renders for personas where account.plan === null (us-004). Shows neutral tiles with "No plan yet", "Not activated" labels. Activation flow in demoResponses walks through eSIM setup for iPhone 15 Pro. 340 Welcome Points shown in signals (from persona.signals data).

**Known gaps / QA focus:**
- Verify empty dashboard has no data meter bars/values
- 340 Welcome Points appear in MiniDashboard signals section
- iOS eSIM and port-in paths both present in quick reply pills

**Dev notes:**
Empty state detection: `!account.plan && account.plan !== undefined` (undefined means legacy flat shape).

### QA REVIEW — TASK-012
**QA Status:** ⚠️ Passed with notes
**Tested on:** Local · Mar 26, 2026 · Code audit — us-004 James, empty dashboard + activation flow

**Checks run:**
- [x] `isEmpty = !account.plan && account.plan !== undefined` → true for James (plan: null) ✓
- [x] Empty state renders all 5 mosaic tiles with neutral content ✓
- [x] No data bars or percentage in empty state ✓
- [x] "No plan" / "Not activated" labels in tiles ✓
- [x] SignalRow still renders below mosaic in empty state (signals.length > 0) ✓
- [x] "340 Welcome Points" visible in signals section ✓
- [x] Turn 1 opening: references simType (eSIM), device (iPhone 15 Pro) ✓
- [x] eSIM and port-in paths in opening pills ✓
- [x] Turn 2: proceeds with eSIM steps ✓
- [x] Turn 3: plan selection options presented ✓
- [ ] No actual eSIM activation flow card rendered ⚠️

**Issues found:**
→ Issue: Activation flow in demoResponses is fully text-based — there's no `[ACTIVATION_FLOW]` component or inline card rendered for the eSIM step-by-step process
→ Expected: An inline card/flow component similar to RefillFlow or UpgradeFlow that walks through activation steps
→ Actual: Text-only conversation with pills — no visual activation card
→ Severity: **Medium** — functional but lacks the polished inline-card UX that other flows have
→ Note: Not in original PRD acceptance criteria (A–H) — no specific "activation card" check exists. Low priority.

**Passed checks:**
Empty dashboard state is correctly implemented and visually clean. Signals (Welcome Points) visible. Conversation flow handles eSIM / port-in branching correctly.

**QA recommendation:**
Approved with note. Text-only activation is acceptable for demo; inline activation card is a nice-to-have for polish sprint.

---

### TASK-013 — US-005 Angela K. — diagnostics gate + outage check
**Status:** [x] Done
**Priority:** 4
**Persona(s):** us-005
**Files changed:**
  - `src/utils/demoResponses.js`

**What I did:**
Opening response leads with empathy + known support history (5 calls, 4 dropped calls, 2-bar signal). Turn 2 runs outage check BEFORE self-fix steps. Plans NOT offered until turn 3+. Live Chat / callback / ticket options in turn 3.

**Known gaps / QA focus:**
- Outage check MUST fire before self-fix steps (most critical ordering check)
- Plans NOT offered until diagnostics exhausted AND user confirms nothing worked
- After-hours Live Chat hiding (11:45 PM EST) not yet implemented — demo hardcodes Live Chat as available

**Dev notes:**
After-hours check would require runtime time detection. Not implemented in demo — note for QA.

### QA REVIEW — TASK-013
**QA Status:** ⚠️ Passed with notes
**Tested on:** Local · Mar 26, 2026 · Code audit — us-005 Angela, diagnostics + support path

**Checks run:**
- [x] Turn 1 opening references `a.supportCallsThisMonth` (5), `a.droppedCallsThisWeek` (4), `a.avgSignalBars` (2) ✓
- [x] Empathy-first tone ("I'm sorry you're dealing with this") ✓
- [x] Clarifying Q fires before any fix step (PRD E4) ✓
- [x] Turn 2 — outage check fires BEFORE self-fix steps ✓ ("Let me first check for any known network issues or outages")
- [x] Plans NOT offered until turn 3+ ✓
- [x] Turn 3 — Live Chat / Callback / Ticket options present ✓
- [x] Turn 3 — "Show me plan options too" pill present for user who wants to explore plans ✓
- [ ] After-hours Live Chat visibility — not implemented ⚠️

**Issues found:**
→ Issue: Live Chat always shown as "Available now" regardless of time of day. Per dev notes, Angela is a late-night caller (11:45 PM EST). After-hours, Live Chat should be hidden and only async options (callback next day, ticket) shown.
→ Expected: Live Chat available indicator respects support hours
→ Actual: "📞 Live Chat: Available now" hardcoded in turn 3 response
→ Severity: **Low** — demo scenario is daytime; not a PRD acceptance criterion. No runtime time check implemented.
→ Suggested fix: Check `new Date().getHours()` against support hours (e.g., 8–22 EST) and conditionally include/exclude Live Chat pill. Simple to add.

**Passed checks:**
Diagnostics-first ordering is correct. Empathy tone matches persona. Outage check before self-fix check passes. The critical PRD flow ordering (E4, no plans until diagnostics done) is respected.

**QA recommendation:**
Approved with Low severity note. After-hours check is a nice-to-have for realism but won't affect demo sessions run during business hours.

---

### TASK-014 — US-006 Derek W. — upsell with prorate/renewal choice
**Status:** [x] Done
**Priority:** 4
**Persona(s):** us-006
**Files changed:**
  - `src/utils/demoResponses.js`

**What I did:**
Opening response leads with 3-month cap hit pattern (R1 — does NOT ask if he runs out). Turn 2 offers upgrade now (prorated) OR at renewal. Disney+ activation mentioned in signals section. Prorated amount based on daysUntilRenewal from persona data.

**Known gaps / QA focus:**
- AI leads with "3 months in a row" — verify it doesn't ask "are you running out often?"
- Prorated amount calculation: 10 days remaining ~$5.00 (verify math)
- "Upgrade at renewal" path must show "no charge today" wording

**Dev notes:**
Prorated calculation uses daysUntilRenewal from persona.account. Exact math: (10/30) * $15 diff ≈ $5.

### QA REVIEW — TASK-014
**QA Status:** ❌ Failed
**Tested on:** Local · Mar 26, 2026 · Code audit — us-006 Derek, upgrade + flowKey routing

**Checks run:**
- [x] Turn 1 opening for Derek (us-006): references `a.capHitsLast3Months` (3), 0 GB, $15 more/mo ✓
- [x] Does NOT ask "how often do you run out?" (R1 compliance) ✓
- [x] Clarifying Q fires with upgrade/explore options ✓
- [x] Turn 2 upgrade-now path: prorated language ✓
- [x] Turn 2 at-renewal path: "no charge today" wording ✓
- [x] Turn 3 → `[UPGRADE_FLOW]` triggered ✓
- [x] `[/ACTION_PILLS]` closing tag correct in all Derek upgrade branches (lines 226, 229, 231, 240, 242) ✓
- [ ] flowKey detection for Derek's pills → routes incorrectly ❌
- [ ] UpgradeFlow component shows hardcoded plan data, not Derek's account ❌

**Issues found:**
→ Issue 1: `getFlowKey()` requires `msg.includes('upgrade') && msg.includes('plan')` for 'upgrade' flowKey. Derek's pill prompts (e.g. "Upgrade to Unlimited — $55/mo") contain 'upgrade' but not 'plan'. This matches `msg.includes('upgrade')` → falls to 'new-phone' flowKey instead. Turn 2 uses FLOWS['new-phone'] (generic phone questions) instead of the upgrade-specific branch.
→ Severity: **High** — demo fallback mode routes Derek incorrectly from turn 2 onward; upgrade flow never reached via pill taps
→ Suggested fix: Add `persona.intentCategory === 'upgrade'` as a routing override in `generateDemoResponse()`, or expand the flowKey pattern to match "Unlimited" or pill labels more broadly.

→ Issue 2: When `[UPGRADE_FLOW]` renders, the component shows hardcoded "5 GB high-speed data" as the current plan and "Visa ····4821" as the payment card — neither comes from `persona.account`. Derek's actual plan is "Total Base 5G" at $40/mo with his own saved card.
→ Severity: **Medium** — wrong plan name in comparison card breaks credibility during demo

**Passed checks:**
Turn 1 opening for Derek is excellent. R1 compliance (no "do you run out often?") confirmed. Upgrade branches themselves are well-written; routing failure prevents them from being reached via normal pill interaction.

**QA recommendation:**
Fix flowKey routing for Derek before demo — it's the primary upgrade persona and the routing bug means turn 2 never shows upgrade options. UpgradeFlow hardcoded data is secondary.

---

### TASK-015 — US-007 Ana G. — international add-on + points redemption
**Status:** [x] Done
**Priority:** 4
**Persona(s):** us-007
**Files changed:**
  - `src/utils/demoResponses.js`

**What I did:**
Opening references 8 Colombia calls and free redemption option (1,200 pts) FIRST before the $10 pay option. Turn 2 handles points redemption branch with points balance. InternationalFlow wired to SMS modal.

**Known gaps / QA focus:**
- Free redemption offered FIRST (before $10 option) — verify pill order
- After adding: card border turns green, button changes to "Active" — needs InternationalFlow component update (not done)
- Calling Card success screen: shows calling balance + dial instructions — needs InternationalFlow update

**Dev notes:**
InternationalFlow component success screen is generic. Per-persona success state not customized yet.

### QA REVIEW — TASK-015
**QA Status:** ⚠️ Passed with notes
**Tested on:** Local · Mar 26, 2026 · Code audit — us-007 Ana, international + points paths

**Checks run:**
- [x] Turn 1 opening for Ana (us-007): references Colombia (`intlCalls[0]?.country`), 8 calls, 1,200 pts ✓
- [x] Free redemption option (points) surfaced FIRST in pill order ✓
- [x] Points balance referenced dynamically from `a.rewardsPoints` ✓
- [x] Turn 2 points redemption branch: correct points count, proceed question ✓
- [x] Turn 3 → `[INTERNATIONAL_FLOW]` triggered ✓
- [x] InternationalFlow dispatches `SHOW_SMS_MODAL` after success (2s delay) ✓
- [ ] InternationalFlow signal note hardcoded to "Mexico" ⚠️
- [ ] Success screen is generic, not Colombia/Calling Card specific ⚠️
- [ ] "Card turns green / Active button" on success — not implemented ⚠️

**Issues found:**
→ Issue 1: `InternationalFlow.jsx` signal note reads "Your service works in Mexico and 140+ countries" — Mexico is hardcoded. For Ana, the relevant country is Colombia.
→ Severity: **Medium** — visible wrong country name in the flow card; breaks demo credibility for us-007

→ Issue 2: InternationalFlow success screen shows generic "Add-on activated" message — no reference to Colombia calling, the Calling Card, or Ana's actual calling pattern
→ Severity: **Low** — functional but not persona-specific; acceptable for demo

→ Issue 3: Per dev notes, after add-on success the InternationalFlow card border should turn green and the button should change to "Active" — not currently implemented in the component
→ Severity: **Low** — visual polish only; transaction completes correctly

**Passed checks:**
Opening response for Ana is excellent. Lowest-cost-first ordering (free redemption before $10 paid) correct. SMS modal fires. Main conversation flow navigates correctly to InternationalFlow.

**QA recommendation:**
Fix Mexico→Colombia country mention in InternationalFlow before showing Ana's flow. The other issues are Low priority polish items.

---

### TASK-016 — US-008 Robert L. — plan comparison + 4-line toggle
**Status:** [~] In Progress (partial)
**Priority:** 4
**Persona(s):** us-008
**Files changed:**
  - `src/utils/demoResponses.js`

**What I did:**
Opening references 4 lines, 3 plan-page visits this week, current $160/mo spend, and Unlimited at $110/mo savings. Turn 2 shows pricing math. Turn 3 triggers UPGRADE_FLOW. System prompt includes planComparison data from persona.

**Known gaps / QA focus:**
- Line toggle (1–4) must update ALL three plan prices simultaneously — NOT YET IMPLEMENTED
- UpgradeFlow currently shows a 2-plan comparison without the line count slider
- 4-line math: Base $160, Unlimited $110, 5G+ $130 — correct per planComparison data
- Current plan badge from persona — not yet wired into UpgradeFlow

**Dev notes:**
UpgradeFlow would need a significant update to add the interactive line count toggle. Flagged for follow-up sprint.

### QA REVIEW — TASK-016
**QA Status:** ❌ Failed
**Tested on:** Local · Mar 26, 2026 · Code audit — us-008 Robert, 4-line comparison

**Checks run:**
- [x] Turn 1 opening for Robert (us-008): references 4 lines, 3 plan-page visits, $160/mo, $110/mo savings ✓
- [x] Turn 2: shows per-line pricing math ($40/line vs $27.50/line) ✓
- [x] Turn 3 → `[UPGRADE_FLOW]` triggered ✓
- [ ] 4-line price toggle in UpgradeFlow — not implemented ❌
- [ ] UpgradeFlow current plan shows hardcoded "5 GB high-speed data" and "No hotspot" — not Robert's plan ❌
- [ ] Only 2-plan comparison (Current vs Unlimited) — Robert needs 3-plan (Base, Unlimited, 5G+) ❌
- [ ] UpgradeFlow recommended plan price: $50/mo hardcoded vs Robert's 4-line scenario: $110/mo ❌

**Issues found:**
→ Issue 1: UpgradeFlow shows a 2-plan comparison with hardcoded prices ($40 current, $50 upgrade). For Robert at 4 lines, the correct prices are $160/mo vs $110/mo. The component reads no persona data.
→ Severity: **High** — completely wrong pricing shown to Robert during the key decision screen

→ Issue 2: 4-line interactive toggle (line count 1–4 updates all prices) is not implemented. Dev notes flag this as a "follow-up sprint" item.
→ Severity: **High** — core differentiator of Robert's persona scenario; without it the upgrade flow is generic

→ Issue 3: UpgradeFlow only shows 2 plans. Robert's `planComparison` data has 3 plans (Base 5G, 5G Unlimited, 5G+). The third option ($130 for 4 lines) is never surfaced.
→ Severity: **Medium** — incomplete comparison for the "family shopper" persona

**Dev status:** [~] Partial — demoResponses conversation is correct; UpgradeFlow component itself not updated for Robert's scenario.

**QA recommendation:**
This task requires significant UpgradeFlow work to complete. Either scope a persona-aware UpgradeFlow that reads from `persona.account.planComparison`, or build a separate `FamilyPlanCompare` component for Robert. Block this as incomplete for demo if Robert's scenario is part of the walkthrough.

---

### TASK-017 — Chat state machine — clarifying step before recommendation
**Status:** [x] Done
**Priority:** 5
**Persona(s):** All
**Files changed:**
  - `src/utils/demoResponses.js`
  - `src/data/systemPrompt.js`

**What I did:**
Every persona-specific opening response (turn 1) now ends with a clarifying question + quick reply pills. System prompt rule #1 explicitly requires at least 1 clarifying question before any recommendation. demoResponses never triggers [REFILL_FLOW], [UPGRADE_FLOW], or [INTERNATIONAL_FLOW] until turn 3 at earliest (after clarifying exchange).

**Known gaps / QA focus:**
PRD check E4 — critical. QA should verify: tap pill → AI responds with clarifying Q → user replies → only THEN can plan card/recommendation appear.

**Dev notes:**
None.

### QA REVIEW — TASK-017
**QA Status:** ✅ Passed
**Tested on:** Local · Mar 26, 2026 · Code audit — all 8 personas, turn 1 clarifying check

**Checks run:**
- [x] PRD E4 — AI asks clarifying question before any recommendation or CTA ✓
- [x] All 8 persona-specific turn 1 responses end with `[ACTION_PILLS]` (clarifying options), not a flow card ✓
- [x] Generic fallback flows (FLOWS object) also ask clarifying questions in turn 1 ✓
- [x] `[REFILL_FLOW]` earliest trigger: turn 3 (turn 2 confirms intent, turn 3 dispatches flow) ✓
- [x] `[UPGRADE_FLOW]` earliest trigger: turn 3 ✓
- [x] `[INTERNATIONAL_FLOW]` earliest trigger: turn 3 ✓
- [x] System prompt rule #1: "Always ask at least one clarifying question before recommending any plan or add-on" ✓

**Cross-check spot samples:**
- us-001 Maria turn 1: "quick fix for right now, or stop this from happening every month?" + 4 pills ✓
- us-004 James turn 1: "eSIM, physical SIM, or port your number?" + 4 pills ✓
- us-006 Derek turn 1: "thinking about upgrading now, or just exploring options?" + 4 pills ✓
- us-007 Ana turn 1: "redeem your points, or pay?" + 4 pills ✓

**Passed checks:**
All persona paths enforce at least one clarifying turn before any plan card or transaction flow renders. PRD E4 passes.

**QA recommendation:**
Approved.

---

### TASK-018 — Processing animation enforced at 1.5s minimum
**Status:** [x] Done
**Priority:** 6
**Persona(s):** All (payment flows)
**Files changed:**
  - Pre-existing: RefillFlow, UpgradeFlow, InternationalFlow all use 1800ms timeout

**What I did:**
Audited all three flow components. All use `setTimeout(() => setStep(3), 1800)` for the processing→success transition. 1800ms > 1500ms minimum. No changes needed.

**Known gaps / QA focus:**
PRD check F3 — QA should time with stopwatch. Expected: ~1.8s spinner display.

**Dev notes:**
None.

### QA REVIEW — TASK-018
**QA Status:** ✅ Passed
**Tested on:** Local · Mar 26, 2026 · Code audit — all 3 flow components

**Checks run:**
- [x] `RefillFlow.jsx` processing step: `setTimeout(() => setStep(3), 1800)` → 1800ms ✓
- [x] `UpgradeFlow.jsx` processing step: `setTimeout(() => setStep(3), 1800)` → 1800ms ✓
- [x] `InternationalFlow.jsx` processing step: `setTimeout(() => setStep(3), 1800)` → 1800ms ✓
- [x] All 3 use `STEPS[step] === 'processing'` check in useEffect before starting timer ✓
- [x] All 3 clear the timer on cleanup (`return () => clearTimeout(timer)`) ✓
- [x] 1800ms > PRD F3 minimum of 1500ms ✓
- [x] Spinner component (`className={styles.spinner}`) visible during processing step ✓

**Passed checks:**
All 3 transaction flows enforce a minimum 1.8s processing animation — 300ms above the 1.5s PRD requirement. Timer cleanup prevents memory leaks on unmount.

**QA recommendation:**
Approved.

---

### TASK-019 — iPhone SMS modal wired to all successful transactions
**Status:** [x] Done
**Priority:** 6
**Persona(s):** All (payment flows)
**Files changed:**
  - `src/components/UpgradeFlow/UpgradeFlow.jsx`
  - `src/components/InternationalFlow/InternationalFlow.jsx`

**What I did:**
Added `dispatch({ type: 'SHOW_SMS_MODAL' })` in success useEffect for UpgradeFlow and InternationalFlow (2s delay after success screen). RefillFlow already had this. All 3 transaction flows now trigger the SMS modal.

**Known gaps / QA focus:**
PRD checks F5–F7. Verify:
- Dynamic Island present at top of iPhone frame
- GREEN SMS bubble — not blue iMessage
- Backdrop blur behind modal
- X button dismisses cleanly
- Caption: "Confirmation sent to your phone on file."

**Dev notes:**
IPhoneSMSModal component exists and is connected to state.showSMSModal. Content is generic (not persona-specific). Message text for plan upgrades and international add-ons is same as refill confirmation — could be personalized in follow-up sprint.

### QA REVIEW — TASK-019
**QA Status:** ⚠️ Passed with notes
**Tested on:** Local · Mar 26, 2026 · Code audit — all 3 transaction flows + IPhoneSMSModal

**Checks run:**
- [x] `RefillFlow.jsx` dispatches `SHOW_SMS_MODAL` after success — already existed ✓
- [x] `UpgradeFlow.jsx` dispatches `SHOW_SMS_MODAL` after 2000ms success delay ✓ (added this sprint)
- [x] `InternationalFlow.jsx` dispatches `SHOW_SMS_MODAL` after 2000ms success delay ✓ (added this sprint)
- [x] All 3 `useEffect` blocks have `[step, dispatch]` dependency array ✓
- [x] All 3 clean up timer on unmount (`return () => clearTimeout(timer)`) ✓
- [x] PRD F5 — iPhone frame with Dynamic Island ✓ (IPhoneSMSModal component)
- [x] PRD F5 — Green SMS bubble (not blue) ✓
- [x] PRD F5 — Backdrop blur behind modal ✓
- [x] PRD F6 — X button to dismiss ✓
- [x] PRD F7 — Caption "Confirmation sent to your phone on file." ✓
- [ ] SMS modal message context-aware ⚠️

**Issues found:**
→ Issue: `IPhoneSMSModal` shows the same refill confirmation text regardless of transaction type. After a plan upgrade, it still says "Your account has been refilled" or similar refill language. After an international add-on, same.
→ Expected: Message varies by transaction — refill: "5GB added. Valid through [date]", upgrade: "Plan upgraded to Unlimited. Disney+ activation email sent.", international: "Global Calling Card activated."
→ Severity: **Medium** — message content is wrong for upgrade/international flows; breaks demo immersion
→ Suggested fix: Pass a `transactionType` prop through the dispatch action: `dispatch({ type: 'SHOW_SMS_MODAL', payload: { type: 'upgrade' } })`. IPhoneSMSModal reads `state.smsModalType` and renders appropriate message.

**Passed checks:**
All 3 flows now correctly trigger the modal — pre-sprint gap (UpgradeFlow, InternationalFlow not wired) is fixed. PRD F5–F7 checks pass for visual fidelity. Only message content issue remains.

**QA recommendation:**
Approved with note. Fix message content before upgrade/international demo walkthroughs. Low effort — single dispatch payload + 3-branch message template.

---

### TASK-020 — getPersonaFromURL() wired at app init
**Status:** [x] Done
**Priority:** 7
**Persona(s):** All
**Files changed:**
  - `src/context/ChatContext.jsx`
  - `src/data/personas.js`

**What I did:**
ChatContext initial state calls getPersonaFromURL() from personas.js. The function supports: ?persona=maria, ?persona=us-001, ?user=1, /us-001 path, and named aliases for all 8 personas. Falls back to us-001 (Maria R.) if no param.

**Known gaps / QA focus:**
PRD check H1. Test all alias formats:
- ?persona=maria → Maria R. (us-001)
- ?persona=us-006 → Derek W.
- ?persona=us-007 → Ana G.
- ?user=1 → Maria R.
- Fallback (no param) → Maria R. (us-001 default)

**Dev notes:**
None.

### QA REVIEW — TASK-020
**QA Status:** ✅ Passed
**Tested on:** Local · Mar 26, 2026 · Code audit — URL parsing + alias coverage

**Checks run:**
- [x] `getPersonaFromURL()` imported and called at `ChatContext` initial state ✓
- [x] `?persona=maria` → us-001 (Maria R.) via ALIASES map ✓
- [x] `?persona=us-001` → us-001 direct key lookup ✓
- [x] `?persona=us-006` → us-006 (Derek W.) ✓
- [x] `?persona=us-007` → us-007 (Ana G.) ✓
- [x] `?user=1` → us-001 via ALIASES ('1' → 'us-001') ✓
- [x] Path-based `/us-001` parsing: `window.location.pathname.split('/')` ✓
- [x] All 8 persona names as aliases: maria, carlos, priya, james, angela, derek, ana, robert ✓
- [x] All 8 numeric aliases: '1'–'8' ✓
- [x] Default fallback when no param: returns `PERSONAS['us-001']` (Maria R.) ✓
- [x] PRD H1 — at least one URL format loads a different account state ✓

**Passed checks:**
All documented URL formats and alias combinations work correctly per code trace. Default fallback is Maria (us-001) which matches PRD H1 expected default state. PERSONA_LIST export used by Header dropdown is correctly ordered.

**QA recommendation:**
Approved. PRD H1 satisfied.

---

*ClearPath AI · Shared Task Log · v1.1 · Mar 26, 2026*
