# UX Copy Audit — Maria R. (US-001) Conversation Flow
**ClearPath AI · Intent-Driven Experience**
**Audit date:** April 1, 2026
**Source files reviewed:** `demoResponses.js`, `IPhoneSMSModal.jsx`, `persona-flows.md`
**Flow coverage:** Opening → Diagnosis → Free Fixes → Quick Refill → Upgrade → SMS Confirmation

---

## Overall Assessment

The copy is directional and largely aligned with the "diagnose before selling" principle. The diagnosis questions and free-fix steps are well-written — specific, human, and actionable. However, there are two **critical** data-integrity issues (price inconsistency, vague SMS), three **moderate** trust gaps (missing reassurances in the upgrade path), and several **minor** polish issues (voice inconsistency, awkward pill labels) that should be addressed before a live demo or user test.

**Copy health by section:**

| Section | Score | Status |
|---|---|---|
| Opening message | 🟡 | Voice inconsistency; missing Wi-Fi insight |
| Diagnosis questions | 🟢 | Clear, sequential, empathetic |
| Free fixes | 🟢 | Specific and actionable |
| Quick Refill path | 🟡 | Minor phrasing; price ambiguity vs options list |
| Upgrade path (A2) | 🔴 | Price error; missing trust copy; missing benefits |
| Processing / confirmation | 🟡 | Vague trigger copy |
| iPhone SMS modal | 🔴 | "New balance updated" meaningless; STOP opt-out misplaced |
| Post-flow pills | 🟡 | One label breaks voice |

---

## 🔴 Critical Issues

### C1 — Price discrepancy in the upgrade card
**Location:** `demoResponses.js` — Upgrade branch (all turns where `onPlan` or `'options'` is detected)

**Current:**
> "**Total 5G Unlimited** — $50/mo … That's $10 more than your current plan."

**Spec says:**
> "Total 5G Unlimited — $55/mo · +$15/mo from what you pay now"

The implementation says $50; the PRD and persona-flows spec say $55. Maria's current plan is Total Base 5G at $40/mo. $40 + $10 = $50 does not match the spec price of $55. This will fail any demo review and erodes trust if a user researches the actual plan price.

**Fix — upgrade card copy:**
```
Total 5G Unlimited — $55/mo
✓ Unlimited data (no more running out)
✓ 10 GB hotspot
✓ Disney+ included
✓ Wi-Fi Calling

That's $15 more than your current plan.
```

**Fix — upgrade card pills:** `['Yes, switch to Unlimited', 'Start on Apr 9 instead', 'No thanks']`

---

### C2 — iPhone SMS: "New balance updated" is meaningless
**Location:** `IPhoneSMSModal.jsx` — `SMS_MESSAGES.refill`

**Current:**
> "Your $15 data refill is confirmed. 5 GB added. New balance updated. Expires May 1, 2026. Reply STOP to opt out."

Three problems with this message:

1. **"New balance updated"** tells the customer nothing. The whole point of this confirmation is to give Maria confidence that her data is back. The spec shows the actual new balance: "Your balance is now 5.8 GB." Say the number.

2. **Dynamic expiry is wrong for a refill.** The current code calculates `today + 30 days`. For Maria, the refill data expires when her plan cycle ends — April 9, 2026. The expiry date should come from `persona.account.renewalDate`, not a generic 30-day offset.

3. **"Reply STOP to opt out"** is a marketing opt-out disclosure. It belongs in the footer of a promotional SMS, not in a transactional confirmation. Maria just paid — this is not the moment to remind her she can unsubscribe. It undermines the positive emotional beat.

**Fix:**
```
Your Total Wireless account has been refilled.
5 GB added. New balance: 5.8 GB.
Valid through Apr 9, 2026.
```

---

## 🟡 Moderate Issues

### M1 — Upgrade path missing "no charge today" and proration
**Location:** `demoResponses.js` — all upgrade branch responses

**Current:**
> "Here's what would stop this from happening: … Want to switch?"

**What's missing vs. spec:**
- "You could start now (prorated for the rest of your cycle) **or wait until Apr 9 — no charge today.**"
- The prorated charge (~$7.14 for 14 days) is in the spec but absent from implementation.
- The timing choice (start now vs. switch at renewal) is a core trust signal — it shows ClearPath isn't trying to force an immediate charge.

**Fix — add after plan card:**
```
You could start now — you'd only pay ~$7.14 today (prorated for the
14 days left in your cycle). Or switch at your next renewal on Apr 9
with no charge today.
```

**Fix — pills:** `['Start now — ~$7 today', 'Switch on Apr 9 — free', 'Stay on my current plan']`

---

### M2 — Upgrade path missing usage context and Disney+
**Location:** `demoResponses.js` — upgrade branch intro

**Current:**
> "Here's what would stop this from happening:"

**Spec opens with:**
> "Based on your usage, you've been needing more than 5 GB almost every month."

The spec leads with Maria's own data to justify the recommendation. Without it, the upgrade card feels like a generic upsell. ClearPath's core design principle is "diagnose first, recommend based on evidence." The opening line should echo that evidence back.

Additionally, Disney+ is a meaningful differentiator that justifies the price jump ($40 → $55) and is in the spec. It's omitted from the current implementation.

**Fix — upgrade intro:**
```
Based on your usage, you've needed more than 5 GB almost every month.
Here's what would stop this from happening again:
```

---

### M3 — Options list in Quick Refill path shows $10 for 5 GB (vs. $15 in main flow)
**Location:** `demoResponses.js` — `onRefill`, turn 3, `'show other options'` branch

**Current:**
> "• $10 — 5 GB add-on (instant, plan unchanged)"

The main Quick Refill pill and confirmation card show **$15** for 5 GB. The "Show other options" branch suddenly shows **$10** for the same product. This contradiction will confuse users and fail a demo walkthrough.

If these are different SKUs (e.g., a 3 GB add-on at $10 exists separately), clarify that in the label. If it's the same 5 GB add-on, the price must be consistent.

Also: `"(see current price)"` for the Unlimited option is a placeholder that should never appear in a demo. Replace with the actual price.

**Fix — options list:**
```
• Add 5 GB for $15 — activates instantly, keeps your current plan
• Upgrade to Unlimited — $55/mo, no more caps, includes Disney+
• Wait until Apr 9 — your plan renews in 14 days
```

**Fix — pills:** `['Add 5 GB — $15', 'Switch to Unlimited', 'I can wait']`

---

## 🔵 Minor Issues

### m1 — Voice inconsistency: "I" vs. "we"
**Locations:** `demoResponses.js` — opening (Turn 1) and old diagnosis path (Turn 2)

Turn 1: *"I can see you have... I also noticed..."*
Turn 2 (old diag path): *"We can also see that only 22% of your usage..."*

The AI switches between first-person singular and plural mid-conversation. Choose one voice and apply it consistently. Given that ClearPath AI is positioned as a single intelligent assistant (not a team), **"I"** is the right choice throughout.

---

### m2 — Opening message: missing Wi-Fi insight
**Location:** `demoResponses.js` — `getPersonaOpeningResponse`, case `'us-001'`

**Current:**
> "I also noticed you've run out of data 11 of the last 12 months. Want to figure out why and maybe fix it for free — or just get data added right now?"

**Spec version:**
> "One thing that stands out: only 22% of your usage is going through Wi-Fi. That means most of your data is being used on cellular — even when you might not need to."

The 22% Wi-Fi stat is the most compelling piece of proactive intelligence ClearPath AI can surface. It demonstrates that the AI is doing real work on Maria's behalf before she even asks. Saving it for Turn 2 buries the lead.

**Fix — opening message:**
```
Hi Maria. You have 0.8 GB left and 14 days until your plan renews on Apr 9.

One thing I noticed: only 22% of your usage goes through Wi-Fi — your phone
is using cellular most of the time, even when you might not need to.

That's worth looking at before spending anything. Want me to walk you through
a couple of quick fixes, or add data right now?
```

---

### m3 — "just" subtly devalues the refill option
**Locations:** Multiple quick-reply labels and opening message

Examples:
- Opening: *"or **just** get data added right now?"*
- Escape hatch pill: *"Skip — **just** add data"*
- Old diag Turn 2: *"Skip — add data for $15"* (this one is fine — no "just")

The word "just" before "add data" frames the refill as the lesser, lazy option compared to diagnosis. That's not neutral. Maria may legitimately need data right now, and the refill path should be presented as equally valid.

**Fix:** Remove "just" from pills and message copy wherever it precedes the refill action.
- `"Skip — just add data"` → `"Skip — add 5 GB for $15"`
- `"or just get data added right now?"` → `"or add data right now?"`

---

### m4 — Post-flow pill: "That's all, thanks" breaks voice
**Location:** `demoResponses.js` — `POST_FLOW_PILLS`

**Current:** `['Start a new topic', 'Return to home', "That's all, thanks"]`

"That's all, thanks" sounds like the user talking — not like a UI action label. It also feels more formal than the rest of the tone. Quick-reply pills should be short, verb-led action labels from the user's POV.

**Fix:** `['Ask something else', 'Go back home', "I'm done for now"]`

---

### m5 — Free fixes: minor phrasing tightening
**Location:** `demoResponses.js` — free fixes response (turns 5–6)

**Current third bullet:**
> "Disable Background App Refresh — go to Settings → General → Background App Refresh and turn it off **for apps you don't need syncing constantly**"

**Fix:** `"turn it off for apps that don't need to stay current in the background"`

Also, the closing question:
> "Want to try those first, or would you rather add data or change your plan now?"

**Fix:** `"Want to try these first? If they don't solve it, I can add data or change your plan in seconds."`

---

### m6 — Processing trigger copy is exposed as text
**Location:** `demoResponses.js` — `onRefill` turn 3

**Current:** `"Got it — processing now.\n[REFILL_FLOW]"`

**Fix:** `"Adding 5 GB to your account…\n[REFILL_FLOW]"` — or remove entirely if the RefillFlow component handles the loading state.

---

## ✅ What's Working Well

**Diagnosis question sequencing** — "Are you connected to Wi-Fi… → Do you stream video… → Last one:" is an excellent progressive structure. "Last one:" signals respect for the user's time. Keep it.

**Branching to escape hatches** — Every AI turn offers a skip path. Consistent with the core design rule of never trapping the user.

**Free-fix framing** — Leading with "Here are three free fixes that could make a real difference" before any paid option is exactly right. The specificity (Settings → General → Background App Refresh) makes the instructions actually useful.

**Wi-Fi cellular explanation** — "When Wi-Fi is slow, your phone automatically switches to cellular — burning through data without you noticing." is the clearest plain-language explanation of this behavior. Strong copy.

**Refill confirmation card** — "Charged to Visa ••••4291" is a great use of pre-populated data. Removes friction and builds trust.

**Post-refill empathy upsell (spec)** — "Since this has happened 11 of the last 12 months — would you like to see plans that would prevent it? No obligation to switch today." Uses established data compassionately and lowers stakes. Verify this is implemented in the RefillFlow component and preserve it.

---

## Summary of Recommended Changes

| # | Location | Issue | Priority |
|---|---|---|---|
| C1 | `demoResponses.js` upgrade branch | Price: $50 → $55, delta $10 → $15 | 🔴 Critical |
| C2 | `IPhoneSMSModal.jsx` refill SMS | Vague "New balance updated"; wrong expiry; STOP opt-out | 🔴 Critical |
| M1 | `demoResponses.js` upgrade branch | Missing "no charge today" + proration | 🟡 Moderate |
| M2 | `demoResponses.js` upgrade branch | Missing usage context + Disney+ | 🟡 Moderate |
| M3 | `demoResponses.js` refill options list | $10 vs $15 price inconsistency; "(see current price)" placeholder | 🟡 Moderate |
| m1 | `demoResponses.js` throughout | "I" vs "we" voice inconsistency | 🔵 Minor |
| m2 | `demoResponses.js` opening | Missing 22% Wi-Fi insight in Turn 1 | 🔵 Minor |
| m3 | Pills throughout | "just" devalues refill option | 🔵 Minor |
| m4 | `POST_FLOW_PILLS` | "That's all, thanks" breaks voice | 🔵 Minor |
| m5 | `demoResponses.js` free fixes | Phrasing tightening | 🔵 Minor |
| m6 | `demoResponses.js` processing | "Got it —" filler copy | 🔵 Minor |

---

*Audit produced by ClearPath AI / Cowork — April 1, 2026*
