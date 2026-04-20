# ClearPath AI

A conversational AI prototype that replaces the Total Wireless (Verizon Value) website with an **Intent-Driven Experience (IDE)**. Instead of traditional navigation, customers state what they need in natural language and the AI finds the most affordable solution — no upsells, no confusion.

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

## Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Create a local env file
echo "ANTHROPIC_API_KEY=your_key_here" > .env.local

# 3. Start the dev server
npm run dev
```

The app runs at `http://localhost:5173`. The Vite dev server includes a custom middleware that proxies `/api/chat` to the Anthropic API locally — no separate backend needed.

### Scripts

```bash
npm run dev      # Start local dev server with HMR
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
npm run lint     # ESLint check
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key — set in Vercel for production, `.env.local` for dev |

---

## Project Structure

```
clearpath-ai/
├── api/
│   └── chat.js                    # Serverless API proxy → Anthropic
├── src/
│   ├── main.jsx                   # React entry point
│   ├── App.jsx                    # Root layout shell
│   ├── components/
│   │   ├── Header/                # Logo + EN/ES toggle + user chip
│   │   ├── LandingScreen/         # Hero + signal banner + intent pills
│   │   ├── ChatArea/              # Chat message list
│   │   ├── InputBar/              # Fixed bottom input
│   │   ├── MessageBubble/         # User/AI message styling
│   │   ├── SignalBanner/          # Smart tip / alert cards
│   │   ├── MiniDashboard/         # Data meter + plan info
│   │   ├── TrustBanner/           # "How this works" fixed button
│   │   ├── TransparencyPanel/     # Right-slide drawer
│   │   ├── RecommendationCard/    # Inline plan/refill card in chat
│   │   ├── IPhoneSMSModal/        # SMS confirmation with iPhone frame
│   │   ├── TypingIndicator/       # AI thinking animation
│   │   ├── PillOverlay/           # Quick reply pills overlay
│   │   ├── PasswordGate/          # Demo protection wrapper
│   │   ├── RefillFlow/            # Data refill purchase flow
│   │   ├── UpgradeFlow/           # Plan upgrade flow
│   │   ├── PhoneOrderFlow/        # Device purchase flow
│   │   ├── RedeemFlow/            # Rewards redemption flow
│   │   ├── ActivationFlow/        # SIM/eSIM activation flow
│   │   ├── LiveChatFlow/          # Live agent escalation flow
│   │   └── ui/
│   │       ├── Button/            # Reusable button (primary, outline, ghost)
│   │       ├── Pill/              # Reusable chip/pill
│   │       ├── Badge/             # Small label (Best Deal, Most Popular)
│   │       └── PhoneImage/        # iPhone frame SVG component
│   ├── context/
│   │   └── ChatContext.jsx        # Global state (useReducer pattern)
│   ├── hooks/
│   │   └── useChat.js             # sendMessage, startChat, resetChat
│   ├── engine/
│   │   ├── router.js              # 5-step intent dispatch chain
│   │   ├── personaOpenings.js     # AI-first proactive openings per persona
│   │   ├── utils.js               # msg() + POST_FLOW_PILLS helpers
│   │   └── flows/
│   │       ├── index.js           # FLOW_REGISTRY
│   │       ├── quick-refill.js
│   │       ├── plan-change.js
│   │       ├── diagnose-usage.js
│   │       ├── troubleshoot-signal.js
│   │       ├── browse-plans.js
│   │       ├── browse-phones.js
│   │       ├── upgrade.js
│   │       ├── international.js
│   │       └── activation.js
│   ├── data/
│   │   ├── personas.js            # 10 test personas with account data
│   │   ├── products.js            # Plans, phones, add-ons, deals
│   │   ├── signalBanners.js       # Signal/alert banner config
│   │   ├── intentMap.js           # Intent classification rules
│   │   └── systemPrompt.js        # Claude system prompt generator
│   ├── i18n/
│   │   ├── translations.js        # EN/ES string library
│   │   └── useTranslation.js      # t() hook
│   └── utils/
│       ├── api.js                 # callAPI() — Anthropic proxy wrapper
│       └── parseResponse.js       # Extracts flow tags + recommendations from AI response
├── index.html
├── vite.config.js                 # Vite config + local API middleware
├── vercel.json                    # Deployment + rewrite rules
└── package.json
```

---

## How the Conversation Engine Works

### 5-Step Router (`src/engine/router.js`)

Every user message passes through a dispatch chain in order:

1. **Global catches** — handles universal commands: "go home", "talk to a person", etc.
2. **Active flow** — if a multi-step flow is running (e.g. refill step 2), continue it
3. **Intent detection** — classify the message against `intentMap.js`
4. **Flow selection** — pick the best flow for the detected intent
5. **Fallback** — generic clarifying question if nothing matches

### Flows (`src/engine/flows/`)

Each flow is a state machine:
```js
{
  start(persona, context) → { response, nextStepId, actionPills }
  step(stepId, userText, context, persona) → { response, nextStepId, contextPatch }
}
```

Flows enforce **Rule E4**: the AI always asks at least one clarifying question before surfacing a recommendation or CTA.

### API Proxy (`api/chat.js`)

Messages are sent to `/api/chat` (Vercel serverless function), which:
- Accepts `{ messages[], systemPrompt }` in the request body
- Calls `claude-haiku-4-5-20251001` with `max_tokens: 800`
- Returns the AI response text

### Response Parsing (`src/utils/parseResponse.js`)

The AI response can contain tagged blocks that trigger UI:

```
[ACTION_PILLS]Refill Now|Check Usage|Change Plan[/ACTION_PILLS]
[REFILL_FLOW]
[UPGRADE_FLOW]
[RECOMMENDATIONS]{ plan: "Total Base 5G", price: 15.00 }[/RECOMMENDATIONS]
```

---

## State Management

`ChatContext` uses a Redux-style `useReducer` pattern. Key state fields:

| Field | Type | Description |
|-------|------|-------------|
| `mode` | `'landing' \| 'chatting'` | Current screen |
| `messages[]` | `Message[]` | Full conversation history |
| `isLoading` | `boolean` | API call in progress |
| `language` | `'en' \| 'es'` | Active language |
| `persona` | `Persona` | Current user account data |
| `flowId` / `stepId` | `string` | Active flow + current step |
| `showTransparencyPanel` | `boolean` | Drawer open/closed |
| `showSMSModal` | `boolean` | iPhone SMS modal visible |

---

## Persona System

10 test personas simulate different customer account states. Load them via URL:

| URL | Persona | Scenario |
|-----|---------|----------|
| `/?persona=maria` or `/?user=1` or `/us-001` | Maria R. | Low data, urgent refill needed |
| `/?persona=us-006` | James T. | At data cap, upsell candidate |
| `/?persona=us-007` | Ana G. | International calling needs |

Each persona includes: plan details, data balance, renewal date, saved payment method, rewards points, device info, pre-set signal banners, and conversation context instructions for the AI.

---

## Design System

```
Primary brand:     #CC0000   Total Wireless red — logo only, never reuse
Interaction teal:  #00B5AD   Active states, CTAs, AI bubbles, highlights
Background:        #F8F9FA   Off-white page background
Card surface:      #FFFFFF
User bubble:       #00B5AD   Right-aligned
AI bubble:         #FFFFFF   Left-aligned, with border
Success:           #28A745
Warning:           #FFC107
Error:             #DC3545
Font:              Inter (fallback: -apple-system, sans-serif)
Border radius:     12px cards / 20px pills & bubbles / 8px inputs
```

---

## Internationalization

Two languages supported: **English** (default) and **Spanish**.

The EN/ES toggle pill in the header switches the entire UI — headlines, intent pills, signal banners, CTAs, and input placeholder — using the `useTranslation()` hook backed by `src/i18n/translations.js`.

---

## Key Features

### Intent Pills Grid
8 intent categories on the landing screen guide customers to the right conversation flow without free-form typing. Each pill maps directly to a flow in the engine.

### Clarify Before Recommending (Rule E4)
The AI never surfaces a plan card or CTA on the first message. It always asks at least one clarifying question first, ensuring the diagnosis is right before any solution is shown.

### Free Diagnostics
For signal/speed issues, the AI runs a free troubleshooting path before suggesting any paid add-on or plan change.

### Processing Animation + SMS Confirmation
When a customer confirms a refill or upgrade:
1. A 1.5-second spinner animation plays
2. A success message appears in the chat
3. An iPhone frame modal appears with a green SMS confirmation bubble (not iMessage blue), a Dynamic Island at the top, and the caption *"Confirmation sent to your phone on file."*

### Mini Dashboard
A compact data meter between the signal banner and intent pills shows the current customer's data remaining, plan name, and renewal date at a glance.

### Transparency Panel
Clicking "How this works" slides open a right-side drawer explaining ClearPath AI's rules — lowest-cost option first, diagnose before recommending, never repeat questions already answered.

---

## Deployment

Deployed on Vercel. The `vercel.json` configures:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/api/chat",  "destination": "/api/chat" },
    { "source": "/us-:id",   "destination": "/" },
    { "source": "/(.*)",     "destination": "/" }
  ]
}
```

Set `ANTHROPIC_API_KEY` in your Vercel project's environment variables before deploying.

---

## What Not to Change

- `#CC0000` is brand-locked to the Total Wireless logo only
- Do not add traditional nav items (Shop, Deals, Pay, Account)
- The AI must never recommend a more expensive plan without first acknowledging the stated problem
- The EN/ES toggle is a two-state pill — do not add more languages or convert to a dropdown
- The AI must always clarify before recommending (Rule E4)
