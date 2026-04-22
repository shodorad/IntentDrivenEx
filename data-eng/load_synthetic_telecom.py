#!/usr/bin/env python3
"""
Generative UI Demo: BigQuery Telecom Synthetic Data Loader

Creates dataset, tables, and synthetic telecom data for Demo 1 & Demo 2.
Aligns to PRD/Jira DE deliverables:
- BigQuery telecom schema and synthetic data prep
- Data Shape Signature library inputs (via sample queries)

Usage:
  set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\sa.json
  python load_synthetic_telecom.py
"""

import os
import json
import random
import datetime
from pathlib import Path

from google.cloud import bigquery
import pandas as pd
import pyarrow as pa
from pyarrow import Table as pa_table

# Config
PROJECT_ID = "data-practice-472314"
DATASET_ID = "telecom_demo"
SEED = 42
random.seed(SEED)

# Synthetic data sizes
N_SUBSCRIBERS = 5_000
START_DATE = datetime.date(2025, 1, 1)
END_DATE = datetime.date(2025, 3, 31)  # 90 days

def init_client():
    client = bigquery.Client(project=PROJECT_ID)
    return client

def ensure_dataset(client):
    dataset_ref = client.dataset(DATASET_ID)
    try:
        client.get_dataset(dataset_ref)
        print(f"Dataset {DATASET_ID} already exists.")
    except Exception:
        dataset = bigquery.Dataset(dataset_ref)
        dataset.location = "US"
        dataset = client.create_dataset(dataset)
        print(f"Created dataset {DATASET_ID}.")

def run_sql_file(client, path):
    sql = Path(path).read_text()
    client.query(sql).result()
    print(f"Executed SQL: {path}")

def generate_dim_plan():
    plans = [
        {
            "id": "base-5g",
            "name": "Total Base 5G Unlimited",
            "price": 20,
            "priceNote": "with BYOP + Auto Pay (5-yr price guarantee)",
            "data": "Unlimited",
            "hotspot": "5GB",
            "talk": "Unlimited",
            "text": "Unlimited",
            "network": "5G",
            "international": "85+ countries",
            "videoStreaming": "480p",
            "features": ["Unlimited Talk, Text & Data", "5GB Mobile Hotspot", "85+ Countries International", "On Verizon's 5G Network", "5-Year Price Guarantee"],
            "highlight": "Most affordable - $20/mo guaranteed for 5 years",
            "solveLabel": "Lowest bill possible - unlimited data, guaranteed price",
            "solves": ["cost", "data-runs-out", "light-use", "moderate-use", "byop"],
            "badge": "Best Deal",
            "dealNote": "Tax Time Deal - BYOP + Auto Pay required",
            "url": "https://www.totalwireless.com/plans",
            "tier": "base",
            "data_limit_gb": None,
            "hotspot_limit_gb": 5,
            "international_countries": 85,
        },
        {
            "id": "5g-unlimited",
            "name": "Total 5G Unlimited",
            "price": 55,
            "priceNote": "per line / month",
            "data": "Unlimited",
            "hotspot": "15GB",
            "talk": "Unlimited",
            "text": "Unlimited",
            "network": "5G",
            "international": "180+ countries",
            "videoStreaming": "HD",
            "features": ["Unlimited Talk, Text & Data", "15GB Mobile Hotspot", "180+ Countries International", "Disney+ 6 Months Included", "On Verizon's 5G Network"],
            "highlight": "More hotspot + Disney+ - great for families",
            "solveLabel": "15GB hotspot + Disney+ included - mid-tier value",
            "solves": ["hotspot", "streaming", "family", "heavy-use", "international"],
            "badge": "Most Popular",
            "dealNote": "Includes 6-month Disney+ Premium",
            "url": "https://www.totalwireless.com/plans",
            "tier": "standard",
            "data_limit_gb": None,
            "hotspot_limit_gb": 15,
            "international_countries": 180,
        },
        {
            "id": "5g-plus-unlimited",
            "name": "Total 5G+ Unlimited",
            "price": 65,
            "priceNote": "per line / month",
            "data": "Unlimited",
            "hotspot": "Unlimited",
            "talk": "Unlimited",
            "text": "Unlimited",
            "network": "5G",
            "international": "180+ countries",
            "videoStreaming": "4K UHD",
            "features": ["Unlimited Talk, Text & Data", "Unlimited Mobile Hotspot", "180+ Countries International", "$10 International Roaming Credit", "On Verizon's 5G Network"],
            "highlight": "Premium - unlimited hotspot + required for device deals",
            "solveLabel": "Unlimited hotspot + premium 5G - best for heavy users",
            "solves": ["hotspot", "streaming", "premium", "heavy-use", "international", "device-deal"],
            "badge": None,
            "dealNote": "Required for iPhone 17e, Galaxy S26, iPhone 13 $49.99 deals",
            "url": "https://www.totalwireless.com/plans",
            "tier": "premium",
            "data_limit_gb": None,
            "hotspot_limit_gb": None,
            "international_countries": 180,
        },
    ]
    return pd.DataFrame(plans)

def generate_dim_device():
    devices = [
        {
            "id": "moto-g-stylus-2025",
            "name": "Moto G Stylus 2025",
            "brand": "Motorola",
            "price": 0,
            "priceNote": "Free with Total 5G Unlimited (3 months)",
            "camera": "50MP",
            "storage": "256GB",
            "ram": "8GB",
            "battery": "5000mAh",
            "display": '6.7" FHD+ AMOLED',
            "features": ["Built-in Stylus", "50MP Camera", "256GB Storage", "8GB RAM", "5000mAh Battery", "Free with eligible plan"],
            "highlight": "Free - best value new phone",
            "solveLabel": "Free phone with plan - stylus + 256GB storage",
            "solves": ["cost", "storage", "new-phone", "camera"],
            "badge": "Free",
            "image": "/phones/moto-g-stylus.jpg",
            "url": "https://www.totalwireless.com/all-phones",
            "dealExpiry": None,
            "dealLimit": None,
            "device_id": "moto-g-stylus-2025",
            "model": "Moto G Stylus 2025",
            "storage_gb": 256,
            "ram_gb": 8,
            "os": "Android",
        },
        {
            "id": "samsung-galaxy-a17-5g",
            "name": "Samsung Galaxy A17 5G",
            "brand": "Samsung",
            "price": 0,
            "priceNote": "Free with eligible plan",
            "camera": "50MP",
            "storage": "128GB",
            "ram": "4GB",
            "battery": "5000mAh",
            "display": '6.5" FHD+',
            "features": ["50MP Camera", "5G Capable", "128GB Storage", "5000mAh Battery", "Samsung quality"],
            "highlight": "Free Samsung - solid everyday phone",
            "solveLabel": "Free Samsung 5G phone - reliable daily driver",
            "solves": ["cost", "new-phone", "slow-phone"],
            "badge": "Free",
            "image": "/phones/samsung-a15.jpg",
            "url": "https://www.totalwireless.com/all-phones",
            "dealExpiry": None,
            "dealLimit": None,
            "device_id": "samsung-galaxy-a17-5g",
            "model": "Samsung Galaxy A17 5G",
            "storage_gb": 128,
            "ram_gb": 4,
            "os": "Android",
        },
        {
            "id": "samsung-galaxy-a36-5g",
            "name": "Samsung Galaxy A36 5G",
            "brand": "Samsung",
            "price": 0,
            "priceNote": "Free with Total 5G Unlimited or higher (3 months)",
            "camera": "50MP",
            "storage": "128GB",
            "ram": "6GB",
            "battery": "5000mAh",
            "display": '6.7" FHD+ Super AMOLED',
            "features": ["50MP Camera System", "6GB RAM", "Super AMOLED Display", "5G Capable", "Free with eligible plan"],
            "highlight": "Free mid-range Samsung with premium display",
            "solveLabel": "Free Samsung with Super AMOLED - step up from budget",
            "solves": ["cost", "new-phone", "camera", "display"],
            "badge": "Free",
            "image": "/phones/samsung-a25.jpg",
            "url": "https://www.totalwireless.com/all-phones",
            "dealExpiry": None,
            "dealLimit": None,
            "device_id": "samsung-galaxy-a36-5g",
            "model": "Samsung Galaxy A36 5G",
            "storage_gb": 128,
            "ram_gb": 6,
            "os": "Android",
        },
        {
            "id": "iphone-13",
            "name": "iPhone 13",
            "brand": "Apple",
            "price": 49.99,
            "priceNote": "$49.99 with Total 5G+ Unlimited (3 months required)",
            "camera": "12MP dual",
            "storage": "128GB",
            "ram": "4GB",
            "battery": "3227mAh",
            "display": '6.1" Super Retina XDR',
            "features": ["12MP Dual Camera with Night Mode", "A15 Bionic Chip", "5G Capable", "Ceramic Shield", "iOS ecosystem"],
            "highlight": "iPhone at Android prices - $49.99 deal",
            "solveLabel": "iPhone 13 for $49.99 - Apple quality, massive discount",
            "solves": ["new-phone", "camera", "apple", "upgrade"],
            "badge": "Deal $49.99",
            "image": "/phones/iphone-se.jpg",
            "url": "https://www.totalwireless.com/all-phones",
            "dealExpiry": None,
            "dealLimit": None,
            "device_id": "iphone-13",
            "model": "iPhone 13",
            "storage_gb": 128,
            "ram_gb": 4,
            "os": "iOS",
        },
        {
            "id": "samsung-galaxy-a14",
            "name": "Samsung Galaxy A14",
            "brand": "Samsung",
            "price": None,
            "priceNote": None,
            "camera": "50MP",
            "storage": "128GB",
            "ram": "4GB",
            "battery": "5000mAh",
            "display": '6.6" PLS LCD',
            "features": ["50MP Camera", "5G Capable", "128GB Storage", "5000mAh Battery"],
            "highlight": "Reliable budget Samsung",
            "solveLabel": "Affordable Samsung 5G phone",
            "solves": ["cost", "new-phone"],
            "badge": None,
            "image": None,
            "url": None,
            "dealExpiry": None,
            "dealLimit": None,
            "device_id": "samsung-galaxy-a14",
            "model": "Samsung Galaxy A14",
            "storage_gb": 128,
            "ram_gb": 4,
            "os": "Android",
        },
    ]
    return pd.DataFrame(devices)

def generate_dim_subscribers(n):
    segments = ["light", "moderate", "heavy", "premium"]
    segment_weights = [0.25, 0.35, 0.30, 0.10]
    device_ids = ["iphone-13", "samsung-galaxy-a17-5g", "samsung-galaxy-a36-5g", "moto-g-stylus-2025", "samsung-galaxy-a14"]
    plan_ids = ["base-5g", "5g-unlimited", "5g-plus-unlimited"]
    rows = []
    for i in range(n):
        seg = random.choices(segments, weights=segment_weights)[0]
        rows.append({
            "subscriber_id": f"sub_{i:05d}",
            "segment": seg,
            "tenure_days": random.randint(30, 1825),
            "device_id": random.choice(device_ids),
            "plan_id": random.choice(plan_ids),
            "zip": f"{random.randint(10000, 99999)}",
            "autopay_enabled": random.random() < 0.6,
        })
    return pd.DataFrame(rows)

def generate_fact_usage_daily(subscribers_df, start, end):
    dates = pd.date_range(start, end, freq="D")
    rows = []
    for _, sub in subscribers_df.iterrows():
        for d in dates:
            # Simulate usage patterns by segment
            if sub.segment == "light":
                data_gb = round(random.uniform(0.1, 3.5), 2)
                hotspot_gb = round(random.uniform(0, 0.5), 2)
            elif sub.segment == "moderate":
                data_gb = round(random.uniform(2, 8), 2)
                hotspot_gb = round(random.uniform(0, 2), 2)
            elif sub.segment == "heavy":
                data_gb = round(random.uniform(7, 20), 2)
                hotspot_gb = round(random.uniform(0, 5), 2)
            else:  # premium
                data_gb = round(random.uniform(10, 30), 2)
                hotspot_gb = round(random.uniform(0, 10), 2)
            throttle = (data_gb > 20) and (sub.plan_id == "base_5g")
            refill = (data_gb > 15) and (sub.plan_id in {"base_5g", "std_5g"}) and (random.random() < 0.15)
            rows.append({
                "date": d.date(),
                "subscriber_id": sub["subscriber_id"],
                "plan_id": sub["plan_id"],
                "data_gb_used": data_gb,
                "hotspot_gb_used": hotspot_gb,
                "throttle_flag": throttle,
                "refill_flag": refill,
            })
    return pd.DataFrame(rows)

def generate_fact_network_events(subscribers_df, start, end):
    event_types = ["dropped_call", "slow_data", "outage", "signal_loss"]
    severity_weights = {"critical": 0.1, "warning": 0.3, "info": 0.6}
    rows = []
    for _, sub in subscribers_df.iterrows():
        # Heavy/premium users have more events
        n_events = random.choices([0, 1, 2, 3], weights=[0.4, 0.3, 0.2, 0.1])[0]
        if sub.segment in {"heavy", "premium"}:
            n_events = max(n_events, random.choices([1, 2, 3, 4], weights=[0.2, 0.3, 0.3, 0.2])[0])
        for _ in range(n_events):
            ts = pd.to_datetime(random.choice(pd.date_range(start, end, freq="H")))
            rows.append({
                "event_timestamp": ts,
                "subscriber_id": sub["subscriber_id"],
                "event_type": random.choice(event_types),
                "severity": random.choices(list(severity_weights.keys()), weights=list(severity_weights.values()))[0],
                "cell_site_id": f"cell_{random.randint(1000, 9999)}",
            })
    return pd.DataFrame(rows)

def load_df_to_bq(client, df, table_id, write_disposition="WRITE_TRUNCATE"):
    job_config = bigquery.LoadJobConfig(
        write_disposition=write_disposition,
        source_format=bigquery.SourceFormat.PARQUET,
    )
    table_ref = client.dataset(DATASET_ID).table(table_id)
    job.result()
    print(f"Loaded {len(df)} personas to dim_persona")

def load_dim_intent_mapping(client):
    """Load intent mapping dimension table"""
    print("Loading dim_intent_mapping...")
    
    df = generate_dim_intent_mapping()
    
    # Convert to BigQuery format
    table = pa_table.from_pandas(df, schema=pa.schema([
        ('intent_key', pa.string()),
        ('intent_type', pa.string()),
        ('phrases', pa.list(pa.string())),
        ('negations', pa.list(pa.string())),
        ('description', pa.string()),
        ('category', pa.string()),
        ('priority', pa.int64())
    ]))
    
    job_config = bigquery.LoadJobConfig(
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE
    )
    
    job = client.load_table_from_pyarrow(
        table,
        f"{PROJECT_ID}.{DATASET_ID}.dim_intent_mapping",
        job_config=job_config
    )
    job.result()
    print(f"Loaded {len(df)} intent mappings to dim_intent_mapping")

def main():
    """Main execution function"""
    print("Starting BigQuery Telecom Synthetic Data Loader...")
    
    # Initialize BigQuery client
    client = init_client()
    
    # Create dataset if needed
    ensure_dataset(client)
    
    # Generate and load all data
    print("\n=== Generating and Loading Data ===")
    
    # Load dimension tables
    load_dim_plan(client)
    load_dim_device(client)
    load_dim_subscriber(client)
    load_dim_persona(client)  # NEW: Load personas
    load_dim_intent_mapping(client)  # NEW: Load intent mapping
    
    # Load fact tables
    load_fact_usage_daily(client)
    load_fact_network_events(client)
    
    print("\n=== Data Loading Complete ===")
    print(f"Dataset: {PROJECT_ID}.{DATASET_ID}")
    print(f"Subscribers: {N_SUBSCRIBERS}")
    print(f"Date Range: {START_DATE} to {END_DATE}")
    print("\nSample queries available in README.md")
    load_df_to_bq(client, events_df, "fact_network_events")

    print("\nAll tables loaded. Ready for Demo 1 & Demo 2 queries.")

if __name__ == "__main__":
    main()
