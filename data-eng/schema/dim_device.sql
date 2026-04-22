CREATE OR REPLACE TABLE `data-practice-472314.telecom_demo.dim_device` (
  id STRING OPTIONS(description="Device identifier (products.js)"),
  name STRING OPTIONS(description="Device model name (products.js)"),
  brand STRING OPTIONS(description="Device brand: Apple|Samsung|Motorola|Google|Other (products.js)"),
  price NUMERIC OPTIONS(description="Device price (products.js)"),
  priceNote STRING OPTIONS(description="Price note/disclaimer (products.js)"),
  camera STRING OPTIONS(description="Camera specs: e.g., '50MP' (products.js)"),
  storage STRING OPTIONS(description="Storage: e.g., '128GB' (products.js)"),
  ram STRING OPTIONS(description="RAM: e.g., '4GB' (products.js)"),
  battery STRING OPTIONS(description="Battery: e.g., '5000mAh' (products.js)"),
  display STRING OPTIONS(description="Display: e.g., '6.1\" Super Retina XDR' (products.js)"),
  features ARRAY<STRING> OPTIONS(description="List of device features (products.js)"),
  highlight STRING OPTIONS(description="Marketing highlight (products.js)"),
  solveLabel STRING OPTIONS(description="Solve label for UI (products.js)"),
  solves ARRAY<STRING> OPTIONS(description="List of use cases solved (products.js)"),
  badge STRING OPTIONS(description="Badge text: 'Free'|'Deal $49.99'|NULL (products.js)"),
  image STRING OPTIONS(description="Image path (products.js)"),
  url STRING OPTIONS(description="Device URL (products.js)"),
  dealExpiry DATE OPTIONS(description="Deal expiry date (products.js)"),
  dealLimit STRING OPTIONS(description="Deal limit: e.g., 'Limit 2 per account' (products.js)"),
  device_id STRING OPTIONS(description="Device identifier"),
  model STRING OPTIONS(description="Device model name"),
  storage_gb INT64 OPTIONS(description="Storage in GB"),
  ram_gb INT64 OPTIONS(description="RAM in GB"),
  os STRING OPTIONS(description="Operating system: iOS|Android")
) OPTIONS(
  description="Device dimension table (all fields from products.js PHONES)"
);
