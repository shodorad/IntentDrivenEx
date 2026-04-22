#!/usr/bin/env python3
"""
Cross-verify existing project data (products.js, personas.js) with BigQuery synthetic data.
Checks for consistency in plan names, device names, and key ranges.
"""

import json
from pathlib import Path
from google.cloud import bigquery

PROJECT_ID = "data-practice-472314"
DATASET_ID = "telecom_demo"

def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def load_js_as_json(path, export_name):
    """
    Very light parser for a single JS export like:
      export const PLANS = [...];
    Returns the parsed JSON value for the requested export_name.
    """
    import re
    txt = Path(path).read_text(encoding="utf-8")
    # Remove line comments and block comments
    txt = re.sub(r"//.*", "", txt)
    txt = re.sub(r"/\*.*?\*/", "", txt, flags=re.DOTALL)
    pattern = rf"export\s+const\s+{export_name}\s*=\s*(.+?);\s*$"
    m = re.search(pattern, txt, re.DOTALL)
    if not m:
        raise ValueError(f"Could not parse JS export {export_name} in {path}")
    return json.loads(m.group(1))

def bq_query(sql):
    client = bigquery.Client(project=PROJECT_ID)
    return [dict(row) for row in client.query(sql)]

def main():
    # Inline minimal reference data from products.js (to avoid parsing JS)
    plans_ref = [
        {"id": "base-5g", "name": "Total Base 5G Unlimited", "price": 20},
        {"id": "5g-unlimited", "name": "Total 5G Unlimited", "price": 55},
        {"id": "5g-plus-unlimited", "name": "Total 5G+ Unlimited", "price": 65},
    ]
    phones_ref = [
        {"id": "moto-g-stylus-2025", "brand": "Motorola", "model": "Moto G Stylus 2025", "storage": "256GB"},
        {"id": "samsung-galaxy-a17-5g", "brand": "Samsung", "model": "Samsung Galaxy A17 5G", "storage": "128GB"},
        {"id": "samsung-galaxy-a36-5g", "brand": "Samsung", "model": "Samsung Galaxy A36 5G", "storage": "128GB"},
        {"id": "iphone-13", "brand": "Apple", "model": "iPhone 13", "storage": "128GB"},
    ]
    personas_ref = {
        "us-001": {"name": "Maria R.", "account": {"plan": "Total Base 5G", "device": "Samsung Galaxy A14"}},
        "us-002": {"name": "Carlos M.", "account": {"plan": "Total Base 5G", "device": "iPhone 13"}},
    }

    # 1) Plans consistency
    bq_plans = bq_query(f"SELECT plan_id, plan_name, price_usd, tier FROM `{PROJECT_ID}.{DATASET_ID}.dim_plan` ORDER BY price_usd")
    bq_plan_lookup = {p["plan_id"]: p for p in bq_plans}
    print("=== PLANS CONSISTENCY ===")
    for plan in plans_ref:
        pid = plan["id"]
        if pid in bq_plan_lookup:
            bq = bq_plan_lookup[pid]
            print(f"OK: {plan['name']} | ${plan['price']} | tier={bq['tier']} | BQ price=${bq['price_usd']}")
        else:
            print(f"MISMATCH: plan id {pid} not found in BigQuery")
    for pid in bq_plan_lookup:
        if not any(p["id"] == pid for p in plans_ref):
            print(f"EXTRA in BQ: plan id {pid} exists in BigQuery but not in products.js")

    # 2) Devices consistency
    bq_devices = bq_query(f"SELECT device_id, brand, model, storage_gb, ram_gb FROM `{PROJECT_ID}.{DATASET_ID}.dim_device` ORDER BY brand, model")
    bq_device_lookup = {d["device_id"]: d for d in bq_devices}
    print("\n=== DEVICES CONSISTENCY ===")
    for phone in phones_ref:
        did = phone["id"]
        if did in bq_device_lookup:
            bq = bq_device_lookup[did]
            print(f"OK: {phone['brand']} {phone['model']} | storage={phone['storage']} | BQ storage={bq['storage_gb']}")
        else:
            print(f"MISMATCH: device id {did} not found in BigQuery")
    for did in bq_device_lookup:
        if not any(p["id"] == did for p in phones_ref):
            print(f"EXTRA in BQ: device id {did} exists in BigQuery but not in products.js")

    # 3) Persona plan names
    print("\n=== PERSONA PLAN NAMES ===")
    for key, persona in personas_ref.items():
        plan_name = persona.get("account", {}).get("plan")
        if plan_name:
            matches = [p for p in bq_plans if p["plan_name"] == plan_name]
            if matches:
                print(f"OK: {persona['name']} plan '{plan_name}' found in BQ")
            else:
                print(f"MISMATCH: {persona['name']} plan '{plan_name}' not found in BQ dim_plan.plan_name")

    # 4) Persona device names
    print("\n=== PERSONA DEVICE NAMES ===")
    for key, persona in personas_ref.items():
        device_name = persona.get("account", {}).get("device")
        if device_name:
            matches = [d for d in bq_devices if d["brand"] in device_name and d["model"] in device_name]
            if matches:
                print(f"OK: {persona['name']} device '{device_name}' matches BQ entry")
            else:
                print(f"MISMATCH: {persona['name']} device '{device_name}' not found in BQ dim_device")

    # 5) Basic range checks (synthetic data sanity)
    print("\n=== SYNTHETIC DATA RANGES ===")
    usage_stats = bq_query(f"SELECT MIN(data_gb_used) AS min_gb, MAX(data_gb_used) AS max_gb, AVG(data_gb_used) AS avg_gb FROM `{PROJECT_ID}.{DATASET_ID}.fact_usage_daily`")
    for row in usage_stats:
        print(f"Usage GB: min={row['min_gb']}, max={row['max_gb']}, avg={row['avg_gb']:.2f}")

if __name__ == "__main__":
    main()
