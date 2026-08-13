---
title: "Data retention and deletion"
options:
  - label: "Review VPC deployment"
    target: "build-vpc"
  - label: "Review sub-processors"
    target: "external-subprocessors"
  - label: "Back to Trust Centre"
    target: "external-trust"
external: false
externalUrl: null
---
AnswerLayer stores data in two distinct places: the Customer Environment (where the BYOC deployment runs) and the AnswerLayer Control Plane (for orchestration only).

**In the Customer Environment** (Customer's own AWS account):

- **Query result cache (RDS)** — 1 hour default TTL, configurable per write. Expired entries are deleted on the next read.
- **Result spill-over (S3)** — Result sets above the inline threshold are written to an opaque object store in the Customer's account, garbage-collected on the same lifecycle as the cache.
- **Application logs (CloudWatch)** — 30 day default retention, exposed as a per-install variable so it can be tightened to meet Customer policy.
- **Metadata (RDS)** — Connection definitions, semantic layer, dashboard configuration. Persisted until removed by a Customer administrator.

**In the Control Plane** (AnswerLayer-hosted infrastructure):

- **Operational telemetry** — Aggregate counts, latencies, error rates, deployment health signals. No Customer business data attached.
- **Account and install metadata** — Organization records, install identifiers, contact information for administrators.

**Deletion on request:** Customer data residing in the Customer Environment is deleted on the Customer's own schedule and infrastructure lifecycle. To request removal of records held in the AnswerLayer Control Plane, contact us; we will action verified requests in accordance with the AnswerLayer DPA and applicable data protection laws.
