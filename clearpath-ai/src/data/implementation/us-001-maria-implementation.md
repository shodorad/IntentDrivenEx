# Implementation Plan — Maria R. (US-001)
**File:** `clearpath-ai/src/utils/demoResponses.js`
**Reference audit:** `clearpath-ai/src/data/persona-audits/us-001-maria.md`
**Total tasks:** 9
**Phases covered:** 1 (Critical), 2 (Moderate), 3 (Minor)

---

## Before You Start

Read this entire plan before making any changes. Two tasks are marked **[SHARED]** — they touch constants and strings used by ALL personas, not just Maria. Complete those tasks exactly once. When Angela and Alex implementation plans are created, those plans will reference these as already done and skip them.

**Task execution order matters.** Tasks 1 and 2 must run before Tasks 6 and 7, because Tasks 6 and 7 search for text that has already been updated by Tasks 1 and 2. Do not run out of order.

---

## SHARED Tasks
> These affect the entire `demoResponses.js` file and all personas. Do them first. Do not repeat in Angela or Alex plans.

---

### Task 1 — Fix POST_FLOW_PILLS labels
**Phase:** 3 (Minor) · **Type:** Find and replace · **Scope:** SHARED — affects all personas

**File:** `clearpath-ai/src/utils/demoResponses.js`

**Location:** Top of file, around line 15. The `POST_FLOW_PILLS` constant.

**Find (exact):**
```js
const POST_FLOW_PILLS = ['Start a new topic', 'Return to home', "That's all, thanks"];
```

**Replace with:**
```js
const POST_FLOW_PILLS = ['Ask something else', 'Go back home', "I'm done for now"];
```

**Why:** `"That's all, thanks"` reads like the user talking, not a UI action label. All three labels are replaced for consistency of voice.

**Verify:** Load `?persona=maria`, complete any flow that reaches an end state (e.g., tap "Why am I running out?" → tap "I'll try those"). Confirm the three pills at the end read **"Ask something else"**, **"Go back home"**, **"I'm done for now"**.

---

### Task 2 — Fix upgrade plan price across entire file
**Phase:** 1 (Critical) · **Type:** Find and replace ALL occurrences · **Scope:** SHARED — affects all persona upgrade branches

**File:** `clearpath-ai/src/utils/demoResponses.js`

**Why this is a file-wide replace:** The string `**Total 5G Unlimited** — $50/mo` appears 8–10 times across multiple persona turn handlers (Maria, Angela, generic fallback). Replacing each occurrence individually risks missing one. A targeted find-replace on the exact strings is the safest approach.

**Step A — Fix plan price:**

Find ALL occurrences of (exact):
```
**Total 5G Unlimited** — $50/mo
```
Replace ALL with:
```
**Total 5G Unlimited** — $55/mo
```

**Step B — Fix price delta:**

Find ALL occurrences of (exact):
```
That's $10 more than your current plan.
```
Replace ALL with:
```
That's $15 more than your current plan.
```

**Why:** Spec and PRD state $55/mo. Current plan (Total Base 5G) is $40/mo. $40 + $15 = $55. The $50 figure is incorrect throughout.

**Verify:** Load `?persona=maria`, tap **"Change my plan"**. Confirm the upgrade card shows **$55/mo** and **"That's $15 more than your current plan."**

---

## Maria-Specific Tasks
> These apply only within `getMariaTurnResponse` and `getPersonaOpeningResponse` case `'us-001'`. Do not apply to other persona functions.

---

### Task 3 — Rewrite opening message to surface Wi-Fi insight
**Phase:** 3 (Minor) · **Type:** Targeted replacement · **Scope:** Maria only

**File:** `clearpath-ai/src/utils/demoResponses.js`

**Location:** `getPersonaOpeningResponse` function → `case 'us-001'`

**Find (exact template literal):**
```
`Hi Maria. I can see you have ${a.dataRemaining} left — and your plan doesn't renew until ${a.renewalDate}, which is ${a.daysUntilRenewal} days away.\n\nI also noticed you've run out of data 11 of the last 12 months. Want to figure out why and maybe fix it for free — or just get data added right now?`
```

**Replace with:**
```
`Hi Maria. You have ${a.dataRemaining} left and ${a.daysUntilRenewal} days until your plan renews on ${a.renewalDate}.\n\nOne thing I noticed: only 22% of your usage goes through Wi-Fi — your phone is using cellular most of the time, even when you might not need to.\n\nThat's worth looking at before spending anything. Want me to walk you through a couple of quick fixes, or add data right now?`
```

**Do not change the pills array for this case.** Pills stay as:
```js
['Why am I running out?', 'Quick Refill — $15', 'Change my plan', "I'm fine for now"]
```

**Why:** The 22% Wi-Fi stat is the strongest proactive intelligence signal in Maria's flow. Surfacing it in the opening immediately demonstrates the AI's value. "just" is removed as it subtly devalues the refill option.

**Verify:** Load `?persona=maria`. Confirm the opening AI message contains **"only 22% of your usage goes through Wi-Fi"** and does NOT contain the word **"just"**.

---

### Task 4 — Remove "just" from diagnosis skip pill label
**Phase:** 3 (Minor) · **Type:** Find and replace · **Scope:** Maria only (getDiagnoseUsageResponse)

**File:** `clearpath-ai/src/utils/demoResponses.js`

**Location:** `getDiagnoseUsageResponse` function. This function builds the intro response when a user taps a `diagnose_usage` action pill.

**Find (exact):**
```js
'Skip — just add data'
```

**Replace with:**
```js
'Skip — add 5 GB for $15'
```

**Why:** "just" frames the refill as the lesser option. The replacement is neutral and specific (includes price so the user knows what they're skipping to).

**Verify:** Load `?persona=maria`, tap **"Why am I running out?"**. The diagnosisFlow intro message should appear with a skip pill that reads **"Skip — add 5 GB for $15"** (not "Skip — just add data").

---

### Task 5 — Fix "we" → "I" in old diagnosis path
**Phase:** 3 (Minor) · **Type:** Targeted replacement · **Scope:** Maria only (getMariaTurnResponse, onDiagnose branch)

**File:** `clearpath-ai/src/utils/demoResponses.js`

**Location:** `getMariaTurnResponse` → `onDiagnose` block → `turn === 2` → the branch that is NOT a skip action (the "Let's figure it out" response).

**Find (exact template literal):**
```
`We can also see that only 22% of your usage is going through Wi-Fi — which means most of your data is being used on cellular, even when you might not need to.\n\nWant me to walk through a couple of free fixes, or would you rather skip straight to adding data or changing your plan?`
```

**Replace with:**
```
`I can also see that only 22% of your usage is going through Wi-Fi — which means most of your data is being used on cellular, even when you might not need to.\n\nWant me to walk through a couple of free fixes, or would you rather skip straight to adding data or changing your plan?`
```

**Why:** The AI voice switches between "I" and "we" mid-conversation. ClearPath AI is a single assistant — "I" is consistent throughout.

**Verify:** Load `?persona=maria`, type a message containing the word "running out" in the chat input (bypassing the pills). The AI's second response should contain **"I can also see"** not "We can also see."

---

### Task 6 — Full upgrade card rewrite: add context, Disney+, proration, and new pills
**Phase:** 2 (Moderate) · **Type:** Find and replace ALL within getMariaTurnResponse · **Scope:** Maria only

**File:** `clearpath-ai/src/utils/demoResponses.js`

**Important:** Run this task AFTER Task 2. Task 2 will have already changed `$50/mo` to `$55/mo` and `$10 more` to `$15 more`. The strings below reflect those already-updated values.

**This string appears 8 or more times inside `getMariaTurnResponse`.** Replace ALL occurrences within that function. Do not replace outside of `getMariaTurnResponse` (other persona functions may have similar copy that should not be changed here).

**Find (exact template literal — this is what it looks like AFTER Task 2 has run):**
```
`Here's what would stop this from happening:\n\n**Total 5G Unlimited** — $55/mo\n✓ Unlimited data (no more running out)\n✓ 10 GB hotspot\n✓ Wi-Fi Calling\n\nThat's $15 more than your current plan. Want to switch?`
```

**Replace with:**
```
`Based on your usage, you've needed more than 5 GB almost every month. Here's what would stop this from happening again:\n\n**Total 5G Unlimited** — $55/mo\n✓ Unlimited data (no more running out)\n✓ 10 GB hotspot\n✓ Disney+ included\n✓ Wi-Fi Calling\n\nThat's $15 more than your current plan.\n\nYou could start now — you'd only pay ~$7.14 today (prorated for the 14 days left in your cycle). Or switch at your next renewal on Apr 9 with no charge today.`
```

**Additionally**, wherever this template literal appears inside `getMariaTurnResponse`, its accompanying pills array will be:
```js
['Yes, switch to Unlimited', 'How much more per month?', 'No thanks — keep my plan']
```
Replace those pills with:
```js
['Start now — ~$7 today', 'Switch on Apr 9 — free', 'Stay on my current plan']
```

**Why the pill change:** The new copy offers two timing options (now vs. Apr 9). The pills must match those options. "How much more per month?" is no longer needed since the copy now shows the full price breakdown and delta.

**Verify:** Load `?persona=maria`, tap **"Change my plan"**. Confirm the AI message contains:
- "Based on your usage, you've needed more than 5 GB almost every month"
- "Disney+ included" in the feature list
- "no charge today" in the closing line
- Pills: **"Start now — ~$7 today"**, **"Switch on Apr 9 — free"**, **"Stay on my current plan"**

---

### Task 7 — Fix options list in Quick Refill path
**Phase:** 2 (Moderate) · **Type:** Targeted replacement · **Scope:** Maria only (getMariaTurnResponse, onRefill branch)

**File:** `clearpath-ai/src/utils/demoResponses.js`

**Location:** `getMariaTurnResponse` → `onRefill` block → `turn === 3` → `prev.includes('other options') || prev.includes('show')` branch.

**Find (exact template literal):**
```
`Here are your options:\n\n• $10 — 5 GB add-on (instant, plan unchanged)\n• Total 5G Unlimited — ends the caps permanently (see current price)\n• Wait it out until Apr 9`
```

**Replace with:**
```
`Here are your options:\n\n• Add 5 GB for $15 — activates instantly, keeps your current plan\n• Upgrade to Unlimited — $55/mo, no more caps, includes Disney+\n• Wait until Apr 9 — your plan renews in 14 days`
```

**Also replace the pills array immediately following it:**

Find:
```js
['Add 5 GB — $10', 'Switch to Unlimited', "I'll wait"]
```
Replace with:
```js
['Add 5 GB — $15', 'Switch to Unlimited', "I'll wait"]
```

**Why:** The main Quick Refill flow shows $15 for 5 GB. This branch showed $10 for the same product — a direct contradiction. `"(see current price)"` is a placeholder that must never appear in a demo.

**Verify:** Load `?persona=maria`, tap **"Quick Refill — $15"**. When the AI asks to confirm, tap **"Show other options"**. Confirm the options list shows **$15** (not $10) and **$55/mo** (not "see current price"). Pill should read **"Add 5 GB — $15"**.

---

### Task 8 — Tighten free fixes copy
**Phase:** 3 (Minor) · **Type:** Find and replace ALL occurrences · **Scope:** demoResponses.js (appears multiple times across Maria's diagnosis branches)

**File:** `clearpath-ai/src/utils/demoResponses.js`

**Step A — Fix third bullet phrasing:**

Find ALL occurrences of (exact):
```
turn it off for apps you don't need syncing constantly
```
Replace ALL with:
```
turn it off for apps that don't need to stay current in the background
```

**Step B — Fix closing question:**

Find ALL occurrences of (exact):
```
Want to try those first, or would you rather add data or change your plan now?
```
Replace ALL with:
```
Want to try these first? If they don't solve it, I can add data or change your plan in seconds.
```

**Why:** The third bullet's original phrasing is grammatically awkward. The closing question bundles three choices into one sentence — the replacement focuses on a single decision and makes the AI's offer feel responsive rather than procedural.

**Verify:** Load `?persona=maria`, tap **"Why am I running out?"** → tap **"Let's do it"** → answer all three questions. Confirm the free fixes message ends with **"Want to try these first? If they don't solve it, I can add data or change your plan in seconds."** and the third bullet contains **"don't need to stay current in the background."**

---

### Task 9 — Fix processing trigger copy
**Phase:** 3 (Minor) · **Type:** Find and replace · **Scope:** Maria only (getMariaTurnResponse)

**File:** `clearpath-ai/src/utils/demoResponses.js`

**Location:** `getMariaTurnResponse` only. There are multiple processing trigger strings scattered across the diagnosis branches, refill path, and plan path. Replace each one.

**Find and replace the following strings (one at a time):**

| Find | Replace with |
|------|-------------|
| `` `Got it — adding 5 GB right now.\n[REFILL_FLOW]` `` | `` `Adding 5 GB to your account…\n[REFILL_FLOW]` `` |
| `` `Got it — I'll set that up right now.\n[REFILL_FLOW]` `` | `` `Adding 5 GB to your account…\n[REFILL_FLOW]` `` |
| `` `Got it — processing now.\n[REFILL_FLOW]` `` | `` `Adding 5 GB to your account…\n[REFILL_FLOW]` `` |
| `` `Got it.\n[REFILL_FLOW]` `` | `` `Adding 5 GB to your account…\n[REFILL_FLOW]` `` |

**Do NOT replace similar strings in other persona functions** (e.g., Carlos has `"Great — renewing now.\n[REFILL_FLOW]"` — leave that untouched).

**Why:** "Got it —" is a filler opener that adds no value. The replacement is action-specific and tells Maria what is happening.

**Verify:** Load `?persona=maria`, tap **"Quick Refill — $15"** → tap **"Yes — do it"**. The AI message immediately before the processing spinner should read **"Adding 5 GB to your account…"** with no "Got it" prefix.

---

## Completion Checklist

Run through these after all 9 tasks are done:

- [ ] Post-flow pills show: "Ask something else" / "Go back home" / "I'm done for now"
- [ ] Opening message contains the 22% Wi-Fi stat and no "just"
- [ ] Diagnosis skip pill reads "Skip — add 5 GB for $15"
- [ ] Upgrade card shows $55/mo, $15 delta, Disney+, proration copy, and correct pills
- [ ] Options list shows $15 consistently (not $10) and no "(see current price)"
- [ ] Free fixes third bullet and closing question match the new copy
- [ ] Processing trigger reads "Adding 5 GB to your account…" with no "Got it"
- [ ] No occurrence of "we can" remains inside getMariaTurnResponse (should be "I can")

---

## Notes for Angela and Alex Plans

The following tasks from this plan are SHARED and must NOT be repeated:
- **Task 1** (POST_FLOW_PILLS) — already updated in this plan
- **Task 2** (upgrade price $50→$55 and $10→$15) — already updated in this plan

Angela's plan will reference these as done. Alex's plan will reference these as done.

---

*Implementation plan produced by ClearPath AI / Cowork — April 1, 2026*
