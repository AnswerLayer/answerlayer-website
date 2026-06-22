---
title: "Security architecture"
options:
  - label: "See VPC deployment details"
    target: "build-vpc"
  - label: "Review compliance roadmap"
    target: "build-compliance"
  - label: "Understand credential handling"
    target: "build-credentials"
  - label: "Back"
    target: "path-build"
external: false
externalUrl: null
---
Security is foundational:

- **VPC deployment** — Runs in customer infrastructure
- **Credential encryption** — Database credentials encrypted at rest and in transit
- **No data export** — Analysis happens through queries; raw data never leaves the database
- **Query logging** — Full audit trail of all executed queries
- **Role-based access** — Fine-grained permissions at entity and column level
- **Control plane isolation** — Lightweight control plane handles updates and telemetry; no customer data transits through it
