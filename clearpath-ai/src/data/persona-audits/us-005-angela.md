# UX Copy Audit — Angela K. (US-005) Conversation Flow
**ClearPath AI · Intent-Driven Experience**
**Audit date:** April 1, 2026
**Source files reviewed:** `demoResponses.js`, `IPhoneSMSModal.jsx`, `persona-flows.md`
**Flow coverage:** Opening → Outage Check → 4-Step Diagnosis → Escalation → Wi-Fi Calling Upsell

---

## Overall Assessment

Angela's flow has the strongest structural bones of the three demo personas — the 4-step diagnostic walkthrough is well-paced and the escape hatches are consistent. But several copy problems would stand out in a live demo: the opening skips the single most important empathy signal (an apology after 5 support calls), the escalation message uses alarming medical-adjacent language ("hardware issue"), the plan upsell has the same $50/$55 price error as Maria's flow, and the "Reply STOP to opt out" problem carries over from the SMS modal.

**Copy health by section:**

| Section | Score | Status |
|---|---|---|
| Opening message | 🔴 | Missing apology; stat-card labels may render as raw text |
| Outage check result | 🟡 | Premature root cause diagnosis |
| 4-step diagnostic questions | 🟢 | Clear, empathetic, well-paced |
| SIM reseat how-to | 🟢 | Specific and device-aware |
| Escalation / all-steps-failed | 🔴 | "Hardware issue" is alarming; clinical bullet format |
| Wi-Fi Calling upsell | 🔴 | Price error ($50 vs $55); misleading billing copy |
| Live chat / callback | 🟡 | Hours discrepancy; "request a callback" phrasing |
| Post-flow pills | 🟡 | Inherited from POST_FLOW_PILLS — same issues as Maria |

---

## 🔴 Critical Issues

### C1 — Opening skips the apology — the most important line for this persona
**Location:** `demoResponses.js` — `getPersonaOpeningResponse`, case `'us-005'`

**Current:**
> "Hi Angela. I can see this has been a rough stretch — here's what I see on your account: [stat cards] That's a pattern, not a one-off."

**Spec says:**
> "Hi Angela. I can see you've reached out 5 times this month — **I'm sorry this is still happening.**"

Angela has called support 5 times in one month. That's a customer who is frustrated, possibly close to churning. "I'm sorry this is still happening" is the single most important line in this entire flow — it acknowledges her experience before doing anything else. The implementation skips it entirely and goes straight to account stats.

For a POC demo, this is especially visible: reviewers will notice that a customer with 5 failed support contacts gets no acknowledgment of that frustration.

**Fix — opening message:**
```
Hi Angela. I can see you've reached out 5 times this month — I'm sorry
this is still happening.

I also see your average signal has been around 2 bars lately and you've
had 4 dropped calls this week. That's a pattern, not a one-off.

Let me check for a known outage in your area first — that's the fastest
thing to rule out.
```

---

### C2 — Escalation copy says "hardware issue" — alarming and inaccurate
**Location:** `demoResponses.js` — `getAngelaTurnResponse`, turn 6, all-steps-failed branch

**Current:**
> "Diagnosis summary: • Device restart: No effect • Airplane Mode reset: No effect • SIM reseat: No effect • **Likely cause: Deeper coverage gap or hardware issue**"

Two problems here:

1. **"Hardware issue"** tells Angela her phone may be broken. That's a significant escalation that implies she needs a new device — and it's speculation, not a diagnosis. The spec never mentions hardware. It says "deeper coverage issue in your area" which is softer, more accurate, and doesn't create unnecessary alarm.

2. **"Diagnosis summary" bullet list** formats like a tech support ticket, not a conversation. Angela is already frustrated. Receiving a cold clinical summary after 5 support calls and 4 troubleshooting steps will make the experience feel like she's talking to a bot, not an AI assistant.

**Fix — escalation message:**
```
We've gone through all four standard fixes and none of them resolved it.
At this point it may be a deeper coverage issue in your area.

I can connect you with our network team who can run deeper diagnostics —
or I can show you a plan option that might help in the meantime.

What would you prefer?
```

**Fix — pills:** `['Show plan with Wi-Fi Calling', 'Talk to support', 'Schedule a callback']`

---

### C3 — Wi-Fi Calling upsell: $50/mo price error
**Location:** `demoResponses.js` — `getAngelaTurnResponse`, turn 7, `'wifi calling'` branch

**Current:**
> "Total 5G Unlimited at **$50/mo** includes Wi-Fi Calling…"

Same price discrepancy as Maria's flow. The correct price per spec is **$55/mo**. For a demo where reviewers may compare plans across personas, this inconsistency will be noticed immediately.

Additionally: **"I'll apply the change immediately and your billing stays the same until next cycle"** is misleading. Her billing will increase on the next cycle. The current phrasing implies nothing changes financially, which isn't true.

**Fix:**
```
Total 5G Unlimited at $55/mo includes Wi-Fi Calling — your phone uses
your home Wi-Fi for calls even when cellular signal is weak. That would
solve most of your dropped call issues.

Want to switch? The change kicks in immediately, and the extra cost
starts at your next billing cycle — nothing extra today.
```

---

## 🟡 Moderate Issues

### M1 — Stat card format: `| warn` and `| critical` labels may render as raw text
**Location:** `demoResponses.js` — `getPersonaOpeningResponse`, case `'us-005'`

**Current:**
> `📊 ${a.supportCallsThisMonth} contacts | this month | warn`
> `📊 ${a.avgSignalBars} / 5 bars | avg signal | critical`
> `📊 ${a.droppedCallsThisWeek} dropped calls | this week | critical`

These are rendering tokens for the MessageBubble stat card component. If they render correctly as visual cards, this is fine. But if there's any rendering failure, Angela's opening message shows raw strings like "5 contacts | this month | warn" — which looks like broken HTML to a demo audience.

**Recommendation:** Verify these render as intended in the current build before the demo. If there's any uncertainty, replace with prose: *"You've reached out 5 times this month, your average signal has been 2 bars, and you've had 4 dropped calls this week."*

---

### M2 — "Root cause: Likely a device or settings issue" — premature diagnosis
**Location:** `demoResponses.js` — `getAngelaTurnResponse`, turn 2, outage check result

**Current:**
> "Network check complete: • Active outages in your area: None ✓ • **Root cause: Likely a device or settings issue**"

The outage check has just returned negative. At this point, nothing about the device or settings has been checked. Stating "Root cause: Likely a device or settings issue" is a confident diagnosis before any diagnosis has happened. It also creates a framing problem — if the steps don't fix it, the AI already told Angela it's her device, which sets up a blame dynamic.

**Fix:**
```
Network check complete. No active outages in your area.

That's actually good news — it means this is likely something we can
fix right now. I'll walk you through four steps that resolve this 90%
of the time.
```

---

### M3 — Missing outage-found branch in demo
**Location:** `demoResponses.js` — `getAngelaTurnResponse`, turn 2

The implementation hardcodes "None ✓" for the outage check. The spec defines a full branch for when an outage IS found — which is arguably the most compelling moment in Angela's story: the AI proactively detects the root cause before asking a single question.

For the demo, showing "Outage found in your area — restoring by 6 PM CST" would be a powerful proof point for the intent-driven experience. Consider toggling which branch runs via a flag in the persona data, rather than hardcoding no-outage.

---

### M4 — Live chat hours discrepancy
**Location:** `demoResponses.js` — `getAngelaTurnResponse`, turn 2, `'talk'` branch

**Current (closed hours message):**
> "Live chat is closed right now **(closes at 10 PM)**."

**Spec says:**
> "Live chat is closed right now (closes at **11:45 PM EST**)."

A one hour and 45 minute difference. If a demo reviewer or tester happens to be using the app between 10 PM and 11:45 PM, this creates an incorrect experience — the app would show "closed" when it should be open.

**Fix:** Update the time check threshold and the display copy to match the spec: `closes at 11:45 PM EST`.

---

## 🔵 Minor Issues

### m1 — "OK." as a turn opener is a weak filler
**Location:** `demoResponses.js` — turn 3, Step 2 question

**Current:** `"OK. Step 2: Is the issue worse indoors, or about the same everywhere?"`

"OK." adds nothing. It's a verbal tick that makes the AI sound uncertain.

**Fix:** `"Step 2: Is the issue worse indoors, or about the same everywhere?"`

---

### m2 — "How does it look?" is ambiguous after the outdoor/window test
**Location:** `demoResponses.js` — turn 4, indoors branch

**Current:**
> "Step 3 while you test: toggle Airplane Mode on for 10 seconds, then off… How does it look?"

"How does it look?" refers to signal strength but could mean anything. After asking Angela to step outside and check bars, be specific about what you're asking her to observe.

**Fix:** `"Does signal improve when you move outside?"`

---

### m3 — "I can request a callback" — odd phrasing
**Location:** `demoResponses.js` — turn 2, `'talk'` branch (live hours)

**Current:** `"Or I can request a callback within 15 minutes."`

ClearPath AI doesn't "request" a callback — it schedules one. "Request" implies a third party needs to approve it, which introduces doubt.

**Fix:** `"Or I can schedule you a callback within 15 minutes."`

---

### m4 — Post-flow pills (inherited issue from POST_FLOW_PILLS)
Same issue as Maria's audit — `"That's all, thanks"` breaks voice.

**Fix:** `['Ask something else', 'Go back home', "I'm done for now"]`

---

## ✅ What's Working Well

**4-step diagnostic structure** — The flow is well-paced with clear step numbering. "Last one:" before Step 4 (SIM reseat) is a considerate signal that the user is almost done. This is a strong pattern to preserve.

**SIM how-to instructions** — The device-specific Samsung Galaxy steps (power off, SIM ejector, check for damage, reseat, power on) are accurate and genuinely useful. The eSIM escape hatch ("Have eSIM? Skip this") is thoughtful.

**"90% of the time" stat** — "I'll walk you through 4 quick fixes that resolve this 90% of the time" sets clear expectations and gives Angela a reason to trust the process. Keep this framing.

**Restart branch** — "Try it now and let me know how it goes — I'll wait." is warm and human. Small moment but it matters for a frustrated customer.

**Live chat / callback branching by time of day** — The logic to check current hours and adapt the support options accordingly is a strong detail. Right approach, just needs the hours corrected.

---

## Summary of Recommended Changes

| # | Location | Issue | Priority |
|---|---|---|---|
| C1 | `demoResponses.js` opening | Missing "I'm sorry this is still happening" | 🔴 Critical |
| C2 | `demoResponses.js` escalation | "Hardware issue" alarming; clinical bullet format | 🔴 Critical |
| C3 | `demoResponses.js` Wi-Fi Calling upsell | Price $50 → $55; misleading billing copy | 🔴 Critical |
| M1 | `demoResponses.js` opening | Stat card `| warn` labels may render as raw text | 🟡 Moderate |
| M2 | `demoResponses.js` outage check result | Premature root cause diagnosis | 🟡 Moderate |
| M3 | `demoResponses.js` turn 2 | Missing outage-found branch | 🟡 Moderate |
| M4 | `demoResponses.js` live chat hours | 10 PM → 11:45 PM EST discrepancy | 🟡 Moderate |
| m1 | `demoResponses.js` turn 3 | "OK." filler opener | 🔵 Minor |
| m2 | `demoResponses.js` turn 4 indoors | "How does it look?" ambiguous | 🔵 Minor |
| m3 | `demoResponses.js` callback | "request" → "schedule" | 🔵 Minor |
| m4 | `POST_FLOW_PILLS` | "That's all, thanks" breaks voice | 🔵 Minor |

---

*Audit produced by ClearPath AI / Cowork — April 1, 2026*
