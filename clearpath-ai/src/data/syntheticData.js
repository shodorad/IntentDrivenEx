/**
 * Synthetic Data Fallback for BigQuery Failures
 * Used when BigQuery API is unavailable or fails to load
 */

// Synthetic personas data matching the structure of BigQuery data
export const SYNTHETIC_PERSONAS = [
  {
    id: "us-001",
    name: "Maria Rodriguez",
    avatar: "MR",
    initials: "MR",
    dropdownLabel: "Maria Rodriguez — $45/mo",
    intent_category: "refill",
    urgency: "high",
    account: {
      plan: "Total 5G Unlimited",
      plan_price: 45,
      data_remaining: 2.3,
      data_total: 50,
      data_percent: 4.6,
      hotspot_remaining: 15,
      hotspot_total: 50,
      renewal_date: "2026-05-15",
      days_until_renewal: 8,
      auto_pay_enabled: true,
      saved_card: "Visa ending in 4242",
      rewards_points: 1250,
      rewards_expiring: 250,
      rewards_expiring_days: 15,
      device: "iPhone 14 Pro",
      device_storage: "256GB",
      device_storage_used: "128GB",
      avg_daily_data_usage_gb: 1.8,
      wifi_usage_percent: 65,
      usage_history: [
        { month: "Jan", used: 48.2 },
        { month: "Feb", used: 52.1 },
        { month: "Mar", used: 45.8 },
        { month: "Apr", used: 49.6 }
      ],
      data_cap_hits_last_12_months: 3
    },
    provider_knows: [
      "Customer has hit data cap 3 times in last 12 months",
      "Uses WiFi 65% of the time",
      "Renewal in 8 days"
    ],
    signals: [
      {
        type: "data_low",
        title: "Running Low on Data",
        description: "Only 2.3 GB remaining this month",
        urgency: "high"
      }
    ],
    user_story: "Maria is a heavy data user who frequently runs out before month end",
    suggested_actions: [
      "Upgrade to unlimited plan",
      "Add data boost",
      "Set up WiFi auto-connect"
    ],
    diagnosis_flow: {
      enabled: true,
      intro: "Let's check your data usage patterns",
      steps: [
        { id: 1, title: "Check daily usage", description: "Review your daily data consumption" },
        { id: 2, title: "WiFi usage", description: "Check if you're using WiFi when available" },
        { id: 3, title: "Background apps", description: "Identify apps using data in background" }
      ]
    },
    conversation_context: "Customer is concerned about running out of data"
  },
  {
    id: "us-002",
    name: "Carlos Chen",
    avatar: "CC",
    initials: "CC",
    dropdownLabel: "Carlos Chen — $35/mo",
    intent_category: "support",
    urgency: "medium",
    account: {
      plan: "Total 5G 15GB",
      plan_price: 35,
      data_remaining: 8.7,
      data_total: 15,
      data_percent: 42,
      hotspot_remaining: 8,
      hotspot_total: 15,
      renewal_date: "2026-05-20",
      days_until_renewal: 13,
      auto_pay_enabled: false,
      saved_card: "Mastercard ending in 8921",
      rewards_points: 750,
      rewards_expiring: 100,
      rewards_expiring_days: 20,
      device: "Samsung Galaxy S23",
      device_storage: "256GB",
      device_storage_used: "64GB",
      avg_daily_data_usage_gb: 0.5,
      wifi_usage_percent: 45,
      usage_history: [
        { month: "Jan", used: 12.3 },
        { month: "Feb", used: 14.8 },
        { month: "Mar", used: 15.2 },
        { month: "Apr", used: 13.7 }
      ],
      data_cap_hits_last_12_months: 0
    },
    provider_knows: [
      "Customer has not hit data cap in last 12 months",
      "Uses WiFi 45% of the time",
      "Renewal in 13 days"
    ],
    signals: [
      {
        type: "connectivity",
        title: "Connection Issues",
        description: "Experiencing intermittent connectivity problems",
        urgency: "medium"
      }
    ],
    user_story: "Carlos is having connectivity issues with his current plan",
    suggested_actions: [
      "Check network coverage",
      "Restart device",
      "Contact support"
    ],
    diagnosis_flow: {
      enabled: true,
      intro: "Let's troubleshoot your connection issues",
      steps: [
        { id: 1, title: "Signal strength", description: "Check your signal strength" },
        { id: 2, title: "Network settings", description: "Verify network configuration" }
      ]
    },
    conversation_context: "Customer needs help with connectivity issues"
  }
];

// Synthetic products data
export const SYNTHETIC_PLANS = [
  {
    id: "unlimited-5g",
    name: "Total 5G Unlimited",
    price: 45,
    data_limit_gb: null,
    hotspot_data_gb: 50,
    features: ["Unlimited data", "5G speed", "Mobile hotspot"],
    category: "unlimited"
  },
  {
    id: "15gb-plan",
    name: "Total 5G 15GB",
    price: 35,
    data_limit_gb: 15,
    hotspot_data_gb: 15,
    features: ["5G speed", "Mobile hotspot", "International calling"],
    category: "limited"
  }
];

export const SYNTHETIC_PHONES = [
  {
    id: "iphone-14-pro",
    name: "iPhone 14 Pro",
    brand: "Apple",
    price: 999,
    price_note: "Available with eligible plan",
    camera: "48MP",
    storage: "256GB",
    ram: "6GB",
    battery: "3200mAh",
    display: "6.1\" Super Retina XDR",
    features: ["Pro camera", "A16 chip", "ProMotion display"],
    highlight: "Premium device with advanced features",
    solve_label: "Premium smartphone with professional camera",
    solves: ["photography", "performance", "display"],
    badge: "Premium",
    image: "/phones/iphone-14-pro.jpg",
    url: "https://www.totalwireless.com/all-phones",
    deal_expiry: null,
    deal_limit: null,
    device_id: "iphone-14-pro",
    model: "iPhone 14 Pro",
    storage_gb: 256,
    ram_gb: 6,
    os: "iOS"
  }
];

// Synthetic intent mapping data
export const SYNTHETIC_INTENT_MAP = {
  "data_low": {
    phrases: ["running out of data", "low data", "need more data", "data cap", "no data left"],
    negations: ["not running out", "plenty of data", "enough data"],
    intent_type: "refill"
  },
  "connectivity_issue": {
    phrases: ["no connection", "can't connect", "internet not working", "slow internet", "dropped calls"],
    negations: ["connection is good", "internet working", "fast internet"],
    intent_type: "support"
  },
  "plan_upgrade": {
    phrases: ["upgrade plan", "better plan", "new plan", "change plan", "more expensive"],
    negations: ["happy with plan", "current plan is good"],
    intent_type: "upgrade"
  },
  "international": {
    phrases: ["international calling", "call other countries", "international", "abroad"],
    negations: ["domestic only", "us only"],
    intent_type: "international"
  },
  "browse_phones": {
    phrases: ["new phone", "upgrade phone", "buy phone", "new device"],
    negations: ["happy with phone", "phone is fine"],
    intent_type: "device"
  },
  "rewards_inquiry": {
    phrases: ["rewards points", "loyalty points", "rewards balance", "use points"],
    negations: ["no rewards", "zero points"],
    intent_type: "rewards"
  }
};

// Function to load synthetic data when BigQuery fails
export function loadSyntheticData() {
  console.log('Loading synthetic fallback data...');
  
  // Load synthetic personas
  window.PERSONAS = SYNTHETIC_PERSONAS.reduce((acc, persona) => {
    acc[persona.id] = persona;
    return acc;
  }, {});
  
  window.PERSONA_LIST = SYNTHETIC_PERSONAS;
  
  // Load synthetic intents
  window.INTENT_MAP = SYNTHETIC_INTENT_MAP;
  
  // Load synthetic products
  window.PLANS = SYNTHETIC_PLANS;
  window.PHONES = SYNTHETIC_PHONES;
  
  console.log('Synthetic data loaded:', {
    personas: Object.keys(window.PERSONAS).length,
    intents: Object.keys(window.INTENT_MAP).length,
    plans: window.PLANS.length,
    phones: window.PHONES.length
  });
  
  return true;
}
