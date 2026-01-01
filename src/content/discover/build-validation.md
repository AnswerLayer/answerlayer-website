---
title: "Query validation and guardrails"
options:
  - label: "Review full security model"
    target: "build-security"
  - label: "See deployment options"
    target: "build-deployment"
  - label: "Back"
    target: "build-generation"
external: false
externalUrl: null
---
Generated SQL is validated before execution:

- **Schema validation** — Query references only existing tables and columns
- **Operation filtering** — DROP, DELETE, TRUNCATE, ALTER blocked by default
- **Row limits** — Maximum result set size prevents runaway queries
- **Timeout protection** — Long-running queries are terminated
- **Cost estimation** — For cloud warehouses, estimated cost shown before execution

Guardrails are configurable per role. Analysts might have stricter limits than data engineers.