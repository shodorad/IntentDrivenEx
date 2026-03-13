# Claude Code Prompt — Total Wireless Intent-Driven Experience
## Copy the full prompt below and paste it into Claude Code

---

```
Build a single-file desktop web app (index.html) for Total Wireless — a conversational intent-driven advisor that replaces traditional plan/phone browsing with an AI chat experience. The layout and feel should closely resemble Perplexity AI or Claude.ai: a clean two-panel desktop layout with a left sidebar and a main content area that is a full chat thread.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAYOUT — DESKTOP (Perplexity-style)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall structure:
  ┌──────────────────────────────────────────────────────┐
  │  LEFT SIDEBAR (260px fixed)  │  MAIN CHAT AREA        │
  │  ─────────────────────────── │  ───────────────────── │
  │  [TW Logo]                   │  [Message thread]      │
  │  "Powered by Verizon"        │                        │
  │                              │                        │
  │  ── New Conversation ──      │  (scrollable)          │
  │  [+ New Chat] button         │                        │
  │                              │                        │
  │  ── Common Questions ──      │                        │
  │  • My data runs out          │                        │
  │  • My phone is slow          │                        │
  │  • I want better photos      │                        │
  │  • I want to spend less      │                        │
  │  • I need a new phone        │                        │
  │  • Something isn't working   │  ─────────────────     │
  │                              │  [Input bar — fixed]   │
  │  ── Footer ──                │                        │
  │  "5-Year Price Guarantee"    │                        │
  └──────────────────────────────────────────────────────┘

Sidebar (left, 260px, fixed height 100vh):
- Background: #1A1A1A (dark, like Claude/Perplexity sidebar)
- Total Wireless logo text: bold white, 18px
- "Powered by Verizon" below logo: #888, 11px
- "New Chat" button: teal #00B5AD background, white text, full width, rounded, 40px height
- Section label "Common Questions": #888, 11px uppercase, letter-spacing
- Sidebar links: white 14px, hover = teal tint background (#00B5AD18), padding 8px 12px, border-radius 6px, truncate overflow
- Bottom footer: small text, teal accent, "5-Year Price Lock Guarantee ✓"

Main chat area (flex-1, full height):
- Background: #FFFFFF
- Max-width: 780px, centered within the main panel
- Padding: 0 24px
- Display: flex, flex-direction: column, height: 100vh

LANDING STATE (shown when no conversation started):
- Centered vertically in main area
- Large heading: "What can we help you with today?" — 2.4rem, font-weight 800, color #1A1A1A
- Sub-heading: "Tell us what's going on — we'll find the right fix." — 1rem, color #6B6B6B
- Below that: 2-column grid of 8 intent pills (same as existing prototype)
- Pill style: teal border (#00B5AD), white bg, teal icon + label, hover = teal fill
- Below pills: "Or describe your situation in the box below"
- Input bar anchored to bottom of viewport (same as chat state)

CHAT STATE (after user sends first message):
- Landing content slides away (fade out)
- Messages render from top to bottom in the scrollable thread
- Newest message always scrolls into view
- Input bar stays fixed at bottom of main panel

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAT MESSAGE COMPONENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

User message:
  - Full-width row, right-aligned content
  - Small label above: "You" in #6B6B6B, 12px
  - Bubble: teal #00B5AD background, white text, border-radius 18px 18px 4px 18px
  - Max-width 65%

AI message:
  - Full-width row, left-aligned content
  - Row starts with a 32px circular avatar: teal bg, white "TW" initials or logo mark
  - Label: "Total Wireless Advisor" in #6B6B6B 12px next to avatar
  - Message text below avatar row: plain #1A1A1A, 15px, line-height 1.6
  - No bubble background — text sits on white like Claude/Perplexity
  - Max-width 80%

Typing indicator (while AI is responding):
  - Same row position as AI message
  - Three dots: 8px circles, color #00B5AD, bounce animation staggered 0.2s
  - Wrap in the same avatar row layout

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INPUT BAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fixed to bottom of main content area. Styled like Claude.ai's input:
- Background: white
- Border-top: 1px solid #E8E8E8
- Inner container: max-width 780px, centered, padding 16px 24px
- Textarea (not input): auto-grows up to 5 lines, then scrolls
  - Border: 2px solid #E8E8E8, border-radius: 14px
  - Padding: 14px 52px 14px 18px (right padding for send button)
  - Font: 15px Inter
  - Focus: border-color: #00B5AD, box-shadow: 0 0 0 3px rgba(0,181,173,0.12)
  - Placeholder: "Ask anything about your phone or plan..."
- Send button: absolute inside textarea, bottom-right
  - 36px circle, teal background, white arrow icon
  - Disabled state: gray #D0D0D0 when textarea is empty
- Below textarea: small text "#00B5AD ✓ 5-Year Price Guarantee on all plans" centered, 12px

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDATION CARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Rendered inline as part of an AI message (after the text explanation), like how Perplexity renders source cards mid-response:

┌─────────────────────────────────────────────┐
│ ✦ WE RECOMMEND            [Most Popular]🟡  │
│                                             │
│  Value Plan                    $40 /mo      │
│                                             │
│  "This gives you 5GB more data — enough    │
│   to cover your mid-month shortage."        │
│                                             │
│  ✓ 10GB High-Speed Data                    │
│  ✓ Unlimited Talk & Text                   │
│  ✓ On Verizon's 5G Network                 │
│  ✓ Price locked for 5 years                │
│                                             │
│  [  Get This Plan  ]  [ See All Plans ]    │
└─────────────────────────────────────────────┘

Card CSS:
- background: white
- border: 2px solid #00B5AD
- border-radius: 16px
- padding: 20px 24px
- margin-top: 16px
- box-shadow: 0 4px 24px rgba(0, 181, 173, 0.12)
- max-width: 440px

Header row: "✦ WE RECOMMEND" in #00B5AD, 11px, font-weight 700, uppercase, letter-spacing 0.1em
Badge: background #F7C948, color #1A1A1A, 11px, font-weight 700, padding 2px 10px, border-radius 100px

Plan name: 1.2rem, font-weight 800, #1A1A1A
Price: 2rem, font-weight 800, "/mo" in 0.875rem #6B6B6B

Reason block (italic quote):
- background: rgba(0,181,173,0.07)
- border-left: 3px solid #00B5AD
- border-radius: 0 8px 8px 0
- padding: 10px 14px
- font-style: italic
- font-size: 0.9rem
- margin: 14px 0

Feature list:
- Each feature: flex row, gap 8px
- Check icon: ph-fill ph-check-circle, color #003087 (blue), 16px
- Text: 0.875rem #1A1A1A

Buttons:
- "Get This Plan": full-width, background #EE0000, white text, font-weight 700, border-radius 8px, 44px height
- "See All Plans": full-width, border 2px solid #00B5AD, teal text, transparent bg, border-radius 8px, 40px height, margin-top 8px

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRODUCT DATA (hardcode these plans + phones)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const PLANS = [
  { id:"basic-35", name:"Basic Plan", price:35, data:"5GB", talk:"Unlimited", text:"Unlimited", badge:null, highlight:"Best for light users", solves:["cost","light-use"] },
  { id:"value-50", name:"Value Plan", price:50, data:"15GB", talk:"Unlimited", text:"Unlimited", badge:"Most Popular", highlight:"Best for everyday users", solves:["data-runs-out","slow-data"] },
  { id:"unlimited-60", name:"Unlimited Plan", price:60, data:"Unlimited", talk:"Unlimited", text:"Unlimited", badge:"Best Value", highlight:"No data limits ever", solves:["data-runs-out","heavy-use","slow-data"] }
];

const PHONES = [
  { id:"moto-g-power", name:"Motorola Moto G Power", price:89, camera:"50MP", storage:"128GB", battery:"5000mAh", badge:"Best Battery", highlight:"Lasts 2 days per charge", solves:["slow-phone","battery"] },
  { id:"samsung-a15", name:"Samsung Galaxy A15", price:119, camera:"50MP", storage:"128GB", battery:"5000mAh", badge:null, highlight:"Crisp display, reliable performance", solves:["slow-phone","camera"] },
  { id:"moto-g-stylus", name:"Motorola Moto G Stylus", price:149, camera:"50MP", storage:"256GB", battery:"5000mAh", badge:"Most Storage", highlight:"Built-in stylus, massive storage", solves:["storage","camera","slow-phone"] }
];

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AI SYSTEM PROMPT (use this exactly)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const SYSTEM_PROMPT = `
You are a friendly Total Wireless advisor helping budget-conscious prepay customers solve problems with their phone or plan.

ROLE:
- Understand the customer's problem first — never lead with a product
- Ask at most 2 short clarifying questions before recommending
- Recommend the best-fit plan or phone from the catalog, explaining exactly how it solves their problem

CUSTOMER PROFILE:
- Prepay customers on $30-60/month plans
- Price is their #1 priority — they are NOT brand loyal
- They want their problem solved at the lowest necessary cost
- Frame everything as "only $X more" not "premium tier"

CONVERSATION RULES:
1. Max 2 clarifying questions before recommending
2. Responses are short — 2-3 sentences, then a question OR recommendation
3. Never say "based on your inputs" — say "sounds like" or "it seems like"
4. When ready to recommend, append this exact block at the END of your response:
   [RECOMMENDATION]{"type":"plan","id":"value-50","reason":"15GB will comfortably cover your mid-month data gap"}[/RECOMMENDATION]
   OR for phones:
   [RECOMMENDATION]{"type":"phone","id":"moto-g-stylus","reason":"256GB storage will solve your space problem for years"}[/RECOMMENDATION]
5. If unable to determine, respond with:
   [RECOMMENDATION]{"type":"human","reason":"This needs a specialist — let me connect you with a real person"}[/RECOMMENDATION]

PRODUCT CATALOG:
Plans: Basic $35/5GB, Value $50/15GB, Unlimited $60/unlimited
Phones: Moto G Power $89/128GB, Samsung A15 $119/128GB, Moto G Stylus $149/256GB

BRAND VOICE: Direct, warm, no jargon. Price-positive. Utilitarian. Like a knowledgeable friend, not a salesperson.
`;

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLAUDE API INTEGRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Use Anthropic API: POST https://api.anthropic.com/v1/messages
- Model: claude-sonnet-4-5
- Max tokens: 600
- API key: read from a <meta name="api-key"> tag OR a const API_KEY = '' at top of script (leave blank, user will fill in)
- If API key is empty or missing, run in DEMO MODE:
  - Show yellow banner: "Demo Mode — Simulated AI responses (no API key configured)"
  - Use hardcoded simulated responses that demonstrate the conversation flow and recommendation card

DEMO MODE simulated flows (cycle through these based on which pill was clicked):
  - "data runs out" → AI asks about current plan → AI recommends Value Plan ($50)
  - "phone slow" → AI asks about phone age → AI recommends Moto G Power
  - "storage" → AI asks what's taking space → AI recommends Moto G Stylus
  - Default: generic clarifying question → recommend Value Plan

Conversation history: maintain as array of {role, content} objects, send full history each API call.

Response parsing:
  function parseResponse(text) {
    const match = text.match(/\[RECOMMENDATION\](.*?)\[\/RECOMMENDATION\]/s);
    return {
      message: text.replace(/\[RECOMMENDATION\].*?\[\/RECOMMENDATION\]/s, '').trim(),
      recommendation: match ? JSON.parse(match[1]) : null
    };
  }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FONTS + ICONS (CDN, no npm)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="https://unpkg.com/@phosphor-icons/web"></script>

Use Phosphor Icons fill/solid variant throughout. Key icons:
- ph-fill ph-cell-signal-slash — slow data
- ph-fill ph-battery-empty — runs out of data
- ph-fill ph-hourglass — slow phone
- ph-fill ph-hard-drive — storage
- ph-fill ph-camera — photos
- ph-fill ph-currency-dollar — cost
- ph-fill ph-device-mobile — new phone
- ph-fill ph-warning-circle — not working
- ph-fill ph-check-circle — feature checkmarks (color: #003087)
- ph-fill ph-paper-plane-tilt — send button
- ph-fill ph-plus — new chat
- ph-fill ph-chat-circle-dots — sidebar link icon

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STATE MANAGEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const state = {
  mode: 'landing',       // 'landing' | 'chatting'
  messages: [],          // [{role, content, recommendation?}]
  isLoading: false,
  activeIntent: null     // which pill was clicked
};

Transitions:
- landing → chatting: user clicks pill OR submits text in input
- On pill click: immediately add user message with pill's prompt text, then call AI
- On text submit: add user message with typed text, then call AI
- "New Chat" button: reset state to landing, clear messages

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESPONSIVENESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Desktop (>768px): two-panel layout as described above
Mobile (<768px):
  - Sidebar hidden (hamburger menu icon in header to show/hide)
  - Full-width single column
  - Same layout as existing prototype screenshot

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DELIVER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A single index.html file with all CSS and JS inline. No external files, no build step.
After creating it, open it in the browser and take a screenshot so I can verify it looks correct.
The API_KEY constant should be empty string by default so it runs in demo mode immediately.
```
