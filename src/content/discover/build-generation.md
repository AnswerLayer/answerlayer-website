---
title: "How semantic layer generation works"
options:
  - label: "Examine data sampling"
    target: "build-sampling"
  - label: "Understand chain-of-thought reasoning"
    target: "build-reasoning"
  - label: "See PII detection"
    target: "build-pii"
  - label: "Review query validation"
    target: "build-validation"
  - label: "Back"
    target: "path-build"
external: false
externalUrl: null
---
AnswerLayer analyzes actual data, not just schema metadata. The process:

1. **Connect** — PostgreSQL, BigQuery, Snowflake, MySQL, Athena, or any SQL database
2. **Sample** — Statistical sampling of data values to understand distributions and types
3. **Analyze** — Chain-of-thought reasoning identifies entities, relationships, and business meaning
4. **Generate** — Complete semantic model with entities, metrics, dimensions, filters
5. **Curate** — Human review and refinement of generated definitions