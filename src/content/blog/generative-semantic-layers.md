---
title: "Generative Semantic Layers"
description: "Why context-light AI tools fail on real data models, and an approach that samples actual data to generate semantic layer definitions."
publishedAt: 2026-01-15
author: "Josh Harris"
tags: ["semantic-layer", "ai", "data-analytics", "automation"]
featured: true
draft: true
---

Over the past year I've evaluated around 70 AI tools for data systems and built multiple prototypes of my own. A pattern emerged: context-light solutions break down on realistic data models. Tools that rely on schema names alone, or simple prompting over table structures, produce outputs that look impressive in demos but fall apart when you point them at a warehouse with hundreds of tables, cryptic column names, and business logic encoded in ways that aren't obvious from the DDL.

The semantic layer problem is a good example. Traditional tools like dbt Semantic Layer, Cube, and LookML solve a real problem: they create shared definitions for metrics so that "revenue" means the same thing whether you're in Looker or a Python notebook. But they solve it through manual configuration. You write YAML for every entity. You define every metric by hand. You explicitly declare every relationship. For a moderately complex warehouse, this takes a team months to build. Then it starts drifting out of sync with the actual database the moment it's created, because schemas change and people forget to update the definitions.

AnswerLayer takes a different approach. Instead of asking you to write configuration, it generates a semantic layer by analyzing your actual data. The system connects to your database, samples real values from tables, computes statistics on distributions and cardinality, and uses that context to reason about what the data means. A column named `cust_id` with high cardinality and sequential integers that appears as a foreign key in three other tables is probably a customer identifier. A numeric column with values clustering around business-relevant thresholds might be a meaningful metric. The generation pipeline moves through stages: domain detection, entity identification, metric generation, dimension mapping. Each inference comes with a confidence score.

But schema and statistics only get you so far. Real warehouses have institutional knowledge that lives outside the database: data dictionaries in Confluence, business glossaries in wikis, metric definitions scattered across Notion pages. AnswerLayer can ingest these documents and extract the context that makes generation actually useful. When your glossary says "Client" but the schema says `customers`, the system surfaces the conflict and asks which term to use. When a metric definition doc specifies that revenue should exclude refunds, that business rule gets encoded in the generated semantic layer. This is the difference between context-light and context-rich: one reads your schema, the other reads your organization.

The confidence scores matter because generation is not the end of the process. Human curation and review are crucial. The goal here is to scale specialized data knowledge and free up time for strategic thinking, not to replace the analytics engineer. Humans provide critical grounding that should be renewed regularly, and in some cases continuously. A generative semantic layer gives you a draft to react to rather than a blank YAML file to fill in. Domain experts confirm or rename entities, adjust relationship inferences, refine metric calculations with business rules they carry in their heads. The system learns from these corrections. Locked definitions survive regeneration. New schema elements create new suggestions without overwriting curated work.

Generation is step one. The roadmap is about making the semantic layer a living system rather than a static artifact.

Time-based annotations are next. Data doesn't exist in a vacuum. Policy changes, COVID lockdowns, natural disasters, seasonal factors all affect what the numbers mean. When you query a time period affected by an annotated event, the system should surface that context automatically: "Note: Q2 2020 data reflects COVID lockdowns in Victoria." Without this, users draw incorrect conclusions from data that looks anomalous but is actually explained by external events.

Fuzzy matching using embeddings is another priority. Users refer to concepts using different terms: regional variations, abbreviations, informal names, domain jargon. A council might call something "ratepayers" while the schema says `property_owners`. Rather than maintaining brittle synonym dictionaries, embedding-based matching lets the system understand that "clients," "customers," and "accounts" are semantically close and route queries accordingly. This is especially important for natural language interfaces where you can't predict exactly how someone will phrase a question.

Full work traces address the trust problem. When the system generates SQL from a natural language question, users need to see the reasoning path: how it interpreted the question, which semantic layer components it selected, what alternatives it considered. This transparency is essential for building confidence in the results. If something looks wrong, you can trace back to where the interpretation diverged and fix it at the source.

Self-validation on empty results is the kind of detail that matters in production. When a query returns zero rows, is the data genuinely empty or did something go wrong? The system should check filter conditions against known data ranges, verify that dimension values exist, and either confirm the result or suggest corrections. This reduces the manual investigation that erodes trust over time.

If you're an analytics engineer tired of writing YAML, or you've inherited a warehouse where nobody documented what the tables mean, this approach might be worth exploring. The tradeoff is that you're trusting an LLM to make initial guesses, and you need to invest time reviewing and correcting those guesses. For many teams, that's still faster than starting from scratch.
