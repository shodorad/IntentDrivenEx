# Lam's Intent-Driven Design Feedback
**Source:** Design review session transcript
**Project:** ClearPath AI — Intent-Driven Experience (Total Wireless)

---

## Section 1: Post-Flow Exit Options

After a user completes a conversational flow (e.g., finishes diagnosing a data issue or switches a plan), there should be a clear way to exit or reset the session.

**Lam's direction:** Add an option at the end of each completed flow that either returns the user to the main menu or confirms they are finished. A message like "Is there anything else I can help with?" is a good starting point, but it should be accompanied by a visible action — a "Return to Home" or "I'm Done" button/pill — so the user doesn't feel stuck inside a flow.

---

## Section 2: Add CTAs to Plan Comparison Options

When plan options are shown side-by-side in the conversation (e.g., "Switch to Unlimited" alongside the current plan), each plan card should have its own CTA button.

**Lam's direction:** Each plan option in the comparison view needs a clear call-to-action button. Without individual CTAs, the user has no obvious tap point to select a specific plan. Build CTAs into every plan card rendered inside the conversation.

---

## Section 3: Fix Formatting Inconsistencies

There are visible formatting issues across the interface — misaligned elements, inconsistent spacing, and uneven card sizing.

**Lam's direction:** The formatting "funkiness" needs to be cleaned up. Inconsistent spacing and layout irregularities across cards, banners, and pill components should be standardized. This is a polish pass to align everything to the same visual grid and spacing system.

---

## Section 4: Pricing Consistency Across Cards

A plan was shown with two different prices — $55 in one card and $50 in another — which creates confusion and erodes trust.

**Lam's direction:** Audit all plan pricing shown across the prototype. Ensure that the same plan always displays the same price in every location — the recommendation card, the comparison view, and any CTA labels (e.g., "Continue — $15"). Inconsistent pricing must be resolved before any stakeholder review.

---

## Section 5: Unified Alert Banner Style with Section Labels

Currently, the top signal alert banner and the lower content banners have different visual treatments, making it unclear whether they serve the same purpose.

**Lam's direction:** Convert all banners below the top signal banner to match the same visual style as the top alert banner. Once unified, add a small label above each section to clearly differentiate them. There are two distinct sections that should be labeled separately:

- **Intent-Driven Alerts** — the AI-surfaced signal/alert banners
- **My Account / Mini Dashboard** — the compact account status widget

This labeling helps users orient themselves and understand what each part of the screen is doing.

---

## Section 6: Add-On Clarity

The "Add-On" section or option in the flow is unclear and doesn't communicate what it offers the user.

**Lam's direction:** The add-on entry point needs to be more explicit. A label like "Add-On" alone doesn't tell the user what they're adding. The option should clarify the type of add-on — for example, "Add international calling," "Add another line," or "Add a data pack." Surface the intent clearly so the user immediately understands what action they're about to take.

---

## Section 7: Integrate Traditional Navigation into the Conversational Experience

The prototype currently assumes the conversation is the only entry point. But since this experience is meant to replace the full Total Wireless website, all traditional navigation categories must still be accessible — just delivered through the intent-driven model.

**Lam's direction:** The following top-level categories from the existing Total Wireless site need to be integrated:
- **Shop** (phones, plans)
- **Deals**
- **Pay / Quick Refill**
- **Activate** (new line or new phone)
- **Account / My Account**
- **Total Rewards**

These should not appear as a traditional nav bar. Instead, they should be surfaced contextually through the conversation — either as action pills at appropriate moments or as accessible menu items within the chat interface. The user should still be able to get to all of these without having to know how to phrase an intent.

---

## Section 8: Personalized Browsing When Logged In

Even when users choose to browse traditionally (e.g., tapping "Shop" or "View Plans"), the experience should be tailored to who they are — not a generic catalog view.

**Lam's direction:** When a logged-in user initiates a traditional browse action (like viewing phones or plans), the results should be filtered and ranked based on their current plan and device. For example:

- "Here's the phone you have now. Here are devices that might suit you better."
- "Here's the plan you're on. Here are plans that are a better fit based on your usage."

This bridges the traditional browsing experience with the personalized, intent-driven layer. It's not just a catalog — it's a curated, contextual view.

---

## Section 9: Action Pills as the Gateway to Traditional Content

Traditional website sections should be presented as action pills within the conversation, not as separate pages or a nav bar.

**Lam's direction:** When a user types something like "show me everything" or "what phones do you have," the AI should respond with a set of action pills representing the main content areas (e.g., "View All Plans," "Browse Phones," "Pay My Bill," "Total Rewards"). Selecting a pill should render the relevant content as cards directly inside the conversation thread — not navigate the user away to a separate page. Everything stays in-conversation.

This follows the model of the Radiant AI landing page: a single-page experience where everything is accessible through conversation, but the full catalog is never more than one action away.

---

## Section 10: Plan the Remaining Personas and Navigation Architecture

Before building further, a clear plan needs to be drafted for completing the persona coverage and the navigational architecture.

**Lam's direction:** Two planning tasks need to happen in parallel:

1. **Complete all 8 personas** — each persona should have a fully mapped diagnosis flow with appropriate clarifying questions, free-fix checks, and plan recommendations. The goal is to have all 8 personas ready for stakeholder review.

2. **Draft the navigation architecture** — create a written plan (to be shared with Lam before the next review call) that explains how the user will navigate between the conversational experience and the traditional content areas (Shop, Deals, Pay, Account, etc.). This plan should show how each traditional section is accessed, what triggers the action pills, and how the in-conversation card views will be structured.

---

*Extracted from design review session. All 10 items are attributed to Lam Huynh based on direct statements in the transcript.*
