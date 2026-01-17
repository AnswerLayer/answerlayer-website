---
title: "PII detection"
# ORPHANED
options: []
external: false
externalUrl: null
---
AI-powered detection scans columns for personally identifiable information:

- **Pattern matching** — Email formats, phone numbers, SSN patterns
- **Semantic analysis** — Column names suggesting personal data
- **Value sampling** — Actual data patterns indicating PII
- **Confidence scoring** — Each detection has a confidence level

Detected PII is flagged with options:
- **Block** — Column excluded from queries entirely
- **Mask** — Column available but values redacted
- **Allow** — Override detection (with audit trail)
- **Review** — Flag for human decision

All PII decisions are logged for compliance.