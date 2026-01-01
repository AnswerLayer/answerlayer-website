---
title: "Deployment process"
options:
  - label: "Review pricing"
    target: "build-evaluate"
  - label: "Schedule deployment"
    target: "external-demo"
  - label: "Back"
    target: "build-vpc"
external: false
externalUrl: null
---
Typical deployment timeline:

1. **Day 1** — Infrastructure provisioning (Terraform)
2. **Day 1** — Application deployment (Helm)
3. **Day 1-2** — Database connection configuration
4. **Day 2** — Initial semantic layer generation
5. **Day 2-5** — Curation and refinement
6. **Day 5+** — Production use

Most deployments are operational within a week. Complex schemas or extensive curation requirements may extend the timeline.