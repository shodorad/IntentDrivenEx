#!/usr/bin/env python3
"""
Compare every field in products.js (PLANS and PHONES) with BigQuery dim tables.
Show what's present and what's missing.
"""

import json
import re
from pathlib import Path
from google.cloud import bigquery

def load_js_export(path, export_name):
    txt = Path(path).read_text(encoding="utf-8")
    txt = re.sub(r"//.*", "", txt)
    txt = re.sub(r"/\*.*?\*/", "", txt, flags=re.DOTALL)
    pattern = rf"export\s+const\s+{export_name}\s*=\s*(.+?);\s*$"
    m = re.search(pattern, txt, re.DOTALL)
    if not m:
        raise ValueError(f"Could not parse {export_name} from {path}")
    return json.loads(m.group(1))

def bq_schema(table_id):
    client = bigquery.Client(project="data-practice-472314")
    table_ref = client.dataset("telecom_demo").table(table_id)
    table = client.get_table(table_ref)
    return [field.name for field in table.schema]

def main():
    repo_root = Path(__file__).parent.parent
    products = load_js_export(repo_root / "clearpath-ai" / "src" / "data" / "products.js", "PLANS")
    phones = load_js_export(repo_root / "clearpath-ai" / "src" / "data" / "products.js", "PHONES")

    bq_plan_fields = bq_schema("dim_plan")
    bq_device_fields = bq_schema("dim_device")

    print("=== PLANS: products.js fields vs BigQuery dim_plan columns ===")
    plan_fields = set(products[0].keys())
    print("products.js PLANS fields:", sorted(plan_fields))
    print("BigQuery dim_plan columns:", sorted(bq_plan_fields))
    print("Missing from BigQuery:", sorted(plan_fields - set(bq_plan_fields)))
    print("Extra in BigQuery:", sorted(set(bq_plan_fields) - plan_fields))

    print("\n=== PHONES: products.js fields vs BigQuery dim_device columns ===")
    phone_fields = set(phones[0].keys())
    print("products.js PHONES fields:", sorted(phone_fields))
    print("BigQuery dim_device columns:", sorted(bq_device_fields))
    print("Missing from BigQuery:", sorted(phone_fields - set(bq_device_fields)))
    print("Extra in BigQuery:", sorted(set(bq_device_fields) - phone_fields))

if __name__ == "__main__":
    main()
