# ClearPath AI — Persona Conversation Flows
**Source:** IDE_Telco_Master_Reference_v1.docx (User Stories) + Meeting feedback (Lam & Srinivas, Mar 26 2026)
**Last updated:** Mar 26, 2026

---

## How to Read These Flows

Each flow follows this structure:

```
[SCREEN STATE]  → What the UI renders
AI:             → What ClearPath AI says (left-aligned white bubble)
User:           → What the customer says or taps (right-aligned teal bubble)
QUICK REPLIES:  → Pill options shown below AI message
BRANCH →        → Flow forks here depending on selection
```

**Core rules applied across all flows (from meeting feedback):**
1. **Never ask what the provider already knows.** If account data covers it, present it — don't ask.
2. **Diagnostics before upsell.** Always try to solve the problem for free first.
3. **Ask permission before surfacing any plan card, refill CTA, or upsell.** Let the customer opt in.
4. **3 intent signals per persona.** The mini-dashboard always shows a composite picture, not a single alert.
5. **Sensible defaults.** Pre-populate plan, card, data balance. Let the user correct if wrong.
6. **Don't delay gratification.** If a user knows what they want, give them a direct path — no forced diagnosis.

---

## US-001 — Maria R.
**Story:** View data balance / recurring data problem
**Intent:** Refill | Urgency: Critical
**Trigger:** `?persona=maria` or `?user=1` or `?persona=us-001`

---

### Landing State

```
[MINI DASHBOARD]
  Plan: Total Base 5G   |  0.8 GB / 5 GB  [████░░░░░░] 16%  RED
  Renews: Apr 9, 2026   |  14 days away

[INTENT SIGNALS — 3 shown]
  🔴 CRITICAL   "Only 0.8 GB left — plan renews in 14 days"
  🟡 WARNING    "You ran out of data 11 of the last 12 months"
  🔵 INFO       "App opened 3 times today with no action taken"

[INTENT PILLS — personalized to Maria]
  "I'm running out of data"    "Change my plan"
  "Quick refill"               "Why does this keep happening?"
  "What are my options?"       "I need more hotspot"
  "Talk to someone"            "Show me everything"
```

---

### Flow A — Maria taps "I'm running out of data" or types it

```
AI:   "Hi Maria. I can see you have 0.8 GB left — and your plan
       doesn't renew until Apr 9, which is 14 days away.

       I also noticed you've run out of data 11 of the last 12 months.
       So you're probably here for one of two reasons:

       Quick fix for right now, or stop this from happening every month?"

QUICK REPLIES:
  [ Quick fix — add data now ]   [ Change my plan ]   [ Just checking ]

───────────────────────────────────────────────────────────────
BRANCH A1 → "Quick fix — add data now"
───────────────────────────────────────────────────────────────

AI:   "Got it. Here's what I'd recommend for right now:

       ┌─────────────────────────────────────┐
       │  5 GB Data Add-On                   │
       │  $15 · Activates instantly           │
       │  Keeps your current plan intact      │
       │  Charged to Visa ••••4291            │
       └─────────────────────────────────────┘

       Want me to go ahead with this?"

QUICK REPLIES:
  [ Yes — add 5 GB for $15 ]   [ Show other options ]   [ Not right now ]

  → User taps "Yes — add 5 GB for $15"

  [PROCESSING — 1.5s spinner]
  "Adding 5 GB to your account..."

  AI:   "Done ✓ 5 GB added. Your balance is now 5.8 GB.
         Confirmation sent to your phone on file."

  [iPHONE SMS MODAL appears]
  "Your Total Wireless account has been refilled.
   5 GB added. Valid through Apr 9, 2026."
  [X to dismiss]
  Caption: "Confirmation sent to your phone on file."

  AI:   "By the way — since this happens almost every month,
         do you want me to show you plans that would prevent it?
         No obligation to switch today."

  QUICK REPLIES:
    [ Yes, show me ]   [ Not right now ]

    → If "Yes, show me" → jump to BRANCH A2 below
    → If "Not right now" → END FLOW

───────────────────────────────────────────────────────────────
BRANCH A2 → "Change my plan"
───────────────────────────────────────────────────────────────

AI:   "Makes sense. Based on your usage, you've been using
       well over 5 GB every month. Here's what would stop
       this from happening again:

       ┌───────────────────────────────────────────────────┐
       │  Total 5G Unlimited                   RECOMMENDED │
       │  $55/mo · Unlimited data, no caps                 │
       │  +$15/mo from what you pay now                    │
       │  Includes Disney+                                 │
       └───────────────────────────────────────────────────┘

       You could start now (prorated for the rest of
       your cycle) or wait until Apr 9 — no charge today."

QUICK REPLIES:
  [ Start now — prorated ]   [ Switch on Apr 9 ]   [ Stay on current plan ]

  → BRANCH A2a: "Start now"

    AI:   "Here's what you'd pay today:

           Plan change: Total 5G Unlimited
           Prorated charge: ~$7.14 (14 days remaining)
           Charged to: Visa ••••4291

           Confirm?"

    QUICK REPLIES: [ Yes, upgrade now ]   [ Cancel ]

    → [PROCESSING — 1.5s]
    → AI: "You're on Unlimited ✓ No more data caps.
           New balance: Unlimited. Renews Apr 9 at $55."
    → [iPHONE SMS MODAL]
    → END FLOW

  → BRANCH A2b: "Switch on Apr 9"

    AI:   "Scheduled. Your plan will switch to Total 5G Unlimited
           on Apr 9. Nothing to pay today. I'll remind you before it happens."
    → END FLOW

  → BRANCH A2c: "Stay on current plan"
    → Return to landing
```

---

### Flow B — Maria taps "Quick refill" pill directly

```
AI:   "Sure. Want to add 5 GB right now for $15?
       I'll charge Visa ••••4291. Takes about 2 seconds."

QUICK REPLIES:
  [ Yes — do it ]   [ Show other options ]   [ Cancel ]

  → Same processing + SMS modal as Flow A1 above
```

---

## US-002 — Carlos M.
**Story:** Choose plan and amount before service expires
**Intent:** Refill | Urgency: Critical (2 days)
**Trigger:** `?persona=carlos` or `?persona=us-002`

---

### Landing State

```
[MINI DASHBOARD]
  Plan: Total Base 5G   |  2.1 GB / 5 GB  [████████░░] 42%  AMBER
  Renews: Mar 28, 2026  |  ⚠️  2 days away

[INTENT SIGNALS — 3 shown]
  🔴 CRITICAL   "Plan expires in 2 days — service will pause Mar 28"
  🔵 INFO       "AutoPay saves $5/mo — you've never used it"
  🔵 INFO       "680 Rewards Points — 320 away from a free add-on"

[INTENT PILLS — personalized]
  "Renew my plan"              "Enable AutoPay"
  "Upgrade while I'm here"     "What happens if I don't renew?"
  "Remind me later"            "Show all plans"
  "I have a question"          "Show me everything"
```

---

### Flow — Carlos taps "Renew my plan"

```
AI:   "Hey Carlos. Your plan expires in 2 days on Mar 28 —
       service will pause if it's not renewed.

       You're currently on Total Base 5G at $40/mo. Want
       to renew the same plan, or change while you're here?"

QUICK REPLIES:
  [ Renew Total Base 5G — $40 ]   [ See other plans ]   [ Remind me tomorrow ]

───────────────────────────────────────────────────────────────
BRANCH → "Renew Total Base 5G — $40"
───────────────────────────────────────────────────────────────

AI:   "Before I confirm — you could save $5/mo ($60/year)
       by enabling AutoPay. Want to add that now?

       ┌──────────────────────────────────────────┐
       │  Total Base 5G renewal                   │
       │  $40/mo  →  $35/mo with AutoPay          │
       │  Charged to: Mastercard ••••8810          │
       └──────────────────────────────────────────┘"

QUICK REPLIES:
  [ Yes — add AutoPay + save $5 ]   [ No — just renew at $40 ]

  → Either path → [PROCESSING 1.5s] → Success + SMS modal

───────────────────────────────────────────────────────────────
BRANCH → "See other plans"
───────────────────────────────────────────────────────────────

AI:   "Here are your options. Your data balance looks fine
       (2.1 GB left), so this is really about whether you
       want more room going forward:

       [ Total Base 5G   $40 · 5 GB ]  ← Your current plan
       [ 5G Unlimited    $55 · Unlimited + Disney+ ]
       [ 5G+ Unlimited   $65 · Unlimited + 50 GB hotspot ]

       Which one feels right?"

QUICK REPLIES:
  [ Stay on Base — $40 ]   [ Go Unlimited — $55 ]   [ Compare features ]

  → Selection → Confirm screen → [PROCESSING 1.5s] → SMS modal

───────────────────────────────────────────────────────────────
BRANCH → "Remind me tomorrow"
───────────────────────────────────────────────────────────────

AI:   "I'll remind you. Just note that service pauses on
       Mar 28 if not renewed — tomorrow is Mar 27, so
       you'll have about 24 hours. I'll send you a heads-up."

  → END FLOW
```

---

## US-003 — Priya S.
**Story:** Confirm and process refill payment — with Rewards redemption
**Intent:** Refill | Urgency: High (0.3 GB left + 1,020 pts redeemable)
**Trigger:** `?persona=priya` or `?persona=us-003`

---

### Landing State

```
[MINI DASHBOARD]
  Plan: Total Base 5G   |  0.3 GB / 5 GB  [█░░░░░░░░░] 6%  RED
  Renews: Apr 2, 2026   |  7 days away

[INTENT SIGNALS — 3 shown]
  🔴 CRITICAL   "Nearly out of data — 0.3 GB left, 7 days to go"
  🟡 WARNING    "1,020 Rewards Points — free 5 GB add-on available"
  🔵 INFO       "iPhone 13 storage is 76% full — hotspot backup may help"

[INTENT PILLS — personalized]
  "Use my rewards points"      "Quick refill"
  "Add data"                   "How many points do I have?"
  "What can I redeem?"         "Back up my phone"
  "Change my plan"             "Show me everything"
```

---

### Flow — Priya taps "Use my rewards points"

```
AI:   "Great timing, Priya. You have 1,020 Rewards Points —
       that's enough to redeem a free 5 GB Data Add-On (1,000 pts).

       ┌──────────────────────────────────────────────────┐
       │  5 GB Data Add-On                                │
       │  Value: $15    Your cost: $0 (1,000 pts)         │
       │  Activates instantly                             │
       │  20 pts remaining after redemption               │
       └──────────────────────────────────────────────────┘

       Want to use your points for this?"

QUICK REPLIES:
  [ Yes — redeem for free ]   [ Pay $15 instead ]   [ Save points for later ]

───────────────────────────────────────────────────────────────
BRANCH → "Yes — redeem for free"
───────────────────────────────────────────────────────────────

  [PROCESSING — 1.5s]
  "Redeeming your points..."

  AI:   "Done ✓ 5 GB added at no charge.
         Your balance is now 5.3 GB.
         20 Rewards Points remaining."

  [iPHONE SMS MODAL]
  Caption: "Confirmation sent to your phone on file."

  → END FLOW

───────────────────────────────────────────────────────────────
BRANCH → "Pay $15 instead"
───────────────────────────────────────────────────────────────

AI:   "Sure — I'll keep your points.
       Charging Visa ••••3377 for $15. Confirm?"

QUICK REPLIES: [ Confirm ]   [ Cancel ]

  → [PROCESSING 1.5s] → Success + SMS modal → END FLOW

───────────────────────────────────────────────────────────────
BRANCH → "Save points for later"
───────────────────────────────────────────────────────────────

AI:   "No problem. Do you still want to add data?
       You're at 0.3 GB — you may run out before Apr 2."

QUICK REPLIES:
  [ Add 5 GB — $15 ]   [ I'll be fine ]

  → If "Add 5 GB" → confirm + processing + SMS
  → If "I'll be fine" → END FLOW
```

---

## US-004 — James T.
**Story:** Activate new SIM or eSIM
**Intent:** Activate | Urgency: High (new customer, not yet connected)
**Trigger:** `?persona=james` or `?persona=us-004`

---

### Landing State

```
[MINI DASHBOARD — empty state]
  ⚡ "SIM not yet activated"
  No data meter | No plan shown | No renewal date

[INTENT SIGNALS — 3 shown]
  🔴 CRITICAL   "SIM not yet activated — let's get you connected"
  🔵 INFO       "340 Welcome Points waiting once you activate"
  🔵 INFO       "You're on Verizon 5G towers — same network, fraction of the cost"

[INTENT PILLS — activation focused]
  "Activate my SIM"            "Activate eSIM"
  "Port my old number"         "Pick a new number"
  "Choose a plan first"        "What's included?"
  "I have a question"          "Show me everything"
```

---

### Flow — James taps "Activate eSIM"

```
AI:   "Welcome, James! Let's get you connected —
       this usually takes about 3 minutes.

       I can see you have an iPhone 15 Pro, so eSIM
       is the fastest option. Does that work for you,
       or would you prefer a physical SIM instead?"

QUICK REPLIES:
  [ eSIM — let's go ]   [ Physical SIM ]   [ Port my number from another carrier ]

───────────────────────────────────────────────────────────────
BRANCH → "eSIM — let's go"
───────────────────────────────────────────────────────────────

AI:   "First, pick your plan. You can always change later:

       [ Total Base 5G      $40/mo · 5 GB ]
       [ Total 5G Unlimited $55/mo · Unlimited + Disney+ ]
       [ Total 5G+          $65/mo · Unlimited + 50 GB hotspot ]"

QUICK REPLIES:
  [ Total Base 5G — $40 ]   [ 5G Unlimited — $55 ]   [ Help me decide ]

  → User picks plan

AI:   "Great choice. Now let's verify your identity —
       this is a one-time step required by the carrier.
       [ID verification widget loads]"

  → ID verification passes

AI:   "You're all set ✓

       Your number: (555) 214-8834
       Plan: Total Base 5G · Activates instantly

       🎉 340 Welcome Points added to your account.

       Here's how to install your eSIM on iPhone 15 Pro:
       1. Go to Settings → Cellular → Add eSIM
       2. Tap 'Use QR Code' and scan below
       [QR CODE shown]"

  → END FLOW

───────────────────────────────────────────────────────────────
BRANCH → "Port my number from another carrier"
───────────────────────────────────────────────────────────────

AI:   "No problem — I'll transfer your existing number.
       I'll need a few things from your current carrier:

       • Carrier name
       • Account number
       • Account PIN or transfer PIN

       Your current service will stay active during the
       transfer — you won't have a gap in coverage."

  → User enters details → Plan selection → ID verify →
  → Port initiated (24hr window)

AI:   "Transfer started. Your number will move within
       24 hours. You'll get an SMS when it's active.
       340 Welcome Points have been added already."

  → END FLOW

───────────────────────────────────────────────────────────────
EDGE CASE → ID verification fails (3rd attempt)
───────────────────────────────────────────────────────────────

AI:   "We weren't able to verify your identity online —
       this sometimes happens and doesn't mean anything is wrong.

       You can complete activation at any Total Wireless store
       with a valid ID. I've saved your progress so you won't
       have to start over.

       [Find a store near me →]"
```

---

## US-005 — Angela K.
**Story:** Self-serve troubleshooting — connectivity issues
**Intent:** Support | Urgency: High (5 support calls, 4 dropped calls)
**Trigger:** `?persona=angela` or `?persona=us-005`

---

### Landing State

```
[MINI DASHBOARD]
  Plan: Total Base 5G   |  3.4 GB / 5 GB  [███████░░░] 68%  GREEN
  Renews: Apr 14, 2026  |  19 days away

[INTENT SIGNALS — 3 shown]
  🔴 CRITICAL   "5 support calls this month — let's figure this out together"
  🟡 WARNING    "Average signal: 2 bars — persistently weak in your area"
  🟡 WARNING    "4 dropped calls this week — possible network pattern"

[INTENT PILLS — support focused]
  "My calls keep dropping"     "My data is slow"
  "Check for outages"          "I've tried everything"
  "Talk to someone"            "Fix it for me"
  "Why is my signal weak?"     "Show me everything"
```

---

### Flow — Angela taps "My calls keep dropping"

```
AI:   "Hi Angela. I can see you've reached out 5 times
       this month — I'm sorry this is still happening.

       I also see your average signal has been around 2 bars
       lately, and you've had 4 dropped calls this week.
       That's a pattern, not a one-off.

       Let me check a few things first. Can I look up
       whether there's a known outage in your area?"

QUICK REPLIES:
  [ Yes — check for outages ]   [ Skip — I want to troubleshoot ]   [ Talk to someone now ]

───────────────────────────────────────────────────────────────
BRANCH → "Yes — check for outages"
───────────────────────────────────────────────────────────────

  [OUTAGE API CALL — checking location]

  → IF outage found:

  AI:   "Found it. There's a known network issue in your area
         (zip 78205). Estimated restore: Today by 6:00 PM CST.

         Our team is already working on it. I can notify you
         when service is restored — want me to do that?"

  QUICK REPLIES:
    [ Yes — notify me ]   [ No thanks ]

  → END FLOW (no upsell — outage is the cause)

  → IF no outage found:

  AI:   "No active outages in your area. This might be a
         device or settings issue. Want me to walk you
         through a few quick fixes that resolve this 90%
         of the time? Takes about 2 minutes."

  QUICK REPLIES:
    [ Yes — walk me through it ]   [ Skip to support ]

───────────────────────────────────────────────────────────────
BRANCH → Walk-through self-fix
───────────────────────────────────────────────────────────────

AI:   "Here are the steps. Check each one off as you go:

       ☐ Step 1: Restart your device
          (Hold power button → Restart)
       ☐ Step 2: Reset APN settings
          (Settings → Connections → Mobile Networks → APN → Reset)
       ☐ Step 3: Re-seat your SIM
          (Power off → Remove SIM → Reinsert → Power on)"

QUICK REPLIES:
  [ All done — still not working ]   [ Fixed it! ]   [ Need more help ]

  → IF "Fixed it!":

  AI:   "Glad that did it! If you have any more issues,
         I'm right here. Anything else I can help with today?"
  → END FLOW

  → IF "Still not working":

AI:   "OK — we've exhausted the standard fixes.
       Based on your signal history, it's possible
       a plan with Wi-Fi Calling enabled might help.

       Would you like me to show you options that
       include Wi-Fi Calling — or would you prefer
       to speak with someone on our team?"

QUICK REPLIES:
  [ Show plan options ]   [ Talk to support ]   [ Schedule a callback ]

  → IF "Show plan options":
    → Surface plan cards (with explicit user permission granted above)
    → Total 5G Unlimited highlighted (includes Wi-Fi Calling)

  → IF "Talk to support":
    AI: "Live chat wait time is about 4 minutes.
         Or I can schedule a callback for a time that works for you."
    QUICK REPLIES: [ Start live chat ]   [ Schedule callback ]   [ Call 1-866-663-3633 ]

───────────────────────────────────────────────────────────────
EDGE CASE → After 11:45 PM EST
───────────────────────────────────────────────────────────────

AI:   "Live chat is closed right now (closes at 11:45 PM EST).
       You can call 1-866-663-3633, or I can have an agent
       reach out to you first thing tomorrow morning."

QUICK REPLIES:
  [ Call now ]   [ Message for tomorrow ]
```

---

## US-006 — Derek W.
**Story:** Smart upsell — upgrade intent from recurring cap hits
**Intent:** Upgrade | Urgency: Upsell (at cap, 3rd consecutive month)
**Trigger:** `?persona=derek` or `?persona=us-006`

---

### Landing State

```
[MINI DASHBOARD]
  Plan: Total Base 5G   |  0 GB / 5 GB   [░░░░░░░░░░]  0%  RED
  Renews: Apr 5, 2026   |  10 days away

[INTENT SIGNALS — 3 shown]
  🔴 CRITICAL   "You hit your data cap again — 0 GB remaining"
  🟡 WARNING    "Cap hit 3 months in a row — and 10 of the last 12"
  🔵 INFO       "Upgrading to Unlimited includes Disney+ ($7.99/mo value)"

[INTENT PILLS — upgrade focused]
  "I'm out of data again"      "Upgrade my plan"
  "Just add data for now"      "Why does this keep happening?"
  "Show me Unlimited"          "What's the difference?"
  "Add data boost"             "Show me everything"
```

---

### Flow — Derek taps "I'm out of data again"

```
AI:   "Hey Derek. You've hit your cap again — and this is
       the 3rd month in a row. You've actually hit it
       10 out of the last 12 months.

       I want to be straight with you: at $15 for a
       5 GB add-on, you've likely spent around $150
       on top of your plan this year.

       There are two things I can do:
       Add 5 GB right now ($15), or upgrade you to Unlimited
       so this stops happening.

       Which would you prefer?"

QUICK REPLIES:
  [ Just add data for now — $15 ]   [ Tell me about Unlimited ]   [ Do nothing ]

───────────────────────────────────────────────────────────────
BRANCH → "Just add data for now — $15"
───────────────────────────────────────────────────────────────

AI:   "Got it. Adding 5 GB to your account now.
       Charged to: Visa ••••1144.
       Confirm?"

QUICK REPLIES: [ Confirm — $15 ]   [ Cancel ]

  → [PROCESSING 1.5s] → SMS modal

  AI:   "Done ✓ 5 GB added. Balance: 5 GB.

         One thing to note — your plan renews Apr 5.
         At your usage pace you'll likely hit the cap
         again before then. Want me to schedule an
         upgrade for Apr 5 so it's automatic?"

QUICK REPLIES:
  [ Yes — upgrade at renewal ]   [ No thanks ]

───────────────────────────────────────────────────────────────
BRANCH → "Tell me about Unlimited"
───────────────────────────────────────────────────────────────

AI:   "Here's the comparison for your situation:

       ┌─────────────────────────────────────────────────┐
       │  Total Base 5G (current)           $40/mo       │
       │  5 GB — you're already out                      │
       ├─────────────────────────────────────────────────┤
       │  Total 5G Unlimited        RECOMMENDED $55/mo   │
       │  Unlimited data — no caps, ever                 │
       │  Includes Disney+ ($7.99/mo value)              │
       │  Only $15 more per month                        │
       └─────────────────────────────────────────────────┘

       You'd save roughly $135/year vs. buying add-ons
       every month at your current pace.

       Want to upgrade now, or schedule it for Apr 5
       so there's no charge today?"

QUICK REPLIES:
  [ Upgrade now — prorated ~$5 ]   [ Upgrade at renewal Apr 5 ]   [ Stay on Base ]

  → BRANCH "Upgrade now":

  AI:   "Switching now. Prorated charge for remaining
         10 days of your cycle: ~$5.00
         Charged to: Visa ••••1144.
         Confirm?"

  QUICK REPLIES: [ Confirm ]   [ Cancel ]

  → [PROCESSING 1.5s]
  →
  AI:   "You're on Unlimited ✓ No more caps.
         And here's a bonus — you get Disney+ included."

  [DISNEY+ ACTIVATION FULL-SCREEN MOMENT]
  "Activate your Disney+ now →"   [Later]

  → SMS modal → END FLOW

  → BRANCH "Upgrade at renewal Apr 5":

  AI:   "Scheduled. Starting Apr 5 you'll be on Total 5G
         Unlimited at $55/mo. Nothing to pay today.
         Want me to add data for the next 10 days in the meantime?"

  QUICK REPLIES:
    [ Yes — add 5 GB for $10 ]   [ I'll manage ]
```

---

## US-007 — Ana G.
**Story:** Browse and purchase international add-ons
**Intent:** Add-on | Urgency: Medium (calling Colombia frequently)
**Trigger:** `?persona=ana` or `?persona=us-007`

---

### Landing State

```
[MINI DASHBOARD]
  Plan: Total Base 5G   |  3.2 GB / 5 GB  [██████░░░░] 64%  GREEN
  Renews: Apr 11, 2026  |  16 days away

[INTENT SIGNALS — 3 shown]
  🟡 WARNING    "You called Colombia 8 times this month — $18/mo savings available"
  🔵 INFO       "1,200 Rewards Points — free add-on ready to redeem"
  🔵 INFO       "Also called Mexico twice — Calling Card covers 200+ countries"

[INTENT PILLS — international focused]
  "I call internationally a lot"   "Save on Colombia calls"
  "What add-ons do I have?"        "How do I save money?"
  "Redeem my points"               "See all add-ons"
  "Add data boost"                 "Show me everything"
```

---

### Flow — Ana taps "Save on Colombia calls"

```
AI:   "Hi Ana. I can see you've called Colombia 8 times
       this month, plus 2 calls to Mexico. You're paying
       per-minute rates for those right now.

       The $10/mo Global Calling Card covers 200+ countries
       including both — and based on your call volume,
       it would save you about $18/mo.

       Plus — you have 1,200 Rewards Points. You could
       actually get the Calling Card completely free
       (1,000 pts) and keep $200 in your pocket.

       Want the free one?"

QUICK REPLIES:
  [ Yes — redeem 1,000 pts for free ]   [ Pay $10 instead ]   [ Tell me more ]

───────────────────────────────────────────────────────────────
BRANCH → "Yes — redeem 1,000 pts for free"
───────────────────────────────────────────────────────────────

  [PROCESSING 1.5s — 2 taps total from landing]

  AI:   "Done ✓ Global Calling Card added at no charge.
         200 Rewards Points remaining.

         Your calling balance: $10.00
         How to use it: Dial 1-800-504-9930,
         then the international number.
         Covers Colombia (+57), Mexico (+52), and 200+ more."

  → SMS confirmation → END FLOW

───────────────────────────────────────────────────────────────
BRANCH → "Tell me more"
───────────────────────────────────────────────────────────────

AI:   "The Global Calling Card is a $10/mo add-on that
       gives you discounted rates to 200+ countries.
       Here's how it compares to what you're paying now:

       Without card:  ~$0.25/min to Colombia
       With card:     ~$0.02/min to Colombia
       Savings:       ~$18/mo at your call volume

       Your 1,200 points cover the first month free,
       and it auto-renews at $10/mo after that.

       Cancel anytime — no contract."

QUICK REPLIES:
  [ Get it free with points ]   [ Pay $10/mo ]   [ Not right now ]

───────────────────────────────────────────────────────────────
BRANCH → "Not right now" / "See all add-ons"
───────────────────────────────────────────────────────────────

AI:   "Here's your full add-on catalog:

       ✅ $10 Global Calling Card   (you qualify, 1,000 pts or $10)
       ✅ $10 · 5 GB Data Add-On   (you qualify)
       ✅ $20 · 15 GB Data Add-On  (you qualify)
       ⬜ Disney+                   (available with Unlimited plans)

       Note: You're on Total Base 5G, so data add-ons
       are separate purchases — not included in the plan."

QUICK REPLIES:
  [ Global Calling Card ]   [ 5 GB Data Add-On ]   [ 15 GB Data Add-On ]

  → Each selection → confirm → processing → SMS confirmation
```

---

## US-008 — Robert L.
**Story:** Compare all three plans with live family pricing
**Intent:** Compare/Upgrade | Urgency: Low (researching, not urgent)
**Trigger:** `?persona=robert` or `?persona=us-008`

---

### Landing State

```
[MINI DASHBOARD]
  Plan: Total Base 5G   |  4.1 GB / 5 GB  [████████░░] 82%  GREEN
  Renews: Apr 20, 2026  |  25 days away  |  4 lines

[INTENT SIGNALS — 3 shown]
  🔵 INFO       "You manage 4 lines — all on Total Base 5G"
  🔵 INFO       "You've visited Plans 3 times this week"
  🔵 INFO       "5-year price guarantee on all plans — rates are locked"

[INTENT PILLS — comparison focused]
  "Compare all plans"          "Family pricing"
  "What's the difference?"     "Is Unlimited worth it?"
  "How much would I save?"     "Show me Unlimited"
  "I have 4 lines"             "Show me everything"
```

---

### Flow — Robert taps "Compare all plans"

```
AI:   "Hey Robert. You've checked Plans a few times this week —
       looks like you're thinking it over. Let me make it easy.

       You're on Total Base 5G with 4 lines. Here's how
       all three plans break down for your family:

       ┌───────────────────────────────────────────────────────┐
       │  Lines: [ 1 ]  [ 2 ]  [ 3 ]  [4] ← selected          │
       ├─────────────────┬──────────────┬──────────────────────┤
       │  Total Base 5G  │  $160/mo     │  $40 per line        │
       │  ← Your plan    │  5 GB/line   │                      │
       ├─────────────────┼──────────────┼──────────────────────┤
       │  5G Unlimited   │  $110/mo ⬇  │  $27.50 per line     │
       │  Most popular   │  Unlimited   │  + Disney+           │
       ├─────────────────┼──────────────┼──────────────────────┤
       │  5G+ Unlimited  │  $130/mo     │  $32.50 per line     │
       │                 │  Unlimited   │  + 50 GB hotspot     │
       └───────────────────────────────────────────────────────┘

       Switching to 5G Unlimited saves your family $50/mo —
       that's $600/year — and each line gets unlimited data."

QUICK REPLIES:
  [ Upgrade to 5G Unlimited — save $50/mo ]
  [ See full feature comparison ]
  [ Not ready to switch ]

───────────────────────────────────────────────────────────────
BRANCH → "See full feature comparison"
───────────────────────────────────────────────────────────────

AI:   "Here's the full breakdown. Tap any row for details:

       ┌──────────────────────┬────────┬────────────┬──────────┐
       │ Feature              │ Base   │ Unlimited  │ 5G+      │
       ├──────────────────────┼────────┼────────────┼──────────┤
       │ Data per line        │ 5 GB   │ Unlimited  │ Unlimited│
       │ Mobile hotspot       │ None   │ 15 GB      │ 50 GB    │
       │ Disney+              │ ✗      │ ✓          │ ✓        │
       │ 5G access            │ ✓      │ ✓          │ ✓        │
       │ Wi-Fi Calling        │ ✓      │ ✓          │ ✓        │
       │ International calls  │ Add-on │ Add-on     │ Add-on   │
       │ 5-year price lock    │ ✓      │ ✓          │ ✓        │
       └──────────────────────┴────────┴────────────┴──────────┘

       🔒 All plans include Total Wireless's 5-year
       price guarantee — your rate won't change."

QUICK REPLIES:
  [ Switch to Unlimited — $110/mo for 4 lines ]
  [ Switch at next renewal — Apr 20 ]
  [ I'll think about it ]

───────────────────────────────────────────────────────────────
BRANCH → "Upgrade to 5G Unlimited — save $50/mo"
───────────────────────────────────────────────────────────────

AI:   "Switching all 4 lines to Total 5G Unlimited.

       ┌──────────────────────────────────────────────────┐
       │  4 lines × Total 5G Unlimited                   │
       │  $110/mo total  (was $160/mo)                    │
       │  Prorated charge today: ~$26.67 (25 days left)  │
       │  Or: Start at renewal Apr 20 — $0 today         │
       └──────────────────────────────────────────────────┘

       Start now or wait until Apr 20?"

QUICK REPLIES:
  [ Start now — $26.67 today ]   [ Switch on Apr 20 — $0 today ]   [ Cancel ]

  → Either path → confirm → [PROCESSING 1.5s]
  →
  AI:   "All 4 lines upgraded ✓
         $110/mo starting your next cycle.
         Each line now has unlimited data + Disney+."

  → SMS modal → END FLOW

───────────────────────────────────────────────────────────────
BRANCH → "Not ready to switch" / "I'll think about it"
───────────────────────────────────────────────────────────────

AI:   "No pressure at all. Your current plan runs until
       Apr 20 — you have time.

       Want me to send you a summary of the comparison
       so you can review it later?"

QUICK REPLIES:
  [ Send summary to my phone ]   [ No thanks ]

  → IF yes: SMS sent with plan comparison link → END FLOW
  → IF no: END FLOW
```

---

## Flow Decision Matrix

Quick reference for which flow to load per persona:

| Persona | ID | Entry Signal | First AI Message Tone | Upsell Gate |
|---|---|---|---|---|
| Maria R. | us-001 | Critical data low | Empathetic + pattern-aware | After refill success |
| Carlos M. | us-002 | Plan expiring in 2 days | Urgent + helpful | During renewal |
| Priya S. | us-003 | Rewards points redeemable | Opportunity-first | Built into refill confirm |
| James T. | us-004 | No account yet | Welcoming + guiding | N/A (activation only) |
| Angela K. | us-005 | Persistent connectivity | Empathetic + diagnostic | Only after diagnostics exhausted |
| Derek W. | us-006 | At cap, repeat offender | Direct + pattern-aware | Immediate (user came for this) |
| Ana G. | us-007 | International calling | Savings-first | Built into add-on offer |
| Robert L. | us-008 | Plan shopping | Neutral + informational | User-initiated only |

---

## Global Edge Cases

These apply across all personas and flows:

### Language Toggle (EN → ES)
All AI messages should re-render in Spanish when ES is selected. Quick reply pills translate. The flow logic itself does not change — only copy changes.

### Empty / Error States
- **API timeout on data balance:** Show skeleton loader, then "Usage may be delayed — last updated [time]"
- **Payment declined:** Show inline error on confirm screen. Offer: retry, add new card, digital wallet. Do not navigate away.
- **Processing > 5 seconds:** Show "Still working — this is taking longer than usual."

### Persona with No Data (us-004 — New Activation)
- Dashboard renders in empty state — no meters, no plan, no renewal date
- Never show intent signals about data usage (there is none)
- After activation success: switch to standard dashboard state

### Quick "Show Me Everything" Escape Hatch
Any persona can tap "Show me everything" at any time to see a full gallery or full plan list without going through a diagnostic flow. The agent should not block this.

---

*ClearPath AI · Intent-Driven Experience · Total Wireless (Verizon Value) · v1.0 · March 2026*
