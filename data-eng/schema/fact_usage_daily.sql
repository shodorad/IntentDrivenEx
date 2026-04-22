CREATE OR REPLACE TABLE `data-practice-472314.telecom_demo.fact_usage_daily` (
  date DATE OPTIONS(description="Usage date"),
  subscriber_id STRING OPTIONS(description="Subscriber identifier"),
  plan_id STRING OPTIONS(description="Plan identifier"),
  data_gb_used NUMERIC OPTIONS(description="Data used in GB"),
  hotspot_gb_used NUMERIC OPTIONS(description="Hotspot used in GB"),
  throttle_flag BOOL OPTIONS(description="True if throttled this day"),
  refill_flag BOOL OPTIONS(description="True if a refill occurred this day")
) PARTITION BY date
CLUSTER BY subscriber_id
OPTIONS(
  description="Daily usage fact table (partitioned by date, clustered by subscriber_id)"
);
