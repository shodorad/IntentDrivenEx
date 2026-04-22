#!/usr/bin/env python3
"""
Compare every field in products.js (PLANS and PHONES) with BigQuery dim tables.
Show what's present and what's missing.
"""

from pathlib import Path
from google.cloud import bigquery

def bq_schema(table_id):
    client = bigquery.Client(project="data-practice-472314")
    table_ref = client.dataset("telecom_demo").table(table_id)
    table = client.get_table(table_ref)
    return [field.name for field in table.schema]

def main():
    # Manually list fields from products.js to avoid parsing issues
    plan_fields = {
        "id", "name", "price", "priceNote", "data", "hotspot", "talk", "text",
        "network", "international", "videoStreaming", "features", "highlight",
        "solveLabel", "solves", "badge", "dealNote", "url"
    }
    phone_fields = {
        "id", "name", "brand", "price", "priceNote", "camera", "storage", "ram",
        "battery", "display", "features", "highlight", "solveLabel", "solves",
        "badge", "image", "url", "dealExpiry", "dealLimit"
    }

    bq_plan_fields = set(bq_schema("dim_plan"))
    bq_device_fields = set(bq_schema("dim_device"))

    print("=== PLANS: products.js fields vs BigQuery dim_plan columns ===")
    print("products.js PLANS fields:", sorted(plan_fields))
    print("BigQuery dim_plan columns:", sorted(bq_plan_fields))
    print("Missing from BigQuery:", sorted(plan_fields - bq_plan_fields))
    print("Extra in BigQuery:", sorted(bq_plan_fields - plan_fields))

    print("\n=== PHONES: products.js fields vs BigQuery dim_device columns ===")
    print("products.js PHONES fields:", sorted(phone_fields))
    print("BigQuery dim_device columns:", sorted(bq_device_fields))
    print("Missing from BigQuery:", sorted(phone_fields - bq_device_fields))
    print("Extra in BigQuery:", sorted(bq_device_fields - phone_fields))

if __name__ == "__main__":
    main()
