---
title: Saved Queries
description: Persist queries for reuse — promote SQL from an inquiry turn or save it directly.
order: 30
section: Endpoints
---

A saved query is a named, persisted record of an SQL query bound to a connection. It backs dashboard tiles and provides a stable reference for queries you want to reuse across users in your organization.

**Required scope:** `query:execute` for all operations. `update` and `delete` are additionally restricted to the saved query's creator.

## Visibility

Each saved query has a `visibility` value that controls who can see it:

| Visibility | Who can see it |
|---|---|
| `private` *(default)* | The creator only. |
| `org` | Anyone authenticated for the organization. |
| `embed` | Anyone authenticated for the organization, plus embed contexts. |

`sql` and `connection_id` are immutable after creation. To change them, create a new saved query and delete the old one.

## List

```http
GET /api/v1/saved-queries
```

Returns saved queries the caller can see — their own private rows plus everything `visibility=org` or `visibility=embed` for the organization. Admins see all rows including other users' private ones.

## Create from SQL

```http
POST /api/v1/saved-queries
```

Returns `201` with the created saved query.

### Request body

| Field | Type | Required | Description |
|---|---|---|---|
| `sql` | string | Yes | The SQL to persist |
| `connection_id` | string (UUID) | Yes | Connection the SQL targets |
| `name` | string | Yes | Human-readable label, max 200 chars |
| `description` | string | No | Long-form description |
| `visibility` | `"private"` \| `"org"` \| `"embed"` | No | Default `"private"` |

### Example

```bash
curl -X POST https://app.answerlayer.io/api/v1/saved-queries \
  -H "X-API-Key: $ANSWERLAYER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Top customers by revenue",
    "sql": "SELECT customer_id, SUM(amount) FROM orders GROUP BY customer_id ORDER BY 2 DESC LIMIT 10",
    "connection_id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "visibility": "org"
  }'
```

## Create from an inquiry turn

```http
POST /api/v1/saved-queries/from-inquiry-turn
```

Promotes the SQL the agent generated for an existing inquiry turn into a saved query. Useful for "save this answer" UX after a user finds a question they want to keep.

### Request body

| Field | Type | Required | Description |
|---|---|---|---|
| `inquiry_turn_id` | string (UUID) | Yes | The turn whose SQL to promote |
| `name` | string | Yes | Human-readable label, max 200 chars |
| `description` | string | No | Long-form description |
| `visibility` | `"private"` \| `"org"` \| `"embed"` | No | Default `"private"` |

The connection is inherited from the turn's session.

## Read

```http
GET /api/v1/saved-queries/{saved_query_id}
```

Returns `404` if the row doesn't exist or the caller's visibility doesn't include it.

## Execute

```http
POST /api/v1/saved-queries/{saved_query_id}/execute
```

Resolves the saved query, then runs its SQL against its connection in one call. Same response shape as [`POST /api/v1/query/{connection_id}`](/docs/query#execute) — use this when you'd otherwise have to `GET` the saved query and then `POST` to `/query/{connection_id}` yourself.

The `connection_id` and `sql` come from the saved query record, not the request body.

Returns `404` if the saved query is missing or the caller's visibility doesn't include it, or if the underlying connection has been deleted. The audit log records `resource_type=saved_query`, `resource_id=<saved_query_id>` so the saved query is the audit subject — not a free-form SQL string.

### Request body

| Field | Type | Required | Description |
|---|---|---|---|
| `params` | object | No | Optional parameter map for parameterized queries |
| `row_limit` | int | No | Caps the rows returned. Default 1000, max 10000. |
| `timeout` | int | No | Seconds. Default 30, max 120. |

### Example

```bash
curl -X POST https://app.answerlayer.io/api/v1/saved-queries/$SAVED_QUERY_ID/execute \
  -H "X-API-Key: $ANSWERLAYER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"row_limit": 100}'
```

## Update

```http
PATCH /api/v1/saved-queries/{saved_query_id}
```

Partial update. Only `name`, `description`, and `visibility` are mutable.

Only the saved query's owner or an organization admin may update it.

## Delete

```http
DELETE /api/v1/saved-queries/{saved_query_id}
```

Soft-deletes the row. Saved queries referenced by dashboard tiles remain referenced; the tile starts returning a `not found` error until the reference is updated. Returns `204`.

Only the owner or an organization admin may delete.
