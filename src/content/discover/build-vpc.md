---
title: "VPC deployment"
options:
  - label: "Choose cloud provider"
    target: "build-cloud-choice"
  - label: "Review compliance"
    target: "build-compliance"
  - label: "See deployment process"
    target: "build-deployment-process"
  - label: "Ask about deployment"
    target: "external-contact"
  - label: "Back"
    target: "build-security"
external: false
externalUrl: null
---
AnswerLayer uses a [BYOC (Bring Your Own Cloud)](https://nuon.co/blog/what-is-bring-your-own-cloud/) deployment model—containerized, managed infrastructure that runs in your environment:

- **AWS** — ECS or EKS
- **GCP** — GKE or Cloud Run

No data transits public internet. The AnswerLayer control plane communicates with customer deployments through secure channels. Database credentials remain within customer infrastructure.