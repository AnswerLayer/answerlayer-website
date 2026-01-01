---
title: "Data sampling analysis"
options:
  - label: "See chain-of-thought reasoning"
    target: "build-reasoning"
  - label: "Review security model"
    target: "build-security"
  - label: "Back"
    target: "build-generation"
external: false
externalUrl: null
---
Schema metadata alone cannot reveal business meaning. A column named `status` could contain order states, customer segments, or approval workflows. AnswerLayer samples actual data to understand:

- **Statistical distributions** — Cardinality, null rates, value frequencies
- **Data types** — Beyond declared types to actual content patterns
- **Relationships** — Foreign key patterns even when not declared
- **Business context** — Naming patterns, value semantics, temporal patterns

Sampling is configurable. Data never leaves the database—analysis happens through queries, not data export.