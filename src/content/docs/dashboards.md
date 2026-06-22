---
title: Embedded Dashboards
description: Render an AnswerLayer dashboard inside your own product — discover tiles with the manifest, then load tile data on demand.
order: 35
section: Endpoints
---

A dashboard is a named collection of tiles. Each tile is backed by a query source and carries a typed `visualization` contract describing how to render it. The embedded-dashboard endpoints let a host application render a dashboard with its own UI: first fetch a lightweight **manifest** to discover the tiles, then fetch each tile's data **on demand**.

## Load model

Embedded dashboards use a two-step load, and the split is deliberate:

1. **Manifest** — `GET /api/v1/dashboards/{dashboard_id}/manifest` returns metadata only. It runs **no source-database queries**, so it returns immediately.
2. **Tile data** — `POST /api/v1/dashboards/{dashboard_id}/tiles/{tile_id}/data` executes one tile's query and returns its rows.

> **Do not execute every tile's query on initial page load.** Some source-database queries take several seconds. Fetch the manifest first, render the dashboard skeleton, then request tile data per tile — ideally lazily, as tiles scroll into view. The manifest is the cheap discovery call; tile data is the expensive one.

## Tile keys

A tile's stable identifier for embedding is its **`tile_key`** — a value set on the tile's `visualization.tile_key`. Bind your UI regions to `tile_key`, never to the tile's `title` (titles are editable display text) or to response order.

A `tile_key` must match `^[a-z][a-z0-9_]{0,99}$` — start with a lowercase letter, then lowercase letters, digits, and underscores, up to 100 characters. Examples: `avg_engagement_score`, `high_churn_risk`, `member_engagement_table`.

A `tile_key` is unique within a dashboard. A tile with no `tile_key` set is returned in the manifest with `tile_key: null` — the host application should surface a configuration warning or skip the tile.

## Visualization config

Every manifest tile carries a typed **`visualization`** object describing how to render the tile's data. It tells the client which column plays which role — so you resolve a role to a column name and never hard-code column names.

```json
{
  "chart_type": "metric",
  "tile_key": "avg_engagement_score",
  "encoding": {
    "kind": "metric",
    "value": "score",
    "label": "Avg Engagement",
    "indicator": "score_delta",
    "indicator_label": "vs last month",
    "indicator_format": "points"
  }
}
```

| Field | Description |
|---|---|
| `chart_type` | One of `metric`, `bar`, `line`, `area`, `donut`, `table`. |
| `tile_key` | The stable embedding key, or `null`. |
| `encoding` | Role → column-name mapping for this chart type (see below). |

### Encoding by chart type

`encoding.kind` discriminates the shape:

| `chart_type` | `encoding` | Roles |
|---|---|---|
| `metric` | `{ "kind": "metric", "value", "label", "indicator", "indicator_label", "indicator_format" }` | `value` — column holding the number; `indicator` — optional comparison/change column; `indicator_format` — optional `number`, `integer`, `percent`, or `points` |
| `bar` / `line` / `area` | `{ "kind": "axis", "x", "y": [...], "series", "x_label", "y_label", "sort" }` | `x` — category/time column; `y` — one or more value columns; `series` — optional grouping column |
| `donut` | `{ "kind": "donut", "label", "value" }` | `label` — category column; `value` — slice-size column |
| `table` | `{ "kind": "table", "columns": [...], "roles": { ... } }` | `columns` — columns to show, in order; `null` means all. `roles` — optional stable role names mapped to result columns |

To render, resolve the role to a column name, then look up its index in the response `columns`:

```js
// metric tile
const valueIdx = data.columns.indexOf(tile.visualization.encoding.value);
const value = data.rows[0][valueIdx];
```

For table tiles, `roles` lets an embed client bind product behavior to semantic column roles without hard-coding source column names. `columns` still controls display order; `roles` is metadata for integration logic.

```json
{
  "chart_type": "table",
  "tile_key": "member_engagement_table",
  "encoding": {
    "kind": "table",
    "columns": ["member_name", "score", "last_activity_at"],
    "roles": {
      "member_name": "member_name",
      "engagement_score": "score",
      "last_activity": "last_activity_at"
    }
  }
}
```

```js
// table tile
const roles = tile.visualization.encoding.roles ?? {};
const scoreColumn = roles.engagement_score;
const scoreIdx = data.columns.indexOf(scoreColumn);
const score = data.rows[0][scoreIdx];
```

Role names use the same stable-key format as `tile_key`: `^[a-z][a-z0-9_]{0,99}$`. Values are result column names returned by the tile query.

A tile published for embedding (one with a `tile_key`) is validated at save time to carry a complete encoding for its `chart_type` — a `metric` must name its `value` column, a `bar` its `x` and `y`, and so on — so an embed client can rely on the encoding being present.

## Query parameters

Tiles can declare typed query parameters for customer-provided settings, such as coefficients in a scoring formula. Parameters are declared on the tile, surfaced in the manifest, and resolved at execution time.

Saved parameter settings are scoped by:

```text
organization + dashboard + tile + X-Subject-Org-ID
```

`X-Subject-Org-ID` is the tenant/customer identifier your backend sends for the embedded request. Parameter settings are not scoped by `X-Subject-User-ID` today.

### Placeholder syntax

Saved SQL should use named placeholders:

```sql
select
  :retention_weight * retention_score
  + :engagement_weight * engagement_score as score
from member_scores
```

Parameters are bound scalar values only. They cannot be SQL fragments, identifiers, table names, or clauses.

### Parameter contract

Each parameter in the manifest has this shape:

| Field | Description |
|---|---|
| `key` | Stable parameter key. Same format as `tile_key`: `^[a-z][a-z0-9_]{0,99}$`. |
| `label` | Optional display label. |
| `type` | One of `number`, `string`, `boolean`. |
| `default` | Optional tile-level default value. |
| `value` | Effective value for this request: saved subject-org setting if present, otherwise the default. May be `null` when a required value is not configured yet. |
| `required` | Whether the tile requires a non-null value before execution. |
| `min` / `max` | Optional numeric bounds for `number` parameters. |
| `options` | Optional allowed values for `string` parameters. |
| `viewer_editable` | Whether embedded viewers may update or override this parameter through the public settings/data endpoints. |

Only `viewer_editable: true` parameters may be sent in `params` or `PUT /parameters`. Non-editable parameters may still appear in the manifest and may contribute to execution through defaults or previously saved settings.

## Manifest

```http
GET /api/v1/dashboards/{dashboard_id}/manifest
```

Returns the dashboard's tiles, each tile's visualization and parameter contract, and the URL to load each tile's data. Performs no query execution. Returns `404` if the dashboard does not exist or the caller cannot see it. Only tiles the caller can access through the dashboard are included.

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
        "encoding": {
          "kind": "metric",
          "value": "score",
          "label": "Avg Engagement",
          "indicator": "score_delta",
          "indicator_label": "vs last month",
          "indicator_format": "points"
        }
      },
      "expected_columns": ["score", "score_delta"],
      "parameters": [
        {
          "key": "retention_weight",
          "label": "Retention weight",
          "type": "number",
          "default": 0.7,
          "value": 0.8,
          "required": false,
          "min": 0,
          "max": 1,
          "options": null,
          "viewer_editable": true
        }
      ],
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
| `expected_columns` | Column names referenced by the tile's visualization encoding, including table `columns` and table `roles`. Use this for early configuration checks before loading data. |
| `parameters` | Parameter contract and effective values for the requesting subject org. Use this to render customer-facing settings controls. |
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
| `params` | object | No | Runtime parameter overrides for this request. Keys must match `viewer_editable: true` tile parameters. Runtime params override saved subject-org settings for this request only. |
| `pagination` | object | No | `{ "limit": int, "cursor": string }`. `limit` is capped at the manifest's `max_page_size`. |
| `result_handle` | string | No | Continue paging an earlier result. Must be a handle this same tile produced — a handle from another tile is rejected with `404`. See [Result handles](/docs/query-results). |

`filters` and `params` share one binding namespace when the query executes, so their keys must be distinct. Unknown params, non-editable params, missing required values, invalid types, and out-of-range values return `400`.

Example with runtime params:

```json
{
  "filters": {
    "region": "east"
  },
  "params": {
    "retention_weight": 0.8,
    "engagement_weight": 0.2
  },
  "pagination": {
    "limit": 1000
  }
}
```

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

## Parameter settings

Use the parameter settings endpoints when your product needs to persist customer-specific tile settings, such as scoring weights for one tenant.

```http
GET /api/v1/dashboards/{dashboard_id}/tiles/{tile_id}/parameters
PUT /api/v1/dashboards/{dashboard_id}/tiles/{tile_id}/parameters
```

`GET /parameters` returns the same effective parameter contract and values that appear in the manifest for that tile. Send `X-Subject-Org-ID` to receive that subject org's saved values. Without `X-Subject-Org-ID`, the endpoint still returns the contract, but values resolve from tile defaults only. It is safe to call before required values are configured; missing required values are returned as `null` so your UI can render the settings form.

`PUT /parameters` requires `X-Subject-Org-ID`. The subject org is read from the authenticated request context and is never accepted from the JSON body.

### PUT body

```json
{
  "values": {
    "retention_weight": 0.85
  }
}
```

`PUT /parameters` is a partial update. Include only the keys you want to change. Omitted previously saved values are preserved, including both editable and non-editable parameters. To clear an optional editable parameter, send that key with `null`; required parameters cannot be cleared.

Only `viewer_editable: true` parameters may be included. The response returns the full effective parameter contract and resolved values after the update.

## Caching

Tile data is cached so repeat dashboard views do not re-run slow source queries. A second request with the same dashboard, tile, filters, and embed context returns `cache_hit: true` and serves the stored result — typically in milliseconds rather than seconds.

The cache key spans organization, embed/subject-org context, dashboard, tile, the tile's saved query and SQL, the connection, request `filters`, and resolved tile `params`. Any difference is a separate cache entry, so changing a filter or parameter never returns another configuration's data. Editing the saved query behind a tile produces a new key, so stale results are bypassed. Cached entries expire after one hour; `computed_at` and `expires_at` report freshness.

If many subject orgs use different parameter values, each distinct resolved parameter set executes independently once per cache TTL. Repeated requests with the same resolved values reuse the AnswerLayer cache.

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
  -H "X-Subject-Org-ID: acme-widgets" \
  -H "Content-Type: application/json" \
  -d '{"params": {"retention_weight": 0.8, "engagement_weight": 0.2}}'
#   → { "rows": [[72.4]], "next_cursor": null, "cache_hit": false, … }

# 4. Persist a customer-specific parameter setting.
curl -X PUT "https://app.answerlayer.io/api/v1/dashboards/$DASHBOARD_ID/tiles/$TILE_ID/parameters" \
  -H "X-API-Key: $ANSWERLAYER_API_KEY" \
  -H "X-Subject-Org-ID: acme-widgets" \
  -H "Content-Type: application/json" \
  -d '{"values": {"retention_weight": 0.85}}'

# 5. Load a table tile (large — paginated). First page:
curl -X POST "https://app.answerlayer.io$DATA_URL_FOR_MEMBER_ENGAGEMENT_TABLE" \
  -H "X-API-Key: $ANSWERLAYER_API_KEY" \
  -H "X-Subject-Org-ID: acme-widgets" \
  -H "Content-Type: application/json" \
  -d '{"pagination": {"limit": 500}}'
#   → { "rows": [...500...], "result_handle": "a1b2…", "next_cursor": "eyJvZmZ…", … }

# 6. Fetch the next page with the same tile data URL, handle, and cursor.
curl -X POST "https://app.answerlayer.io$DATA_URL_FOR_MEMBER_ENGAGEMENT_TABLE" \
  -H "X-API-Key: $ANSWERLAYER_API_KEY" \
  -H "X-Subject-Org-ID: acme-widgets" \
  -H "Content-Type: application/json" \
  -d '{"result_handle": "a1b2…", "pagination": {"cursor": "eyJvZmZ…", "limit": 500}}'
```
