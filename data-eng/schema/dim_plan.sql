CREATE OR REPLACE TABLE `data-practice-472314.telecom_demo.dim_plan` (
  id STRING OPTIONS(description="Plan identifier (products.js)"),
  name STRING OPTIONS(description="Human-readable plan name (products.js)"),
  price NUMERIC OPTIONS(description="Monthly price in USD (products.js)"),
  priceNote STRING OPTIONS(description="Price note/disclaimer (products.js)"),
  data STRING OPTIONS(description="Data amount: 'Unlimited' or GB (products.js)"),
  hotspot STRING OPTIONS(description="Hotspot amount: GB or 'Unlimited' (products.js)"),
  talk STRING OPTIONS(description="Talk: 'Unlimited' (products.js)"),
  text STRING OPTIONS(description="Text: 'Unlimited' (products.js)"),
  network STRING OPTIONS(description="Network: '5G' (products.js)"),
  international STRING OPTIONS(description="International coverage: e.g., '85+ countries' (products.js)"),
  videoStreaming STRING OPTIONS(description="Video streaming quality: 480p|HD|4K UHD (products.js)"),
  features ARRAY<STRING> OPTIONS(description="List of plan features (products.js)"),
  highlight STRING OPTIONS(description="Marketing highlight (products.js)"),
  solveLabel STRING OPTIONS(description="Solve label for UI (products.js)"),
  solves ARRAY<STRING> OPTIONS(description="List of use cases solved (products.js)"),
  badge STRING OPTIONS(description="Badge text: 'Best Deal'|'Most Popular'|NULL (products.js)"),
  dealNote STRING OPTIONS(description="Deal note or restrictions (products.js)"),
  url STRING OPTIONS(description="Plan URL (products.js)"),
  tier STRING OPTIONS(description="Plan tier: base|standard|premium"),
  data_limit_gb INT64 OPTIONS(description="Data limit in GB; NULL for unlimited"),
  hotspot_limit_gb INT64 OPTIONS(description="Hotspot limit in GB; NULL for unlimited"),
  international_countries INT64 OPTIONS(description="Number of countries included")
) OPTIONS(
  description="Plan dimension table (all fields from products.js PLANS)"
);
