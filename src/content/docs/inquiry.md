---
title: Inquiry
description: Manage conversational inquiry sessions with multi-turn question chains.
order: 25
section: Endpoints
---

Inquiries are multi-turn conversational sessions. Each session maintains context across multiple questions, so follow-up questions can reference previous results.

## Create a session

**Required scope:** `inquiry:execute`

```http
POST /api/v1/inquiry/sessions
```

### Request body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `connection_id` | string (UUID) | Yes | Database connection to query |
| `model` | string | No | Override the default Claude model for this session |
| `use_semantic_layer` | boolean | No | Whether semantic-layer context and tools may be used. Default `true` |
| `policy_id` | string (UUID) | No | Explicit [response policy](/docs/response-policies); defaults are resolved when omitted |
| `policy_revision_id` | string (UUID) | No | Exact active or superseded revision. Requires `policy_id` |
| `access` | object | Connection-dependent | Versioned product, region, and report grants. Required only when the connection is configured for embedded inquiry access |

### Response

```json
{ "session_id": "d290f1ee-6c54-4b01-90e6-d701748f0851" }
```

The resolved response-policy revision is frozen into the session. Later policy activations do not change an existing session. Session reads include `policy_id`, `policy_revision_id`, `policy_version`, and `policy_hash`. See [Response Policies](/docs/response-policies) for default resolution and exact revision pinning.

### Embedded inquiry access

For a connection configured to require embedded inquiry access, send the complete end-user access snapshot when creating the session. Product, region, and report identifiers must come from the catalog configured for that connection.

```json
{
  "connection_id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
  "access": {
    "version": 1,
    "expires_at": "2026-12-10T22:00:00Z",
    "grants": [
      {
        "product": "analytics",
        "region_ids": ["region-123"],
        "report_ids": ["report-abc"]
      }
    ]
  }
}
```

| Field | Rules |
|-------|-------|
| `version` | Must be `1` |
| `expires_at` | Timezone-aware RFC 3339 timestamp after creation and no more than 30 days away |
| `grants` | Non-empty list; each product may appear once |
| `grants[].product` | Product identifier registered for the connection; wildcards are not allowed |
| `grants[].region_ids` | Non-empty list of registered region identifiers, or `["*"]` as the sole item |
| `grants[].report_ids` | Non-empty list of registered report identifiers, or `["*"]` as the sole item |

There is no implicit all-access behavior. A product omitted from `grants` is not included. AnswerLayer resolves wildcards to explicit catalog identifiers, normalizes the snapshot, and freezes both the snapshot and the server-owned catalog hash on the session. Session reads expose `access_version`, `access_expires_at`, `access_hash`, and `access_snapshot`.

The expiry is a fixed authorization refresh deadline, not an inactivity timeout; using the session does not extend it. Once it expires, new turns return `403`, while existing session history remains readable. If the user's permissions change or are revoked earlier, or if an administrator changes the connection's access catalog, stop using the old session and create a new one with the current snapshot.

Configured connections require a stable `X-Subject-Org-ID` for your customer organization and a stable `X-Subject-User-ID` for the individual within it. The API key identifies your AnswerLayer organization. Use the same subject headers for every operation on the session. See [Authentication](/docs/authentication#attributing-requests-to-your-end-users).

Access validation errors use these statuses:

| Status | Meaning |
|--------|---------|
| `400` | Required subject identity is missing or violates the session identity boundary |
| `403` | Required access is missing or the stored snapshot has expired |
| `404` | The session does not exist or belongs to a different subject |
| `422` | The access object is malformed, exceeds 30 days, or contains an unsupported version or unknown identifier |

## Add a turn (streaming)

**Required scope:** `inquiry:execute`

```http
POST /api/v1/inquiry/sessions/{session_id}
```

Submits a question within an existing session and streams the agent's progress and answer back as [Server-Sent Events](#streaming-response-format). The agent has access to all prior turns for context.

### Request body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user_input` | string | Yes | The natural language question (1–10,000 chars) |

### Example

```bash
# Create a session
curl -X POST https://app.answerlayer.io/api/v1/inquiry/sessions \
  -H "X-API-Key: $ANSWERLAYER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"connection_id": "d290f1ee-6c54-4b01-90e6-d701748f0851"}'

# Ask a question (streaming)
curl -N -X POST https://app.answerlayer.io/api/v1/inquiry/sessions/{session_id} \
  -H "X-API-Key: $ANSWERLAYER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"user_input": "What are our top 10 customers by revenue?"}'

# Follow up (agent remembers the previous context)
curl -N -X POST https://app.answerlayer.io/api/v1/inquiry/sessions/{session_id} \
  -H "X-API-Key: $ANSWERLAYER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"user_input": "Now show me their month-over-month growth"}'
```

### Streaming response format

The response is a `text/event-stream`. Each event is a single `data:` line containing a JSON object; the object's `type` field tells you which kind of event it is. Events arrive in roughly this order, ending with a single `complete` (or `error`) event.

```
data: {"type":"turn_created","turn_id":"a1b2c3d4-…"}

data: {"type":"start","model":"claude-sonnet-4-6","timestamp":1733155200.5}

data: {"type":"thinking","content":"I'll join orders to customers…","section":"§1.1"}

data: {"type":"tool_start","tool_id":"tool_9f3a","tool_name":"run_sql","tool_input":{"sql":"SELECT …"},"section":"§1.1(a)","timestamp":1733155201.0}

data: {"type":"sql_executed","sql":"SELECT customer_name, SUM(amount) …"}

data: {"type":"tool_end","tool_id":"tool_9f3a","tool_name":"run_sql","tool_success":true,"tool_result":"| # | customer_name | …","tool_duration_ms":142,"section":"§1.1(a)","timestamp":1733155201.2}

data: {"type":"text_delta","content":"Your top customers are "}

data: {"type":"complete","turn_id":"a1b2c3d4-…","final_response":"Your top customers are …","references":[{"display":"1","section":"§1.1(a)","row":1,"value":"Acme"}],"sql_queries":["SELECT …"],"tool_call_count":1,"thinking_block_count":1,"input_tokens":1204,"output_tokens":312,"credit_cost":2}
```

#### Event types

| `type` | Key fields | Meaning |
|--------|-----------|---------|
| `turn_created` | `turn_id` | The turn record was created |
| `start` | `model`, `timestamp` | Agent work began |
| `stage` | `content` | Coarse human-readable progress note |
| `thinking` | `content`, `section` | The agent's reasoning |
| `tool_start` | `tool_id`, `tool_name`, `tool_input`, `section` | A tool call began |
| `tool_end` | `tool_success`, `tool_result`, `tool_duration_ms`, `section` | A tool call finished |
| `sql_executed` | `sql` | A SQL statement was run |
| `result_summary` | `summary` | Short summary of a query result |
| `text_delta` | `content` | An incremental chunk of the final answer |
| `complete` | `final_response`, `references`, `sql_queries`, `input_tokens`, `output_tokens`, `credit_cost` | Final answer and usage |
| `error` | `message` | The turn failed |

Each entry in `references` links a marker in the answer (for example `[1]`) back to a specific row the agent queried — `display` is the marker, `section` is the provenance path, `row` is the 1-indexed row, and `value` is the cited cell.

## Add a turn (non-streaming)

**Required scope:** `inquiry:execute`

```http
POST /api/v1/inquiry/sessions/{session_id}/sync
```

Same as the streaming endpoint but blocks until the agent is done and returns a single JSON response. Useful for simpler integrations that don't need progress updates.

### Request body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user_input` | string | Yes | The natural language question |

### Response

```json
{
  "turn_id": "a1b2c3d4-…",
  "final_response": "Your top customers are …",
  "sql_queries": ["SELECT customer_name, SUM(amount) …"]
}
```

## List sessions

**Required scope:** `inquiry:read`

```http
GET /api/v1/inquiry/sessions
```

## Get session details

**Required scope:** `inquiry:read`

```http
GET /api/v1/inquiry/sessions/{session_id}
```

Returns the session with all its turns and results.

## Client libraries

- **Go** — [`answerlayer/answerlayer-go`](https://github.com/AnswerLayer/answerlayer-go) wraps these endpoints, including a typed iterator over the streaming events and an interactive REPL example.
