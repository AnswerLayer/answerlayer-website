---
title: "Query guardrails"
# ORPHANED
options: []
external: false
externalUrl: null
---
Not every query should execute. Guardrails prevent problems:

- **PII filtering** — Sensitive columns blocked or masked
- **Row limits** — Maximum results prevent overwhelming data pulls
- **Timeout protection** — Long queries terminated automatically
- **Cost controls** — For cloud warehouses, cost estimates before execution
- **Operation restrictions** — Only SELECT queries allowed by default

Guardrails are configurable by role. Analysts might have different limits than executives.