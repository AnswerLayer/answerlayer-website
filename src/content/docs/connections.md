---
title: Connections
description: Manage database connections to your data warehouse.
order: 15
section: Endpoints
---

Connections represent a link to your data warehouse. AnswerLayer supports Postgres, BigQuery, Snowflake, MySQL, SQL Server, ClickHouse, Athena, DuckDB, and CSV uploads.

## List connections

```http
GET /api/v1/connections/
```

Returns all active connections for the organization.

## Test a connection

```http
POST /api/v1/connections/{connection_id}/test_existing
```

Tests that an existing connection can reach the database.

## Schema metadata

```http
GET /api/v1/connections/{connection_id}/schema
```

Returns the database schema -- tables, columns, types, and any PII annotations.

## Legacy subject filtering for embedded tenants

`subject_filter_config` is the legacy option for connections where a single warehouse column contains the same customer-organization identifier supplied in `X-Subject-Org-ID`. New integrations that use embedded inquiry access should use explicit product, region, and report grants instead. A connection cannot use both mechanisms.

Before an integration sends `X-Subject-Org-ID`, an AnswerLayer deployment administrator must configure the selected connection with the warehouse column that contains the same tenant identifier. Do not rely on the header for isolation until this server-side setting is present and tested.

```http
PUT /api/v1/connections/{connection_id}
Content-Type: application/json
```

```json
{
  "subject_filter_config": {
    "column": "tenant_id",
    "type": "string"
  }
}
```

`column` must be an unqualified SQL identifier: letters, digits, and underscores, starting with a letter or underscore. The query result must expose this column so AnswerLayer can apply the parameterized outer filter. A request that includes `X-Subject-Org-ID` fails closed if the connection has no valid subject filter or the filter cannot be applied.

Verify the setting before production use:

1. Read `GET /api/v1/connections/{connection_id}` and confirm its `subject_filter_config` contains the intended column.
2. Execute a controlled query with an `X-Subject-Org-ID` whose rows are known.
3. Confirm only that tenant's rows are returned and that an unknown tenant returns no rows.

Send the same stable subject value on every request that can query or discover data. See [Authentication](/docs/authentication#attributing-requests-to-your-end-users) for subject identity rules. To migrate the connection to embedded inquiry access, first update it with `"subject_filter_config": null`; then configure its inquiry access catalog. The subject organization remains part of session identity but is no longer translated directly into a warehouse row filter.

## Embedded inquiry access configuration

Embedded inquiry access uses a server-owned catalog to translate public product and report identifiers into physical tables, allowed columns, and mandatory region filters. It is mutually exclusive with legacy `subject_filter_config`.

```http
PUT /api/v1/connections/{connection_id}
Content-Type: application/json
```

```json
{
  "subject_filter_config": null,
  "inquiry_access_config": {
    "required": true,
    "products": {
      "analytics": {
        "region_ids": ["region-123", "region-456"],
        "reports": {
          "report-abc": {
            "tables": [
              {
                "table": "analytics.report_data",
                "region_column": "region_id",
                "region_type": "string",
                "allowed_columns": ["region_id", "period", "value"]
              }
            ]
          }
        }
      }
    }
  }
}
```

Product, region, and report identifiers are public entitlement identifiers agreed with the embedding product. Physical table and column names remain server-side. `table` must match the qualified name exposed by schema discovery. `region_column` is applied at every scan of that table before joins or aggregation; `region_type` is `string` or `integer`. `allowed_columns` is explicit and non-empty.

Every table used by a report must be registered. A physical table must use one consistent region column, region type, and allowed-column list throughout the catalog. Multiple granted reports may map to that table only when they share that rule; their authorized regions are combined without expanding the table's allowed columns. AnswerLayer freezes the catalog hash when it creates a session; changing the catalog invalidates existing access-controlled sessions. Invalid or unregistered mappings fail closed. See [Embedded inquiry access](/docs/inquiry#embedded-inquiry-access) for the session grant payload.

## File uploads

AnswerLayer also supports direct file uploads as data sources:

| Type | Endpoint | Content-Type |
|------|----------|-------------|
| CSV | `POST /api/v1/csv/upload` | `multipart/form-data` |
| DuckDB | `POST /api/v1/duckdb/upload` | `multipart/form-data` |

### CSV upload example

```bash
curl -X POST "$ANSWERLAYER_BASE_URL/api/v1/csv/upload" \
  -H "X-API-Key: $ANSWERLAYER_API_KEY" \
  -F "file=@sales_data.csv" \
  -F "name=Sales Data" \
  -F "has_header=true" \
  -F "delimiter=,"
```
