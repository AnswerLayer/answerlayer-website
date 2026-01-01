---
title: "VPC deployment"
options:
  - label: "Choose cloud provider"
    target: "build-cloud-choice"
  - label: "Review compliance"
    target: "build-compliance"
  - label: "See deployment process"
    target: "build-deployment-process"
  - label: "Back"
    target: "build-security"
external: false
externalUrl: null
---
AnswerLayer deploys within customer cloud infrastructure:

- **AWS** — EKS deployment with VPC peering or PrivateLink
- **GCP** — GKE deployment with VPC peering or Private Service Connect
- **Azure** — AKS deployment with VNet peering or Private Endpoints

No data transits public internet. The AnswerLayer control plane communicates with customer deployments through secure channels. Database credentials remain within customer infrastructure.