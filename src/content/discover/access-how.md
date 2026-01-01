---
title: "How natural language querying works"
options:
  - label: "Learn about semantic layers"
    target: "access-semantic"
  - label: "See query examples"
    target: "access-examples"
  - label: "Understand guardrails"
    target: "access-guardrails"
  - label: "Back"
    target: "path-access"
external: false
externalUrl: null
---
The process:

1. **Question** — Ask in plain English: "What was revenue last quarter by region?"
2. **Translation** — AnswerLayer translates to SQL using the semantic layer
3. **Validation** — Query is checked against guardrails before execution
4. **Execution** — SQL runs against the database
5. **Response** — Results returned with explanation of how they were computed

The semantic layer is the key. Without it, AI models hallucinate column names and invent relationships. With it, queries are grounded in actual database structure.