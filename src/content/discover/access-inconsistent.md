---
title: "Inconsistent numbers"
# ORPHANED
options: []
external: false
externalUrl: null
---
Different people pull different numbers for the same question. Why?

- Different filters (active vs. all customers)
- Different date ranges (fiscal year vs. calendar year)
- Different aggregations (mean vs. median)
- Different data sources (data warehouse vs. production replica)

The semantic layer establishes one definition for each metric. When everyone queries through AnswerLayer, everyone gets the same answer.