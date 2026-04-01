# ClearPath AI — Developer Agent Workflow
**Role:** Developer Agent — Sprint 3 (Diagnosis Flow + Persona Context Pass)
**Reads:** `docs/persona-flows.md` · `docs/PRD_v3.0_Sprint2.md` · `src/data/personas.js`
**Writes to:** `planning/tasklist_sprint3.md`
**Codebase:** `clearpath-ai/src/`
**Sprint:** Mon Mar 30 → Thu Apr 3, 2026

> **Sprint 3 context:** Sprints 1 and 2 built and polished the prototype foundation.
> This sprint implements the diagnosis-first conversation pattern mandated in the Mar 28
> Lam review. The `personas.js` and `persona-flows.md` files have been fully rebuilt —
> read them before writing a single line of code. Every new task in this sprint flows
> from those two documents.

---

## Agent Identity

You are the **ClearPath AI Developer Agent** running Sprint 3. Your job is to implement
the diagnosis-first conversation pattern across all relevant personas, wire `providerKnows[]`
into the system prompt, and make the suggested action pills reflect the new per-persona
ordering. Work methodically, one task at a time, and never mark Done without running
the R9 regression checks from Sprint 2.

---

## Before You Write a Single Line of Code

Run these steps in order. Do not skip any.

### Step 1 — Read your source files

```
Read: src/data/personas.js         → REBUILT Mar 28. This is ground truth.
                                      New fields: diagnosisFlow, providerKnows[],
                                      updated suggestedActions order, strengthened
                                      conversationContext. Read in full before touching
                                      any component.

Read: docs/persona-flows.md        → REBUILT Mar 28. Full conversation flows for all
                                      8 personas including the new diagnosis branches
                                      for us-001 (Maria), us-005 (Angela), us-006 (Derek).
                                      Your implementation must match these flows exactly.

Read: planning/tasklist_sprint3.md → Check current status before touching anything.
                                      Never redo work already marked Done.
```

### Step 2 — Understand the new data shape

Three new fields were added to personas.js in Sprint 3. Know them before implementing:

```js
// 1. providerKnows[] — facts the system already has; NEVER ask about these
persona.providerKnows
// [ 'current data balance (0.8 GB)', 'plan renewal date (Apr 9, 2026)', ... ]

// 2. diagnosisFlow — structured diagnostic path for relevant personas
persona.diagnosisFlow
// { enabled: bool, intro: string, steps: [], freeFixSuggestions: [], escalationPrompt: string }

// 3. getProviderContext(persona) — helper that formats providerKnows[] for system prompt injection
import { getProviderContext } from '../data/personas.js';
getProviderContext(persona) // → formatted string for system prompt
```

### Step 3 — Check what's already Done in Sprint 3

Open `planning/tasklist_sprint3.md` and confirm the status of every task.
Skip anything already marked `[x] Done`.

---

## Implementation Rules

All Sprint 1 and 2 rules (R1–R9) remain in force. Three new rules added in Sprint 3:

### R1 — Never ask what the provider already knows *(reinforced)*
```
Before generating ANY clarifying question, check persona.providerKnows[].
If the answer is in that list → state it, don't ask.

✗  AI: "How often do you run out of data?"
✓  AI: "We can see you've run out 11 of the last 12 months — so you're
        probably here for one of two reasons..."
```

### R2 — Diagnosis gate before upsell *(reinforced)*
```
For personas where diagnosisFlow.enabled === true:
Order: show 3 pills (diagnose / quick fix / plan change)
  → if diagnose: run diagnosisFlow.steps[] → freeFixSuggestions → escalationPrompt
  → only THEN (and only with permission): surface plan card
  → if quick fix or plan change tapped directly: proceed normally (escape hatch honored)
```

### R10 — ⭐ NEW — Inject providerKnows into system prompt
```js
// In systemPrompt.js or wherever system prompt is built:
const providerContext = getProviderContext(persona);
// Append to system prompt so AI never asks about known facts.
// Format: "The provider already knows: • current data balance (0.8 GB) • ..."
```

### R11 — ⭐ NEW — Diagnosis flow is an offer, not a gate
```
The diagnosis path must ALWAYS be one pill among three — never the only option.
Customers must be able to tap "Quick Refill — $15" or "Change my plan" and proceed
without being forced through diagnosis questions.
diagnosisFlow.enabled === true means offer diagnosis — not require it.
```

### R12 — ⭐ NEW — Diagnosis pill is first for us-001 and us-006
```
For Maria (us-001):  first pill = "Why am I running out?"   (action: diagnose_usage)
For Derek (us-006):  first pill = "Why do I keep hitting my cap?" (action: diagnose_usage)
For Angela (us-005): first pill = "Check for outages in my area"  (action: check_outage)
All other personas:  pill order unchanged from Sprint 2 fixes.
```

### R3–R9 from Sprint 2 remain in force
```
R3 — Ask permission before surfacing plan cards
R4 — 3 signals per persona from persona.signals[]
R5 — Sensible defaults with confirmation
R6 — Escape hatch preserved ("Show me everything")
R7 — Processing animation minimum 1.5s
R8 — iPhone SMS modal after any transaction
R9 — Never break a Sprint 1 or Sprint 2 passing check
```

---

## Sprint 3 Task Execution Order

Work through tasks in this order. Each priority group must be stable before moving on.

```
Priority 1 — Critical (implement before any review session)
  [ ] S3-001  Inject providerKnows into system prompt via getProviderContext()
  [ ] S3-002  Add 'diagnose_usage' action handler in demoResponses.js
  [ ] S3-003  us-001 (Maria): pill order → "Why am I running out?" first
  [ ] S3-004  us-006 (Derek): pill order → "Why do I keep hitting my cap?" first

Priority 2 — High (implement before Lam review)
  [ ] S3-005  us-001 (Maria): wire diagnosisFlow steps into chat turn sequence
  [ ] S3-006  us-006 (Derek): wire diagnosisFlow steps into chat turn sequence
  [ ] S3-007  us-005 (Angela): update diagnostic walk-through to match 4-step diagnosisFlow

Priority 3 — Medium (implement before Srini review)
  [ ] S3-008  All personas: opening AI message must never ask a providerKnows fact
  [ ] S3-009  Carlos (us-002): fix renewal date to Mar 30 in dashboard render
  [ ] S3-010  FIX-011 carry-forward: persona dropdown custom styled component

Priority 4 — Low / polish
  [ ] S3-011  FIX-012 carry-forward: James ActivationFlow inline card
  [ ] S3-012  Update signalBanners.js to use persona.signals[0] as source of truth
```

---

## Per-Task Specifications

---

### S3-001 — Inject providerKnows into System Prompt

**File:** `src/data/systemPrompt.js`

**What to do:**
Import `getProviderContext` from `personas.js` and append its output to the system prompt
string before the conversation begins. This tells the AI layer which facts it already has
so it never asks the customer for them.

```js
// In buildSystemPrompt(persona) or equivalent:
import { getProviderContext } from '../data/personas.js';

const providerContext = getProviderContext(persona);
// Append to system prompt:
// "\n\n---\n" + providerContext
```

**Verification:**
- Open browser console → confirm system prompt logged on persona load includes bullet list of providerKnows facts
- Swap persona → confirm providerContext updates to new persona's facts
- Maria's system prompt includes: "current data balance (0.8 GB)", "11 of last 12 months"

---

### S3-002 — Add `diagnose_usage` Action Handler

**File:** `src/utils/demoResponses.js`

**What to do:**
Add a new action type `'diagnose_usage'` that triggers the diagnosis conversation branch.
When a pill with `action: 'diagnose_usage'` is tapped, the chat should begin the
`diagnosisFlow.intro` message from the persona and queue the first `diagnosisFlow.steps[0]` question.

```js
case 'diagnose_usage': {
  const flow = persona.diagnosisFlow;
  return {
    message: flow.intro,
    nextStep: 'diagnosis_step_1',
    quickReplies: ['Let\'s do it', 'Skip — just add data', 'Skip — change my plan'],
  };
}
```

**Verification:**
- Maria: tap "Why am I running out?" → AI responds with diagnosisFlow.intro text
- Derek: tap "Why do I keep hitting my cap?" → AI responds with Derek's diagnosisFlow.intro
- "Skip — just add data" pill still routes to refill flow (escape hatch honored)

---

### S3-003 — Maria Pill Order (Diagnosis First)

**File:** `src/components/LandingScreen/LandingScreen.jsx` and/or pill rendering logic

**What to do:**
For us-001, the first pill must be `{ label: 'Why am I running out?', action: 'diagnose_usage' }`.
This is already defined in `personas.js` `suggestedActions[0]` — ensure the rendering layer
reads pill order from `persona.suggestedActions` in array order, not a hardcoded override.

```js
// Correct: reads from persona data — order defined in personas.js
const pills = persona.suggestedActions.map(a => ({ label: a.label, action: a.action }));

// Wrong: any sort, filter, or reorder applied after reading from persona
```

**Verification:**
- Maria: first pill visible is "Why am I running out?" (EN) / "¿Por qué se me acaban los datos?" (ES)
- Second pill is "Quick Refill — $15"
- Third pill is "Change my plan"

---

### S3-004 — Derek Pill Order (Diagnosis First)

**File:** Same pill rendering logic as S3-003

**What to do:**
Same as S3-003 but for us-006 (Derek). His `suggestedActions[0]` is now
`{ label: 'Why do I keep hitting my cap?', action: 'diagnose_usage' }`.
Verify pill order reads from persona data without reordering.

**Verification:**
- Derek: first pill visible is "Why do I keep hitting my cap?"
- Second pill is "Upgrade to Unlimited — $55/mo"
- Third pill is "Start at next renewal (no charge)"

---

### S3-005 — Maria Diagnosis Flow Wiring

**Files:** `src/utils/demoResponses.js` · `src/context/ChatContext.jsx`

**What to do:**
Implement the multi-step diagnosis conversation for Maria. After the intro message (S3-002),
the chat must walk through `diagnosisFlow.steps[]` in order, show `freeFixSuggestions[]`
after step 3, then surface the `escalationPrompt` with three exit options.

Step sequence from `persona-flows.md`:
1. Intro + "Let's do it" / "Skip — just add data" / "Skip — change my plan"
2. Step 1: Wi-Fi question with quick replies
3. Step 2: Video streaming question
4. Step 3: Background apps question
5. Free fix suggestions displayed
6. Escalation prompt: "I'll try those" / "Add data for now — $15" / "Show plan options"

**Verification:**
- Maria: complete full diagnosis walkthrough from pill tap through escalation prompt
- "Skip" at any step routes directly to refill or plan change branch (no dead ends)
- After escalation: "Add data for now" → triggers RefillFlow (R7, R8 apply)
- After escalation: "Show plan options" → asks permission before showing plan card (R3)

---

### S3-006 — Derek Diagnosis Flow Wiring

**Files:** Same as S3-005

**What to do:**
Implement Derek's shorter diagnosis path (`diagnosisFlow.steps[]` — 2 steps only for Derek,
since the 10/12 pattern strongly suggests a plan change is needed). After step 2, surface
`freeFixSuggestions[]` and then `escalationPrompt` which routes to upgrade options.

**Verification:**
- Derek: 2-step diagnosis then escalationPrompt
- Escalation prompt: "Show upgrade options" / "I'll try the tips first"
- "Show upgrade options" → asks "Want to see your upgrade options?" before showing plan card (R3)

---

### S3-007 — Angela 4-Step Diagnosis Walk-through

**Files:** `src/utils/demoResponses.js` · `src/components/ChatArea/ChatArea.jsx`

**What to do:**
Update Angela's self-fix flow to match the 4-step `diagnosisFlow.steps[]` in personas.js:
1. Outage check (auto-runs, surfaces result)
2. Device restart question
3. Indoors vs. everywhere question
4. Airplane Mode toggle instruction
5. SIM reseating instruction
Then `freeFixSuggestions[]` and `escalationPrompt`.

The current Angela flow (Sprint 2) has a generic 3-step checklist. Replace with the 4
sequential back-and-forth steps from `persona-flows.md`.

**Verification:**
- Angela: outage check auto-runs on flow start (no pill tap required)
- 4 sequential diagnostic questions in correct order
- "Fixed it!" at any step → END FLOW (no forced continuation)
- "Still not working" after all 4 steps → escalationPrompt with Wi-Fi Calling option and live support

---

### S3-008 — Opening Messages Must Not Ask providerKnows Facts

**File:** `src/utils/demoResponses.js` · `src/data/systemPrompt.js`

**What to do:**
Audit every persona's Turn 1 AI opening message. For any persona where the AI is asking
a question that is listed in `persona.providerKnows[]`, replace the question with a
declarative statement and let the customer confirm or correct.

Reference mapping:
| Persona | ❌ Don't ask | ✅ Do say |
|---------|-------------|---------|
| Maria | "How often does this happen?" | "We can see this has happened 11 of the last 12 months." |
| Angela | "How many times have you called support?" | "I can see you've called us 5 times this month." |
| Derek | "Are you running low?" | "You've hit your cap again — that's 3 months in a row." |
| Carlos | "What plan are you on?" | "You're on Total Base 5G at $40/mo — it expires in 2 days." |
| Ana | "Do you make international calls?" | "I can see you called Colombia 8 times this month." |
| James | "What device do you have?" | "I can see you have an iPhone 15 Pro." |

**Verification:**
- Load each persona and tap a contextual pill
- AI Turn 1 must NOT contain any question whose answer is in providerKnows[]
- AI Turn 1 must reference the relevant providerKnows facts as statements

---

### S3-009 — Carlos Renewal Date Fix

**File:** `src/data/personas.js` (already fixed — Mar 30), any hardcoded date in components

**What to do:**
Audit all components for any hardcoded "Mar 28" renewal date for Carlos.
The personas.js source is already correct (Mar 30). The fix is to ensure no component
is overriding or hardcoding this value.

```bash
grep -r "Mar 28" src/
# Any result referencing Carlos (us-002) must be removed or made dynamic
```

**Verification:**
- Carlos dashboard shows "Renews: Mar 30, 2026" and "2 days away"
- SignalBanner subtext reads "Service will pause on Mar 30" (not Mar 28)

---

### S3-010 — Persona Dropdown Custom Styled (carry-forward from FIX-011)

**Files:** `src/components/Header/Header.jsx` · `src/components/Header/Header.module.css`

**What to do:** Same spec as FIX-011 in Sprint 2. Replace native `<select>` with a custom
`<div>`-based dropdown styled to match the EN/ES toggle pill aesthetic. Must close on
outside click. Must work on 375px mobile width.

---

## Per-Task Workflow

For each Sprint 3 task, follow this exact sequence:

```
1. READ      Re-read the task spec above AND the corresponding section in
             persona-flows.md before writing any code.

2. LOCATE    Find the exact file and line. Use grep if needed.

3. PLAN      Mark [~] In Progress in tasklist_sprint3.md and write 1–2 sentences
             on approach BEFORE writing any code.

4. IMPLEMENT Write the minimum change. Sprint 3 is an enhancement sprint —
             prefer targeted additions over refactors.

5. VERIFY    Run the verification steps listed in each task above.
             Then run the R9 regression checks (Sprint 1 + 2 passing checks).

6. LOG       Update tasklist_sprint3.md: mark [x] Done, list files changed,
             note QA focus areas.
```

---

## tasklist_sprint3.md Entry Format

```markdown
### S3-NNN — [Task name]
**Status:** [ ] Pending | [~] In Progress | [x] Done | [!] Blocked
**Priority:** 🔴 Critical | 🟡 Medium | 🟢 Low
**Persona(s):** us-001, us-006 ... (or "All")
**Files changed:**
  - `src/utils/demoResponses.js`
  - `src/data/systemPrompt.js`

**What I did:**
Brief description — what was missing, what you added, and why.

**Known gaps / QA focus:**
What should the QA agent specifically verify? Include R9 regression checks most at risk.

**Dev notes:**
Technical decisions, edge cases, or things the next developer should know.
```

---

## Key File Paths — Sprint 3 Focus Areas

```
clearpath-ai/src/
├── data/
│   ├── personas.js               ← S3-001, S3-003, S3-004, S3-009 (source of truth)
│   └── systemPrompt.js           ← S3-001 (inject providerKnows), S3-008
├── utils/
│   └── demoResponses.js          ← S3-002, S3-005, S3-006, S3-007, S3-008
├── components/
│   ├── LandingScreen/
│   │   └── LandingScreen.jsx     ← S3-003, S3-004 (pill order from suggestedActions)
│   ├── ChatArea/
│   │   └── ChatArea.jsx          ← S3-005, S3-006, S3-007 (diagnosis step rendering)
│   └── Header/
│       ├── Header.jsx            ← S3-010 (custom dropdown)
│       └── Header.module.css     ← S3-010
└── context/
    └── ChatContext.jsx           ← S3-005, S3-006 (diagnosis state tracking)
```

---

## Definition of Done — Sprint 3

A task is only Done when ALL of the following are true:

- [ ] The specific behavior from `persona-flows.md` is implemented and matches exactly
- [ ] providerKnows facts are never asked — only stated — for the affected persona(s)
- [ ] Escape hatch preserved — diagnosis is an offer, not a gate
- [ ] R9 regression checks pass — no Sprint 1 or Sprint 2 passing checks broken
- [ ] No new console errors introduced
- [ ] `tasklist_sprint3.md` entry complete: files changed, QA focus noted
- [ ] Fix works for all affected personas — not just the primary one

---

## Coordination Notes

S3-001 (providerKnows injection) is a prerequisite for S3-008 (opening message audit).
Implement S3-001 first so the system prompt contains the facts before you audit whether
the AI is asking for them.

S3-003 and S3-004 (pill order) are a prerequisite for S3-005 and S3-006 (diagnosis wiring).
The diagnosis pill must exist and be tappable before you can test the flow it triggers.

S3-005 (Maria) and S3-006 (Derek) share the same `demoResponses.js` action handler (S3-002).
Implement S3-002 once generically, then customize per-persona in S3-005 and S3-006.

---

*ClearPath AI · Developer Agent · v3.0 · Sprint 3 · March 2026*
*Previous versions: dev-agent.md v1.0 (Sprint 1) · v2.0 (Sprint 2)*
