---
title: "Credential handling"
options:
  - label: "Visit Trust Centre"
    target: "external-trust"
  - label: "See compliance certifications"
    target: "build-compliance"
  - label: "Back"
    target: "build-security"
external: false
externalUrl: null
---
Database credentials stay entirely within your infrastructure:

- Stored in your cloud secret manager (AWS Secrets Manager or GCP Secret Manager)
- Read directly by the AnswerLayer service running in your VPC
- Never transmitted to or accessible by AnswerLayer

Your cloud provider's encryption, access controls, and audit logging apply.