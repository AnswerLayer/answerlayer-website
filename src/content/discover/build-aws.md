---
title: "AWS deployment"
options:
  - label: "Discuss deployment"
    target: "external-contact"
  - label: "See pricing"
    target: "external-pricing"
  - label: "Back"
    target: "build-cloud-choice"
external: false
externalUrl: null
---
AWS deployment uses the following architecture:

- **VPC** — Dedicated or shared VPC with private subnets
- **ECS or EKS** — Managed container orchestration for compute
- **RDS** — PostgreSQL for semantic store
- **Secrets Manager** — Database credential storage
- **CloudWatch** — Logging and monitoring

Terraform modules provided for infrastructure provisioning. Helm charts for application deployment.