# ClearPath AI — Implement & Validate

Paste this prompt into Claude Code (run `claude` from your repo root) to implement all failing PRD checks and verify each fix.

---

```
Read CLAUDE.md in this repo for full project context before doing anything.

Your job is to implement every failing PRD check and verify each fix. Work in this loop:

  VALIDATE → IDENTIFY FAILURES → IMPLEMENT FIX → RE-VALIDATE → REPEAT

---

## STEP 1: UNDERSTAND THE CODEBASE

Before touching anything:
1. Read CLAUDE.md
2. Run: find . -name "*.jsx" -o -name "*.tsx" | grep -v node_modules | grep -v .next | sort
3. Read package.json to confirm the framework and dev command
4. Read the top-level page file (pages/index.jsx, app/page.tsx, or similar)
5. Map each PRD feature to the actual file that controls it

---

## STEP 2: VALIDATE THE LIVE PROTOTYPE

Fetch and inspect https://clearpath-ai-pearl.vercel.app/ using your browser tools.
Run through all 30 checks in CLAUDE.md (Groups A through H).
For each check record: PASS / PARTIAL / FAIL and a one-sentence observation.

Do this BEFORE writing any code. You need the baseline state.

---

## STEP 3: IMPLEMENT FIXES (one at a time)

For each FAIL or PARTIAL check, in priority order:

### Priority 1 — 🔴 Critical
1. **E4**: AI must ask a clarifying question before surfacing any recommendation card
2. **F3**: "Continue — $15" click shows ~1.5s processing animation (spinner or pulse ring)
3. **F4**: Success confirmation message appears in the chat after processing
4. **F5**: iPhone SMS modal appears with Dynamic Island, green SMS bubble, backdrop blur
5. **F6**: Modal has X dismiss button
6. **F7**: Caption below iPhone: "Confirmation sent to your phone on file."

### Priority 2 — 🟡 Important
7. **G1**: Mini dashboard widget between signal banner and pills grid

### Priority 3 — 🔵 Nice to Have
8. **H1**: Persona URL params load different account states

For each fix:
a. Find the exact file and component responsible
b. Read the current code
c. Implement the minimum change needed — do not refactor unrelated code
d. After writing, re-fetch the live URL OR start the dev server and check locally
e. Confirm the check now passes before moving to the next

---

## STEP 4: FINAL VALIDATION REPORT

After all fixes are implemented, run through all 30 checks one final time.
Produce this report:

---
# ClearPath AI — Post-Implementation Validation
**Date:** [today]
**Branch/commit:** [current git branch and short commit hash]

## ✅ Passing ([X]/30)
[check ID + one line]

## ⚠️ Partial ([X]/30)
[check ID + what's present vs. what's missing]

## ❌ Still Failing ([X]/30)
[check ID + why it couldn't be fixed in this session]

## Changes Made
[list of files edited and what was changed in each]

## How to Deploy
```bash
git add -A
git commit -m "feat: implement PRD checks [list check IDs fixed]"
git push
# Vercel will auto-deploy on push to main
```
---

Keep changes surgical. Do not redesign working components.
When in doubt about a visual detail, refer to CLAUDE.md design tokens.
```
