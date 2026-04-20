# ClearPath AI — Demo Implementation Plan

**Date:** March 31, 2026
**Goal:** A tight, polished demo showing the core intent-driven experience.

---

## What's IN the Demo

| # | Feature | Status | PRD Checks |
|---|---------|--------|------------|
| 1 | **Landing Screen** — Logo, headline, subhead, signal banner, 8 intent pills, trust banner, input bar | DONE | A1-A5, B1-B7 |
| 2 | **Conversational Flow** — User/AI bubbles, clarifying question before recommendation, quick-reply pills | 95% | E2-E6 |
| 3 | **Refill Flow + Payment** — Recommendation card, $15 CTA, 1.5s processing animation, success message, iPhone SMS modal | DONE | F1-F7 |
| 4 | **Transparency Panel** — Side drawer with rules, "lowest-cost first" principle | DONE | D1-D5 |
| 5 | **Mini Dashboard** — Data ring, plan name, renewal date, network, spend | DONE | G1 |
| 6 | **Persona URLs** — `?persona=maria`, `?persona=us-006`, keyboard shortcuts | DONE | H1 |

## What's OUT (Deprioritized)

- EN/ES language toggle (i18n layer stays in code, just not demoed)
- ActivationFlow, BYOPFlow, InternationalFlow, UpgradeFlow (components removed)
- ExploreDetail panel (component removed)

---

## Remaining Work (Polish Only)

### P1: Chat message entrance animation (E1)
**What:** Messages currently appear instantly. PRD says "Landing content animates upward (no hard jump)."
**Where:** `components/MessageBubble/MessageBubble.jsx`
**Fix:** Wrap each bubble in a framer-motion `<motion.div>` with a simple fade-slide-up:
```jsx
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```
**Effort:** ~15 min

### P2: Landing-to-chat transition smoothness (E1)
**What:** When user sends first message, landing should animate up smoothly.
**Where:** `App.jsx` (view transition) + `components/LandingScreen/LandingScreen.jsx`
**Check:** Verify the `AnimatePresence` exit animation on LandingScreen works correctly.
**Effort:** ~15 min to verify/tweak

### P3: Quick smoke test across 3 personas
**What:** Walk through the full refill flow for maria (us-001), james (us-006), ana (us-007).
**Where:** Browser — `?persona=maria`, `?persona=us-006`, `?persona=us-007`
**Check:** Dashboard shows correct data, pills are relevant, refill flow completes, SMS modal shows.
**Effort:** ~20 min

---

## File Structure (Post-Cleanup)

```
Intent Driven EX/
├── 01_Documents/          (3 files — PRD, master ref, design review)
├── 02_Presentations/      (1 file — deck)
├── 03_Markdown-Docs/      (5 files — specs)
├── 05_Brand-Assets/       (logos + assets)
├── CLAUDE.md              (project context for Claude Code)
├── Lam_Intent_Driven_Design_Feedback.md
└── clearpath-ai/          (THE APP)
    ├── src/
    │   ├── components/    (17 components — all used)
    │   │   ├── ActionPills/
    │   │   ├── ChatArea/
    │   │   ├── FloatingShapes/
    │   │   ├── Header/
    │   │   ├── IPhoneSMSModal/
    │   │   ├── InputBar/
    │   │   ├── LandingScreen/
    │   │   ├── MessageBubble/
    │   │   ├── MiniDashboard/
    │   │   ├── PasswordGate/
    │   │   ├── RecommendationCard/
    │   │   ├── RefillFlow/
    │   │   ├── SignalBanner/
    │   │   ├── TransparencyPanel/
    │   │   ├── TrustBanner/
    │   │   ├── TypingIndicator/
    │   │   └── UserChip/
    │   ├── context/       (ChatContext.jsx)
    │   ├── data/          (personas, products, signalBanners, systemPrompt)
    │   ├── hooks/         (useChat.js)
    │   ├── i18n/          (translations + useTranslation hook)
    │   ├── utils/         (api, demoResponses, parseResponse)
    │   ├── App.jsx        (main app shell)
    │   └── main.jsx       (entry point)
    ├── public/            (icons, logos, phone images)
    ├── docs/              (design brief)
    └── package.json       (React 19 + Vite 5)
```

## Demo Script (Suggested)

1. **Open** `clearpath-ai-pearl.vercel.app` (or localhost)
2. **Show** the landing screen — point out: no nav, just intent + data dashboard
3. **Click** "I run out of data" pill
4. **Watch** AI ask a clarifying question (not just dump a plan)
5. **Reply** with a quick-reply pill
6. **See** the $15 refill recommendation appear inline
7. **Click** "Continue — $15" → processing spinner → success → iPhone SMS modal
8. **Dismiss** SMS modal
9. **Click** trust banner → show transparency panel with the rules
10. **Switch persona** via `?persona=us-006` → dashboard changes, different signals
