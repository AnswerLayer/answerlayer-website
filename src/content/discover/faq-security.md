---
title: "Security questions"
options:
  - label: "Pricing questions"
    target: "faq-pricing"
  - label: "Visit Trust Centre"
    target: "external-trust"
  - label: "Back"
    target: "faq-root"
external: false
externalUrl: null
---
**Where does AnswerLayer run?**
In customer cloud infrastructure (AWS, GCP, or Azure). VPC deployment is standard.

**Does data leave customer infrastructure?**
No. Queries execute against the database. Raw data is never exported.

**How are database credentials handled?**
Encrypted and stored in the customer's cloud secret manager. Never transmitted to AnswerLayer.

**Is AnswerLayer SOC 2 compliant?**
Yes. SOC 2 Type II certified with annual audits.