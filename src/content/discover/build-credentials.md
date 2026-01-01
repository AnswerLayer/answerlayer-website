---
title: "Credential handling"
options:
  - label: "Review full security model"
    target: "build-security"
  - label: "See compliance certifications"
    target: "build-compliance"
  - label: "Back"
    target: "build-security"
external: false
externalUrl: null
---
Database credentials are handled with defense in depth:

- **Encryption at rest** — AES-256 encryption in customer secret store
- **Encryption in transit** — TLS 1.3 for all connections
- **No persistence** — Credentials loaded into memory only when needed
- **Rotation support** — Credential rotation without downtime
- **Audit logging** — All credential access logged

Credentials never transit AnswerLayer infrastructure. They remain within customer cloud.