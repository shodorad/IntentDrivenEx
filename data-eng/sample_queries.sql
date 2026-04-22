-- Sample queries for Generative UI Demo 1 & Demo 2
-- Used by Report Hub query interface and Data Shape Analyzer
-- Aligns to PRD evaluation dataset (canonical queries)

-- 1) KPI: Total active subscribers
SELECT COUNT(*) AS active_subscribers
FROM `data-practice-472314.telecom_demo.dim_subscriber`
WHERE tenure_days > 0;

-- 2) KPI: Average daily data usage (GB)
SELECT AVG(data_gb_used) AS avg_daily_data_gb
FROM `data-practice-472314.telecom_demo.fact_usage_daily`;

-- 3) KPI: Throttle rate (%)
SELECT
  COUNTIF(throttle_flag) * 100.0 / COUNT(*) AS throttle_rate_pct
FROM `data-practice-472314.telecom_demo.fact_usage_daily`;

-- 4) Time series: Daily data usage trend (last 30 days)
SELECT
  date,
  SUM(data_gb_used) AS total_data_gb
FROM `data-practice-472314.telecom_demo.fact_usage_daily`
WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY date
ORDER BY date;

-- 5) Breakdown: Data usage by plan tier (last 30 days)
SELECT
  p.tier,
  SUM(f.data_gb_used) AS total_data_gb,
  COUNT(DISTINCT f.subscriber_id) AS unique_subscribers
FROM `data-practice-472314.telecom_demo.fact_usage_daily` f
JOIN `data-practice-472314.telecom_demo.dim_plan` p ON f.plan_id = p.plan_id
WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY p.tier
ORDER BY total_data_gb DESC;

-- 6) Breakdown: Top 10 devices by usage (last 30 days)
SELECT
  d.brand,
  d.model,
  SUM(f.data_gb_used) AS total_data_gb,
  COUNT(DISTINCT f.subscriber_id) AS unique_subscribers
FROM `data-practice-472314.telecom_demo.fact_usage_daily` f
JOIN `data-practice-472314.telecom_demo.dim_subscriber` s ON f.subscriber_id = s.subscriber_id
JOIN `data-practice-472314.telecom_demo.dim_device` d ON s.device_id = d.device_id
WHERE f.date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY d.brand, d.model
ORDER BY total_data_gb DESC
LIMIT 10;

-- 7) Time series: Network events by severity (last 14 days)
SELECT
  DATE(event_timestamp) AS event_date,
  severity,
  COUNT(*) AS event_count
FROM `data-practice-472314.telecom_demo.fact_network_events`
WHERE event_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 14 DAY)
GROUP BY event_date, severity
ORDER BY event_date, severity;

-- 8) Breakdown: Refill rate by segment (last 30 days)
SELECT
  s.segment,
  COUNTIF(f.refill_flag) * 100.0 / COUNT(*) AS refill_rate_pct,
  COUNT(DISTINCT f.subscriber_id) AS unique_subscribers
FROM `data-practice-472314.telecom_demo.fact_usage_daily` f
JOIN `data-practice-472314.telecom_demo.dim_subscriber` s ON f.subscriber_id = s.subscriber_id
WHERE f.date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY s.segment
ORDER BY refill_rate_pct DESC;

-- 9) KPI: Hotspot usage (GB)
SELECT
  SUM(hotspot_gb_used) AS total_hotspot_gb,
  AVG(hotspot_gb_used) AS avg_hotspot_gb_per_day
FROM `data-practice-472314.telecom_demo.fact_usage_daily`
WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY);

-- 10) Breakdown: Autopay adoption by segment
SELECT
  segment,
  COUNTIF(autopay_enabled) * 100.0 / COUNT(*) AS autopay_rate_pct,
  COUNT(*) AS total_subscribers
FROM `data-practice-472314.telecom_demo.dim_subscriber`
GROUP BY segment
ORDER BY autopay_rate_pct DESC;

-- 11) Time series: Data usage growth (weekly aggregates)
SELECT
  DATE_TRUNC(date, WEEK) AS week_start,
  SUM(data_gb_used) AS weekly_data_gb,
  COUNT(DISTINCT subscriber_id) AS active_subscribers
FROM `data-practice-472314.telecom_demo.fact_usage_daily`
GROUP BY week_start
ORDER BY week_start;

-- 12) Breakdown: Top 5 ZIP codes by usage (last 30 days)
SELECT
  zip,
  SUM(data_gb_used) AS total_data_gb,
  COUNT(DISTINCT subscriber_id) AS unique_subscribers
FROM `data-practice-472314.telecom_demo.fact_usage_daily` f
JOIN `data-practice-472314.telecom_demo.dim_subscriber` s ON f.subscriber_id = s.subscriber_id
WHERE f.date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY zip
ORDER BY total_data_gb DESC
LIMIT 5;

-- 13) KPI: Network event rate (%)
SELECT
  COUNT(*) * 100.0 / (SELECT COUNT(*) FROM `data-practice-472314.telecom_demo.fact_usage_daily`) AS event_rate_pct
FROM `data-practice-472314.telecom_demo.fact_network_events`
WHERE DATE(event_timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY);

-- 14) Time series: Refill events over time (last 30 days)
SELECT
  date,
  COUNTIF(refill_flag) AS refill_events,
  COUNT(DISTINCT subscriber_id) AS unique_subscribers
FROM `data-practice-472314.telecom_demo.fact_usage_daily`
WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY date
ORDER BY date;

-- 15) Breakdown: Device mix by segment
SELECT
  s.segment,
  d.brand,
  COUNT(*) AS subscriber_count,
  COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY s.segment) AS segment_pct
FROM `data-practice-472314.telecom_demo.dim_subscriber` s
JOIN `data-practice-472314.telecom_demo.dim_device` d ON s.device_id = d.device_id
GROUP BY s.segment, d.brand
ORDER BY s.segment, segment_pct DESC;
