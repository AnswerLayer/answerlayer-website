---
title: "The semantic layer maintenance problem"
# ORPHANED
options: []
    target: "build-generation"
  - label: "Read technical deep-dive"
    target: "build-problem-technical"
  - label: "Compare to existing tools"
    target: "build-problem-compare"
  - label: "Back"
    target: "path-build"
external: false
externalUrl: null
---
Traditional semantic layers (dbt Semantic Layer, Cube, LookML, AtScale) require:

- Hundreds of lines of YAML or configuration code
- Manual mapping of every table, column, and relationship
- Metric definitions written one by one with exact SQL expressions
- Constant maintenance as schemas evolve

This means weeks of upfront work. Every schema migration risks breaking definitions. Every new metric requires a pull request. The semantic layer becomes a bottleneck instead of an accelerator.