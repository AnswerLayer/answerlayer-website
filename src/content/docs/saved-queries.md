---
title: Saved Queries
description: Persist queries for reuse across users in an organization.
order: 30
section: Endpoints
---

A saved query is a named, parameterizable query persisted at the organization level. It backs dashboard tiles and provides a stable reference for reused analyses.

## List

```http
GET /api/v1/saved-queries
```

Returns all saved queries for the calling organization.

## Create

```http
POST /api/v1/saved-queries
```

Returns `201` with the created saved query.

### Request body (typical fields)

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Human-readable label |
| `connection_id` | string (UUID) | Yes | Connection the query targets |
| `query` | string | Yes | The SQL or semantic-layer expression |
| `description` | string | No | Long-form description |
| `params` | object | No | Default parameter values |

The full request shape is enforced server-side by Pydantic. Inspect `400` validation errors for the canonical field list.

## Read

```http
GET /api/v1/saved-queries/{saved_query_id}
```

## Update

```http
PATCH /api/v1/saved-queries/{saved_query_id}
```

Partial update — only the fields included in the body are applied.

## Delete

```http
DELETE /api/v1/saved-queries/{saved_query_id}
```

Returns `204`. Idempotent. Saved queries referenced by dashboard tiles remain referenced; the tile starts returning a `not found` error until the reference is updated.
