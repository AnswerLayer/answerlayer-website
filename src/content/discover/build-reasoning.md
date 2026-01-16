---
title: "Chain-of-thought semantic analysis"
options:
  - label: "See the curation workflow"
    target: "build-curation"
  - label: "Back"
    target: "build-generation"
external: false
externalUrl: null
---
Built on DSPy, the generation process uses chain-of-thought prompting to reason through complex schemas. Each decision is logged with:

- **Confidence score** — How certain the analysis is about each inference
- **Reasoning trace** — The logical steps that led to the conclusion
- **Alternative interpretations** — Other possible meanings considered

Low-confidence inferences are flagged for human review. High-confidence inferences can be auto-approved. The threshold is configurable per organization.

Example reasoning trace:
```
Column: cust_id (integer)
- High cardinality (50,000+ unique values)
- Referenced by orders.customer_id, support_tickets.cust_id
- Values are sequential integers
→ Inference: Primary key for Customer entity (confidence: 0.94)
```