---
title: "Compliance roadmap"
options:
  - label: "Visit Trust Centre"
    target: "external-trust"
  - label: "Review security architecture"
    target: "build-security"
  - label: "Back"
    target: "build-vpc"
external: false
externalUrl: null
---
Our approach to compliance reflects our BYOC deployment model:

**Current security foundations:**
- Secure development lifecycle with code review and static analysis
- Penetration testing and vulnerability management
- Encrypted credential handling (AES-256 at rest, TLS 1.3 in transit)
- Control plane secured separately from customer data

**On our roadmap:**
- SOC 2 Type II certification for control plane infrastructure
- HIPAA BAA availability for healthcare deployments
- Additional compliance frameworks as customer needs evolve

The VPC deployment model simplifies compliance—customer data remains in customer infrastructure under customer controls.
