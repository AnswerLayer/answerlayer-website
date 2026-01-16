---
title: "Azure deployment"
# ORPHANED
options: []
    target: "external-contact"
  - label: "See deployment process"
    target: "build-deployment-process"
  - label: "Back"
    target: "build-cloud-choice"
external: false
externalUrl: null
---
Azure deployment uses AKS with the following architecture:

- **VNet** — Dedicated or shared virtual network with private subnets
- **AKS** — Managed Kubernetes for compute
- **Azure Database for PostgreSQL** — Semantic store
- **Key Vault** — Database credential storage
- **Azure Monitor** — Logging and monitoring

Terraform modules provided for infrastructure provisioning. Helm charts for application deployment.