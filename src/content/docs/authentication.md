---
title: Authentication
description: API keys, scopes, and how to attribute requests to your end-users when embedding AnswerLayer.
order: 2
section: Getting Started
---

The AnswerLayer API uses API key authentication. Keep API keys on your backend and never expose them in browser or mobile client code.

## Creating an API key

API keys are created in the AnswerLayer dashboard under **Settings > API Keys**. Each key belongs to an organization and can be scoped to specific permissions.

When you create a key, the full key is shown **once**. Store it securely -- it cannot be retrieved later.

## Using the key

Include the key in every request:

```bash
curl https://app.answerlayer.io/api/v1/connections/ \
  -H "X-API-Key: $ANSWERLAYER_API_KEY"
```

## Scopes

Each API key has a set of scopes that control what it can do. Requests to scoped endpoints without the required scope return `403 Forbidden`.

| Scope | Grants access to |
|-------|-----------------|
| `inquiry:execute` | Create inquiry sessions and submit questions |
| `inquiry:read` | List inquiry sessions and turns |
| `inquiry_policy:read` | List, inspect, and resolve [response policies](/docs/response-policies) |
| `inquiry_policy:write` | Preview, create, revise, activate, archive, and assign response policies |
| `semantic:read` | List and view semantic layer components |
| `semantic:write` | Create, update, and delete semantic layer components |
| `semantic:generate` | Trigger AI generation of semantic layer components |
| `query:execute` | Execute, validate, and export raw SQL via the [query endpoints](/docs/query) |

### Wildcard scopes

Use `resource:*` to grant all actions for a resource:

- `inquiry:*` grants `inquiry:read` and `inquiry:execute`
- `inquiry_policy:*` grants `inquiry_policy:read` and `inquiry_policy:write`
- `semantic:*` grants `semantic:read`, `semantic:write`, and `semantic:generate`

## Connection scoping

Optionally, a key can be restricted to a single database connection. When set, the key can only access data through that connection. This is useful for database-level tenant isolation.

Set the connection when creating the key in the dashboard.

## Attributing requests to your end-users

When your backend calls AnswerLayer on behalf of an end-user, it can pass opaque identifiers with the request:

| Header | Purpose | Example |
|--------|---------|---------|
| `X-Subject-Org-ID` | Identifies which of your customers/tenants is making the request | `acme-widgets` |
| `X-Subject-User-ID` | Identifies the individual end-user within that organization | `user-42` |

```bash
curl -N -X POST https://app.answerlayer.io/api/v1/inquiry/sessions/{session_id} \
  -H "X-API-Key: $ANSWERLAYER_API_KEY" \
  -H "X-Subject-Org-ID: acme-widgets" \
  -H "X-Subject-User-ID: user-42" \
  -H "Content-Type: application/json" \
  -d '{"user_input": "What was our revenue last quarter?"}'
```

These headers are **trusted metadata**, not a separate authentication method. AnswerLayer accepts the values because the request came from your authenticated backend. Do not send email addresses, names, or other personal information when a stable internal ID will do.

`X-Subject-User-ID` supports end-user attribution in audit and usage data. `X-Subject-Org-ID` can also drive row-level filtering when the selected connection is configured for subject filtering. The headers do not grant API scopes or connection access by themselves; the API key and the connection's server-side configuration remain authoritative.

Use an immutable database primary key or identity-provider subject for `X-Subject-User-ID`. Never use an email address, display name, username, or session token, and never reassign an identifier to another user.

If subject filtering or [embedded inquiry access](/docs/inquiry#embedded-inquiry-access) is enabled for a connection, send the same subject values consistently on every operation for that session. Missing or different subject values do not inherit access to the original session. Subject headers are suitable only for server-to-server integrations where your backend authenticates the user before making the AnswerLayer request.

## Errors

| Status | Meaning |
|--------|---------|
| 401 | Missing or invalid `X-API-Key` |
| 403 | Authenticated but missing the required scope |
| 422 | Request shape is invalid |
