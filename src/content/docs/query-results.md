---
title: Result Handles
description: Page through large query results with an opaque result handle and cursor.
order: 40
section: Endpoints
---

When a query returns more rows than fit in a single response, AnswerLayer materializes the result once and returns a **result handle** — an opaque identifier you use to fetch the rest of the rows one page at a time. This avoids re-running an expensive query for every page and gives a consistent snapshot across pages.

## When you get a handle

Endpoints that can return large result sets — [`POST /api/v1/saved-queries/{id}/execute`](/docs/saved-queries#execute) and [`POST /api/v1/dashboards/{id}/tiles/{tile_id}/data`](/docs/dashboards#tile-data) — share one response envelope:

| Field | Description |
|---|---|
| `columns` / `rows` | The current page. |
| `row_count` | Rows in this page. |
| `total_rows` | Total rows in the full result, when known. |
| `next_cursor` | Opaque cursor for the next page, or `null` on the last page. |
| `result_handle` | Opaque handle for the materialized result, or `null` if the result was small enough to return inline. |
| `expires_at` | When the handle stops being fetchable. |

A result at or below 1,000 rows is returned **inline**: every row in the first response, with `next_cursor` and `result_handle` both `null`. Larger results come back as a first page plus a `result_handle` and a `next_cursor`.

## Fetch a page

```http
GET /api/v1/query-results/{handle}
```

**Required scope:** `query:execute`.

| Query parameter | Type | Description |
|---|---|---|
| `cursor` | string | Opaque cursor from a previous `next_cursor`. Omit for the first page. |
| `limit` | int | Rows per page. Default 1000, capped at 10000. |

Returns the same envelope as the originating endpoint. Keep following `next_cursor` until it comes back `null`.

### Example

```bash
# First page.
curl "https://app.answerlayer.io/api/v1/query-results/$HANDLE?limit=500" \
  -H "X-API-Key: $ANSWERLAYER_API_KEY"

# Next page — pass the cursor from the previous response.
curl "https://app.answerlayer.io/api/v1/query-results/$HANDLE?cursor=$NEXT_CURSOR&limit=500" \
  -H "X-API-Key: $ANSWERLAYER_API_KEY"
```

### Errors

| Status | Meaning |
|---|---|
| `404` | No result is stored for this handle. |
| `403` | The handle belongs to a different organization or caller. |
| `410` | The handle has expired — re-run the original query. |
| `400` | The `cursor` value is malformed. |

## Release a handle

```http
DELETE /api/v1/query-results/{handle}
```

Discards the materialized result before it expires. Returns `204`. Optional — handles expire on their own — but useful to free storage once the client is done paging.

## Expiry

Result handles expire **one hour** after the result is materialized. After expiry, `GET` returns `410 Gone`; re-run the original query to get a fresh handle. Cursors are only valid against their own handle and become unusable once it expires.
