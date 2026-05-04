---
title: Query
description: Execute, validate, and export raw SQL against your registered database connections.
order: 22
section: Endpoints
---

The query endpoints execute SQL directly against a registered connection. They're the lower-level cousin of [inquiry sessions](/docs/inquiry) — useful when you've already produced the SQL (from your own tooling, or from an inquiry result) and want to run it.

All query endpoints require the `query:execute` scope.

## Execute

**Required scope:** `query:execute`

```http
POST /api/v1/query/{connection_id}
```

### Request body

| Field | Type | Required | Description |
|---|---|---|---|
| `query` | string | Yes | The SQL to run |
| `params` | object | No | Optional parameter map for parameterized queries |
| `row_limit` | int | No | Caps the rows returned. Default 1000, max 10000. |
| `timeout` | int | No | Seconds. Default 30, max 120. |

### Example

```bash
curl -X POST https://app.answerlayer.io/api/v1/query/$CONNECTION_ID \
  -H "X-API-Key: $ANSWERLAYER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT region, SUM(amount) FROM orders GROUP BY region", "row_limit": 100}'
```

## Validate

**Required scope:** `query:execute`

```http
POST /api/v1/query/{connection_id}/validate
```

Parses the SQL and reports whether it's safe to run, without executing it. Always returns `200`; the response body says whether it passed.

### Response

```json
{
  "is_valid": true,
  "query_type": "select",
  "tables": ["orders", "customers"],
  "columns": ["amount", "customer_id"],
  "warning": null
}
```

On failure, the same shape with `is_valid: false`:

```json
{
  "is_valid": false,
  "error": "DDL statements are not permitted",
  "query_type": "create",
  "position": 0
}
```

## Export

**Required scope:** `query:execute`

```http
POST /api/v1/query/{connection_id}/export?format=csv
```

Same body shape as `execute`, but returns the result set as a downloadable file rather than JSON.

### Query parameters

| Name | Type | Default | Values |
|---|---|---|---|
| `format` | string | `csv` | `csv`, `json`, `excel` |

### Example

```bash
curl -X POST "https://app.answerlayer.io/api/v1/query/$CONNECTION_ID/export?format=excel" \
  -H "X-API-Key: $ANSWERLAYER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT * FROM orders LIMIT 10000"}' \
  -o orders.xlsx
```

For natural-language questions and multi-turn conversational use, see [inquiry sessions](/docs/inquiry).
