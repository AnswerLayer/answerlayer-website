---
title: API Overview
description: Introduction to the AnswerLayer API for embedding conversational analytics into your applications.
order: 1
section: Getting Started
---

The AnswerLayer API provides programmatic access to a semantic layer and natural language query engine. It sits between your application and your data warehouse -- you define the semantic model (entities, relationships, measures, metrics), then submit natural language questions via the API. AnswerLayer generates SQL, executes it against your warehouse, and returns structured results over a streaming connection.

## Base URL

```
https://app.answerlayer.io/api/v1
```

## How it works

### 1. Connect a data warehouse

Register a database connection by providing credentials for your warehouse. Supported adapters: PostgreSQL, BigQuery, Snowflake, MySQL, SQL Server, ClickHouse, Athena, and DuckDB. You can also upload CSV files directly.

AnswerLayer connects to your database at query time -- it does not copy or cache your data. Credentials are encrypted at rest with AES-256.

### 2. Build a semantic layer

The semantic layer is a structured description of your data model that sits between the natural language input and SQL generation. It consists of:

- **Entities** -- tables or views mapped to business objects (e.g., `orders`, `customers`)
- **Relationships** -- foreign key joins between entities
- **Dimensions** -- columns used for grouping and filtering (e.g., `region`, `product_category`)
- **Measures** -- numeric columns to aggregate (e.g., `SUM(order_total)`)
- **Metrics** -- derived KPIs defined as expressions over measures (e.g., `revenue_per_customer`)
- **Filters** -- reusable WHERE clause predicates (e.g., `active_customers`, `last_90_days`)

You can generate the semantic layer automatically from your schema using the `/semantic/*/generate/stream` endpoints, or define components manually via the CRUD API.

### 3. Query via inquiry sessions

Create an inquiry session scoped to a connection, then submit natural language questions as turns. The agent:

1. Reads the semantic layer to understand your data model
2. Generates SQL using the entity relationships, dimensions, and measures
3. Executes the query against your warehouse
4. Returns structured results (columns + rows) over a streaming SSE connection

Sessions are stateful -- follow-up questions have access to the full conversation history, so the agent can reference prior results without re-explanation.

### 4. Embed in your product

Authenticate with a scoped API key and pass your end-user's identity via `X-Subject-Org-ID` and `X-Subject-User-ID` headers. AnswerLayer uses these for audit logging and data isolation, so each of your customers only sees their own data.

## Request format

All requests use JSON. Include `Content-Type: application/json` for request bodies.

```bash
# Create a session
curl -X POST https://app.answerlayer.io/api/v1/inquiry/sessions \
  -H "X-API-Key: al_live_abc12345_yoursecretkey..." \
  -H "Content-Type: application/json" \
  -d '{"connection_id": "your-connection-uuid"}'

# Ask a question (streaming)
curl -N -X POST https://app.answerlayer.io/api/v1/inquiry/sessions/{session_id}/turns/stream \
  -H "X-API-Key: al_live_abc12345_yoursecretkey..." \
  -H "Content-Type: application/json" \
  -d '{"question": "What's the month-over-month change in average order value for our top 5 regions?"}'
```

## Response format

Responses are JSON. Streaming endpoints use Server-Sent Events (SSE).

### Errors

Standard HTTP status codes with a JSON body:

| Status | Meaning |
|--------|---------|
| 400 | Bad request -- invalid parameters |
| 401 | Unauthorized -- missing or invalid API key |
| 403 | Forbidden -- valid key but missing required scope |
| 404 | Not found |
| 422 | Unprocessable -- request understood but can't be fulfilled |
| 500 | Server error |

```json
{
  "detail": "Missing required scope: inquiry:execute"
}
```
