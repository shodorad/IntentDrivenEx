# ClearPath AI — Shared Agent Task Log
**Shared between:** Developer Agent (`dev-agent.md`) · QA Agent (`qa-agent.md`)
**Last updated:** —
**Sprint target:** Thu Mar 26 → Mon Mar 30, 2026 (Srini review)

> **Writing rules:**
> - Developer Agent: fills in task entries, marks status, logs files changed
> - QA Agent: appends `### QA REVIEW` blocks only — never edits Dev content
> - Neither agent deletes entries — use `[!] Blocked` or `[~] Superseded` if needed

---

## Codebase Audit

> Developer Agent: fill this section in before writing any code.

**Persona dropdown in Header:**
_[ Not yet audited ]_

**ChatContext.jsx — currentPersona state:**
_[ Not yet audited ]_

**MiniDashboard — accepts signals prop:**
_[ Not yet audited ]_

**IntentPills — dynamic or hardcoded:**
_[ Not yet audited ]_

**Chat state machine — clarifying step:**
_[ Not yet audited ]_

**IPhoneSMSModal — wired to transactions:**
_[ Not yet audited ]_

**Other findings:**
_[ Not yet audited ]_

---

## QA Summary

> QA Agent: update this section after each full test run.

**Last QA run:** —
**Tested by:** QA Agent
**App state:** —

| Task | Dev Status | QA Status | Top Issue Severity |
|------|-----------|-----------|-------------------|
| TASK-001 | Pending | ⏭️ Not testable | — |
| TASK-002 | Pending | ⏭️ Not testable | — |
| TASK-003 | Pending | ⏭️ Not testable | — |
| TASK-004 | Pending | ⏭️ Not testable | — |
| TASK-005 | Pending | ⏭️ Not testable | — |
| TASK-006 | Pending | ⏭️ Not testable | — |
| TASK-007 | Pending | ⏭️ Not testable | — |
| TASK-008 | Pending | ⏭️ Not testable | — |
| TASK-009 | Pending | ⏭️ Not testable | — |
| TASK-010 | Pending | ⏭️ Not testable | — |
| TASK-011 | Pending | ⏭️ Not testable | — |
| TASK-012 | Pending | ⏭️ Not testable | — |
| TASK-013 | Pending | ⏭️ Not testable | — |
| TASK-014 | Pending | ⏭️ Not testable | — |
| TASK-015 | Pending | ⏭️ Not testable | — |
| TASK-016 | Pending | ⏭️ Not testable | — |
| TASK-017 | Pending | ⏭️ Not testable | — |
| TASK-018 | Pending | ⏭️ Not testable | — |
| TASK-019 | Pending | ⏭️ Not testable | — |
| TASK-020 | Pending | ⏭️ Not testable | — |

**Demo readiness:**
- [ ] Ready for Lam review
- [ ] Ready for Srini review
- [ ] Needs fixes before review

**Critical blockers:**
_None logged yet_

**Notes for next dev pass:**
_None logged yet_

---

## Task Backlog

> Developer Agent: update this index as tasks move through states.
> Status key: `[ ] Pending` · `[~] In Progress` · `[x] Done` · `[!] Blocked`

```
Priority 1 — Foundation
  [ ] TASK-001  Persona data import into app
  [ ] TASK-002  Persona dropdown in Header component
  [ ] TASK-003  App state wired to selected persona (ChatContext)

Priority 2 — Dashboard & Signals
  [ ] TASK-004  MiniDashboard reads from persona.account
  [ ] TASK-005  3-signal composite display in MiniDashboard
  [ ] TASK-006  Data meter color tied to persona.account.dataPercent

Priority 3 — Personalized Landing
  [ ] TASK-007  IntentPills rendered from persona.suggestedActions
  [ ] TASK-008  SignalBanner copy tied to persona.signals[0]

Priority 4 — Conversation Flows
  [ ] TASK-009  US-001 Maria R. — refill + plan change branches
  [ ] TASK-010  US-002 Carlos M. — expiry + AutoPay branch
  [ ] TASK-011  US-003 Priya S. — rewards redemption branch
  [ ] TASK-012  US-004 James T. — activation flow + empty dashboard
  [ ] TASK-013  US-005 Angela K. — diagnostics gate + outage check
  [ ] TASK-014  US-006 Derek W. — upsell with prorate/renewal choice
  [ ] TASK-015  US-007 Ana G. — international add-on + points redemption
  [ ] TASK-016  US-008 Robert L. — plan comparison + 4-line toggle

Priority 5 — Clarifying question gate
  [ ] TASK-017  Chat state machine — clarifying step before recommendation

Priority 6 — Transaction flows
  [ ] TASK-018  Processing animation enforced at 1.5s minimum
  [ ] TASK-019  iPhone SMS modal wired to all successful transactions

Priority 7 — URL routing
  [ ] TASK-020  getPersonaFromURL() wired at app init
```

---

## Task Entries

---

### TASK-001 — Persona data import into app
**Status:** [ ] Pending
**Priority:** 1
**Persona(s):** All
**Files changed:**
_[ To be filled by Dev Agent ]_

**What I did:**
_[ To be filled by Dev Agent ]_

**Known gaps / QA focus:**
_[ To be filled by Dev Agent ]_

**Dev notes:**
_[ To be filled by Dev Agent ]_

---

### TASK-002 — Persona dropdown in Header component
**Status:** [ ] Pending
**Priority:** 1
**Persona(s):** All
**Files changed:**
_[ To be filled by Dev Agent ]_

**What I did:**
_[ To be filled by Dev Agent ]_

**Known gaps / QA focus:**
_[ To be filled by Dev Agent ]_

**Dev notes:**
_[ To be filled by Dev Agent ]_

---

### TASK-003 — App state wired to selected persona
**Status:** [ ] Pending
**Priority:** 1
**Persona(s):** All
**Files changed:**
_[ To be filled by Dev Agent ]_

**What I did:**
_[ To be filled by Dev Agent ]_

**Known gaps / QA focus:**
_[ To be filled by Dev Agent ]_

**Dev notes:**
_[ To be filled by Dev Agent ]_

---

### TASK-004 — MiniDashboard reads from persona.account
**Status:** [ ] Pending
**Priority:** 2
**Persona(s):** All
**Files changed:**
_[ To be filled by Dev Agent ]_

**What I did:**
_[ To be filled by Dev Agent ]_

**Known gaps / QA focus:**
_[ To be filled by Dev Agent ]_

**Dev notes:**
_[ To be filled by Dev Agent ]_

---

### TASK-005 — 3-signal composite display in MiniDashboard
**Status:** [ ] Pending
**Priority:** 2
**Persona(s):** All
**Files changed:**
_[ To be filled by Dev Agent ]_

**What I did:**
_[ To be filled by Dev Agent ]_

**Known gaps / QA focus:**
_[ To be filled by Dev Agent ]_

**Dev notes:**
_[ To be filled by Dev Agent ]_

---

### TASK-006 — Data meter color tied to persona.account.dataPercent
**Status:** [ ] Pending
**Priority:** 2
**Persona(s):** All
**Files changed:**
_[ To be filled by Dev Agent ]_

**What I did:**
_[ To be filled by Dev Agent ]_

**Known gaps / QA focus:**
Thresholds: red < 20%, amber 20–50%, green > 50%, neutral if null (us-004).

**Dev notes:**
_[ To be filled by Dev Agent ]_

---

### TASK-007 — IntentPills rendered from persona.suggestedActions
**Status:** [ ] Pending
**Priority:** 3
**Persona(s):** All
**Files changed:**
_[ To be filled by Dev Agent ]_

**What I did:**
_[ To be filled by Dev Agent ]_

**Known gaps / QA focus:**
Verify "Show me everything" escape pill is always present.

**Dev notes:**
_[ To be filled by Dev Agent ]_

---

### TASK-008 — SignalBanner copy tied to persona.signals[0]
**Status:** [ ] Pending
**Priority:** 3
**Persona(s):** All
**Files changed:**
_[ To be filled by Dev Agent ]_

**What I did:**
_[ To be filled by Dev Agent ]_

**Known gaps / QA focus:**
_[ To be filled by Dev Agent ]_

**Dev notes:**
_[ To be filled by Dev Agent ]_

---

### TASK-009 — US-001 Maria R. — refill + plan change branches
**Status:** [ ] Pending
**Priority:** 4
**Persona(s):** us-001
**Files changed:**
_[ To be filled by Dev Agent ]_

**What I did:**
_[ To be filled by Dev Agent ]_

**Known gaps / QA focus:**
- AI must acknowledge the 11/12 month pattern — not ask how often she runs out
- Clarifying Q must fire before refill card appears (PRD E4)
- After refill success: offer plan change as a follow-up (not upfront)

**Dev notes:**
_[ To be filled by Dev Agent ]_

---

### TASK-010 — US-002 Carlos M. — expiry + AutoPay branch
**Status:** [ ] Pending
**Priority:** 4
**Persona(s):** us-002
**Files changed:**
_[ To be filled by Dev Agent ]_

**What I did:**
_[ To be filled by Dev Agent ]_

**Known gaps / QA focus:**
- AutoPay savings ($5/mo) must be surfaced during renewal — not a separate flow
- Pre-select last-used plan (Total Base 5G at $40)

**Dev notes:**
_[ To be filled by Dev Agent ]_

---

### TASK-011 — US-003 Priya S. — rewards redemption branch
**Status:** [ ] Pending
**Priority:** 4
**Persona(s):** us-003
**Files changed:**
_[ To be filled by Dev Agent ]_

**What I did:**
_[ To be filled by Dev Agent ]_

**Known gaps / QA focus:**
- Free redemption option must be surfaced FIRST — before the $15 pay option
- Rewards balance (1,020 pts) visible in dashboard
- Confirm 2-tap flow: select → confirm → done (no extra screens)

**Dev notes:**
_[ To be filled by Dev Agent ]_

---

### TASK-012 — US-004 James T. — activation flow + empty dashboard
**Status:** [ ] Pending
**Priority:** 4
**Persona(s):** us-004
**Files changed:**
_[ To be filled by Dev Agent ]_

**What I did:**
_[ To be filled by Dev Agent ]_

**Known gaps / QA focus:**
- Dashboard must render in empty state — no data meter, no plan, no renewal date
- No usage-based signals shown (there is no usage)
- 340 Welcome Points shown on success screen after activation
- iOS eSIM path and port-in path both present

**Dev notes:**
_[ To be filled by Dev Agent ]_

---

### TASK-013 — US-005 Angela K. — diagnostics gate + outage check
**Status:** [ ] Pending
**Priority:** 4
**Persona(s):** us-005
**Files changed:**
_[ To be filled by Dev Agent ]_

**What I did:**
_[ To be filled by Dev Agent ]_

**Known gaps / QA focus:**
- Outage check fires BEFORE self-fix steps (this is the most critical ordering check)
- AI must NOT offer plans until after diagnostics exhausted AND user confirms nothing worked
- Self-fix steps are a checkable list — not a carousel
- After-hours: Live Chat hidden after 11:45 PM EST

**Dev notes:**
_[ To be filled by Dev Agent ]_

---

### TASK-014 — US-006 Derek W. — upsell with prorate/renewal choice
**Status:** [ ] Pending
**Priority:** 4
**Persona(s):** us-006
**Files changed:**
_[ To be filled by Dev Agent ]_

**What I did:**
_[ To be filled by Dev Agent ]_

**Known gaps / QA focus:**
- AI must lead with the 3-month pattern — do NOT ask "are you running out often?"
- Prorated amount must be calculated from daysUntilRenewal (10 days = ~$5.00)
- Disney+ activation full-screen moment must appear after Unlimited upgrade success
- "Upgrade at renewal" path must schedule, not charge today

**Dev notes:**
_[ To be filled by Dev Agent ]_

---

### TASK-015 — US-007 Ana G. — international add-on + points redemption
**Status:** [ ] Pending
**Priority:** 4
**Persona(s):** us-007
**Files changed:**
_[ To be filled by Dev Agent ]_

**What I did:**
_[ To be filled by Dev Agent ]_

**Known gaps / QA focus:**
- AI opens with calling pattern (8 Colombia calls) — does NOT ask "do you call internationally?"
- Free redemption with 1,200 pts offered first — before the $10 pay option
- After adding: card border turns green, button changes to "Active"
- Calling Card success screen: shows calling balance + dial instructions

**Dev notes:**
_[ To be filled by Dev Agent ]_

---

### TASK-016 — US-008 Robert L. — plan comparison + 4-line toggle
**Status:** [ ] Pending
**Priority:** 4
**Persona(s):** us-008
**Files changed:**
_[ To be filled by Dev Agent ]_

**What I did:**
_[ To be filled by Dev Agent ]_

**Known gaps / QA focus:**
- Line toggle (1–4) must update ALL three plan prices simultaneously
- 4-line math: Base $160, Unlimited $110, 5G+ $130 — verify these are correct
- Current plan badge set from persona.account.plan — NOT hardcoded
- 5-year price guarantee strip must always be visible (never hidden)
- Full comparison table is collapsible — collapsed by default

**Dev notes:**
_[ To be filled by Dev Agent ]_

---

### TASK-017 — Chat state machine — clarifying step before recommendation
**Status:** [ ] Pending
**Priority:** 5
**Persona(s):** All
**Files changed:**
_[ To be filled by Dev Agent ]_

**What I did:**
_[ To be filled by Dev Agent ]_

**Known gaps / QA focus:**
PRD check E4 — this is a red check in the PRD. AI must ask at least one follow-up
before any plan card, refill card, or recommendation card is surfaced.

**Dev notes:**
_[ To be filled by Dev Agent ]_

---

### TASK-018 — Processing animation enforced at 1.5s minimum
**Status:** [ ] Pending
**Priority:** 6
**Persona(s):** All (payment flows)
**Files changed:**
_[ To be filled by Dev Agent ]_

**What I did:**
_[ To be filled by Dev Agent ]_

**Known gaps / QA focus:**
PRD check F3 — QA Agent will time this with a stopwatch. If it flashes through
in under 1.5s, this is a Critical fail.

**Dev notes:**
_[ To be filled by Dev Agent ]_

---

### TASK-019 — iPhone SMS modal wired to all successful transactions
**Status:** [ ] Pending
**Priority:** 6
**Persona(s):** All (payment flows)
**Files changed:**
_[ To be filled by Dev Agent ]_

**What I did:**
_[ To be filled by Dev Agent ]_

**Known gaps / QA focus:**
PRD checks F5–F7. Verify:
- Dynamic Island present at top of iPhone frame
- GREEN SMS bubble — not blue iMessage
- Message text contains: refill/plan name, data amount, expiry date
- Backdrop blur behind modal
- X button dismisses cleanly
- Caption: "Confirmation sent to your phone on file."

**Dev notes:**
_[ To be filled by Dev Agent ]_

---

### TASK-020 — getPersonaFromURL() wired at app init
**Status:** [ ] Pending
**Priority:** 7
**Persona(s):** All
**Files changed:**
_[ To be filled by Dev Agent ]_

**What I did:**
_[ To be filled by Dev Agent ]_

**Known gaps / QA focus:**
PRD check H1. Test all alias formats:
- ?persona=maria → Maria R. (us-001)
- ?persona=us-006 → Derek W.
- ?persona=us-007 → Ana G.
- ?user=1 → Maria R.
- Fallback (no param) → Maria R. (us-001 default)

**Dev notes:**
_[ To be filled by Dev Agent ]_

---

*ClearPath AI · Shared Task Log · v1.0 · March 2026*
