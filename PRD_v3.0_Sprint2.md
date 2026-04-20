# ClearPath AI — Product Requirements Document
**Product:** ClearPath AI · Total Wireless Intent-Driven Experience
**Client:** Verizon Value / Total Wireless (prepaid segment)
**Version:** 3.0 — Sprint 2 · QA-driven fixes + polish
**Previous version:** PRD v2.0 (Sprint 1 target, Mar 26, 2026)
**Prototype URL:** https://clearpath-ai-pearl.vercel.app/
**Sprint target:** Fri Mar 27 → Mon Mar 30, 2026 (Srini review)

**Stakeholders:**
| Name | Role |
|------|------|
| Lam Huynh | Lead Designer / Project Driver — lam.huynh@radiant.digital |
| Srinivas Chamarthi | Client-facing PM, Radiant Digital |
| Shobhit Singh | UX Designer / Prototype Builder |
| Rajat | Client Stakeholder, Verizon Value |
| David Kim (DK) | President, Verizon Value |

---

## Sprint 1 Results — What Was Built

Sprint 1 (Mar 26) completed 19 of 20 tasks (TASK-016 partial). QA ran a full code audit.
The table below shows what shipped and what the QA verdict was.

| Task | What Was Built | QA Verdict |
|------|---------------|------------|
| TASK-001 | Persona data (8 personas) imported into app | ✅ Passed |
| TASK-002 | Persona dropdown in Header | ⚠️ Passed — cosmetic issue (native `<select>`) |
| TASK-003 | App state wired to selected persona (ChatContext) | ✅ Passed |
| TASK-004 | MiniDashboard reads from persona.account | ✅ Passed |
| TASK-005 | 3-signal composite display in MiniDashboard | ✅ Passed |
| TASK-006 | Data meter color tied to persona.account.dataPercent | ✅ Passed |
| TASK-007 | IntentPills from persona.suggestedActions | ❌ Failed — ES translation missing (PRD C5) |
| TASK-008 | SignalBanner copy from persona.signals[0] | ❌ Failed — ES CTA stays English (PRD C4) |
| TASK-009 | US-001 Maria — refill + plan-change branches | ❌ Failed — typo breaks plan-change pills |
| TASK-010 | US-002 Carlos — expiry + AutoPay branch | ⚠️ Passed — flowKey routing miss in demo mode |
| TASK-011 | US-003 Priya — rewards redemption branch | ✅ Passed |
| TASK-012 | US-004 James — activation + empty dashboard | ⚠️ Passed — no inline ActivationFlow card |
| TASK-013 | US-005 Angela — diagnostics gate + outage check | ⚠️ Passed — Live Chat hardcoded "Available" |
| TASK-014 | US-006 Derek — upsell with prorate/renewal choice | ❌ Failed — flowKey routing + hardcoded plan data |
| TASK-015 | US-007 Ana — international add-on + points | ⚠️ Passed — hardcoded "Mexico" instead of Colombia |
| TASK-016 | US-008 Robert — plan comparison + 4-line toggle | ❌ Failed — hardcoded prices, no toggle, 2-plan only |
| TASK-017 | Clarifying question gate (E4) | ✅ Passed |
| TASK-018 | Processing animation 1.5s minimum (F3) | ✅ Passed |
| TASK-019 | iPhone SMS modal on all transactions (F5–F7) | ⚠️ Passed — wrong message content for upgrade/international |
| TASK-020 | getPersonaFromURL() at app init (H1) | ✅ Passed |

**Sprint 1 demo readiness: NOT YET READY** — 4 high-severity blockers must be resolved first.

---

## What Changes in v3.0 (Sprint 2)

Sprint 2 has no new features. It is entirely fix and polish work, prioritised by QA severity.

| # | Issue | Severity | PRD Checks Affected |
|---|-------|----------|-------------------|
| FIX-001 | `[/ACTION_PUPILS]` typo in demoResponses.js line 209 | 🔴 Critical | E5, Maria plan-change path |
| FIX-002 | ES pill labels missing — pills stay English on toggle | 🔴 High | C5 |
| FIX-003 | SignalBanner CTA stays English in ES mode | 🔴 High | C4 |
| FIX-004 | Derek's flowKey routes to new-phone instead of upgrade | 🔴 High | E-flow, Derek demo |
| FIX-005 | Robert's UpgradeFlow: wrong prices, 2-plan only, no line toggle | 🔴 High | Robert demo (P3) |
| FIX-006 | RefillFlow hardcoded Visa ····4821 — not persona.account.savedCard | 🟡 Medium | F1, F2 |
| FIX-007 | UpgradeFlow plan names hardcoded — not persona-specific | 🟡 Medium | F1, F2 |
| FIX-008 | SMS modal message content same for all transaction types | 🟡 Medium | F5 |
| FIX-009 | InternationalFlow "Mexico" hardcoded — should be persona country | 🟡 Medium | Ana demo |
| FIX-010 | Carlos flowKey routing misses renewal pill labels in demo mode | 🟡 Medium | Carlos demo |
| FIX-011 | Persona dropdown is native `<select>` — cosmetic inconsistency | 🟢 Low | A6 polish |
| FIX-012 | James activation: text-only flow, no inline card | 🟢 Low | James demo |
| FIX-013 | Angela: Live Chat hardcoded "Available now" regardless of time | 🟢 Low | Angela demo |

---

## Sprint 2 Task Specifications

### FIX-001 — Typo: `[/ACTION_PUPILS]` → `[/ACTION_PILLS]`
**Priority:** 🔴 Critical — fix first, 1-line change
**File:** `src/utils/demoResponses.js` line ~209
**Failing check:** PRD E5 (quick reply pills render after AI response)

**Fix:**
```js
// Line ~209 — Maria plan-change branch closing tag:
// BEFORE:
[/ACTION_PUPILS]
// AFTER:
[/ACTION_PILLS]
```

**Verify:** Tap "Change my plan" pill as Maria → turn 2 AI response renders quick reply pills.

---

### FIX-002 — ES Pill Labels (PRD C5)
**Priority:** 🔴 High
**File:** `src/data/personas.js` (add `labelEs` to each `suggestedActions` entry) + `src/components/LandingScreen/LandingScreen.jsx` (read `labelEs` when `lang === 'es'`)
**Failing check:** PRD C5 — `"Mi internet está lento"`, `"Me quedo sin datos"`, `"Quiero gastar menos"` visible in ES mode

**Approach A — preferred:** Add `labelEs` to every `suggestedActions` entry in `personas.js`:
```js
// personas.js — example for us-001 Maria:
suggestedActions: [
  { label: "I'm running low on data",    labelEs: "Me quedo sin datos",        intentKey: "refill" },
  { label: "I want to change my plan",   labelEs: "Quiero cambiar mi plan",     intentKey: "upgrade" },
  { label: "Quick Refill — $15",         labelEs: "Recarga Rápida — $15",       intentKey: "refill" },
]
```

Add `labelEs` to all entries in EXTRA_PILLS for each intentCategory too.

**In LandingScreen:**
```js
const { lang } = useLanguage();
// in getPersonaPills():
const displayLabel = (lang === 'es' && pill.labelEs) ? pill.labelEs : pill.label;
return { ...pill, label: displayLabel };
```

**Verify:** Toggle to ES → pills show Spanish labels. Toggle back → English labels return.

---

### FIX-003 — ES SignalBanner CTA (PRD C4)
**Priority:** 🔴 High
**Files:** `src/components/LandingScreen/LandingScreen.jsx` and/or `src/components/SignalBanner/SignalBanner.jsx`
**Failing check:** PRD C4 — Signal banner CTA in ES mode shows `"Recarga Rápida"` (not "Quick Refill")

**Root cause:** `SET_SIGNAL_BANNER` dispatches English `cta` string once on persona load. Language toggle does not re-derive it.

**Preferred fix:** Store a `flowId` (e.g. `"refill"`) in the banner state instead of a resolved CTA string. Inside `SignalBanner.jsx`, derive the CTA text from `t('signal.cta.refill')` using the current language context:

```js
// In SET_SIGNAL_BANNER dispatch (LandingScreen):
dispatch({ type: 'SET_SIGNAL_BANNER', payload: {
  headline: sig.headline,
  subtext: sig.subtext,
  flowId: persona.intentCategory,   // ← store flowId, not CTA string
}});

// In SignalBanner.jsx:
const ctaText = t(`signal.cta.${banner.flowId}`) || banner.cta;
// i18n keys: signal.cta.refill → "Quick Refill" / "Recarga Rápida"
//            signal.cta.upgrade → "See Options" / "Ver Opciones"
//            signal.cta.addon → "Add International" / "Agregar Internacional"
```

Also make `banner.headline` and `banner.subtext` language-aware by either: (a) storing `headlineEs` / `subtextEs` in persona.signals[] and reading by lang, or (b) adding translation keys to the i18n file.

**Verify:** Load Maria (refill intent) → toggle to ES → banner CTA reads `"Recarga Rápida"`. Toggle back → `"Quick Refill"`.

---

### FIX-004 — Derek flowKey Routing Bug
**Priority:** 🔴 High
**File:** `src/utils/demoResponses.js` — `getFlowKey()` or `generateDemoResponse()`
**Failing check:** Derek's demo — tapping "Upgrade to Unlimited — $55/mo" routes to new-phone flow instead of upgrade flow

**Root cause:** `getFlowKey()` requires `msg.includes('upgrade') && msg.includes('plan')`. Derek's pill "Upgrade to Unlimited" contains 'upgrade' but not 'plan', matching the new-phone condition instead.

**Fix:** Add `persona.intentCategory` as a routing override at the top of `generateDemoResponse()`:

```js
function generateDemoResponse(userMsg, turnCount, persona, ...) {
  // Primary routing: honor intentCategory if set
  if (persona?.intentCategory === 'upgrade' && turnCount > 1) {
    return UPGRADE_FLOW_RESPONSES[turnCount] ?? ...;
  }
  if (persona?.intentCategory === 'international' && turnCount > 1) {
    return INTERNATIONAL_FLOW_RESPONSES[turnCount] ?? ...;
  }
  // Fallback to existing getFlowKey() logic
  const flowKey = getFlowKey(userMsg);
  ...
}
```

Also patch `getFlowKey()` to include broader upgrade detection:
```js
// Add to upgrade detection:
if (msg.includes('upgrade') || msg.includes('unlimited') || msg.includes('55')) return 'upgrade';
```

**Verify:** Select Derek → tap "Upgrade to Unlimited — $55/mo" pill → turn 2 shows prorated vs renewal choice (NOT phone questions).

---

### FIX-005 — Robert UpgradeFlow: Persona-Aware Pricing + 3-Plan Comparison
**Priority:** 🔴 High (Robert is a P3 walkable persona — complete before Srini review)
**Files:** `src/components/UpgradeFlow/UpgradeFlow.jsx` (or new `FamilyPlanCompare.jsx`)
**Failing checks:** Robert demo — hardcoded $40/$50 prices, only 2 plans, no 4-line toggle

**What UpgradeFlow must show for Robert (us-008):**

| Lines | Total Base 5G (current) | 5G Unlimited | 5G+ |
|-------|------------------------|--------------|-----|
| 1 | $40/mo | $55/mo | $65/mo |
| 2 | $80/mo | $90/mo | $110/mo |
| 3 | $120/mo | $100/mo | $120/mo |
| 4 | **$160/mo** ← current | **$110/mo** | $130/mo |

(Values from `persona.account.planComparison` in personas.js)

**Requirements:**
1. UpgradeFlow reads plan data from `persona.account.planComparison` when present — not hardcoded
2. For Robert: show 3 plan columns (Base 5G / Unlimited / 5G+) with savings callout
3. Interactive line count stepper (1–4) that recalculates all three column prices simultaneously
4. Highlight the recommended plan (5G Unlimited at 4 lines — saves $50/mo)
5. Current plan badge reads from `persona.account.plan` and `persona.account.planPrice`

**Minimum viable for demo:** If full component rewrite is too large, build a `FamilyPlanCompare` component that renders only when `persona.id === 'us-008'` and wire it to replace UpgradeFlow in Robert's turn 3 trigger.

**Verify:** Select Robert → walk conversation to turn 3 → see 3-plan table with 4-line pricing → adjust line count slider → prices update for all 3 plans.

---

### FIX-006 — RefillFlow Reads persona.account.savedCard
**Priority:** 🟡 Medium
**File:** `src/components/RefillFlow/RefillFlow.jsx`
**Failing check:** PRD F2 — card details should match selected persona (not always Visa ····4821)

**Fix:** RefillFlow must read card details from `persona.account.savedCard` (and `persona.account.savedCardType`):
```js
const { persona } = useChatContext();
const cardDisplay = persona.account.savedCard ?? '····4821';
const cardType    = persona.account.savedCardType ?? 'Visa';
// Render: `${cardType} ending in ${cardDisplay}`
```

Applies to the confirmation screen and the "continue" button label. Also update `planName` and `planPrice` from `persona.account.plan` and `persona.account.planPrice` instead of hardcoded strings.

**Verify:** Switch to Carlos (or Priya) → run refill flow → card shown matches that persona's saved card, not Maria's Visa.

---

### FIX-007 — UpgradeFlow Reads Persona Plan Data
**Priority:** 🟡 Medium
**File:** `src/components/UpgradeFlow/UpgradeFlow.jsx`
**Failing check:** PRD F2 — plan name and price should reflect selected persona

**Fix:** Similar to FIX-006. UpgradeFlow's "current plan" comparison card must read:
- Current plan name: `persona.account.plan`
- Current plan price: `persona.account.planPrice`
- Current plan features: `persona.account.planFeatures` (if defined) or derived from plan name

The upgrade target plan (e.g. "Unlimited") should come from `persona.account.upgradeTarget` or from the planComparison array if present.

**Verify:** Select Derek → run to UpgradeFlow → "current plan" shows "Total Base 5G — $40/mo" (Derek's actual plan). Not "5 GB high-speed data — $40/mo" (generic copy).

---

### FIX-008 — SMS Modal Message Context-Aware by Transaction Type
**Priority:** 🟡 Medium
**File:** `src/components/IPhoneSMSModal/IPhoneSMSModal.jsx` + all 3 flow components
**Failing check:** PRD F5 — SMS message text should describe the actual transaction

**Fix:** Pass `transactionType` in the SHOW_SMS_MODAL dispatch payload:

In each flow on success:
```js
// RefillFlow:
dispatch({ type: 'SHOW_SMS_MODAL', payload: { transactionType: 'refill', persona } });
// UpgradeFlow:
dispatch({ type: 'SHOW_SMS_MODAL', payload: { transactionType: 'upgrade', persona } });
// InternationalFlow:
dispatch({ type: 'SHOW_SMS_MODAL', payload: { transactionType: 'international', persona } });
```

In `ChatContext` reducer, store `state.smsModalData = action.payload`.

In `IPhoneSMSModal`:
```js
const messages = {
  refill: `Your Total Wireless account has been refilled. 5 GB added. Valid through ${expiryDate}.`,
  upgrade: `Your plan has been upgraded to Unlimited. Disney+ activation email on its way.`,
  international: `Global Calling Card activated. Your Colombia calls are covered.`,
};
const msg = messages[smsModalData?.transactionType] ?? messages.refill;
```

**Verify:** Run refill → SMS says "5 GB added". Run upgrade → SMS says plan upgraded. Run international → SMS says Calling Card activated.

---

### FIX-009 — InternationalFlow "Mexico" → Persona Country
**Priority:** 🟡 Medium
**File:** `src/components/InternationalFlow/InternationalFlow.jsx`
**Failing check:** Ana demo — signal note reads "Mexico" but Ana calls Colombia

**Fix:** InternationalFlow receives `persona` from context. Replace hardcoded "Mexico" with:
```js
const country = persona.account.internationalCallsThisMonth?.[0]?.country ?? 'international destinations';
// Usage: `Your service covers ${country} and 140+ countries.`
```

Also update the success message to reference the country dynamically.

**Verify:** Select Ana → run to InternationalFlow → signal note reads "Colombia" not "Mexico".

---

### FIX-010 — Carlos flowKey Routing (Demo Fallback)
**Priority:** 🟡 Medium
**File:** `src/utils/demoResponses.js` — `getFlowKey()`
**Failing check:** Carlos demo (demo-fallback mode) — renewal pill labels don't route to refill flow at turn 2

**Root cause:** `getFlowKey()` requires `msg.includes('refill') && msg.includes('data')`. Carlos's pill "Renew Total Base 5G — $40/mo" contains neither keyword.

**Fix:** Expand renewal detection in `getFlowKey()`:
```js
// Add to refill/renewal detection:
if (msg.includes('renew') || msg.includes('expir') || msg.includes('autopay')) return 'refill';
```

Also: apply `persona.intentCategory === 'expiry'` override in `generateDemoResponse()` (same pattern as FIX-004).

**Verify (demo mode):** Select Carlos → tap "Renew Total Base 5G — $40/mo" pill → turn 2 shows renewal-specific options (not generic cost questions).

---

### FIX-011 — Persona Dropdown: Custom Styled (Low priority polish)
**Priority:** 🟢 Low — do before Srini review if time permits
**File:** `src/components/Header/Header.jsx` + `Header.module.css`
**Failing check:** A6 polish — native `<select>` is OS-dependent and doesn't match teal design system

**Fix:** Replace native `<select>` with a custom `<div>`-based dropdown that matches the pill/card styling:
- Trigger button: same pill style as EN/ES toggle (teal active state)
- Dropdown panel: white card, 12px border-radius, teal left-border on selected item
- Shows `[Name] — [hint]` per entry, same font as the rest of the UI

This is cosmetic only — functional behavior is already correct.

---

### FIX-012 — James Activation Inline Card (Low priority)
**Priority:** 🟢 Low — nice-to-have, not a PRD acceptance criterion
**File:** `src/components/ActivationFlow/ActivationFlow.jsx` (new component)

Currently James's activation is text-only. An `ActivationFlow` inline card (similar to RefillFlow) would show:
- Step indicator: 1. Choose SIM type → 2. Activate → 3. Choose plan → 4. Done
- eSIM QR code placeholder or step-by-step visual
- Plan selection card at step 3

**Only build if time permits after P1/P2 fixes.**

---

### FIX-013 — Angela Live Chat Hours (Low priority)
**Priority:** 🟢 Low — not a PRD acceptance criterion
**File:** `src/utils/demoResponses.js` — Angela turn 3 response

Currently Live Chat always shows "Available now". In Angela's persona she's a late-night caller (11:45 PM EST). For realism, Live Chat should respect support hours.

**Fix (simple):**
```js
const hour = new Date().getHours();
const chatAvailable = hour >= 8 && hour < 22;
const chatPill = chatAvailable ? "📞 Live Chat: Available now" : "📩 Request callback tomorrow";
```

**Only relevant if Angela's demo is run outside business hours.**

---

## Updated Acceptance Criteria — Master Checklist

Status after Sprint 1 QA · Sprint 2 target in parentheses

### Header
| ID | Requirement | After Sprint 1 | Sprint 2 target |
|----|-------------|---------------|-----------------|
| A1 | Total Wireless red logo, left-anchored | ✅ | — |
| A2 | EN/ES toggle pill, top-right | ✅ | — |
| A3 | EN active by default (teal fill) | ✅ | — |
| A4 | User chip: name, teal avatar, green dot | ✅ | — |
| A5 | No traditional nav items | ✅ | — |
| A6 | Persona dropdown — 8 entries + hint text | ⚠️ Functional, cosmetic issue | ✅ FIX-011 |
| A7 | Selecting persona updates full app state + URL | ✅ | — |
| A8 | Default persona on load = us-001 (Maria R.) | ✅ | — |

### Mini Dashboard & Signals
| ID | Requirement | After Sprint 1 | Sprint 2 target |
|----|-------------|---------------|-----------------|
| G1 | Dashboard between Signal Banner and pills grid | ✅ | — |
| G2 | Shows data remaining, plan name, renewal date | ✅ | — |
| G3 | Data meter color: green/amber/red/neutral | ✅ | — |
| G4 | Exactly 3 intent signals per persona | ✅ | — |
| G5 | Signal severity styling (critical/warning/info) | ✅ | — |
| G6 | Signal text matches personas.js exactly | ✅ | — |
| G7 | Empty state for us-004 (no meter, no plan) | ✅ | — |

### Landing Screen
| ID | Requirement | After Sprint 1 | Sprint 2 target |
|----|-------------|---------------|-----------------|
| B1 | ClearPath AI logo centered | ✅ | — |
| B2 | Headline: "Tell us what's going on…" | ✅ | — |
| B3 | Subhead: "Hi. I am ClearPath AI" + "most affordable path first" | ⚠️ Abbreviated | Review copy |
| B4 | Signal banner (persona-driven headline + CTA) | ✅ EN only | ✅ FIX-003 |
| B5 | Exactly 8 intent pills in 2×4 grid | ✅ | — |
| B6 | Pills from persona.suggestedActions — EN ✅, ES ❌ | ⚠️ Partial | ✅ FIX-002 |
| B7 | Escape-hatch pill on every persona | ✅ | — |
| B8 | Trust banner fixed bottom-right | ✅ | — |
| B9 | Fixed chat input bar at bottom | ✅ | — |

### Language Toggle
| ID | Requirement | After Sprint 1 | Sprint 2 target |
|----|-------------|---------------|-----------------|
| C1 | ES pill becomes teal/active on click | ✅ | — |
| C2 | Headline translates to Spanish | ✅ | — |
| C3 | Subhead: "Soy ClearPath AI" | ✅ | — |
| C4 | Signal banner CTA: "Recarga Rápida" in ES | ❌ Stays English | ✅ FIX-003 |
| C5 | Pills translate to Spanish | ❌ Stay English | ✅ FIX-002 |
| C6 | Trust banner: "ClearPath AI \| Cómo funciona" | ✅ | — |
| C7 | Input placeholder: "Escribe tu mensaje…" | ✅ | — |

### Transparency Panel
| ID | Requirement | After Sprint 1 | Sprint 2 target |
|----|-------------|---------------|-----------------|
| D1–D5 | Full transparency panel | ✅ All pass | — |

### Conversational Flow
| ID | Requirement | After Sprint 1 | Sprint 2 target |
|----|-------------|---------------|-----------------|
| E1 | Landing animates upward smoothly | ✅ | — |
| E2 | User bubble: right-aligned teal | ✅ | — |
| E3 | AI bubble: left-aligned with label | ✅ | — |
| E4 | 🔴 Clarifying Q before recommendation — hard gate | ✅ | — |
| E5 | 2–3 quick reply pills after AI response | ⚠️ Broken on Maria plan-change | ✅ FIX-001 |
| E6 | Input bar fixed at bottom | ✅ | — |
| E7 | AI uses sensible defaults — no asking what provider knows | ✅ | — |
| E8 | Diagnostics gate before upsell in support flows | ✅ | — |
| E9 | Explicit permission before plan card / upsell | ✅ | — |

### Payment & Confirmation
| ID | Requirement | After Sprint 1 | Sprint 2 target |
|----|-------------|---------------|-----------------|
| F0 | AI confirms intent before refill CTA | ✅ | — |
| F1 | Recommendation card renders inline | ✅ | — |
| F2 | Card shows correct plan name, price, CTA — per persona | ⚠️ Hardcoded for non-Maria | ✅ FIX-006, FIX-007 |
| F3 | 🔴 CTA click → 1.5s processing animation | ✅ (1.8s) | — |
| F4 | 🔴 Success message in conversation after processing | ✅ | — |
| F5 | 🔴 iPhone SMS modal: Dynamic Island, green bubble, correct text | ⚠️ Visual ✅, message content ❌ | ✅ FIX-008 |
| F6 | 🔴 Modal X button dismisses | ✅ | — |
| F7 | 🔴 Caption: "Confirmation sent to your phone on file." | ✅ | — |

### Phone Purchase Flow
| ID | Requirement | After Sprint 1 | Sprint 2 target |
|----|-------------|---------------|-----------------|
| P1 | Two entry points: direct gallery + guided flow | Not tested in Sprint 1 | Carry forward |
| P2 | Current device from account surfaced at flow start | Not tested | Carry forward |
| P3 | Free-text phone description accepted | Not tested | Carry forward |
| P4 | "Show me all phones" → gallery, no questions | Not tested | Carry forward |
| P5 | Pasted URL / model name handled directly | Not tested | Carry forward |

### Persona URLs
| ID | Requirement | After Sprint 1 | Sprint 2 target |
|----|-------------|---------------|-----------------|
| H1 | ?persona=maria → us-001 | ✅ | — |
| H2 | ?persona=us-006 → us-006 | ✅ | — |
| H3 | ?persona=us-007 → us-007 | ✅ | — |
| H4 | All 8 persona URL aliases resolve correctly | ✅ | — |
| H5 | No-param default → us-001 | ✅ | — |
| H6 | Dropdown selection updates URL param | Not explicitly verified | Confirm |

---

## Sprint 2 Prioritised Fix Order

### Must fix before ANY review (critical blockers)
1. **FIX-001** — 1-line typo fix · `[/ACTION_PUPILS]` → `[/ACTION_PILLS]`
2. **FIX-004** — Derek flowKey routing · add `intentCategory` override
3. **FIX-003** — ES SignalBanner CTA · store `flowId`, derive CTA via `t()`
4. **FIX-002** — ES pill labels · add `labelEs` to personas.js + EXTRA_PILLS

### Fix before Lam review (high severity)
5. **FIX-005** — Robert UpgradeFlow · persona-aware pricing + 3-plan display + line toggle
6. **FIX-006** — RefillFlow savedCard reads from persona.account
7. **FIX-007** — UpgradeFlow current plan reads from persona.account
8. **FIX-008** — SMS modal message per transaction type
9. **FIX-009** — InternationalFlow country: "Mexico" → persona country

### Fix before Srini review (medium severity)
10. **FIX-010** — Carlos flowKey routing for renewal labels
11. **FIX-011** — Persona dropdown custom styled component

### Polish sprint (low severity — do if time allows)
12. **FIX-012** — James inline ActivationFlow card
13. **FIX-013** — Angela after-hours Live Chat availability

---

## Persona Demo Readiness After Sprint 2

| Persona | Priority | Flow | Expected status after fixes |
|---------|---------|------|---------------------------|
| us-001 Maria R. | P1 | Refill + plan change | ✅ Fully polished (FIX-001 unblocks plan-change branch) |
| us-002 Carlos M. | P1 | Expiry + AutoPay | ✅ Polished (FIX-010 fixes demo routing) |
| us-003 Priya S. | P1 | Rewards redemption | ✅ Already passing — no changes needed |
| us-006 Derek W. | P1 | Smart upsell | ✅ Polished (FIX-004 + FIX-007 fix routing and plan display) |
| us-007 Ana G. | P2 | International add-on | ✅ Polished (FIX-009 + FIX-008 fix country + SMS) |
| us-005 Angela K. | P3 | Support + diagnostics | ✅ Walkable — no blocking issues |
| us-008 Robert L. | P3 | 4-line plan comparison | ✅ Walkable after FIX-005 |
| us-004 James T. | P3 | Activation | ✅ Present (text-only) · FIX-012 optional upgrade |

---

## Files Most Likely to Change in Sprint 2

| File | FIX tasks touching it |
|------|-----------------------|
| `src/utils/demoResponses.js` | FIX-001, FIX-004, FIX-010 |
| `src/data/personas.js` | FIX-002 (add labelEs) |
| `src/components/LandingScreen/LandingScreen.jsx` | FIX-002, FIX-003 |
| `src/components/SignalBanner/SignalBanner.jsx` | FIX-003 |
| `src/components/RefillFlow/RefillFlow.jsx` | FIX-006, FIX-008 |
| `src/components/UpgradeFlow/UpgradeFlow.jsx` | FIX-005, FIX-007, FIX-008 |
| `src/components/InternationalFlow/InternationalFlow.jsx` | FIX-008, FIX-009 |
| `src/components/IPhoneSMSModal/IPhoneSMSModal.jsx` | FIX-008 |
| `src/components/Header/Header.jsx` | FIX-011 |
| `src/context/ChatContext.jsx` | FIX-008 (smsModalData in reducer) |

---

## Timeline

| Date | Milestone |
|------|-----------|
| Thu Mar 26 (done) | Sprint 1 complete · QA audit complete · PRD v3.0 issued |
| Fri Mar 27 AM | FIX-001 through FIX-004 complete (critical blockers cleared) |
| Fri Mar 27 PM | FIX-005 through FIX-009 complete (all P1 personas demo-ready) |
| Sat Mar 28 | FIX-010, FIX-011 · Lam review · polish pass |
| Mon Mar 30 | Srini review — all P1 and P2 personas fully polished |

---

## What NOT to Change

- Total Wireless red (`#CC0000`) — logo only, brand-locked
- No traditional nav items (Shop / Deals / Pay / Account)
- EN/ES toggle stays a two-state pill — no additional languages, no dropdown
- The AI must never recommend a more expensive plan without first acknowledging the stated problem
- All ✅ passing Sprint 1 checks (TASK-001, 003–006, 011, 017–020) must not regress

---

*ClearPath AI · PRD v3.0 · Radiant Digital · March 2026*
*Supersedes PRD v2.0 — Sprint 2 QA-fix iteration*
