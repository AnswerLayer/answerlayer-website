---
title: Identity Broker Overview
description: B2B2B2C identity model for embedding AnswerLayer into your platform with verified end-user identity.
order: 50
section: Identity Broker
---

The identity broker lets your platform vouch for individual end-users when calling the AnswerLayer API. Your application authenticates your users with your existing identity provider; AnswerLayer accepts a token exchange that proves who the end-user is, and issues a short-lived API token bound to that user.

## When to use it

Use the identity broker when you embed AnswerLayer in a multi-tenant application and you want each of your end-users to call AnswerLayer **as themselves**, not on behalf of your service account.

You don't need the identity broker if:

- Your backend is the only caller and there is no end-user attribution to propagate.
- You're still onboarding and just want to point an API key at AnswerLayer to evaluate it.

In that mode, keep using API-key authentication as documented in [Authentication](/docs/authentication). The identity broker is purely additive.

## Tier model

The broker assumes a four-tier topology:

| Tier | Example | Authenticates how |
|---|---|---|
| **T1** | The AnswerLayer install (this API) | — |
| **T2** | Your organization (the AnswerLayer customer) | Clerk in the AnswerLayer dashboard; API key from server-to-server calls |
| **T3** | Your customer's tenant inside your platform | Sub-tenant record you register with AnswerLayer |
| **T4** | An end-user inside that tenant | Your IdP (Okta, Auth0, Azure AD, …) |

T1 trusts T2. T2 vouches for T3 and T4 via signed JWTs from your IdP. T1 never sees your end-user's primary credential.

## How it works

1. **Configure once.** A T2 admin registers your IdP's `issuer` and `jwks_uri`, registers each T3 sub-tenant, and adds RBAC mappings from IdP claim values to AnswerLayer scopes. (Done in the AnswerLayer admin UI.)
2. **At call time.** Your end-user authenticates with your IdP and your backend gets back a JWT. Your backend posts that JWT to AnswerLayer's [token-exchange endpoint](/docs/identity-broker/token-exchange) along with your API key. AnswerLayer verifies the JWT against your IdP's JWKS, resolves the T3 sub-tenant and T4 user from the claims, maps claims to scopes, and returns a short-lived AnswerLayer-signed JWT.
3. **Use the token.** Your backend includes the returned token as `Authorization: Bearer ...` on subsequent AnswerLayer API calls. AnswerLayer verifies it locally on each request — no per-call round-trip to your IdP.

## Two integration modes

| Mode | When | What's required |
|---|---|---|
| **API key only** | Onboarding, scripts, MCP integrations, any path with no end-user to vouch for | An `X-API-Key` from the AnswerLayer dashboard |
| **API key + verified subject token** | Production embedded integrations where your end-user identity matters | API key + a successful token exchange before each session, then the resulting bearer token |

You start in API-key-only mode. The day a T2 admin registers an IdP, AnswerLayer starts requiring a verified token for protected endpoints from that organization. See [Migration](/docs/identity-broker/migration) for the cutover behavior.

## Audit

Every token exchange — success and failure — is recorded in the AnswerLayer audit log.

- **On success** the row carries the resolved sub-tenant, principal, mapped scopes, and IdP issuer.
- **On failure** the row carries a `failure_reason` (signature mismatch, sub-tenant not registered, missing claim, etc.) and the `idp_issuer` when it could be determined from the unverified token. Earlier failures (malformed token, missing `iss`) won't have the issuer set.

Subsequent API calls inherit the same correlation ID via the `X-Request-ID` header so a single end-user request can be traced across multiple AnswerLayer calls.
