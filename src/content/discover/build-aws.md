---
title: "AWS deployment"
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
AWS deployment uses EKS with the following architecture:

- **VPC** — Dedicated or shared VPC with private subnets
- **EKS** — Managed Kubernetes for compute
- **RDS** — PostgreSQL for semantic store
- **Secrets Manager** — Database credential storage
- **CloudWatch** — Logging and monitoring

Terraform modules provided for infrastructure provisioning. Helm charts for application deployment.