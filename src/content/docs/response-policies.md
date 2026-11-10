---
title: Response Policies
description: Configure versioned answer formatting, precision, evidence, and uncertainty behavior through the UI, CLI, or API.
order: 24
section: Endpoints
---

Response policies control how AnswerLayer presents inquiry answers and handles uncertainty. They can set output structure, numeric precision, evidence requirements, insufficient-data behavior, proxy handling, and optional administrator guidance.

Policies do **not** change data access, semantic definitions, SQL safety, or citation integrity. Platform safety and data-authority rules always take precedence over administrator guidance.

## Policy lifecycle

A policy contains immutable revisions:

1. Create a policy. Its first revision is a draft.
2. Preview the normalized configuration and compiled instructions.
3. Activate the draft revision.
4. Optionally assign the active revision as an organization or connection default.
5. Create another draft revision when requirements change, then activate it explicitly.

New inquiry sessions and evaluation runs freeze the resolved revision. Activating another revision later does not change existing or historical work.

In the web application, open **Settings > Response Policies** to create, edit, activate, archive, or create a new policy from an existing one.

## Configuration

| Field | Values | Default |
|---|---|---|
| `output_format` | `concise`, `narrative`, `table_first` | `concise` |
| `numeric_precision.mode` | `preserve_source`, `minimum_decimal_places`, `significant_figures` | `preserve_source` |
| `numeric_precision.value` | `0`–`10` decimal places, or `1`–`15` significant figures | Omitted |
| `evidence.require_identifiers` | Boolean | `true` |
| `evidence.require_numeric_support` | Boolean | `true` |
| `insufficient_data_behavior` | `explain_and_stop`, `ask_for_clarification`, `conditional_proxy` | `ask_for_clarification` |
| `proxy_behavior` | `forbid_unconfirmed`, `require_confirmation`, `allow_with_prominent_qualification` | `require_confirmation` |
| `administrator_guidance` | Optional text, up to 16,384 characters | Omitted |

`preserve_source` does not accept a numeric value. The other precision modes require a value in the range shown above.

## API authentication

Policy endpoints use the normal `X-API-Key` header. The key needs:

- `inquiry_policy:read` to list, read, and resolve policies;
- `inquiry_policy:write` to preview, create, revise, activate, archive, or assign policies.

## Preview a policy

Preview compiles and validates policy content without saving it.

```http
POST /api/v1/inquiry-policies/preview
```

```bash
curl -X POST https://app.answerlayer.io/api/v1/inquiry-policies/preview \
  -H "X-API-Key: $ANSWERLAYER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "config": {
      "output_format": "table_first",
      "numeric_precision": {
        "mode": "significant_figures",
        "value": 4
      },
      "evidence": {
        "require_identifiers": true,
        "require_numeric_support": true
      },
      "insufficient_data_behavior": "ask_for_clarification",
      "proxy_behavior": "require_confirmation"
    },
    "administrator_guidance": "Lead with the decision-relevant result."
  }'
```

The response includes `normalized_config`, `compiled_instructions`, `compiler_version`, and `content_sha256` for review.

## Create and activate a policy

Create a policy and its first draft revision:

```http
POST /api/v1/inquiry-policies
```

```bash
curl -X POST https://app.answerlayer.io/api/v1/inquiry-policies \
  -H "X-API-Key: $ANSWERLAYER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Board answers",
    "description": "Concise, board-ready answers",
    "config": {
      "output_format": "table_first",
      "numeric_precision": {
        "mode": "significant_figures",
        "value": 4
      },
      "evidence": {
        "require_identifiers": true,
        "require_numeric_support": true
      },
      "insufficient_data_behavior": "ask_for_clarification",
      "proxy_behavior": "require_confirmation"
    },
    "administrator_guidance": "Lead with the decision-relevant result."
  }'
```

Activate the returned revision ID:

```http
POST /api/v1/inquiry-policies/{policy_id}/revisions/{revision_id}/activate
```

Only draft revisions can be activated. Activating one supersedes the previously active revision while preserving its history.

## Revise or copy a policy

Create another immutable draft under the same policy:

```http
POST /api/v1/inquiry-policies/{policy_id}/revisions
```

The request accepts `config`, `administrator_guidance`, and an optional `base_revision_id` for optimistic concurrency and provenance.

To create an independent policy based on an existing one:

1. Read the source with `GET /api/v1/inquiry-policies/{policy_id}`.
2. Select a revision from its `revisions` array.
3. Submit that revision's `config` and `administrator_guidance` to `POST /api/v1/inquiry-policies` with a new name.

The new policy has its own lifecycle and does not change when the source policy changes.

## Set defaults

Set the organization default:

```http
PUT /api/v1/inquiry-policies/defaults/organization
```

Set a connection-specific override:

```http
PUT /api/v1/inquiry-policies/defaults/connections/{connection_id}
```

Both requests use the active policy:

```json
{ "policy_id": "d290f1ee-6c54-4b01-90e6-d701748f0851" }
```

Clear defaults with `DELETE` against the same endpoints. Inspect the policy that would apply to a connection with:

```http
GET /api/v1/inquiry-policies/defaults/effective?connection_id={connection_id}
```

Resolution precedence is:

1. Explicit policy and optional revision on the new session or run.
2. Connection default.
3. Organization default.
4. Built-in platform policy.

## Select a policy for an inquiry or evaluation

Omit both fields to use the default-resolution chain. Provide `policy_id` to use the policy's current active revision. Provide both fields to reproduce an exact active or superseded revision.

```json
{
  "connection_id": "CONNECTION_ID",
  "policy_id": "POLICY_ID",
  "policy_revision_id": "REVISION_ID"
}
```

`policy_revision_id` cannot be supplied without `policy_id`. The same pair is accepted when creating an evaluation run or batch.

## Other policy endpoints

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/v1/inquiry-policies` | List policies; admins can add `include_archived=true` |
| `GET` | `/api/v1/inquiry-policies/{policy_id}` | Read metadata and revision history |
| `PATCH` | `/api/v1/inquiry-policies/{policy_id}` | Rename a policy or update its description |
| `POST` | `/api/v1/inquiry-policies/{policy_id}/archive` | Archive a policy and clear its default assignments |

## CLI workflow

The CLI accepts a policy ID or an unambiguous policy name. Add `--json` for machine-readable output.

Preview, create, and activate:

```bash
answerlayer inquiry-policies preview \
  --output-format table_first \
  --precision-mode significant_figures --precision-value 4 \
  --require-identifiers --require-numeric-support \
  --insufficient-data ask_for_clarification \
  --proxy-behavior require_confirmation \
  --guidance "Lead with the decision-relevant result." --json

answerlayer inquiry-policies create \
  --name "Board answers" \
  --description "Concise, board-ready answers" \
  --output-format table_first \
  --precision-mode significant_figures --precision-value 4 \
  --require-identifiers --require-numeric-support \
  --insufficient-data ask_for_clarification \
  --proxy-behavior require_confirmation \
  --guidance "Lead with the decision-relevant result." --json

answerlayer inquiry-policies activate "Board answers" 1 --json
```

Revise and manage defaults:

```bash
answerlayer inquiry-policies revise "Board answers" \
  --output-format concise \
  --precision-mode preserve_source \
  --guidance "State the result before supporting detail." --json
answerlayer inquiry-policies activate "Board answers" 2 --json

answerlayer inquiry-policies set-default organization "Board answers" --json
answerlayer inquiry-policies set-default connection CONNECTION_ID "Board answers" --json
answerlayer inquiry-policies effective --connection CONNECTION_ID --json
answerlayer inquiry-policies clear-default connection CONNECTION_ID
```

Pin new work to an exact revision:

```bash
answerlayer inquiry create-session --connection CONNECTION_ID \
  --policy "Board answers" --policy-version 2 --json

answerlayer evals runs create --suite SUITE_ID \
  --policy "Board answers" --policy-version 2 --json
```

Use `answerlayer inquiry-policies list`, `get`, and `archive` to inspect and retire policies. See [CLI and local setup](/docs/cli) for installation and authentication.
