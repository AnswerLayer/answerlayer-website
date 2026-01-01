---
title: "GCP deployment"
options:
  - label: "Review Terraform modules"
    target: "external-terraform"
  - label: "See deployment process"
    target: "build-deployment-process"
  - label: "Back"
    target: "build-cloud-choice"
external: false
externalUrl: null
---
GCP deployment uses GKE with the following architecture:

- **VPC** — Dedicated or shared VPC with private subnets
- **GKE** — Managed Kubernetes for compute
- **Cloud SQL** — PostgreSQL for semantic store
- **Secret Manager** — Database credential storage
- **Cloud Logging** — Centralized logging

Terraform modules provided for infrastructure provisioning. Helm charts for application deployment.