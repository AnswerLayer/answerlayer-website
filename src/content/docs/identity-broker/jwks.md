---
title: JWKS Endpoint
description: Public verification keys for AnswerLayer-issued bearer tokens (RFC 7517).
order: 52
section: Identity Broker
---

AnswerLayer publishes the public keys it uses to sign bearer tokens at the standard JWKS path. Use this if a service downstream of your backend needs to verify AnswerLayer tokens without re-calling AnswerLayer.

## Endpoint

```http
GET /.well-known/jwks.json
```

No authentication. Public by convention (`.well-known`).

## Response

A JWK Set per [RFC 7517](https://datatracker.ietf.org/doc/html/rfc7517):

```json
{
  "keys": [
    {
      "kty": "RSA",
      "use": "sig",
      "alg": "RS256",
      "kid": "kEUk4GnHtTkmY2hM2RVi1Jw",
      "n": "...",
      "e": "AQAB"
    }
  ]
}
```

The set may contain more than one key during a rotation window. Verifiers should look up the key matching the `kid` in the token's header.

## When the set is empty

Until the first IdP is registered for the install, the install has no signing key and `jwks.json` returns `{"keys": []}`. Once an admin registers an IdP, the install bootstraps a signing key and the set populates on the next request.

## Caching

The set rarely changes — AnswerLayer rotates signing keys infrequently and never deletes a key while issued tokens may still be in flight. Reasonable cache for verifiers is 5–10 minutes. On a `kid` you don't recognize, refetch once before failing verification.

## What you do *not* need this for

If your backend is the only consumer of AnswerLayer tokens, you don't need to verify them yourself — AnswerLayer verifies on every request. JWKS exists for cases where a token transits a service mesh, a third party, or an offline auditing pipeline.
