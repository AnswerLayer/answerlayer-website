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

## Agent stream

**Required scope:** `query:execute`

```http
POST /api/v1/query/agent/stream
```

NL-to-SQL streaming endpoint. Submits a natural-language question and streams the agent's reasoning, generated SQL, and result rows over Server-Sent Events.

### Request body

| Field | Type | Required | Description |
|---|---|---|---|
| `question` | string | Yes | The natural language question |
| `connection_id` | string (UUID) | Yes | Connection to query |
| `chain_id` | string (UUID) | No | Existing chain to extend (multi-turn) |
| `source` | string | No | Free-form provenance tag, e.g. `web`, `slack`, `mcp`. Default `web`. |

For multi-turn conversational use, prefer [inquiry sessions](/docs/inquiry) — they manage chain state for you.
