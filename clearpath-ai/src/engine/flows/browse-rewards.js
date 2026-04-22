// src/engine/flows/browse-rewards.js
// Persona-aware rewards & points flow.
// Branches on points balance and persona context — never shows generic copy.

import { msg, POST_FLOW_PILLS, withEndFlow } from '../utils.js';

// 100 pts = $1 toward any purchase
const REDEMPTION_THRESHOLD = 1000;

function pointsToDollars(pts) {
  return `$${Math.floor(pts / 100)}`;
}

function startResponse(persona) {
  const a = persona?.account || {};
  const pts = a.rewardsPoints ?? 0;
  const expiring = a.rewardsExpiring ?? 0;
  const expiringDays = a.rewardsExpiringDays ?? null;
  const intentCategory = persona?.intentCategory ?? '';

  // ── New customer: no points yet ──────────────────────────────────────────
  if (pts === 0) {
    return {
      response: msg(
        `You don't have any Rewards points yet — but 340 welcome points are waiting for you as soon as your service is activated.\n\nOnce active, you'll earn points every time you pay your bill, add data, or refer a friend. 1,000 points = one free 5 GB data add-on.`,
        [
          { label: 'Activate now — get 340 pts', intent: 'activate' },
          { label: 'Go back home',                intent: 'done'    },
        ]
      ),
      nextFlowId:   'browse_rewards',
      nextStepId:   'flow_complete',
      contextPatch: { pts },
      endFlow:      false,
    };
  }

  // ── Can redeem — 1,000+ pts ───────────────────────────────────────────────
  if (pts >= REDEMPTION_THRESHOLD) {
    // Ana (international) → calling card redemption
    if (intentCategory === 'addon' || (persona?.id === 'us-007')) {
      const extra = pts - REDEMPTION_THRESHOLD;
      return {
        response: msg(
          `You have **${pts.toLocaleString()} Rewards points** — enough to redeem for a free Global Calling Card ($10 value).\n\nYou'd still have ${extra} points left over after redemption.`,
          [
            { label: 'Redeem 1,000 pts — free Calling Card', intent: 'redeem_calling_card' },
            { label: `Use ${pts} pts toward a phone — ${pointsToDollars(pts)} off`, intent: 'browse_phones' },
            { label: 'Go back home',                          intent: 'done'                },
          ]
        ),
        nextFlowId:   'browse_rewards',
        nextStepId:   'flow_complete',
        contextPatch: { pts },
        endFlow:      false,
      };
    }

    // Alex (phone buyer, 2450 pts) → push phone deal
    if (pts >= 2000) {
      return {
        response: msg(
          `You have **${pts.toLocaleString()} Rewards points** — worth ${pointsToDollars(pts)} off any device.\n\nYou can:\n• Apply all ${pts} pts at checkout for ${pointsToDollars(pts)} off a new phone\n• Redeem 1,000 pts for a free 5 GB data add-on and keep the rest`,
          [
            { label: `Apply ${pointsToDollars(pts)} toward a new phone`, intent: 'browse_phones' },
            { label: 'Redeem 1,000 pts — free 5 GB',                     intent: 'redeem_points' },
            { label: 'Go back home',                                      intent: 'done'          },
          ]
        ),
        nextFlowId:   'browse_rewards',
        nextStepId:   'flow_complete',
        contextPatch: { pts },
        endFlow:      false,
      };
    }

    // Priya and others — 1,000–1,999 pts → free data add-on
    const extra = pts - REDEMPTION_THRESHOLD;
    return {
      response: msg(
        `You have **${pts.toLocaleString()} Rewards points** — enough to redeem for a free 5 GB data add-on right now.\n\nYou'd still have ${extra} points left over. Want me to apply them?`,
        [
          { label: 'Yes — redeem 1,000 pts for free 5 GB', intent: 'redeem_points' },
          { label: `Use ${pts} pts toward a new phone`,     intent: 'browse_phones' },
          { label: 'Go back home',                          intent: 'done'          },
        ]
      ),
      nextFlowId:   'browse_rewards',
      nextStepId:   'flow_complete',
      contextPatch: { pts },
      endFlow:      false,
    };
  }

  // ── Getting close — 700–999 pts ───────────────────────────────────────────
  if (pts >= 700) {
    const needed = REDEMPTION_THRESHOLD - pts;
    let expiryNote = '';
    if (expiring > 0 && expiringDays) {
      expiryNote = `\n\n⚠️ ${expiring} of your points expire in ${expiringDays} days — earn a little more to lock them in before they're gone.`;
    }
    return {
      response: msg(
        `You have **${pts.toLocaleString()} Rewards points** — only ${needed} away from a free 5 GB data add-on.${expiryNote}\n\nThe fastest way to close the gap is to pay your next bill on time (+${a.planPrice ? '100' : '100'} pts) or refer a friend (+250 pts).`,
        [
          { label: 'How do I earn more points?', intent: 'browse_rewards_earn' },
          { label: 'What can I redeem today?',   intent: 'browse_rewards_redeem' },
          { label: 'Go back home',               intent: 'done'                  },
        ]
      ),
      nextFlowId:   'browse_rewards',
      nextStepId:   'flow_complete',
      contextPatch: { pts },
      endFlow:      false,
    };
  }

  // ── Building — under 700 pts ──────────────────────────────────────────────
  const needed = REDEMPTION_THRESHOLD - pts;
  let expiryNote = '';
  if (expiring > 0 && expiringDays) {
    expiryNote = `\n\n⚠️ Heads up: ${expiring} of your points expire in ${expiringDays} days.`;
  }
  return {
    response: msg(
      `You have **${pts.toLocaleString()} Rewards points** — you need ${needed} more to redeem for a free 5 GB data add-on (worth $15).${expiryNote}\n\nYou earn points every month you pay on time, when you refer friends, and on select promotions.`,
      [
        { label: 'Go back home', intent: 'done' },
      ]
    ),
    nextFlowId:   'browse_rewards',
    nextStepId:   'flow_complete',
    contextPatch: { pts },
    endFlow:      false,
  };
}

export const BrowseRewardsFlow = {
  step(stepId, userText, ctx, persona) {
    const lower = userText.toLowerCase();

    switch (stepId) {

      case 'start':
        return startResponse(persona);

      // Handle follow-up questions about earning
      case 'flow_complete': {
        if (lower.includes('earn') || lower.includes('how do') || lower.includes('more point')) {
          return {
            response: msg(
              `Here's how you earn Total Rewards points:\n\n• **On-time bill payment** — 100 pts/month\n• **Refer a friend** — 250 pts per referral (up to 4/year)\n• **AutoPay enrollment** — 50 bonus pts\n• **Plan upgrade** — 200 bonus pts\n• **Promotions** — bonus pts announced in the app\n\n1,000 pts = free 5 GB data add-on or $10 toward any purchase.`,
              POST_FLOW_PILLS
            ),
            nextFlowId:   null,
            nextStepId:   'flow_complete',
            contextPatch: {},
            endFlow:      true,
          };
        }

        if (lower.includes('redeem') || lower.includes('use') || lower.includes('spend')) {
          const pts = ctx.pts ?? persona?.account?.rewardsPoints ?? 0;
          return {
            response: msg(
              `Here's what you can redeem points for:\n\n• **1,000 pts** — free 5 GB data add-on ($15 value)\n• **1,000 pts** — Global Calling Card ($10 value)\n• **100 pts = $1** — credit toward any device or accessory\n\nYou currently have ${pts.toLocaleString()} pts.`,
              [
                pts >= 1000
                  ? { label: 'Redeem 1,000 pts now', intent: 'redeem_points' }
                  : { label: 'How do I earn more?',  intent: 'browse_rewards_earn' },
                { label: 'Go back home', intent: 'done' },
              ]
            ),
            nextFlowId:   null,
            nextStepId:   'flow_complete',
            contextPatch: {},
            endFlow:      true,
          };
        }

        return withEndFlow(`Is there anything else I can help with?`);
      }

      default:
        return null;
    }
  },
};
