---
title: "Cloud provider options"
options:
  - label: "See AWS deployment"
    target: "build-aws"
  - label: "See GCP deployment"
    target: "build-gcp"
  - label: "See Azure deployment"
    target: "build-azure"
  - label: "Back"
    target: "build-vpc"
external: false
externalUrl: null
---
Deployment is supported on:

| Provider | Compute | Database Support |
|----------|---------|------------------|
| AWS | EKS | RDS, Redshift, Athena |
| GCP | GKE | Cloud SQL, BigQuery |
| Azure | AKS | Azure SQL, Synapse |

Multi-cloud configurations are possible for organizations with databases across providers. Each deployment connects to databases in its region.