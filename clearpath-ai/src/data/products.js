import { fetchPlans, fetchDevices } from '../utils/bigquery';

// Dynamic data from BigQuery
export let PLANS = [];
export let PHONES = [];
export let ADDONS = [];
export let DEALS = [];

// Initialize data from BigQuery
export async function initializeProductData() {
  try {
    PLANS = await fetchPlans();
    PHONES = await fetchDevices();
    
    // Generate add-ons based on plans
    ADDONS = [
      {
        id: "data-5gb",
        name: "5GB Data Add-On",
        price: 10,
        description: "Add 5GB of high-speed data — no plan change needed",
        solves: ["data-runs-out", "slow-data"]
      },
      {
        id: "data-15gb",
        name: "15GB Data Add-On",
        price: 20,
        description: "Add 15GB of high-speed data this cycle",
        solves: ["data-runs-out", "heavy-use"]
      },
      {
        id: "global-calling",
        name: "Global Calling Card",
        price: 10,
        description: "International calling to 85+ countries",
        solves: ["international", "calling"]
      }
    ];

    // Generate deals based on phones and plans
    DEALS = PHONES
      .filter(phone => phone.price === 0 || phone.badge?.includes('Deal'))
      .map(phone => ({
        id: `${phone.id}-deal`,
        name: phone.name,
        headline: phone.price === 0 ? `${phone.name} — Free` : `${phone.name} — ${phone.badge}`,
        subtext: phone.priceNote || 'Requires eligible plan',
        badge: phone.price === 0 ? 'Free Phone' : 'Deal',
        expiry: phone.dealExpiry,
        requiresPlan: phone.price === 0 ? '5g-unlimited' : '5g-plus-unlimited',
        phoneId: phone.id,
        url: phone.url || 'https://www.totalwireless.com/deals'
      }));

    console.log('Product data initialized from BigQuery:', { 
      plans: PLANS.length, 
      phones: PHONES.length,
      deals: DEALS.length 
    });
  } catch (error) {
    console.error('Failed to initialize product data from BigQuery:', error);
    
    // Load synthetic fallback data
    console.log('Loading synthetic product data as fallback...');
    const { SYNTHETIC_PLANS, SYNTHETIC_PHONES } = await import('./syntheticData.js');
    PLANS = SYNTHETIC_PLANS;
    PHONES = SYNTHETIC_PHONES;
    ADDONS = FALLBACK_ADDONS;
    DEALS = PHONES
      .filter(phone => phone.price === 0 || phone.badge?.includes('Deal'))
      .map(phone => ({
        id: `${phone.id}-deal`,
        name: phone.name,
        headline: phone.price === 0 ? `${phone.name} — Free` : `${phone.name} — ${phone.badge}`,
        subtext: phone.priceNote || 'Requires eligible plan',
        badge: phone.price === 0 ? 'Free Phone' : 'Deal',
        expiry: phone.dealExpiry,
        requiresPlan: phone.price === 0 ? '5g-unlimited' : '5g-plus-unlimited',
        phoneId: phone.id,
        url: phone.url || 'https://www.totalwireless.com/deals'
      }));
    console.log('Using fallback synthetic data due to BigQuery failure');
  }
}

// Static fallback data (will be used only if BigQuery fails)
const FALLBACK_PLANS = [
  {
    id: "base-5g",
    name: "Total Base 5G Unlimited",
    price: 20,
    priceNote: "with BYOP + Auto Pay (5-yr price guarantee)",
    data: "Unlimited",
    hotspot: "5GB",
    talk: "Unlimited",
    text: "Unlimited",
    network: "5G",
    international: "85+ countries",
    videoStreaming: "480p",
    features: [
      "Unlimited Talk, Text & Data",
      "5GB Mobile Hotspot",
      "85+ Countries International",
      "On Verizon's 5G Network",
      "5-Year Price Guarantee"
    ],
    highlight: "Most affordable — $20/mo guaranteed for 5 years",
    solveLabel: "Lowest bill possible — unlimited data, guaranteed price",
    solves: ["cost", "data-runs-out", "light-use", "moderate-use", "byop"],
    badge: "Best Deal",
    dealNote: "Tax Time Deal — BYOP + Auto Pay required",
    url: "https://www.totalwireless.com/plans",
    tier: "base",
    data_limit_gb: null,
    hotspot_limit_gb: 5,
    international_countries: 85
  },
  {
    id: "5g-unlimited",
    name: "Total 5G Unlimited",
    price: 55,
    priceNote: "per line / month",
    data: "Unlimited",
    hotspot: "15GB",
    talk: "Unlimited",
    text: "Unlimited",
    network: "5G",
    international: "180+ countries",
    videoStreaming: "HD",
    features: [
      "Unlimited Talk, Text & Data",
      "15GB Mobile Hotspot",
      "180+ Countries International",
      "Disney+ 6 Months Included",
      "On Verizon's 5G Network"
    ],
    highlight: "More hotspot + Disney+ — great for families",
    solveLabel: "15GB hotspot + Disney+ included — mid-tier value",
    solves: ["hotspot", "streaming", "family", "heavy-use", "international"],
    badge: "Most Popular",
    dealNote: "Includes 6-month Disney+ Premium",
    url: "https://www.totalwireless.com/plans",
    tier: "standard",
    data_limit_gb: null,
    hotspot_limit_gb: 15,
    international_countries: 180
  },
  {
    id: "5g-plus-unlimited",
    name: "Total 5G+ Unlimited",
    price: 65,
    priceNote: "per line / month",
    data: "Unlimited",
    hotspot: "Unlimited",
    talk: "Unlimited",
    text: "Unlimited",
    network: "5G",
    international: "180+ countries",
    videoStreaming: "4K UHD",
    features: [
      "Unlimited Talk, Text & Data",
      "Unlimited Mobile Hotspot",
      "180+ Countries International",
      "$10 International Roaming Credit",
      "On Verizon's 5G Network"
    ],
    highlight: "Premium — unlimited hotspot + required for device deals",
    solveLabel: "Unlimited hotspot + premium 5G — best for heavy users",
    solves: ["hotspot", "streaming", "premium", "heavy-use", "international", "device-deal"],
    badge: null,
    dealNote: "Required for iPhone 17e, Galaxy S26, iPhone 13 $49.99 deals",
    url: "https://www.totalwireless.com/plans",
    tier: "premium",
    data_limit_gb: null,
    hotspot_limit_gb: null,
    international_countries: 180
  }
];

// Export fallback phones for emergency use
export const FALLBACK_PHONES = [
  {
    id: "moto-g-stylus-2025",
    name: "Moto G Stylus 2025",
    brand: "Motorola",
    price: 0,
    priceNote: "Free with Total 5G Unlimited (3 months)",
    camera: "50MP",
    storage: "256GB",
    ram: "8GB",
    battery: "5000mAh",
    display: '6.7" FHD+ AMOLED',
    features: ["Built-in Stylus", "50MP Camera", "256GB Storage", "8GB RAM", "5000mAh Battery", "Free with eligible plan"],
    highlight: "Free — best value new phone",
    solveLabel: "Free phone with plan — stylus + 256GB storage",
    solves: ["cost", "storage", "new-phone", "camera"],
    badge: "Free",
    image: "/phones/moto-g-stylus.jpg",
    url: "https://www.totalwireless.com/all-phones",
    dealExpiry: null,
    dealLimit: null,
    device_id: "moto-g-stylus-2025",
    model: "Moto G Stylus 2025",
    storage_gb: 256,
    ram_gb: 8,
    os: "Android"
  },
  {
    id: "samsung-galaxy-a17-5g",
    name: "Samsung Galaxy A17 5G",
    brand: "Samsung",
    price: 0,
    priceNote: "Free with eligible plan",
    camera: "50MP",
    storage: "128GB",
    ram: "4GB",
    battery: "5000mAh",
    display: '6.5" FHD+',
    features: ["50MP Camera", "5G Capable", "128GB Storage", "5000mAh Battery", "Samsung quality"],
    highlight: "Free Samsung — solid everyday phone",
    solveLabel: "Free Samsung 5G phone — reliable daily driver",
    solves: ["cost", "new-phone", "slow-phone"],
    badge: "Free",
    image: "/phones/samsung-a15.jpg",
    url: "https://www.totalwireless.com/all-phones",
    dealExpiry: null,
    dealLimit: null,
    device_id: "samsung-galaxy-a17-5g",
    model: "Samsung Galaxy A17 5G",
    storage_gb: 128,
    ram_gb: 4,
    os: "Android"
  },
  {
    id: "iphone-13",
    name: "iPhone 13",
    brand: "Apple",
    price: 49.99,
    priceNote: "$49.99 with Total 5G+ Unlimited (3 months required)",
    camera: "12MP dual",
    storage: "128GB",
    ram: "4GB",
    battery: "3227mAh",
    display: '6.1" Super Retina XDR',
    features: ["12MP Dual Camera with Night Mode", "A15 Bionic Chip", "5G Capable", "Ceramic Shield", "iOS ecosystem"],
    highlight: "iPhone at Android prices — $49.99 deal",
    solveLabel: "iPhone 13 for $49.99 — Apple quality, massive discount",
    solves: ["new-phone", "camera", "apple", "upgrade"],
    badge: "Deal $49.99",
    image: "/phones/iphone-se.jpg",
    url: "https://www.totalwireless.com/all-phones",
    dealExpiry: null,
    dealLimit: null,
    device_id: "iphone-13",
    model: "iPhone 13",
    storage_gb: 128,
    ram_gb: 4,
    os: "iOS"
  }
];

// Export fallback add-ons for emergency use
export const FALLBACK_ADDONS = [
  {
    id: "data-5gb",
    name: "5GB Data Add-On",
    price: 10,
    description: "Add 5GB of high-speed data — no plan change needed",
    solves: ["data-runs-out", "slow-data"]
  },
  {
    id: "data-15gb",
    name: "15GB Data Add-On",
    price: 20,
    description: "Add 15GB of high-speed data this cycle",
    solves: ["data-runs-out", "heavy-use"]
  },
  {
    id: "global-calling",
    name: "Global Calling Card",
    price: 10,
    description: "International calling to 85+ countries",
    solves: ["international", "calling"]
  }
];

// Export fallback deals for emergency use
export const FALLBACK_DEALS = [
  {
    id: "byop-20",
    name: "BYOP $20/mo Deal",
    headline: "$20/mo — Bring Your Own Phone",
    subtext: "Total Base 5G Unlimited. Auto Pay required. 5-Year Price Guarantee.",
    badge: "Tax Time Deal",
    expiry: null,
    requiresPlan: "base-5g",
    url: "https://www.totalwireless.com/deals"
  }
];

export const INTENT_PILLS = [
  { id: "slow-data",   label: "My internet is slow",     icon: "CellSignalSlash", prompt: "My data speed has been really slow lately." },
  { id: "runs-out",    label: "I run out of data",        icon: "BatteryEmpty",    prompt: "I always run out of data before the end of the month." },
  { id: "slow-phone",  label: "My phone feels slow",      icon: "HourglassMedium", prompt: "My phone has been really sluggish and slow lately." },
  { id: "storage",     label: "Running out of storage",   icon: "HardDrive",       prompt: "My phone says I'm running out of storage space." },
  { id: "camera",      label: "I want better photos",     icon: "Camera",          prompt: "I want to take better quality pictures with my phone." },
  { id: "cost",        label: "I want to spend less",     icon: "CurrencyDollar",  prompt: "I'm looking for the cheapest option that still works well." },
  { id: "new-phone",   label: "I need a new phone",       icon: "DeviceMobile",    prompt: "I'm thinking about getting a new phone." },
  { id: "not-working", label: "Something isn't working",  icon: "WarningCircle",   prompt: "Something on my phone or plan isn't working right." }
];
