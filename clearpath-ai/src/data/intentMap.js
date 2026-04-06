/**
 * Phase 4: Intent classifier — replaces brittle keyword matching in getFlowKey().
 * Option A: weighted synonym table with negation handling. Zero API cost.
 *
 * classifyIntent(message) returns an intent key or null.
 *
 * Primary intents (match plan test matrix):
 *   quick_refill, diagnose_usage, plan_change, upgrade_now,
 *   browse_phones, browse_plans, support, international, done
 *
 * Granular flow intents (map to FLOWS/RECOMMENDATIONS in demoResponses.js):
 *   slow-data, runs-out, slow-phone, storage, camera, cost,
 *   not-working, compare, activate, byop
 */

export const INTENT_MAP = {

  // ── Primary intents ──────────────────────────────────────────────────────

  quick_refill: {
    phrases: [
      'almost out', 'running low', 'low on data', 'need more data',
      'add data', 'buy data', 'quick refill', 'top up', 'top-up',
      'data add-on', 'ran out', 'just ran out', 'out of data right now',
      'refill', 'expir', 'renew my plan', 'autopay',
    ],
    negations: ["don't need data", 'not running out', 'still have plenty'],
  },

  diagnose_usage: {
    phrases: [
      'why am i', 'why do i', 'keep running out', 'using so much data',
      'why is my data', 'why does my data', 'how do i use less',
      'where is my data', 'what is using my data', 'data keeps draining',
      'diagnose why', 'diagnose the', 'figure out why', 'find out why',
      "what's using my", 'why it keeps', 'why i keep', 'why does it',
      'check my usage', 'check usage', 'analyze my data', 'investigate',
    ],
    negations: [],
  },

  plan_change: {
    phrases: [
      'change my plan', 'switch my plan', 'different plan', 'cheaper plan',
      'lower my plan', 'downgrade', 'change plan', 'smaller plan',
      'switch to a cheaper', 'want a different plan',
    ],
    negations: ["don't want to switch", 'stay on my plan', 'keep my plan'],
  },

  upgrade_now: {
    phrases: [
      'upgrade', 'unlimited plan', 'get unlimited', 'need unlimited',
      'better plan', 'bigger plan', 'more data plan', '55/mo',
      'upgrade my plan', 'want unlimited', 'switch to unlimited',
    ],
    negations: [
      "don't want to upgrade", "don't need unlimited", 'no upgrade',
      'not looking to upgrade', 'not upgrading', "don't upgrade",
      "don't want unlimited",
    ],
  },

  browse_phones: {
    phrases: [
      'new phone', 'replace my phone', 'buy a phone', 'get a new phone',
      'phone upgrade', 'looking for a phone', 'show me phones',
      'browse phones', 'phone options', 'what phones do you have',
      'thinking about getting a phone',
    ],
    negations: ['keep my phone', 'not getting a phone', 'no new phone'],
  },

  browse_plans: {
    phrases: [
      'what plans do you', 'show me plans', 'view plans', 'all plans',
      'plan options', 'available plans', 'see your plans',
      'what plans are', 'what do you offer', 'what plans do you have',
    ],
    negations: [],
  },

  international: {
    phrases: [
      'international', 'calling card', 'call abroad', 'call overseas',
      'call mexico', 'call colombia', 'call my family', 'global call',
      'roaming', 'travel abroad', 'family in mexico', 'family abroad',
      'family overseas', 'international calls', 'call internationally',
      'call back home',
    ],
    negations: [],
  },

  support: {
    phrases: [
      'dropped calls', 'dropping calls', 'calls keep dropping',
      'no signal', 'bad signal', 'poor signal', 'weak signal',
      'outage', 'network issue', 'connectivity issue',
      'signal issue', 'losing signal', 'keeps dropping', 'dead zone',
      'bars of signal', 'phone keeps cutting out',
    ],
    negations: [],
  },

  browse_rewards: {
    phrases: [
      'rewards', 'my points', 'reward points', 'loyalty points',
      'redeem points', 'how many points', 'points balance',
      'my rewards', 'earn points', 'use my points', 'points expir',
    ],
    negations: [],
  },

  done: {
    phrases: [
      'never mind', "that's all", 'thats all', 'go home', 'return home',
    ],
    negations: [],
  },

  // ── Granular flow intents (drive FLOWS multi-question dialogs) ────────────

  'slow-data': {
    phrases: [
      'slow data', 'slow internet', 'slow speed', 'internet is slow',
      'really slow', 'data is slow', 'buffering', 'loading slowly',
      'speeds are slow', 'my data is slow', 'data feels slow',
    ],
    negations: [],
  },

  'runs-out': {
    phrases: [
      'run out', 'runs out', 'always run out', 'run out before',
      'run out every', 'end of the month', 'before the month is over',
      'data at end of',
    ],
    negations: [],
  },

  'slow-phone': {
    phrases: [
      'slow phone', 'phone is slow', 'sluggish', 'phone freezes',
      'phone lags', 'lagging phone', 'phone is sluggish',
    ],
    negations: [],
  },

  storage: {
    phrases: [
      'storage full', 'out of space', 'no space', 'phone storage',
      'phone is full', 'not enough storage', 'running out of storage',
    ],
    negations: [],
  },

  camera: {
    phrases: [
      'better camera', 'better photos', 'better pictures',
      'photo quality', 'picture quality', 'take better photos',
      'camera quality',
    ],
    negations: [],
  },

  cost: {
    phrases: [
      'save money', 'spend less', 'lower cost', 'reduce my bill',
      'lower my bill', 'affordable plan', 'best value plan',
      'cost less on my', 'want to save',
    ],
    negations: [],
  },

  'not-working': {
    phrases: [
      'not working', "isn't working", 'broken', "can't connect",
      'no service', 'phone not working', 'texts not working',
      'calls not working',
    ],
    negations: [],
  },

  compare: {
    phrases: [
      'compare plans', 'side by side', 'family pricing', 'family plan',
      'multiple lines', 'family lines', 'best deal for family',
    ],
    negations: [],
  },

  activate: {
    phrases: [
      'activate sim', 'activate esim', 'activate my phone',
      'set up sim', 'new sim', 'new esim', 'activation',
    ],
    negations: [],
  },

  byop: {
    phrases: [
      'bring my phone', 'bring my own phone', 'byop', 'use my own phone',
      'my own device', 'imei', 'unlocked phone', 'check compatibility',
    ],
    negations: [],
  },
};

/**
 * Classify a free-text message into an intent.
 *
 * Scoring:
 *   - Count how many phrases from each intent match in the message
 *   - Use max matched phrase length as a tiebreaker (longer = more specific)
 *   - A single matching negation blocks the intent entirely
 *
 * @param {string} message
 * @returns {string|null} intent key, or null if no match
 */
export function classifyIntent(message) {
  const lower = message.toLowerCase();
  const scores = {};

  for (const [intent, config] of Object.entries(INTENT_MAP)) {
    const blocked = config.negations.some(n => lower.includes(n));
    if (blocked) continue;

    const matched = config.phrases.filter(p => lower.includes(p));
    if (matched.length > 0) {
      scores[intent] = {
        count: matched.length,
        // Tiebreaker: longer phrase = more specific match = wins
        specificity: Math.max(...matched.map(p => p.length)),
      };
    }
  }

  const ranked = Object.keys(scores).sort((a, b) => {
    if (scores[b].count !== scores[a].count) return scores[b].count - scores[a].count;
    return scores[b].specificity - scores[a].specificity;
  });

  return ranked[0] ?? null;
}
