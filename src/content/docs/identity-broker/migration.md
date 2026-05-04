---
title: Migrating to IdP-Configured Mode
description: What changes when you register your first IdP, and how to roll out without breaking existing API-key calls.
order: 53
section: Identity Broker
---

Before any IdP is registered, your AnswerLayer organization is in **API-key-only mode**. After an admin registers the first IdP, your organization enters **IdP-configured mode** and the rules change for protected endpoints.

## What changes at the cutover

Once an IdP is registered for your organization:

- **API-key-only calls to protected endpoints are rejected** with `401 Unauthorized` and a `Verified T1 token required` message. The only exception is `POST /api/v1/oauth/token` itself, since that's how you obtain a token.
- **Trusted-passthrough subject headers** (`X-Subject-Org-ID`, `X-Subject-User-ID`) are deprecated. Subject context now comes from the cryptographically verified bearer token, not from caller-supplied strings.
- **Scopes are enforced for token-bearer requests.** A T4 user whose IdP claims don't match any RBAC mapping has no scopes and cannot reach scoped endpoints (e.g., `query:execute`). Configure your RBAC mappings before flipping the switch.

API-key-only mode remains fully supported indefinitely for organizations that don't register an IdP.

## Suggested rollout

1. **Build the integration in staging** with a non-production IdP and a non-production AnswerLayer organization. Confirm token exchange + downstream API calls work end-to-end.
2. **Pre-register your sub-tenants and RBAC mappings** in the production AnswerLayer admin UI before configuring the IdP. The IdP-configured mode flips on as soon as the IdP record is saved.
3. **Cut over.** Save the IdP. From that moment, every protected API call from your organization needs a bearer token. If your backend has both code paths, switch the deploy that uses bearer tokens at the same time.
4. **Watch the audit viewer** for `token_exchange_failed` and `subject_token_rejected` rows. They carry a structured `failure_reason` so most cutover problems (sub-tenant not registered, claim missing, signature mismatch) are obvious from the UI.

## What stays the same

- The endpoint shapes don't change. A request to `POST /api/v1/inquiry/sessions/{id}/turns/stream` looks identical with a bearer token vs. with an API key — only the auth header differs.
- Scope vocabulary doesn't change (`query:execute`, `inquiry:read`, etc.). RBAC mappings just decide which scopes a given JWT claim grants.
- Audit logging, request-correlation, and rate limits operate the same way in both modes.

## Rolling back

Deactivating every IdP config (the admin UI exposes a soft-deactivate) returns the organization to API-key-only mode. Existing AnswerLayer-issued bearer tokens still verify locally until they expire (1 hour) — they don't need to be revoked individually.
