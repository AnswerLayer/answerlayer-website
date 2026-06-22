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

```http
POST /api/v1/semantic/{component}/generate/stream
```

Where `{component}` is one of: `entities`, `relationships`, `dimensions`, `measures`, `metrics`, `filters`.

### Example: generate entities

```bash
curl -N -X POST https://app.answerlayer.io/api/v1/semantic/entities/generate/stream \
  -H "X-API-Key: $ANSWERLAYER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "connection_id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "prompt": "Generate entities for our e-commerce database"
  }'
```

## List components

**Required scope:** `semantic:read`

```http
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

Generation is a long-running, interactive process. The agent analyzes your schema, but periodically needs human input to make decisions -- for example, choosing which tables represent core entities, or clarifying business logic for a metric definition. This human-in-the-loop pattern is called **guidance**.

### Job lifecycle

```text
QUEUED → RUNNING → AWAITING_GUIDANCE → RUNNING → ... → COMPLETED
                                                    └→ FAILED
                                                    └→ CANCELLED
```

1. **Create** a job -- status starts as `queued`
2. **Stream** the job -- connects via SSE, agent starts running
3. Agent hits a decision point -- status moves to `awaiting_guidance`, the stream emits a `guidance_needed` event with questions
4. **Poll questions** or read from the stream to get what the agent is asking
5. **Provide guidance** -- submit answers, agent unblocks and continues automatically
6. Steps 3-5 repeat until the agent completes or fails

### Endpoints

| Operation | Method | Path | Scope |
|-----------|--------|------|-------|
| Create job | POST | `/api/v1/semantic/jobs` | `semantic:generate` |
| Stream job | GET | `/api/v1/semantic/jobs/{id}/stream` | `semantic:generate` |
| Get pending questions | GET | `/api/v1/semantic/jobs/{id}/questions` | `semantic:read` |
| Provide guidance | POST | `/api/v1/semantic/jobs/{id}/guidance` | `semantic:generate` |
| Get job status | GET | `/api/v1/semantic/jobs/{id}/status` | `semantic:read` |
| List jobs | GET | `/api/v1/semantic/jobs` | `semantic:read` |
| Cancel job | POST | `/api/v1/semantic/jobs/{id}/cancel` | `semantic:generate` |

### Create a job

```bash
curl -X POST https://app.answerlayer.io/api/v1/semantic/jobs \
  -H "X-API-Key: $ANSWERLAYER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "connection_id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "component_type": "entities",
    "prompt": "Focus on the e-commerce tables, ignore internal audit tables"
  }'
```

`component_type` is one of: `entities`, `relationships`, `dimensions`, `measures`, `metrics`, `filters`.

The optional `prompt` field provides business context that guides the agent's decisions.

Returns `409 Conflict` if an active job already exists for this connection and component type.

### Stream a job

```bash
curl -N https://app.answerlayer.io/api/v1/semantic/jobs/{job_id}/stream \
  -H "X-API-Key: $ANSWERLAYER_API_KEY"
```

Returns an SSE stream. Event types include:

| Event type | Meaning |
|-----------|---------|
| `progress` | Agent is working -- includes a summary of what it's doing |
| `guidance_needed` | Agent is blocked and needs human input (see below) |
| `complete` | Generation finished successfully |
| `error` | Generation failed |

### Handling guidance

When the stream emits a `guidance_needed` event, the job is paused. The event payload contains the questions:

```json
{
  "type": "guidance_needed",
  "job_id": "abc-123",
  "questions": [
    {
      "question_id": "q1",
      "question": "Should 'audit_log' be treated as a core entity or excluded?",
      "context": "This table has 50M rows and is referenced by 3 other tables.",
      "options": ["Include as entity", "Exclude"],
      "allow_freeform": true
    }
  ]
}
```

You can also poll for pending questions:

```bash
curl https://app.answerlayer.io/api/v1/semantic/jobs/{job_id}/questions \
  -H "X-API-Key: $ANSWERLAYER_API_KEY"
```

Submit answers to resume the agent:

```bash
curl -X POST https://app.answerlayer.io/api/v1/semantic/jobs/{job_id}/guidance \
  -H "X-API-Key: $ANSWERLAYER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "responses": [
      {"question_id": "q1", "answer": "Exclude -- this is an internal audit table"}
    ]
  }'
```

The agent unblocks immediately and continues. No restart or reconnect is needed -- the SSE stream resumes with new progress events.

### Integration patterns

**Interactive UI**: Surface the questions in your admin dashboard. An operator reviews and answers them. This is how the AnswerLayer dashboard works.

**Automated**: Use an LLM or rules engine to answer the guidance questions programmatically. The questions include context and often predefined options, so automated responses are feasible for many cases.
