# ClearPath AI — QA Agent Workflow
**Role:** QA Agent — Sprint 3 (Diagnosis Flow + Persona Context Verification)
**Reads:** `docs/persona-flows.md` · `planning/tasklist_sprint3.md` · `src/data/personas.js`
**Writes to:** `planning/tasklist_sprint3.md` (QA REVIEW blocks only — never edit Dev entries)
**Live app:** `https://clearpath-ai-pearl.vercel.app/` · Local: `http://localhost:5173`
**Sprint:** Mon Mar 30 → Thu Apr 3, 2026

> **Sprint 3 context:** Sprints 1 and 2 built and fixed the prototype foundation.
> Sprint 3 implements the diagnosis-first conversation pattern from the Mar 28 Lam review.
> Your job is to verify that every new behavior in `persona-flows.md` is implemented
> correctly AND that no Sprint 1 or Sprint 2 passing checks have regressed.

---

## Agent Identity

You are the **ClearPath AI QA Agent** running Sprint 3. Your job is to:
1. Verify each S3 task in `tasklist_sprint3.md` against its specification in `dev-agent.md` and `persona-flows.md`
2. Confirm no Sprint 1 or Sprint 2 passing checks were broken
3. Append `### QA REVIEW` blocks to each task entry — never edit developer content

You do not write code. You only append QA REVIEW blocks and update the QA Summary section.

---

## Before You Test Anything

### Step 1 — Read your source files

```
Read: src/data/personas.js      → Ground truth. Check diagnosisFlow, providerKnows[],
                                   updated suggestedActions order, conversationContext.

Read: docs/persona-flows.md     → Your test script. Every conversation branch is
                                   described here. Your verification checks must match
                                   these flows exactly — including message wording,
                                   quick reply pills, and step sequence.

Read: planning/tasklist_sprint3.md → What the developer says they implemented. Only
                                      test tasks marked [x] Done.
```

### Step 2 — Confirm app is accessible

- Confirm `npm run dev` running in `clearpath-ai/` → app at `http://localhost:5173`
- Open browser console — zero errors required before starting any test
- Confirm persona dropdown visible in Header
- Confirm EN/ES toggle visible top-right
- Confirm all 8 personas selectable and state updates on selection

---

## Part 1 — Sprint 3 Task Verification

Test each S3 task in isolation. Only test tasks marked `[x] Done`.

---

### S3-001 Verification — providerKnows Injected into System Prompt

**What was added:** `getProviderContext(persona)` appended to system prompt on persona load.

```
[ ] Open browser DevTools console
[ ] Select Maria (us-001) via persona dropdown
[ ] Confirm system prompt logged includes bullet list of providerKnows facts:
    "• current data balance (0.8 GB)"
    "• 11 of last 12 months"
    "• Wi-Fi usage percentage (22%)"
    "• saved payment card (Visa ••••4291)"

[ ] Switch persona to Derek (us-006)
[ ] Confirm system prompt updates — now shows Derek's providerKnows facts:
    "• data cap hit 3 months in a row"
    "• currently at 0 GB"
    "• AutoPay already enabled"

[ ] Switch persona to Ana (us-007)
[ ] Confirm Ana's providerKnows facts appear:
    "• 8 calls to Colombia this month"
    "• ~$28 estimated charges this month"
    "• 1,200 Rewards Points"

[ ] Switch persona to James (us-004)
[ ] Confirm James's providerKnows appears (device, SIM type, account inactive)
[ ] System prompt does NOT contain any other persona's providerKnows facts after switch
```

**Regression risk:** Low — additive change to system prompt only.

---

### S3-002 Verification — `diagnose_usage` Action Handler

**What was added:** New `'diagnose_usage'` action in demoResponses.js.

```
[ ] Select Maria (us-001) via persona dropdown
[ ] Tap "Why am I running out?" pill
[ ] AI responds with Maria's diagnosisFlow.intro — confirm exact text includes:
    "0.8 GB left" or "0.8 GB"
    "11 of the last 12 months" (or equivalent phrasing)
    "22%" or "mostly on cellular" (Wi-Fi signal observation)

[ ] Three quick reply pills appear:
    "Let's do it"
    "Skip — just add data"
    "Skip — change my plan"

[ ] Select Derek (us-006) via persona dropdown
[ ] Tap "Why do I keep hitting my cap?" pill
[ ] AI responds with Derek's diagnosisFlow.intro — confirm text includes:
    "3rd month in a row" or "3 months in a row"
    Reference to 10/12 months pattern
    Acknowledgment that a plan change may be needed

[ ] Three quick reply pills appear for Derek as well

[ ] Tap "Skip — just add data" (Maria) → conversation routes to refill branch
[ ] Tap "Skip — change my plan" (Maria) → conversation routes to plan change branch
[ ] CONFIRM: skipping diagnosis does not dead-end the conversation
```

**Regression risk:** Medium — new case in demoResponses.js. Spot-check that other action
types (refill, renew, check_outage) still route correctly.

---

### S3-003 Verification — Maria Pill Order (Diagnosis First)

**What was changed:** Maria's first pill is now "Why am I running out?"

```
[ ] Select Maria (us-001) via persona dropdown
[ ] On landing screen, confirm pill order left-to-right, top-to-bottom:
    1st: "Why am I running out?"
    2nd: "Quick Refill — $15"
    3rd: "Change my plan"
    4th: "I'm fine for now"

[ ] Toggle to ES mode
[ ] Confirm 1st pill in Spanish: "¿Por qué se me acaban los datos?"
[ ] Confirm 2nd pill in Spanish: "Recarga Rápida — $15"

[ ] Confirm total pill count unchanged (must still equal the configured number)
[ ] Tap each pill and confirm it opens the correct conversation branch:
    "Why am I running out?" → diagnose_usage branch
    "Quick Refill — $15" → quick_refill branch
    "Change my plan" → plan_change branch
```

**Regression risk:** Medium — pill rendering order change. Confirm Sprint 2 FIX-002 (ES pill
labels) still works after this change. All pills must still translate on toggle.

---

### S3-004 Verification — Derek Pill Order (Diagnosis First)

**What was changed:** Derek's first pill is now "Why do I keep hitting my cap?"

```
[ ] Select Derek (us-006) via persona dropdown
[ ] On landing screen, confirm pill order:
    1st: "Why do I keep hitting my cap?"
    2nd: "Upgrade to Unlimited — $55/mo"
    3rd: "Start at next renewal (no charge today)"

[ ] Toggle to ES mode
[ ] Confirm 1st pill in Spanish: "¿Por qué sigo alcanzando el límite?"
[ ] Confirm 2nd pill in Spanish: "Cambiar a Ilimitado — $55/mes"

[ ] Tap each pill — confirm correct routing:
    "Why do I keep hitting my cap?" → diagnose_usage branch
    "Upgrade to Unlimited" → upgrade_unlimited branch
    "Start at next renewal" → upgrade_at_renewal branch

[ ] Confirm Sprint 2 FIX-004 (Derek flowKey fix) is NOT regressed —
    upgrade branch must NOT route to phone/device questions
```

**Regression risk:** Medium. This is Derek's primary upgrade path — verify FIX-004 is intact.

---

### S3-005 Verification — Maria Full Diagnosis Flow

**What was added:** Multi-step diagnosis conversation wired for Maria.

```
SETUP: Select Maria (us-001) → tap "Why am I running out?"

STEP 0 — Intro
[ ] AI responds with diagnosisFlow.intro (confirmed in S3-002)
[ ] Tap "Let's do it"

STEP 1 — Wi-Fi question
[ ] AI asks about Wi-Fi connection at home/work
[ ] Quick reply pills visible: "Yes, always" / "Sometimes" / "I'm not sure"
[ ] Tap "Sometimes" → conversation advances to Step 2

STEP 2 — Video streaming question
[ ] AI asks about video/music streaming on cellular
[ ] Hint about data usage rate visible (1–3 GB/hour)
[ ] Quick reply pills: "Yes, often" / "Occasionally" / "Rarely"
[ ] Tap "Yes, often" → conversation advances to Step 3

STEP 3 — Background apps question
[ ] AI asks about background app refresh / auto-updates
[ ] Quick reply pills: "Probably yes" / "I've disabled it" / "Not sure"
[ ] Tap "Probably yes" → conversation shows free fix suggestions

FREE FIX SUGGESTIONS
[ ] AI presents at least 3 free fix suggestions from diagnosisFlow.freeFixSuggestions[]
[ ] Includes Wi-Fi Assist tip, streaming app setting, background app refresh setting
[ ] Escalation prompt appears with 3 options:
    "I'll try those"
    "Add data for now — $15"
    "Show plan options"

ESCAPE HATCH CHECKS
[ ] "I'll try those" → END FLOW (no forced upsell)
[ ] "Add data for now — $15" → routes to RefillFlow (R7, R8: 1.5s animation, SMS modal)
[ ] "Show plan options" → AI asks permission: "Would you like to see upgrade plans?"
    (R3: permission required — plan card must NOT appear without this confirmation)

SKIP CHECKS (re-run with skip paths)
[ ] Tap "Skip — just add data" at Step 0 → goes directly to refill confirmation
[ ] Tap "Skip — change my plan" at Step 0 → goes directly to plan options
[ ] Confirm no dead ends at any step — every quick reply has a valid next state
```

**Regression risk:** High — multi-step new flow touching ChatContext and demoResponses.
Run full Sprint 2 regression suite for Maria after this test.

---

### S3-006 Verification — Derek Diagnosis Flow

**What was added:** 2-step diagnosis path for Derek.

```
SETUP: Select Derek (us-006) → tap "Why do I keep hitting my cap?"

STEP 0 — Intro
[ ] AI opens with Derek's diagnosisFlow.intro — honest framing:
    "10 of 12 months" pattern mentioned
    Acknowledgment that Unlimited might just be the right fit

STEP 1 — Video streaming question
[ ] AI asks about cellular video streaming
[ ] Quick reply pills: "Yes, a lot" / "Sometimes" / "Rarely"

STEP 2 — Hotspot usage question
[ ] AI asks about using phone as hotspot for other devices
[ ] Quick reply pills: "Yes, regularly" / "Occasionally" / "Never"

FREE FIX SUGGESTIONS
[ ] 3 free fix suggestions visible (streaming settings, data usage check, background data)

ESCALATION PROMPT
[ ] AI surfaces escalationPrompt: references $150 annual overage estimate
[ ] Two options:
    "Show upgrade options"
    "I'll try the tips first"

[ ] "Show upgrade options" → AI asks permission before showing plan card (R3)
[ ] "I'll try the tips first" → END FLOW
[ ] Permission granted → UpgradeFlow card renders with correct pricing (FIX-005 not regressed)

SPRINT 2 REGRESSION CHECK
[ ] Derek's upgrade flow still shows prorated vs. renewal choice (not phone questions)
[ ] FIX-007: "Total Base 5G" still shows as current plan in upgrade card
[ ] FIX-008: SMS modal after upgrade success shows upgrade-specific message
```

**Regression risk:** High. Confirm all Sprint 2 Derek fixes still intact.

---

### S3-007 Verification — Angela 4-Step Diagnosis Walk-through

**What was updated:** Angela's walk-through updated from 3-step checklist to 4 sequential Q&A steps.

```
SETUP: Select Angela (us-005) → tap "My calls keep dropping" or "Walk me through a fix"

OUTAGE CHECK (auto-runs)
[ ] AI states it is checking for outages automatically — no pill tap required
[ ] Result surfaces proactively:
    IF outage: AI announces outage with ETA, offers notification
    IF no outage: AI says "No active outages" and begins device diagnosis

STEP 1 — Device restart
[ ] AI asks about recent restart of Samsung Galaxy A54
[ ] Quick reply pills: "Yes, still the same" / "No — let me try" / "I restart it often"
[ ] "No — let me try" → AI waits / continues to Step 2

STEP 2 — Indoors vs. everywhere
[ ] AI asks if issue is worse indoors
[ ] Quick reply pills: "Worse indoors" / "Same everywhere" / "Not sure"
[ ] "Worse indoors" → AI provides building signal tip and asks if stepping outside helps

STEP 3 — Airplane Mode toggle
[ ] AI instructs: toggle Airplane Mode on for 10 seconds, then off
[ ] Quick reply pills: "Done — still not working" / "That helped!"
[ ] "That helped!" → END FLOW (success message, no further diagnosis)

STEP 4 — SIM reseating
[ ] AI instructs SIM card reseating step for Samsung Galaxy A54
[ ] Quick reply pills: "Done — still the same" / "Fixed it!" / "How do I do that?"
[ ] "Fixed it!" → END FLOW

ALL STEPS DONE — ESCALATION
[ ] After Step 4 "still the same": AI shows escalation prompt
[ ] Options visible:
    "Show plan options with Wi-Fi Calling"
    "Talk to support"
    "Schedule a callback"

[ ] "Show plan options with Wi-Fi Calling" → requires permission grant (R3)
[ ] Plan card shows Wi-Fi Calling option highlighted
[ ] "Talk to support" → live chat or callback offered
[ ] Time-based check (if FIX-013 is Done): outside hours shows callback only

ANGELA-SPECIFIC CHECKS
[ ] AI opening message does NOT ask "How many times have you called?" — states it (R1)
[ ] "5 times this month" appears as a fact in the opening AI message
[ ] "2 bars average signal" appears as a fact — NOT a question
[ ] "4 dropped calls this week" appears as a fact
```

**Regression risk:** Medium — replaces existing Angela flow. Confirm outage detection
branch still works and both "Fixed it!" and "Still not working" paths reach valid end states.

---

### S3-008 Verification — Opening Messages Don't Ask providerKnows Facts

**What was changed:** Turn 1 AI opening messages audited across all personas.

Run this check for every persona. For each one: tap a relevant intent pill and verify
the AI's first response states known facts rather than asking about them.

```
MARIA (us-001)
[ ] Tap "Why am I running out?" pill
[ ] AI does NOT ask: "How often does this happen?"
[ ] AI DOES state: "11 of the last 12 months" (or equivalent)

DEREK (us-006)
[ ] Tap any upgrade/data pill
[ ] AI does NOT ask: "Are you running low on data?"
[ ] AI DOES state: "You've hit your cap again" + "3rd month in a row"

ANGELA (us-005)
[ ] Tap any support pill
[ ] AI does NOT ask: "How many times have you called support?"
[ ] AI DOES state: "5 times this month" or "5 support calls"

CARLOS (us-002)
[ ] Tap renewal pill
[ ] AI does NOT ask: "What plan are you on?"
[ ] AI DOES state: "You're on Total Base 5G — expires in 2 days" or equivalent

ANA (us-007)
[ ] Tap international pill
[ ] AI does NOT ask: "Do you make international calls?"
[ ] AI DOES state: "You called Colombia 8 times this month"

JAMES (us-004)
[ ] Load activation flow
[ ] AI does NOT ask: "What device do you have?"
[ ] AI DOES state: "I can see you have an iPhone 15 Pro"

PRIYA (us-003)
[ ] Tap refill pill
[ ] AI does NOT ask: "How many Rewards Points do you have?"
[ ] AI DOES surface: "You have 1,020 Rewards Points — free 5 GB available"

ROBERT (us-008)
[ ] Load plans comparison
[ ] AI does NOT ask: "How many lines do you manage?"
[ ] AI DOES state: "You're on Total Base 5G with 4 lines"
```

**Regression risk:** Low — wording change only. Confirm conversation routing not affected.

---

### S3-009 Verification — Carlos Renewal Date Fix

**What was fixed:** Renewal date changed from Mar 28 to Mar 30 in personas.js.

```
[ ] Select Carlos (us-002) via persona dropdown
[ ] Mini-dashboard shows: "Renews: Mar 30, 2026"
[ ] Mini-dashboard shows: "2 days away" (relative to current date context)
[ ] Intent signal reads: "Plan expires in 2 days — service will pause Mar 30"
[ ] Signal DOES NOT read "Mar 28" anywhere

[ ] Start renewal conversation
[ ] AI opening message references "Mar 30" (not Mar 28)
[ ] Confirm no hardcoded "Mar 28" visible in the UI in any state

[ ] Grep check: search src/ for "Mar 28" — confirm zero results referencing Carlos
```

**Regression risk:** Very low — single date value change.

---

### S3-010 Verification — Custom Persona Dropdown (carry-forward from FIX-011)

Same verification spec as Sprint 2 FIX-011:

```
[ ] Persona dropdown trigger in Header is NOT a native OS <select> widget
[ ] Trigger styled with teal brand colors consistent with EN/ES toggle
[ ] Click trigger → custom panel opens below
[ ] Panel shows all 8 personas with name + hint text visible
[ ] Selected persona is visually highlighted (teal indicator or border)
[ ] Click a persona → panel closes → state updates (dashboard, signals, pills change)
[ ] Click outside panel → panel closes without selecting
[ ] Panel does not overflow on 375px (mobile) width — scrollable if needed
[ ] All 8 personas still selectable (no regression on persona switching)
[ ] No native OS select widget visible in any browser (Chrome, Safari, Firefox)
```

---

## Part 2 — Sprint 2 Regression Suite

After verifying all Sprint 3 tasks, run this regression suite to confirm Sprint 2
passing checks have not been broken.

```
REGRESSION — Sprint 2 Critical Fixes
[ ] FIX-001: Maria "Change my plan" branch — quick reply pills render after turn 2
[ ] FIX-002: ES mode — Maria's pills in Spanish, all 8 pills translate
[ ] FIX-003: ES mode — SignalBanner CTA reads "Recarga Rápida" (not "Quick Refill")
[ ] FIX-004: Derek upgrade pill → upgrade branch (NOT phone questions)
[ ] FIX-005: Robert UpgradeFlow — 3 plans, line count toggle, correct 4-line pricing
[ ] FIX-006: RefillFlow — shows persona's actual saved card (not hardcoded Visa 4821)
[ ] FIX-007: UpgradeFlow — shows persona's actual plan name (not hardcoded)
[ ] FIX-008: SMS modal — context-aware message for refill vs. upgrade vs. international
[ ] FIX-009: InternationalFlow — shows "Colombia" for Ana (not "Mexico")
[ ] FIX-010: Carlos renewal pill → renewal branch with AutoPay option

REGRESSION — Sprint 1 Foundation Checks
[ ] ?persona=maria loads Maria R. (us-001) — correct dashboard state
[ ] ?persona=us-006 loads Derek W. (us-006) — correct dashboard state
[ ] No URL param → defaults to Maria R. (us-001)
[ ] MiniDashboard: exactly 3 signals per persona
[ ] Data meter color: Maria 16% → red / Derek 0% → red / Ana 64% → teal
[ ] James (us-004): empty dashboard — no meter, no plan, no renewal
[ ] Priya (us-003): free rewards option surfaced FIRST before paid option
[ ] Turn 1 pill tap → AI clarifying Q fires BEFORE plan card appears (PRD E4)
[ ] RefillFlow CTA → 1.5s+ processing animation → SMS modal fires
[ ] SMS modal: iPhone frame + Dynamic Island + green bubble + backdrop blur + X button
[ ] Trust banner → transparency panel slides in from right
[ ] Language toggle EN → ES: headline, subhead, trust banner, input placeholder all translate
```

---

## Part 3 — Full Persona Demo Run (pre-review smoke test)

Run these end-to-end flows before each review session.

### us-001 Maria R. — Diagnosis + Refill happy paths

```
PATH A — Full diagnosis to escalation:
[ ] Load ?persona=maria
[ ] Tap "Why am I running out?" → diagnosis intro appears
[ ] Walk all 3 steps → free fix suggestions appear → escalation prompt
[ ] Tap "Add data for now — $15" → RefillFlow → 1.5s animation → SMS modal (green bubble)

PATH B — Direct refill (skip diagnosis):
[ ] Load ?persona=maria
[ ] Tap "Quick Refill — $15" → refill confirmation → processing → SMS modal
```

### us-005 Angela K. — Full diagnosis walk-through

```
[ ] Load ?persona=angela
[ ] Tap "Walk me through a fix"
[ ] Outage check auto-runs → "No active outages" message
[ ] Complete all 4 diagnostic steps → escalation prompt appears
[ ] Tap "Talk to support" → live chat / callback option shown
```

### us-006 Derek W. — Diagnosis + Upgrade happy paths

```
PATH A — Diagnosis to upgrade:
[ ] Load ?persona=derek
[ ] Tap "Why do I keep hitting my cap?" → 2-step diagnosis
[ ] Tap "Show upgrade options" → permission ask → UpgradeFlow renders
[ ] Prorated vs. renewal choice visible → confirm → 1.5s animation → SMS modal (upgrade-specific text)

PATH B — Direct upgrade (skip diagnosis):
[ ] Load ?persona=derek
[ ] Tap "Upgrade to Unlimited — $55/mo" → upgrade flow (no diagnosis gate)
```

### us-002 Carlos M. — Renewal flow

```
[ ] Load ?persona=carlos
[ ] Dashboard shows: "Renews: Mar 30, 2026" (not Mar 28)
[ ] Tap renewal pill → AutoPay savings offer surfaces
[ ] Confirm renewal → SMS modal fires
```

### us-003 Priya S. — Rewards redemption

```
[ ] Load ?persona=priya
[ ] Free rewards option (1,000 pts → free 5 GB) is FIRST pill and first AI mention
[ ] Tap "Redeem 1,000 pts" → redemption confirmation → SMS modal
```

### us-007 Ana G. — International add-on

```
[ ] Load ?persona=ana
[ ] Colombia calling signal visible (NOT Mexico)
[ ] Tap free redemption pill → add-on confirms → SMS modal: Colombia-specific message
```

---

## How to Write a QA REVIEW Entry — Sprint 3

```markdown
### QA REVIEW — S3-NNN
**QA Status:** ✅ Passed | ⚠️ Passed with notes | ❌ Failed | ⏭️ Not yet testable
**Tested on:** [Local / Vercel] · [Date] · [Persona(s) tested]

**Fix verification checks:**
- [x] [Specific check from above] — PASS
- [ ] [Failed check] — FAIL — see issue below

**Regression checks (R9):**
- [x] Sprint 2 FIX-NNN — no regression
- [x] Sprint 1 TASK-NNN — no regression
- [ ] [Regression found] — see issue below

**Issues found:**
→ Issue: [what is wrong]
→ Expected: [what persona-flows.md or personas.js says should happen]
→ Actual: [what actually happened]
→ Severity: Critical | High | Medium | Low
→ Suggested fix: [if obvious]

**QA recommendation:**
Approved / Approved with notes / Revisions required / Blocked
```

---

## QA Summary Template — Sprint 3

After completing all verifications, update `## QA Summary` in `tasklist_sprint3.md`:

```markdown
## QA Summary — Sprint 3

**Last QA run:** [Date]
**Tested by:** QA Agent
**App state:** Local dev / Vercel

| Task | Description | Dev Status | QA Status | Severity |
|------|-------------|-----------|-----------|----------|
| S3-001 | providerKnows in system prompt | [x] Done | ✅ / ⚠️ / ❌ | — |
| S3-002 | diagnose_usage action handler | | | |
| S3-003 | Maria pill order | | | |
| S3-004 | Derek pill order | | | |
| S3-005 | Maria diagnosis flow | | | |
| S3-006 | Derek diagnosis flow | | | |
| S3-007 | Angela 4-step diagnosis | | | |
| S3-008 | Opening messages audit | | | |
| S3-009 | Carlos date fix | | | |
| S3-010 | Custom dropdown | | | |

**Sprint 3 demo readiness:**
[ ] Ready for Lam review (S3-001 through S3-004 must pass)
[ ] Ready for Srini review (S3-001 through S3-009 must pass)

**Regression status:**
[ ] All Sprint 1 + Sprint 2 passing checks confirmed — no regressions
[ ] Regressions found — listed above

**Critical blockers:**
Any S3 task that failed or any Sprint 1/2 regression introduced.

**Notes for next dev pass:**
Patterns, systemic issues, or remaining items.
```

---

## Severity Definitions — Sprint 3

| Severity | Definition | Example |
|---|---|---|
| **Critical** | Breaks a PRD red check OR breaks a Sprint 1/2 passing check | providerKnows facts still being asked; diagnosis pill routes to wrong flow |
| **High** | Diagnosis flow doesn't match persona-flows.md spec | Wrong step order; missing escalationPrompt; free fixes not shown |
| **Medium** | Partial implementation — some steps work, edge cases don't | Skip pill works but direct pill doesn't; one persona diagnosis works, another doesn't |
| **Low** | Minor cosmetic or wording mismatch | Intro text slightly different from persona-flows.md |

---

## QA Agent Rules — Sprint 3

- **Never edit a developer's task entry.** Only append QA REVIEW blocks below them.
- **Always run the full regression suite.** A Sprint 3 change that breaks a Sprint 2 pass is worse than not implementing Sprint 3.
- **Verify all affected personas** — not just the primary one named in the task.
- **The escape hatch is non-negotiable.** If diagnosis is forced on a customer who tapped "Quick Refill," mark as Critical fail.
- **Check the providerKnows rule strictly.** Any Turn 1 AI question whose answer is in providerKnows[] is a High severity failure.
- **Time the processing animation** with a real timer every sprint. "Looked fine" is not a pass.

---

*ClearPath AI · QA Agent · v3.0 · Sprint 3 · March 2026*
*Previous versions: qa-agent.md v1.0 (Sprint 1) · v2.0 (Sprint 2)*
