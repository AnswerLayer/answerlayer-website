---
title: "Query examples"
options:
  - label: "Try asking questions"
    target: "external-demo"
  - label: "See how translation works"
    target: "access-how"
  - label: "Back"
    target: "access-how"
external: false
externalUrl: null
---
Examples of natural language questions and how they translate:

**"What was revenue last quarter?"**
```sql
SELECT SUM(amount)
FROM orders
WHERE status = 'completed'
AND date BETWEEN '2024-10-01' AND '2024-12-31'
```

**"Show top 10 customers by lifetime value"**
```sql
SELECT c.name, SUM(o.amount) as ltv
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE o.status = 'completed'
GROUP BY c.id, c.name
ORDER BY ltv DESC
LIMIT 10
```

**"How has churn changed month over month?"**
```sql
SELECT
  DATE_TRUNC('month', churned_at) as month,
  COUNT(*) as churned_customers
FROM customers
WHERE churned_at IS NOT NULL
GROUP BY 1
ORDER BY 1
```