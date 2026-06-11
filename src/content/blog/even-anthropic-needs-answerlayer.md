---
title: "Even Anthropic Needs AnswerLayer"
description: "Anthropic's write-up on internal self-service analytics shows accuracy coming from structure rather than the model: a governed semantic layer, curated context, and an eval loop. That structure is what AnswerLayer ships as a product."
publishedAt: 2026-06-07
author: "Josh Harris"
tags: ["semantic-layer", "ai", "data-analytics", "governance", "evals"]
featured: true
draft: true
---

Anthropic recently published a post on [how their internal data team enables self-service analytics with Claude](https://claude.com/blog/how-anthropic-enables-self-service-data-analytics-with-claude). It's worth reading in full. There are negative results in it, the wins have token and latency costs attached, and at no point does it claim the model does the hard part on its own. That's rare for a vendor post.

I read it closely because the system it describes is, layer for layer, the architecture we've spent the past year building as a product. To make Claude answer business questions accurately, Anthropic needs an answer layer between the agent and the warehouse: a governed semantic layer, curated context, and an eval loop. They got one the only way available to them, by steering Claude through building it manually: prompting, reviewing, and correcting inside a single repository, with one of the strongest data teams in the industry doing the steering. Most organizations can't staff that. So the useful question for everyone else isn't whether the approach works. It clearly does. The useful question is where the accuracy came from, and how much of the manual steering can be automated.

## The result that matters

The headline number is the jump from 21% accuracy to consistently above 95%. A different number tells you more. At one point they gave the agent raw grep access to thousands of historical queries, covering every dashboard, transformation, and analyst notebook they had, and accuracy moved "by less than a point in either direction."

That result rules out a lot. The bottleneck wasn't model reasoning capacity. It wasn't a shortage of examples. Adding data access did approximately nothing. What took accuracy from 21% to 95% was structure: a governed semantic layer the agent is required to use, curated reference docs that encode grain, hygiene filters, and known wrong-answer modes, and a validation loop that catches regressions before they ship.

<figure style="margin: 2.25rem 0;">
<svg viewBox="0 0 640 168" width="100%" role="img" aria-label="Bar chart. Baseline agent with raw warehouse access: 21 percent accuracy. Same agent with grep access to thousands of past queries: still about 21 percent, moved less than one point. Same agent with a semantic layer, curated references and evals: 95 percent plus.">
<text x="0" y="14" style="font-family: var(--font-mono, monospace); font-size: 11px; fill: var(--color-navy-900, #151c3f);">agent + raw warehouse access</text>
<rect x="0" y="22" width="118" height="16" style="fill: var(--color-navy-300, #8997d6);" />
<text x="126" y="35" style="font-family: var(--font-mono, monospace); font-size: 12px; fill: var(--color-navy-900, #151c3f);">21%</text>
<text x="0" y="66" style="font-family: var(--font-mono, monospace); font-size: 11px; fill: var(--color-navy-900, #151c3f);">same agent + grep over thousands of past queries</text>
<rect x="0" y="74" width="122" height="16" style="fill: var(--color-navy-300, #8997d6);" />
<text x="130" y="87" style="font-family: var(--font-mono, monospace); font-size: 12px; fill: var(--color-navy-500, #4a57b4);">&#8776;21%  (moved &lt;1 pt)</text>
<text x="0" y="118" style="font-family: var(--font-mono, monospace); font-size: 11px; fill: var(--color-navy-900, #151c3f);">same agent + semantic layer, curated refs, evals</text>
<rect x="0" y="126" width="532" height="16" style="fill: var(--color-navy-600, #384393);" />
<text x="540" y="139" style="font-family: var(--font-mono, monospace); font-size: 12px; fill: var(--color-navy-900, #151c3f);">95%+</text>
</svg>
<figcaption style="font-size: 0.85rem; opacity: 0.7; margin-top: 0.5rem;">Anthropic's ablation: adding data access moved accuracy less than a point. Structure accounts for the rest.</figcaption>
</figure>

We wrote back in March that [context-light tools](/blog/generative-semantic-layers), the ones that read your schema and prompt over table names, demo well and fail on production warehouses. Anthropic ran that experiment at scale on their own warehouse and published the numbers. The model is the least important component in the stack.

## The same architecture, named differently

Lay the two systems side by side and the correspondence is close to one-to-one.

<figure style="margin: 2.25rem 0;">
<svg viewBox="0 0 640 248" width="100%" role="img" aria-label="Two columns comparing Anthropic's internal stack with AnswerLayer's product, row by row. Agent row: Claude plus analytics skill versus inquiry agent. Context row: reference docs, manually curated, versus entities, metrics and filters. Semantic layer row: manually steered authoring versus generated then curated. Validation row: eval gate on every skill edit versus eval harness plus ablations.">
<text x="248" y="18" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 12px; font-weight: 600; fill: var(--color-navy-900, #151c3f);">Anthropic (internal)</text>
<text x="512" y="18" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 12px; font-weight: 600; fill: var(--color-navy-900, #151c3f);">AnswerLayer (product)</text>
<text x="10" y="58" style="font-family: var(--font-mono, monospace); font-size: 11px; fill: var(--color-navy-500, #4a57b4);">agent</text>
<rect x="128" y="36" width="240" height="36" style="fill: var(--color-navy-50, #eef1fa); stroke: var(--color-navy-200, #aebce5);" />
<text x="248" y="58" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 11px; fill: var(--color-navy-900, #151c3f);">Claude + analytics skill</text>
<text x="380" y="59" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 13px; fill: var(--color-navy-500, #4a57b4);">&#8776;</text>
<rect x="392" y="36" width="240" height="36" style="fill: var(--color-navy-50, #eef1fa); stroke: var(--color-navy-200, #aebce5);" />
<text x="512" y="58" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 11px; fill: var(--color-navy-900, #151c3f);">inquiry agent</text>
<text x="10" y="110" style="font-family: var(--font-mono, monospace); font-size: 11px; fill: var(--color-navy-500, #4a57b4);">context</text>
<rect x="128" y="88" width="240" height="36" style="fill: var(--color-navy-50, #eef1fa); stroke: var(--color-navy-200, #aebce5);" />
<text x="248" y="110" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 11px; fill: var(--color-navy-900, #151c3f);">reference docs, manually curated</text>
<text x="380" y="111" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 13px; fill: var(--color-navy-500, #4a57b4);">&#8776;</text>
<rect x="392" y="88" width="240" height="36" style="fill: var(--color-navy-50, #eef1fa); stroke: var(--color-navy-200, #aebce5);" />
<text x="512" y="110" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 11px; fill: var(--color-navy-900, #151c3f);">entities, metrics, filters</text>
<text x="10" y="162" style="font-family: var(--font-mono, monospace); font-size: 11px; fill: var(--color-navy-500, #4a57b4);">semantic layer</text>
<rect x="128" y="140" width="240" height="36" style="fill: var(--color-navy-50, #eef1fa); stroke: var(--color-navy-200, #aebce5);" />
<text x="248" y="162" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 11px; fill: var(--color-navy-900, #151c3f);">manually steered authoring</text>
<text x="380" y="163" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 13px; fill: var(--color-navy-500, #4a57b4);">&#8776;</text>
<rect x="392" y="140" width="240" height="36" style="fill: var(--color-navy-50, #eef1fa); stroke: var(--color-navy-200, #aebce5);" />
<text x="512" y="162" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 11px; fill: var(--color-navy-900, #151c3f);">generated, then curated</text>
<text x="10" y="214" style="font-family: var(--font-mono, monospace); font-size: 11px; fill: var(--color-navy-500, #4a57b4);">validation</text>
<rect x="128" y="192" width="240" height="36" style="fill: var(--color-navy-50, #eef1fa); stroke: var(--color-navy-200, #aebce5);" />
<text x="248" y="214" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 11px; fill: var(--color-navy-900, #151c3f);">eval gate on every skill edit</text>
<text x="380" y="215" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 13px; fill: var(--color-navy-500, #4a57b4);">&#8776;</text>
<rect x="392" y="192" width="240" height="36" style="fill: var(--color-navy-50, #eef1fa); stroke: var(--color-navy-200, #aebce5);" />
<text x="512" y="214" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 11px; fill: var(--color-navy-900, #151c3f);">eval harness + ablations</text>
</svg>
<figcaption style="font-size: 0.85rem; opacity: 0.7; margin-top: 0.5rem;">Same stack at every layer. Anthropic's team manually steers Claude through authoring theirs; AnswerLayer generates the draft and curators review it.</figcaption>
</figure>

**The semantic layer is the mandatory default path.** Anthropic's skill forces every question through the semantic layer first, with the same definitions as the BI tool and the joins, grain, and filters baked in. Raw SQL is only permitted after the semantic layer has been shown not to cover the ask. The skill even lists pre-rebutted excuses so the model can't talk itself into bypassing the governed path.

Our inquiry agent enforces the same priority. The semantic layer is the default; the system prompt permits raw schema access only when no semantic layer covers the question. We didn't get there by reading their post. We got there by measuring. We ran an ablation across three Claude models, each evaluated with and without a semantic layer available, specifically to isolate that variable. The semantic layer is the variable we keep coming back to, and it's the one they went looking at too.

The ablation in their post (add context, measure whether accuracy moves) is a question I got interested in a while ago. Six months back I built an open-source research project around it for a talk: [Semiosis](https://github.com/AnswerLayer/semiosis), a framework for measuring the semantic quality of a context system, grounded in semantic information theory. Instead of running the ablation once and reporting a number, it runs the ablation systematically: progressively removing and corrupting pieces of documentation and semantic layer, measuring how accuracy degrades, and locating the critical components and the redundant ones. Anthropic ran one careful ablation and learned the model wasn't the bottleneck. Semiosis treats that question as a repeatable measurement: how much of your accuracy depends on structure, and which structure. It was a research project rather than a product, but the framing it forced, treating documentation quality as something you can unit-test, is directly informing how we approach evals now.

**Reference docs encode business semantics.** Their per-domain docs specify what one row represents, the filter every query in the domain must apply, and the failure modes a senior analyst would flag. None of that information exists in the DDL. In our model the same information lives as structured objects: entities with a defined grain, measures and metrics with default filters, dimensions, relationships. Same content, represented as data instead of prose.

**Validation gates every change.** Anthropic runs a before/after eval on every meaningful skill edit and puts the delta in the PR description. They grade the agent's query rather than its output number, because the correct number changes as data refreshes while a correct query stays correct. They pin evals to snapshot dates. We build the same machinery: ablation runs, an eval harness, results captured per model and configuration. A change that sounds helpful will sometimes regress accuracy, and only a gate catches it.

When two teams converge on the same architecture from opposite directions, one operating an internal platform and one building a product, that's reasonable evidence the architecture is right.

## Where the paths diverge

The agreement is the interesting part. The differences are where the product lives, so I want to be precise about them.

**They steer the authoring manually. We generate the first draft from the data.** Anthropic's reference docs are produced by senior analysts directing Claude and reviewing its output, roughly 30 curated files per domain. That's a sound investment when you employ those analysts and it's their job. For most organizations, building and maintaining a governed semantic layer is the project that never finishes. So we invert the order: connect to the database, sample real values, compute distributions, cardinality, and foreign-key structure, and generate a semantic layer draft for a human to review. A draft you correct is a much cheaper starting point than a blank YAML file. The human stays in the loop, locking definitions, refining metrics, and correcting the agent's guesses, and their corrections survive regeneration.

**Their drift defense is process. Ours is structural.** The hard part of any semantic layer is keeping it true after the schema changes. Anthropic's solution is genuinely clever: all data code lives in one repo, a CI hook flags any model change that doesn't also touch a skill file, and a scheduled agent scans Slack for correction language and opens doc-fix PRs. About 90% of their data-model PRs now include a skill change in the same diff. The mechanism depends on colocation: models, semantic layer, and docs in one repository, maintained by the team that owns all three.

That precondition fails at most companies. Data definitions are scattered across tools and nobody owns all of them. So our drift defense doesn't rely on a reviewer remembering or on a monorepo existing. The semantic layer is generated from the live database, so drift is detected against the data itself. Curated definitions are locked, so regeneration can't overwrite human decisions. Every edit, agent or human, lands in an audit log, so the question "who defined this, and why" always has an answer. Drift becomes a property the system checks rather than a discipline the team has to sustain.

**Their deployment has one trust boundary. Most companies have several.** Anthropic's warehouse, their analytics team, and the model all sit inside the same organization, so "let an agent query the warehouse" raises no data-residency questions. For everyone else it immediately does. AnswerLayer deploys into the customer's own cloud, AWS or GCP, in their account. Analysis happens through queries against the customer's database; the data never leaves it and never transits the public internet. The same boundary that satisfies governance also satisfies privacy review. For regulated businesses this is the only deployment shape that passes legal, and it reaches companies that would never clear procurement for a hosted enterprise AI tier.

That last point is the first visible instance of a difference that runs deeper than privacy.

## The engine isn't the product

Read the Anthropic post again and notice what it describes: an engine. A semantic layer, a corpus of curated context, an eval loop. For Anthropic the engine is the whole job, because they serve an audience of one, themselves. Their delivery vehicle is a skill an analyst invokes from a terminal inside the company, and for that audience it's the right vehicle. It's also where the two systems stop overlapping. AnswerLayer is not a skill you invoke. It's an application deployed next to the warehouse, and most of what we build only exists on the far side of that distinction.

<figure style="margin: 2.25rem 0;">
<svg viewBox="0 0 640 240" width="100%" role="img" aria-label="Two panels. Left: a skill, where a terminal invokes the warehouse and the session ends with context gone. Right: an application deployed inside the customer's cloud on AWS or GCP, where AnswerLayer sits next to the warehouse and carries persistent capabilities: embed, evals, observe, ML and API.">
<text x="150" y="16" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 12px; font-weight: 600; fill: var(--color-navy-900, #151c3f);">a skill, invoked</text>
<rect x="20" y="120" width="110" height="40" style="fill: var(--color-navy-50, #eef1fa); stroke: var(--color-navy-200, #aebce5);" />
<text x="75" y="144" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 11px; fill: var(--color-navy-900, #151c3f);">terminal</text>
<line x1="130" y1="140" x2="178" y2="140" style="stroke: var(--color-navy-500, #4a57b4); stroke-dasharray: 4 3;" />
<polygon points="178,135 187,140 178,145" style="fill: var(--color-navy-500, #4a57b4);" />
<rect x="187" y="120" width="95" height="40" style="fill: var(--color-navy-50, #eef1fa); stroke: var(--color-navy-200, #aebce5);" />
<text x="234" y="144" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 11px; fill: var(--color-navy-900, #151c3f);">warehouse</text>
<text x="150" y="224" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 11px; fill: var(--color-navy-500, #4a57b4);">session ends, context gone</text>
<text x="480" y="16" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 12px; font-weight: 600; fill: var(--color-navy-900, #151c3f);">an application, deployed</text>
<rect x="335" y="30" width="290" height="170" style="fill: none; stroke: var(--color-navy-300, #8997d6); stroke-dasharray: 6 4;" />
<text x="480" y="48" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 10px; fill: var(--color-navy-500, #4a57b4);">your cloud (AWS / GCP)</text>
<rect x="352" y="62" width="54" height="22" style="fill: var(--color-navy-50, #eef1fa); stroke: var(--color-navy-200, #aebce5);" />
<text x="379" y="77" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 10px; fill: var(--color-navy-900, #151c3f);">embed</text>
<rect x="414" y="62" width="50" height="22" style="fill: var(--color-navy-50, #eef1fa); stroke: var(--color-navy-200, #aebce5);" />
<text x="439" y="77" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 10px; fill: var(--color-navy-900, #151c3f);">evals</text>
<rect x="472" y="62" width="64" height="22" style="fill: var(--color-navy-50, #eef1fa); stroke: var(--color-navy-200, #aebce5);" />
<text x="504" y="77" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 10px; fill: var(--color-navy-900, #151c3f);">observe</text>
<rect x="544" y="62" width="64" height="22" style="fill: var(--color-navy-50, #eef1fa); stroke: var(--color-navy-200, #aebce5);" />
<text x="576" y="77" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 10px; fill: var(--color-navy-900, #151c3f);">ML / API</text>
<rect x="355" y="120" width="130" height="40" style="fill: var(--color-navy-50, #eef1fa); stroke: var(--color-navy-600, #384393); stroke-width: 1.5;" />
<text x="420" y="144" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 11px; fill: var(--color-navy-900, #151c3f);">AnswerLayer</text>
<line x1="494" y1="140" x2="511" y2="140" style="stroke: var(--color-navy-700, #2a3477);" />
<polygon points="494,136 487,140 494,144" style="fill: var(--color-navy-700, #2a3477);" />
<polygon points="511,136 518,140 511,144" style="fill: var(--color-navy-700, #2a3477);" />
<rect x="520" y="120" width="90" height="40" style="fill: var(--color-navy-50, #eef1fa); stroke: var(--color-navy-200, #aebce5);" />
<text x="565" y="144" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 11px; fill: var(--color-navy-900, #151c3f);">warehouse</text>
<text x="480" y="224" text-anchor="middle" style="font-family: var(--font-mono, monospace); font-size: 11px; fill: var(--color-navy-500, #4a57b4);">persists: definitions, evals, history</text>
</svg>
<figcaption style="font-size: 0.85rem; opacity: 0.7; margin-top: 0.5rem;">One engine, two delivery vehicles. The capabilities on the right exist because something is still running after the question is answered.</figcaption>
</figure>

A skill's context ends when the session ends. An application that runs continuously next to the warehouse accumulates state, and several capabilities follow from that:

- **Embedding.** Anthropic's analytics answer questions for Anthropic employees. AnswerLayer embeds in our customers' products, so the questions get answered for their users, and the metrics that move are the customer's retention and revenue rather than an internal productivity stat. That requires a deployed surface with auth and an API.
- **A managed eval engine.** The post describes the data team maintaining eval cases manually, alongside the system. A standing application can hold those cases as managed objects: versioned, owned, run on a schedule, with results stored per model and configuration. This is standard data-science methodology, and as far as I can tell no vertical AI product ships it. It's the same instinct that produced [Semiosis](https://github.com/AnswerLayer/semiosis): measurement belongs inside the system.
- **Warehouse observability.** Running continuously next to the warehouse gives AnswerLayer a stable longitudinal view of query latency and performance that a session-scoped skill cannot collect. At least one customer is already asking for this, and optimization follows once you can observe.
- **Curation as a service.** The post's emphasis on curation validates how we've built, and it quietly assumes a data team with capacity to curate. Most companies have no such team, or have one that's badly stretched. We supply the curation: forward-deployed engineers who build and refine the semantic layer with the customer. Anthropic demonstrated that curation is essential. We don't assume customers can staff it.
- **A substrate for classical ML.** A governed semantic layer behind an API is also the right foundation for segmentation and forecasting models, served as stable, inspectable outputs. That pattern absorbs what were separate product categories a few years ago: the feature store and much of the MLOps stack. The semantic layer was the missing shared definition layer underneath both.

None of this is a criticism of the Anthropic post. They built the engine because no product handed it to them, and they didn't need the rest because they have exactly one customer. Everyone else has the opposite problem. The engine is necessary and not sufficient, and the distance between the two is the product.

## The honest version

I want to be careful not to overclaim. Anthropic reported accuracy numbers from a production system serving a real organization at scale. We measure the same effects and run the same kind of ablations, and we're building toward the same bar, but I'm not going to wave an equivalent number back. Their post is evidence for the thesis rather than a scoreboard to argue with.

What the write-up demonstrates is that accurate self-service analytics is a data-foundations problem. The model improved over the period they describe, and they pruned scaffolding as it did, but the model was never the limiting factor. The limiting factor was structure: governance, definitions, the unglamorous work of deciding what "revenue" actually means.

Anthropic staffed the manual steering required to build that structure. Almost nobody else can, which is a large part of why AnswerLayer exists. The structure is the same whether a team steers Claude through authoring it or a product generates it for curation, and the same whether you maintain it with CI hooks or regenerate it from the data. They proved the architecture on their own warehouse. We're making it something you can point at yours.
