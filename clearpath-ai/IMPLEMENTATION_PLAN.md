# ClearPath AI — Implementation Plan (Review Call Feedback)

**Date:** March 31, 2026
**Next Review:** April 1, 2026 (morning)
**Priority:** Homepage redesign (P1) → Conversation flows for 3 personas (P2)

---

## Overview

Implement all feedback from the March 31 review call with Lam and Srinivas. The core theme is: maximize vertical space on the homepage, make the dashboard more informative, show prompts only on input focus, and nail 3 conversation flows for the demo.

## Current State Analysis

The app is a React 19 + Vite 5 prototype with 17 components. The core architecture is solid — ChatContext manages state, personas drive the UI, demoResponses.js handles the conversation logic. Key findings from the code:

- **LandingScreen.jsx:168-213** — Brand logo + subhead take ~120px of vertical space. Both to be removed.
- **LandingScreen.jsx:235-262** — Pills grid is always rendered on landing. Needs to be conditional on `state.inputFocused`.
- **InputBar.jsx:62-73** — Already dispatches `SET_INPUT_FOCUSED` on focus/blur with a 200ms blur delay. The plumbing exists.
- **ChatContext.jsx:19** — `inputFocused: false` is already tracked in state.
- **MiniDashboard.jsx:149-226** — 5 tiles: Data, Plan, Network, Renewal, Monthly Spend. Network and Monthly need replacing.
- **personas.js:413-533** — Angela (us-005) has full conversation data and 4-step diagnosis flow.
- **personas.js:860-917** — Alex (us-009) is BYOP persona. Will be repurposed as "Buy a new phone."
- **demoResponses.js:528-636** — Angela has 7 turns of conversation logic, working correctly.
- **products.js:82+** — PHONES array has 6+ devices with prices, specs, images.

### Key Discoveries:
- `state.inputFocused` already exists in ChatContext — pills-on-focus is a 10-line change
- MiniDashboard already handles `isEmpty` state — framework supports new tile types
- Angela's flow is actually solid through 7 turns — the "break" in the demo was likely a pill-matching edge case, not a structural bug
- No "buy a new phone" conversation flow exists — needs full creation in demoResponses.js

## Desired End State

After this plan is complete:
1. Homepage shows: Greeting → Headline → Intent Alerts → Dashboard → (scrollable: Extras cards) — no logo, no subhead, no pills on initial view
2. Pills appear in two categories (personalized + browse) when input bar is focused
3. Dashboard has: Data, Rewards, Plan, Renewal, Usage Trend, Extras — no Network, no Monthly Spend
4. Three conversation flows are demo-ready: Maria (refill), Angela (connectivity), Alex (buy phone)
5. All text has WCAG AA contrast compliance

## What We're NOT Doing

- EN/ES language toggle (code stays, not demoed)
- Building out the "browse" category prompts (just show them, clicking shows a "coming soon" message)
- Real API integration (demoResponses only)
- Other persona flows beyond the 3 priority ones
- Mobile responsiveness polish (desktop demo only)

---

## Phase 1: Homepage Layout — Remove Logo, Subhead, Relocate Pills

### Overview
Strip the landing screen to essentials: greeting + headline + intent alerts + dashboard. Move pills to appear only on input focus.

### Changes Required:

#### 1. Remove Brand Logo + Subhead from LandingScreen
**File**: `src/components/LandingScreen/LandingScreen.jsx`
**Changes**: Delete the brand block (lines 168-178) and subhead block (lines 205-213). Keep the greeting and headline.

Remove this JSX (brand):
```jsx
{/* Brand */}
<motion.div className={styles.brand} ...>
  <div className={styles.logoMark}>
    <Sparkle size={26} weight="fill" />
  </div>
  <span className={styles.logoText}>ClearPath AI</span>
</motion.div>
```

Remove this JSX (subhead):
```jsx
{/* Subhead */}
<motion.p className={styles.subhead} ...>
  {t('subhead')}
</motion.p>
```

Also remove the `Sparkle` import from `@phosphor-icons/react` if it becomes unused.

#### 2. Move Pills to Input-Focus Only
**File**: `src/components/LandingScreen/LandingScreen.jsx`
**Changes**: Wrap the pills grid in a conditional that checks `state.inputFocused`. Only render when focused.

Current (always visible):
```jsx
<motion.div className={styles.pillsGrid} ...>
  {pills.map(...)}
</motion.div>
```

New (focus-only, with two categories):
```jsx
{state.inputFocused && (
  <motion.div
    className={`${styles.pillsGrid} ${styles.pillsGridFocused}`}
    variants={containerVariants}
    initial="hidden"
    animate="show"
  >
    {/* Category 1: Personalized */}
    <div className={styles.pillCategory}>
      <span className={styles.pillCategoryLabel}>For You</span>
      <div className={styles.pillCategoryGrid}>
        {personalizedPills.map((pill, idx) => (
          <motion.button key={idx} className={styles.pill} onClick={() => startChat(pill.prompt)} variants={itemVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <span className={styles.pillIcon}><IconComponent size={18} /></span>
            <span>{pill.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
    {/* Category 2: Browse */}
    <div className={styles.pillCategory}>
      <span className={styles.pillCategoryLabel}>Explore</span>
      <div className={styles.pillCategoryGrid}>
        {browsePills.map((pill, idx) => (
          <motion.button key={idx} className={styles.pill} onClick={() => startChat(pill.prompt)} variants={itemVariants}>
            <span className={styles.pillIcon}><Icons.MagnifyingGlass size={18} /></span>
            <span>{pill.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  </motion.div>
)}
```

Also add a frosted backdrop behind the floating pills (CSS already has `.pillsBackdrop`).

#### 3. Add Browse Pills Data
**File**: `src/components/LandingScreen/LandingScreen.jsx`
**Changes**: Add a static array of browse pills and split `getPersonaPills` output into personalized (first 4) + browse:

```js
const BROWSE_PILLS = [
  { label: 'Show me all plans',       prompt: 'Show me all available plans.' },
  { label: 'Show me the latest phones', prompt: 'Show me the latest phones available.' },
  { label: 'Show me current deals',   prompt: 'Show me all current deals and promotions.' },
  { label: 'My rewards & points',     prompt: 'Tell me about my rewards points and how to use them.' },
];
```

Split the existing `getPersonaPills` return to only 4 personalized pills instead of 8.

#### 4. CSS Adjustments
**File**: `src/components/LandingScreen/LandingScreen.module.css`
**Changes**:
- Remove or comment out `.brand`, `.logoMark`, `.logoText`, `.subhead` styles
- Add `.pillCategory`, `.pillCategoryLabel`, `.pillCategoryGrid` styles
- Adjust `.landing` padding to use the reclaimed vertical space
- Ensure `.pillsGridFocused` positions the floating pills correctly above the input bar

### Success Criteria:

#### Automated Verification:
- [ ] App builds without errors: `npm run build`
- [ ] No console errors on page load
- [ ] No unused imports flagged by ESLint: `npm run lint`

#### Manual Verification:
- [ ] Landing screen shows only: Greeting → Headline → Intent Alerts → Dashboard (no logo, no subhead, no pills)
- [ ] Clicking/tapping the input bar reveals two categories of pills floating above it
- [ ] Clicking outside the input bar hides the pills (200ms delay)
- [ ] Personalized pills are contextual to the persona
- [ ] Browse pills show "Show me all plans", "Show me latest phones", etc.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation before proceeding to Phase 2.

---

## Phase 2: Dashboard Overhaul — Rewards, Usage Trend, Extras Cards

### Overview
Replace the Network and Monthly Spend tiles with Rewards and Usage Trend. Add a visual Extras/Add-ons card section below the dashboard.

### Changes Required:

#### 1. Replace Network Tile with Usage Trend Sparkline
**File**: `src/components/MiniDashboard/MiniDashboard.jsx`
**Changes**: Remove the Network tile (lines 186-200). Replace with a Usage Trend mini bar chart.

New component (add inside MiniDashboard.jsx):
```jsx
function UsageTrend({ data = [], dataTotal }) {
  // data = array of { month: 'Oct', used: 4.2 } — 5 months
  const max = parseFloat(dataTotal) || 5;
  return (
    <div className={styles.trendBars}>
      {data.map((d, i) => (
        <div key={i} className={styles.trendCol}>
          <div className={styles.trendBar}>
            <div
              className={styles.trendFill}
              style={{
                height: `${Math.min((d.used / max) * 100, 100)}%`,
                background: d.used >= max * 0.9 ? '#DC3545' : d.used >= max * 0.5 ? '#FFC107' : '#00B5AD',
              }}
            />
          </div>
          <span className={styles.trendLabel}>{d.month}</span>
        </div>
      ))}
    </div>
  );
}
```

#### 2. Replace Monthly Spend Tile with Rewards Tile
**File**: `src/components/MiniDashboard/MiniDashboard.jsx`
**Changes**: Remove Monthly Spend tile (lines 214-225). Replace with:

```jsx
{/* Tile — Rewards */}
<div className={`${styles.tile} ${styles.tileRewards}`}>
  <div className={styles.tileLabel}>Rewards</div>
  <div className={styles.rewardsPoints} style={{ color: '#00B5AD' }}>
    {account.rewardsPoints?.toLocaleString() || '0'}
  </div>
  <div className={styles.rewardsUnit}>points</div>
  {account.rewardsPoints >= 1000 && (
    <div className={styles.rewardsBadge}>FREE ADD-ON READY</div>
  )}
</div>
```

#### 3. Add Usage History to Persona Data
**File**: `src/data/personas.js`
**Changes**: Add `usageHistory` array to each of the 3 priority personas' `account` object:

```js
// Maria (us-001) — consistently hits cap
usageHistory: [
  { month: 'Nov', used: 5.0 },
  { month: 'Dec', used: 4.8 },
  { month: 'Jan', used: 5.0 },
  { month: 'Feb', used: 4.9 },
  { month: 'Mar', used: 4.2 },
],

// Angela (us-005) — moderate usage, issue is signal not data
usageHistory: [
  { month: 'Nov', used: 2.8 },
  { month: 'Dec', used: 3.1 },
  { month: 'Jan', used: 2.5 },
  { month: 'Feb', used: 3.4 },
  { month: 'Mar', used: 3.0 },
],

// Alex (us-009, repurposed) — will be defined during persona creation
```

#### 4. Add Visual Extras/Add-ons Cards
**File**: `src/components/MiniDashboard/MiniDashboard.jsx`
**Changes**: Replace the current text-only add-ons row with visual cards. Add below the mosaic grid:

```jsx
{/* Extras / Add-ons — visual cards */}
<div className={styles.extrasSection}>
  <span className={styles.extrasLabel}>Extras & Add-ons</span>
  <div className={styles.extrasGrid}>
    {EXTRAS_CATALOG.map((extra) => (
      <div key={extra.id} className={`${styles.extraCard} ${addons.includes(extra.id) ? styles.extraActive : ''}`}>
        <div className={styles.extraIcon}>{extra.icon}</div>
        <div className={styles.extraName}>{extra.name}</div>
        <div className={styles.extraPrice}>{addons.includes(extra.id) ? 'Active' : extra.price}</div>
      </div>
    ))}
  </div>
</div>
```

Static data:
```js
const EXTRAS_CATALOG = [
  { id: 'disney-plus', name: 'Disney+', icon: '🎬', price: '$7.99/mo' },
  { id: 'wireless-protect', name: 'Wireless Protect', icon: '🛡️', price: '$7/mo' },
  { id: 'intl-calling', name: 'Intl. Calling', icon: '🌎', price: '$10/mo' },
  { id: 'cloud-storage', name: 'Cloud 100GB', icon: '☁️', price: '$2.99/mo' },
];
```

#### 5. Add Extras Card CSS
**File**: `src/components/MiniDashboard/MiniDashboard.module.css`
**Changes**: Add styles for `.extrasSection`, `.extrasGrid`, `.extraCard`, `.extraActive`, `.extraIcon`, `.extraName`, `.extraPrice`, `.trendBars`, `.trendCol`, `.trendBar`, `.trendFill`, `.trendLabel`, `.rewardsPoints`, `.rewardsUnit`, `.rewardsBadge`, `.tileRewards`.

Cards should be ~80px wide, with subtle border, centered icon on top, name below, price/status at bottom. Active cards get a teal left border.

### Success Criteria:

#### Automated Verification:
- [ ] App builds without errors: `npm run build`
- [ ] No ESLint errors: `npm run lint`

#### Manual Verification:
- [ ] Dashboard shows 4 tiles: Data, Rewards, Plan, Renewal + Usage Trend
- [ ] No Network or Monthly Spend tiles visible
- [ ] Usage Trend shows 5 colored bars (red for months near cap, teal for healthy)
- [ ] Rewards tile shows points count, "FREE ADD-ON READY" badge for Priya (1,020 pts)
- [ ] Extras section shows 4 visual cards below the dashboard tiles
- [ ] Active add-ons are visually distinguished (e.g., teal border, "Active" label)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation before proceeding to Phase 3.

---

## Phase 3: Repurpose Alex (us-009) as "Buy a New Phone" Persona

### Overview
Transform Alex from a BYOP/bring-your-phone persona into a "I want to buy a new phone" persona with a conversational purchase flow.

### Changes Required:

#### 1. Update Alex's Persona Data
**File**: `src/data/personas.js`
**Changes**: Rewrite the `us-009` persona object:

```js
'us-009': {
  id: 'us-009',
  name: 'Alex T.',
  avatar: 'AT',
  dropdownLabel: 'Alex T. — Wants to buy a new phone',
  intentCategory: 'phone',  // new category
  urgency: 'moderate',

  account: {
    plan: 'Total 5G Unlimited',
    planPrice: '$50/mo',
    dataRemaining: '∞',
    dataTotal: 'Unlimited',
    dataPercent: 100,
    renewalDate: 'Apr 18, 2026',
    daysUntilRenewal: 18,
    autoPayEnabled: true,
    savedCard: 'Visa ••••7823',
    rewardsPoints: 2450,
    device: 'iPhone 12 (3 years old)',
    deviceStorage: '64 GB',
    deviceStorageUsed: '58 GB',  // 91% full
    activeAddons: ['wireless-protect'],
    usageHistory: [
      { month: 'Nov', used: 28.5 },
      { month: 'Dec', used: 32.1 },
      { month: 'Jan', used: 29.8 },
      { month: 'Feb', used: 31.4 },
      { month: 'Mar', used: 30.2 },
    ],
  },

  providerKnows: [
    'current device (iPhone 12 — 3 years old, 91% storage full)',
    'on Unlimited plan — qualifies for device deals',
    'rewards points (2,450)',
    'saved payment card (Visa ••••7823)',
    'AutoPay active — already getting $5/mo discount',
  ],

  signals: [
    {
      id: 'sig-009-a',
      severity: 'warning',
      icon: '📱',
      headline: 'Your iPhone 12 is 3 years old',
      subtext: 'Storage is 91% full. You qualify for device upgrade deals.',
    },
    {
      id: 'sig-009-b',
      severity: 'info',
      icon: '🏆',
      headline: '2,450 Rewards Points',
      subtext: 'Enough for $25 off your next device.',
    },
  ],

  suggestedActions: [
    { label: 'Show me new phones',        action: 'browse_phones' },
    { label: 'What deals do I qualify for?', action: 'check_deals' },
    { label: 'Compare iPhone vs Samsung',  action: 'compare_phones' },
  ],

  diagnosisFlow: { enabled: false },

  conversationContext: `Alex has an iPhone 12 that is 3 years old and 91% full on storage. He's on Unlimited, which qualifies for the best device deals. He has 2,450 rewards points.

IMPORTANT RULES:
- Do NOT ask what phone he has — you know (iPhone 12, 3 years old).
- Lead with: "Your iPhone 12 is getting up there — 3 years and 91% full on storage."
- Show device options from most affordable first.
- He qualifies for free phones (Moto G Stylus, Galaxy A17) and deal phones (iPhone 13 at $49.99).
- Ask about preferences: brand (Apple vs Samsung), budget, what matters most (camera, storage, battery).
- After he picks, confirm specs, show price, process the order.
- Apply rewards points automatically: "I'll apply your 2,450 points — that's $25 off."`,
},
```

#### 2. Add Phone Purchase Conversation Flow
**File**: `src/utils/demoResponses.js`
**Changes**: Add `getAlexPhoneTurnResponse` function and update the opening response in `getPersonaOpeningResponse`:

Opening (add to switch statement):
```js
case 'us-009': // Alex — buy a new phone
  return msg(
    `Hey Alex. Your ${a.device} is getting up there — 3 years old and your storage is 91% full.\n\nGood news: you're on Unlimited, which means you qualify for the best device deals. A few phones are completely free with your plan.\n\nWhat are you looking for?`,
    ['Show me new phones', 'What deals do I qualify for?', 'I want an iPhone', 'I want a Samsung']
  );
```

Turn-by-turn flow (new function — ~80 lines):
- **Turn 2**: If "show me" / "deals" → list top 3 options (free Moto G Stylus, free Galaxy A17, iPhone 13 at $49.99). If "iPhone" → show iPhone 13 deal + iPhone 17e. If "Samsung" → show Galaxy A17 (free) + Galaxy A36 (free).
- **Turn 3**: User picks a phone → show specs card, confirm color/storage, show price with rewards discount applied.
- **Turn 4**: User confirms → processing animation → success → show "Your new phone will ship in 2-3 business days" + SMS confirmation.

#### 3. Add 'phone' to EXTRA_PILLS and CTA_BY_INTENT
**File**: `src/components/LandingScreen/LandingScreen.jsx`
**Changes**: Add entries for the new `phone` intentCategory:

```js
// In CTA_BY_INTENT:
phone: 'Browse Phones',

// In EXTRA_PILLS:
phone: [
  { label: 'What's the best deal right now?', prompt: 'What is the best phone deal right now?' },
  { label: 'Free phones available?', prompt: 'Are there any free phones available?' },
  { label: 'Compare iPhone vs Samsung', prompt: 'Help me compare iPhone vs Samsung options.' },
  { label: 'Talk to someone', prompt: 'I want to talk to a customer support agent.' },
  { label: 'Show me everything', prompt: 'Show me all available plans and options.' },
],
```

#### 4. Update Keyboard Shortcuts + Persona Aliases
**File**: `src/components/LandingScreen/LandingScreen.jsx` (line 129)
**Changes**: Update keyboard map to the 3 demo personas:
```js
const PERSONA_MAP = { '1': 'us-001', '2': 'us-005', '3': 'us-009' };
```

**File**: `src/data/personas.js` (alias map)
**Changes**: Ensure `alex` alias points to `us-009`.

### Success Criteria:

#### Automated Verification:
- [ ] App builds without errors: `npm run build`
- [ ] No ESLint errors: `npm run lint`

#### Manual Verification:
- [ ] `?persona=alex` or `?persona=us-009` loads Alex with phone buyer signals
- [ ] Dashboard shows correct data for Alex (Unlimited plan, 2450 rewards, 91% storage)
- [ ] Clicking "Show me new phones" starts conversation with phone options
- [ ] Conversation flows through: browse → pick → confirm → purchase (3-4 turns)
- [ ] Keyboard shortcut `3` switches to Alex

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation before proceeding to Phase 4.

---

## Phase 4: Fix Angela's Conversation Flow + QA Maria

### Overview
QA and fix the Angela connectivity diagnosis flow and the Maria refill flow to ensure all conversation turns make sense.

### Changes Required:

#### 1. Replace ALL removed flow tags across demoResponses.js
**File**: `src/utils/demoResponses.js` (entire file — 40+ references)
**Changes**: The components `UpgradeFlow`, `InternationalFlow`, `ActivationFlow`, and `BYOPFlow` were removed from the codebase, but `demoResponses.js` still returns `[UPGRADE_FLOW]`, `[INTERNATIONAL_FLOW]`, `[ACTIVATION_FLOW]`, and `[BYOP_FLOW]` tags in ~40 places. These will silently fail (parseResponse detects them, but the components no longer exist).

**For the 3 priority personas (Maria, Angela, Alex):**
Replace each `[UPGRADE_FLOW]` reference with an inline plan recommendation message + action pills. Example:
```js
// OLD: return `Here's what would stop this...\n[UPGRADE_FLOW]`;
// NEW:
return msg(
  `Here's what would stop this from happening:\n\n**Total 5G Unlimited** — $50/mo\n✓ Unlimited data (no more running out)\n✓ 10 GB hotspot\n✓ Wi-Fi Calling\n\nThat's $10 more than your current plan. Want to switch?`,
  ['Yes, switch to Unlimited', 'How much more per month?', 'No thanks — keep my plan']
);
```

**For non-priority personas (us-002 through us-010 except us-005 and us-009):**
Replace flow tags with a generic fallback message:
```js
return msg(
  `I have a few options that could work for you. Let me walk you through the details in a moment.`,
  ['Show me options', 'Talk to someone', 'Return to home']
);
```

**Also update `parseResponse.js`** to stop checking for removed flow tags (clean up dead code):
```js
// Remove these lines from parseResponse.js:
const upgradeFlow = text.includes('[UPGRADE_FLOW]');
const internationalFlow = text.includes('[INTERNATIONAL_FLOW]');
const activationFlow = text.includes('[ACTIVATION_FLOW]');
const byopFlow = text.includes('[BYOP_FLOW]');
```

#### 2. Fix Angela's Specific Flow Issues
**File**: `src/utils/demoResponses.js` (lines 528-636)
**Changes**: Angela's flow is solid through 7 turns. Key fixes:

- **Turn 7, line 627**: References `[UPGRADE_FLOW]` — replace with inline Wi-Fi Calling recommendation (see pattern above).
- Ensure all diagnostic step transitions are smooth (restart → indoors → airplane mode → SIM).

Fix for Angela's Wi-Fi Calling recommendation:
```js
return msg(
  `Total 5G Unlimited at $50/mo includes Wi-Fi Calling — your phone uses your home Wi-Fi for calls even when cellular is weak. That would solve most of your dropped call issues.\n\nWant me to switch your plan? I'll apply the change immediately and your billing stays the same until next cycle.`,
  ['Yes, switch to Unlimited', 'How much more is that?', 'Let me think about it', 'No thanks — just connect me to support']
);
```

#### 2. Add "Return Home / New Topic" After Flow Completion
**File**: `src/utils/demoResponses.js`
**Changes**: For any turn where the AI says "Anything else I can help with?" or flow completes, include return-to-home pills:

```js
// Standard post-flow pills to append:
const POST_FLOW_PILLS = ['Start a new topic', 'Return to home', "That's all, thanks"];
```

Add these to: Angela turns 3 (if fixed), 5 (if fixed), 6 (if fixed), Maria's refill completion, and Alex's purchase completion.

#### 3. Verify Maria's Refill Flow End-to-End
**File**: `src/utils/demoResponses.js` — Maria section (us-001)
**Changes**: Read through all Maria turn responses. Verify:
- Turn 1: AI surfaces what it knows (0.8GB, 11/12 months) ✓ (line 41-43)
- Turn 2: Clarifying question or free-fix path based on choice
- Turn 3+: Refill flow or diagnosis path
- Final: Return to home option

#### 4. Handle "Return to home" and "Start a new topic" Actions
**File**: `src/utils/demoResponses.js`
**Changes**: Add a handler at the top of `generateDemoResponse` that catches these generic intents:

```js
// At the start of generateDemoResponse, before persona-specific logic:
const lastUserMsg = userMessages[userMessages.length - 1]?.content?.toLowerCase() || '';
if (lastUserMsg.includes('return to home') || lastUserMsg.includes("that's all")) {
  return msg('Happy to help! Taking you back to the home screen.', []);
  // The frontend will detect this and dispatch RESET_CHAT
}
if (lastUserMsg.includes('start a new topic') || lastUserMsg.includes('something else')) {
  return msg('Of course! What else can I help with?', ['Quick refill', 'Check my data', 'Browse phones', 'Talk to someone']);
}
```

### Success Criteria:

#### Automated Verification:
- [ ] App builds without errors: `npm run build`
- [ ] No references to `[UPGRADE_FLOW]`, `[ACTIVATION_FLOW]`, `[BYOP_FLOW]`, or `[INTERNATIONAL_FLOW]` remain in demoResponses.js or parseResponse.js
- [ ] Grep confirms zero matches: `grep -r "UPGRADE_FLOW\|ACTIVATION_FLOW\|BYOP_FLOW\|INTERNATIONAL_FLOW" src/`
- [ ] No ESLint errors: `npm run lint`

#### Manual Verification:
- [ ] Angela flow: Click "Check for outages" → "Still having issues" → progresses through all 4 diagnostic steps → escalation options work → no dead ends
- [ ] Angela flow: "Show plans with Wi-Fi Calling" shows inline recommendation, not broken [UPGRADE_FLOW]
- [ ] Maria flow: Full refill path works end-to-end with SMS confirmation
- [ ] After any flow completes, "Return to home" and "Start a new topic" pills are visible
- [ ] "Return to home" resets to landing screen
- [ ] "Start a new topic" continues conversation with new prompt options

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation before proceeding to Phase 5.

---

## Phase 5: Contrast Fix + Intent Alert Banner Consistency

### Overview
Fix text contrast issues flagged by Srinivas and ensure all intent alert banners use consistent styling.

### Changes Required:

#### 1. Audit and Fix Contrast
**Files**: All `.module.css` files
**Changes**: Check all text/background combinations against WCAG AA (4.5:1 for normal text, 3:1 for large text).

Known issues to fix:
- Light gray text (`#9ca3af`) on white/light backgrounds — darken to `#6b7280` minimum
- Signal row subtext (`#6b7280` on light backgrounds) — verify ratio, darken if needed
- Dashboard tile labels — ensure all are at least `#4b5563`
- Pill text on hover states — ensure readable
- Any text on teal backgrounds — ensure white text has sufficient contrast

#### 2. Standardize Intent Alert Banner Style
**File**: `src/components/MiniDashboard/MiniDashboard.jsx` (SignalRow function, lines 247-291)
**File**: `src/components/SignalBanner/SignalBanner.jsx`
**Changes**: Ensure SignalBanner (used at top of landing) and SignalRow (inside dashboard) use the same visual treatment:
- Same border-radius
- Same padding
- Same font sizes and weights
- Same severity color coding

The SignalBanner at the top should be the "hero" alert (larger, with CTA button). The SignalRow items in the dashboard can be more compact but should share the same color palette and border style.

### Success Criteria:

#### Automated Verification:
- [ ] App builds without errors: `npm run build`

#### Manual Verification:
- [ ] All text is easily readable on its background
- [ ] No light-on-light text combinations
- [ ] Alert banners above the dashboard and signal rows inside it share consistent styling
- [ ] Check all 3 personas (Maria, Angela, Alex) for contrast issues

---

## Phase 6: Final QA — Smoke Test All 3 Personas

### Overview
Walk through the complete demo flow for each of the 3 priority personas.

### Test Script:

#### Maria (us-001) — Refill Flow
1. Load `?persona=maria` or press `1`
2. Verify: landing shows greeting, headline, intent alerts (0.8GB left), dashboard (data ring red, rewards, plan, renewal, usage trend showing cap months)
3. Focus input bar → verify personalized pills + browse pills appear
4. Click "Quick Refill — $15" pill
5. Verify: AI asks clarifying question (not jumping to payment)
6. Reply with a pill
7. Verify: Refill recommendation card appears inline
8. Click "Continue — $15" → verify 1.5s processing spinner
9. Verify: Success message + iPhone SMS modal with green bubble
10. Dismiss modal → verify "Return to home" / "Start a new topic" options

#### Angela (us-005) — Connectivity Diagnosis
1. Load `?persona=angela` or press `2`
2. Verify: landing shows "5 support calls" + "2 bars average" alerts
3. Click signal banner CTA or focus input and click "Check for outages"
4. Verify: outage check → no outages → starts diagnosis
5. Walk through: restart → still having issues → indoors check → airplane mode → SIM check
6. Verify: after all 4 steps, escalation options appear (live chat, callback, Wi-Fi Calling plan)
7. Click "Show plans with Wi-Fi Calling" → verify inline recommendation (no broken flow)
8. Verify: "Return to home" option available

#### Alex (us-009) — Buy a New Phone
1. Load `?persona=alex` or press `3`
2. Verify: landing shows "iPhone 12 is 3 years old" + "2,450 rewards" alerts
3. Click "Show me new phones" or type it
4. Verify: AI shows phone options with prices
5. Pick a phone → verify specs/price confirmation with rewards discount
6. Confirm purchase → verify processing → success message
7. Verify: "Return to home" option available

### Success Criteria:
- [ ] All 3 personas load correctly from URL params and keyboard shortcuts
- [ ] All 3 conversation flows complete end-to-end without dead ends
- [ ] No console errors during any flow
- [ ] All text is readable (contrast)
- [ ] Dashboard is correct for each persona
- [ ] Pills appear on input focus, disappear on blur

---

## Implementation Order Summary

| Phase | What | Effort Estimate | Files Changed |
|-------|------|-----------------|---------------|
| 1 | Homepage layout (remove logo/subhead, pills-on-focus, two categories) | ~1.5 hours | LandingScreen.jsx, LandingScreen.module.css |
| 2 | Dashboard overhaul (Rewards, Usage Trend, Extras cards) | ~2 hours | MiniDashboard.jsx, MiniDashboard.module.css, personas.js |
| 3 | Alex "Buy a Phone" persona + conversation flow | ~2 hours | personas.js, demoResponses.js, LandingScreen.jsx |
| 4 | Fix Angela's flow + QA Maria + return-to-home | ~1.5 hours | demoResponses.js |
| 5 | Contrast fix + banner consistency | ~1 hour | Multiple CSS files, SignalBanner, MiniDashboard |
| 6 | Final QA smoke test | ~30 min | None (testing only) |

**Total estimated effort: ~8.5 hours**

---

## References
- Feedback transcript: Review call March 31, 2026
- Extracted feedback: `clearpath-ai/FEEDBACK_REVIEW.md`
- Project context: `CLAUDE.md`
- Design tokens: See CLAUDE.md "Design System Tokens" section
- Product data: `src/data/products.js` (PHONES array, PLANS array)
- Persona data: `src/data/personas.js` (10 personas, 3 priority)
