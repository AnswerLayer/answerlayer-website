---
title: "Building semantic layers"
options:
  - label: "See how generation works"
    target: "build-generation"
  - label: "Review security model"
    target: "build-security"
  - label: "Evaluate for purchase"
    target: "build-evaluate"
  - label: "Back"
    target: "branch-root"
external: false
externalUrl: null
---
Traditional semantic layers (dbt Semantic Layer, Cube, LookML, AtScale) require:

- Hundreds of lines of YAML or configuration code
- Manual mapping of every table, column, and relationship
- Metric definitions written one by one with exact SQL expressions
- Constant maintenance as schemas evolve

This means months of upfront work. Every schema migration risks breaking definitions. Every new metric requires a pull request. The semantic layer becomes a bottleneck instead of an accelerator.