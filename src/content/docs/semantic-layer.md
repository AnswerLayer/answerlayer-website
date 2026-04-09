---
title: Semantic Layer
description: Manage the semantic layer that maps your database schema to business concepts.
order: 20
section: Endpoints
---

The semantic layer translates between your database schema and business concepts. It defines entities, relationships, dimensions, measures, metrics, and filters that enable accurate natural language querying.

## Components

| Component | What it represents | Example |
|-----------|-------------------|---------|
| **Entity** | A core business object (table or view) | `customers`, `orders`, `products` |
| **Relationship** | How entities connect to each other | `orders.customer_id -> customers.id` |
| **Dimension** | A way to group or segment data | `region`, `product_category`, `signup_month` |
| **Measure** | A numeric value to aggregate | `order_total`, `quantity`, `duration` |
| **Metric** | A calculated business KPI built from measures | `monthly_revenue`, `churn_rate` |
| **Filter** | A reusable data scoping rule | `active_customers`, `last_90_days` |

## Generate components

Each component type has a streaming generation endpoint that uses AI to analyze your schema and suggest components.

**Required scope:** `semantic:generate`

```
POST /api/v1/semantic/{component}/generate/stream
```

Where `{component}` is one of: `entities`, `relationships`, `dimensions`, `measures`, `metrics`, `filters`.

### Example: generate entities

```bash
curl -N -X POST https://app.answerlayer.io/api/v1/semantic/entities/generate/stream \
  -H "X-API-Key: al_live_abc12345_yoursecretkey..." \
  -H "Content-Type: application/json" \
  -d '{
    "connection_id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "prompt": "Generate entities for our e-commerce database"
  }'
```

## List components

**Required scope:** `semantic:read`

```
GET /api/v1/semantic/{component}?connection_id={uuid}
```

Returns all components of the given type for a connection.

## CRUD operations

**Required scope:** `semantic:write` (create, update, delete) or `semantic:read` (get)

| Operation | Method | Path |
|-----------|--------|------|
| Create | POST | `/api/v1/semantic/{component}` |
| Get by ID | GET | `/api/v1/semantic/{component}/{id}` |
| Update | PUT | `/api/v1/semantic/{component}/{id}` |
| Delete | DELETE | `/api/v1/semantic/{component}/{id}` |

## Generation jobs

For long-running generation tasks, use the jobs API:

**Required scope:** `semantic:generate` (create, cancel, provide guidance) or `semantic:read` (list, get status)

| Operation | Method | Path | Scope |
|-----------|--------|------|-------|
| Create job | POST | `/api/v1/semantic/jobs` | `semantic:generate` |
| List jobs | GET | `/api/v1/semantic/jobs` | `semantic:read` |
| Get job status | GET | `/api/v1/semantic/jobs/{id}/status` | `semantic:read` |
| Cancel job | POST | `/api/v1/semantic/jobs/{id}/cancel` | `semantic:generate` |
| Stream job output | GET | `/api/v1/semantic/jobs/{id}/stream` | `semantic:generate` |
