# ClearPath AI — Brand Guidelines
> **This is the single source of truth for all UI work.**
> Every component, every card, every color decision must reference and comply with these rules before code is written or merged.

---

## 1. Color Tokens

These are the only colors permitted in the UI. No hex values may appear in code that are not in this table.

| Token | Hex | Usage |
|---|---|---|
| `--navy-primary` | `#0D2137` | Primary CTAs, user chat bubbles, plan tile background, dark cards, nav |
| `--navy-light` | `#162E4A` | Hover states, gradient endpoints, secondary dark surfaces |
| `--teal-interaction` | `#00B5AD` | Interactive accents, teal CTAs, AI label, data good-state, active indicators |
| `--teal-light` | `#5BEBE4` | Badges on dark backgrounds, highlight text on navy, icon tints on dark surfaces |
| `--brand-red` | `#CC0000` | **Logo only. Never use for UI elements, backgrounds, or text.** |
| `--critical` | `#DC3545` | Critical alerts, low-data state, error messages, danger buttons |
| `--critical-dark` | `#C0202F` | Critical headline text on light backgrounds |
| `--warning` | `#FFC107` | Warning alerts, mid-data state, renewal urgency |
| `--warning-dark` | `#9A6B00` | Warning headline text on light backgrounds |
| `--success` | `#28A745` | Payment confirmed, positive state, online indicator dots |
| `--info-dark` | `#007A72` | Info headline text on light backgrounds |
| `--page-bg` | `#F1F3F5` | Main body/page background only |
| `--surface` | `#FFFFFF` | Card backgrounds, chat bubbles, inputs, modals |
| `--text-primary` | `#1A1A2E` | Headlines and high-emphasis text |
| `--text-body` | `#374151` | Body copy, descriptions, labels |
| `--text-muted` | `#6B7280` | Sub-labels, meta text, helper text — **minimum muted gray. `#9ca3af` is banned.** |
| `--border-subtle` | `rgba(0,0,0,0.05)` | Card borders on white surfaces |

### Hard Rules
- `#9ca3af` is **banned** in all CSS and JSX. It fails WCAG AA on white. Replace with `--text-muted` (`#6B7280`).
- `--brand-red` (`#CC0000`) appears **only on the Total Wireless logo SVG**. Never on buttons, alerts, backgrounds, or text.
- `--teal-interaction` is reserved for **interactive and AI-branded elements only**. Do not use it as a full card background — it overwhelms hierarchy.

---

## 2. Typography

**Font:** Inter. System fallback: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`.
**Rendering:** Always set `-webkit-font-smoothing: antialiased`.

| Role | Size | Weight | Letter Spacing | Notes |
|---|---|---|---|---|
| Hero headline | 36px | 800 | -0.02em | Landing screen title |
| Section title | 22–28px | 800 | -0.02em | Dashboard section headers |
| Card title / plan name | 14–17px | 700–800 | default | |
| Body copy | 14px | 400 | default | |
| Small / meta | 12px | 500 | default | |
| Section label | 11px | 700 | 0.12em | ALL CAPS |
| Tile label | 10px | 700 | 0.08em | ALL CAPS |
| Data number (large) | 22–26px | 800 | default | Ring values, renewal days, reward points |

### Hard Rules
- Minimum font size for **any visible text** is **10px**.
- Section labels and tile labels must always be **uppercase + letter-spaced**.
- Never use font-weight below 500 for interactive labels or card metadata.

---

## 3. Elevation & Shadows

Never use a single-layer `box-shadow`. Always use **compound shadows** (tight contact layer + soft diffused layer).

| Level | CSS | Use |
|---|---|---|
| 0 — Flat | `border: 1px solid rgba(0,0,0,0.05)` | Borderless sections, dividers |
| 1 — Resting | `0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)` | All cards at rest |
| 2 — Hover | `0 2px 6px rgba(0,0,0,0.06), 0 8px 20px rgba(0,0,0,0.05)` | Card hover state |
| 3 — Floating | `0 4px 12px rgba(0,0,0,0.08), 0 16px 40px rgba(0,0,0,0.08)` | Modals, dropdowns, iPhone SMS overlay |
| Glass inset | add `inset 0 1px 0 rgba(255,255,255,0.9)` | Glassmorphism cards (alert cards) |

### Hard Rule
A single `box-shadow: 0 1px 5px rgba(0,0,0,0.07)` is **not acceptable**. It looks cheap. Use Level 1 compound shadow at minimum.

---

## 4. Border Radius

| Token | Value | Use |
|---|---|---|
| `--radius-micro` | 6px | Badges, status dots, small tags |
| `--radius-badge` | 10px | Inline badges, chips |
| `--radius-card` | 14px | All dashboard tiles |
| `--radius-bubble` | 18px | Chat bubbles |
| `--radius-panel` | 20px | Section containers, modals |
| `--radius-section` | 24px | Full-bleed sections, landing panels |
| `--radius-pill` | 100px | All buttons, quick-reply pills, input bar |
| `--radius-addon` | 18px | Add-on product cards |

### Hard Rule
All dashboard tiles must use **14px** radius. All buttons must use **100px** (full pill). Never use `border-radius: 8px` on interactive cards — it reads as a generic component, not a product.

---

## 5. Spacing

4px-based scale. Use these values only.

| Token | Value |
|---|---|
| `--space-2` | 2px |
| `--space-4` | 4px |
| `--space-8` | 8px |
| `--space-12` | 12px |
| `--space-16` | 16px |
| `--space-20` | 20px |
| `--space-24` | 24px |
| `--space-32` | 32px |
| `--space-48` | 48px |

### Hard Rule
Internal card padding is a minimum of **16px**. Hero cards use **24px**. Never use arbitrary values like `padding: 10px 13px`.

---

## 6. Icons

### Rules — No Exceptions
1. **No emojis in UI components.** Emojis are banned in alert cards, dashboard tiles, add-on cards, and buttons.
2. **All icons must be monotone SVG**, using the design system color for their context (severity color for alerts, teal for info/interactive, white for dark-surface icons).
3. Icon containers (the box behind the icon) must use `border-radius: 12px`, a subtle tinted background (`rgba(color, 0.09)`), and a `1px solid rgba(color, 0.14)` border.
4. Icon size inside containers: **20×20px** for standard, **24×24px** for small add-on cards, **80–100px** decorative (positioned, low opacity).
5. Stroke weight: **1.5px** standard, **1.6px** for emphasis paths. Use `stroke-linecap: round`.

---

## 7. Alert Cards

### Layout
- Always rendered in a **3-column CSS grid** (`grid-template-columns: repeat(3, 1fr)`) — never stacked vertically.
- Grid must sit inside an `alert-grid-wrap` container that provides the mesh gradient background (so glassmorphism is visible).
- All 3 cards must have **equal height** — do not allow content overflow to break alignment.

### Style
- **Glassmorphism**: `background: rgba(255,255,255,0.68)`, `backdrop-filter: blur(20px)`, `border: 1px solid rgba(255,255,255,0.85)`, Level 1 + glass inset shadow.
- **Per-severity gradient mesh**: Each card has a subtle directional gradient overlay in its severity color (see tokens above).
- **Concentric arc decoration**: An SVG of 4 concentric circles (`r: 30, 48, 66, 84`) at decreasing opacity (`0.18 → 0.11 → 0.07 → 0.04`) positioned `bottom: -8px, right: -8px`, colored to match severity.
- **No left-border accent stripes.** Severity is communicated via icon container color, headline color, and the arc decoration — never a colored left border.

### Content Structure (per card)
1. Icon container (40×40px, `border-radius: 12px`, severity-tinted background)
2. Alert headline — bold, severity color, 13px/700
3. Alert subtext — muted, `--text-muted`, 12px/400
4. CTA button — outlined pill, severity color, 12px/700, arrow SVG

### CTA Labels by Severity
| Severity | Label |
|---|---|
| Critical | `Quick Refill — $15` (or relevant action + price) |
| Warning | `See Plan Options` |
| Info | `Start Here` |

---

## 8. Dashboard Tiles

### Mosaic Layout
3-column × 2-row CSS grid. Data tile spans 2 rows (hero tile). Gap: 10px.

```
grid-template-areas:
  "data  plan   trend"
  "data  renew  rewards";
```

### Tile Rules
| Tile | Background | Special |
|---|---|---|
| Data | `linear-gradient(160deg, #f0fffe, #ffffff)` + teal border | Ring chart, data badge, RUNNING LOW / DATA CAP badge |
| Plan | `linear-gradient(135deg, #0D2137, #162E4A)` **— navy, not teal** | White text, teal light badge, decorative circle `::before` |
| Usage Trend | White surface | 5-bar sparkline, color-coded by threshold |
| Renews In | White surface (urgent: `#fffbeb` + amber border) | Large number + "d" unit, date below |
| Rewards | White surface | Points number in teal, "FREE ADD-ON READY" badge when ≥1000 |

### Hard Rule — Plan Tile
The Plan tile background is **navy** (`#0D2137`). It was changed **from teal to navy** intentionally. Teal is reserved for interactive elements. A teal plan tile fights for attention with every tappable element on the screen. Do not revert this.

### Sparkline Thresholds
- Usage ≥ 90% → `#DC3545` (critical red)
- Usage ≥ 50% → `#FFC107` (warning amber)
- Usage < 50% → `#00B5AD` (teal good)

---

## 9. Add-on / Extras Cards

### Layout — Two-Tier
```
Row 1 (hero): 2-column grid — featured add-ons (e.g. Disney+, Wireless Protect)
Row 2 (compact): 3-column grid — supporting extras (Intl. Calling, Cloud, Data Add-On)
```

### Card Style
- **Full colored background** using per-brand mesh gradient (see color scheme per add-on below).
- **No white/light background** for add-on cards — they must feel like premium product tiles.
- Mesh gradient formula: `radial-gradient(ellipse at 80% 20%, [accent rgba] 0%, transparent 55%) + radial-gradient(ellipse at 15% 85%, [accent rgba lighter] 0%, transparent 50%) + linear-gradient(145deg, [dark base] 0%, [mid] 55%, [light] 100%)`.
- Concentric arc decoration: bottom-right, same system as alert cards but using the card's accent color.
- Box shadow: Level 2 (`0 2px 6px rgba(0,0,0,0.12), 0 12px 32px rgba(0,0,0,0.16)`), lifts to `0 4px 12px / 0 20px 48px` on hover.
- Border radius: **18px**.
- No border — shadow provides the separation.

### Per-Add-On Color Themes
| Add-on | Base | Accent glow |
|---|---|---|
| Disney+ | `#0D1F33` navy | Teal `rgba(0,181,173,0.22)` |
| Wireless Protect | `#006B64` deep teal | Light teal `rgba(0,213,204,0.25)` |
| Intl. Calling | `#0D2137` navy | Teal `rgba(0,181,173,0.2)` |
| Cloud 100GB | `#0D2137` navy | Light teal `rgba(91,235,228,0.18)` |
| 5G Data Add-On | `#2a0f1a` dark maroon | Red-pink `rgba(220,53,69,0.22)` |
| Auto Pay | dark green | Green `rgba(40,167,69,0.25)` |

### Hero Card Content Structure
1. Category tag (11px, ALL CAPS, `rgba(255,255,255,0.55)`)
2. Card title (17px/800, white)
3. Description (12px, `rgba(255,255,255,0.62)`, max 2 lines)
4. Footer row: price left, CTA button right

### Icon Rules for Add-on Cards
- Hero cards: **Large decorative SVG** (180×180) positioned top-right, `opacity: 0.18`, lifts to `0.26` on hover.
- Small cards: **48×48 icon container** (`border-radius: 14px`, `rgba(255,255,255,0.12)` background, `1px solid rgba(255,255,255,0.15)` border), with 24×24 monotone SVG inside.
- Icon color on dark cards: **white or `--teal-light` (`#5BEBE4`)** — never full opacity `--teal-interaction`.

### CTA Buttons on Dark Cards
- Style: `background: rgba(255,255,255,0.15)`, `border: 1px solid rgba(255,255,255,0.2)`, `color: #fff`, `border-radius: 100px`.
- Teal variant (for teal-accent cards): `background: rgba(0,181,173,0.25)`, `border-color: rgba(0,181,173,0.35)`, `color: #5BEBE4`.
- On hover: background opacity increases, card lifts `translateY(-1px)`.

### Active State
- Active add-ons replace the CTA button with an **active badge**: `rgba(0,181,173,0.18)` background, `#5BEBE4` text, animated dot `box-shadow: 0 0 6px rgba(0,181,173,0.6)`.
- Never show "Add" button on an already active add-on.

---

## 10. Buttons

| Variant | Background | Text | Use |
|---|---|---|---|
| Primary | `#0D2137` navy | White | Main CTAs, confirmations |
| Teal | `#00B5AD` | White | Secondary CTAs, AI-directed actions |
| Outline | transparent + `#d1d5db` border | `#0D2137` | Secondary, non-destructive |
| Danger | `#DC3545` | White | Cancel, destructive actions |
| Ghost | transparent | `#00B5AD` | Inline links, "View details" |

### Hard Rules
- All buttons: `border-radius: 100px`, font-weight 700, `font-size: 14px` (12px for small).
- All buttons lift `translateY(-1px)` and gain a colored shadow on hover.
- Never use `border-radius: 4px` or `8px` on buttons — that is generic component style, not this design language.
- Hover shadow formula: `0 4px 14px rgba([button-color], 0.3)`.

---

## 11. Quick Reply Pills

- Default: `background: #fff`, `border: 1.5px solid #e5e7eb`, `color: #374151`, `border-radius: 100px`, 13px/600.
- Hover: `border-color: #00B5AD`, `color: #00897B`, `background: rgba(0,181,173,0.04)`, lift + teal shadow.
- Active/selected: `background: #0D2137`, `color: #fff`, `border-color: #0D2137`.

---

## 12. Chat Bubbles

| Type | Background | Text | Alignment | Radius |
|---|---|---|---|---|
| User | `#0D2137` navy | White | Right | 18px, `border-bottom-right-radius: 4px` |
| AI | `#ffffff` + Level 1 shadow | `#1A1A2E` | Left | 18px, `border-bottom-left-radius: 4px` |

- AI label above bubble: 11px/700, `--teal-interaction` color, text "ClearPath AI".
- **User bubbles are navy, not teal.** Teal is for interactive/AI elements. Navy is for the user's own voice.

---

## 13. Signals (Intent-Driven Alerts) — Placement Rule

- Signals must render **above the dashboard mosaic**, directly below the "Intent-Driven Alerts" section label.
- They must never be rendered inside `MiniDashboard` as a vertically-stacked `SignalRow`.
- The same signal must **never appear in both** the `SignalBanner` and `SignalRow` — this is a duplicate render and it is banned.
- All 3 persona signals render in the 3-column alert grid (section 7 above).

---

## 14. Glassmorphism — When and How

Use glassmorphism **only** on alert cards and modal overlays. Do not apply it to dashboard tiles (they use solid white).

Requirements for a valid glassmorphism surface:
```css
background: rgba(255, 255, 255, 0.68);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.85);
box-shadow: [Level 1], inset 0 1px 0 rgba(255,255,255,0.9);
```
The parent container **must** have a non-white background for blur to be visible. Use the mesh gradient wrap (`alert-grid-wrap`) pattern.

---

## 15. What Is Permanently Banned

| Element | Reason |
|---|---|
| Emojis in components | Inconsistent rendering across OS, not monotone, not brand-controlled |
| `#9ca3af` text color | Fails WCAG AA on white |
| `#CC0000` anywhere except the logo | Brand-locked, reserved for Total Wireless logo identity |
| Teal (`#00B5AD`) as a full card background tile | Competes with interactive teal elements |
| Single-layer `box-shadow` | Looks flat and cheap |
| Left-border accent stripes on alert cards | Looks like a dev error log, not a consumer product |
| Vertically stacked alert signals | Breaks the symmetry rule, hides urgency |
| Duplicate signal rendering across components | Confusing UX, removed in Phase 4 |
| `border-radius: 8px` on interactive cards | Generic, non-brand |
| `border-radius: 4px` on buttons | Not a pill, not this design language |
| Traditional nav items (Shop/Deals/Pay/Account) | Core product principle — the conversation IS the nav |

---

## Live Reference

The interactive HTML reference with rendered component examples is available at:
```
/Intent Driven EX/clearpath-ai-brand-guide.html
```
Open in Chrome to see all components rendered with correct styling before implementing any UI change.

---

*ClearPath AI Design Language v2.0 — March 2026*
*Total Wireless / Verizon Value*
