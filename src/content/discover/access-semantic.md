---
title: "What is a semantic layer?"
# ORPHANED
options: []
external: false
externalUrl: null
---
A semantic layer is a map between business concepts and database structures.

| Business concept | Database reality |
|------------------|------------------|
| Customer | `customers` table |
| Revenue | `SUM(orders.amount) WHERE orders.status = 'completed'` |
| Region | `customers.region_code` joined to `regions.name` |
| Last quarter | `date BETWEEN '2024-10-01' AND '2024-12-31'` |

Without this map, "What was revenue?" is ambiguous. Which table? Which column? What filters? With the semantic layer, there is one definition of revenue that everyone uses.