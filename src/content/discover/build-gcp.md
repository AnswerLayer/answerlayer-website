---
title: "GCP deployment"
options:
  - label: "Get in touch"
    target: "external-contact"
  - label: "See pricing"
    target: "external-pricing"
  - label: "Back"
    target: "build-cloud-choice"
external: false
externalUrl: null
---
GCP deployment uses the following architecture:

- **VPC** — Dedicated or shared VPC with private subnets
- **GKE or Cloud Run** — Managed container orchestration for compute
- **Cloud SQL** — PostgreSQL for semantic store
- **Secret Manager** — Database credential storage
- **Cloud Logging** — Centralized logging

Terraform modules provided for infrastructure provisioning. Helm charts for application deployment.