// src/engine/flows/browse-phones.js
// Alex's (us-009) phone browsing and purchase flow

import { msg, POST_FLOW_PILLS } from '../utils.js';

// ── Shared helpers ────────────────────────────────────────────────────────────

function showIphoneOptions() {
  return `With your 2,450 rewards points, the iPhone 13 comes to $24.99. Here are your best iPhone options:\n[RECOMMENDATIONS]${JSON.stringify([
    { type: 'phone', id: 'iphone-13',  reason: '$24.99 after your 2,450 rewards points — significant upgrade from iPhone 12.', isBest: true,  costDiff: '−$25 with rewards' },
    { type: 'phone', id: 'iphone-17e', reason: 'Newest iPhone — A18 chip, 48MP camera, $300 in bill credits available.', isBest: false },
  ])}[/RECOMMENDATIONS]`;
}

function showSamsungOptions() {
  return `Here are your best free options on your Unlimited plan — no trade-in needed:\n[RECOMMENDATIONS]${JSON.stringify([
    { type: 'phone', id: 'samsung-galaxy-a36-5g', reason: 'Best free option — Super AMOLED display, 50MP camera, 5G. Biggest upgrade from iPhone 12.', isBest: true },
    { type: 'phone', id: 'samsung-galaxy-a17-5g', reason: 'Also free — reliable 5G, 50MP camera, great everyday Samsung.', isBest: false },
  ])}[/RECOMMENDATIONS]`;
}

function showAllPhones() {
  return `Here are your top picks based on your Unlimited plan. A few are completely free:\n[RECOMMENDATIONS]${JSON.stringify([
    { type: 'phone', id: 'samsung-galaxy-a36-5g', reason: 'Best free phone — Super AMOLED, 50MP camera, 5G. No cost, no trade-in.', isBest: true },
    { type: 'phone', id: 'iphone-13',             reason: '$24.99 after your 2,450 rewards points — solid iPhone upgrade.', isBest: false, costDiff: '−$25 with rewards' },
    { type: 'phone', id: 'moto-g-stylus-2025',    reason: 'Free with your plan — built-in stylus, 256GB storage, big battery.', isBest: false },
  ])}[/RECOMMENDATIONS]`;
}

// ── Flow object ───────────────────────────────────────────────────────────────

export const BrowsePhonesFlow = {
  step(stepId, userText, ctx, persona) {
    const lower = userText.toLowerCase();
    const a = persona?.account || {};

    // ── Cross-navigation checks (override any stepId) ─────────────────────────
    if (lower.includes('show me samsung') || lower.includes('samsung too')) {
      return {
        response: showSamsungOptions(),
        nextFlowId: null, nextStepId: 'browsing_samsungs', contextPatch: {}, endFlow: false,
      };
    }
    if (lower.includes('show me iphone') || lower.includes('iphones too')) {
      return {
        response: showIphoneOptions(),
        nextFlowId: null, nextStepId: 'browsing_iphones', contextPatch: {}, endFlow: false,
      };
    }
    if (lower.includes('show me all') || lower.includes('all phones') || lower.includes('show all') ||
        lower.includes('go back') || lower === 'back') {
      return {
        response: showAllPhones(),
        nextFlowId: null, nextStepId: 'browsing_all', contextPatch: {}, endFlow: false,
      };
    }

    // ── iPhone 17e detail ─────────────────────────────────────────────────────
    if (lower.includes('17e') || lower.includes('iphone 17')) {
      return {
        response: msg(
          `The iPhone 17e is the newest iPhone in the lineup:\n\n• A18 chip — same as iPhone 16 Pro\n• 48MP main camera\n• 6.1-inch OLED display\n• Up to $300 in bill credits available (applied over 24 months)\n\nAfter bill credits: effectively $0–$12.50/mo depending on plan.\n\nWant to go with the 17e, or stick with the iPhone 13 at $24.99 upfront?`,
          [
            { label: 'I want the iPhone 17e',           intent: null },
            { label: 'I want the iPhone 13 — $24.99',  intent: null },
            { label: 'Show me Samsung too',             intent: null },
          ]
        ),
        nextFlowId: null, nextStepId: 'viewing_17e', contextPatch: {}, endFlow: false,
      };
    }

    // ── Confirm order ─────────────────────────────────────────────────────────
    const isConfirm = lower.includes('order it') || lower.includes('place the order') ||
      (lower.includes('yes') && (lower.includes('order') || lower.includes('free') || lower.includes('24.99')));

    if (isConfirm) {
      let item, price, free, rewards = null;
      const fs = ctx.selectedPhone;
      if (fs === 'order_iphone13') {
        item = 'iPhone 13'; price = '$24.99'; free = false; rewards = '−$25.00 (2,450 pts)';
      } else if (fs === 'viewing_17e') {
        item = 'iPhone 17e'; price = '$0 (bill credits)'; free = true;
      } else if (fs === 'order_moto') {
        item = 'Moto G Stylus'; price = 'FREE'; free = true;
      } else if (fs === 'order_galaxy_a17') {
        item = 'Samsung Galaxy A17'; price = 'FREE'; free = true;
      } else {
        item = 'Samsung Galaxy A36'; price = 'FREE'; free = true;
      }
      return {
        response: `[PHONE_ORDER_FLOW]${JSON.stringify({ item, price, free, card: 'Visa ••••7823', rewards })}[/PHONE_ORDER_FLOW]`,
        nextFlowId: null, nextStepId: 'order_placed', contextPatch: { orderedPhone: item }, endFlow: false,
      };
    }

    switch (stepId) {

      case 'start': {
        const a2 = persona?.account || {};
        if (lower.includes('iphone') || lower.includes('apple')) {
          return { response: showIphoneOptions(), nextFlowId: null, nextStepId: 'browsing_iphones', contextPatch: {}, endFlow: false };
        }
        if (lower.includes('samsung') || lower.includes('android')) {
          return { response: showSamsungOptions(), nextFlowId: null, nextStepId: 'browsing_samsungs', contextPatch: {}, endFlow: false };
        }
        if (lower.includes('deal') || lower.includes('qualify')) {
          return {
            response: msg(
              `With your ${a2.plan || 'Total Unlimited'} plan, you qualify for some great deals. A few phones are completely free — no trade-in needed.\n\nWhat kind of phone are you looking for?`,
              [
                { label: 'Show me new phones',      intent: null },
                { label: 'I want an iPhone',        intent: null },
                { label: 'I want a Samsung',        intent: null },
              ]
            ),
            nextFlowId: null, nextStepId: 'browsing_all', contextPatch: {}, endFlow: false,
          };
        }
        return { response: showAllPhones(), nextFlowId: null, nextStepId: 'browsing_all', contextPatch: {}, endFlow: false };
      }

      case 'browsing_all':
      case 'browsing_iphones':
      case 'browsing_samsungs':
      case 'browsing_camera':
      case 'browsing_battery':
      case 'browsing_screen': {
        // Preference filters
        if (lower.includes('best camera') || lower === 'camera') {
          return {
            response: `Best camera upgrades:\n[RECOMMENDATIONS]${JSON.stringify([
              { type: 'phone', id: 'iphone-13',            reason: '$24.99 after rewards — 12MP dual camera with Night Mode. Big jump from iPhone 12.', isBest: true, costDiff: '−$25 with rewards' },
              { type: 'phone', id: 'samsung-galaxy-a36-5g', reason: 'Free with your plan — 50MP main camera, Super AMOLED display.', isBest: false },
            ])}[/RECOMMENDATIONS]`,
            nextFlowId: null, nextStepId: 'browsing_camera', contextPatch: {}, endFlow: false,
          };
        }
        if (lower.includes('longest battery') || lower === 'battery') {
          return {
            response: `Best battery life available — both free with your plan:\n[RECOMMENDATIONS]${JSON.stringify([
              { type: 'phone', id: 'moto-g-stylus-2025',    reason: 'Best battery — 5000mAh, lasts all day. Built-in stylus. Free.', isBest: true },
              { type: 'phone', id: 'samsung-galaxy-a36-5g', reason: 'Free — efficient 5G chip, solid all-day battery.', isBest: false },
            ])}[/RECOMMENDATIONS]`,
            nextFlowId: null, nextStepId: 'browsing_battery', contextPatch: {}, endFlow: false,
          };
        }
        if (lower.includes('biggest screen') || lower === 'screen') {
          return {
            response: `Biggest screens in your lineup — both free:\n[RECOMMENDATIONS]${JSON.stringify([
              { type: 'phone', id: 'moto-g-stylus-2025',    reason: '6.7-inch FHD+ display — great for video. Built-in stylus. Free.', isBest: true },
              { type: 'phone', id: 'samsung-galaxy-a36-5g', reason: '6.7-inch Super AMOLED — vivid colors. Free.', isBest: false },
            ])}[/RECOMMENDATIONS]`,
            nextFlowId: null, nextStepId: 'browsing_screen', contextPatch: {}, endFlow: false,
          };
        }
        if (lower.includes('cheapest') || lower.includes('cost down') || lower.includes('free phone') || lower === 'cheap') {
          return {
            response: `Free phones with your Unlimited plan — no trade-in needed:\n[RECOMMENDATIONS]${JSON.stringify([
              { type: 'phone', id: 'samsung-galaxy-a36-5g', reason: 'Best free option — Super AMOLED, 50MP camera, 5G. No cost, no trade-in.', isBest: true },
              { type: 'phone', id: 'moto-g-stylus-2025',    reason: 'Also free — built-in stylus, 256GB storage, big battery.', isBest: false },
            ])}[/RECOMMENDATIONS]`,
            nextFlowId: null, nextStepId: 'browsing_all', contextPatch: {}, endFlow: false,
          };
        }

        // Phone selection — iPhone 13
        if ((lower.includes('iphone 13') || lower.includes('24.99')) &&
            !lower.includes('17e') && !lower.includes('order it')) {
          return {
            response: msg(
              `Here's your order summary:\n\n**iPhone 13**\n• Color: Midnight\n• Storage: 128 GB\n• Regular price: $49.99\n• Rewards discount: −$25.00 (2,450 pts)\n• You pay: $24.99\n• Points remaining after purchase: 0\n• Ships: 2–3 business days\n• Card: Visa ••••7823\n\nReady to place the order?`,
              [
                { label: 'Yes, order it — $24.99', intent: null },
                { label: 'Go back',                intent: null },
              ]
            ),
            nextFlowId: null, nextStepId: 'browsing_all', contextPatch: { selectedPhone: 'order_iphone13' }, endFlow: false,
          };
        }

        // Phone selection — Moto G Stylus
        if (lower.includes('moto') || lower.includes('stylus')) {
          return {
            response: msg(
              `Here's your order summary:\n\n**Moto G Stylus**\n• Color: Graphite\n• Storage: 128 GB\n• Price: FREE with your Unlimited plan\n• Ships: 2–3 business days\n• Card: Visa ••••7823\n\nReady to place the order?`,
              [
                { label: 'Yes, order it — FREE', intent: null },
                { label: 'Go back',              intent: null },
              ]
            ),
            nextFlowId: null, nextStepId: 'browsing_all', contextPatch: { selectedPhone: 'order_moto' }, endFlow: false,
          };
        }

        // Phone selection — Galaxy A17
        if (lower.includes('a17')) {
          return {
            response: msg(
              `Here's your order summary:\n\n**Samsung Galaxy A17**\n• Color: Black\n• Storage: 64 GB\n• Price: FREE with your Unlimited plan\n• Ships: 2–3 business days\n• Card: Visa ••••7823\n\nReady to place the order?`,
              [
                { label: 'Yes, order it — FREE', intent: null },
                { label: 'Go back',              intent: null },
              ]
            ),
            nextFlowId: null, nextStepId: 'browsing_all', contextPatch: { selectedPhone: 'order_galaxy_a17' }, endFlow: false,
          };
        }

        // Phone selection — Galaxy A36 (default)
        if (lower.includes('a36') || lower.includes('galaxy a36') ||
            (lower.includes('want') && lower.includes('free')) ||
            lower.includes('i want the galaxy')) {
          return {
            response: msg(
              `Here's your order summary:\n\n**Samsung Galaxy A36**\n• Color: Awesome Navy\n• Storage: 128 GB\n• Price: FREE with your Unlimited plan\n• Ships: 2–3 business days\n• Card: Visa ••••7823\n\nReady to place the order?`,
              [
                { label: 'Yes, order it — FREE', intent: null },
                { label: 'Go back',              intent: null },
              ]
            ),
            nextFlowId: null, nextStepId: 'browsing_all', contextPatch: { selectedPhone: 'order_galaxy_a36' }, endFlow: false,
          };
        }

        // Brand filter — Samsung (no specific model selected yet)
        if (lower.includes('samsung') || lower.includes('android')) {
          return {
            response: showSamsungOptions(),
            nextFlowId: null, nextStepId: 'browsing_samsungs', contextPatch: {}, endFlow: false,
          };
        }

        // Brand filter — iPhone (no specific model selected yet)
        if (lower.includes('iphone') || lower.includes('apple')) {
          return {
            response: showIphoneOptions(),
            nextFlowId: null, nextStepId: 'browsing_iphones', contextPatch: {}, endFlow: false,
          };
        }

        // Clarifying question
        return {
          response: msg(
            `Happy to help you find the right fit. What matters most to you — camera, battery, screen size, or keeping the cost down?`,
            [
              { label: 'Best camera',     intent: null },
              { label: 'Longest battery', intent: null },
              { label: 'Biggest screen',  intent: null },
              { label: 'Cheapest option', intent: null },
            ]
          ),
          nextFlowId: null, nextStepId: 'browsing_all', contextPatch: {}, endFlow: false,
        };
      }

      case 'viewing_17e': {
        if (lower.includes('17e') || lower.includes('yes') || (lower.includes('want') && lower.includes('17e'))) {
          return {
            response: msg(
              `Here's your order summary:\n\n**iPhone 17e**\n• Up to $300 in bill credits over 24 months\n• Effectively $0 down with eligible plan\n• Ships: 2–3 business days\n• Card: Visa ••••7823\n\nReady to place the order?`,
              [
                { label: 'Yes, order the iPhone 17e', intent: null },
                { label: 'I want the iPhone 13 — $24.99', intent: null },
                { label: 'Go back',                   intent: null },
              ]
            ),
            nextFlowId: null, nextStepId: 'viewing_17e', contextPatch: { selectedPhone: 'viewing_17e' }, endFlow: false,
          };
        }
        return null;
      }

      case 'order_placed': {
        if (lower.includes('manage account') || lower.includes('my account')) {
          return {
            response: msg(
              `Here's your account overview:\n\n• Plan: ${a.plan || 'Total Unlimited'}\n• Renewal: ${a.renewalDate || 'Apr 9'}\n• Rewards: 0 pts (used on your order)\n\nWant to make any changes?`,
              [
                { label: 'Change my plan',         intent: 'plan_change' },
                { label: 'Update payment method',  intent: null          },
                { label: "That's all, thanks",     intent: 'done'        },
              ]
            ),
            nextFlowId: null, nextStepId: 'order_placed', contextPatch: {}, endFlow: false,
          };
        }
        if (lower.includes("that's all") || lower.includes("i'm done") || lower.includes('no thanks') || lower.includes('done')) {
          return {
            response: `You're all set! Your order ships in 2–3 business days — you'll get a tracking number via SMS. Have a great day!`,
            nextFlowId: null, nextStepId: 'flow_complete', contextPatch: {}, endFlow: true,
          };
        }
        return {
          response: msg(`Is there anything else I can help with?`, POST_FLOW_PILLS),
          nextFlowId: null, nextStepId: 'flow_complete', contextPatch: {}, endFlow: true,
        };
      }

      case 'flow_complete':
        return {
          response: msg(`Is there anything else I can help with?`, POST_FLOW_PILLS),
          nextFlowId: null, nextStepId: 'flow_complete', contextPatch: {}, endFlow: true,
        };

      default:
        return null;
    }
  }
};
