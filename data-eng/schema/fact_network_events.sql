CREATE OR REPLACE TABLE `data-practice-472314.telecom_demo.fact_network_events` (
  event_timestamp TIMESTAMP OPTIONS(description="Event timestamp"),
  subscriber_id STRING OPTIONS(description="Subscriber identifier"),
  event_type STRING OPTIONS(description="Event type: dropped_call|slow_data|outage|signal_loss"),
  severity STRING OPTIONS(description="Severity: critical|warning|info"),
  cell_site_id STRING OPTIONS(description="Cell site identifier")
) PARTITION BY DATE(event_timestamp)
CLUSTER BY subscriber_id
OPTIONS(
  description="Network events fact table (partitioned by event_timestamp date, clustered by subscriber_id)"
);
