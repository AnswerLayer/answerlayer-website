# Copy Review Progress

## Reviewed Pages

### 1. Home (`/discover/home.md`)
- **Status:** Approved with changes
- **Title:** "DATA LANGUAGE FOR DATA CULTURE" (all caps)
- **Changes:** Rewrote body copy — institutional knowledge framing, bottleneck problem, consistent answers

### 2. Branch Root (`/discover/branch-root.md`)
- **Status:** Approved with changes
- **Title:** "Discovering AnswerLayer"
- **Changes:** Removed FAQ option to match "two ways" copy
- **Commit:** d5298f1

### 3. Path Build (`/discover/path-build.md`)
- **Status:** Approved (no changes)
- **Title:** "Building semantic layers"

### 4. Build Evaluate (`/discover/build-evaluate.md`)
- **Status:** Approved with changes
- **Title:** "Evaluation and pricing"
- **Changes:** Removed per-user billing, positioned enterprise/BYOC as default

### 5. Build Generation (`/discover/build-generation.md`)
- **Status:** Approved with changes
- **Title:** "How semantic layer generation works"
- **Changes:** Removed database list, added document linking, added interactive/automatic modes, removed PII option, added object model option

### 6. Build Object Model (`/discover/build-object-model.md`)
- **Status:** Created
- **Title:** "The semantic layer object model"
- **Notes:** New page describing entities, measures, metrics, dimensions, filters

### 7. Build Security (`/discover/build-security.md`)
- **Status:** Approved with changes
- **Title:** "Security architecture"
- **Changes:** Removed "not an add-on"

### 8. Build VPC (`/discover/build-vpc.md`)
- **Status:** Approved with changes
- **Title:** "VPC deployment"
- **Changes:** Added BYOC link, updated to ECS/EKS for AWS, GKE/Cloud Run for GCP, removed Azure, added contact option, removed deployment process option (moved to cloud provider pages)

### 9. Build AWS (`/discover/build-aws.md`)
- **Status:** Approved with changes
- **Title:** "AWS deployment"
- **Changes:** Updated compute to "ECS or EKS"

### 10. Build GCP (`/discover/build-gcp.md`)
- **Status:** Approved with changes
- **Title:** "GCP deployment"
- **Changes:** Updated compute to "GKE or Cloud Run"

### 11. Build Compliance (`/discover/build-compliance.md`)
- **Status:** Approved with changes
- **Title:** "Compliance and data sovereignty"
- **Changes:** Lead with data sovereignty, added IAM monitoring, restructured to "Security foundations" and "In progress"

### 12. FAQ Security (`/discover/faq-security.md`)
- **Status:** Approved with changes
- **Title:** "Security questions"
- **Changes:** Removed Azure, fixed SOC 2 (was wrongly claiming certified), added sovereignty messaging

### 13. Trust Page (`/src/pages/trust.astro`)
- **Status:** Approved with changes
- **Changes:**
  - Removed Azure (AWS/GCP only)
  - SOC 2 now "in progress"
  - Added sovereignty to subtitle
  - 7 cards linked to discover pages
  - Removed PII Detection and Query Guardrails cards (orphaned pages)
  - Added Shared Responsibility and Traces/Observability cards

### 14. Build Credentials (`/discover/build-credentials.md`)
- **Status:** Approved with changes
- **Title:** "Credential handling"
- **Changes:** Simplified to reflect BYOC reality — credentials stay in customer infrastructure, we don't handle them

### 15. Build Cloud Choice (`/discover/build-cloud-choice.md`)
- **Status:** Approved with changes
- **Title:** "Cloud provider options"
- **Changes:** Removed Azure, updated compute options (ECS/EKS for AWS, GKE/Cloud Run for GCP), removed database list

### 16. Build Deployment Process (`/discover/build-deployment-process.md`)
- **Status:** Orphaned
- **Title:** "Deployment process"
- **Notes:** Removed links from build-aws and build-gcp; page needs timeline/process review before reintegration

### 17. Path Access (`/discover/path-access.md`)
- **Status:** Approved with changes
- **Title:** "Accessing data through natural language"
- **Changes:** Refined opening — "information you need to answer important questions", added "institutional knowledge" framing, changed "Try it out" to "Evaluate for purchase"

### 18. Access How (`/discover/access-how.md`)
- **Status:** Approved with changes
- **Title:** "The semantic layer"
- **Changes:** Complete rewrite — intro to semantic layers, synonyms (ontology, context graph, data dictionary, knowledge base), institutional knowledge framing

### 19. Access Generation (`/discover/access-generation.md`)
- **Status:** Approved with changes
- **Title:** "Capturing institutional knowledge"
- **Changes:** Reframed from autonomous to collaborative; interactive capture, synonyms/terminology, temporal annotations, continuous updates

### 20. Access Integrations (`/discover/access-integrations.md`)
- **Status:** Created
- **Title:** "Data integrations"
- **Notes:** New page — data sources (no ETL), context sources (Notion, Jira, etc. possible), get in touch CTA

### 21. Access Evaluate (`/discover/access-evaluate.md`)
- **Status:** Created
- **Title:** "Evaluate for purchase"
- **Notes:** New page — pilot program, time to value, success metrics

### 22. Access Curation (`/discover/access-curation.md`)
- **Status:** Approved with changes
- **Title:** "Governance"
- **Changes:** Reframed as governance — ownership, conflict resolution, approval workflows, audit trail

### 23. Access Who Curates (`/discover/access-who-curates.md`)
- **Status:** Approved with changes
- **Title:** "Who governs definitions?"
- **Changes:** Updated title to match governance framing

### 24. Branch Root (`/discover/branch-root.md`)
- **Status:** Approved with changes
- **Changes:** "Query databases" → "Get answers"

### 25. Build Credentials (`/discover/build-credentials.md`)
- **Status:** Updated
- **Changes:** Fixed duplicate build-security link → external-trust

### 26. Access Security (`/discover/access-security.md`)
- **Status:** Approved with changes
- **Title:** "Security and trust"
- **Changes:** "never leave your cloud" (was "never leave the cloud")

---

### 27. Build Reasoning (`/discover/build-reasoning.md`)
- **Status:** Approved with changes
- **Title:** "Traces and observability"
- **Changes:** Removed DSPy/chain-of-thought mentions, focused on observability for auditing/debugging/review

### 28. Build Curation (`/discover/build-curation.md`)
- **Status:** Approved with changes
- **Title:** "Curating the semantic layer"
- **Changes:** Simplified to key capabilities (lock, approve, preserve), NLP acceleration message

### 29. Build Sampling (`/discover/build-sampling.md`)
- **Status:** Approved (no changes)
- **Title:** "Data sampling analysis"
- **Notes:** Reorganized as child of build-reasoning

### 30. Access Shared Responsibility (`/discover/access-shared-responsibility.md`)
- **Status:** Created
- **Title:** "Shared responsibility"
- **Notes:** New page under access-security explaining BYOC security partnership model

### 31. Architecture Page (`/src/pages/architecture.astro`)
- **Status:** Approved with changes
- **Changes:**
  - Removed System Architecture card (orphaned page)
  - Removed Chain-of-Thought card (outdated DSPy references)
  - Removed Query Guardrails card (orphaned page)
  - Added Object Model card
  - Added VPC Deployment card
  - 5 cards total, all linked to connected discover pages

### 32. Path Build (`/discover/path-build.md`)
- **Status:** Approved with changes
- **Title:** "Building semantic layers"
- **Changes:** Replaced copy with maintenance problem content (competitors, months of YAML, bottleneck)

### 33. Path Access (`/discover/path-access.md`)
- **Status:** Approved with changes
- **Title:** "Accessing data through natural language"
- **Changes:** Replaced copy with alignment problem content (tribal knowledge, misalignment, AI hallucination)

### 34. About Page (`/src/pages/about.astro`)
- **Status:** Approved with changes
- **Changes:**
  - Updated Build card copy (institutional knowledge framing)
  - Updated Access card copy (consistent answers, no waiting)
  - Vision, Backing, Supporting Cast remain static

---

## Deleted Pages
- build-deployment (redundant with BYOC positioning)
- build-problem (merged into path-build)
- access-alignment (merged into path-access)

## Orphaned Pages
- access-maintenance
- access-pii
- access-examples
- access-guardrails
- build-pii
- build-deployment-process
- build-azure
- build-collaboration
- build-confidence
- build-validation
- build-versioning
- 28 additional pages (bulk orphaned — options cleared)

---

### 35. External Links Added to Discover Pages
- **Status:** Complete
- **Changes:** Added external links (demo, contact, pricing, architecture, customers) to 17 discover pages with fewer than 4 options
- **Label variations:** Contextual labels instead of repetitive "Book a call" / "View architecture"
  - Demo: "Talk to us", "Schedule a call", "See a demo", "Request a demo", "See it in action"
  - Contact: "Request an integration", "Questions?", "Discuss deployment", "Need help?"
  - Architecture: "How it all connects", "Technical deep-dive", "System overview"

### 36. Layout and Spacing Cleanup
- **Status:** Complete
- **Changes:**
  - Centralized 2rem header-to-content spacing in Layout.astro (main element)
  - Removed inline `padding-top: 2rem` from 10 static pages
  - Removed `padding-top: 2rem` from discover page component CSS
  - Removed unused `.page-spacer` div from Layout.astro
  - Fixed home routing: Back buttons now go to `/` instead of `/discover`
  - Refactored duplicate URL logic in discover page to use `getOptionUrl()`

---

## Review Complete
25 connected content pages reviewed and approved.
