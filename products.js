// ── Total Wireless Product Catalog ──
// Plans, phones, and brand tokens for the Intent-Driven Experience

const PLANS = [
  {
    id: "connect-25",
    name: "Connect Plan",
    price: 25,
    data: "1GB",
    talk: "Unlimited",
    text: "Unlimited",
    network: "5G",
    features: ["Unlimited Talk & Text", "1GB High-Speed Data", "Wi-Fi Calling", "On Verizon's 5G Network"],
    highlight: "Best for talk & text users",
    solves: ["cost", "first-time", "light-use"],
    badge: null
  },
  {
    id: "basic-30",
    name: "Basic Plan",
    price: 30,
    data: "5GB",
    talk: "Unlimited",
    text: "Unlimited",
    network: "5G",
    features: ["Unlimited Talk & Text", "5GB High-Speed Data", "Mobile Hotspot (1GB)", "On Verizon's 5G Network"],
    highlight: "Best for light data users",
    solves: ["cost", "light-use"],
    badge: null
  },
  {
    id: "value-40",
    name: "Value Plan",
    price: 40,
    data: "15GB",
    talk: "Unlimited",
    text: "Unlimited",
    network: "5G",
    features: ["Unlimited Talk & Text", "15GB High-Speed Data", "Mobile Hotspot (5GB)", "On Verizon's 5G Network", "International Texting"],
    highlight: "Best for moderate data users",
    solves: ["data-runs-out", "slow-data", "moderate-use"],
    badge: "Most Popular"
  },
  {
    id: "unlimited-50",
    name: "Unlimited Plan",
    price: 50,
    data: "Unlimited",
    talk: "Unlimited",
    text: "Unlimited",
    network: "5G",
    features: ["Unlimited Talk & Text", "Unlimited High-Speed Data", "Mobile Hotspot (10GB)", "On Verizon's 5G Network", "International Texting", "Spam Call Filter"],
    highlight: "Unlimited everything — no surprises",
    solves: ["data-runs-out", "slow-data", "heavy-use", "streaming"],
    badge: "Best Value"
  },
  {
    id: "unlimited-plus-60",
    name: "Unlimited+ Plan",
    price: 60,
    data: "Unlimited",
    talk: "Unlimited",
    text: "Unlimited",
    network: "5G UW",
    features: ["Unlimited Talk & Text", "Unlimited Premium Data", "Mobile Hotspot (25GB)", "5G Ultra Wideband Access", "100GB Cloud Storage", "International Texting & Calling", "Spam Call Filter"],
    highlight: "Our best plan — premium data with 5G Ultra Wideband",
    solves: ["data-runs-out", "slow-data", "heavy-use", "streaming", "hotspot", "premium"],
    badge: null
  }
];

const PHONES = [
  {
    id: "moto-g-power",
    name: "Moto G Power 2024",
    brand: "Motorola",
    price: 99,
    pricePer: null,
    camera: "50MP",
    storage: "128GB",
    ram: "4GB",
    battery: "5000mAh",
    display: '6.5" HD+',
    features: ["50MP Camera System", "128GB Storage", "5000mAh All-Day Battery", "6.5\" HD+ Display", "Water Repellent"],
    highlight: "Best battery life on a budget",
    solves: ["battery", "slow-phone", "budget-phone", "cost"],
    badge: "Best Seller",
    image: "https://placehold.co/120x240/f5f5f5/1a1a1a?text=Moto+G\\nPower"
  },
  {
    id: "samsung-a15",
    name: "Samsung Galaxy A15 5G",
    brand: "Samsung",
    price: 139,
    pricePer: null,
    camera: "50MP",
    storage: "128GB",
    ram: "4GB",
    battery: "5000mAh",
    display: '6.5" FHD+ AMOLED',
    features: ["50MP Triple Camera", "128GB Storage", "5G Capable", "6.5\" AMOLED Display", "5000mAh Battery"],
    highlight: "Great display & camera at an affordable price",
    solves: ["camera", "slow-phone", "photos", "display"],
    badge: null,
    image: "https://placehold.co/120x240/f5f5f5/1a1a1a?text=Galaxy\\nA15"
  },
  {
    id: "iphone-se",
    name: "iPhone SE (3rd Gen)",
    brand: "Apple",
    price: 249,
    pricePer: null,
    camera: "12MP",
    storage: "64GB",
    ram: "4GB",
    battery: "2018mAh",
    display: '4.7" Retina HD',
    features: ["12MP Camera with Portrait Mode", "A15 Bionic Chip", "5G Capable", "Touch ID", "Water Resistant"],
    highlight: "Apple quality at the lowest price",
    solves: ["slow-phone", "apple", "upgrade"],
    badge: null,
    image: "https://placehold.co/120x240/f5f5f5/1a1a1a?text=iPhone\\nSE"
  },
  {
    id: "samsung-a25",
    name: "Samsung Galaxy A25 5G",
    brand: "Samsung",
    price: 199,
    pricePer: null,
    camera: "50MP",
    storage: "128GB",
    ram: "6GB",
    battery: "5000mAh",
    display: '6.5" FHD+ Super AMOLED',
    features: ["50MP Triple Camera with OIS", "128GB Storage (Expandable)", "6GB RAM", "Super AMOLED Display", "5000mAh Battery", "Water Resistant"],
    highlight: "Best all-around mid-range phone",
    solves: ["camera", "slow-phone", "photos", "storage", "multitasking"],
    badge: "Best Value",
    image: "https://placehold.co/120x240/f5f5f5/1a1a1a?text=Galaxy\\nA25"
  },
  {
    id: "moto-g-stylus",
    name: "Moto G Stylus 5G",
    brand: "Motorola",
    price: 179,
    pricePer: null,
    camera: "50MP",
    storage: "256GB",
    ram: "6GB",
    battery: "5000mAh",
    display: '6.6" FHD+ OLED',
    features: ["50MP Camera System", "256GB Built-in Storage", "Built-in Stylus Pen", "6.6\" OLED Display", "5000mAh Battery", "6GB RAM"],
    highlight: "Most storage — great if you're always running out",
    solves: ["storage", "slow-phone", "photos", "multitasking"],
    badge: null,
    image: "https://placehold.co/120x240/f5f5f5/1a1a1a?text=Moto+G\\nStylus"
  }
];

const INTENT_PILLS = [
  { id: "slow-data",   label: "My internet is slow",      icon: "ph-cell-signal-slash", prompt: "My data speed has been really slow lately." },
  { id: "runs-out",    label: "I run out of data",         icon: "ph-battery-empty",     prompt: "I always run out of data before the end of the month." },
  { id: "slow-phone",  label: "My phone feels slow",       icon: "ph-hourglass-medium",  prompt: "My phone has been really sluggish and slow lately." },
  { id: "storage",     label: "Running out of storage",    icon: "ph-hard-drive",        prompt: "My phone says I'm running out of storage space." },
  { id: "camera",      label: "I want better photos",      icon: "ph-camera",            prompt: "I want to take better quality pictures with my phone." },
  { id: "cost",        label: "I want to spend less",      icon: "ph-currency-dollar",   prompt: "I'm looking for the cheapest option that still works well." },
  { id: "new-phone",   label: "I need a new phone",        icon: "ph-device-mobile",     prompt: "I'm thinking about getting a new phone." },
  { id: "not-working", label: "Something isn't working",   icon: "ph-warning-circle",    prompt: "Something on my phone or plan isn't working right." }
];

const BRAND = {
  teal:     "#00B5AD",
  red:      "#EE0000",
  blue:     "#003087",
  yellow:   "#F7C948",
  black:    "#000000",
  white:    "#FFFFFF",
  gray900:  "#1A1A1A",
  gray600:  "#6B6B6B",
  gray200:  "#E8E8E8",
  gray100:  "#F5F5F5",
  font:     "'Inter', 'Helvetica Neue', Arial, sans-serif"
};

const SYSTEM_PROMPT = `You are a friendly Total Wireless advisor helping value customers solve their phone or plan problems.

YOUR ROLE:
- Listen to the customer's problem or challenge (NOT what they want to buy)
- Ask 1–2 short clarifying questions to understand their situation
- Recommend the best-fit plan upgrade or phone upgrade from the catalog below
- Always lead with SOLVING THEIR PROBLEM, not upselling

CUSTOMER PROFILE:
- Budget-conscious prepay customers ($30–$50/month range)
- They care about price first, features second
- They are NOT loyal to Verizon brand — they chose Total for cost
- They want their problem solved, not a sales pitch

BRAND VOICE:
- Direct, warm, no jargon
- Always frame upgrades as "only $X more" not "upgrade to our premium tier"
- Never say "based on your inputs" — say "sounds like" or "it seems like"
- Keep it casual and human. Use contractions.

CONVERSATION RULES:
1. Never ask more than 2 questions before making a recommendation
2. Keep responses SHORT — 2–3 sentences max before asking a question
3. When recommending, always explain HOW it solves their specific problem
4. Format recommendations as JSON at the end of your response like:
   [RECOMMENDATION]{"type":"plan","id":"plan-id-here","reason":"Short reason explaining how this fixes their problem"}[/RECOMMENDATION]
   OR for phones:
   [RECOMMENDATION]{"type":"phone","id":"phone-id-here","reason":"Short reason explaining how this fixes their problem"}[/RECOMMENDATION]
5. If you can't determine a recommendation, suggest talking to a real person
6. After your FIRST response, if you have enough context, you may recommend immediately
7. Never mention the recommendation JSON to the customer — just include it at the end

AVAILABLE PLANS:
${JSON.stringify(PLANS, null, 2)}

AVAILABLE PHONES:
${JSON.stringify(PHONES, null, 2)}

EXAMPLES OF GOOD RECOMMENDATIONS:
- Data runs out → Value Plan ($40/mo, 15GB) or Unlimited ($50/mo)
- Phone slow → Samsung Galaxy A25 or Moto G Stylus (more RAM)
- Want better photos → Samsung Galaxy A25 (OIS camera)
- Storage full → Moto G Stylus (256GB) or Samsung Galaxy A25 (expandable)
- Want to spend less → Connect Plan ($25) or Basic Plan ($30)
- Need new phone → Ask about budget and priorities, then recommend`;
