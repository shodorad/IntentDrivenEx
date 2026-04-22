#!/usr/bin/env python3
"""
List all tables in the BigQuery telecom_demo dataset.
"""

from google.cloud import bigquery

def main():
    client = bigquery.Client(project="data-practice-472314")
    dataset_ref = client.dataset("telecom_demo")
    tables = client.list_tables(dataset_ref)
    print("BigQuery tables in telecom_demo dataset:")
    for table in tables:
        print("-", table.table_id)

if __name__ == "__main__":
    main()
