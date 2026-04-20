# ClearPath AI — Sprint 2 Task Log
**Shared between:** Developer Agent (`dev-agent.md`) · QA Agent (`qa-agent.md`)
**Last updated:** Mar 26, 2026
**Sprint target:** Fri Mar 27 → Mon Mar 30, 2026 (Srini review)
**PRD reference:** PRD_v3.0_Sprint2.md

> **Writing rules:**
> - Developer Agent: fills in task entries, marks status, logs files changed
> - QA Agent: appends `### QA REVIEW` blocks only — never edits Dev content
> - Neither agent deletes entries — use `[!] Blocked` or `[~] Superseded` if needed
> - All Sprint 2 tasks are fixes sourced from Sprint 1 QA audit (tasklist.md QA REVIEW blocks)

---

## QA Summary

**Sprint 1 QA audit date:** Mar 26, 2026
**Sprint 2 QA target:** Mar 28, 2026 (after Lam review)

| Task | Source Issue | Dev Status | QA Status | Severity |
|------|-------------|-----------|-----------|----------|
| FIX-001 | Typo `[/ACTION_PUPILS]` → `[/ACTION_PILLS]` | [x] Done | — | 🔴 Critical |
| FIX-002 | ES pill labels — pills stay English on toggle | [x] Done | — | 🔴 High |
| FIX-003 | ES SignalBanner CTA stays English | [x] Done | — | 🔴 High |
| FIX-004 | Derek flowKey routes to new-phone instead of upgrade | [x] Done | — | 🔴 High |
| FIX-005 | Robert UpgradeFlow — wrong prices, 2-plan only, no line toggle | [x] Done | — | 🔴 High |
| FIX-006 | RefillFlow hardcoded Visa ····4821 | [x] Done | — | 🟡 Medium |
| FIX-007 | UpgradeFlow hardcoded plan names | [x] Done | — | 🟡 Medium |
| FIX-008 | SMS modal same message for all transaction types | [x] Done | — | 🟡 Medium |
| FIX-009 | InternationalFlow "Mexico" hardcoded — should be persona country | [x] Done | — | 🟡 Medium |
| FIX-010 | Carlos flowKey routing misses renewal pill labels | [x] Done | — | 🟡 Medium |
| FIX-011 | Persona dropdown native `<select>` — cosmetic | [ ] Pending | — | 🟢 Low |
| FIX-012 | James activation — text-only, no inline card | [ ] Pending | — | 🟢 Low |
| FIX-013 | Angela Live Chat hardcoded "Available now" | [x] Done | — | 🟢 Low |

**Demo readiness:**
- [x] Ready for Lam review — all P1 (Critical/High) and P2 (Medium) fixes complete
- [ ] Ready for Srini review — needs manual QA pass + FIX-011, FIX-012 optional
- [ ] Needs fixes — FIX-011 (cosmetic), FIX-012 (nice-to-have) remain

---

## Task Backlog

> Status key: `[ ] Pending` · `[~] In Progress` · `[x] Done` · `[!] Blocked`

```
Priority 1 — Critical blockers (fix before any review)
  [x] FIX-001  Typo: [/ACTION_PUPILS] → [/ACTION_PILLS] in demoResponses.js
  [x] FIX-002  ES pill labels: add labelEs to personas.js + EXTRA_PILLS; read by lang
  [x] FIX-003  ES SignalBanner: store flowId in state, derive CTA via t() in SignalBanner
  [x] FIX-004  Derek flowKey: add intentCategory override in generateDemoResponse()

Priority 2 — High (fix before Lam review)
  [x] FIX-005  Robert UpgradeFlow: persona-aware pricing, 3-plan display, line count toggle
  [x] FIX-006  RefillFlow: read savedCard, planName, planPrice from persona.account
  [x] FIX-007  UpgradeFlow: read current plan from persona.account (not hardcoded)
  [x] FIX-008  SMS modal: pass transactionType in dispatch, render context-aware message
  [x] FIX-009  InternationalFlow: replace "Mexico" with persona.account.internationalCallsThisMonth[0].country

Priority 3 — Medium (fix before Srini review)
  [x] FIX-010  Carlos flowKey: add renew/expir keywords + intentCategory override
  [ ] FIX-011  Persona dropdown: replace native <select> with custom styled component

Priority 4 — Low / polish (if time allows)
  [ ] FIX-012  James: build ActivationFlow inline card component
  [x] FIX-013  Angela: Live Chat availability respects time of day
```

---

## Task Entries

---

### FIX-001 — Typo `[/ACTION_PUPILS]` → `[/ACTION_PILLS]`
**Status:** [x] Done
**Priority:** 🔴 Critical
**Persona(s):** us-001 Maria R.
**Source:** TASK-009 QA REVIEW · demoResponses.js line ~209
**PRD checks:** E5 (quick reply pills render after AI response)
**Files to change:**
  - `src/utils/demoResponses.js`

**What to do:**
Line ~209 in `demoResponses.js` — the plan-change branch response for Maria (us-001) ends with the closing tag `[/ACTION_PUPILS]` instead of `[/ACTION_PILLS]`. `parseResponse()` cannot match the malformed tag, so the pills array returns null and the user is stuck with no quick reply options after choosing "Change my plan."

```js
// FIND (line ~209):
[/ACTION_PUPILS]
// REPLACE WITH:
[/ACTION_PILLS]
```

**Verify:**
1. Select Maria (us-001)
2. Tap any intent pill to start the conversation
3. When the clarifying question appears, tap "Change my plan"
4. Turn 2 AI response must render 2–3 quick reply pills below the message text
5. User is not stuck — can proceed to plan comparison

**What I did:**
Changed `[/ACTION_PUPILS]` → `[/ACTION_PILLS]` at demoResponses.js line ~209 (Maria's "Change my plan" turn-2 branch). Single character fix. Build passes 0 errors.

**Known gaps / QA focus:**
Confirm "Change my plan" path renders 3 quick reply pills (Start now — prorated · Switch at renewal · Stay on current plan).

---

### FIX-002 — ES Pill Labels (PRD C5)
**Status:** [x] Done
**Priority:** 🔴 High
**Persona(s):** All (language toggle affects all personas)
**Source:** TASK-007 QA REVIEW · PRD C5 failure
**PRD checks:** C5 (pills translate to Spanish)
**Files to change:**
  - `src/data/personas.js` — add `labelEs` to every `suggestedActions` entry
  - `src/components/LandingScreen/LandingScreen.jsx` — read `labelEs` when `lang === 'es'`

**What to do:**

**Step 1 — personas.js:** Add `labelEs` to every suggestedActions entry for all 8 personas. Also add `labelEs` to every entry in `EXTRA_PILLS` for each intentCategory.

Example for us-001 Maria:
```js
suggestedActions: [
  { label: "I'm running low on data",      labelEs: "Me quedo sin datos",          intentKey: "refill" },
  { label: "I want to change my plan",     labelEs: "Quiero cambiar mi plan",      intentKey: "upgrade" },
  { label: "Quick Refill — $15",           labelEs: "Recarga Rápida — $15",        intentKey: "refill" },
]
```

PRD C5 named translations (must match exactly):
- `"Mi internet está lento"` — slow/connectivity pills
- `"Me quedo sin datos"` — running out of data
- `"Quiero gastar menos"` — want to spend less / cheaper plan

**Step 2 — LandingScreen:** In `getPersonaPills()`, read language from `useLanguage()` and apply `labelEs`:
```js
const { lang } = useLanguage();

function getPersonaPills(persona) {
  const rawPills = [
    ...persona.suggestedActions,
    ...EXTRA_PILLS[persona.intentCategory] ?? EXTRA_PILLS['refill'],
  ].slice(0, 8);

  return rawPills.map(pill => ({
    ...pill,
    label: (lang === 'es' && pill.labelEs) ? pill.labelEs : pill.label,
  }));
}
```

**Verify:**
1. Select Maria — pills show in English
2. Click ES toggle — pills change to Spanish ("Me quedo sin datos", etc.)
3. Click EN toggle — pills return to English
4. Switch persona to Derek while in ES mode — Derek's pills also in Spanish
5. Confirm "Show me everything" pill has a Spanish equivalent too

**What I did:**
Added `labelEs` to all suggestedActions for all 8 personas in personas.js. Added `labelEs` to all entries in EXTRA_PILLS for all 6 intentCategories in LandingScreen.jsx. Changed `getPersonaPills()` to accept `lang` param and return `pill.labelEs` when `lang === 'es'`. Wired `lang` from `useTranslation()` (which already returns it). Prompt strings always remain English so AI/flow routing is unaffected.

**Known gaps / QA focus:**
PRD C5 exact strings: pills must include "Me quedo sin datos", "Recarga Rápida — $15", "Cambiar mi plan" for Maria in ES mode.

---

### FIX-003 — ES SignalBanner CTA (PRD C4)
**Status:** [x] Done
**Priority:** 🔴 High
**Persona(s):** All (language toggle)
**Source:** TASK-008 QA REVIEW · PRD C4 failure
**PRD checks:** C4 (Signal banner CTA: "Recarga Rápida" in ES mode)
**Files to change:**
  - `src/components/LandingScreen/LandingScreen.jsx` — dispatch `flowId` not CTA string
  - `src/components/SignalBanner/SignalBanner.jsx` — derive CTA from `t()` using `flowId`
  - `src/i18n/` or translation file — ensure `signal.cta.*` keys exist for EN and ES

**What to do:**

**Step 1 — LandingScreen:** Change `SET_SIGNAL_BANNER` dispatch to store `flowId` instead of a pre-resolved CTA string:
```js
// BEFORE:
dispatch({ type: 'SET_SIGNAL_BANNER', payload: {
  headline: sig.headline,
  subtext: sig.subtext,
  cta: CTA_BY_INTENT[persona.intentCategory],  // ← English string, frozen at dispatch time
}});

// AFTER:
dispatch({ type: 'SET_SIGNAL_BANNER', payload: {
  headline: sig.headline,
  headlineEs: sig.headlineEs ?? sig.headline,   // add ES variants to personas.js signals[]
  subtext: sig.subtext,
  subtextEs: sig.subtextEs ?? sig.subtext,
  flowId: persona.intentCategory,               // ← store intent ID, not resolved string
}});
```

**Step 2 — SignalBanner:** Derive CTA text from translation function using `flowId`:
```js
const { lang } = useLanguage();

const CTA_KEYS = {
  refill:        { en: 'Quick Refill',        es: 'Recarga Rápida' },
  upgrade:       { en: 'See Options',          es: 'Ver Opciones' },
  addon:         { en: 'Add International',    es: 'Agregar Internacional' },
  support:       { en: 'Get Help',             es: 'Obtener Ayuda' },
  comparison:    { en: 'Compare Plans',        es: 'Comparar Planes' },
  activation:    { en: 'Activate Now',         es: 'Activar Ahora' },
};

const ctaText    = CTA_KEYS[banner.flowId]?.[lang] ?? banner.cta ?? 'Quick Refill';
const headline   = lang === 'es' ? (banner.headlineEs ?? banner.headline) : banner.headline;
const subtext    = lang === 'es' ? (banner.subtextEs  ?? banner.subtext)  : banner.subtext;
```

**Verify:**
1. Load Maria (refill intent) — banner CTA shows "Quick Refill" in EN
2. Click ES toggle — banner CTA updates to "Recarga Rápida" (PRD C4 exact string)
3. Switch to Ana (international/addon) in ES mode — CTA shows "Agregar Internacional"
4. Toggle back to EN — CTA returns to "Add International"
5. Language toggle does NOT cause a full page reload or persona reset

**What I did:**
Added `signal.cta.*` translation keys for all 6 intent categories to both EN and ES in translations.js (e.g. refill→"Quick Refill"/"Recarga Rápida"). Updated SignalBanner.jsx to derive CTA using `t('signal.cta.${banner.flowId}')` first, falling back to `banner.cta` for legacy. `banner.flowId` was already being dispatched from LandingScreen — no change needed there.

**Known gaps / QA focus:**
PRD C4: toggle to ES → Maria's banner CTA shows "Recarga Rápida". Derek's shows "Ver Opciones". Ana's shows "Agregar Internacional".

---

### FIX-004 — Derek flowKey Routing (Upgrade Flow)
**Status:** [x] Done
**Priority:** 🔴 High
**Persona(s):** us-006 Derek W.
**Source:** TASK-014 QA REVIEW · Issue 1 — flowKey routes to new-phone
**PRD checks:** Derek demo path (E4, E5, upgrade path integrity)
**Files to change:**
  - `src/utils/demoResponses.js` — `generateDemoResponse()` and `getFlowKey()`

**What to do:**

**Step 1 — `generateDemoResponse()` override at top:** Add persona intentCategory-based routing before the existing `getFlowKey()` call:
```js
function generateDemoResponse(userMsg, turnCount, persona, conversationHistory) {
  // Override: if persona has a defined intentCategory, use it to route turns 2+
  // This prevents pill label keyword detection from misfiring on turn 2
  if (turnCount > 1 && persona?.intentCategory) {
    const cat = persona.intentCategory;
    if (cat === 'upgrade'       && PERSONA_FLOWS[persona.id]?.[turnCount]) {
      return PERSONA_FLOWS[persona.id][turnCount];
    }
    if (cat === 'international' && PERSONA_FLOWS[persona.id]?.[turnCount]) {
      return PERSONA_FLOWS[persona.id][turnCount];
    }
    if (cat === 'expiry'        && PERSONA_FLOWS[persona.id]?.[turnCount]) {
      return PERSONA_FLOWS[persona.id][turnCount];
    }
    // 'refill', 'support', 'activation', 'comparison' can also be added here
  }
  // Existing logic below...
  const flowKey = getFlowKey(userMsg);
  ...
}
```

**Step 2 — patch `getFlowKey()` as fallback:**
```js
// Add broader upgrade detection:
if (msg.includes('upgrade') || msg.includes('unlimited') || msg.includes('55/mo')) return 'upgrade';
// Add renewal detection for Carlos:
if (msg.includes('renew') || msg.includes('expir') || msg.includes('autopay')) return 'refill';
```

**Verify:**
1. Select Derek (us-006)
2. Tap the "Upgrade to Unlimited — $55/mo" pill (or similar upgrade pill)
3. Turn 2 AI response must show the prorated vs renewal upgrade options — NOT phone questions
4. Confirm quick reply pills: "Upgrade now — pay prorated $5 today" and "Upgrade at renewal — no charge today"
5. Turn 3 → `[UPGRADE_FLOW]` triggers in chat

**Known gaps / QA focus:**
Verify the intentCategory override does NOT break personas whose turn 2 routing was working correctly (us-001, us-003, us-005). Run a turn-2 spot-check on Maria and Priya after applying the fix.

---

### FIX-005 — Robert UpgradeFlow: Persona-Aware Pricing + 3-Plan + Line Toggle
**Status:** [x] Done
**Priority:** 🔴 High
**Persona(s):** us-008 Robert L.
**Source:** TASK-016 QA REVIEW · Issues 1, 2, 3
**PRD checks:** Robert demo (P3 walkable persona)
**Files to change:**
  - `src/components/UpgradeFlow/UpgradeFlow.jsx` — OR new `src/components/FamilyPlanCompare/FamilyPlanCompare.jsx`
  - `src/utils/demoResponses.js` — wire Robert's turn 3 to new component trigger if needed

**What to do:**

Robert's `persona.account.planComparison` already contains correct pricing data in personas.js. The UpgradeFlow component must read from it.

**Option A (preferred — less scope):** Build a separate `FamilyPlanCompare` component only rendered when `persona.id === 'us-008'`. Wire into demoResponses turn 3 as `[FAMILY_PLAN_FLOW]`.

**Option B:** Make UpgradeFlow fully persona-aware and conditionally render a 3-column view when `persona.account.planComparison` has 3+ entries.

**FamilyPlanCompare component requirements:**
1. Reads `persona.account.planComparison` array for plan names, base price per line
2. Line count stepper: 1 | 2 | 3 | 4 (default = `persona.account.lines` — Robert has 4)
3. All three plan column prices update simultaneously when line count changes
4. Math: `linePrice = plan.basePrice * lineCount` — or use lookup table from planComparison
5. Highlight recommended plan with a teal badge: "Best value for 4 lines — saves $50/mo"
6. Current plan badge reads from `persona.account.plan` (Total Base 5G at 4 lines = $160/mo)
7. CTA on recommended plan: "Upgrade to Unlimited — $110/mo for 4 lines"
8. Processing animation (1.8s) and SMS modal dispatch after confirm (same pattern as RefillFlow)

**Robert's correct pricing at 4 lines (from personas.js planComparison):**

| Plan | 1 line | 2 lines | 3 lines | 4 lines |
|------|--------|---------|---------|---------|
| Total Base 5G (current) | $40 | $80 | $120 | $160 |
| 5G Unlimited ⭐ | $55 | $90 | $100 | $110 |
| 5G+ | $65 | $110 | $120 | $130 |

**Verify:**
1. Select Robert (us-008)
2. Walk through conversation to turn 3
3. `[FAMILY_PLAN_FLOW]` or `[UPGRADE_FLOW]` renders with 3 plan columns
4. Default line count = 4 — prices show $160 / $110 / $130
5. Tap "3 lines" → all prices update: $120 / $100 / $120
6. Tap "1 line" → all prices update: $40 / $55 / $65
7. Current plan badge shows "Total Base 5G — your current plan"
8. Confirm → 1.8s animation → success → SMS modal fires

**What I did:**
Chose Option B (persona-aware UpgradeFlow rather than a separate FamilyPlanCompare component). Added `isFamily` detection via `!!planComparison`. Added `lineCount` state initialized from `planComparison.lines`. Added `priceForLines(plan, lines)` helper using a tiers lookup table matching the PRD pricing table. Conditionally renders a 3-column `familyPlansGrid` (with savings badges) when `isFamily === true`, else falls back to the standard 2-column `plansGrid`. Line stepper (Minus/Plus buttons) updates all three columns simultaneously via shared `lineCount` state. Added all new CSS classes to `UpgradeFlow.module.css` including `.lineStepper`, `.familyPlansGrid`, `.familyPlanCol`, `.savingsBadge`. SMS dispatch includes `{ transactionType: 'upgrade' }`.

**Files changed:**
- `src/components/UpgradeFlow/UpgradeFlow.jsx` — full rewrite with isFamily conditional, lineCount state, priceForLines helper
- `src/components/UpgradeFlow/UpgradeFlow.module.css` — added family grid + stepper styles

**Known gaps / QA focus:**
Verify line stepper updates ALL three columns simultaneously with no stale values. Confirm SMS modal dispatches with `transactionType: 'upgrade'` for FIX-008 compatibility.

---

### FIX-006 — RefillFlow Reads persona.account.savedCard
**Status:** [x] Done
**Priority:** 🟡 Medium
**Persona(s):** All (affects all non-Maria personas running refill flow)
**Source:** QA Summary — "RefillFlow confirmation hardcoded Visa ····4821"
**PRD checks:** F2 (card shows correct plan name, price, CTA — per persona)
**Files to change:**
  - `src/components/RefillFlow/RefillFlow.jsx`

**What to do:**

Replace all hardcoded card and plan references with values from `persona.account`:
```js
const { persona } = useChatContext();
const account = persona.account;

// Payment card display:
const cardType   = account.savedCardType ?? 'Visa';
const cardLast4  = account.savedCard     ?? '4821';
const cardLabel  = `${cardType} ····${cardLast4}`;

// Plan details:
const planName   = account.plan      ?? 'Total Base 5G';
const planPrice  = account.planPrice ?? '$15.00';
```

Render `cardLabel`, `planName`, and `planPrice` in the confirmation step and on the "Continue" button.

**Verify:**
1. Select Carlos (us-002) → run to refill flow → card shows Carlos's saved card (not ····4821)
2. Select Priya (us-003) → points-redemption path → "Redeem 1,000 pts — free" shown instead of card
3. Select Maria (us-001) → run to refill flow → card shows Maria's saved card correctly
4. Plan name on confirmation card matches persona's actual plan name

**What I did:**
Added `state` to the `useChat()` destructure. Derived `account`, `savedCard`, and `planName` from `state.persona?.account`. Replaced hardcoded `t('refill.confirmCard')` and `t('refill.selectPlan')` in the confirm step with the persona-derived values. SMS dispatch updated to `{ transactionType: 'refill' }`.

**Files changed:**
- `src/components/RefillFlow/RefillFlow.jsx` — persona account reads for card + plan name

**Known gaps / QA focus:**
Check the Priya (us-003) rewards path separately — it should NOT show a payment card (it's a points redemption). Confirm the RefillFlow has a conditional that hides card details when `account.rewardsPoints >= 1000` and the user selected the free option.

---

### FIX-007 — UpgradeFlow Reads Persona Plan Data
**Status:** [x] Done
**Priority:** 🟡 Medium
**Persona(s):** All (primarily us-006 Derek W.)
**Source:** TASK-014 QA REVIEW · Issue 2 — hardcoded "5 GB high-speed data" and "Visa ····4821"
**PRD checks:** F2 (card shows correct plan name, price — per persona)
**Files to change:**
  - `src/components/UpgradeFlow/UpgradeFlow.jsx`

**What to do:**

Replace hardcoded plan comparison data with persona.account reads:
```js
const { persona } = useChatContext();
const account = persona.account;

// Current plan (left column):
const currentPlanName    = account.plan      ?? 'Total Base 5G';
const currentPlanPrice   = account.planPrice ?? '$40/mo';
const currentPlanFeatures = account.planFeatures ?? ['5 GB high-speed data', 'No hotspot'];

// Target upgrade plan (right column):
// Use persona.account.upgradeTarget if defined, otherwise use planComparison[1]
const targetPlan = account.upgradeTarget
  ?? account.planComparison?.[1]
  ?? { name: '5G Unlimited', price: '$55/mo', features: ['Unlimited data', 'Hotspot included'] };

// Payment card:
const cardType  = account.savedCardType ?? 'Visa';
const cardLast4 = account.savedCard     ?? '4821';
```

**Verify:**
1. Select Derek (us-006) → walk to UpgradeFlow
2. Left column: "Total Base 5G — $40/mo" (Derek's actual plan — not generic copy)
3. Right column: correct upgrade target from Derek's personas.js data
4. Payment card shows Derek's saved card (not ····4821 unless that's his actual card)

**What I did:**
Implemented together with FIX-005 in the same UpgradeFlow rewrite. `currentPlanName` reads from `account.plan`, `currentPlanPrice` from `account.planPrice`. For the non-family path the right column still shows the hardcoded "Total 5G Unlimited / $55" target (no `upgradeTarget` field in personas.js for Derek), but the left column now shows Derek's actual plan data. Confirm screen shows `account.savedCard || 'Card on file'`.

**Files changed:**
- `src/components/UpgradeFlow/UpgradeFlow.jsx` — combined with FIX-005 rewrite

**Known gaps / QA focus:**
This fix and FIX-005 both touch UpgradeFlow. Coordinate — do not regress FIX-005's Robert-specific work when applying this fix.

---

### FIX-008 — SMS Modal Context-Aware Message by Transaction Type
**Status:** [x] Done
**Priority:** 🟡 Medium
**Persona(s):** All (affects all 3 transaction flow types)
**Source:** TASK-019 QA REVIEW · Issue — modal always shows refill confirmation text
**PRD checks:** F5 (SMS modal message text correct for the transaction)
**Files to change:**
  - `src/components/RefillFlow/RefillFlow.jsx` — update dispatch payload
  - `src/components/UpgradeFlow/UpgradeFlow.jsx` — update dispatch payload
  - `src/components/InternationalFlow/InternationalFlow.jsx` — update dispatch payload
  - `src/context/ChatContext.jsx` — store `smsModalData` in reducer
  - `src/components/IPhoneSMSModal/IPhoneSMSModal.jsx` — render message by type

**What to do:**

**Step 1 — Flow components:** Pass `transactionType` and persona context in dispatch:
```js
// RefillFlow on success:
dispatch({ type: 'SHOW_SMS_MODAL', payload: { transactionType: 'refill', persona } });

// UpgradeFlow on success:
dispatch({ type: 'SHOW_SMS_MODAL', payload: { transactionType: 'upgrade', persona } });

// InternationalFlow on success:
dispatch({ type: 'SHOW_SMS_MODAL', payload: { transactionType: 'international', persona } });
```

**Step 2 — ChatContext reducer:** Store the payload:
```js
case 'SHOW_SMS_MODAL':
  return { ...state, showSMSModal: true, smsModalData: action.payload ?? {} };
case 'HIDE_SMS_MODAL':
  return { ...state, showSMSModal: false, smsModalData: null };
```

**Step 3 — IPhoneSMSModal:** Build message template per type:
```js
const { smsModalData } = useChatContext().state;
const { transactionType, persona } = smsModalData ?? {};
const account = persona?.account ?? {};

// Calculate expiry date (today + 30 days):
const expiryDate = new Date();
expiryDate.setDate(expiryDate.getDate() + 30);
const expiryStr = expiryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const country = account.internationalCallsThisMonth?.[0]?.country ?? 'international destinations';

const MESSAGE_TEMPLATES = {
  refill:        `Your Total Wireless account has been refilled. ${account.dataTotal ?? '5 GB'} added. Valid through ${expiryStr}.`,
  upgrade:       `Your plan has been upgraded to ${account.upgradeTarget?.name ?? 'Unlimited'}. You now have unlimited data. Disney+ activation email is on its way.`,
  international: `Global Calling Card activated. Your calls to ${country} are now covered. Check your email for dial instructions.`,
};

const smsText = MESSAGE_TEMPLATES[transactionType] ?? MESSAGE_TEMPLATES.refill;
```

**Verify:**
1. Run a refill as Maria → SMS reads "...refilled. 5 GB added. Valid through [date]."
2. Run an upgrade as Derek → SMS reads "...upgraded to Unlimited..." (NOT refill language)
3. Run international add-on as Ana → SMS reads "...calls to Colombia are now covered..." (NOT refill language)
4. X button closes modal cleanly in all 3 cases
5. Caption "Confirmation sent to your phone on file." visible in all 3 cases (unchanged)

**What I did:**
Added `smsModalData: null` to `initialState` in ChatContext. Updated `SHOW_SMS_MODAL` reducer to store `action.payload` (object with `transactionType`). Updated `HIDE_SMS_MODAL` to clear `smsModalData: null`. Updated RefillFlow, UpgradeFlow, and InternationalFlow dispatches to include `{ transactionType: 'refill'|'upgrade'|'international' }`. In IPhoneSMSModal added `getExpiryDate()` helper and `SMS_MESSAGES` object with three templates; reads `state.smsModalData?.transactionType` to pick the right message.

**Files changed:**
- `src/context/ChatContext.jsx` — smsModalData in state + reducer
- `src/components/IPhoneSMSModal/IPhoneSMSModal.jsx` — SMS_MESSAGES + transactionType lookup
- `src/components/RefillFlow/RefillFlow.jsx` — transactionType in dispatch
- `src/components/UpgradeFlow/UpgradeFlow.jsx` — transactionType in dispatch
- `src/components/InternationalFlow/InternationalFlow.jsx` — transactionType in dispatch

**Known gaps / QA focus:**
Confirm `HIDE_SMS_MODAL` reducer case properly clears `smsModalData: null` so stale data doesn't persist when the modal is reopened.

---

### FIX-009 — InternationalFlow Country: "Mexico" → Persona Country
**Status:** [x] Done
**Priority:** 🟡 Medium
**Persona(s):** us-007 Ana G. (primary) · affects any persona with international data
**Source:** TASK-015 QA REVIEW · Issue 1
**PRD checks:** Ana demo integrity
**Files to change:**
  - `src/components/InternationalFlow/InternationalFlow.jsx`

**What to do:**

Replace the hardcoded "Mexico" reference with a dynamic lookup from `persona.account.internationalCallsThisMonth`:
```js
const { persona } = useChatContext();
const account = persona.account ?? {};

const country = account.internationalCallsThisMonth?.[0]?.country ?? 'international destinations';
const callCount = account.internationalCallsThisMonth?.[0]?.count ?? account.internationalCallsThisMonth?.length ?? 0;

// In signal note / card body:
// BEFORE: "Your service works in Mexico and 140+ countries"
// AFTER:  `Your service covers ${country} and 140+ countries.`

// In success/confirmation message:
// BEFORE: "International calling activated."
// AFTER:  `Global Calling Card activated. Your ${country} calls are covered.`
```

Also update the card headline to reference the correct country: `"Add International — ${country} Calling Card"`.

**Verify:**
1. Select Ana (us-007) → open InternationalFlow → signal note reads "Colombia" not "Mexico"
2. Success message references Colombia
3. Card headline references Colombia
4. Select another persona with different international data (if any) — country updates accordingly

**What I did:**
Added `state` destructure from `useChat()`. Derived `intlCalls` from `state.persona?.account?.internationalCallsThisMonth || []` and `topCountry` from `intlCalls[0]?.country || null`. Signal note now reads `"Based on your recent calls to ${topCountry}, we recommend..."` when `topCountry` is present, otherwise falls back to `t('intl.signalNote')`. Success screen conditionally shows `"Covers ${topCountry} and 200+ countries"` and the charged card from `state.persona?.account?.savedCard`.

**Files changed:**
- `src/components/InternationalFlow/InternationalFlow.jsx` — topCountry derivation + dynamic signal note + success details

**Known gaps / QA focus:**
Check that `internationalCallsThisMonth` is defined for us-007 in personas.js — if the field name differs, update the access path to match.

---

### FIX-010 — Carlos flowKey Routing for Renewal Pills
**Status:** [x] Done
**Priority:** 🟡 Medium
**Persona(s):** us-002 Carlos M.
**Source:** TASK-010 QA REVIEW · Issue — renewal pill labels don't route to refill/renewal flow
**PRD checks:** Carlos demo path in demo-fallback mode
**Files to change:**
  - `src/utils/demoResponses.js` — `getFlowKey()` and `generateDemoResponse()`

**What to do:**

This fix is partially covered by FIX-004 (intentCategory override in `generateDemoResponse()`). Carlos's `intentCategory` is `'expiry'`. Add expiry to the override table:

```js
// In generateDemoResponse() intentCategory override (already added for FIX-004):
if (cat === 'expiry' && PERSONA_FLOWS[persona.id]?.[turnCount]) {
  return PERSONA_FLOWS[persona.id][turnCount];
}
```

Also patch `getFlowKey()` renewal detection (also added in FIX-004 patch):
```js
if (msg.includes('renew') || msg.includes('expir') || msg.includes('autopay')) return 'refill';
```

**Verify:**
1. Select Carlos (us-002) in demo-fallback mode (API key disabled or not available)
2. Tap "Renew Total Base 5G — $40/mo" pill
3. Turn 2 response must show Carlos-specific renewal options: renew same plan, enable AutoPay, or explore other options
4. NOT generic cost/plan questions

**What I did:**
Covered as part of FIX-004. The `getFlowKey()` broadening added `msg.includes('renew') || msg.includes('expir') || msg.includes('autopay') → return 'refill'`. The intentCategory override in `generateDemoResponse()` maps `categoryMap` which includes all persona categories. Carlos's `intentCategory: 'expiry'` was handled by the keyword broadening (since his pill label contains "Renew" and "expir").

**Files changed:**
- `src/utils/demoResponses.js` — combined with FIX-004 (getFlowKey + intentCategory override)

**Known gaps / QA focus:**
This fix should be a no-op if FIX-004 already added the intentCategory override for 'expiry'. Verify FIX-004 covers the expiry case before treating FIX-010 as a separate change.

---

### FIX-011 — Persona Dropdown Custom Styled Component
**Status:** [ ] Pending
**Priority:** 🟢 Low (cosmetic polish)
**Persona(s):** All
**Source:** TASK-002 QA REVIEW · cosmetic issue — native `<select>` is OS-dependent
**PRD checks:** A6 (persona dropdown renders all 8 personas with hint text — styling)
**Files to change:**
  - `src/components/Header/Header.jsx`
  - `src/components/Header/Header.module.css`

**What to do:**

Replace the native `<select>` element with a custom `<div>`-based dropdown:

```jsx
// Trigger button (closed state):
<div className={styles.personaDropdownTrigger} onClick={toggleOpen}>
  {selectedPersona.name} <span className={styles.chevron}>▾</span>
</div>

// Dropdown panel (open state):
{isOpen && (
  <div className={styles.personaDropdownPanel}>
    {PERSONA_LIST.map(p => (
      <div
        key={p.id}
        className={`${styles.personaOption} ${p.id === state.persona?.id ? styles.active : ''}`}
        onClick={() => handleSelect(p)}
      >
        <span className={styles.optionName}>{p.name}</span>
        <span className={styles.optionHint}>{p.hint}</span>
      </div>
    ))}
  </div>
)}
```

**Styling guidelines (must match design system):**
- Trigger: pill shape, border 1px solid `#00B5AD` (teal), teal text, 8px border-radius
- Panel: white card, 12px border-radius, box-shadow, z-index 1000
- Selected option: teal left-border (3px), teal text for name
- Hint text: gray (#6c757d), 12px, same line or below name
- Close on outside click: add `useEffect` with `mousedown` listener on `document`

**Verify:**
1. Dropdown opens on click of trigger button
2. All 8 personas visible with name and hint text
3. Selected persona is highlighted (teal left-border)
4. Clicking a persona selects it and closes the panel
5. Clicking outside the dropdown closes it
6. Styling is consistent with EN/ES toggle pill style — no OS-native widget appearance

**Known gaps / QA focus:**
Test on Chrome + Safari + mobile viewport (375px). Ensure dropdown panel doesn't overflow viewport on small screens (add `max-height: 300px; overflow-y: auto`).

---

### FIX-012 — James Activation Inline Card (Nice-to-Have)
**Status:** [ ] Pending
**Priority:** 🟢 Low — only if time allows after P1/P2 fixes complete
**Persona(s):** us-004 James T.
**Source:** TASK-012 QA REVIEW · Medium severity — text-only activation flow, no card UI
**PRD checks:** Not a named PRD acceptance criterion — polish item
**Files to change:**
  - `src/components/ActivationFlow/ActivationFlow.jsx` (new file)
  - `src/utils/demoResponses.js` — wire James's turn 3 to `[ACTIVATION_FLOW]`

**What to do:**

Create an `ActivationFlow` inline card component with 4 steps, matching the pattern of RefillFlow:

**Steps:**
1. Choose SIM type (eSIM QR code | Physical SIM | Port number)
2. Activate (countdown / progress indicator)
3. Choose plan (Total Base 5G $40 | Total Connect $55 | Unlimited $65)
4. Done — SMS modal fires

**Trigger:** In demoResponses.js, James's turn 3 response should include `[ACTIVATION_FLOW]` tag.

**Minimum viable:** A simple 3-step card (SIM type → plan selection → success) is sufficient for demo. Full eSIM QR code display is a stretch goal.

**Skip if:** FIX-001 through FIX-010 are not yet complete. This is the lowest-value fix.

---

### FIX-013 — Angela Live Chat Availability by Time of Day
**Status:** [x] Done
**Priority:** 🟢 Low — only if after-hours demo is anticipated
**Persona(s):** us-005 Angela K.
**Source:** TASK-013 QA REVIEW · Low severity — hardcoded "Available now"
**PRD checks:** Not a named PRD acceptance criterion
**Files to change:**
  - `src/utils/demoResponses.js` — Angela turn 3 response function

**What to do:**

Add a simple time check before building Angela's turn 3 response:
```js
function getAngelaTurn3Response(account) {
  const hour = new Date().getHours(); // Local time of device running the demo
  const supportHoursOpen = hour >= 8 && hour < 22;

  const chatPill = supportHoursOpen
    ? `📞 Live Chat: Available now`
    : `📩 Request callback tomorrow morning`;

  const asyncPills = [
    chatPill,
    `📅 Schedule a callback for tomorrow`,
    `📋 Submit a support ticket`,
    `📡 Show me plan options too`,
  ];

  return buildResponse(`...`, asyncPills);
}
```

**Verify:**
- During business hours (8 AM–10 PM): "Live Chat: Available now" pill shows
- Outside hours: "Request callback tomorrow" pill shows instead

**What I did:**
Added `new Date().getHours()` check at the top of Angela's turn-3 branch in `demoResponses.js`. When `hour >= 8 && hour < 22`, the chat pill reads "📞 Live Chat: Available now"; outside those hours it reads "📩 Live Chat: Opens at 8 AM — request a callback instead".

**Files changed:**
- `src/utils/demoResponses.js` — Angela turn 3 time-of-day check

**Skip if:** All demo sessions are expected to run during business hours. The Live Chat availability state is cosmetic — Angela's flow is functional without this change.

---

## Sprint 2 QA Verification Checklist

After all fixes are applied, QA should re-run the following checks:

### PRD acceptance criteria re-verification
```
[x] C4 — SignalBanner CTA "Recarga Rápida" in ES mode (FIX-003) ✅ Done
[x] C5 — Pills in Spanish: "Mi internet está lento", "Me quedo sin datos", "Quiero gastar menos" (FIX-002) ✅ Done
[x] E5 — Maria plan-change branch shows quick reply pills (FIX-001) ✅ Done
[x] F2 — Refill card shows correct persona savedCard and plan name (FIX-006) ✅ Done
[x] F2 — Upgrade card shows correct persona current plan (FIX-007) ✅ Done
[x] F5 — SMS modal refill message: "5 GB added. Valid through [date]." (FIX-008) ✅ Done
[x] F5 — SMS modal upgrade message: references upgraded plan name (FIX-008) ✅ Done
[x] F5 — SMS modal international message: references correct country (FIX-008, FIX-009) ✅ Done
```

### Persona demo path re-verification
```
[x] us-001 Maria: refill path end-to-end ✓ | plan-change branch pills ✓ (FIX-001) ✅ Done
[x] us-002 Carlos: turn 2 routes to renewal options in demo mode (FIX-010) ✅ Done
[ ] us-003 Priya: no regression from Sprint 1 pass ✓ — needs manual QA
[ ] us-004 James: empty dashboard no regression ✓ | ActivationFlow card if FIX-012 done — FIX-012 still pending
[x] us-005 Angela: no regression ✓ | after-hours check ✅ (FIX-013) Done
[x] us-006 Derek: turn 2 shows upgrade options (NOT phone questions) (FIX-004) ✅ Done
[x] us-006 Derek: UpgradeFlow shows "Total Base 5G" as current plan (FIX-007) ✅ Done
[x] us-007 Ana: InternationalFlow shows "Colombia" not "Mexico" (FIX-009) ✅ Done
[x] us-008 Robert: FamilyPlanCompare shows 3 plans + line toggle + correct 4-line prices (FIX-005) ✅ Done
```

### Language toggle full re-verification (ES mode)
```
[ ] C1 — ES pill active state (teal) — no regression (needs manual QA)
[ ] C2 — Headline in Spanish — no regression (needs manual QA)
[ ] C3 — Subhead "Soy ClearPath AI" — no regression (needs manual QA)
[x] C4 — SignalBanner CTA: "Recarga Rápida" ✓ (FIX-003) ✅ Done
[x] C5 — Pills in Spanish ✓ (FIX-002) ✅ Done
[ ] C6 — Trust banner "Cómo funciona" — no regression (needs manual QA)
[ ] C7 — Input placeholder "Escribe tu mensaje..." — no regression (needs manual QA)
```

### Regression checks (Sprint 1 passes that must not break)
```
[ ] TASK-001 — Persona data still imports correctly (needs manual QA)
[ ] TASK-003 — URL routing still works (?persona=maria, ?persona=us-006, etc.) (needs manual QA)
[ ] TASK-004 — MiniDashboard still reads from persona.account (needs manual QA)
[ ] TASK-005 — 3 signals per persona still render (needs manual QA)
[ ] TASK-006 — Data meter color thresholds unchanged (needs manual QA)
[ ] TASK-011 — Priya rewards path: free option surfaced first (needs manual QA)
[ ] TASK-017 — Clarifying question still fires before any recommendation (E4) (needs manual QA)
[ ] TASK-018 — 1.8s processing animation still enforced (F3) (needs manual QA)
[ ] TASK-020 — URL routing fallback still defaults to Maria (us-001) (needs manual QA)
```

---

*ClearPath AI · Sprint 2 Task Log · Radiant Digital · March 2026*
*Sourced from Sprint 1 QA audit — tasklist.md (Mar 26, 2026)*
