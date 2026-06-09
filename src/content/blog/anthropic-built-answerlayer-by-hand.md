---
title: "Anthropic Built AnswerLayer by Hand"
description: "Anthropic's write-up on internal self-service analytics is a careful, honest account of what it actually takes to get an LLM to answer business questions accurately. It also happens to be the architecture we've been building as a product."
publishedAt: 2026-06-07
author: "Josh Harris"
tags: ["semantic-layer", "ai", "data-analytics", "governance", "evals"]
featured: true
draft: true
---

Anthropic recently published [how their internal data team enables self-service analytics with Claude](https://claude.com/blog/how-anthropic-enables-self-service-data-analytics-with-claude). It's worth reading in full. It's unusually honest for a vendor post — there are negative results in it, costs attached to the wins, and no pretense that the model does the hard part on its own.

I read it with a particular kind of interest, because the architecture it describes is, almost layer for layer, the product we've spent the last year building. The difference is that Anthropic built it by hand, inside one repository, with one of the best data and engineering teams on the planet. Most organizations don't have that. The interesting question isn't whether their approach works — it clearly does — it's what it tells us about where the accuracy actually comes from.

## The finding that matters

The headline number is the jump from 21% to consistently-above-95% accuracy. But the number worth sitting with is a different one. They gave the agent raw grep access to thousands of historical queries — every dashboard, transformation, and analyst notebook they had — and accuracy "moved by less than a point in either direction."

Think about what that rules out. The bottleneck was not the model's reasoning. It was not the absence of examples. More data access did essentially nothing. What moved accuracy from 21% to 95% was *structure*: a governed semantic layer the agent is required to use, curated reference docs that encode grain and hygiene filters and the wrong-answer modes a senior analyst would warn you about, and a validation loop that catches regressions before they ship.

That is the whole thesis. The model is the least important part. We [wrote as much in January](/blog/generative-semantic-layers): context-light tools that read your schema and prompt over table names look great in a demo and fall apart on a real warehouse. Anthropic just ran the experiment at scale and got the same result, with numbers attached.

## The same architecture, named differently

Lay the two side by side and the correspondence is hard to miss.

**A semantic layer as the mandatory default path.** Anthropic's skill forces every question through the semantic layer first — same definitions as the BI tool, joins and grain and filters baked in — and only falls back to raw SQL after the semantic layer is shown not to cover the ask. The skill even lists pre-rebutted excuses so the model can't talk itself into freelancing.

Our inquiry agent works the same way. The semantic layer is the default; the system prompt instructs it to reach for raw schema access only when no semantic layer covers the question. We didn't arrive at that by reading their post — we arrived at it by measuring it. We ran an ablation across three Claude models, each evaluated with and without a semantic layer available, precisely to isolate that one variable. The semantic layer is the variable we keep coming back to. They went looking in the same place.

The ablation in their post — give the agent more context, measure whether accuracy moves — is a question I got interested in a while ago. Six months back I built an open-source research project around it for a talk: [Semiosis](https://github.com/AnswerLayer/semiosis), a framework for measuring the semantic quality of a context system, grounded in semantic information theory. Instead of running the ablation once and reporting a number, it runs it systematically — progressively removing and corrupting pieces of your documentation and semantic layer, measuring how gracefully accuracy degrades, and locating the critical components and the redundant ones. Anthropic ran one careful ablation by hand and learned the model wasn't the bottleneck. Semiosis asks that question as a repeatable measurement: how much of your accuracy actually depends on structure, and which structure. It was a research project, not a product — but the way it taught me to think, treating documentation quality as something you can unit-test, is directly informing how we approach evals now.

**Reference docs that encode meaning, not schema.** Their per-domain docs specify what one row represents, the filter every query in the domain must apply, and the gotchas a senior analyst carries in their head. Those aren't column descriptions — they're business semantics. In our model the same information lives as structured objects: entities with a defined grain, measures and metrics with default filters, dimensions, relationships. Same content, expressed as data instead of prose.

**Validation as a gate, not an afterthought.** Anthropic runs a before/after eval on every meaningful skill edit, with the delta in the PR. They grade the agent's *query* rather than its number, because the right number changes as data updates but a correct query stays correct. They pin evals to snapshot dates. We build the same machinery — ablation runs, an eval harness, results captured per model and configuration — for the same reason: you cannot improve a system like this on vibes, and a change that sounds helpful will sometimes regress accuracy.

When two teams converge on the same architecture from opposite directions — them from running an internal platform, us from building a product — that's reasonable evidence the architecture is right.

## Where the paths diverge

The agreement is the interesting part. But the differences are where the product actually lives, and I want to be precise about them rather than wave at them.

**They author the semantic layer by hand. We generate the first draft from the data.** Anthropic's reference docs are hand-curated — senior analysts encoding ~30 files per domain. That's the right investment when you have those analysts and that's their job. For most organizations, "write and maintain a governed semantic layer by hand" is exactly the project that never finishes. So we invert it: connect to the database, sample real values, compute distributions and cardinality and foreign-key structure, and generate a semantic layer draft for a human to react to. A draft you correct is a fundamentally cheaper starting point than a blank YAML file. The human stays in the loop — locking definitions, refining metrics, correcting the agent's guesses — but they start from something, and their corrections survive regeneration.

**Their answer to drift is a review hook. Ours is structural.** The hardest part of any semantic layer isn't building it — it's keeping it from lying three weeks later when a table changes. Anthropic's solution is genuinely clever: their data code lives in one repo, a CI hook flags any model change that doesn't also touch a skill file, and a scheduled agent scans Slack for correction language and opens doc-fix PRs. About 90% of their data-model PRs now include a skill change in the same diff. That works because everything — models, semantic layer, docs — is colocated in their world and maintained by the people who own it.

That assumption doesn't hold for everyone. Most companies' data definitions are *not* all in one repo owned by one disciplined team. So our drift defense doesn't depend on a reviewer remembering, or on a monorepo existing. It's structural: the semantic layer is generated from the live database, so drift is detected against the data itself; curated definitions are locked so regeneration doesn't stomp human work; and every edit — agent or human — is written to an audit log, so you can always answer "who defined this, and why." Drift becomes a property the system checks, not a discipline the team has to sustain.

**Their loop assumes one trust boundary. Most companies have several.** This is the quiet structural difference, and it's the largest. Anthropic's warehouse, their analytics team, and the model all sit inside the same organization. For everyone else, "let an agent query the warehouse" runs straight into the question of where the data goes. AnswerLayer runs in your own cloud — AWS or GCP, in your account. The analysis happens through queries against your database; the data never leaves it and never transits the public internet. The governance story and the privacy story turn out to be the same story: keep the semantic layer, the agent, and the data inside a boundary you control. For a whole class of regulated businesses, that boundary isn't a nicety — it's the only form a deployment can legally take, and it reaches companies that would never clear the bar for a hosted enterprise AI tier.

That last point is really the first visible instance of a difference that runs deeper than privacy.

## The engine isn't the product

Read the Anthropic post again and notice what it's a description of: an *engine*. A semantic layer, a corpus of curated context, an eval loop. For Anthropic, that engine is the whole job, because they are serving an audience of one — themselves. Their delivery vehicle is a skill an analyst invokes from a terminal inside the company. For that audience, that's exactly right. It's also where the two architectures stop overlapping, because AnswerLayer isn't a skill you invoke. It's an application you deploy next to the warehouse, and most of what we build only exists on the far side of that distinction.

A skill fired from a laptop is gone when the terminal closes. An application that stands next to the warehouse persists, and a few things follow from that which no invocation can reach:

- **It can be embedded.** Anthropic's analytics answer questions for Anthropic employees. AnswerLayer gets embedded into our customers' own products, so the questions get answered for *their* users — and the metric that moves is their retention and revenue, not an internal productivity stat. That's a different category of value, and it needs a deployed surface, not a command line.
- **It can own its evals.** The post describes the data team maintaining eval cases by hand, off to the side. A standing application can hold those cases as managed objects — custom evals as a first-class part of the stack rather than internal tooling someone keeps in a folder. This is traditional data-science methodology, and as far as I can tell no vertical AI product from Anthropic or anyone else ships it. It's the same instinct that produced [Semiosis](https://github.com/AnswerLayer/semiosis): measurement belongs inside the system, not beside it.
- **It can watch the warehouse.** Because it lives next to the warehouse continuously, AnswerLayer has a stable view of query latency and performance that a skill triggered from someone's terminal never gets — it sees through a keyhole, an application sees the room. At least one customer is already asking us for exactly this, and optimization is what follows once you can observe.
- **Its curation can be a service.** The post's emphasis on curation is a strong validation of how we've built — but it quietly assumes a data team that can do the curating. Most companies don't have one, or have one that's badly stretched. So we deliver the curation too: forward-deployed engineers who build and refine the semantic layer alongside the customer. Anthropic proved curation is essential; we don't assume you can staff it.
- **It's the right substrate for more than questions.** A governed semantic layer behind an API is also where traditional ML belongs — segmentation, forecasting — served as stable, inspectable outputs rather than improvised in a skill. That pattern absorbs what were whole product categories a few years ago: the feature store, the MLOps stack. The semantic layer was always the missing center of gravity for them.

None of this is a knock on the Anthropic post. They built the engine because no product handed it to them. They didn't have to build the rest, because they have exactly one customer. Everyone else has the opposite problem — the engine is necessary and it is nowhere near sufficient, and the distance between the two is the product.

## The honest version

I want to be careful not to overclaim here. Anthropic reported real accuracy numbers from a production system serving a real organization at scale. I'm not going to pretend we have an identical number to wave back; we measure the same effects, we run the same kind of ablations, and we're building toward the same bar. Their post is a vindication of the thesis, not a scoreboard to argue with.

What their write-up demonstrates, better than anything we could have said ourselves, is that accurate self-service analytics is a *data-foundations* problem wearing an AI costume. The model improved over the period they describe, and they pruned scaffolding as it did — but the model was never the thing holding accuracy back. Structure was. Governance was. The unglamorous semantic layer was.

Anthropic had the team to build that structure by hand. The reason AnswerLayer exists is that almost nobody else does — and the structure is the same whether you hand-author it or generate it, whether you maintain it with a review hook or regenerate it from the data. They proved the architecture on their own warehouse. We're making it something you can point at yours.
