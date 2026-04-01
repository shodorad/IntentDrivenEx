# ClearPath AI — Feedback from Review Call (March 31, 2026)

**Attendees:** Lam Huynh, Shobhit Singh, Srinivas Chamarthi

---

## Priority 1: Homepage Redesign

### 1.1 Remove the subhead
Remove "Hi. I am ClearPath AI..." paragraph from the landing screen. It takes up too much vertical space. Optionally show it when the user clicks/focuses the input bar to start a conversation.

### 1.2 Consider removing ClearPath AI logo
Lam suggested removing the ClearPath AI sparkle logo to maximize vertical space. Just keep: "Tell us what's going on. We'll figure out the rest."

### 1.3 Intent alert banners at the TOP
All intent-based signal banners must appear ABOVE the account snapshot/dashboard — not below. Make positioning consistent across all personas.

### 1.4 Canned prompts only on input focus
The intent pills should NOT be visible on the landing screen by default. They appear only when the user clicks/taps the input bar. This was the previous behavior — restore it.

### 1.5 Two categories of prompts
When pills appear, split into two groups:
- **Category 1 — Personalized:** Contextual to the user's data and intent (e.g., "Why does this keep happening?", "Quick refill", diagnosis-related)
- **Category 2 — Browse/Explore:** Generic navigation (e.g., "Show me all plans", "Show me all phones", "Show me all deals", "Tell me about the rewards program"). These don't need to be built out — just need the prompt path.

### 1.6 Mini Dashboard tile changes
**Remove:**
- Monthly Spend tile (redundant with Plan tile)
- Network/Signal tile

**Add:**
- **Rewards tile** — show points balance (e.g., Priya has 1,020 points)
- **Data usage trend** — replace signal tile with a visual chart showing last 3-5 months of data usage
- **Extras/Add-ons section** — show active extras (Disney+, Wireless Protect, etc.) using visual cards with logos/images (Netflix-style), NOT text banners. Reference Total Wireless "Extras" page for style.

**Final tile order:** Data remaining → Rewards → Plan → Renewal → Usage trend → Extras/Add-ons

Scrolling below the fold is acceptable — just keep intent alerts + core account snapshot above the fold.

### 1.7 Fix text contrast
Srinivas flagged poor contrast in several places — text on backgrounds isn't visible enough. Darken text. Check WCAG contrast ratios.

---

## Priority 2: Conversation Flows

### 2.1 Focus on 3 personas only
1. **Maria (us-001)** — Running low on data → Refill flow. Update her submenu label to: "Running low on data — refill/recharge"
2. **Angela (connectivity issues)** — Called support 5x → Diagnose connectivity problem. Fix the broken flow (see 2.2).
3. **Buy a new phone persona (NEW)** — User says "I want to buy a new phone" → picks model (e.g., iPhone) → picks color/storage → AI completes the purchase. Fast, conversational. Srinivas specifically requested this.

### 2.2 Fix Angela's broken connectivity flow
After the "restart phone" diagnostic step, if user says "still having issues," the AI jumps to asking about buying a new phone — makes no sense. Fix the flow to continue diagnosis logically (e.g., check APN settings, check SIM, escalate to support).

### 2.3 Add "return to home" / "explore other topics" after every flow
After any completed flow (refill, diagnosis, purchase), user must be able to:
- Return to the home/landing screen
- Start a new topic / continue the conversation
Currently only "home page" exists — add "Explore other topics" or "Ask something else" option.

### 2.4 Fix quick-reply pill labels
- Some pills get cut off — make sure text is fully visible
- Fix restart phone options to: "Yes, I have" / "No, let me try now" / "I restart often"

### 2.5 QA all conversation text
Read through every AI response for all 3 priority personas. Ensure:
- Text makes sense in context
- Diagnose-before-upsell pattern is followed
- No broken flow transitions
- Response options are clear and unambiguous

---

## Priority 3: Visual Polish

### 3.1 Visual card design for extras/add-ons
Use card-based design (images + logos) like Netflix or Total Wireless homepage — not text-only banners.

### 3.2 Consistent alert banner styling
All intent alert banners across all personas should use the same visual style.

---

## What's NOT Changing
- The diagnose-before-upsell pattern is confirmed correct — keep it
- The overall intent-driven approach is working
- Dashboard concept is right, just needs tile adjustments
- Password gate stays for demo access

## Next Review
Tomorrow morning (April 1, 2026) — Srinivas invited for another review.
