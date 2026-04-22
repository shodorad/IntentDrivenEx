#!/usr/bin/env python3
"""
Show current data comparison: existing project (products.js) vs BigQuery.
"""

import json
from pathlib import Path
from google.cloud import bigquery

def load_js_as_json(path, export_name):
    import re
    txt = Path(path).read_text(encoding="utf-8")
    txt = re.sub(r"//.*", "", txt)
    txt = re.sub(r"/\*.*?\*/", "", txt, flags=re.DOTALL)
    pattern = rf"export\s+const\s+{export_name}\s*=\s*(.+?);\s*$"
    m = re.search(pattern, txt, re.DOTALL)
    if not m:
        raise ValueError(f"Could not parse JS export {export_name} in {path}")
    return json.loads(m.group(1))

def bq_query(sql):
    client = bigquery.Client(project="data-practice-472314")
    return [dict(row) for row in client.query(sql)]

def main():
    repo_root = Path(__file__).parent.parent
    products = load_js_as_json(repo_root / "clearpath-ai" / "src" / "data" / "products.js", "PLANS")
    phones = load_js_as_json(repo_root / "clearpath-ai" / "src" / "data" / "products.js", "PHONES")

    bq_plans = bq_query("SELECT plan_id, plan_name, price_usd, tier FROM `data-practice-472314.telecom_demo.dim_plan` ORDER BY price_usd")
    bq_devices = bq_query("SELECT device_id, brand, model, storage_gb FROM `data-practice-472314.telecom_demo.dim_device` ORDER BY brand, model")

    print("=== Existing Project Data (products.js) ===")
    print("\n--- Plans ---")
    for p in products["PLANS"]:
        print(f"id={p['id']}, name={p['name']}, price=${p['price']}")
    print("\n--- Phones ---")
    for p in products["PHONES"]:
        print(f"id={p['id']}, brand={p['brand']}, model={p['model']}, storage={p['storage']}")

    print("\n\n=== BigQuery Data (telecom_demo) ===")
    print("\n--- dim_plan ---")
    for r in bq_plans:
        print(f"plan_id={r['plan_id']}, plan_name={r['plan_name']}, price=${r['price_usd']}, tier={r['tier']}")
    print("\n--- dim_device ---")
    for r in bq_devices:
        print(f"device_id={r['device_id']}, brand={r['brand']}, model={r['model']}, storage={r['storage_gb']}GB")

if __name__ == "__main__":
    main()
