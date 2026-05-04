---
title: Token Exchange
description: Exchange a JWT from your identity provider for a short-lived AnswerLayer API token (RFC 8693).
order: 51
section: Identity Broker
---

The token-exchange endpoint implements [RFC 8693](https://datatracker.ietf.org/doc/html/rfc8693). Your backend submits a subject token issued by your IdP and receives a short-lived AnswerLayer-signed JWT scoped to the end-user.

## Endpoint

```http
POST /api/v1/oauth/token
```

**Authentication:** `X-API-Key` (your AnswerLayer API key, server-side).

**Content-Type:** `application/x-www-form-urlencoded` per OAuth 2.0 convention.

## Request

| Parameter | Required | Value |
|---|---|---|
| `grant_type` | Yes | `urn:ietf:params:oauth:grant-type:token-exchange` |
| `subject_token` | Yes | A JWT issued by your IdP for the end-user |
| `subject_token_type` | Yes | `urn:ietf:params:oauth:token-type:jwt` |

```bash
curl -X POST https://app.answerlayer.io/api/v1/oauth/token \
  -H "X-API-Key: $ANSWERLAYER_API_KEY" \
  -d "grant_type=urn:ietf:params:oauth:grant-type:token-exchange" \
  -d "subject_token=$IDP_JWT" \
  -d "subject_token_type=urn:ietf:params:oauth:token-type:jwt"
```

## Response

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "issued_token_type": "urn:ietf:params:oauth:token-type:jwt",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

The `access_token` is signed by this AnswerLayer install. Use it as `Authorization: Bearer ...` on any subsequent API call:

```bash
curl -X POST https://app.answerlayer.io/api/v1/inquiry/sessions \
  -H "Authorization: Bearer $ANSWERLAYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"connection_id": "..."}'
```

You do **not** need to send `X-API-Key` on the subsequent calls — the bearer token already proves who's calling. You also do not need to send `X-Subject-Org-ID` / `X-Subject-User-ID`; the subject context is encoded in the token's claims.

## What AnswerLayer verifies on the subject token

Before issuing an access token, AnswerLayer verifies the subject token against the IdP config registered for your organization:

- Signature against the IdP's JWKS (cached for 10 minutes; refetched on key-rotation misses).
- `iss` matches the registered issuer.
- `aud` matches the registered audience (when configured).
- `exp` is in the future.
- Algorithm matches the JWK's declared `alg` (defaults to `RS256`). Tokens whose header tries to downgrade to `HS256` are rejected.

Verification failure returns an OAuth-shaped error:

```json
{
  "error": "invalid_grant",
  "error_description": "subject_token verification failed: Signature verification failed"
}
```

## How claims are resolved

The IdP config you register tells the broker how to read the token:

- `sub_tenant_claim` — the JWT claim that names the T3 sub-tenant (e.g., `tenant_id`, `org`). The value must match the `external_id` of an `idb_sub_tenants` row registered for your organization.
- `principal_type_claim` *or* `service_principal_pattern` — distinguishes T4 user principals from T2 service principals. Without either configured, the broker treats the caller as a user principal and skips the service-principal table.
- The `sub` claim names the principal. T4 users are JIT-created on first sight. T2 service principals must be pre-registered in the AnswerLayer admin UI; an unknown service `sub` is rejected.
- AnswerLayer scopes are derived from the JWT claims via your registered RBAC mappings. A user who matches no mapping receives no scopes and cannot reach scoped endpoints — see [Authentication](/docs/authentication) for the scope vocabulary.

## Token lifetime

AnswerLayer-issued tokens are valid for 1 hour. Re-exchange before expiry; expired tokens fail verification with `401 Unauthorized`.

## Errors

OAuth-shaped responses with `error` and `error_description` fields:

| HTTP | `error` | When |
|---|---|---|
| 400 | `invalid_request` | Wrong `subject_token_type` |
| 400 | `unsupported_grant_type` | Wrong `grant_type` |
| 400 | `invalid_grant` | Subject token failed verification, sub-tenant not registered, service principal not pre-registered, or token claims missing |
| 401 | `invalid_client` | Missing or invalid `X-API-Key` |

Failed exchanges are written to the AnswerLayer audit log with the failure reason.
