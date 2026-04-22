import { fetchPersonas, fetchIntentMap } from '../utils/bigquery';
import { updateIntentMap } from './intentMap';

/**
 * ClearPath AI — Persona Data Structure
 * Source: IDE_Telco_Master_Reference_v1.docx (Part 6 — User Stories for Developer Handoff)
 *
 * Each persona maps to one of the 8 sprint-ready user stories.
 * Used to drive the persona dropdown, mini-dashboard, intent signals,
 * and conversational flow in the prototype.
 *
 * Signal severity levels: 'critical' | 'warning' | 'info'
 * Intent category: 'refill' | 'activate' | 'support' | 'upgrade' | 'addon' | 'compare' | 'phone'
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * CONVERSATION RULES (apply to all personas)
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. NEVER ask a question the provider already has the answer to.
 *    Use providerKnows[] to determine what to present vs. ask.
 * 2. DIAGNOSE BEFORE SELLING. Always try to solve the problem for free first.
 *    Only present a paid option after free/diagnostic options are exhausted.
 * 3. ASK PERMISSION before showing any plan card, refill card, or upsell.
 *    "Would you like to see your options?" — let them say no.
 * 4. ALWAYS give the customer an escape hatch. Let them opt out at any step.
 * 5. SURFACE WHAT YOU KNOW. Lead with the customer's data pattern.
 *    "We see this happening most months" beats "How often does this happen?"
 */


export let PERSONAS = {

  // ─────────────────────────────────────────────────────────────────────────
  // TW-US-001 | View data balance on home screen | Intent: Refill | P1
  // ─────────────────────────────────────────────────────────────────────────
  'us-001': {
    id: 'us-001',
    name: 'Maria R.',
    avatar: 'MR',
    dropdownLabel: 'Maria R. — Running low on data',
    intentCategory: 'refill',
    urgency: 'critical',

    account: {
      plan: 'Total Base 5G',
      planPrice: '$40/mo',
      dataRemaining: '0.8 GB',
      dataTotal: '5 GB',
      dataPercent: 16,                  // below 20% → red meter
      hotspotRemaining: '0 GB',
      hotspotTotal: '0 GB',
      renewalDate: 'Apr 9, 2026',
      daysUntilRenewal: 14,
      autoPayEnabled: false,
      savedCard: 'Visa ••••4291',
      rewardsPoints: 340,
      rewardsExpiring: 120,
      rewardsExpiringDays: 14,
      device: 'Samsung Galaxy A14',
      deviceStorage: '128 GB',
      deviceStorageUsed: '112 GB',
      dataCapHitsLast12Months: 11,
      avgDailyDataUsageGB: 0.28,
      wifiUsagePercent: 22,             // low Wi-Fi → likely burning data on cellular
      usageHistory: [
        { month: 'Nov', used: 5.0 },
        { month: 'Dec', used: 4.8 },
        { month: 'Jan', used: 5.0 },
        { month: 'Feb', used: 4.9 },
        { month: 'Mar', used: 4.2 },
      ],
    },

    // What the provider already knows — NEVER ask the customer about these.
    // Present them as facts, let the customer confirm or correct.
    providerKnows: [
      'current data balance (0.8 GB)',
      'plan renewal date (Apr 9, 2026)',
      'how often she runs out of data (11 of last 12 months)',
      'Wi-Fi usage percentage (22% — mostly cellular)',
      'daily average data usage (~0.28 GB/day)',
      'saved payment card on file (Visa ••••4291)',
      'device model (Samsung Galaxy A14)',
    ],

    signals: [
      {
        id: 'sig-001-a',
        severity: 'critical',
        icon: '📶',
        headline: 'Only 0.8 GB left',
        subtext: 'Your plan renews Apr 9 — 14 days away.',
      },
      {
        id: 'sig-001-b',
        severity: 'warning',
        icon: '🔁',
        headline: 'You ran out of data 11 of the last 12 months',
        subtext: 'A plan change could stop this from happening again.',
      },
      {
        id: 'sig-001-c',
        severity: 'info',
        icon: '📲',
        headline: 'App opened 3 times today with no action',
        subtext: 'Looks like you\'ve been checking your balance. We\'re here when you\'re ready.',
      },
    ],

    userStory: 'As a Total Wireless prepaid customer, I want to see my data balance, hotspot usage, and plan expiry the moment I open the app, so that I always know where I stand without navigating anywhere.',

    // STEP 1: Surface what we know. STEP 2: Offer three paths (diagnose / quick fix / plan change).
    // STEP 3: If diagnose chosen → walk through free tips. STEP 4: Only after that, ask permission to show plans.
    suggestedActions: [
      { label: 'Why am I running out?',    labelEs: 'Por qué se me acaban los datos',  action: 'diagnose_usage' },
      { label: 'Quick Refill — $15',       labelEs: 'Recarga Rápida — $15',             action: 'quick_refill' },
      { label: 'Add 5 GB of data — $10',   labelEs: 'Agregar 5 GB de datos — $10',      action: 'add_data' },
      { label: 'Change my plan',           labelEs: 'Cambiar mi plan',                  action: 'plan_change' },
    ],

    // Free diagnostic path — try these before any paid option
    diagnosisFlow: {
      enabled: true,
      intro: 'We can see you\'re mostly on cellular — only 22% of your usage goes through Wi-Fi. Let\'s see if there\'s a free fix first.',
      steps: [
        {
          id: 'diag-001-1',
          question: 'Are you connected to Wi-Fi when you\'re at home or work?',
          hint: 'Based on your usage, it looks like you may be on cellular even when Wi-Fi is available.',
          quickReplies: ['Yes, always', 'Sometimes', 'I\'m not sure'],
        },
        {
          id: 'diag-001-2',
          question: 'Do you stream video or music on cellular?',
          hint: 'Video streaming on cellular can use 1–3 GB per hour.',
          quickReplies: ['Yes, often', 'Occasionally', 'Rarely'],
        },
        {
          id: 'diag-001-3',
          question: 'Do you have apps set to auto-update or sync in the background?',
          hint: 'Background app refresh is one of the most common hidden data drains.',
          quickReplies: ['Probably yes', 'I\'ve disabled it', 'Not sure'],
        },
      ],
      freeFixSuggestions: [
        'Turn on Wi-Fi Assist settings → disable "Wi-Fi Assist" so cellular doesn\'t kick in automatically',
        'Set video streaming apps (YouTube, Netflix) to Wi-Fi only',
        'Go to Settings → turn off background app refresh for apps you don\'t need',
      ],
      escalationPrompt: 'If those fixes don\'t help, we can look at a plan that gives you more data — or a quick one-time refill to get you through the rest of the month. Want to see your options?',
    },

    conversationContext: `Maria has 0.8 GB left and her plan doesn't renew for 14 days. She has hit her data cap 11 of the last 12 months. Her Wi-Fi usage is only 22% — she is likely burning data on cellular when she doesn't need to.

IMPORTANT RULES FOR THIS CONVERSATION:
- Do NOT ask Maria how often she runs out of data — you already know (11/12 months). State it.
- Do NOT ask what plan she's on — you know (Total Base 5G, $40/mo).
- Open with what you know: "You have 0.8 GB left. We notice this has happened 11 of the last 12 months."
- Offer THREE paths: (1) Diagnose why — try to fix for free first, (2) Quick refill $15, (3) Plan change.
- If she picks diagnose: walk through the diagnosisFlow steps. Suggest free fixes. Only AFTER those are exhausted, ask: "Would you like to see plans that give you more data?"
- If she picks refill or plan change: confirm before processing. Show her saved card (Visa ••••4291) pre-populated.
- Never jump to a recommendation or plan card without asking permission first.`,
  },


  // ─────────────────────────────────────────────────────────────────────────
  // TW-US-002 | Choose plan and amount in refill flow | Intent: Refill | P1
  // ─────────────────────────────────────────────────────────────────────────
  'us-002': {
    id: 'us-002',
    name: 'Carlos M.',
    avatar: 'CM',
    dropdownLabel: 'Carlos M. — Plan expires in 2 days',
    intentCategory: 'refill',
    urgency: 'critical',

    account: {
      plan: 'Total Base 5G',
      planPrice: '$40/mo',
      dataRemaining: '2.1 GB',
      dataTotal: '5 GB',
      dataPercent: 42,                  // amber range
      hotspotRemaining: '0 GB',
      hotspotTotal: '0 GB',
      renewalDate: 'Mar 30, 2026',
      daysUntilRenewal: 2,
      autoPayEnabled: false,
      savedCard: 'Mastercard ••••8810',
      rewardsPoints: 680,
      device: 'Motorola Moto G 5G',
      deviceStorage: '64 GB',
      deviceStorageUsed: '41 GB',
      lastPlan: 'Total Base 5G',        // pre-select this in renewal flow
    },

    providerKnows: [
      'plan expiry date (Mar 30, 2026 — 2 days away)',
      'current data remaining (2.1 GB)',
      'last plan (Total Base 5G — pre-select for renewal)',
      'AutoPay has never been enabled (potential $5/mo savings)',
      'Rewards Points balance (680 — 320 away from free add-on)',
      'saved payment card (Mastercard ••••8810)',
    ],

    signals: [
      {
        id: 'sig-002-a',
        severity: 'critical',
        icon: '⏰',
        headline: 'Plan expires in 2 days',
        subtext: 'Service will pause on Mar 30 if not renewed.',
      },
      {
        id: 'sig-002-b',
        severity: 'info',
        icon: '💰',
        headline: 'AutoPay saves you $5/mo',
        subtext: 'You\'ve never used AutoPay — enabling it saves $60/year.',
      },
      {
        id: 'sig-002-c',
        severity: 'info',
        icon: '🏆',
        headline: '680 Rewards Points ready',
        subtext: 'You\'re 320 points away from a free add-on.',
      },
    ],

    userStory: 'As a Total Wireless prepaid customer with low data, I want to choose a refill plan or data add-on quickly, so that I can restore my service in 3 taps or fewer.',

    suggestedActions: [
      { label: 'Renew Total Base 5G — $40',   labelEs: 'Renovar Total Base 5G — $40',    action: 'renew_current' },
      { label: 'Upgrade to Unlimited',         labelEs: 'Cambiar a Ilimitado',            action: 'upgrade_unlimited' },
      { label: 'Enable AutoPay & save $5',     labelEs: 'Activar AutoPago y ahorrar $5',  action: 'enable_autopay' },
    ],

    diagnosisFlow: {
      enabled: false, // Carlos's problem is expiry, not usage — no diagnosis path needed
    },

    conversationContext: `Carlos's plan expires in 2 days. He has data remaining but service will cut off at expiry. This is time-sensitive — lead with urgency but don't panic him.

IMPORTANT RULES FOR THIS CONVERSATION:
- Do NOT ask Carlos what plan he wants to renew — pre-select his last plan (Total Base 5G at $40) and confirm.
- Surface the AutoPay savings clearly: "By the way, enabling AutoPay saves you $5/mo — want to add it during renewal?"
- Pre-populate his saved card (Mastercard ••••8810) on the payment step — do not ask for card details.
- Do NOT ask if he wants to renew — tell him his plan expires in 2 days and confirm which option he wants.
- After renewal confirmation, mention the rewards points (320 away from a free add-on).`,
  },


  // ─────────────────────────────────────────────────────────────────────────
  // TW-US-003 | Confirm and process refill payment | Intent: Refill | P1
  // ─────────────────────────────────────────────────────────────────────────
  'us-003': {
    id: 'us-003',
    name: 'Priya S.',
    avatar: 'PS',
    dropdownLabel: 'Priya S. — Ready to pay, needs confirmation',
    intentCategory: 'refill',
    urgency: 'high',

    account: {
      plan: 'Total Base 5G',
      planPrice: '$40/mo',
      dataRemaining: '0.3 GB',
      dataTotal: '5 GB',
      dataPercent: 6,
      hotspotRemaining: '0 GB',
      hotspotTotal: '0 GB',
      renewalDate: 'Apr 2, 2026',
      daysUntilRenewal: 7,
      autoPayEnabled: false,
      savedCard: 'Visa ••••3377',
      rewardsPoints: 1020,              // above 1000 → can redeem for free add-on
      device: 'iPhone 13',
      deviceStorage: '128 GB',
      deviceStorageUsed: '98 GB',       // 76% full — surface as context
    },

    providerKnows: [
      'current data balance (0.3 GB — nearly empty)',
      'plan renewal date (Apr 2, 2026)',
      'rewards points balance (1,020 — enough for free 5 GB add-on)',
      'saved payment card (Visa ••••3377)',
      'device storage is 76% full (iPhone 13, 128 GB)',
      'AutoPay is not enabled',
    ],

    signals: [
      {
        id: 'sig-003-a',
        severity: 'critical',
        icon: '🔴',
        headline: 'Nearly out of data — 0.3 GB left',
        subtext: 'Plan renews Apr 2. You may run out before then.',
      },
      {
        id: 'sig-003-b',
        severity: 'warning',
        icon: '🎁',
        headline: '1,020 Rewards Points — free add-on ready',
        subtext: 'You can redeem 1,000 pts for a free 5 GB Data Add-On.',
      },
      {
        id: 'sig-003-c',
        severity: 'info',
        icon: '📦',
        headline: 'Your iPhone 13 storage is 76% full',
        subtext: 'Consider a plan with more hotspot to back up over Wi-Fi.',
      },
    ],

    userStory: 'As a Total Wireless prepaid customer, I want to review my order and pay in one tap, so that I can complete my refill quickly without fear of being overcharged.',

    suggestedActions: [
      { label: 'Redeem 1,000 pts — free 5 GB',    labelEs: 'Canjear 1,000 pts — 5 GB gratis',           action: 'redeem_points' },
      { label: 'Quick Refill — $15 data add-on',  labelEs: 'Recarga Rápida — complemento $15',           action: 'quick_refill' },
      { label: 'Renew full plan early — $40',      labelEs: 'Renovar plan completo antes — $40',          action: 'renew_early' },
    ],

    diagnosisFlow: {
      enabled: false, // Priya is at confirmation stage — she's ready to act, skip diagnosis
    },

    conversationContext: `Priya has only 0.3 GB left and 7 days until renewal. She has 1,020 Rewards points — enough to redeem a FREE 5 GB data add-on. She may not know this is an option.

IMPORTANT RULES FOR THIS CONVERSATION:
- Lead with the FREE option first: "You have 1,020 Rewards Points — that's enough to get a free 5 GB add-on at no charge. Want to use them?"
- Do NOT lead with the paid option. Free redemption is the most affordable path first.
- Pre-populate payment card (Visa ••••3377) on any paid option — do not ask for card details.
- After confirming any option, show the 1.5s processing animation then the iPhone SMS confirmation modal.
- Caption after modal: "Confirmation sent to your phone on file."`,
  },


  // ─────────────────────────────────────────────────────────────────────────
  // TW-US-004 | Activate new SIM or eSIM | Intent: Activate | P1
  // ─────────────────────────────────────────────────────────────────────────
  'us-004': {
    id: 'us-004',
    name: 'James T.',
    avatar: 'JT',
    dropdownLabel: 'James T. — New customer, activating SIM',
    intentCategory: 'activate',
    urgency: 'high',

    account: {
      plan: null,                       // no plan yet
      planPrice: null,
      dataRemaining: null,
      dataTotal: null,
      dataPercent: null,
      hotspotRemaining: null,
      hotspotTotal: null,
      renewalDate: null,
      daysUntilRenewal: null,
      autoPayEnabled: false,
      savedCard: null,
      rewardsPoints: 0,
      device: 'iPhone 15 Pro',          // detected from SIM kit scan
      deviceStorage: '256 GB',
      deviceStorageUsed: null,
      simType: 'eSIM',
      iccid: null,
      portIn: false,
    },

    providerKnows: [
      'device model (iPhone 15 Pro — eSIM compatible)',
      'SIM type selected (eSIM)',
      'account is not yet active',
      '340 welcome points waiting on activation',
    ],

    signals: [
      {
        id: 'sig-004-a',
        severity: 'critical',
        icon: '📱',
        headline: 'SIM not yet activated',
        subtext: 'Let\'s get you connected — takes about 3 minutes.',
      },
      {
        id: 'sig-004-b',
        severity: 'info',
        icon: '🎉',
        headline: '340 Welcome Points waiting for you',
        subtext: 'Activate today and earn 340 Total Rewards points.',
      },
      {
        id: 'sig-004-c',
        severity: 'info',
        icon: '📶',
        headline: 'You\'re on Verizon 5G towers',
        subtext: 'Total Wireless runs on the same network as Verizon — at a fraction of the price.',
      },
    ],

    userStory: 'As a new Total Wireless customer, I want to activate my SIM or eSIM in the app, so that I can start using my service without visiting a store.',

    suggestedActions: [
      { label: 'Activate eSIM on iPhone 15 Pro',       labelEs: 'Activar eSIM en iPhone 15 Pro',        action: 'activate_esim' },
      { label: 'Scan physical SIM instead',             labelEs: 'Escanear SIM físico',                  action: 'scan_sim' },
      { label: 'Port my number from another carrier',   labelEs: 'Portar mi número de otro operador',    action: 'port_in' },
    ],

    diagnosisFlow: {
      enabled: false, // Activation is the goal — no diagnosis needed
    },

    conversationContext: `James is a brand new customer. His account is not yet active. This is a welcome + activation flow.

IMPORTANT RULES FOR THIS CONVERSATION:
- Do NOT show any dashboard — it is empty and will confuse him.
- Default to eSIM activation since device is iPhone 15 Pro (eSIM native). Offer physical SIM as an alternative.
- Do NOT ask James what device he has — you detected it (iPhone 15 Pro). State it and confirm.
- After activation completes: show 340 welcome points on the success screen.
- Keep the tone warm and welcoming — this is his first interaction with the product.`,
  },


  // ─────────────────────────────────────────────────────────────────────────
  // TW-US-005 | Self-serve troubleshooting | Intent: Support | P2
  // ─────────────────────────────────────────────────────────────────────────
  'us-005': {
    id: 'us-005',
    name: 'Angela K.',
    avatar: 'AK',
    dropdownLabel: 'Angela K. — Connectivity issues, called support 5x',
    intentCategory: 'support',
    urgency: 'high',

    account: {
      plan: 'Total Base 5G',
      planPrice: '$40/mo',
      dataRemaining: '3.4 GB',
      dataTotal: '5 GB',
      dataPercent: 68,
      hotspotRemaining: '0 GB',
      hotspotTotal: '0 GB',
      renewalDate: 'Apr 14, 2026',
      daysUntilRenewal: 19,
      autoPayEnabled: true,
      savedCard: 'Mastercard ••••5521',
      rewardsPoints: 210,
      device: 'Samsung Galaxy A54',
      deviceStorage: '128 GB',
      deviceStorageUsed: '67 GB',
      supportCallsThisMonth: 5,
      avgSignalBars: 2,                 // out of 5 — persistently weak
      droppedCallsThisWeek: 4,
      knownOutageInArea: false,         // network check result to surface
      usageHistory: [
        { month: 'Nov', used: 2.8 },
        { month: 'Dec', used: 3.1 },
        { month: 'Jan', used: 2.5 },
        { month: 'Feb', used: 3.4 },
        { month: 'Mar', used: 3.0 },
      ],
    },

    providerKnows: [
      'support call history (5 calls this month)',
      'average signal strength (2 bars — persistently weak)',
      'dropped call count this week (4)',
      'device model (Samsung Galaxy A54)',
      'current plan and data balance',
      'whether there is a known outage in her area',
    ],

    signals: [
      {
        id: 'sig-005-a',
        severity: 'critical',
        icon: '📞',
        headline: '5 support calls this month',
        subtext: 'You\'ve reached out 5 times — let\'s figure this out together.',
      },
      {
        id: 'sig-005-c',
        severity: 'warning',
        icon: '📵',
        headline: '4 dropped calls this week',
        subtext: 'We see a pattern of dropped calls — this may be a known network issue.',
      },
    ],

    userStory: 'As a Total Wireless customer with a service problem, I want to quickly identify and fix my issue without calling support, so that I can resolve it in under 2 minutes.',

    suggestedActions: [
      { label: 'Check for outages in my area',  labelEs: 'Revisar cortes en mi área',          action: 'check_outage' },
      { label: 'Walk me through a fix',          labelEs: 'Guíame para solucionar el problema', action: 'self_fix' },
      { label: 'Talk to someone',                labelEs: 'Hablar con alguien',                 action: 'escalate_support' },
    ],

    // Angela IS the diagnosis persona — the whole flow is diagnostic
    diagnosisFlow: {
      enabled: true,
      intro: 'You\'ve called us 5 times this month and we see your average signal is only 2 bars. Let\'s see if we can fix this without another call.',
      steps: [
        {
          id: 'diag-005-1',
          action: 'outage_check',
          label: 'Checking for known outages in your area...',
          resolution: 'No active outages found near you.',
        },
        {
          id: 'diag-005-2',
          question: 'Have you tried restarting your device recently?',
          hint: 'A restart clears network state and resolves most connectivity issues.',
          quickReplies: ['Yes, still the same', 'No, let me try', 'I restart it often'],
        },
        {
          id: 'diag-005-3',
          question: 'Is your issue worse indoors or about the same everywhere?',
          hint: 'Building materials block signals. Outdoors signal should be stronger.',
          quickReplies: ['Worse indoors', 'Same everywhere', 'Not sure'],
        },
        {
          id: 'diag-005-4',
          question: 'Have you checked that your SIM card is seated properly in your Samsung Galaxy A54?',
          hint: 'A loose SIM is a common cause of intermittent signal drops.',
          quickReplies: ['Yes, it\'s seated', 'Let me check', 'How do I check?'],
        },
      ],
      freeFixSuggestions: [
        'Restart your device — clears network registration issues',
        'Toggle Airplane Mode on for 10 seconds, then off — forces a fresh tower connection',
        'Move to a window or step outside — building materials reduce signal by 1–2 bars',
        'Check SIM card seating: power off, remove, reseat, power on',
        'Go to Settings → Connections → Mobile Networks → Network Mode → set to "LTE/3G/2G (auto connect)"',
      ],
      escalationPrompt: 'We\'ve gone through all the free fixes. If the problem is still happening, it may be a coverage issue in your area or a device-level problem. Want to look at options that might help — like a plan with Wi-Fi calling, or connecting with our network team?',
    },

    conversationContext: `Angela has called support 5 times this month. She has persistent signal issues — 2-bar average and 4 dropped calls this week. She is frustrated.

IMPORTANT RULES FOR THIS CONVERSATION:
- Do NOT ask Angela how many times she's called — you know (5 times). Open with empathy: "We can see you've had to call us 5 times this month. That's not okay, and we want to fix it."
- Do NOT ask how often she has connectivity problems — you know. State what you see.
- Run outage check silently in the background — surface the result proactively.
- Go through all diagnostic steps before suggesting any paid option or plan change.
- Only after all diagnostic steps are exhausted and she confirms none worked: ask "Would you like to look at options that might help?" — then show escalation options.
- Do NOT suggest an upgrade as a fix for connectivity unless explicitly asked. Connectivity issues are usually not solved by plan upgrades.`,
  },


  // ─────────────────────────────────────────────────────────────────────────
  // TW-US-006 | Smart upsell — upgrade intent from home screen | Intent: Upgrade | P2
  // ─────────────────────────────────────────────────────────────────────────
  'us-006': {
    id: 'us-006',
    name: 'Derek W.',
    avatar: 'DW',
    dropdownLabel: 'Derek W. — Hit data cap 3 months in a row',
    intentCategory: 'upgrade',
    urgency: 'upsell',

    account: {
      plan: 'Total Base 5G',
      planPrice: '$40/mo',
      dataRemaining: '0 GB',
      dataTotal: '5 GB',
      dataPercent: 0,
      hotspotRemaining: '0 GB',
      hotspotTotal: '0 GB',
      renewalDate: 'Apr 5, 2026',
      daysUntilRenewal: 10,
      autoPayEnabled: true,
      savedCard: 'Visa ••••1144',
      rewardsPoints: 890,
      device: 'Google Pixel 8',
      deviceStorage: '128 GB',
      deviceStorageUsed: '88 GB',
      capHitsLast3Months: 3,            // hit cap all 3 months
      capHitsLast12Months: 10,
      estimatedMonthlyDataBoostSpend: 150, // ~$150/yr on boosts that could be avoided
      avgDailyDataUsageGB: 0.35,
      wifiUsagePercent: 35,
    },

    providerKnows: [
      'data cap hit 3 months in a row (and 10 of last 12)',
      'currently at 0 GB — cap hit again',
      'estimated annual overage spend (~$150/yr on data boosts)',
      'Unlimited plan is only $15 more per month',
      'AutoPay is already enabled',
      'Rewards Points balance (890)',
      'device (Google Pixel 8)',
      'Wi-Fi usage (35% — room to optimize but pattern suggests genuine heavy usage)',
    ],

    signals: [
      {
        id: 'sig-006-a',
        severity: 'critical',
        icon: '🚫',
        headline: 'You hit your data cap again — 0 GB left',
        subtext: 'This is the 3rd month in a row. Unlimited is only $15 more — no caps, ever.',
      },
      {
        id: 'sig-006-b',
        severity: 'warning',
        icon: '📊',
        headline: 'Cap hit 10 of the last 12 months',
        subtext: 'You\'re spending at least $150/year on data boosts you could avoid.',
      },
      {
        id: 'sig-006-c',
        severity: 'info',
        icon: '▶️',
        headline: 'Unlimited includes Disney+',
        subtext: 'Upgrading activates Disney+ — a $7.99/mo value included at no extra cost.',
      },
    ],

    userStory: 'As a Total Wireless customer who consistently hits my data cap, I want the app to proactively suggest a better plan, so that I can upgrade without searching for the option myself.',

    suggestedActions: [
      { label: 'Why do I keep hitting my cap?',            labelEs: '¿Por qué sigo alcanzando el límite?',    action: 'diagnose_usage' },
      { label: 'Upgrade to Unlimited',                     labelEs: 'Cambiar a Ilimitado',                   action: 'upgrade_unlimited' },
      { label: 'Start at next renewal (no charge today)', labelEs: 'Iniciar en próxima renovación',           action: 'upgrade_at_renewal' },
    ],

    // Diagnosis is offered but given the 10/12 pattern, we can acknowledge it likely won't fully resolve
    diagnosisFlow: {
      enabled: true,
      intro: 'You\'ve hit your cap 10 of the last 12 months. We can look at some usage tips, though with your pattern it may be that your plan simply doesn\'t match how you use your phone.',
      steps: [
        {
          id: 'diag-006-1',
          question: 'Do you stream video often on cellular — not just on Wi-Fi?',
          hint: 'HD video streaming can use up to 3 GB per hour on cellular.',
          quickReplies: ['Yes, a lot', 'Sometimes', 'Rarely'],
        },
        {
          id: 'diag-006-2',
          question: 'Do you use your phone as a hotspot for other devices?',
          hint: 'Hotspot usage counts toward your data — it can drain data fast.',
          quickReplies: ['Yes, regularly', 'Occasionally', 'Never'],
        },
      ],
      freeFixSuggestions: [
        'Set YouTube and Netflix to "Wi-Fi only" in their settings',
        'Check which apps use the most data: Settings → Network → Data Usage',
        'Disable background data for high-usage apps you don\'t need updating constantly',
      ],
      escalationPrompt: 'Given that you\'ve hit your cap 10 of the last 12 months, optimizing usage may not be enough. Upgrading to Unlimited would save you roughly $150/year in data boost costs. Want to look at your options? You can upgrade now or schedule it for your next renewal with no charge today.',
    },

    conversationContext: `Derek has hit his data cap 3 months in a row and 10 of the last 12 months. He is at 0 GB right now. His pattern strongly suggests his plan doesn't match his usage.

IMPORTANT RULES FOR THIS CONVERSATION:
- Do NOT ask Derek if he runs out of data — you know he does. Open with: "You hit your cap again — that's the 3rd month in a row."
- Offer the diagnosis path first as an option, but acknowledge the pattern: "We can look at usage tips, though with 10 out of 12 months hitting the cap, it may just be that Unlimited is the right fit."
- After diagnosis (or if he skips it): "Want to see your upgrade options? You can upgrade now or set it to kick in at your next renewal — no charge today."
- Always give him the choice: upgrade now (prorated) OR upgrade at renewal (no cost today).
- Do NOT show a plan card without asking permission first.
- AutoPay is already on — acknowledge this saves him $5/mo which is already factored in.`,
  },


  // ─────────────────────────────────────────────────────────────────────────
  // TW-US-007 | Browse and purchase international add-ons | Intent: Add-on | P2
  // ─────────────────────────────────────────────────────────────────────────
  'us-007': {
    id: 'us-007',
    name: 'Ana G.',
    avatar: 'AG',
    dropdownLabel: 'Ana G. — International caller, Colombia',
    intentCategory: 'addon',
    urgency: 'medium',

    account: {
      plan: 'Total Base 5G',
      planPrice: '$40/mo',
      dataRemaining: '3.2 GB',
      dataTotal: '5 GB',
      dataPercent: 64,
      hotspotRemaining: '0 GB',
      hotspotTotal: '0 GB',
      renewalDate: 'Apr 11, 2026',
      daysUntilRenewal: 16,
      autoPayEnabled: true,
      savedCard: 'Visa ••••9902',
      rewardsPoints: 1200,              // above 1000 → can redeem for free calling card
      device: 'Samsung Galaxy S23',
      deviceStorage: '256 GB',
      deviceStorageUsed: '140 GB',
      internationalCallsThisMonth: [
        { country: 'Colombia', countryCode: '+57', callCount: 8, minutesUsed: 94 },
        { country: 'Mexico',   countryCode: '+52', callCount: 2, minutesUsed: 12  },
      ],
      activeAddons: [],
      estimatedIntlChargesThisMonth: 28, // per-minute charges without add-on
    },

    providerKnows: [
      'international call history (8 calls to Colombia, 94 min; 2 calls to Mexico, 12 min)',
      'estimated per-minute charges this month (~$28)',
      'Global Calling Card would save ~$18/mo on Colombia calls',
      'Rewards Points balance (1,200 — enough for free Calling Card)',
      'no active add-ons',
      'saved payment card (Visa ••••9902)',
    ],

    signals: [
      {
        id: 'sig-007-a',
        severity: 'warning',
        icon: '🌎',
        headline: 'You called Colombia 8 times this month',
        subtext: 'The $10 Global Calling Card saves up to $18/mo on Colombia calls.',
      },
      {
        id: 'sig-007-b',
        severity: 'info',
        icon: '🏆',
        headline: '1,200 Rewards Points — redeem for a free add-on',
        subtext: 'You have enough points to get the Global Calling Card at no cost.',
      },
      {
        id: 'sig-007-c',
        severity: 'info',
        icon: '📞',
        headline: 'Also called Mexico twice this month',
        subtext: 'The Calling Card covers 200+ countries including Mexico.',
      },
    ],

    userStory: 'As a Total Wireless customer making international calls, I want to find and add the right add-on in one place, so that I can extend my service without changing my plan.',

    suggestedActions: [
      { label: 'Redeem 1,000 pts — get it free',    labelEs: 'Canjear 1,000 pts — obtenerla gratis',  action: 'redeem_calling_card' },
      { label: 'Add Global Calling Card — $10/mo',  labelEs: 'Agregar Tarjeta Global — $10/mes',      action: 'add_calling_card' },
      { label: 'See all calling options',             labelEs: 'Ver todas las opciones de llamadas',    action: 'browse_addons' },
    ],

    diagnosisFlow: {
      enabled: false, // Ana's need is clear — international calling. No diagnosis needed.
    },

    conversationContext: `Ana makes frequent international calls to Colombia (8 this month, 94 minutes) and Mexico (2 calls). She is paying per-minute rates. She has 1,200 Rewards points — enough to get the Global Calling Card for FREE.

IMPORTANT RULES FOR THIS CONVERSATION:
- Do NOT ask Ana if she makes international calls — you know she does (8 to Colombia this month). State it.
- Lead with the FREE option: "You have enough Rewards points to get the Global Calling Card at no cost."
- Surface the savings math: "At per-minute rates, you've likely spent ~$28 this month. The Calling Card is $10/mo — or free with your points."
- Do NOT ask which countries she calls — you know (Colombia, Mexico). The Calling Card covers both.
- After she picks an option, confirm with her saved card (Visa ••••9902) pre-populated for paid option, or points balance for free redemption.`,
  },


  // ─────────────────────────────────────────────────────────────────────────
  // TW-US-008 | Compare all three plans with live family pricing | Intent: Compare | P2
  // ─────────────────────────────────────────────────────────────────────────
  'us-008': {
    id: 'us-008',
    name: 'Robert L.',
    avatar: 'RL',
    dropdownLabel: 'Robert L. — Comparing plans, 4-line family',
    intentCategory: 'compare',
    urgency: 'low',

    account: {
      plan: 'Total Base 5G',
      planPrice: '$40/mo',
      dataRemaining: '4.1 GB',
      dataTotal: '5 GB',
      dataPercent: 82,
      hotspotRemaining: '0 GB',
      hotspotTotal: '0 GB',
      renewalDate: 'Apr 20, 2026',
      daysUntilRenewal: 25,
      autoPayEnabled: false,
      savedCard: 'Mastercard ••••6633',
      rewardsPoints: 560,
      device: 'iPhone 14',
      deviceStorage: '128 GB',
      deviceStorageUsed: '72 GB',
      familyLines: 4,
      planPageVisitsThisWeek: 3,        // strong compare intent signal
      currentMonthlySpend: 160,         // 4 lines × $40
      potentialSavingsUnlimited: 50,    // 4 lines × $27.50 vs $40
    },

    providerKnows: [
      '4 lines currently managed — all on Total Base 5G',
      'current monthly spend ($160 for 4 lines)',
      'visited Plans page 3 times this week (comparison intent)',
      'Unlimited at 4 lines is $27.50/line — LESS per line than Base at $40',
      'AutoPay not enabled (potential $5/mo per line savings)',
      'Rewards Points balance (560)',
    ],

    signals: [
      {
        id: 'sig-008-a',
        severity: 'info',
        icon: '👨‍👩‍👧‍👦',
        headline: 'You manage 4 lines — all on Total Base',
        subtext: 'Switching to Unlimited could save your family $50/mo at current pricing.',
      },
      {
        id: 'sig-008-b',
        severity: 'info',
        icon: '🔍',
        headline: 'You\'ve visited Plans 3 times this week',
        subtext: 'Looks like you\'re comparing options. Here\'s a side-by-side breakdown.',
      },
      {
        id: 'sig-008-c',
        severity: 'info',
        icon: '🔒',
        headline: '5-year price guarantee on all plans',
        subtext: 'Total Wireless locks your rate for 5 years — no surprise increases.',
      },
    ],

    userStory: 'As a Total Wireless customer considering a plan change, I want to see all plans side-by-side with feature differences and family pricing, so that I can make an informed decision without calling support.',

    planComparison: {
      lines: 4,
      plans: [
        {
          name: 'Total Base 5G',
          pricePerLine: 40,
          totalFor4Lines: 160,
          perLineAt4: 40,
          isCurrent: true,
          badge: 'Your plan',
          data: '5 GB',
          hotspot: 'None',
          disney: false,
          priceGuarantee: true,
        },
        {
          name: 'Total 5G Unlimited',
          pricePerLine: 55,
          totalFor4Lines: 110,
          perLineAt4: 27.50,
          isCurrent: false,
          badge: 'Most popular',
          recommended: true,
          data: 'Unlimited',
          hotspot: '15 GB',
          disney: true,
          priceGuarantee: true,
        },
        {
          name: 'Total 5G+ Unlimited',
          pricePerLine: 65,
          totalFor4Lines: 130,
          perLineAt4: 32.50,
          isCurrent: false,
          badge: null,
          data: 'Unlimited',
          hotspot: '50 GB',
          disney: true,
          priceGuarantee: true,
        },
      ],
    },

    suggestedActions: [
      { label: 'See side-by-side plan comparison',  labelEs: 'Ver comparación de planes',            action: 'compare_plans' },
      { label: 'Calculate 4-line family pricing',   labelEs: 'Calcular precio familiar de 4 líneas', action: 'family_pricing' },
      { label: 'Upgrade to Unlimited',              labelEs: 'Cambiar a Ilimitado',                  action: 'upgrade_unlimited' },
    ],

    diagnosisFlow: {
      enabled: false, // Robert is in exploration mode — no problem to diagnose.
    },

    conversationContext: `Robert manages 4 lines and has visited the Plans page 3 times this week — he is in research and comparison mode. He is not in a crisis — do not create urgency that isn't there.

IMPORTANT RULES FOR THIS CONVERSATION:
- Do NOT ask Robert how many lines he manages — you know (4 lines, all on Total Base 5G).
- Do NOT hard-sell. He is exploring. Surface information, don't push.
- Lead with the counterintuitive insight: "At 4 lines, Unlimited is actually $27.50 per line — less than what you're paying now at $40/line."
- Show the plan comparison table with 4-line pricing toggle set by default.
- Show the 5-year price guarantee strip — this is a strong trust signal for families.
- Let him ask questions. Answer them. When he's ready, ask if he'd like to make a change.
- Do NOT show a payment flow unless he explicitly says he wants to upgrade.`,
  },


  // ─────────────────────────────────────────────────────────────────────────
  // US-009 | Phone Buyer | Intent: Phone | P3
  // ─────────────────────────────────────────────────────────────────────────
  'us-009': {
    id: 'us-009',
    name: 'Alex T.',
    avatar: 'AT',
    dropdownLabel: 'Alex T. — Wants to buy a new phone',
    intentCategory: 'phone',
    urgency: 'moderate',

    account: {
      plan: 'Total 5G Unlimited',
      planPrice: '$50/mo',
      dataRemaining: '∞',
      dataTotal: '35 GB',
      dataPercent: 100,
      renewalDate: 'Apr 18, 2026',
      daysUntilRenewal: 18,
      autoPayEnabled: true,
      savedCard: 'Visa ••••7823',
      rewardsPoints: 2450,
      device: 'iPhone 12 (3 years old)',
      deviceStorage: '64 GB',
      deviceStorageUsed: '58 GB',
      activeAddons: ['wireless-protect'],
      usageHistory: [
        { month: 'Nov', used: 28.5 },
        { month: 'Dec', used: 32.1 },
        { month: 'Jan', used: 29.8 },
        { month: 'Feb', used: 31.4 },
        { month: 'Mar', used: 30.2 },
      ],
    },

    providerKnows: [
      'current device (iPhone 12 — 3 years old, 91% storage full)',
      'on Unlimited plan — qualifies for device deals',
      'rewards points (2,450)',
      'saved payment card (Visa ••••7823)',
      'AutoPay active — already getting $5/mo discount',
    ],

    signals: [
      {
        id: 'sig-009-a',
        severity: 'warning',
        icon: '📱',
        headline: 'Your iPhone 12 is 3 years old',
        subtext: 'Storage is 91% full. You qualify for device upgrade deals.',
      },
      {
        id: 'sig-009-b',
        severity: 'info',
        icon: '🏆',
        headline: '2,450 Rewards Points',
        subtext: 'Enough for $25 off your next device.',
      },
    ],

    suggestedActions: [
      { label: 'Show me new phones', action: 'browse_phones' },
      { label: 'What deals do I qualify for?', action: 'check_deals' },
      { label: 'Compare iPhone vs Samsung', action: 'compare_phones' },
    ],

    diagnosisFlow: { enabled: false },

    conversationContext: `Alex has an iPhone 12 that is 3 years old and 91% full on storage. He's on Unlimited, which qualifies for the best device deals. He has 2,450 rewards points.

IMPORTANT RULES:
- Do NOT ask what phone he has — you know (iPhone 12, 3 years old).
- Lead with: "Your iPhone 12 is getting up there — 3 years and 91% full on storage."
- Show device options from most affordable first.
- He qualifies for free phones (Moto G Stylus, Galaxy A17) and deal phones (iPhone 13 at $49.99).
- Ask about preferences: brand (Apple vs Samsung), budget, what matters most (camera, storage, battery).
- After he picks, confirm specs, show price, process the order.
- Apply rewards points automatically: "I'll apply your 2,450 points — that's $25 off."`,
  },


  // ─────────────────────────────────────────────────────────────────────────
  // US-010 | New Activation | Intent: Activate | P2
  // ─────────────────────────────────────────────────────────────────────────
  'us-010': {
    id: 'us-010',
    name: 'Nina P.',
    avatar: 'NP',
    dropdownLabel: 'Nina P. — New Activation',
    intentCategory: 'activate',
    urgency: 'high',

    account: {
      plan: null,
      device: 'Moto G Stylus 2025 (just purchased)',
      simType: 'physical SIM',
    },

    providerKnows: [
      'device model (Moto G Stylus 2025 — just purchased)',
      'SIM type (physical SIM)',
    ],

    signals: [
      {
        id: 'sig-010-a',
        severity: 'info',
        icon: '✅',
        headline: 'Ready to activate your new phone?',
        subtext: 'Takes about 5 minutes. Your number transfers automatically.',
      },
    ],

    suggestedActions: [
      { label: 'Activate my new phone',    labelEs: 'Activar mi nuevo teléfono',     action: 'activate_phone' },
      { label: 'Port my current number',   labelEs: 'Transferir mi número actual',   action: 'port_number' },
      { label: 'Pick a plan',              labelEs: 'Elegir un plan',                action: 'pick_plan' },
    ],

    diagnosisFlow: { enabled: false },

    conversationContext: `Nina just bought a Moto G Stylus 2025 with a physical SIM. She needs to activate it on Total Wireless.
Guide her through: (1) confirm physical SIM — she already has it; (2) ask if porting a number or getting a new number; (3) collect ZIP code for coverage confirmation; (4) recommend Total Base 5G Unlimited at $20/mo as most affordable; (5) trigger [ACTIVATION_FLOW].
Do NOT ask about device or SIM type — you already know both.`,
  },

};


// ─────────────────────────────────────────────────────────────────────────────
// Helper: Get all personas as an ordered array (for dropdown rendering)
// ─────────────────────────────────────────────────────────────────────────────
export let PERSONA_LIST = Object.values(PERSONAS);


// ─────────────────────────────────────────────────────────────────────────────
// Helper: Resolve persona from URL params
// Usage: getPersonaFromURL() → persona object or default (us-001)
// Supports: ?persona=maria | ?persona=us-001 | ?user=1 | /us-001 path
// ─────────────────────────────────────────────────────────────────────────────
export function getPersonaFromURL() {
  if (typeof window === 'undefined') return PERSONAS['us-001'];

  const params = new URLSearchParams(window.location.search);
  const raw = (
    params.get('persona') ||
    params.get('user') ||
    window.location.pathname.split('/').filter(Boolean).pop()
  );

  if (!raw) return PERSONAS['us-001'];

  const key = raw.toLowerCase();

  // Named aliases → persona IDs
  const ALIASES = {
    'maria':   'us-001',
    '1':       'us-001',
    'carlos':  'us-002',
    '2':       'us-002',
    'priya':   'us-003',
    '3':       'us-003',
    'james':   'us-004',
    '4':       'us-004',
    'angela':  'us-005',
    '5':       'us-005',
    'derek':   'us-006',
    '6':       'us-006',
    'ana':     'us-007',
    '7':       'us-007',
    'robert':  'us-008',
    '8':       'us-008',
    'alex':    'us-009',
    '9':       'us-009',
    'nina':    'us-010',
    '10':      'us-010',
  };

  const resolvedKey = ALIASES[key] || key;
  return PERSONAS[resolvedKey] || PERSONAS['us-001'];
}


// ─────────────────────────────────────────────────────────────────────────────
// Helper: Get meter color class from data percentage
// ─────────────────────────────────────────────────────────────────────────────
export function getDataMeterColor(percent) {
  if (percent === null || percent === undefined) return 'neutral';
  if (percent > 50)  return 'green';
  if (percent > 20)  return 'amber';
  return 'red';
}


// ─────────────────────────────────────────────────────────────────────────────
// Helper: Get all providerKnows facts as a formatted string for AI system prompt
// Usage: getProviderContext(persona) → string injected into system prompt
// ─────────────────────────────────────────────────────────────────────────────
export function getProviderContext(persona) {
  if (!persona?.providerKnows?.length) return '';
  return `The provider already knows the following about this customer. DO NOT ask about these — state them:\n${persona.providerKnows.map(f => `• ${f}`).join('\n')}`;
}

// Helper: Get persona by ID
export function getPersonaById(id) {
  return PERSONAS[id] || null;
}

// Load persona data from BigQuery; falls back to static PERSONAS on failure.
export async function initializePersonaData() {
  try {
    const data = await fetchPersonas();
    PERSONAS = data.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
    PERSONA_LIST = data;
    console.log('Persona data initialized from BigQuery:', { personas: data.length });
  } catch (error) {
    console.warn('BigQuery persona load failed — using static fallback:', error.message);
    // Static PERSONAS + PERSONA_LIST already populated at module load; no-op.
  }
}

// Load intent mapping from BigQuery; falls back to static intentMap.js on failure.
export async function initializeIntentMapData() {
  try {
    const data = await fetchIntentMap();
    if (data && Object.keys(data).length > 0) {
      updateIntentMap(data);
      console.log('Intent mapping initialized from BigQuery:', { intents: Object.keys(data).length });
    }
  } catch (error) {
    console.warn('BigQuery intent map load failed — using static intentMap.js fallback:', error.message);
  }
}
