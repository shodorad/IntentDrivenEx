CREATE OR REPLACE TABLE `data-practice-472314.telecom_demo.dim_subscriber` (
  subscriber_id STRING OPTIONS(description="Synthetic subscriber identifier"),
  segment STRING OPTIONS(description="Customer segment: light|moderate|heavy|premium"),
  tenure_days INT64 OPTIONS(description="Days since activation"),
  device_id STRING OPTIONS(description="Foreign key to dim_device"),
  plan_id STRING OPTIONS(description="Foreign key to dim_plan"),
  zip STRING OPTIONS(description="ZIP code for region grouping"),
  autopay_enabled BOOL OPTIONS(description="True if autopay is on")
) OPTIONS(
  description="Subscriber dimension table (synthetic data)"
);
