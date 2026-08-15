---
title: CLI and local setup
description: Install and use the AnswerLayer CLI, bootstrap a local public-image stack, and give an agent safe setup instructions.
order: 3
section: Getting Started
---

The AnswerLayer CLI is the command-line interface for local AnswerLayer, hosted AnswerLayer, and customer-managed deployments. It can manage connections, queries, semantic objects, inquiries, evaluations, dashboards, and supporting resources.

This page is the canonical setup guide for humans and agents. Local setup uses the published npm package and public container image. It does **not** require the private AnswerLayer source repository.

## Give this page to an agent

Send your agent this URL:

```text
https://www.answerlayer.io/docs/cli
```

Suggested prompt:

```text
Open https://www.answerlayer.io/docs/cli and set up AnswerLayer locally.
Follow the agent instructions on that page, ask before connecting any database,
and never ask me to paste secrets into chat.
```

## Instructions for agents

When a user asks you to set up AnswerLayer from this page:

1. Confirm that Node.js 20 or newer and a running Docker runtime with Docker Compose are available.
2. Explain that setup will download a public npm package and public container images, create Docker resources, and store local runtime data. Obtain confirmation before starting containers.
3. Run the verified public-package workflow below. Do not clone `answerlayer-core`, request GitHub access, or request registry credentials.
4. After approval, run the noninteractive quickstart below. If it reports `provider-required`, explain that the provider-free demo succeeded and ask the user to rerun the same quickstart interactively in their own terminal; the CLI will provide a hidden key prompt.
5. Verify local readiness and report the URL, CLI version, selected image and digest, runtime directory, demo result, and next safe command.
6. Before connecting real data, show the proposed database host, database, and username. Obtain confirmation and require a dedicated account restricted to approved schemas and `SELECT` only.
7. Never request secrets in chat or print them. Never pass a provider key as a command argument. Let the CLI collect it through its hidden terminal prompt.

Verified setup commands:

```bash
npx -y @answerlayer/cli@latest local quickstart --yes --json
npx -y @answerlayer/cli@latest local status --json
```

Quickstart initializes and starts the stack, creates local credentials, installs a deterministic synthetic retail demo and starter semantic objects, and verifies a real query. A `provider-required` result means all provider-free setup succeeded. An interactive `answerlayer local quickstart` then offers a hidden Anthropic-key prompt and continues directly to a real model-backed answer. First boot does not require Git, Clerk, an AnswerLayer account, private registry credentials, AWS credentials, or a model-provider key.

## Prerequisites

- Node.js 20 or newer, or Bun
- Docker Engine 20.10 or newer
- Docker Compose 2.20 or newer
- A Linux container runtime for `amd64` or `arm64`; Docker Desktop provides this on macOS
- Port 8172 available by default
- At least 2 GB of free disk space

The clean-machine path has been verified using the published CLI package on Intel macOS with Docker Desktop. Release gating for additional platforms is tracked separately.

## Install or run on demand

Install globally:

```bash
npm install -g @answerlayer/cli
answerlayer --help
```

Run without a global installation:

```bash
npx -y @answerlayer/cli@latest --help
```

With Bun:

```bash
bun install -g @answerlayer/cli
# or
bunx @answerlayer/cli --help
```

The package has no runtime dependencies beyond Node.js and uses the same command surface whether installed globally or invoked through `npx`.

## Local AnswerLayer

### One-command quickstart

```bash
answerlayer local quickstart
```

Quickstart confirms before changing local state, initializes and starts the public-image runtime, creates local credentials, installs and verifies the synthetic demo, and offers a hidden Anthropic-key prompt. When the key verifies, the same command runs a real model-backed inquiry. Decline the provider step to keep using the provider-free demo; rerun quickstart later to resume.

For noninteractive agent automation after the user has approved the state changes:

```bash
answerlayer local quickstart --yes --json
```

This mode never requests secret input. It returns one credential-free JSON object with the runtime, image digest, demo, provider, inquiry, and next-action state.

### Initialize

```bash
answerlayer local init
```

Initialization:

- checks Docker and Compose availability and versions;
- checks the Docker engine architecture, port, and free disk space;
- pulls the CLI's supported public AnswerLayer image;
- resolves and records the immutable image digest;
- creates permission-restricted Compose, environment, and state files in the platform application-data directory;
- generates local-only database and encryption secrets.

Select another published image or port when needed:

```bash
answerlayer local init --image public.ecr.aws/s8d9x7y7/answerlayer:<version>
answerlayer local init --port 8173
```

Environment overrides:

```bash
export ANSWERLAYER_LOCAL_IMAGE=public.ecr.aws/s8d9x7y7/answerlayer:<version>
export ANSWERLAYER_LOCAL_DIR=/path/to/answerlayer-local
```

### Start

```bash
answerlayer local start
```

Start creates an isolated Compose project for the selected runtime directory, starts Postgres, runs database migrations as a one-shot job, waits for migration-aware readiness, and creates a local-only organization and scoped API key. The key is verified and stored in the CLI configuration without being printed.

When ready, AnswerLayer is available at `http://127.0.0.1:8172` unless another port was selected. Existing runtimes keep the port recorded when they were initialized.

### Inspect status

```bash
answerlayer local status
answerlayer local status --json
```

Status distinguishes `stopped`, `starting`, `migrating`, `ready`, and `failed`. It also reports the local URL, requested image, immutable resolved image, runtime directory, and Compose service state.

Verify the local credential:

```bash
answerlayer auth me --json
```

### View logs

```bash
answerlayer local logs
answerlayer local logs --follow
answerlayer local logs answerlayer
answerlayer local logs migrate
answerlayer local logs postgres
```

Logs default to the most recent 100 lines. Use `--tail <count>` to change the limit.

### Stop and resume

```bash
answerlayer local stop
answerlayer local start
```

Stop removes the local containers and network while preserving the Postgres volume. Starting again runs migrations safely and reuses the existing local identity and credential.

### Upgrade

Update the CLI first, then move the local runtime to that CLI's supported image:

```bash
npm install -g @answerlayer/cli@latest
answerlayer local upgrade
```

Select an explicit published runtime version when required:

```bash
answerlayer local upgrade --image public.ecr.aws/s8d9x7y7/answerlayer:1.19.9
```

The resolved digest is persisted so the active runtime remains reproducible.

### Reset local data

```bash
answerlayer local reset --force
```

Reset permanently deletes the selected runtime's Postgres volume. The required `--force` flag is the explicit confirmation. Runtime directories derive isolated Compose project, volume, and network names, so resetting one runtime does not target another.

### Local files and persistence

Default runtime directories:

| Platform | Runtime directory |
|---|---|
| macOS | `~/Library/Application Support/AnswerLayer/local` |
| Linux | `$XDG_DATA_HOME/answerlayer/local` or `~/.local/share/answerlayer/local` |
| Windows | `%LOCALAPPDATA%\AnswerLayer\local` |

The directory contains:

- `compose.yaml` -- generated runtime topology;
- `runtime.env` -- permission-restricted image, port, and local secrets;
- `state.json` -- selected image, resolved digest, resource names, and lifecycle state.

CLI credentials are stored separately in `~/.answerlayer/config.json` by default. Application metadata, connections, semantic definitions, and history live in the isolated Docker Postgres volume.

### Provider configuration

A model-provider key is not required to initialize the stack, run migrations, reach ready state, or use non-model-backed API operations. Features that call a model provider require the corresponding provider configuration before use.

Enter provider credentials privately. Do not paste them into an agent conversation, pass them as command arguments, or commit them. Interactive `answerlayer local quickstart` offers to collect the Anthropic key through a hidden prompt, verifies it inside the runtime, and continues to a model-backed answer. The key is stored only in the permission-restricted runtime environment and is omitted from CLI output and state.

The standalone provider commands remain available for later management:

```bash
answerlayer local provider status --json
answerlayer local provider rotate anthropic
answerlayer local provider remove anthropic --force
```

## Install the AnswerLayer agent skill

The npm package includes a Codex skill that teaches an agent the AnswerLayer workflow and safety rules:

```bash
answerlayer skills install
```

It installs to `~/.codex/skills/answerlayer` by default. Use `--path <directory>` for another location. Existing files are not replaced unless `--force` is provided.

When using `npx`:

```bash
npx -y @answerlayer/cli@latest skills install
```

For Claude Code, install the CLI repository as a plugin:

```text
/plugin marketplace add AnswerLayer/answerlayer-cli
/plugin install answerlayer@answerlayer
```

## Hosted, BYOC, and self-hosted configuration

Local setup creates and configures its own local key. For an existing hosted or customer-managed AnswerLayer deployment, create an API key with the required scopes and initialize the CLI:

```bash
# Hosted AnswerLayer uses https://app.answerlayer.io by default
answerlayer init --api-key al_live_...

# BYOC or self-hosted
answerlayer init \
  --base-url https://answerlayer.your-company.com \
  --api-key al_live_...
```

`init` verifies the key before replacing saved configuration. You can also configure explicitly:

```bash
answerlayer configure \
  --base-url https://answerlayer.your-company.com \
  --api-key al_live_...
```

Or use environment variables instead of a config file:

```bash
export ANSWERLAYER_BASE_URL=https://answerlayer.your-company.com
export ANSWERLAYER_API_KEY=al_live_...
```

The CLI sends the key only to the selected AnswerLayer host using the `X-API-Key` header.

## Connect data safely

List existing connections:

```bash
answerlayer connections list
answerlayer connections list --json
```

Before creating a connection, use a dedicated database account restricted to approved schemas and `SELECT` only. Put connection configuration and its password in a permission-restricted local JSON file rather than shell history or chat:

```bash
answerlayer connections create --data-file ./postgres-connection.json
answerlayer connections test --data-file ./postgres-connection.json
answerlayer metadata structure <connection-id>
```

See [Connections](/docs/connections) for supported adapters and configuration.

## Common workflows

### Run and validate SQL

```bash
answerlayer query run <connection-id> --sql "select * from orders limit 10"
answerlayer query validate <connection-id> --sql "select * from orders"
answerlayer query run <connection-id> --file ./query.sql --format csv
```

### Ask natural-language questions

```bash
answerlayer inquiry models
answerlayer inquiry ask --connection <connection-id> --json \
  "What changed in revenue this month?"
answerlayer inquiry ask --session <session-id> --json \
  "Break that down by region"
```

Natural-language inquiry is model-backed and requires the selected deployment's provider configuration.

### Manage saved queries

```bash
answerlayer saved-queries list
answerlayer saved-queries create \
  --name "Revenue by month" \
  --connection <connection-id> \
  --file ./revenue.sql
answerlayer saved-queries execute <saved-query-id> --format table
```

### Manage the semantic layer

```bash
answerlayer semantic entities create \
  --connection <connection-id> \
  --name Orders \
  --source-table public.orders \
  --identifier id
answerlayer semantic metrics list --connection <connection-id>
answerlayer semantic metrics generate \
  --connection <connection-id> \
  --prompt "SaaS revenue metrics"
```

### Run evaluations

```bash
answerlayer evals suites create --name "Revenue checks" --connection <connection-id>
answerlayer evals cases create <suite-id> \
  --title "Monthly revenue" \
  --question "What was revenue last month?" \
  --category Revenue
answerlayer evals runs create <suite-id> --label "Before prompt change"
answerlayer evals runs create <suite-id> --concurrency 4
answerlayer evals runs compare <run-id> --baseline <baseline-run-id>
answerlayer evals runs analyze <run-id> --json
```

### Build dashboards

```bash
answerlayer dashboards create --title "Executive overview" --visibility org
answerlayer tiles create \
  --title "Revenue" \
  --source-type saved_query \
  --source <saved-query-id>
answerlayer dashboards attach-tile <dashboard-id> \
  --tile <tile-id> --x 0 --y 0 --w 6 --h 4
```

### Upload business context

```bash
answerlayer documents upload ./definitions.md --title "Business definitions"
answerlayer documents link <document-id> --connection <connection-id>
```

## Command reference

```text
skills install [--path <directory>] [--force]
local init [--image <image>] [--port <port>]
local start|status|logs|stop
local upgrade [--image <image>]
local reset --force
init --api-key <key> [--base-url <url>]
configure --base-url <url> --api-key <key>
health
openapi --output openapi.json

api-keys list|create|revoke
connections supported|list|get|create|update|delete|schema|test
metadata structure|tables|columns|pii-summary|pii-settings|detect-pii
query run|validate|export <connection-id> --sql <sql>
query-results get|delete <handle>

saved-queries list|get|create|update|delete|approve|unapprove|execute
semantic <entities|relationships|measures|metrics|dimensions|filters>
  list|get|create|update|delete|delete-all|generate
inquiry models|ask|sessions|create-session|session|update-session|delete-session|turn
evals suites list|create|get|update|delete
evals cases create|update|delete
evals runs list|create|create-batch|get|update|cancel|compare|analyze
generation start|list|get|status|stream|cancel|questions|guidance|delete
tiles list|get|create|update|data|delete
dashboards list|get|create|update|delete|duplicate|manifest|attach-tile|move-tile|detach-tile|assignments|assign|unassign|tile-data

documents upload|list|get|update|delete|link|unlink|connections|for-connection
branding get|update|upload|extract|asset
uploads csv|duckdb upload|status|reprocess
chains list|answers
users me|update-me|list|get|update
org me|usage|update|invite|deployment|deploy|delete-deployment
roles list|create|get|assign|unassign|sync-clerk
billing status|plans|products|prices|checkout|portal|history|usage-trends
stats answers|connections
```

Common options:

| Option | Purpose |
|---|---|
| `--base-url <url>` | Override `ANSWERLAYER_BASE_URL` or saved host |
| `--api-key <key>` | Override `ANSWERLAYER_API_KEY` or saved key |
| `--json` | Print structured JSON when available |
| `--data <json>` | Provide a structured request payload |
| `--data-file <path>` | Read a structured payload from a file |
| `--output`, `-o <path>` | Write response bytes to a file |
| `--sql`, `-q <sql>` | Provide SQL text |
| `--file`, `-f <path>` | Read SQL or upload content from a file |
| `--params <json>` | Provide query parameters |
| `--row-limit <n>` | Set row limit; default 1000 |
| `--timeout <seconds>` | Set query timeout; default 30 seconds |
| `--format table\|json\|csv` | Select query-result output format |

For complex writes, prefer a JSON file:

```bash
answerlayer connections create --data-file ./connection.json
answerlayer dashboards update <dashboard-id> --data-file ./dashboard.json
answerlayer branding update --data-file ./branding.json
```

## Useful API-key scopes

| Scope | Use |
|---|---|
| `api_key:manage` | Manage API keys |
| `connection:read` | List and inspect connections |
| `query:execute` | Execute raw SQL |
| `saved_query:read`, `saved_query:execute`, `saved_query:write` | Saved-query workflows |
| `semantic:read`, `semantic:write`, `semantic:generate` | Semantic-layer workflows |
| `dashboard:read`, `dashboard:write`, `tile:read`, `tile:write` | Dashboard workflows |
| `inquiry:read` | Inspect inquiry sessions and evaluation runs |
| `inquiry:execute` | Run natural-language inquiry and evaluations |

## Troubleshooting

### Docker is missing or stopped

Start Docker Desktop or Docker Engine, then verify:

```bash
docker version
docker compose version
```

### Port 8172 is occupied

Choose another port:

```bash
answerlayer local init --port 8173
answerlayer local quickstart
```

### Image pull fails

Confirm network access and the requested public image, then retry `local init`. No registry login should be required for the supported default image.

### Migration or readiness fails

```bash
answerlayer local status --json
answerlayer local logs migrate
answerlayer local logs answerlayer
```

Migration failure prevents the application from reporting ready.

### Authentication fails after reset

Run `answerlayer local start`. If the stored local key no longer exists in the reset database, the CLI creates and verifies a replacement.

### Missing scope

A `403` response means the key is valid but lacks a required scope. Add only the scope needed for the requested command.

## Current local-first boundaries

- A new local instance includes the application, metadata database, deterministic synthetic retail demo, starter semantic objects, and a verified saved query.
- Connect a dedicated read-only database before applying the workflow to real customer data; the bundled demo is immediately usable without one.
- Model-backed semantic generation and inquiry require provider configuration; interactive quickstart supplies the secure prompt and verifies the key.
- S3-compatible object storage and the ML worker are optional integrations, not first-boot dependencies. Features such as document and branding uploads may require separately configured object storage.
- Use `/deploy` for customer-cloud deployment choices; the local CLI workflow is for evaluation and local operation.

## Source and license

The CLI source, releases, and package documentation are available at [github.com/AnswerLayer/answerlayer-cli](https://github.com/AnswerLayer/answerlayer-cli). The CLI is licensed under Apache 2.0.
