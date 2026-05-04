---
title: Authentication
description: API key authentication, scopes, and runtime context headers for the AnswerLayer API.
order: 2
section: Getting Started
---

All API requests require authentication using an API key passed in the `X-API-Key` header.

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
| `semantic:read` | List and view semantic layer components |
| `semantic:write` | Create, update, and delete semantic layer components |
| `semantic:generate` | Trigger AI generation of semantic layer components |

### Wildcard scopes

Use `resource:*` to grant all actions for a resource:

- `inquiry:*` grants `inquiry:read` and `inquiry:execute`
- `semantic:*` grants `semantic:read`, `semantic:write`, and `semantic:generate`

## Connection scoping

Optionally, a key can be restricted to a single database connection. When set, the key can only access data through that connection. This is useful for database-level tenant isolation.

Set the connection when creating the key in the dashboard.

## Runtime context headers (legacy mode)

When embedding AnswerLayer into a multi-tenant application **and your organization has not registered an upstream IdP**, pass your end-user's identity on each request using these headers:

| Header | Purpose | Example |
|--------|---------|---------|
| `X-Subject-Org-ID` | Identifies which of your customers/tenants is making the request | `acme-widgets` |
| `X-Subject-User-ID` | Identifies the individual end-user within that organization | `user-42` |

These headers are opaque strings -- AnswerLayer stores them as-is for audit logging and RBAC. They are **not** stored on the API key itself.

```bash
curl -N -X POST https://app.answerlayer.io/api/v1/inquiry/sessions/{session_id}/turns/stream \
  -H "X-API-Key: $ANSWERLAYER_API_KEY" \
  -H "X-Subject-Org-ID: acme-widgets" \
  -H "X-Subject-User-ID: user-42" \
  -H "Content-Type: application/json" \
  -d '{"question": "What was our revenue last quarter?"}'
```

> These headers are **passthrough trust** -- AnswerLayer believes whatever string your backend sends. For production embedded integrations where end-user identity matters, register an IdP and use [verified subject tokens](#verified-subject-tokens) instead.

## Verified subject tokens

Once a T2 admin registers an upstream IdP (Okta, Auth0, Azure AD, etc.) for your organization, AnswerLayer requires a cryptographically verified end-user token on every protected request. The trusted-passthrough headers above are no longer accepted in IdP-configured mode.

The flow:

1. Your end-user authenticates with your IdP. Your backend gets a JWT.
2. Your backend exchanges that JWT for an AnswerLayer-issued bearer token via `POST /api/v1/oauth/token`. See [Token Exchange](/docs/identity-broker/token-exchange).
3. Subsequent API calls use the AnswerLayer token in the `Authorization` header instead of `X-API-Key`:

```bash
curl -X POST https://app.answerlayer.io/api/v1/inquiry/sessions \
  -H "Authorization: Bearer $ANSWERLAYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"connection_id": "..."}'
```

Subject context (which T3 sub-tenant, which T4 user) is encoded in the token's claims -- you don't pass it as separate headers. Scopes come from the RBAC mappings configured per-organization, not from the API key.

Read the [Identity Broker overview](/docs/identity-broker/overview) before integrating.