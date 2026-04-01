# UX Copy Audit — Alex (US-009) Conversation Flow
**ClearPath AI · Intent-Driven Experience**
**Audit date:** April 1, 2026
**Source files reviewed:** `demoResponses.js`, `IPhoneSMSModal.jsx`
**Note:** No dedicated section in `persona-flows.md` — audit is against voice/tone guidelines and internal consistency only.
**Flow coverage:** Opening → Phone Browsing → Selection → Order Confirmation → SMS Modal

---

## Overall Assessment

Alex's flow is the most technically complete of the three — the phone recommendation cards, rewards math, and order summary are all well-structured and specific. The main copy problems are concentrated in two places: the opening message (which reads like a system report rather than a conversation) and a few inherited issues in the SMS modal and pill labels. The recommendation card copy is strong and should be treated as the benchmark for the other personas.

**Copy health by section:**

| Section | Score | Status |
|---|---|---|
| Opening message | 🔴 | Report format; irrelevant data dump; not conversational |
| Phone recommendation cards | 🟢 | Specific, value-led, rewards math is clear |
| iPhone / Samsung openers | 🟡 | "Great choice" premature; "just $24.99" devalues |
| Order summary cards | 🟢 | Well-structured; pre-populated card data is strong |
| "Change color" pill | 🟡 | No implemented flow — dead end in demo |
| Phone order SMS modal | 🟡 | "Reply STOP to opt out" misplaced; tracking copy wordy |
| Fallback response | 🟡 | "Perfect phone" cliché |

---

## 🔴 Critical Issues

### C1 — Opening message reads like a system log, not a conversation
**Location:** `demoResponses.js` — `getPersonaOpeningResponse`, case `'us-009'`

**Current:**
> "Hey Alex. Here's what I see on your account:
> Account status:
> • Device: iPhone 12 · 3 years old
> • Storage: 91% full
> • Plan: Total Unlimited
>
> Good news — you qualify for the best device deals. Several phones are completely free with your plan, no trade-in needed.
>
> What are you looking for?"

Three problems:

1. **"Here's what I see on your account: Account status:"** is a report header, not how a helpful person starts a conversation. Compare to how Angela and Maria's openings lead with something relevant to the customer's situation — not a status dump.

2. **"Storage: 91% full"** — why is this in the opening? Alex wants a new phone. His storage being 91% full is not a decision factor for which phone to buy. It's account data that's being surfaced because it exists, not because it's useful. This is exactly the anti-pattern ClearPath AI is meant to avoid.

3. **"3 years old"** next to the device name is a nudge toward buying — it's fine as intent, but it's hidden inside a bullet list where it reads like a spec sheet entry rather than a relevant observation.

**Fix — opening message:**
```
Hey Alex. Good news — with your Total Unlimited plan, you qualify for
some of our best device deals right now. A few phones are completely
free, no trade-in needed.

Your iPhone 12 is 3 years old — there are some significant upgrades
available. What kind of phone are you looking for?
```

**Fix — pills:** `['Show me new phones', 'I want an iPhone', 'I want a Samsung', 'What deals do I qualify for?']`

---

## 🟡 Moderate Issues

### M1 — "Great choice" before the user has chosen anything
**Location:** `demoResponses.js` — `getAlexPhoneTurnResponse`, iPhone branch (turnCount ≤ 2)

**Current:**
> "Great choice — with your 2,450 rewards points, the iPhone 13 drops to just $24.99."

Alex tapped "I want an iPhone" — he hasn't chosen a specific phone yet. "Great choice" validates a selection that hasn't been made. It reads as false encouragement, which undermines the trust the AI is trying to build.

Additionally, **"drops to just $24.99"** — "just" minimises the price in a way that's meant to feel reassuring but can feel slightly pushy. Compare to the Samsung opener which doesn't use "just."

**Fix:**
```
With your 2,450 rewards points, the iPhone 13 comes to $24.99.
Here are your best iPhone options:
```

---

### M2 — "Both are completely free" — "Both" before the user has seen the phones
**Location:** `demoResponses.js` — `getAlexPhoneTurnResponse`, Samsung branch (turnCount ≤ 2)

**Current:**
> "Both are completely free with your Unlimited plan — no trade-in required:"

"Both" refers to the two phones about to be shown, but the user hasn't seen them yet. It's a minor grammatical issue but it creates a slight confusion on first read.

**Fix:**
```
Here are your best free options on your Unlimited plan — no trade-in needed:
```

---

### M3 — "Change color" pill has no implemented flow — dead end
**Location:** `demoResponses.js` — order summary pills for iPhone 13 and Galaxy A36

**Current pills:** `['Yes, order it — $24.99', 'Change color', 'Go back']`

There is no turn handler for "Change color" — it will fall through to the generic fallback: *"I can help you pick the perfect phone. What matters most to you…"* which is completely disconnected from the color selection context.

For a controlled demo this is manageable (avoid tapping it), but if the demo is also handed to testers, someone will tap "Change color" and get a broken experience.

**Options:**
- Remove "Change color" from the pills if the flow isn't implemented
- Or implement a minimal response: *"Color options for the iPhone 13: Midnight, Starlight, Blue, Pink, Red. Which would you prefer?"* with pills for each color

---

### M4 — Order summary: "Charge: None" is redundant with "Price: FREE"
**Location:** `demoResponses.js` — Moto G Stylus and Galaxy A17 order summaries

**Current:**
```
Price: FREE with your Unlimited plan
Charge: None
```

Both lines say the same thing. "Charge: None" adds no information.

**Fix:** Remove "Charge: None" — "Price: FREE with your Unlimited plan" is sufficient.

---

## 🔵 Minor Issues

### m1 — Phone order SMS: "Reply STOP to opt out" misplaced
**Location:** `IPhoneSMSModal.jsx` — `SMS_MESSAGES.phone`

**Current:**
> "Order confirmed! Your iPhone 13 ships in 2–3 business days. We'll send a tracking number to your number on file when it's on the way. Reply STOP to opt out."

Same issue as Maria's audit. A transactional order confirmation is not the place for a marketing opt-out disclosure. Alex just bought a phone — this should feel like a receipt, not a newsletter sign-up.

Also: "We'll send a tracking number to your number on file when it's on the way" is wordy.

**Fix:**
```
Order confirmed! Your iPhone 13 ships in 2–3 business days.
We'll text you a tracking number once it's on the way.
```

---

### m2 — "iPhone 13 — Midnight (Black)" — parenthetical color note
**Location:** `demoResponses.js` — iPhone 13 order summary

**Current:** `Color: Midnight (Black)`

"Midnight" is Apple's official color name. Adding "(Black)" is unnecessary annotation — it breaks the product voice and looks like internal notes in a customer-facing card.

**Fix:** `Color: Midnight`

---

### m3 — Fallback response: "perfect phone" is a cliché
**Location:** `demoResponses.js` — `getAlexPhoneTurnResponse`, fallback branch

**Current:**
> "I can help you pick the perfect phone. What matters most to you — camera, battery life, screen size, or price?"

"The perfect phone" is overused marketing language. It also sets an expectation that can't be met — no phone is perfect.

**Fix:**
```
Happy to help you find the right fit. What matters most to you —
camera, battery, screen size, or keeping the cost down?
```

---

### m4 — "Rewards discount: −$25.00 (2,450 pts)" — points math should be visible
**Location:** `demoResponses.js` — iPhone 13 order summary

**Current:**
```
Regular price: $49.99
Rewards discount: −$25.00 (2,450 pts)
You pay: $24.99
```

The math here is actually very clear and this is one of the stronger moments in the flow. One small improvement: showing the points balance remaining after the redemption (as the Priya flow does: "20 pts remaining after redemption") would complete the picture.

**Fix — add one line:**
```
Points remaining after purchase: 0
```
Or if partial redemption is possible: show the remainder.

---

## ✅ What's Working Well

**Recommendation card copy** — "Best free phone — Super AMOLED, 50MP camera, 5G. No cost, no trade-in." is the right format: specific features, clear value statement, no filler. This is the benchmark for how plan/product cards should read across all personas.

**Rewards math** — "iPhone 13 drops to $24.99 after your 2,450 rewards points" makes the value tangible and personal. This is a strong loyalty moment.

**"Biggest upgrade from iPhone 12"** — Framing the A36 as the biggest upgrade from Alex's current device is smart contextual selling. It uses what the AI knows (his current device) to make the recommendation feel relevant, not generic.

**Order summary structure** — The summary card format (phone name, color, storage, price, shipping timeline, card on file) gives Alex everything he needs to confirm without leaving the conversation. Pre-populated card number (Visa ••••7823) removes friction at the highest-stakes moment.

**Fallback to preferences** — When the user's intent is unclear, asking "What matters most to you — camera, battery life, screen size, or price?" is a smart way to re-engage without dead-ending. The preference-led approach is the right instinct.

---

## Summary of Recommended Changes

| # | Location | Issue | Priority |
|---|---|---|---|
| C1 | `demoResponses.js` opening | Report format; irrelevant storage stat; not conversational | 🔴 Critical |
| M1 | `demoResponses.js` iPhone opener | "Great choice" premature; "just $24.99" | 🟡 Moderate |
| M2 | `demoResponses.js` Samsung opener | "Both" before phones are shown | 🟡 Moderate |
| M3 | `demoResponses.js` order summary pills | "Change color" pill has no flow — dead end | 🟡 Moderate |
| M4 | `demoResponses.js` free phone summaries | "Charge: None" redundant with "Price: FREE" | 🟡 Moderate |
| m1 | `IPhoneSMSModal.jsx` phone SMS | "Reply STOP to opt out" misplaced; tracking copy wordy | 🔵 Minor |
| m2 | `demoResponses.js` order summary | "Midnight (Black)" → "Midnight" | 🔵 Minor |
| m3 | `demoResponses.js` fallback | "perfect phone" cliché | 🔵 Minor |
| m4 | `demoResponses.js` iPhone summary | Show points remaining after redemption | 🔵 Minor |

---

*Audit produced by ClearPath AI / Cowork — April 1, 2026*
