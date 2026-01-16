---
title: "How semantic layer generation works"
options:
  - label: "Examine data sampling"
    target: "build-sampling"
  - label: "Explore the object model"
    target: "build-object-model"
  - label: "Back"
    target: "path-build"
external: false
externalUrl: null
---
AnswerLayer analyzes actual data, not just schema metadata. Documents can also be linked to provide additional context. The process:

1. **Connect** — Link your SQL database and any relevant documentation
2. **Sample** — Statistical sampling of data values to understand distributions and types
3. **Analyze** — Chain-of-thought reasoning identifies entities, relationships, and business meaning
4. **Generate** — Complete semantic model with entities, metrics, dimensions, filters
5. **Curate** — Human review and refinement of generated definitions

AnswerLayer supports both automatic and interactive modes. In interactive mode, it interviews subject matter experts to update and refine the semantic layer.