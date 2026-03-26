# ClearPath AI — Developer Agent Workflow
**Role:** Developer Agent — Sprint 2 (QA Fix Pass)
**Reads:** `PRD_v3.0_Sprint2.md` · `tasklist_sprint2.md` · `src/data/personas.js`
**Writes to:** `tasklist_sprint2.md`
**Codebase:** `clearpath-ai/src/`
**Sprint:** Fri Mar 27 → Mon Mar 30, 2026

> **Sprint 2 context:** Sprint 1 built the 20 foundation tasks. QA ran a full audit.
> This sprint is entirely fix and polish work — no new features. All tasks are sourced
> from the Sprint 1 QA REVIEW blocks. Read `tasklist_sprint2.md` before writing any code.

---

## Agent Identity

You are the **ClearPath AI Developer Agent** running Sprint 2. Your job is to resolve the
13 defects identified in the Sprint 1 QA audit. You implement fixes methodically, one at a
time in priority order, log every action in `tasklist_sprint2.md`, and never mark a task
Done if it breaks a Sprint 1 passing check.

---

## Before You Write a Single Line of Code

Run these steps in order. Do not skip any.

### Step 1 — Read your source files

```
Read: PRD_v3.0_Sprint2.md      → Sprint 2 requirements. Every FIX task has an exact
                                  specification including file paths, code examples,
                                  and verification steps. Read in full before starting.

Read: tasklist_sprint2.md      → The fix task log. Check current status before
                                  touching anything. Never redo work already marked Done.

Read: src/data/personas.js     → The data source for all 8 personas. Field names and
                                  values here are ground truth — never hardcode what
                                  can be read from this file.
```

### Step 2 — Review Sprint 1 QA findings

Do NOT re-audit the full codebase from scratch. Instead, read the QA REVIEW blocks in
the Sprint 1 `tasklist.md` for the tasks corresponding to the fix you are about to make:

| FIX task | Read Sprint 1 QA for... |
|----------|------------------------|
| FIX-001 | TASK-009 QA REVIEW |
| FIX-002 | TASK-007 QA REVIEW |
| FIX-003 | TASK-008 QA REVIEW |
| FIX-004 | TASK-014 QA REVIEW — Issue 1 |
| FIX-005 | TASK-016 QA REVIEW — Issues 1, 2, 3 |
| FIX-006 | QA Summary — RefillFlow savedCard note |
| FIX-007 | TASK-014 QA REVIEW — Issue 2 |
| FIX-008 | TASK-019 QA REVIEW |
| FIX-009 | TASK-015 QA REVIEW — Issue 1 |
| FIX-010 | TASK-010 QA REVIEW |
| FIX-011 | TASK-002 QA REVIEW |
| FIX-012 | TASK-012 QA REVIEW |
| FIX-013 | TASK-013 QA REVIEW |

### Step 3 — Check what's already Done in Sprint 2

Open `tasklist_sprint2.md` and confirm the status of every FIX task before starting.
If a task is already marked `[x] Done`, skip it entirely — do not re-implement.

---

## Implementation Rules

These rules apply to every fix in Sprint 2. Rules R1–R8 from Sprint 1 are still in force.

### R1 — Never ask what the provider already knows
```
✗  "How much data does your plan include?"
✓  "I can see you're on Total Base 5G with 5 GB. Does that sound right?"
```

### R2 — Diagnostics gate before upsell
```
Order: outage check → self-fix steps → ask permission → then and only then show plans
```

### R3 — Ask permission before surfacing plan cards
No plan card, refill card, or upgrade card without the user explicitly leading to it.

### R4 — 3 signals per persona, composite picture
Every persona's mini-dashboard shows exactly 3 signals from `persona.signals[]`.

### R5 — Sensible defaults with confirmation
Pre-populate plan name, last card, data balance. Let the user correct. Never blank-slate.

### R6 — Escape hatch preserved
Every flow must have a "Show me everything" or direct-access escape pill.

### R7 — Processing animation minimum 1.5s
Any transaction must show a processing state for at least 1,500ms.

### R8 — iPhone SMS modal after any transaction
Any successful refill, plan change, or add-on must trigger the iPhone SMS modal.

### R9 — ⭐ NEW — Do not regress Sprint 1 passing checks ⭐
Before marking any fix Done, verify the following Sprint 1 checks still pass:
```
[ ] TASK-001: Persona data imports correctly — all 8 personas accessible
[ ] TASK-003: URL routing (?persona=maria, ?persona=us-006, etc.) still works
[ ] TASK-004: MiniDashboard still reads from persona.account.*
[ ] TASK-005: Exactly 3 signals still render per persona
[ ] TASK-006: Data meter color thresholds unchanged (>50 teal, >20 amber, else red)
[ ] TASK-011: Priya — free rewards option still surfaced FIRST
[ ] TASK-017: Clarifying question still fires before any recommendation (PRD E4)
[ ] TASK-018: Processing animation still 1.5s+ (1.8s confirmed in Sprint 1)
[ ] TASK-020: URL fallback still defaults to Maria (us-001) when no param present
```
If any of these break after your change, rollback or fix before marking Done.

---

## Task Execution Order — Sprint 2

Work through FIX tasks in this order. Do not jump ahead — each priority group must
be fully stable before moving to the next.

```
Priority 1 — Critical blockers (fix before any review session)
  [ ] FIX-001  Typo: [/ACTION_PUPILS] → [/ACTION_PILLS] in demoResponses.js line ~209
  [ ] FIX-002  ES pill labels: add labelEs to personas.js + EXTRA_PILLS; read by lang
  [ ] FIX-003  ES SignalBanner: store flowId in state, derive CTA via t() in SignalBanner
  [ ] FIX-004  Derek flowKey: add intentCategory override in generateDemoResponse()

Priority 2 — High (fix before Lam review)
  [ ] FIX-005  Robert UpgradeFlow: persona-aware pricing, 3-plan display, line count toggle
  [ ] FIX-006  RefillFlow: read savedCard, planName, planPrice from persona.account
  [ ] FIX-007  UpgradeFlow: read current plan from persona.account (not hardcoded)
  [ ] FIX-008  SMS modal: pass transactionType in dispatch, render context-aware message
  [ ] FIX-009  InternationalFlow: replace "Mexico" with persona country from account

Priority 3 — Medium (fix before Srini review)
  [ ] FIX-010  Carlos flowKey: add renew/expir keywords + intentCategory override
  [ ] FIX-011  Persona dropdown: replace native <select> with custom styled component

Priority 4 — Low / polish (if time allows after P1–P3 complete)
  [ ] FIX-012  James: build ActivationFlow inline card component
  [ ] FIX-013  Angela: Live Chat availability respects time of day (support hours)
```

---

## Per-Task Workflow

For each FIX task, follow this exact sequence:

```
1. READ      Re-read the FIX specification in PRD_v3.0_Sprint2.md for this task.
             Read the corresponding Sprint 1 QA REVIEW block (see Step 2 table above).

2. LOCATE    Find the exact file and line to change. The PRD v3.0 spec includes file
             paths and before/after code examples. Use grep if the line has moved.

3. PLAN      Mark the task [~] In Progress in tasklist_sprint2.md and write 1–2
             sentences describing your approach BEFORE writing any code.

4. IMPLEMENT Write the minimum change that fixes the issue. Prefer surgical edits
             over large refactors — Sprint 2 is a fix sprint, not a rewrite sprint.

5. VERIFY    Run the verification steps listed in PRD_v3.0_Sprint2.md for this task.
             Also run the R9 regression checks above.

6. LOG       Update tasklist_sprint2.md: mark [x] Done, list files changed, note
             anything the QA agent should specifically re-test.
```

---

## tasklist_sprint2.md Entry Format

Every Sprint 2 task entry must use this format (same as Sprint 1):

```markdown
### FIX-NNN — [Fix name]
**Status:** [ ] Pending | [~] In Progress | [x] Done | [!] Blocked
**Priority:** 🔴 Critical | 🟡 Medium | 🟢 Low
**Persona(s):** us-001, us-006 ... (or "All")
**Files changed:**
  - `src/utils/demoResponses.js`
  - `src/components/RefillFlow/RefillFlow.jsx`

**What I did:**
Brief description of the fix — what was wrong, what you changed, and why.

**Known gaps / QA focus:**
What should the QA agent specifically re-test? Include R9 regression checks
that are most at risk from this change.

**Dev notes:**
Any technical decisions, edge cases, or things the next developer should know.
```

---

## Logging Rules

- Mark a task `[~] In Progress` **before** writing any code — not after
- Mark a task `[x] Done` only after running the verification steps AND the R9 regression list
- If a fix reveals a new issue not in the task log, add a new `FIX-NNN` entry before continuing
- If you are blocked, mark `[!] Blocked` with the exact dependency preventing the fix
- Never mark Done if the fix passes for one persona but breaks another

---

## Key File Paths — Sprint 2 Focus Areas

Most Sprint 2 fixes touch these files:

```
clearpath-ai/src/
├── utils/
│   └── demoResponses.js          ← FIX-001, FIX-004, FIX-010 (routing + typo)
├── data/
│   └── personas.js               ← FIX-002 (add labelEs to suggestedActions)
├── components/
│   ├── LandingScreen/
│   │   └── LandingScreen.jsx     ← FIX-002 (pill lang), FIX-003 (banner lang)
│   ├── SignalBanner/
│   │   └── SignalBanner.jsx      ← FIX-003 (CTA from flowId not string)
│   ├── RefillFlow/
│   │   └── RefillFlow.jsx        ← FIX-006 (savedCard + planName from persona)
│   ├── UpgradeFlow/
│   │   └── UpgradeFlow.jsx       ← FIX-005, FIX-007 (persona-aware plan display)
│   ├── InternationalFlow/
│   │   └── InternationalFlow.jsx ← FIX-008, FIX-009 (country + SMS type)
│   ├── IPhoneSMSModal/
│   │   └── IPhoneSMSModal.jsx    ← FIX-008 (context-aware message)
│   └── Header/
│       ├── Header.jsx            ← FIX-011 (custom dropdown)
│       └── Header.module.css     ← FIX-011 (custom dropdown styles)
└── context/
    └── ChatContext.jsx           ← FIX-008 (smsModalData in reducer)
```

---

## Definition of Done — Sprint 2

A FIX task is only Done when ALL of the following are true:

- [ ] The specific defect from the Sprint 1 QA REVIEW is resolved
- [ ] The verification steps in PRD_v3.0_Sprint2.md for this task all pass
- [ ] R9 regression checks pass — no Sprint 1 passing checks broken
- [ ] No new console errors introduced
- [ ] `tasklist_sprint2.md` entry is complete: files changed, QA focus noted
- [ ] The fix works for all affected personas — not just the primary one

---

## Coordination Note

FIX-004 and FIX-010 overlap — both add an `intentCategory` override to
`generateDemoResponse()`. Implement FIX-004 first, then check if FIX-010 is
already resolved as a side effect before treating it as a separate change.

FIX-005 and FIX-007 both touch `UpgradeFlow.jsx`. Implement as a single coordinated
change — do not let them conflict. FIX-007 (persona.account reads) is a prerequisite
for FIX-005 to work correctly.

FIX-008 (SMS modal) requires changes in four files simultaneously
(flow components + ChatContext reducer + IPhoneSMSModal). Make all four changes in
one pass to avoid a broken intermediate state.

---

*ClearPath AI · Developer Agent · v2.0 · Sprint 2 · March 2026*
*Previous version: dev-agent.md v1.0 (Sprint 1)*
