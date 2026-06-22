---
title: Authentication
description: API keys, scopes, and how to attribute requests to your end-users when embedding AnswerLayer.
order: 2
section: Getting Started
---

The AnswerLayer API uses API key authentication. If you embed AnswerLayer into a product where your own users issue queries, there is also an optional identity-broker mode that lets you propagate verified end-user identity to AnswerLayer.

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
| `query:execute` | Execute, validate, and export raw SQL via the [query endpoints](/docs/query) |

### Wildcard scopes

Use `resource:*` to grant all actions for a resource:

- `inquiry:*` grants `inquiry:read` and `inquiry:execute`
- `semantic:*` grants `semantic:read`, `semantic:write`, and `semantic:generate`

## Connection scoping

Optionally, a key can be restricted to a single database connection. When set, the key can only access data through that connection. This is useful for database-level tenant isolation.

Set the connection when creating the key in the dashboard.

## Attributing requests to your end-users

When you embed AnswerLayer into a multi-tenant product, every API call from your backend ultimately represents one of your customers' end-users. AnswerLayer needs to know which one — for audit logging, RBAC, and per-user data isolation.

There are two modes for this. Pick based on where you are in your integration.

### Identity headers (simple, for getting started)

The fastest way to ship is to pass your end-user's identity as opaque strings on each request:

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

These headers are **passthrough trust** — AnswerLayer believes whatever string your backend sends and stores them on the audit trail. They are not stored on the API key itself.

This mode is great for prototyping, internal tooling, scripts, MCP integrations, and any deployment where your own backend is the only caller and there is no compliance constraint requiring cryptographic attribution.

### Identity provider integration (production, end-user-attested)

For production embedded integrations where compliance, audit defensibility, or insider-risk reduction matter, register your identity provider (Okta, Auth0, Azure AD, etc.) with AnswerLayer. Once you do, AnswerLayer:

- Stops accepting the trusted passthrough headers from your organization.
- Requires a short-lived AnswerLayer bearer token on every protected call.
- Issues that token only after your backend exchanges a JWT signed by your IdP, proving the end-user actually authenticated.

The calling pattern shifts from `X-API-Key` + headers to `Authorization: Bearer <token>`:

```bash
# Once per session: exchange your IdP's JWT for an AnswerLayer token
curl -X POST https://app.answerlayer.io/api/v1/oauth/token \
  -H "X-API-Key: $ANSWERLAYER_API_KEY" \
  -d "grant_type=urn:ietf:params:oauth:grant-type:token-exchange" \
  -d "subject_token=$IDP_JWT" \
  -d "subject_token_type=urn:ietf:params:oauth:token-type:jwt"

# Subsequent calls use the returned token
curl -X POST https://app.answerlayer.io/api/v1/inquiry/sessions \
  -H "Authorization: Bearer $ANSWERLAYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"connection_id": "..."}'
```

End-user identity is now encoded in the token's claims, cryptographically attested by your IdP — not asserted by a header your backend filled in.

For the full integration guide — when to flip the switch, how registration works, claim mapping, JWKS for external verification — see the [Identity Broker section](/docs/identity-broker/overview).

## Errors

| Status | Meaning |
|--------|---------|
| 401 | Missing or invalid `X-API-Key`, or invalid bearer token |
| 403 | Authenticated but missing the required scope |
| 422 | Request shape invalid (e.g., bad form parameters on token exchange) |
