# ClearPath AI — Persona Conversation Flows
**Source:** IDE_Telco_Master_Reference_v1.docx (User Stories) + Meeting feedback (Lam & Srinivas, Mar 28 2026)
**Last updated:** Mar 28, 2026

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

**Core rules applied across all flows (from personas.js global rules):**
1. **Never ask what the provider already knows.** Each persona has a `providerKnows[]` list. If it's on that list, present it — don't ask. Surface the fact, let the customer confirm or correct.
2. **Diagnose before selling.** Always try to solve the problem for free first. Only offer a paid option after free/diagnostic steps are exhausted or the customer explicitly skips them.
3. **Ask permission before surfacing any plan card, refill CTA, or upsell.** "Would you like to see your options?" — let the customer say no.
4. **Always give an escape hatch.** The customer can skip diagnosis, opt out of an upsell, or tap "Show me everything" at any point to reach the end state directly.
5. **Sensible defaults everywhere.** Pre-populate plan, saved card, and data balance. Let the customer correct if wrong — never make them enter something you already have.

---

## US-001 — Maria R.
**Story:** View data balance / recurring data problem
**Intent:** Refill | Urgency: Critical
**Trigger:** `?persona=maria` or `?user=1` or `?persona=us-001`

**Provider already knows (do NOT ask about these):**
- Current data balance (0.8 GB)
- Plan renewal date (Apr 9, 2026 — 14 days away)
- How often she runs out (11 of last 12 months)
- Wi-Fi usage percentage (22% — mostly on cellular)
- Daily average data usage (~0.28 GB/day)
- Saved payment card (Visa ••••4291)
- Device model (Samsung Galaxy A14)

---

### Landing State

```
[MINI DASHBOARD]
  Plan: Total Base 5G   |  0.8 GB / 5 GB  [██░░░░░░░░] 16%  RED
  Renews: Apr 9, 2026   |  14 days away

[INTENT SIGNALS — 3 shown]
  🔴 CRITICAL   "Only 0.8 GB left — plan renews in 14 days"
  🟡 WARNING    "You ran out of data 11 of the last 12 months"
  🔵 INFO       "App opened 3 times today with no action taken"

[SUGGESTED ACTION PILLS — diagnosis first]
  "Why am I running out?"      "Quick Refill — $15"
  "Change my plan"             "I'm fine for now"
```

---

### Flow A — Maria taps "Why am I running out?" (Diagnosis path)

```
AI:   "Hi Maria. You have 0.8 GB left and 14 days until your
       plan renews on Apr 9.

       We can also see that this has happened 11 of the last
       12 months — so let's see if we can figure out why and
       maybe fix it for free.

       One thing that stands out: only 22% of your usage is
       going through Wi-Fi. That means most of your data is
       being used on cellular — even when you might not need to.

       A couple of quick questions:"

QUICK REPLIES:
  [ Let's do it ]   [ Skip — just add data ]   [ Skip — change my plan ]

───────────────────────────────────────────────────────────────
BRANCH A-DIAG → Diagnosis walkthrough
───────────────────────────────────────────────────────────────

AI:   "Are you connected to Wi-Fi when you're at home or at work?"

QUICK REPLIES:
  [ Yes, always ]   [ Sometimes ]   [ I'm not sure ]

  → If "Sometimes" or "Not sure":

AI:   "That could be it. If your phone switches to cellular
       automatically when Wi-Fi is slow, it burns through data
       without you noticing.

       Do you stream video or music on cellular — not just on Wi-Fi?"

QUICK REPLIES:
  [ Yes, often ]   [ Occasionally ]   [ Rarely ]

  → If "Yes" or "Occasionally":

AI:   "That can use 1–3 GB per hour on HD.

       Last one: do you have apps set to auto-update or sync
       in the background on cellular?"

QUICK REPLIES:
  [ Probably yes ]   [ I've disabled it ]   [ Not sure ]

AI:   "Here are three free fixes that could help:

       ✅ Turn off 'Wi-Fi Assist' in Settings so your phone
          stops switching to cellular automatically
       ✅ Set YouTube/Netflix to 'Wi-Fi only' in their settings
       ✅ Go to Settings → turn off Background App Refresh for
          apps you don't need syncing constantly

       Want to try these first? If they don't fully solve it,
       we can look at adding more data or changing your plan."

QUICK REPLIES:
  [ I'll try those ]   [ Add data for now — $15 ]   [ Show plan options ]

  → If "I'll try those": → END FLOW

  → If "Add data for now": → jump to BRANCH A1 below

  → If "Show plan options": → jump to BRANCH A2 below

───────────────────────────────────────────────────────────────
BRANCH A1 → Quick Refill ($15)
───────────────────────────────────────────────────────────────

AI:   "Got it. Here's what I'd add right now:

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

  AI:   "Since this has happened 11 of the last 12 months —
         would you like to see plans that would prevent it?
         No obligation to switch today."

  QUICK REPLIES:
    [ Yes, show me ]   [ Not right now ]

    → If "Yes, show me" → jump to BRANCH A2 below
    → If "Not right now" → END FLOW

───────────────────────────────────────────────────────────────
BRANCH A2 → Plan Change
───────────────────────────────────────────────────────────────

AI:   "Based on your usage, you've been needing more than 5 GB
       almost every month. Here's what would stop this
       from happening again:

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

### Flow B — Maria taps "Quick Refill — $15" directly

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

**Provider already knows (do NOT ask about these):**
- Plan expiry date (Mar 30, 2026 — 2 days away)
- Current data remaining (2.1 GB)
- Last plan (Total Base 5G — pre-select for renewal)
- AutoPay has never been enabled (potential $5/mo savings)
- Rewards Points balance (680 — 320 away from free add-on)
- Saved payment card (Mastercard ••••8810)

---

### Landing State

```
[MINI DASHBOARD]
  Plan: Total Base 5G   |  2.1 GB / 5 GB  [████████░░] 42%  AMBER
  Renews: Mar 30, 2026  |  ⚠️  2 days away

[INTENT SIGNALS — 3 shown]
  🔴 CRITICAL   "Plan expires in 2 days — service will pause Mar 30"
  🔵 INFO       "AutoPay saves $5/mo — you've never used it"
  🔵 INFO       "680 Rewards Points — 320 away from a free add-on"

[SUGGESTED ACTION PILLS — personalized]
  "Renew Total Base 5G — $40"      "Upgrade to Unlimited — $55"
  "Enable AutoPay & save $5"       "What happens if I don't renew?"
```

---

### Flow — Carlos taps "Renew my plan"

```
AI:   "Hey Carlos. Your plan expires in 2 days on Mar 30 —
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
       Mar 30 if not renewed — tomorrow is Mar 29, so
       you'll have about 24 hours. I'll send you a heads-up."

  → END FLOW
```

---

## US-003 — Priya S.
**Story:** Confirm and process refill payment — with Rewards redemption
**Intent:** Refill | Urgency: High (0.3 GB left + 1,020 pts redeemable)
**Trigger:** `?persona=priya` or `?persona=us-003`

**Provider already knows (do NOT ask about these):**
- Current data balance (0.3 GB — nearly empty)
- Plan renewal date (Apr 2, 2026)
- Rewards points balance (1,020 — enough for free 5 GB add-on)
- Saved payment card (Visa ••••3377)
- Device storage is 76% full (iPhone 13, 128 GB)
- AutoPay is not enabled

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

[SUGGESTED ACTION PILLS — free option leads]
  "Redeem 1,000 pts — free 5 GB"   "Quick Refill — $15 data add-on"
  "Renew full plan early — $40"    "Save my points for later"
```

---

### Flow — Priya taps "Redeem 1,000 pts — free 5 GB"

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

**Provider already knows (do NOT ask about these):**
- Device model (iPhone 15 Pro — eSIM compatible)
- SIM type selected (eSIM)
- Account is not yet active
- 340 welcome points waiting on activation

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

[SUGGESTED ACTION PILLS — activation focused]
  "Activate eSIM on iPhone 15 Pro"   "Scan physical SIM instead"
  "Port my number from another carrier"
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

**Provider already knows (do NOT ask about these):**
- Support call history (5 calls this month)
- Average signal strength (2 bars — persistently weak)
- Dropped call count this week (4)
- Device model (Samsung Galaxy A54)
- Current plan and data balance
- Whether there is a known outage in her area

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

[SUGGESTED ACTION PILLS — support focused]
  "Check for outages in my area"    "Walk me through a fix"
  "Talk to someone"
```

---

### Flow — Angela taps "My calls keep dropping" or "Check for outages"

```
AI:   "Hi Angela. I can see you've reached out 5 times
       this month — I'm sorry this is still happening.

       I also see your average signal has been around 2 bars
       lately, and you've had 4 dropped calls this week.
       That's a pattern, not a one-off.

       Let me check for a known outage in your area first —
       that's the fastest thing to rule out."

  [OUTAGE CHECK — running silently in background]

───────────────────────────────────────────────────────────────
BRANCH → Outage found
───────────────────────────────────────────────────────────────

  AI:   "Found it. There's a known network issue in your area
         (zip 78205). Estimated restore: Today by 6:00 PM CST.

         Our team is already working on it. I can notify you
         when service is restored — want me to do that?"

  QUICK REPLIES:
    [ Yes — notify me ]   [ No thanks ]

  → END FLOW (no upsell — outage is the cause)

───────────────────────────────────────────────────────────────
BRANCH → No outage found — begin device diagnostics
───────────────────────────────────────────────────────────────

AI:   "No active outages in your area. This might be a
       device or settings issue. Let me walk you through
       four steps that fix this 90% of the time."

STEP 1:

AI:   "Have you tried restarting your Samsung Galaxy A54 recently?"

QUICK REPLIES:
  [ Yes, still the same ]   [ No — let me try ]   [ I restart it often ]

  → If "No — let me try": wait, then continue
  → If "Yes, still same": proceed to Step 2

STEP 2:

AI:   "Is your issue worse indoors, or about the same everywhere?"

QUICK REPLIES:
  [ Worse indoors ]   [ Same everywhere ]   [ Not sure ]

  → If "Worse indoors":
    AI: "Building materials block signals by 1–2 bars.
         Try moving to a window or stepping outside briefly
         to test if signal improves. That would tell us if
         this is a coverage issue vs. a device issue."

    QUICK REPLIES: [ It improves outside ]   [ Same outside too ]

STEP 3:

AI:   "Try toggling Airplane Mode on for 10 seconds, then off.
       This forces your phone to reconnect to the nearest tower."

QUICK REPLIES:
  [ Done — still not working ]   [ That helped! ]

STEP 4:

AI:   "One more: check that your SIM card is seated properly.
       Power off your Galaxy A54, remove the SIM, reseat it,
       then power back on. Can you try that?"

QUICK REPLIES:
  [ Done — still the same ]   [ Fixed it! ]   [ How do I do that? ]

───────────────────────────────────────────────────────────────
BRANCH → All steps done, still not working
───────────────────────────────────────────────────────────────

AI:   "OK — we've gone through all the standard fixes and
       none of them resolved it. At this point it may be a
       deeper coverage issue in your area.

       Would you like to look at options that might help —
       like a plan with Wi-Fi Calling enabled — or would you
       prefer to speak with someone on our network team?"

QUICK REPLIES:
  [ Show plan options with Wi-Fi Calling ]
  [ Talk to support ]
  [ Schedule a callback ]

  → IF "Show plan options":
    → Surface plan cards (explicit permission granted above)
    → Total 5G Unlimited highlighted (includes Wi-Fi Calling)

  → IF "Talk to support":
    AI: "Live chat wait time is about 4 minutes.
         Or I can schedule a callback for a time that works for you."
    QUICK REPLIES: [ Start live chat ]   [ Schedule callback ]   [ Call 1-866-663-3633 ]

───────────────────────────────────────────────────────────────
BRANCH → "Fixed it!"
───────────────────────────────────────────────────────────────

AI:   "Glad that did it! If you have any more issues,
       I'm right here. Anything else I can help with today?"

  → END FLOW

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

**Provider already knows (do NOT ask about these):**
- Data cap hit 3 months in a row (and 10 of last 12)
- Currently at 0 GB — cap hit again
- Estimated annual overage spend (~$150/yr on data boosts)
- Unlimited plan is only $15 more per month
- AutoPay is already enabled
- Rewards Points balance (890)
- Device (Google Pixel 8)
- Wi-Fi usage (35% — room to optimize but pattern suggests genuine heavy use)

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

[SUGGESTED ACTION PILLS — diagnosis first]
  "Why do I keep hitting my cap?"       "Upgrade to Unlimited — $55/mo"
  "Start at next renewal (no charge)"   "Just add 5 GB for now — $10"
```

---

### Flow A — Derek taps "Why do I keep hitting my cap?" (Diagnosis)

```
AI:   "Hey Derek. You've hit your cap again — and this is
       the 3rd month in a row (10 of the last 12 months overall).

       We can look at some usage tips, though I'll be straight
       with you: with a pattern like yours, it might just be
       that Unlimited is the right fit. But let's see.

       Do you stream video often on cellular — YouTube,
       TikTok, Netflix — not just on Wi-Fi?"

QUICK REPLIES:
  [ Yes, a lot ]   [ Sometimes ]   [ Rarely ]

  → If "Yes" or "Sometimes":

AI:   "That can use 1–3 GB per hour on HD.

       Do you also use your phone as a hotspot for a laptop
       or other devices?"

QUICK REPLIES:
  [ Yes, regularly ]   [ Occasionally ]   [ Never ]

AI:   "Here are a few things you could try to reduce usage:

       ✅ Set YouTube/Netflix/TikTok to Wi-Fi only in settings
       ✅ Check your top data-draining apps:
          Settings → Network → Data Usage
       ✅ Disable background data for apps you don't need
          syncing constantly

       That said — with 10 of 12 months at the cap, you've
       likely spent around $150 extra this year on data boosts
       that Unlimited would have prevented.

       Want to see your upgrade options?
       You can start now or schedule it for Apr 5 — no charge today."

QUICK REPLIES:
  [ Show upgrade options ]   [ I'll try the tips first ]   [ Not right now ]

  → If "Show upgrade options": → BRANCH B below
  → If "I'll try the tips first" / "Not right now": → END FLOW
```

---

### Flow B — Derek taps "Upgrade to Unlimited" or comes from diagnosis

```
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

### Flow C — Derek taps "Just add 5 GB for now — $10"

```
AI:   "Got it. Adding 5 GB to your account now.
       Charged to: Visa ••••1144.
       Confirm?"

QUICK REPLIES: [ Confirm — $10 ]   [ Cancel ]

  → [PROCESSING 1.5s] → SMS modal

  AI:   "Done ✓ 5 GB added. Balance: 5 GB.

         One thing to note — your plan renews Apr 5.
         At your usage pace you'll likely hit the cap
         again before then. Want me to schedule an
         upgrade for Apr 5 so it's automatic?"

QUICK REPLIES:
  [ Yes — upgrade at renewal ]   [ No thanks ]
```

---

## US-007 — Ana G.
**Story:** Browse and purchase international add-ons
**Intent:** Add-on | Urgency: Medium (calling Colombia frequently)
**Trigger:** `?persona=ana` or `?persona=us-007`

**Provider already knows (do NOT ask about these):**
- International call history (8 calls to Colombia, 94 min; 2 calls to Mexico, 12 min)
- Estimated per-minute charges this month (~$28)
- Global Calling Card would save ~$18/mo on Colombia calls
- Rewards Points balance (1,200 — enough for free Calling Card)
- No active add-ons
- Saved payment card (Visa ••••9902)

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

[SUGGESTED ACTION PILLS — free option leads]
  "Redeem 1,000 pts — get it free"   "Add Global Calling Card — $10/mo"
  "See all add-ons"
```

---

### Flow — Ana taps "Redeem 1,000 pts — get it free"

```
AI:   "Hi Ana. I can see you've called Colombia 8 times
       this month, plus 2 calls to Mexico. You're paying
       per-minute rates for those right now — around $28 this month.

       The $10/mo Global Calling Card covers 200+ countries
       including both Colombia and Mexico, and it would save
       you about $18/mo at your call volume.

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

**Provider already knows (do NOT ask about these):**
- 4 lines currently managed — all on Total Base 5G
- Current monthly spend ($160 for 4 lines)
- Visited Plans page 3 times this week (comparison intent)
- Unlimited at 4 lines is $27.50/line — LESS per line than Base at $40
- AutoPay not enabled (potential $5/mo per line savings)
- Rewards Points balance (560)

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

[SUGGESTED ACTION PILLS — exploration, no pressure]
  "See side-by-side plan comparison"   "Calculate 4-line family pricing"
  "Upgrade to Unlimited"
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
       that's $600/year — and each line gets unlimited data.

       🔒 5-year price guarantee applies to all plans."

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

| Persona | ID | Entry Signal | Diagnosis Path | Upsell Gate |
|---|---|---|---|---|
| Maria R. | us-001 | Critical data low | ✅ Enabled — Wi-Fi/usage tips before refill | After diagnosis exhausted or skipped |
| Carlos M. | us-002 | Plan expiring in 2 days | ❌ Not applicable — urgency is expiry | During renewal (AutoPay offer) |
| Priya S. | us-003 | Rewards points redeemable | ❌ Not applicable — she's at payment step | Built into refill confirm (free option leads) |
| James T. | us-004 | No account yet | ❌ Not applicable — activation only | N/A |
| Angela K. | us-005 | Persistent connectivity | ✅ Enabled — 4 diagnostic steps before any upsell | Only after all steps exhausted + user confirms nothing worked |
| Derek W. | us-006 | At cap, repeat offender | ✅ Enabled — brief (pattern suggests plan change needed) | After diagnosis or if user skips it |
| Ana G. | us-007 | International calling | ❌ Not applicable — need is clear | Built into add-on offer (free redemption leads) |
| Robert L. | us-008 | Plan shopping | ❌ Not applicable — exploration mode | User-initiated only, no pressure |

---

## Global Edge Cases

These apply across all personas and flows:

### Language Toggle (EN → ES)
All AI messages should re-render in Spanish when ES is selected. Quick reply pills translate using the `labelEs` field on each `suggestedAction`. The flow logic itself does not change — only copy changes.

### Never Ask What the Provider Knows
Each persona has a `providerKnows[]` array in `personas.js`. Before generating any clarifying question, the AI should check: "Is this something the provider already has?" If yes, state it and let the customer confirm — do not ask. Use `getProviderContext(persona)` to inject this list into the system prompt.

### Empty / Error States
- **API timeout on data balance:** Show skeleton loader, then "Usage may be delayed — last updated [time]"
- **Payment declined:** Show inline error on confirm screen. Offer: retry, add new card, digital wallet. Do not navigate away.
- **Processing > 5 seconds:** Show "Still working — this is taking longer than usual."

### Persona with No Data (us-004 — New Activation)
- Dashboard renders in empty state — no meters, no plan, no renewal date
- Never show intent signals about data usage (there is none)
- After activation success: switch to standard dashboard state

### Quick "Show Me Everything" / Direct Path Escape Hatch
Any persona can skip the guided flow at any point. If a customer says "I know what I want — show me your phones" or taps a direct action, do not force them through diagnosis. Give them the direct path. The diagnosis flow is an offer, not a gate.

### Diagnosis Flow is an Offer, Not a Gate
The diagnosis path (`diagnosisFlow.enabled: true`) should always be presented as one option among three — never the only path. Customers who know what they want (refill, upgrade) should be able to get there in one tap without going through diagnostic questions.
