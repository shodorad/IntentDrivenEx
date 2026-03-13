# Intent-Driven Experience — Verizon Total Wireless
## Claude Code Development Workflow

> **Project**: Rapid prototype of a conversational, intent-based shopping/support experience for Total Wireless (Verizon Value)
> **Audience**: Value/prepay customers (~$30–$40/month), price-sensitive, utilitarian
> **Deadline**: ~2 hours (today + tomorrow)
> **Stakeholder**: Rajat → DK (David Kim, President of Verizon Value)

---

## 🎯 What We're Building

A **single-page conversational UI** that replaces the traditional options-driven shopping model with an **intent-first flow**:

```
Customer Problem/Intent
       ↓
Quick Action Pills (intent starters)
       ↓
AI asks clarifying questions (conversational)
       ↓
Visual Product/Plan Recommendation Card
       ↓
CTA: Upgrade Plan / Upgrade Phone / Talk to a Person
```

**Key Difference from current UX**: Instead of "Browse Plans → Select Options → Configure", the user says _"My data runs out before the month ends"_ and the AI consults with them and surfaces the right fix.

---

## 📋 Requirements Summary

### User Intents to Handle
1. **Data problem** — "My data runs out mid-month" / "My internet is slow"
2. **Phone problem** — "My phone is really slow" / "I want better camera quality"
3. **Storage problem** — "My phone is running out of memory"
4. **General cost concern** — "I want to pay less" / "What's the cheapest option?"
5. **Phone upgrade** — Intent discovered through conversation, not upfront selection
6. **Plan upgrade** — Most common recommendation for value customers

### Recommendation Outcomes
- **Plan upgrade** (e.g., "+$10/month → get 5GB more data")
- **Phone upgrade** (surfaced when problem is device-related)
- **Talk to a real person** (fallback/escalation)

---

## 🎨 Total Wireless Design Guidelines

> **Source**: July 2024 rebrand by design firm **Hugo Collective** for Total Wireless (formerly Total by Verizon). These guidelines must be applied to ALL UI components — pills, chat bubbles, cards, buttons, and header.

---

### Color Palette

The 2024 rebrand introduced a **proprietary teal** as the hero color, paired with a rich blue and bright yellow for energy, with red retained as the Verizon heritage anchor.

```css
:root {
  /* ── Primary Brand Colors ── */
  --tw-red:      #EE0000;   /* Verizon heritage red — CTAs, alerts, active states */
  --tw-teal:     #00B5AD;   /* Proprietary Total Wireless teal — primary identity, headers, pills */
  --tw-blue:     #003087;   /* Rich blue — secondary sections, trust signals */
  --tw-yellow:   #F7C948;   /* Bright yellow — highlights, badges, "Most Popular" tags */

  /* ── Neutral Palette ── */
  --tw-black:    #000000;   /* Primary text */
  --tw-gray-900: #1A1A1A;   /* Body text, headings */
  --tw-gray-600: #6B6B6B;   /* Secondary text, subtitles */
  --tw-gray-200: #E8E8E8;   /* Dividers, input borders */
  --tw-gray-100: #F5F5F5;   /* AI chat bubble background, card backgrounds */
  --tw-white:    #FFFFFF;   /* Page background, button text */

  /* ── Semantic Tokens ── */
  --color-primary:       var(--tw-teal);    /* Main brand — pills, header, send button */
  --color-cta:           var(--tw-red);     /* "Upgrade Now" CTA button */
  --color-accent:        var(--tw-yellow);  /* Badges, highlights, price callouts */
  --color-trust:         var(--tw-blue);    /* Plan features, checkmarks, trust UI */
  --color-bg:            var(--tw-white);
  --color-surface:       var(--tw-gray-100);
  --color-text-primary:  var(--tw-gray-900);
  --color-text-secondary:var(--tw-gray-600);
  --color-border:        var(--tw-gray-200);
}
```

**Color Usage Rules:**
- **Teal** (`#00B5AD`) — Header bar, pill borders/hover states, send button, AI avatar accent, active chat elements
- **Red** (`#EE0000`) — Primary "Upgrade Now" / "Get This Plan" CTA only; not overused
- **Yellow** (`#F7C948`) — "Most Popular" badge, price savings callout (e.g., "Save $10/mo"), notification dots
- **Blue** (`#003087`) — Feature checkmarks inside recommendation cards, "5G" badge, "Powered by Verizon" trust footer
- **Never** pair red + teal together in the same component — use one or the other per section

---

### Typography

Total Wireless (via Verizon lineage) uses a **clean, bold sans-serif** system. The current site uses a custom typeface; for prototype purposes, use the closest match:

```css
/* Font Stack */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  --font-primary: 'Inter', 'Neue Haas Grotesk', 'Helvetica Neue', Arial, sans-serif;
  --font-weight-regular: 400;
  --font-weight-medium:  500;
  --font-weight-semibold:600;
  --font-weight-bold:    700;
  --font-weight-black:   800;
}

/* Type Scale */
.type-hero     { font-size: 2rem;   font-weight: 800; line-height: 1.1; letter-spacing: -0.02em; }
.type-h2       { font-size: 1.5rem; font-weight: 700; line-height: 1.2; }
.type-h3       { font-size: 1.125rem; font-weight: 600; line-height: 1.3; }
.type-body     { font-size: 1rem;   font-weight: 400; line-height: 1.5; }
.type-small    { font-size: 0.875rem; font-weight: 400; line-height: 1.4; }
.type-label    { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; }
.type-price    { font-size: 1.75rem; font-weight: 800; color: var(--tw-gray-900); }
.type-price-mo { font-size: 0.875rem; font-weight: 500; color: var(--tw-gray-600); }
```

**Typography Rules:**
- Headings: **Black (800)** weight, tight letter-spacing — assertive, not delicate
- Body copy: Regular (400), 1.5 line-height — readable on mobile
- Price display: Always large + bold. Format as `$30` with `/mo` in smaller weight alongside
- CTA labels: All-caps or Sentence case (consistent — pick one per prototype)

---

### Iconography

Total Wireless uses **bold, filled icons** — not outline style. Think solid shapes, not line art.

```
Style:    Filled / Solid (NOT outline)
Weight:   Bold strokes
Corners:  Slightly rounded (not sharp, not perfectly circular)
Size:     24px default, 20px in pills, 32px in hero/feature areas
Color:    Inherit from parent or explicit brand color
```

**Recommended Icon Library**: [Phosphor Icons](https://phosphoricons.com/) — `fill` variant, OR [Heroicons](https://heroicons.com/) — `solid` variant.

```html
<!-- CDN for Phosphor Icons (fill style = matches TW brand) -->
<script src="https://unpkg.com/@phosphor-icons/web"></script>

<!-- Usage examples matching TW iconography style -->
<i class="ph-fill ph-cell-signal-high"></i>   <!-- Data/signal -->
<i class="ph-fill ph-device-mobile"></i>       <!-- Phone -->
<i class="ph-fill ph-hard-drive"></i>          <!-- Storage -->
<i class="ph-fill ph-camera"></i>              <!-- Photos -->
<i class="ph-fill ph-currency-dollar"></i>     <!-- Cost/pricing -->
<i class="ph-fill ph-warning-circle"></i>      <!-- Problem/issue -->
<i class="ph-fill ph-check-circle"></i>        <!-- Plan features -->
<i class="ph-fill ph-chat-circle-dots"></i>    <!-- Chat/conversation -->
```

---

### Component Styles

#### Header
```css
.header {
  background: var(--tw-teal);      /* Teal brand bar */
  color: var(--tw-white);
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}

/* Logo: white version on teal background */
/* Tagline: "Powered by Verizon" in small white text below logo */
```

#### Intent Pills
```css
.pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border-radius: 100px;             /* Full pill */
  border: 2px solid var(--tw-teal);
  background: var(--tw-white);
  color: var(--tw-gray-900);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pill:hover, .pill.active {
  background: var(--tw-teal);
  color: var(--tw-white);
  border-color: var(--tw-teal);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 181, 173, 0.3);
}
```

#### Chat Bubbles
```css
/* User bubble — right side */
.bubble-user {
  background: var(--tw-teal);
  color: var(--tw-white);
  border-radius: 18px 18px 4px 18px;  /* Pointy bottom-right */
  padding: 12px 16px;
  max-width: 75%;
  margin-left: auto;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* AI bubble — left side */
.bubble-ai {
  background: var(--tw-gray-100);
  color: var(--tw-gray-900);
  border-radius: 18px 18px 18px 4px;  /* Pointy bottom-left */
  padding: 12px 16px;
  max-width: 80%;
  font-size: 0.95rem;
  line-height: 1.5;
  border: 1px solid var(--tw-gray-200);
}

/* AI avatar — small Total Wireless logo mark beside bubble */
.ai-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--tw-teal);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
```

#### Recommendation Card
```css
.rec-card {
  background: var(--tw-white);
  border: 2px solid var(--tw-teal);
  border-radius: 16px;
  padding: 20px;
  margin: 8px 0;
  box-shadow: 0 4px 20px rgba(0, 181, 173, 0.15);
  max-width: 340px;
}

.rec-card-header {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--tw-teal);
  margin-bottom: 12px;
}

.rec-card-name {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--tw-gray-900);
}

.rec-card-price {
  font-size: 2rem;
  font-weight: 800;
  color: var(--tw-gray-900);
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.rec-card-price span {   /* "/mo" suffix */
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--tw-gray-600);
}

.rec-card-badge {         /* "Most Popular" or "Best Value" */
  background: var(--tw-yellow);
  color: var(--tw-gray-900);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 100px;
  letter-spacing: 0.04em;
}

.rec-card-feature {       /* ✓ feature item */
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: var(--tw-gray-900);
  padding: 4px 0;
}

.rec-card-feature .check {
  color: var(--tw-blue);   /* Blue checkmarks */
  font-size: 1rem;
}

.rec-card-reason {        /* "Why this solves your problem" */
  background: rgba(0, 181, 173, 0.08);
  border-left: 3px solid var(--tw-teal);
  border-radius: 0 8px 8px 0;
  padding: 8px 12px;
  font-size: 0.85rem;
  color: var(--tw-gray-900);
  margin: 12px 0;
  font-style: italic;
}

/* CTA buttons */
.btn-primary {
  background: var(--tw-red);
  color: var(--tw-white);
  border: none;
  border-radius: 8px;
  padding: 13px 20px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  letter-spacing: 0.01em;
  transition: background 0.2s;
}

.btn-primary:hover { background: #CC0000; }

.btn-secondary {
  background: transparent;
  color: var(--tw-teal);
  border: 2px solid var(--tw-teal);
  border-radius: 8px;
  padding: 11px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 8px;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: var(--tw-teal);
  color: var(--tw-white);
}
```

#### Input Bar
```css
.input-bar {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--tw-gray-200);
  background: var(--tw-white);
  position: sticky;
  bottom: 0;
}

.input-field {
  flex: 1;
  border: 2px solid var(--tw-gray-200);
  border-radius: 100px;
  padding: 10px 18px;
  font-size: 0.95rem;
  font-family: var(--font-primary);
  outline: none;
  transition: border-color 0.2s;
}

.input-field:focus {
  border-color: var(--tw-teal);
}

.btn-send {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--tw-teal);
  color: var(--tw-white);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s, transform 0.1s;
}

.btn-send:hover { background: #009991; transform: scale(1.05); }
```

#### Typing Indicator
```css
.typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 14px 16px;
  background: var(--tw-gray-100);
  border-radius: 18px 18px 18px 4px;
  width: fit-content;
  border: 1px solid var(--tw-gray-200);
}

.typing-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--tw-teal);
  animation: bounce 1.2s infinite;
}

.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
  40%            { transform: translateY(-6px); opacity: 1; }
}
```

---

### Layout & Spacing

```css
/* Spacing scale (8px base unit) */
:root {
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  16px;
  --space-lg:  24px;
  --space-xl:  40px;
  --space-2xl: 64px;
}

/* Border radius scale */
:root {
  --radius-sm:   6px;
  --radius-md:   12px;
  --radius-lg:   16px;
  --radius-xl:   24px;
  --radius-pill: 100px;
  --radius-full: 9999px;
}

/* Max content width */
.page-container {
  max-width: 480px;        /* Mobile-first — this is a prepay mobile brand */
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--tw-white);
}
```

---

### Brand Voice in UI Copy

All UI strings should match Total Wireless's voice: **direct, helpful, no jargon, price-positive**.

| Context | Do | Don't |
|---------|-----|-------|
| Hero headline | "What can we help you with today?" | "Explore Our Solutions" |
| Pill labels | "My data runs out" | "Data Management Issues" |
| AI greeting | "Hey! Tell me what's going on with your phone or plan." | "Welcome to Total Wireless Support." |
| Recommendation intro | "Here's what we think will fix it:" | "Based on your inputs, we recommend:" |
| Price framing | "Only $40/mo — that's it, guaranteed." | "Starting at $39.99/month plus taxes" |
| CTA | "Get This Plan" | "Proceed to Checkout" |
| Escalation | "Talk to a real person" | "Contact Customer Support" |

---

## 🗂 Tech Stack Decision

| Layer | Choice | Reason |
|-------|--------|--------|
| Frontend | Vanilla HTML/CSS/JS (single file) | Fastest to prototype, shareable via link |
| AI | Claude API (`claude-sonnet-4-5`) | Best conversational quality, easy to prompt |
| Product data | Hardcoded JSON (from site analysis) | No backend needed for prototype |
| Icons | Phosphor Icons (fill/solid via CDN) | Matches TW bold filled icon style |
| Font | Inter via Google Fonts | Closest free match to TW sans-serif |
| Hosting | Vercel / Netlify / GitHub Pages | Free, instant shareable link |

> **Note**: If you prefer React, a single `.jsx` file also works. Stick to one file for speed.

---

## ⏱ Phase-by-Phase Workflow

---

### Phase 1 — Research & Product Data (20 min)

**Goal**: Extract Total Wireless plans, phones, and brand palette. This becomes the AI's knowledge base.

#### Step 1.1 — Scrape Total Wireless site
Ask Claude Code:
```
Visit totalwireless.com and extract:
1. All current prepay plans (name, price/month, data, talk, text, features)
2. Top 5–8 phones available (name, price, key specs: camera, storage, RAM)
3. Confirm the primary teal color and logo URL from the page source
```

#### Step 1.2 — Structure as JSON
Claude Code should produce a `products.js` file:
```js
const PLANS = [
  {
    id: "basic-30",
    name: "Basic Plan",
    price: 30,
    data: "5GB",
    talk: "Unlimited",
    text: "Unlimited",
    highlight: "Best for light users",
    solves: ["cost", "first-time"],
    badge: null
  },
  {
    id: "value-40",
    name: "Value Plan",
    price: 40,
    data: "10GB",
    talk: "Unlimited",
    text: "Unlimited",
    highlight: "Best for moderate data users",
    solves: ["data-runs-out", "slow-data"],
    badge: "Most Popular"
  },
  // ... etc.
];

const PHONES = [
  {
    id: "moto-g-power",
    name: "Moto G Power",
    price: 99,
    camera: "50MP",
    storage: "128GB",
    battery: "5000mAh",
    highlight: "Best battery life",
    solves: ["battery", "slow-phone"],
    image_url: "..."
  },
  // ...
];

// ── Brand tokens (pre-filled from design guidelines above) ──
const BRAND = {
  teal:        "#00B5AD",
  red:         "#EE0000",
  blue:        "#003087",
  yellow:      "#F7C948",
  black:       "#000000",
  white:       "#FFFFFF",
  gray100:     "#F5F5F5",
  font:        "'Inter', 'Helvetica Neue', Arial, sans-serif",
  logo_url:    "https://www.totalwireless.com/assets/images/logo.svg" // confirm from site
};
```

> **Tip**: Use `fetch` + `cheerio` (Node) or browser tools to extract. Then manually verify prices are current.

---

### Phase 2 — System Prompt Engineering (15 min)

**Goal**: Write the Claude system prompt that powers the conversation.

#### Step 2.1 — Core System Prompt Template

```
You are a friendly Total Wireless advisor helping value customers solve their phone or plan problems.

YOUR ROLE:
- Listen to the customer's problem or challenge (NOT what they want to buy)
- Ask 1–2 short clarifying questions to understand their situation
- Recommend the best-fit plan upgrade or phone upgrade from the catalog below
- Always lead with SOLVING THEIR PROBLEM, not upselling

CUSTOMER PROFILE:
- Budget-conscious prepay customers ($30–$50/month range)
- They care about price first, features second
- They are NOT loyal to Verizon brand — they chose Total for cost
- They want their problem solved, not a sales pitch

BRAND VOICE:
- Direct, warm, no jargon
- Always frame upgrades as "only $X more" not "upgrade to our premium tier"
- Never say "based on your inputs" — say "sounds like" or "it seems like"

CONVERSATION RULES:
1. Never ask more than 2 questions before making a recommendation
2. Keep responses SHORT — 2–3 sentences max before asking a question
3. When recommending, always explain HOW it solves their specific problem
4. Format recommendations as JSON at the end of your response like:
   [RECOMMENDATION]{"type":"plan","id":"value-40","reason":"5 more GB will stop the mid-month shortage"}[/RECOMMENDATION]
5. If you can't determine a recommendation, suggest talking to a real person

PRODUCT CATALOG:
[Insert PLANS and PHONES JSON here]
```

#### Step 2.2 — Intent Pills Mapping
```js
const INTENT_PILLS = [
  { id: "slow-data",   label: "My internet is slow",         icon: "ph-cell-signal-slash", prompt: "My data speed has been really slow lately." },
  { id: "runs-out",    label: "I run out of data",           icon: "ph-battery-empty",      prompt: "I always run out of data before the end of the month." },
  { id: "slow-phone",  label: "My phone feels slow",         icon: "ph-snail",              prompt: "My phone has been really sluggish and slow lately." },
  { id: "storage",     label: "Running out of storage",      icon: "ph-hard-drive",         prompt: "My phone says I'm running out of storage space." },
  { id: "camera",      label: "I want better photos",        icon: "ph-camera",             prompt: "I want to take better quality pictures." },
  { id: "cost",        label: "I want to spend less",        icon: "ph-currency-dollar",    prompt: "I'm looking for the cheapest option that still works well." },
  { id: "new-phone",   label: "I need a new phone",          icon: "ph-device-mobile",      prompt: "I'm thinking about getting a new phone." },
  { id: "not-working", label: "Something isn't working",     icon: "ph-warning-circle",     prompt: "Something on my phone or plan isn't working right." }
];
```

---

### Phase 3 — Build the UI (45 min)

**Goal**: Single `index.html` using the design guidelines above.

#### Step 3.1 — HTML Structure

```
<html>
  <head>
    Google Fonts (Inter)
    Phosphor Icons CDN
    <style> ← all CSS from Design Guidelines section above
  </head>
  <body>
    <div class="page-container">
      <header class="header">
        Logo (white SVG) + "Powered by Verizon" tagline
      </header>

      <!-- LANDING STATE -->
      <section id="landing">
        <h1 class="type-hero">What can we help you with today?</h1>
        <p class="type-body">Tell us what's going on — we'll find the right fix.</p>
        <div class="pills-grid">
          <!-- 8 pills from INTENT_PILLS, 2-col on mobile, 4-col on desktop -->
        </div>
        <p class="type-small">Or type your question below ↓</p>
        <div class="input-bar"> ← always visible </div>
      </section>

      <!-- CHAT STATE (hidden initially) -->
      <section id="chat" hidden>
        <div class="messages-list">
          <!-- Bubbles injected here -->
          <!-- Typing indicator injected here -->
        </div>
        <div class="input-bar"> ← sticky bottom </div>
      </section>
    </div>
  </body>
</html>
```

#### Step 3.2 — Recommendation Card Template

```html
<!-- Injected into .messages-list as an AI message -->
<div class="bubble-ai-wrapper">
  <div class="ai-avatar"><!-- TW logo mark --></div>
  <div class="rec-card">
    <div class="rec-card-header">✦ We recommend</div>

    <div style="display:flex; justify-content:space-between; align-items:start;">
      <div class="rec-card-name">${plan.name}</div>
      <span class="rec-card-badge">${plan.badge}</span>
    </div>

    <div class="rec-card-price">
      $${plan.price}<span>/mo</span>
    </div>

    <div class="rec-card-reason">"${rec.reason}"</div>

    <div class="rec-card-features">
      <div class="rec-card-feature"><i class="ph-fill ph-check-circle check"></i> ${plan.data} High-Speed Data</div>
      <div class="rec-card-feature"><i class="ph-fill ph-check-circle check"></i> Unlimited Talk & Text</div>
      <div class="rec-card-feature"><i class="ph-fill ph-check-circle check"></i> On Verizon's 5G Network</div>
    </div>

    <button class="btn-primary">Get This Plan</button>
    <button class="btn-secondary">See All Plans</button>
  </div>
</div>
```

#### Step 3.3 — State Machine

```js
const STATE = {
  LANDING: 'landing',
  CHATTING: 'chatting',
  RECOMMENDED: 'recommended'
};

// Transitions
// LANDING → CHATTING: pill click or user types message
// CHATTING → RECOMMENDED: AI response contains [RECOMMENDATION] block
// RECOMMENDED → CHATTING: user continues typing
```

---

### Phase 4 — Claude API Integration (20 min)

#### Step 4.1 — API Call Function

```js
const CLAUDE_API_KEY = 'YOUR_KEY_HERE';

async function sendMessage(conversationHistory) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: conversationHistory
    })
  });
  return response.json();
}
```

> ⚠️ **CORS Note**: Direct browser→Anthropic calls fail in production. Use one of:
> - Cloudflare Worker (5 min, free tier — see below)
> - Vercel Edge Function
> - Node/Express local backend

#### Step 4.2 — Cloudflare Worker Proxy

```js
// worker.js — deploy to Cloudflare Workers (free tier)
export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    const body = await request.json();
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    return new Response(JSON.stringify(data), { headers: corsHeaders });
  }
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};
```

#### Step 4.3 — Response Parser

```js
function parseAIResponse(text) {
  const recMatch = text.match(/\[RECOMMENDATION\](.*?)\[\/RECOMMENDATION\]/s);
  return {
    message: text.replace(/\[RECOMMENDATION\].*?\[\/RECOMMENDATION\]/s, '').trim(),
    recommendation: recMatch ? JSON.parse(recMatch[1]) : null
  };
}
```

---

### Phase 5 — Recommendation Renderer (10 min)

```js
function renderRecommendationCard(rec) {
  const item = rec.type === 'plan'
    ? PLANS.find(p => p.id === rec.id)
    : PHONES.find(p => p.id === rec.id);

  if (rec.type === 'plan') {
    return `
      <div class="rec-card">
        <div class="rec-card-header">✦ We recommend</div>
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:4px;">
          <span class="rec-card-name">${item.name}</span>
          ${item.badge ? `<span class="rec-card-badge">${item.badge}</span>` : ''}
        </div>
        <div class="rec-card-price">$${item.price}<span>/mo</span></div>
        <div class="rec-card-reason">"${rec.reason}"</div>
        <div class="rec-card-features">
          <div class="rec-card-feature"><i class="ph-fill ph-check-circle check"></i> ${item.data} High-Speed Data</div>
          <div class="rec-card-feature"><i class="ph-fill ph-check-circle check"></i> Unlimited Talk & Text</div>
          <div class="rec-card-feature"><i class="ph-fill ph-check-circle check"></i> On Verizon's 5G Network</div>
        </div>
        <button class="btn-primary" onclick="alert('Upgrade flow goes here')">Get This Plan</button>
        <button class="btn-secondary">See All Plans</button>
      </div>
    `;
  }
  // phone card: show name, price, camera, storage specs
}
```

---

### Phase 6 — Hosting & Shareable Link (10 min)

**Option A — Vercel (Recommended)**
```bash
npm i -g vercel
vercel --yes
# → https://your-project.vercel.app
```

**Option B — Netlify Drop**
1. Go to netlify.com/drop
2. Drag project folder
3. Instant link

**Option C — GitHub Pages**
```bash
git init && git add . && git commit -m "init"
gh repo create intent-driven-ex --public --push
# Enable: Settings → Pages → main branch
```

---

## 📁 Final File Structure

```
intent-driven-ex/
├── index.html      ← Full UI (all CSS + JS inline or linked)
├── products.js     ← Plans, phones, BRAND tokens
├── api.js          ← Claude API + response parser
├── worker.js       ← Cloudflare Worker proxy
└── README.md
```

---

## 🧪 Test Scenarios

| User Intent | Expected AI Questions | Expected Recommendation |
|---|---|---|
| "I run out of data mid-month" | How much data on current plan? When do you usually run out? | Plan upgrade with more data |
| "My phone is really slow" | How old is your phone? Slow on apps or internet too? | Phone upgrade OR plan upgrade |
| "I want better photos" | What kind of photos — outdoor, low light? | Phone with better camera |
| "I want to spend less" | What features do you actually use most? | Most efficient plan for their use |
| "Running out of storage" | What's taking up space — photos, apps? | Phone with more storage |

---

## 💡 Claude Code Prompts (Copy-Paste Sequence)

**Prompt 1 — Product data:**
```
Visit totalwireless.com and create products.js with: all current prepay plans (name, price, data, talk, text), top 5 phones (name, price, camera, storage), and confirm the teal hex color from the page CSS. Structure as PLANS[], PHONES[], and BRAND{} constants.
```

**Prompt 2 — Full UI:**
```
Build a single index.html for a Total Wireless intent-driven conversational experience. Use these exact brand colors: teal #00B5AD, red #EE0000, blue #003087, yellow #F7C948. Load Inter font from Google Fonts and Phosphor Icons (fill style) via CDN. Landing state shows 8 intent pills in a 2-col grid. Clicking a pill transitions to a chat UI. Use teal for the header bar and pill borders, red only for the primary CTA button. Chat bubbles: user = teal background, AI = light gray. Include a typing indicator with bouncing teal dots.
```

**Prompt 3 — AI integration:**
```
Wire up Claude API (claude-sonnet-4-5) to index.html. System prompt: [paste Phase 2 prompt]. Maintain conversationHistory array. Parse [RECOMMENDATION] blocks from responses. When recommendation is found, render a product card with the rec-card CSS class using teal border, blue checkmarks, and a red "Get This Plan" button.
```

**Prompt 4 — CORS proxy:**
```
Create a Cloudflare Worker (worker.js) to proxy requests to the Anthropic API with CORS headers. Use env.ANTHROPIC_API_KEY. Update index.html to call the worker URL instead of calling Anthropic directly.
```

**Prompt 5 — Deploy:**
```
Deploy to Vercel, set ANTHROPIC_API_KEY as an environment variable, and give me the shareable URL.
```

---

## 🚦 Go/No-Go Checklist

- [ ] Teal header bar with Total Wireless logo visible
- [ ] 8 intent pills with Phosphor icons render in grid
- [ ] Pills transition to chat on click (teal → white fill animation)
- [ ] AI responds conversationally with 1–2 follow-up questions
- [ ] Typing indicator (bouncing teal dots) shows while AI responds
- [ ] Recommendation card renders with teal border, price, feature checkmarks
- [ ] Red "Get This Plan" CTA button visible on card
- [ ] Yellow badge shows on "Most Popular" plan
- [ ] Responsive on mobile (max-width 480px)
- [ ] No console errors
- [ ] Shareable link works without login

---

## 📌 Key Talking Points for Rajat Demo

1. **Intent-first, not options-first** — Customer describes their problem, not what they want to buy
2. **Conversational consulting** — AI asks questions like a real advisor, max 2 before recommending
3. **Visual recommendation** — Result looks like a real product card, not a text dump
4. **Value customer-specific** — Framing is "only $10 more" not "premium tier"
5. **Brand-authentic** — Teal, bold sans-serif, filled icons match the 2024 rebrand
6. **Scalable vision** — Same pattern extends to plan management, device support, and upgrades across all Verizon Value segments

---

*Built for Rajat / David Kim (Verizon Value) — Intent Driven Experience Prototype*
*Brand: Total Wireless 2024 rebrand by Hugo Collective — teal #00B5AD, red #EE0000, blue #003087, yellow #F7C948*
