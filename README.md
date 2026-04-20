# ClearPath AI — Intent-Driven Experience (IDE)

A conversational AI prototype that replaces the Total Wireless (Verizon Value) website. Instead of traditional navigation, customers state what they need in natural language and the AI finds the most affordable solution — no upsells, no confusion.

**Live Demo:** https://clearpath-ai-pearl.vercel.app/

---

## What This Is

ClearPath AI is **not** a chatbot companion sitting alongside an existing website — it **is** the website. The conversation is the UI.

Core design philosophy:
- Customer states their intent: *"I ran out of data"*
- AI diagnoses before recommending — free options first
- The most affordable solution is always surfaced first
- Traditional nav (Shop, Deals, Pay, Account) is completely removed

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 5 |
| Styling | CSS Modules |
| Animation | Framer Motion 12 |
| Icons | Phosphor Icons |
| Charts | Recharts + AmCharts 5 |
| AI Model | Claude Haiku (`claude-haiku-4-5`) via Anthropic API |
| Deployment | Vercel (serverless API proxy) |

---

## Repository Structure

```
IntentDrivenEx/
├── clearpath-ai/          # Main React/Vite application (source code)
├── 01_Documents/          # Project documentation
├── 02_Presentations/      # Slide decks and presentations
├── 03_Markdown-Docs/      # Markdown documentation
├── 05_Brand-Assets/       # Brand guidelines and assets
├── Total_Wireless/        # Reference materials
├── qa-reports/            # QA audit reports
├── index.html             # Standalone prototype (static)
├── clearpath-ai-brand-guide.html  # Brand guide reference
└── vercel.json            # Deployment config
```

> The main application lives in [`clearpath-ai/`](./clearpath-ai). See its [README](./clearpath-ai/README.md) for full setup and architecture details.

---

## Quick Start

```bash
cd clearpath-ai
npm install
echo "ANTHROPIC_API_KEY=your_key_here" > .env.local
npm run dev
```

App runs at `http://localhost:5173`.

---

## Getting Started (Full)

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### Scripts

```bash
npm run dev      # Start local dev server with HMR
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
npm run lint     # ESLint check
```

---

## Application Structure (`clearpath-ai/src/`)

```
src/
├── components/
│   ├── Header/                # Logo + EN/ES toggle + user chip
│   ├── LandingScreen/         # Hero + signal banner + intent pills
│   ├── ChatArea/              # Chat message list
│   ├── InputBar/              # Fixed bottom input
│   ├── MessageBubble/         # User/AI message styling
│   ├── SignalBanner/          # Smart tip / alert cards
│   ├── MiniDashboard/         # Data meter + plan info
│   ├── TrustBanner/           # "How this works" fixed button
│   ├── TransparencyPanel/     # Right-slide drawer
│   ├── RecommendationCard/    # Inline plan/refill card in chat
│   ├── IPhoneSMSModal/        # SMS confirmation with iPhone frame
│   ├── TypingIndicator/       # AI thinking animation
│   ├── RefillFlow/            # Data refill purchase flow
│   ├── UpgradeFlow/           # Plan upgrade flow
│   ├── PhoneOrderFlow/        # Device purchase flow
│   ├── RedeemFlow/            # Rewards redemption flow
│   ├── ActivationFlow/        # SIM/eSIM activation flow
│   ├── LiveChatFlow/          # Live agent escalation flow
│   └── ui/                    # Reusable primitives (Button, Pill, Badge)
├── context/
│   └── ChatContext.jsx        # Global state (useReducer pattern)
├── engine/
│   ├── router.js              # 5-step intent dispatch chain
│   └── flows/                 # Modular conversation flows
├── data/
│   ├── personas.js            # 10 test personas with account data
│   └── products.js            # Plans, phones, add-ons, deals
├── i18n/
│   └── translations.js        # EN/ES string library
└── utils/
    ├── api.js                 # Anthropic API proxy wrapper
    └── parseResponse.js       # Extracts flow tags from AI response
```

---

## Conversation Engine

Every user message passes through a 5-step dispatch chain:

1. **Global catches** — universal commands ("go home", "talk to a person")
2. **Active flow** — continue a running multi-step flow
3. **Intent detection** — classify the message
4. **Flow selection** — pick the best flow for the intent
5. **Fallback** — generic clarifying question

**Rule E4 (enforced):** The AI always asks at least one clarifying question before surfacing any recommendation or CTA.

---

## Persona System

10 test personas simulate different customer account states. Load via URL:

| URL | Persona | Scenario |
|-----|---------|----------|
| `/?persona=maria` or `/us-001` | Maria R. | Low data, urgent refill |
| `/?persona=us-006` | James T. | At data cap, upsell candidate |
| `/?persona=us-007` | Ana G. | International calling needs |

---

## Key Features

- **Intent Pills Grid** — 8 categories guide customers without free-form typing
- **Clarify Before Recommending** — AI never shows a plan card on the first message
- **Free Diagnostics** — Troubleshooting before suggesting paid options
- **Processing Animation** — 1.5s spinner on payment confirmation
- **iPhone SMS Modal** — Green SMS confirmation bubble with Dynamic Island frame
- **Mini Dashboard** — Data meter, plan name, and renewal date at a glance
- **EN/ES Toggle** — Full UI translation with a two-state pill
- **Transparency Panel** — Explains ClearPath AI's rules on demand

---

## Design Tokens

```
Primary brand:     #CC0000   Total Wireless red — logo only
Interaction teal:  #00B5AD   Active states, CTAs, highlights
Background:        #F8F9FA
Card surface:      #FFFFFF
User bubble:       #00B5AD (right-aligned)
AI bubble:         #FFFFFF (left-aligned, with border)
Success:           #28A745
Warning:           #FFC107
Error:             #DC3545
Font:              Inter
Border radius:     12px cards / 20px pills & bubbles / 8px inputs
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Set in Vercel for production, `.env.local` for dev |

---

## Deployment

Deployed on Vercel. Set `ANTHROPIC_API_KEY` in your Vercel project environment variables before deploying.

```bash
cd clearpath-ai
npm run build   # Output → dist/
```
