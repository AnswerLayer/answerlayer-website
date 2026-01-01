---
title: "System architecture"
options:
  - label: "See deployment options"
    target: "build-deployment"
  - label: "Review security model"
    target: "build-security"
  - label: "Evaluate pricing"
    target: "build-evaluate"
  - label: "Back"
    target: "build-problem-technical"
external: false
externalUrl: null
---
AnswerLayer is designed for enterprise deployment:

- **Query engine** — Translates natural language to SQL using the semantic layer
- **Semantic store** — Persists entities, metrics, dimensions, relationships
- **Generation service** — Analyzes databases and produces semantic models
- **API layer** — REST and GraphQL interfaces for integration

All components are stateless and horizontally scalable. The semantic store uses PostgreSQL. Generation uses Claude for reasoning.