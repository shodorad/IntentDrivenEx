/**
 * ClearPath AI — Persona Data Structure
 * Source: IDE_Telco_Master_Reference_v1.docx (Part 6 — User Stories for Developer Handoff)
 *
 * Each persona maps to one of the 8 sprint-ready user stories.
 * Used to drive the persona dropdown, mini-dashboard, intent signals,
 * and conversational flow in the prototype.
 *
 * Signal severity levels: 'critical' | 'warning' | 'info'
 * Intent category: 'refill' | 'activate' | 'support' | 'upgrade' | 'addon' | 'compare'
 */

export const PERSONAS = {

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
      device: 'Samsung Galaxy A14',
      deviceStorage: '128 GB',
      deviceStorageUsed: '112 GB',
    },

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

    suggestedActions: [
      { label: 'Quick Refill — $15',  labelEs: 'Recarga Rápida — $15',       action: 'quick_refill' },
      { label: 'Change my plan',       labelEs: 'Cambiar mi plan',             action: 'plan_change' },
      { label: 'I\'m fine for now',    labelEs: 'Por ahora estoy bien',        action: 'dismiss' },
    ],

    conversationContext: 'Maria is running critically low on data with 14 days until renewal. She has hit her data cap almost every single month. Lead with her usage pattern — do not ask her if she runs out often, you already know. Offer a quick refill OR a plan upgrade. Ask which she prefers before doing anything.',
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
      renewalDate: 'Mar 28, 2026',
      daysUntilRenewal: 2,
      autoPayEnabled: false,
      savedCard: 'Mastercard ••••8810',
      rewardsPoints: 680,
      device: 'Motorola Moto G 5G',
      deviceStorage: '64 GB',
      deviceStorageUsed: '41 GB',
    },

    signals: [
      {
        id: 'sig-002-a',
        severity: 'critical',
        icon: '⏰',
        headline: 'Plan expires in 2 days',
        subtext: 'Service will pause on Mar 28 if not renewed.',
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
      { label: 'Renew Total Base 5G — $40',   labelEs: 'Renovar Total Base 5G — $40',  action: 'renew_current' },
      { label: 'Upgrade to Unlimited — $55',  labelEs: 'Cambiar a Ilimitado — $55',    action: 'upgrade_unlimited' },
      { label: 'Enable AutoPay & save $5',     labelEs: 'Activar AutoPago y ahorrar $5', action: 'enable_autopay' },
    ],

    conversationContext: 'Carlos\'s plan expires in 2 days. He has data remaining but service will cut off at expiry. Pre-select his last plan (Total Base 5G at $40) and surface the AutoPay savings opportunity. Do not make him search for renewal options.',
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
      rewardsPoints: 1020,              // above 1000 → can redeem
      device: 'iPhone 13',
      deviceStorage: '128 GB',
      deviceStorageUsed: '98 GB',
    },

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
      { label: 'Quick Refill — $15 data add-on',  labelEs: 'Recarga Rápida — complemento de datos $15', action: 'quick_refill' },
      { label: 'Redeem 1,000 pts for free 5 GB',  labelEs: 'Canjear 1,000 pts por 5 GB gratis',         action: 'redeem_points' },
      { label: 'Renew full plan early — $40',      labelEs: 'Renovar plan completo antes — $40',         action: 'renew_early' },
    ],

    conversationContext: 'Priya is almost out of data and has enough Rewards points to redeem a free data add-on. Surface the points redemption option prominently — she may not know she can use them. Show the confirm-and-pay flow with pre-populated card and 1.5s processing animation.',
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
      device: 'iPhone 15 Pro',          // device detected from SIM kit scan
      deviceStorage: '256 GB',
      deviceStorageUsed: null,
      simType: 'eSIM',
      iccid: null,
      portIn: false,
    },

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

    conversationContext: 'James is a brand new customer. He has not yet activated. Show the welcome/activation path. Offer eSIM (iOS path) as the default since device is iPhone 15 Pro. Do not show any dashboard — it is empty. After activation, show 340 welcome points on the success screen.',
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
    },

    signals: [
      {
        id: 'sig-005-a',
        severity: 'critical',
        icon: '📞',
        headline: '5 support calls this month',
        subtext: 'You\'ve reached out 5 times — let\'s figure this out together.',
      },
      {
        id: 'sig-005-b',
        severity: 'warning',
        icon: '📉',
        headline: 'Average signal: 2 bars',
        subtext: 'Your connection has been consistently weak in your area.',
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

    conversationContext: 'Angela has called support 5 times this month and has persistent signal issues. Do NOT ask her how often she has connectivity problems — you know. Open with empathy and acknowledgment of her support history. Run outage check first. Only suggest plan upgrades after all diagnostic options are exhausted and she confirms nothing has worked.',
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
    },

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
      { label: 'Upgrade to Unlimited — $55/mo',           labelEs: 'Cambiar a Ilimitado — $55/mes',          action: 'upgrade_unlimited' },
      { label: 'Start at next renewal (no charge today)',  labelEs: 'Iniciar en próxima renovación (sin cobro)', action: 'upgrade_at_renewal' },
      { label: 'Just add 5 GB for now — $10',             labelEs: 'Agregar solo 5 GB por ahora — $10',       action: 'data_addon' },
    ],

    conversationContext: 'Derek has hit his data cap 3 months in a row and is currently at 0 GB. The system knows his pattern — lead with it. Say "You hit your cap again" not "Are you running low?". After surfacing the upsell option, give him a choice: upgrade now (prorated) or at next renewal (no charge today). Always ask permission before showing plan cards.',
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
      rewardsPoints: 1200,              // above 1000 → can redeem
      device: 'Samsung Galaxy S23',
      deviceStorage: '256 GB',
      deviceStorageUsed: '140 GB',
      internationalCallsThisMonth: [
        { country: 'Colombia', countryCode: '+57', callCount: 8, minutesUsed: 94 },
        { country: 'Mexico', countryCode: '+52', callCount: 2, minutesUsed: 12 },
      ],
      activeAddons: [],
    },

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
      { label: 'Add Global Calling Card — $10/mo',  labelEs: 'Agregar Tarjeta Global — $10/mes',      action: 'add_calling_card' },
      { label: 'Redeem 1,000 pts — get it free',    labelEs: 'Canjear 1,000 pts — obtenerla gratis',  action: 'redeem_calling_card' },
      { label: 'See all add-ons',                    labelEs: 'Ver todos los complementos',            action: 'browse_addons' },
    ],

    conversationContext: 'Ana is calling Colombia frequently and paying per-minute rates. Surface the Calling Card savings immediately — you know her calling pattern. She also has enough Rewards points to get it for free. Lead with the free redemption option. Do not ask if she makes international calls — you already know.',
  },


  // ─────────────────────────────────────────────────────────────────────────
  // TW-US-008 | Compare all three plans with live family pricing | Intent: Upgrade | P2
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
    },

    signals: [
      {
        id: 'sig-008-a',
        severity: 'info',
        icon: '👨‍👩‍👧‍👦',
        headline: 'You manage 4 lines — all on Total Base',
        subtext: 'Switching to Unlimited could save your family $30/mo at current pricing.',
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

    conversationContext: 'Robert manages 4 lines and has visited the Plans page 3 times this week — he is in comparison mode. Surface the plan compare view immediately with 4-line pricing toggle set. Highlight that Unlimited at 4 lines costs LESS per line than Base. Do not hard-sell — he is exploring. Show the 5-year price guarantee strip.',
  },

};


// ─────────────────────────────────────────────────────────────────────────────
// Helper: Get all personas as an ordered array (for dropdown rendering)
// ─────────────────────────────────────────────────────────────────────────────
export const PERSONA_LIST = Object.values(PERSONAS);


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
