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
