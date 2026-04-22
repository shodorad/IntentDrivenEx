// src/engine/personaOpenings.js
// Persona opening responses extracted from demoResponses.js getPersonaOpeningResponse()
// and getSignalOpeningResponse().
//
// Each function returns a RouteResult shape:
//   { response, nextFlowId, nextStepId, contextPatch, endFlow }

import { msg } from './utils.js';

/**
 * Get the opening RouteResult for a given persona.
 * Called by router step 3 on the first user message.
 *
 * @param {object} persona - Full persona object
 * @returns {object|null} RouteResult or null if no persona-specific opening
 */
export function getPersonaOpening(persona) {
  const a = persona?.account;
  if (!a) return null;

  let response = null;

  switch (persona.id) {

    case 'us-001': // Maria — recurring data problem
      response = msg(
        `Hi Maria. You have ${a.dataRemaining} left and ${a.daysUntilRenewal} days until your plan renews on ${a.renewalDate}.\n\nOne thing I noticed: only 22% of your usage goes through Wi-Fi — your phone is using cellular most of the time, even when you might not need to.\n\nThat's worth looking at before spending anything. Want me to walk you through a couple of quick fixes, or add data right now?`,
        [
          { label: 'Why am I running out?', intent: 'diagnose_usage' },
          { label: 'Quick Refill — $15',   intent: 'quick_refill'   },
          { label: 'Change my plan',        intent: 'plan_change'    },
          { label: "I'm fine for now",      intent: 'done'           },
        ]
      );
      break;

    case 'us-002': // Carlos — plan expiring in 2 days
      response = msg(
        `Hey Carlos. Your plan expires in ${a.daysUntilRenewal} days — on ${a.renewalDate}. Service will pause if it's not renewed.\n\nYou're currently on ${a.plan} at ${a.planPrice}. Want to renew the same plan, or change while you're here?`,
        [
          { label: `Renew ${a.plan} — ${a.planPrice}`, intent: 'quick_refill' },
          { label: 'See other plans',                   intent: 'browse_plans' },
          { label: 'Upgrade to Unlimited',              intent: 'upgrade_now'  },
          { label: 'Remind me tomorrow',                intent: 'done'         },
        ]
      );
      break;

    case 'us-003': // Priya — rewards redeemable
      response = msg(
        `Hi Priya. You're down to ${a.dataRemaining} left — and you have ${a.rewardsPoints} Rewards Points on your account, which is enough to get a free 5 GB data add-on.\n\nWould you like to use your points for the free add-on, or pay for a refill instead?`,
        [
          { label: 'Redeem 1,000 pts — free 5 GB',  intent: 'quick_refill' },
          { label: 'Add 5 GB of data — $10',         intent: 'quick_refill' },
          { label: 'Renew full plan early — $40',    intent: 'quick_refill' },
          { label: 'Save my points for later',       intent: 'done'         },
        ]
      );
      break;

    case 'us-004': // James — new customer, eSIM
      response = msg(
        `Welcome to Total Wireless, ${persona.name.split(' ')[0]}! Let's get you connected — this usually takes about 3 minutes.\n\nI can see you have an ${a.device}, so eSIM is the fastest option. Does that work for you, or would you prefer a physical SIM?`,
        [
          { label: `Activate eSIM on ${a.device}`, intent: 'activate'      },
          { label: 'Physical SIM instead',          intent: 'activate'      },
          { label: 'Port my number from another carrier', intent: 'activate' },
          { label: 'Help me choose a plan first',   intent: 'browse_plans'  },
        ]
      );
      break;

    case 'us-005': // Angela — persistent connectivity issues
      response = msg(
        `Hi Angela. I can see you've reached out ${a.supportCallsThisMonth} this month — I'm sorry this is still happening.\n\n📊 ${a.supportCallsThisMonth} | support calls this month | warn\n📊 ${a.avgSignalBars} / 5 bars | avg signal | critical\n📊 ${a.droppedCallsThisWeek} dropped calls | this week | critical\n\nThat's a pattern, not a one-off. Let me check for a known outage in your area first — that's the fastest thing to rule out.`,
        [
          { label: 'Walk me through a fix',              intent: 'support'   },
          { label: 'Just talk to someone',               intent: 'support'   },
          { label: 'Is there a plan with better coverage?', intent: 'support' },
        ]
      );
      break;

    case 'us-006': // Derek — hit cap 3rd month in a row
      response = msg(
        `You've hit your data cap ${a.capHitsLast3Months} months in a row — and right now you're at 0 GB. Unlimited is only $15 more per month and ends the caps permanently.\n\nWere you thinking about upgrading, or want to understand why this keeps happening first?`,
        [
          { label: 'Why do I keep hitting my cap?', intent: 'diagnose_usage' },
          { label: 'Upgrade to Unlimited',           intent: 'upgrade_now'   },
          { label: 'Start at next renewal (no charge today)', intent: 'upgrade_now' },
          { label: 'Just add 5 GB for now — $10',  intent: 'quick_refill'   },
        ]
      );
      break;

    case 'us-007': // Ana — international caller
      response = msg(
        `Hi Ana. I can see you called Colombia 8 times this month and Mexico twice — you're paying per-minute rates right now, around $28 this month.\n\nThe $10/mo Global Calling Card covers 200+ countries and would save you about $18/mo at your call volume.\n\nBest part — you have ${a.rewardsPoints} Rewards Points. You could actually get the Calling Card completely free (1,000 pts). Want the free one?`,
        [
          { label: 'Yes — redeem 1,000 pts for free', intent: 'international' },
          { label: 'Pay $10/mo instead',               intent: 'international' },
          { label: 'Tell me more',                     intent: 'international' },
          { label: 'See all calling options',          intent: 'international' },
        ]
      );
      break;

    case 'us-008': // Robert — 4-line family comparing plans
      response = msg(
        `Hey Robert. You've checked Plans a few times this week — looks like you're thinking it over. Let me make it easy.\n\nYou're managing ${a.familyLines} lines, all on ${a.plan} at $${a.currentMonthlySpend}/mo total. Here's the thing: Unlimited at 4 lines is $110/mo — that's $50/mo cheaper, and each line gets unlimited data.\n\nWant to see the full side-by-side?`,
        [
          { label: 'See full plan comparison',             intent: 'compare'    },
          { label: 'Upgrade to 5G Unlimited — save $50/mo', intent: 'upgrade_now' },
          { label: 'Calculate 4-line pricing',             intent: 'compare'    },
          { label: 'Not ready to switch',                  intent: 'done'       },
        ]
      );
      break;

    case 'us-009': // Alex — buy a new phone
      response = msg(
        `Hey Alex. Good news — with your Total Unlimited plan, you qualify for some of our best device deals right now. A few phones are completely free, no trade-in needed.\n\nYour ${a.device} is 3 years old — there are some significant upgrades available. What kind of phone are you looking for?`,
        [
          { label: 'Show me new phones', intent: 'browse_phones' },
          { label: 'I want an iPhone',  intent: 'browse_phones' },
          { label: 'I want a Samsung',  intent: 'browse_phones' },
        ]
      );
      break;

    case 'us-010': // Nina — new activation with Moto G Stylus 2025
      response = msg(
        `Hi Nina! Let's get your Moto G Stylus 2025 connected — this usually takes about 5 minutes.\n\nI can see you have a physical SIM. Before we start: are you bringing your current number from another carrier, or would you like a fresh new number?`,
        [
          { label: 'Port my current number',     intent: 'activate'     },
          { label: 'Get a new number',            intent: 'activate'     },
          { label: 'Help me pick a plan first',  intent: 'browse_plans'  },
          { label: 'What does activation involve?', intent: 'activate'   },
        ]
      );
      break;

    default: {
      // Generic opening by intentCategory
      switch (persona.intentCategory) {
        case 'refill':
          response = msg(
            `I can see your data is running low — ${a.dataRemaining} left with ${a.daysUntilRenewal} days until your cycle resets. Before I set anything up — does this tend to happen most months, or is this a one-time thing?`,
            [
              { label: 'It happens most months', intent: 'diagnose_usage' },
              { label: 'Just this once',          intent: 'quick_refill'   },
              { label: 'I need data right now',   intent: 'quick_refill'   },
              { label: "I'm not sure",            intent: 'diagnose_usage' },
            ]
          );
          break;
        case 'upgrade':
          response = msg(
            `You've hit your data cap — and it looks like this has happened before. Upgrading to Unlimited ends the caps permanently.\n\nWant to upgrade now or just explore your options?`,
            [
              { label: 'Upgrade to Unlimited',    intent: 'upgrade_now' },
              { label: 'Start at next renewal',   intent: 'upgrade_now' },
              { label: "Tell me what's included", intent: 'browse_plans' },
              { label: 'Not right now',           intent: 'done'         },
            ]
          );
          break;
        case 'byop':
          response = msg(
            `Let's check if your phone works on Total Wireless. Most unlocked phones do — it usually takes about 30 seconds to confirm.\n\nDo you know your phone's IMEI number, or would you like help finding it?`,
            [
              { label: 'Check compatibility now',   intent: 'byop'        },
              { label: 'Help me find my IMEI',      intent: 'byop'        },
              { label: 'Tell me about BYOP plans',  intent: 'browse_plans' },
              { label: 'I have questions first',    intent: null           },
            ]
          );
          break;
        case 'activate':
          response = msg(
            `Great — let's get you connected. Activation usually takes about 5 minutes.\n\nFirst question: are you bringing your current phone number, or would you like a new one?`,
            [
              { label: 'Port my current number',    intent: 'activate' },
              { label: 'Get a new number',           intent: 'activate' },
              { label: 'Help me pick a plan first', intent: 'browse_plans' },
              { label: 'What do I need to activate?', intent: 'activate' },
            ]
          );
          break;
        default:
          return null;
      }
    }
  }

  if (!response) return null;

  return {
    response,
    nextFlowId:   null,
    nextStepId:   null,
    contextPatch: {},
    endFlow:      false,
  };
}

/**
 * Signal-specific proactive opening.
 * Called by startProactiveChat when a signal card opens the chat AI-first.
 * Falls back to getPersonaOpening when no signal-specific copy exists.
 *
 * @param {object} sig    - Signal object (from persona.signals[])
 * @param {object} persona - Full persona object
 * @returns {object|null} RouteResult or null
 */
export function getSignalOpening(sig, persona) {
  const a = persona?.account;
  if (!a) return null;

  switch (sig?.id) {
    case 'sig-001-c': // "App opened 3 times today with no action"
      return {
        response: msg(
          `Looks like you've been checking in a few times today — no pressure, I'm here when you're ready.\n\nQuick summary: you have **${a.dataRemaining}** left and **${a.daysUntilRenewal} days until renewal** on ${a.renewalDate}. Only 22% of your usage goes through Wi-Fi, so there may be a free fix before spending anything.\n\nWhat's holding you back?`,
          [
            { label: 'Why am I running out?', intent: 'diagnose_usage' },
            { label: 'Quick Refill — $15',   intent: 'quick_refill'   },
            { label: 'Change my plan',        intent: 'plan_change'    },
            { label: "I'm fine for now",      intent: 'done'           },
          ]
        ),
        nextFlowId:   null,
        nextStepId:   null,
        contextPatch: {},
        endFlow:      false,
      };

    default:
      return getPersonaOpening(persona);
  }
}
