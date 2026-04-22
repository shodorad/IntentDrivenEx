# Data Engineering: BigQuery Telecom Demo Dataset

**Purpose:** Implements the DE deliverable from the Generative UI PRD and Jira:
- Create a BigQuery telecom schema and synthetic data for Demo 1 & Demo 2
- Provide sample queries and data shape signatures for the Data Shape Analyzer
- Make the dataset queryable from Report Hub

**Project:** `data-practice-472314`  
**Dataset:** `telecom_demo`  
**Service account:** `bigquery-backend-dp@data-practice-472314.iam.gserviceaccount.com`

---

## 1) Security: never commit credentials
- Store the service account JSON locally
- Set env var: `set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\sa.json`
- Do NOT commit the JSON file to this repo

---

## 2) How to run

```powershell
# Install deps
python -m pip install -r requirements.txt

# Set credential env var (once)
set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\sa.json

# Run loader (creates dataset/tables + synthetic data)
python load_synthetic_telecom.py

# Verify with sample queries
bq query --use_legacy_sql=false "$(type sample_queries.sql)"
```

---

## 3) What gets created

### BigQuery tables
- `dim_subscriber`
- `dim_plan`
- `dim_device`
- `fact_usage_daily` (partitioned by `date`, clustered by `subscriber_id`)
- `fact_network_events` (partitioned by `date`)

### Synthetic data
- ~5,000 subscribers
- 90 days of usage (realistic caps, throttles, plan mix)
- Network events by region/time
- Deterministic seed for reproducibility

### Sample queries
- KPIs (1-row results)
- Time series (date + metric)
- Category breakdowns
- Multi-chart BI preview queries

### Data shape signatures
- 15+ entries mapping query result shapes to UI component candidates
- Used by the Data Shape Analyzer to select components

---

## 4) PRD/Jira mapping

| PRD/Jira requirement | This repo artifact |
|----------------------|--------------------|
| BigQuery telecom schema and synthetic data prep | `schema/*.sql` + `load_synthetic_telecom.py` |
| Data Shape Signature library | `data_shape_signatures.json` |
| Wire Report Hub BigQuery query interface | `sample_queries.sql` + dataset naming conventions |
| Evaluation dataset support | `sample_queries.sql` (canonical queries) |

---

## 5) Governance notes
- No PII (synthetic subscriber IDs only)
- Dataset location: `US` (adjust if needed)
- Partitioning on `date` for cost and performance
- Clustered by `subscriber_id` for common joins

---

## 6) Next steps for the team
- Back-End: use `sample_queries.sql` to wire Report Hub query interface
- Back-End + Data Eng: refine `data_shape_signatures.json` with real query outputs
- CX/PM: add more canonical queries to `sample_queries.sql` for evaluation dataset

---
