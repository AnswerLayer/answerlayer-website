---
title: "Data protection in practice"
options:
  - label: "Review VPC deployment"
    target: "build-vpc"
  - label: "Review security architecture"
    target: "build-security"
  - label: "Review data retention"
    target: "build-retention"
  - label: "Back to Trust Centre"
    target: "external-trust"
external: false
externalUrl: null
---
The AnswerLayer architecture keeps Customer data inside the Customer Environment end-to-end. Three areas in particular are worth describing concretely:

**Application logs.** AnswerLayer's application logs (shipped to CloudWatch in the Customer's AWS account) record exceptions, identifiers, and column-level metadata only — no row content. The application is structured so that error paths log what happened, not what was being processed at the time. CloudWatch log groups live in the Customer's account, with retention configurable per install; the Control Plane receives only aggregate operational telemetry (counts, latencies, error rates), never log content.

**LLM inference.** In a BYOC deployment, AnswerLayer is configured to call Claude via AWS Bedrock running in the Customer's AWS account, in the Customer's region, reached over a PrivateLink interface VPC endpoint provisioned in the Customer's VPC. The ECS task assumes a scoped IAM role and the model invocation resolves to a private IP — request and response stay inside the Customer's AWS network and never traverse the public internet. AWS Bedrock's service terms further commit to no training on inference data and no retention of prompts or completions.

**Cache and tenancy isolation.** The query result cache is keyed by a SHA-256 hash that includes the tenancy primitive (organization and subject organization), making cross-tenant collisions computationally impossible. As defense-in-depth, the cache lookup also re-checks the row's organization against the requester's organization and treats any mismatch as a cache miss. Cached rows are stored as JSON in a Postgres column when small; larger result sets spill to an opaque handle pointing to an S3 ResultStore in the Customer's account. The underlying RDS instance is encrypted at rest with AWS-managed KMS by default. RDS and the S3 ResultStore live in the Customer's AWS account alongside the application container and the Bedrock PrivateLink endpoint — none of these data-touching components is in AnswerLayer-managed infrastructure.

Per-column PII configuration is available at the connection level. Columns flagged as PII are stripped from the schema exposed to the LLM and from metadata APIs by default.
