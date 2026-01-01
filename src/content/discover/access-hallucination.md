---
title: "AI hallucination in data queries"
options:
  - label: "See how grounding works"
    target: "access-how"
  - label: "Learn about semantic layers"
    target: "access-semantic"
  - label: "Try it out"
    target: "external-demo"
  - label: "Back"
    target: "access-problems"
external: false
externalUrl: null
---
ChatGPT and similar tools can write SQL, but they hallucinate:

- Invent column names that do not exist
- Assume relationships that are not real
- Apply incorrect business logic
- Produce plausible but wrong results

The problem: LLMs do not know the schema. They guess based on training data.

AnswerLayer grounds AI in the actual semantic layer. The model does not guess—it uses defined entities, metrics, and relationships. Hallucination becomes nearly impossible.