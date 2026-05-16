---
title: Embedded Dashboards
description: Render an AnswerLayer dashboard inside your own product — discover tiles with the manifest, then load tile data on demand.
order: 35
section: Endpoints
---

A dashboard is a named collection of tiles. Each tile is backed by a saved query and carries a `visualization_config` describing how to render it. The embedded-dashboard endpoints let a host application render a dashboard with its own UI: first fetch a lightweight **manifest** to discover the tiles, then fetch each tile's data **on demand**.

## Load model

Embedded dashboards use a two-step load, and the split is deliberate:

1. **Manifest** — `GET /api/v1/dashboards/{dashboard_id}/manifest` returns metadata only. It runs **no source-database queries**, so it returns immediately.
2. **Tile data** — `POST /api/v1/dashboards/{dashboard_id}/tiles/{tile_id}/data` executes one tile's query and returns its rows.

> **Do not execute every tile's query on initial page load.** Some source-database queries take several seconds. Fetch the manifest first, render the dashboard skeleton, then request tile data per tile — ideally lazily, as tiles scroll into view. The manifest is the cheap discovery call; tile data is the expensive one.

## Tile keys

A tile's stable identifier for embedding is its **`tile_key`** — a value you set under `visualization_config.tile_key`. Bind your UI regions to `tile_key`, never to the tile's `title` (titles are editable display text) or to response order.

A `tile_key` must match `^[a-z][a-z0-9_]{0,99}$` — start with a lowercase letter, then lowercase letters, digits, and underscores, up to 100 characters. Examples: `avg_engagement_score`, `high_churn_risk`, `member_engagement_table`.

A `tile_key` is unique within a dashboard. A tile with no `tile_key` set is returned in the manifest with `tile_key: null` — the host application should surface a configuration warning or skip the tile.

## Visualization config

Every manifest tile carries a typed **`visualization`** object describing how to render the tile's data. It tells the client which column plays which role — so you resolve a role to a column name and never hard-code column names.

```json
{
  "chart_type": "metric",
  "tile_key": "avg_engagement_score",
  "encoding": { "kind": "metric", "value": "score", "label": "Avg Engagement" },
  "raw": null
}
```

| Field | Description |
|---|---|
| `chart_type` | One of `metric`, `bar`, `line`, `area`, `donut`, `table`. |
| `tile_key` | The stable embedding key, or `null`. |
| `encoding` | Role → column-name mapping for this chart type (see below). |
| `raw` | Set only when the stored config could not be fully interpreted (an unrecognized chart type) — the original config dict, for fallback. `null` otherwise. |

### Encoding by chart type

`encoding.kind` discriminates the shape:

| `chart_type` | `encoding` | Roles |
|---|---|---|
| `metric` | `{ "kind": "metric", "value", "label" }` | `value` — column holding the number |
| `bar` / `line` / `area` | `{ "kind": "axis", "x", "y": [...], "series", "x_label", "y_label", "sort" }` | `x` — category/time column; `y` — one or more value columns; `series` — optional grouping column |
| `donut` | `{ "kind": "donut", "label", "value" }` | `label` — category column; `value` — slice-size column |
| `table` | `{ "kind": "table", "columns": [...] }` | `columns` — columns to show, in order; `null` means all |

To render, resolve the role to a column name, then look up its index in the response `columns`:

```js
// metric tile
const valueIdx = data.columns.indexOf(tile.visualization.encoding.value);
const value = data.rows[0][valueIdx];
```

A tile published for embedding (one with a `tile_key`) is validated at save time to carry a complete encoding for its `chart_type` — a `metric` must name its `value` column, a `bar` its `x` and `y`, and so on — so an embed client can rely on the encoding being present. The raw stored form is still returned as `visualization_config`; prefer the typed `visualization`.

## Manifest

```http
GET /api/v1/dashboards/{dashboard_id}/manifest
```

Returns the dashboard's tiles and the URL to load each one's data. Performs no query execution. Returns `404` if the dashboard does not exist or the caller cannot see it. Only tiles the caller can access through the dashboard are included.

### Response

```json
{
  "dashboard_id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
  "title": "Member Engagement",
  "tiles": [
    {
      "tile_id": "5f1c7e3a-8b2d-4c6e-9a1f-2e3d4c5b6a7f",
      "title": "Average engagement score",
      "tile_key": "avg_engagement_score",
      "visualization": {
        "chart_type": "metric",
        "tile_key": "avg_engagement_score",
        "encoding": { "kind": "metric", "value": "score", "label": "Avg Engagement" },
        "raw": null
      },
      "visualization_config": { "chart_type": "metric", "tile_key": "avg_engagement_score" },
      "data_url": "/api/v1/dashboards/d290f1ee-…/tiles/5f1c7e3a-…/data",
      "pagination": { "default_page_size": 1000, "max_page_size": 10000 }
    }
  ]
}
```

| Field | Description |
|---|---|
| `tile_id` | The tile's UUID. Use it in the tile-data URL. |
| `title` | Display text. Do not use as a contract key. |
| `tile_key` | Stable embedding key, or `null` if unset. |
| `visualization` | Typed render contract — `chart_type` + per-type `encoding`. See [Visualization config](#visualization-config). |
| `visualization_config` | The raw stored config dict. Prefer the typed `visualization`. |
| `data_url` | Path to `POST` for this tile's data. |
| `pagination` | `default_page_size` and `max_page_size` for tile-data requests. |

## Tile data

```http
POST /api/v1/dashboards/{dashboard_id}/tiles/{tile_id}/data
```

Executes the tile's saved query and returns its rows. Verifies the caller can access the dashboard and that the tile is attached to it — a tile attached to a different dashboard returns `404`.

### Request body

| Field | Type | Required | Description |
|---|---|---|---|
| `filters` | object | No | Parameter map applied to the tile's query. |
| `pagination` | object | No | `{ "limit": int, "cursor": string }`. `limit` is capped at the manifest's `max_page_size`. |
| `result_handle` | string | No | Continue paging an earlier result. Must be a handle this same tile produced — a handle from another tile is rejected with `404`. See [Result handles](/docs/query-results). |

### Response

```json
{
  "columns": ["score"],
  "rows": [[72.4]],
  "row_count": 1,
  "total_rows": 1,
  "next_cursor": null,
  "result_handle": null,
  "expires_at": null,
  "execution_time_ms": 8423,
  "computed_at": "2026-05-16T14:03:11Z",
  "cache_hit": false,
  "encoding_warnings": []
}
```

| Field | Description |
|---|---|
| `columns` / `rows` | The result set for this page. |
| `row_count` | Rows in this page. |
| `total_rows` | Total rows in the full result, when known. |
| `next_cursor` | Opaque cursor for the next page, or `null` when this is the last page. |
| `result_handle` | Opaque handle identifying the materialized result. `null` for small results returned inline. |
| `expires_at` | When `result_handle` stops being fetchable, or `null`. |
| `execution_time_ms` | Source-database execution time. |
| `computed_at` | When the underlying result was produced. |
| `cache_hit` | `true` if served from cache without re-running the source query. |
| `encoding_warnings` | Messages when the tile's `visualization.encoding` references a column the query did not return — e.g. the saved query was edited after the tile was configured. Empty when the encoding is consistent with the result. |

### Small vs. large results

A result at or below 1,000 rows is returned **inline** — all rows in the response, `next_cursor` and `result_handle` both `null`. This covers metric tiles and most chart tiles.

A larger result is **materialized**: the response carries the first page plus a `result_handle` and a `next_cursor`. Fetch further pages with [`GET /api/v1/query-results/{handle}`](/docs/query-results), or by re-posting to this endpoint with the `result_handle` in the request body.

## Caching

Tile data is cached so repeat dashboard views do not re-run slow source queries. A second request with the same dashboard, tile, filters, and embed context returns `cache_hit: true` and serves the stored result — typically in milliseconds rather than seconds.

The cache key spans organization, embed/subject-org context, dashboard, tile, the tile's saved query and SQL, the connection, and the request `filters`. Any difference is a separate cache entry, so changing a filter never returns another filter's data. Editing the saved query behind a tile produces a new key, so stale results are bypassed. Cached entries expire after one hour; `computed_at` and `expires_at` report freshness.

## End-to-end example

```bash
# 1. Discover the dashboard's tiles.
curl https://app.answerlayer.io/api/v1/dashboards/$DASHBOARD_ID/manifest \
  -H "X-API-Key: $ANSWERLAYER_API_KEY"

# 2. In your client, index the tiles by tile_key:
#      tiles["avg_engagement_score"], tiles["member_engagement_table"], …

# 3. Load a metric tile (small — returned inline).
curl -X POST "https://app.answerlayer.io$DATA_URL_FOR_AVG_ENGAGEMENT_SCORE" \
  -H "X-API-Key: $ANSWERLAYER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
#   → { "rows": [[72.4]], "next_cursor": null, "cache_hit": false, … }

# 4. Load a table tile (large — paginated). First page:
curl -X POST "https://app.answerlayer.io$DATA_URL_FOR_MEMBER_ENGAGEMENT_TABLE" \
  -H "X-API-Key: $ANSWERLAYER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"pagination": {"limit": 500}}'
#   → { "rows": [...500...], "result_handle": "a1b2…", "next_cursor": "eyJvZmZ…", … }

# 5. Fetch the next page with the handle and cursor.
curl "https://app.answerlayer.io/api/v1/query-results/a1b2…?cursor=eyJvZmZ…&limit=500" \
  -H "X-API-Key: $ANSWERLAYER_API_KEY"
```

## Migrating from saved-query-name lookup

Earlier integrations discovered a dashboard's data by calling [`GET /api/v1/dashboards/{id}/saved-queries`](/docs/saved-queries#list-by-dashboard), matching saved queries by `name`, and executing each one with `POST /api/v1/saved-queries/{id}/execute`.

Prefer the manifest flow instead:

| Was | Now |
|---|---|
| `GET /dashboards/{id}/saved-queries` then match on `name` | `GET /dashboards/{id}/manifest`, bind on `tile_key` |
| `POST /saved-queries/{id}/execute` per query | `POST /dashboards/{id}/tiles/{tile_id}/data` per tile |
| No pagination; whole table returned | Inline small results; `result_handle` + cursor for large ones |
| Re-runs the source query every call | Cached; `cache_hit` reported |

Names and titles are editable display text and should not be contract keys; `tile_key` is the stable handle. The manifest also returns the `data_url` per tile, so the client never constructs endpoint paths itself.
