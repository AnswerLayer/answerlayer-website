---
title: "Technical debt in semantic layers"
options:
  - label: "See the generation process"
    target: "build-generation"
  - label: "Understand the architecture"
    target: "build-architecture"
  - label: "Back"
    target: "build-problem"
external: false
externalUrl: null
---
The core issue is that semantic layers are hand-crafted artifacts in a world of automated infrastructure. Database schemas are managed by migrations. Application code has CI/CD. But semantic layers? Manual YAML, manual testing, manual deployment.

When a column is renamed in the database, the semantic layer silently breaks. When a new table is added, someone has to remember to model it. When business definitions change, finding all affected metrics requires searching through configuration files.

AnswerLayer treats semantic layer generation as a first-class automated process.