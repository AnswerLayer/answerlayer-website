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
| `title` | string | No | Optional human-readable session title |

## Add a turn

**Required scope:** `inquiry:execute`

```http
POST /api/v1/inquiry/sessions/{session_id}/turns/stream
```

Submits a follow-up question within an existing session. The agent has access to all prior turns for context.

### Request body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `question` | string | Yes | The natural language question |

### Example

```bash
# Create a session
curl -X POST https://app.answerlayer.io/api/v1/inquiry/sessions \
  -H "X-API-Key: $ANSWERLAYER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"connection_id": "d290f1ee-6c54-4b01-90e6-d701748f0851"}'

# Ask a question (streaming)
curl -N -X POST https://app.answerlayer.io/api/v1/inquiry/sessions/{session_id}/turns/stream \
  -H "X-API-Key: $ANSWERLAYER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"question": "What are our top 10 customers by revenue?"}'

# Follow up (agent remembers the previous context)
curl -N -X POST https://app.answerlayer.io/api/v1/inquiry/sessions/{session_id}/turns/stream \
  -H "X-API-Key: $ANSWERLAYER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"question": "Now show me their month-over-month growth"}'
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
