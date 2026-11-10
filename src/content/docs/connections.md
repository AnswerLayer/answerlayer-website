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

## Subject filtering for embedded tenants

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

Send the same stable subject value on every request that can query or discover data. See [Authentication](/docs/authentication#attributing-requests-to-your-end-users) for subject identity rules. To remove the setting, update the connection with `"subject_filter_config": null` and stop sending `X-Subject-Org-ID`.

## File uploads

AnswerLayer also supports direct file uploads as data sources:

| Type | Endpoint | Content-Type |
|------|----------|-------------|
| CSV | `POST /api/v1/csv/upload` | `multipart/form-data` |
| DuckDB | `POST /api/v1/duckdb/upload` | `multipart/form-data` |

### CSV upload example

```bash
curl -X POST https://app.answerlayer.io/api/v1/csv/upload \
  -H "X-API-Key: $ANSWERLAYER_API_KEY" \
  -F "file=@sales_data.csv" \
  -F "name=Sales Data" \
  -F "has_header=true" \
  -F "delimiter=,"
```
