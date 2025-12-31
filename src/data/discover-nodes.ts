/**
 * Discovery Wizard Content Tree
 *
 * Each node represents a screen in the wizard.
 * Options use active verbs leading the user onward.
 * No personal pronouns - anonymous discovery experience.
 */

export interface DiscoverNode {
  id: string;
  title: string;
  content: string;
  options: {
    label: string;
    target: string;
  }[];
}

export const nodes: Record<string, DiscoverNode> = {
  // ============================================
  // ROOT
  // ============================================

  "home": {
    id: "home",
    title: "A shared language for your data",
    content: `AnswerLayer generates a semantic layer from any database. A semantic layer is a business ontology—a concept map that humans and AI can navigate together. It aligns organizations with their data through shared definitions. Entities, metrics, dimensions, and relationships are created automatically by analyzing actual data, not just schema.

The result: consistent answers, confident decisions, and a data culture where everyone speaks the same language.`,
    options: [
      { label: "Continue", target: "branch-root" }
    ]
  },

  "branch-root": {
    id: "branch-root",
    title: "Discovering AnswerLayer",
    content: `AnswerLayer bridges the gap between raw databases and meaningful business questions. There are two ways to approach this.`,
    options: [
      { label: "Build data definitions", target: "path-build" },
      { label: "Query databases", target: "path-access" },
      { label: "Back", target: "external-home" }
    ]
  },

  // ============================================
  // PATH A: BUILD DATA DEFINITIONS
  // ============================================

  "path-build": {
    id: "path-build",
    title: "Building semantic layers",
    content: `Semantic layers define the business meaning of data. They map database tables to business concepts—turning \`cust_id\` into "Customer" and \`SUM(amount)\` into "Revenue." Traditional semantic layers require extensive YAML configuration and ongoing maintenance.`,
    options: [
      { label: "Understand the problem", target: "build-problem" },
      { label: "See how generation works", target: "build-generation" },
      { label: "Review security model", target: "build-security" },
      { label: "Evaluate for purchase", target: "build-evaluate" },
      { label: "Contribute to the project", target: "build-contribute" },
      { label: "Back", target: "branch-root" }
    ]
  },

  "build-problem": {
    id: "build-problem",
    title: "The semantic layer maintenance problem",
    content: `Traditional semantic layers (dbt Semantic Layer, Cube, LookML, AtScale) require:

• Hundreds of lines of YAML or configuration code
• Manual mapping of every table, column, and relationship
• Metric definitions written one by one with exact SQL expressions
• Constant maintenance as schemas evolve

This means weeks of upfront work. Every schema migration risks breaking definitions. Every new metric requires a pull request. The semantic layer becomes a bottleneck instead of an accelerator.`,
    options: [
      { label: "See how generation solves this", target: "build-generation" },
      { label: "Read technical deep-dive", target: "build-problem-technical" },
      { label: "Compare to existing tools", target: "build-problem-compare" },
      { label: "Back", target: "path-build" }
    ]
  },

  "build-problem-technical": {
    id: "build-problem-technical",
    title: "Technical debt in semantic layers",
    content: `The core issue is that semantic layers are hand-crafted artifacts in a world of automated infrastructure. Database schemas are managed by migrations. Application code has CI/CD. But semantic layers? Manual YAML, manual testing, manual deployment.

When a column is renamed in the database, the semantic layer silently breaks. When a new table is added, someone has to remember to model it. When business definitions change, finding all affected metrics requires searching through configuration files.

AnswerLayer treats semantic layer generation as a first-class automated process.`,
    options: [
      { label: "See the generation process", target: "build-generation" },
      { label: "Understand the architecture", target: "build-architecture" },
      { label: "Back", target: "build-problem" }
    ]
  },

  "build-problem-compare": {
    id: "build-problem-compare",
    title: "Comparison with existing tools",
    content: `| Aspect | Traditional Tools | AnswerLayer |
|--------|-------------------|-------------|
| Initial setup | Weeks of configuration | Minutes of generation |
| Schema changes | Manual updates required | Re-generation with diff review |
| New metrics | Write YAML, test, deploy | Suggest or generate, approve |
| PII handling | Manual tagging | AI detection with override |
| Business context | Comments in config files | First-class semantic metadata |

The fundamental difference: traditional tools require humans to translate business knowledge into configuration. AnswerLayer generates configuration from data analysis, with humans curating the result.`,
    options: [
      { label: "See generation in action", target: "build-generation" },
      { label: "Review security considerations", target: "build-security" },
      { label: "Evaluate pricing", target: "build-evaluate" },
      { label: "Back", target: "build-problem" }
    ]
  },

  "build-generation": {
    id: "build-generation",
    title: "How semantic layer generation works",
    content: `AnswerLayer analyzes actual data, not just schema metadata. The process:

1. **Connect** — PostgreSQL, BigQuery, Snowflake, MySQL, Athena, or any SQL database
2. **Sample** — Statistical sampling of data values to understand distributions and types
3. **Analyze** — Chain-of-thought reasoning identifies entities, relationships, and business meaning
4. **Generate** — Complete semantic model with entities, metrics, dimensions, filters
5. **Curate** — Human review and refinement of generated definitions`,
    options: [
      { label: "Examine data sampling", target: "build-sampling" },
      { label: "Understand chain-of-thought reasoning", target: "build-reasoning" },
      { label: "See PII detection", target: "build-pii" },
      { label: "Review query validation", target: "build-validation" },
      { label: "Back", target: "path-build" }
    ]
  },

  "build-sampling": {
    id: "build-sampling",
    title: "Data sampling analysis",
    content: `Schema metadata alone cannot reveal business meaning. A column named \`status\` could contain order states, customer segments, or approval workflows. AnswerLayer samples actual data to understand:

• **Statistical distributions** — Cardinality, null rates, value frequencies
• **Data types** — Beyond declared types to actual content patterns
• **Relationships** — Foreign key patterns even when not declared
• **Business context** — Naming patterns, value semantics, temporal patterns

Sampling is configurable. Data never leaves the database—analysis happens through queries, not data export.`,
    options: [
      { label: "See chain-of-thought reasoning", target: "build-reasoning" },
      { label: "Review security model", target: "build-security" },
      { label: "Back", target: "build-generation" }
    ]
  },

  "build-reasoning": {
    id: "build-reasoning",
    title: "Chain-of-thought semantic analysis",
    content: `Built on DSPy, the generation process uses chain-of-thought prompting to reason through complex schemas. Each decision is logged with:

• **Confidence score** — How certain the analysis is about each inference
• **Reasoning trace** — The logical steps that led to the conclusion
• **Alternative interpretations** — Other possible meanings considered

Low-confidence inferences are flagged for human review. High-confidence inferences can be auto-approved. The threshold is configurable per organization.

Example reasoning trace:
\`\`\`
Column: cust_id (integer)
- High cardinality (50,000+ unique values)
- Referenced by orders.customer_id, support_tickets.cust_id
- Values are sequential integers
→ Inference: Primary key for Customer entity (confidence: 0.94)
\`\`\``,
    options: [
      { label: "See PII detection", target: "build-pii" },
      { label: "Understand confidence calibration", target: "build-confidence" },
      { label: "Back", target: "build-generation" }
    ]
  },

  "build-confidence": {
    id: "build-confidence",
    title: "Confidence calibration",
    content: `Confidence scores are calibrated against human judgments. When reviewers override AI inferences, the feedback improves future generations. Over time, the system learns organization-specific patterns:

• Internal naming conventions
• Business-specific terminology
• Domain-specific relationships

This creates a feedback loop: the more the semantic layer is curated, the better future generations become.`,
    options: [
      { label: "See the curation workflow", target: "build-curation" },
      { label: "Review PII detection", target: "build-pii" },
      { label: "Back", target: "build-reasoning" }
    ]
  },

  "build-pii": {
    id: "build-pii",
    title: "PII detection",
    content: `AI-powered detection scans columns for personally identifiable information:

• **Pattern matching** — Email formats, phone numbers, SSN patterns
• **Semantic analysis** — Column names suggesting personal data
• **Value sampling** — Actual data patterns indicating PII
• **Confidence scoring** — Each detection has a confidence level

Detected PII is flagged with options:
• **Block** — Column excluded from queries entirely
• **Mask** — Column available but values redacted
• **Allow** — Override detection (with audit trail)
• **Review** — Flag for human decision

All PII decisions are logged for compliance.`,
    options: [
      { label: "See query validation", target: "build-validation" },
      { label: "Review security architecture", target: "build-security" },
      { label: "Back", target: "build-generation" }
    ]
  },

  "build-validation": {
    id: "build-validation",
    title: "Query validation and guardrails",
    content: `Generated SQL is validated before execution:

• **Schema validation** — Query references only existing tables and columns
• **Operation filtering** — DROP, DELETE, TRUNCATE, ALTER blocked by default
• **Row limits** — Maximum result set size prevents runaway queries
• **Timeout protection** — Long-running queries are terminated
• **Cost estimation** — For cloud warehouses, estimated cost shown before execution

Guardrails are configurable per role. Analysts might have stricter limits than data engineers.`,
    options: [
      { label: "Review full security model", target: "build-security" },
      { label: "See deployment options", target: "build-deployment" },
      { label: "Back", target: "build-generation" }
    ]
  },

  "build-curation": {
    id: "build-curation",
    title: "Curating the semantic layer",
    content: `Generation provides a starting point. Curation makes it accurate. The curation workflow:

• **Review generated entities** — Confirm or rename business objects
• **Adjust relationships** — Fix incorrectly inferred joins
• **Refine metrics** — Edit SQL expressions, add business rules
• **Lock definitions** — Mark curated items as authoritative
• **Add context** — Business descriptions, ownership, documentation links

Locked definitions are preserved across re-generations. New schema elements generate new suggestions without overwriting curated work.`,
    options: [
      { label: "See version control integration", target: "build-versioning" },
      { label: "Understand collaboration features", target: "build-collaboration" },
      { label: "Back", target: "build-confidence" }
    ]
  },

  "build-versioning": {
    id: "build-versioning",
    title: "Version control and change management",
    content: `Semantic layer changes are tracked:

• **Diff view** — See what changed between generations
• **Approval workflow** — Changes require review before activation
• **Rollback** — Revert to previous versions instantly
• **Audit trail** — Who changed what, when, and why

Integration with git workflows is optional. The semantic layer can be exported as configuration files for version control, or managed entirely within AnswerLayer.`,
    options: [
      { label: "Review deployment options", target: "build-deployment" },
      { label: "See collaboration features", target: "build-collaboration" },
      { label: "Back", target: "build-curation" }
    ]
  },

  "build-collaboration": {
    id: "build-collaboration",
    title: "Team collaboration",
    content: `Semantic layers are shared artifacts. Collaboration features:

• **Role-based access** — Different permissions for different team members
• **Comments and discussions** — Threaded conversations on definitions
• **Change requests** — Propose modifications without direct edit access
• **Notifications** — Alerts when relevant definitions change

The goal: treat the semantic layer as a living document that the whole data team owns.`,
    options: [
      { label: "Review security and access control", target: "build-security" },
      { label: "See deployment architecture", target: "build-deployment" },
      { label: "Back", target: "build-curation" }
    ]
  },

  "build-architecture": {
    id: "build-architecture",
    title: "System architecture",
    content: `AnswerLayer is designed for enterprise deployment:

• **Query engine** — Translates natural language to SQL using the semantic layer
• **Semantic store** — Persists entities, metrics, dimensions, relationships
• **Generation service** — Analyzes databases and produces semantic models
• **API layer** — REST and GraphQL interfaces for integration

All components are stateless and horizontally scalable. The semantic store uses PostgreSQL. Generation uses Claude for reasoning.`,
    options: [
      { label: "See deployment options", target: "build-deployment" },
      { label: "Review security model", target: "build-security" },
      { label: "Evaluate pricing", target: "build-evaluate" },
      { label: "Back", target: "build-problem-technical" }
    ]
  },

  "build-security": {
    id: "build-security",
    title: "Security architecture",
    content: `Security is foundational, not an add-on:

• **VPC deployment** — Runs in customer infrastructure
• **Credential encryption** — Database credentials encrypted at rest and in transit
• **No data export** — Analysis happens through queries; raw data never leaves the database
• **Query logging** — Full audit trail of all executed queries
• **Role-based access** — Fine-grained permissions at entity and column level`,
    options: [
      { label: "See VPC deployment details", target: "build-vpc" },
      { label: "Review compliance certifications", target: "build-compliance" },
      { label: "Understand credential handling", target: "build-credentials" },
      { label: "Back", target: "path-build" }
    ]
  },

  "build-vpc": {
    id: "build-vpc",
    title: "VPC deployment",
    content: `AnswerLayer deploys within customer cloud infrastructure:

• **AWS** — EKS deployment with VPC peering or PrivateLink
• **GCP** — GKE deployment with VPC peering or Private Service Connect
• **Azure** — AKS deployment with VNet peering or Private Endpoints

No data transits public internet. The AnswerLayer control plane communicates with customer deployments through secure channels. Database credentials remain within customer infrastructure.`,
    options: [
      { label: "Choose cloud provider", target: "build-cloud-choice" },
      { label: "Review compliance", target: "build-compliance" },
      { label: "See deployment process", target: "build-deployment-process" },
      { label: "Back", target: "build-security" }
    ]
  },

  "build-cloud-choice": {
    id: "build-cloud-choice",
    title: "Cloud provider options",
    content: `Deployment is supported on:

| Provider | Compute | Database Support |
|----------|---------|------------------|
| AWS | EKS | RDS, Redshift, Athena |
| GCP | GKE | Cloud SQL, BigQuery |
| Azure | AKS | Azure SQL, Synapse |

Multi-cloud configurations are possible for organizations with databases across providers. Each deployment connects to databases in its region.`,
    options: [
      { label: "See AWS deployment", target: "build-aws" },
      { label: "See GCP deployment", target: "build-gcp" },
      { label: "See Azure deployment", target: "build-azure" },
      { label: "Back", target: "build-vpc" }
    ]
  },

  "build-aws": {
    id: "build-aws",
    title: "AWS deployment",
    content: `AWS deployment uses EKS with the following architecture:

• **VPC** — Dedicated or shared VPC with private subnets
• **EKS** — Managed Kubernetes for compute
• **RDS** — PostgreSQL for semantic store
• **Secrets Manager** — Database credential storage
• **CloudWatch** — Logging and monitoring

Terraform modules provided for infrastructure provisioning. Helm charts for application deployment.`,
    options: [
      { label: "Review Terraform modules", target: "external-terraform" },
      { label: "See deployment process", target: "build-deployment-process" },
      { label: "Back", target: "build-cloud-choice" }
    ]
  },

  "build-gcp": {
    id: "build-gcp",
    title: "GCP deployment",
    content: `GCP deployment uses GKE with the following architecture:

• **VPC** — Dedicated or shared VPC with private subnets
• **GKE** — Managed Kubernetes for compute
• **Cloud SQL** — PostgreSQL for semantic store
• **Secret Manager** — Database credential storage
• **Cloud Logging** — Centralized logging

Terraform modules provided for infrastructure provisioning. Helm charts for application deployment.`,
    options: [
      { label: "Review Terraform modules", target: "external-terraform" },
      { label: "See deployment process", target: "build-deployment-process" },
      { label: "Back", target: "build-cloud-choice" }
    ]
  },

  "build-azure": {
    id: "build-azure",
    title: "Azure deployment",
    content: `Azure deployment uses AKS with the following architecture:

• **VNet** — Dedicated or shared virtual network with private subnets
• **AKS** — Managed Kubernetes for compute
• **Azure Database for PostgreSQL** — Semantic store
• **Key Vault** — Database credential storage
• **Azure Monitor** — Logging and monitoring

Terraform modules provided for infrastructure provisioning. Helm charts for application deployment.`,
    options: [
      { label: "Review Terraform modules", target: "external-terraform" },
      { label: "See deployment process", target: "build-deployment-process" },
      { label: "Back", target: "build-cloud-choice" }
    ]
  },

  "build-deployment": {
    id: "build-deployment",
    title: "Deployment options",
    content: `Two deployment models:

**Self-hosted (VPC)**
• Full control over infrastructure
• Data never leaves the network
• Customer manages updates and scaling

**Managed**
• AnswerLayer operates the infrastructure
• Automatic updates and scaling
• Data still isolated per customer

Both models use the same codebase. Switching between them is possible.`,
    options: [
      { label: "See VPC details", target: "build-vpc" },
      { label: "Review deployment process", target: "build-deployment-process" },
      { label: "Back", target: "build-validation" }
    ]
  },

  "build-deployment-process": {
    id: "build-deployment-process",
    title: "Deployment process",
    content: `Typical deployment timeline:

1. **Day 1** — Infrastructure provisioning (Terraform)
2. **Day 1** — Application deployment (Helm)
3. **Day 1-2** — Database connection configuration
4. **Day 2** — Initial semantic layer generation
5. **Day 2-5** — Curation and refinement
6. **Day 5+** — Production use

Most deployments are operational within a week. Complex schemas or extensive curation requirements may extend the timeline.`,
    options: [
      { label: "Review pricing", target: "build-evaluate" },
      { label: "Schedule deployment", target: "external-demo" },
      { label: "Back", target: "build-vpc" }
    ]
  },

  "build-compliance": {
    id: "build-compliance",
    title: "Compliance and certifications",
    content: `AnswerLayer maintains:

• **SOC 2 Type II** — Annual audit of security controls
• **GDPR compliance** — Data processing agreements available
• **HIPAA compatibility** — BAA available for healthcare deployments

The VPC deployment model simplifies compliance—customer data remains in customer infrastructure under customer controls.`,
    options: [
      { label: "Visit Trust Centre", target: "external-trust" },
      { label: "Review security architecture", target: "build-security" },
      { label: "Back", target: "build-vpc" }
    ]
  },

  "build-credentials": {
    id: "build-credentials",
    title: "Credential handling",
    content: `Database credentials are handled with defense in depth:

• **Encryption at rest** — AES-256 encryption in customer secret store
• **Encryption in transit** — TLS 1.3 for all connections
• **No persistence** — Credentials loaded into memory only when needed
• **Rotation support** — Credential rotation without downtime
• **Audit logging** — All credential access logged

Credentials never transit AnswerLayer infrastructure. They remain within customer cloud.`,
    options: [
      { label: "Review full security model", target: "build-security" },
      { label: "See compliance certifications", target: "build-compliance" },
      { label: "Back", target: "build-security" }
    ]
  },

  "build-evaluate": {
    id: "build-evaluate",
    title: "Evaluation and pricing",
    content: `Pricing is based on:

• **Deployment type** — Self-hosted vs. managed
• **Query volume** — Monthly natural language queries
• **Users** — Number of active users
• **Support tier** — Standard, priority, or dedicated

Enterprise agreements available for large deployments.`,
    options: [
      { label: "See pricing details", target: "external-pricing" },
      { label: "Request evaluation", target: "external-demo" },
      { label: "Back", target: "path-build" }
    ]
  },

  "build-contribute": {
    id: "build-contribute",
    title: "Contributing to AnswerLayer",
    content: `AnswerLayer has open source components:

• **Query parser** — Natural language to semantic query translation
• **Schema analyzer** — Database introspection and sampling
• **Semantic types** — Type definitions for entities, metrics, dimensions

Contributions welcome in all areas. The core generation logic uses proprietary models, but the surrounding infrastructure is open.`,
    options: [
      { label: "View GitHub repositories", target: "external-github" },
      { label: "Read contribution guidelines", target: "external-contributing" },
      { label: "See open issues", target: "external-issues" },
      { label: "Learn about the team", target: "build-team" },
      { label: "Back", target: "path-build" }
    ]
  },

  "build-team": {
    id: "build-team",
    title: "The team",
    content: `AnswerLayer is built by a team with backgrounds in:

• Data infrastructure at scale
• Natural language processing
• Enterprise software deployment
• Developer tools and DX

The company is venture-backed and growing.`,
    options: [
      { label: "View open positions", target: "external-careers" },
      { label: "Read the blog", target: "external-blog" },
      { label: "Learn about investors", target: "build-investors" },
      { label: "Back", target: "build-contribute" }
    ]
  },

  "build-investors": {
    id: "build-investors",
    title: "Investors and backing",
    content: `AnswerLayer is backed by investors who understand data infrastructure and enterprise software. The company is focused on building a sustainable business through customer value, not just growth metrics.

This information is available for qualified parties.`,
    options: [
      { label: "Request more information", target: "build-investor-request" },
      { label: "Read more about the business", target: "build-business" },
      { label: "Back", target: "build-team" }
    ]
  },

  "build-investor-request": {
    id: "build-investor-request",
    title: "Investor information request",
    content: `For detailed information about AnswerLayer's business, traction, and investment history, a brief qualification process ensures information reaches appropriate parties.`,
    options: [
      { label: "Contact for information", target: "external-contact" },
      { label: "Back", target: "build-investors" }
    ]
  },

  "build-business": {
    id: "build-business",
    title: "Business model and vision",
    content: `The vision: every organization should have a semantic layer. Today, only the most sophisticated data teams can afford the investment. AnswerLayer makes semantic layers accessible to any organization with a database.

The business model: subscription software priced on value delivered. Larger deployments with more queries and more users pay more. Smaller deployments have accessible entry points.

The market: the semantic layer category is emerging. dbt Semantic Layer, Cube, AtScale, and others are validating the need. AnswerLayer differentiates through generation—reducing the barrier to entry from weeks to minutes.`,
    options: [
      { label: "Review pricing", target: "external-pricing" },
      { label: "Contact for partnership", target: "external-contact" },
      { label: "Back", target: "build-investors" }
    ]
  },

  // ============================================
  // PATH B: QUERY DATABASES
  // ============================================

  "path-access": {
    id: "path-access",
    title: "Accessing data through natural language",
    content: `Databases contain answers. Getting those answers typically requires SQL expertise or waiting for someone who has it. AnswerLayer enables natural language questions against any database, with consistent and trustworthy results.`,
    options: [
      { label: "Understand how this works", target: "access-how" },
      { label: "See what problems this solves", target: "access-problems" },
      { label: "Review security and trust", target: "access-security" },
      { label: "Try it out", target: "external-demo" },
      { label: "Back", target: "branch-root" }
    ]
  },

  "access-how": {
    id: "access-how",
    title: "How natural language querying works",
    content: `The process:

1. **Question** — Ask in plain English: "What was revenue last quarter by region?"
2. **Translation** — AnswerLayer translates to SQL using the semantic layer
3. **Validation** — Query is checked against guardrails before execution
4. **Execution** — SQL runs against the database
5. **Response** — Results returned with explanation of how they were computed

The semantic layer is the key. Without it, AI models hallucinate column names and invent relationships. With it, queries are grounded in actual database structure.`,
    options: [
      { label: "Learn about semantic layers", target: "access-semantic" },
      { label: "See query examples", target: "access-examples" },
      { label: "Understand guardrails", target: "access-guardrails" },
      { label: "Back", target: "path-access" }
    ]
  },

  "access-semantic": {
    id: "access-semantic",
    title: "What is a semantic layer?",
    content: `A semantic layer is a map between business concepts and database structures.

| Business concept | Database reality |
|------------------|------------------|
| Customer | \`customers\` table |
| Revenue | \`SUM(orders.amount) WHERE orders.status = 'completed'\` |
| Region | \`customers.region_code\` joined to \`regions.name\` |
| Last quarter | \`date BETWEEN '2024-10-01' AND '2024-12-31'\` |

Without this map, "What was revenue?" is ambiguous. Which table? Which column? What filters? With the semantic layer, there is one definition of revenue that everyone uses.`,
    options: [
      { label: "See why this matters", target: "access-alignment" },
      { label: "Learn how it gets created", target: "access-generation" },
      { label: "Back", target: "access-how" }
    ]
  },

  "access-alignment": {
    id: "access-alignment",
    title: "The alignment problem",
    content: `Organizations suffer from data misalignment:

• **Different teams pull different numbers** — Sales says revenue is X, finance says Y
• **Definitions drift over time** — What "active user" means changes but nobody updates the dashboard
• **New hires struggle to find anything** — Tribal knowledge locked in senior employees' heads
• **AI tools hallucinate** — ChatGPT invents plausible-sounding but wrong queries

The semantic layer creates alignment. One definition. One source of truth. Every question answered consistently.

The result: confident decisions, faster onboarding, and AI that actually works.`,
    options: [
      { label: "See how AnswerLayer helps", target: "access-solution" },
      { label: "Read about data culture", target: "access-culture" },
      { label: "Back", target: "access-semantic" }
    ]
  },

  "access-culture": {
    id: "access-culture",
    title: "Data culture",
    content: `Data culture is how an organization relates to its information. Strong data culture means:

• **Shared language** — Everyone uses the same terms with the same meanings
• **Self-service** — People answer their own questions without waiting
• **Trust** — Numbers are believed because definitions are transparent
• **Iteration** — Easy to ask follow-up questions and explore

The semantic layer is infrastructure for data culture. It makes the implicit explicit. It turns tribal knowledge into shared knowledge.

Organizations with strong data culture make better decisions faster. They have higher revenue per employee because information flows efficiently.`,
    options: [
      { label: "See how to build this", target: "access-solution" },
      { label: "Learn about AnswerLayer's approach", target: "access-generation" },
      { label: "Back", target: "access-alignment" }
    ]
  },

  "access-solution": {
    id: "access-solution",
    title: "How AnswerLayer creates alignment",
    content: `AnswerLayer approaches alignment through automation:

1. **Generate** — AI analyzes the database and creates initial definitions
2. **Curate** — Domain experts review and refine
3. **Share** — Everyone queries through the same semantic layer
4. **Evolve** — As the business changes, definitions update

The key insight: alignment requires shared definitions, but creating definitions from scratch is too much work. Generation provides the starting point. Curation ensures accuracy. Sharing creates the culture.`,
    options: [
      { label: "See generation in detail", target: "access-generation" },
      { label: "Try the product", target: "external-demo" },
      { label: "Review pricing", target: "external-pricing" },
      { label: "Back", target: "access-alignment" }
    ]
  },

  "access-generation": {
    id: "access-generation",
    title: "Automatic semantic layer generation",
    content: `Traditional semantic layers require weeks of manual configuration. AnswerLayer generates a complete semantic model in minutes:

• **Entities identified** — Customer, Order, Product, Employee
• **Metrics defined** — Revenue, Churn Rate, Average Order Value
• **Dimensions created** — Region, Category, Time Period
• **Relationships mapped** — How tables connect

Generation analyzes actual data, not just schema metadata. This reveals business meaning that schema alone cannot show.`,
    options: [
      { label: "See technical details", target: "build-generation" },
      { label: "Understand the curation process", target: "access-curation" },
      { label: "Back", target: "access-solution" }
    ]
  },

  "access-curation": {
    id: "access-curation",
    title: "Expert curation",
    content: `Generation provides a draft. Experts make it accurate:

• **Review entities** — Confirm the business objects make sense
• **Refine metrics** — Adjust calculations to match business rules
• **Add context** — Descriptions that help users understand what is available
• **Lock definitions** — Mark authoritative definitions that should not change

Curation is where business knowledge enters the system. The AI handles the tedious mapping work. Humans provide the judgment.`,
    options: [
      { label: "See who does curation", target: "access-who-curates" },
      { label: "Learn about ongoing maintenance", target: "access-maintenance" },
      { label: "Back", target: "access-generation" }
    ]
  },

  "access-who-curates": {
    id: "access-who-curates",
    title: "Who curates the semantic layer?",
    content: `Curation is typically done by:

• **Analytics engineers** — Understand both data and business
• **Data analysts** — Know how metrics are actually used
• **Domain experts** — Understand business rules and edge cases

The curation interface requires no code. Point and click to rename, edit, or extend. Technical users can also edit the underlying configuration directly.`,
    options: [
      { label: "Learn about maintenance", target: "access-maintenance" },
      { label: "See the interface", target: "external-demo" },
      { label: "Back", target: "access-curation" }
    ]
  },

  "access-maintenance": {
    id: "access-maintenance",
    title: "Keeping the semantic layer current",
    content: `Databases change. The semantic layer should change with them:

• **Schema changes detected** — New tables and columns flagged for review
• **Re-generation available** — Run generation again to pick up changes
• **Curated definitions preserved** — Locked items survive re-generation
• **Diff review** — See exactly what changed before accepting updates

Maintenance is minimal compared to traditional semantic layers. Instead of updating YAML files, review and approve suggestions.`,
    options: [
      { label: "See technical architecture", target: "build-architecture" },
      { label: "Evaluate pricing", target: "external-pricing" },
      { label: "Back", target: "access-curation" }
    ]
  },

  "access-examples": {
    id: "access-examples",
    title: "Query examples",
    content: `Examples of natural language questions and how they translate:

**"What was revenue last quarter?"**
\`\`\`sql
SELECT SUM(amount)
FROM orders
WHERE status = 'completed'
AND date BETWEEN '2024-10-01' AND '2024-12-31'
\`\`\`

**"Show top 10 customers by lifetime value"**
\`\`\`sql
SELECT c.name, SUM(o.amount) as ltv
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE o.status = 'completed'
GROUP BY c.id, c.name
ORDER BY ltv DESC
LIMIT 10
\`\`\`

**"How has churn changed month over month?"**
\`\`\`sql
SELECT
  DATE_TRUNC('month', churned_at) as month,
  COUNT(*) as churned_customers
FROM customers
WHERE churned_at IS NOT NULL
GROUP BY 1
ORDER BY 1
\`\`\``,
    options: [
      { label: "Try asking questions", target: "external-demo" },
      { label: "See how translation works", target: "access-how" },
      { label: "Back", target: "access-how" }
    ]
  },

  "access-guardrails": {
    id: "access-guardrails",
    title: "Query guardrails",
    content: `Not every query should execute. Guardrails prevent problems:

• **PII filtering** — Sensitive columns blocked or masked
• **Row limits** — Maximum results prevent overwhelming data pulls
• **Timeout protection** — Long queries terminated automatically
• **Cost controls** — For cloud warehouses, cost estimates before execution
• **Operation restrictions** — Only SELECT queries allowed by default

Guardrails are configurable by role. Analysts might have different limits than executives.`,
    options: [
      { label: "Learn about PII protection", target: "access-pii" },
      { label: "See security architecture", target: "access-security" },
      { label: "Back", target: "access-how" }
    ]
  },

  "access-pii": {
    id: "access-pii",
    title: "PII protection",
    content: `Personal data requires special handling:

• **AI detection** — Columns scanned for email, phone, SSN patterns
• **Confidence scoring** — Detection certainty shown for review
• **Flexible controls** — Block, mask, or allow with audit trail
• **Compliance support** — GDPR, HIPAA compatible configurations

PII decisions are logged. Auditors can see who accessed what, when, and why it was allowed.`,
    options: [
      { label: "Review full security model", target: "access-security" },
      { label: "See compliance details", target: "build-compliance" },
      { label: "Back", target: "access-guardrails" }
    ]
  },

  "access-security": {
    id: "access-security",
    title: "Security and trust",
    content: `Data security is non-negotiable:

• **VPC deployment** — AnswerLayer runs in customer infrastructure
• **No data export** — Queries execute against the database; raw data stays put
• **Encrypted credentials** — Database passwords never leave the cloud
• **Audit logging** — Every query recorded for compliance`,
    options: [
      { label: "See deployment details", target: "build-vpc" },
      { label: "Review compliance", target: "build-compliance" },
      { label: "Visit Trust Centre", target: "external-trust" },
      { label: "Back", target: "path-access" }
    ]
  },

  "access-problems": {
    id: "access-problems",
    title: "Problems AnswerLayer solves",
    content: `Common data access frustrations:`,
    options: [
      { label: "Waiting for the data team", target: "access-waiting" },
      { label: "Getting inconsistent numbers", target: "access-inconsistent" },
      { label: "AI tools that hallucinate", target: "access-hallucination" },
      { label: "Complex SQL requirements", target: "access-sql-complexity" },
      { label: "Back", target: "path-access" }
    ]
  },

  "access-waiting": {
    id: "access-waiting",
    title: "Waiting for answers",
    content: `The data team is a bottleneck. Every question joins a queue:

• Simple questions wait behind complex projects
• Context gets lost between request and delivery
• Follow-up questions restart the cycle
• Urgent requests disrupt planned work

Self-service analytics promises to solve this but fails when users cannot write SQL or do not know the schema. AnswerLayer makes self-service actually work by enabling plain language questions.`,
    options: [
      { label: "See how self-service works", target: "access-how" },
      { label: "Try asking questions", target: "external-demo" },
      { label: "Back", target: "access-problems" }
    ]
  },

  "access-inconsistent": {
    id: "access-inconsistent",
    title: "Inconsistent numbers",
    content: `Different people pull different numbers for the same question. Why?

• Different filters (active vs. all customers)
• Different date ranges (fiscal year vs. calendar year)
• Different aggregations (mean vs. median)
• Different data sources (data warehouse vs. production replica)

The semantic layer establishes one definition for each metric. When everyone queries through AnswerLayer, everyone gets the same answer.`,
    options: [
      { label: "Learn about alignment", target: "access-alignment" },
      { label: "See how definitions work", target: "access-semantic" },
      { label: "Back", target: "access-problems" }
    ]
  },

  "access-hallucination": {
    id: "access-hallucination",
    title: "AI hallucination in data queries",
    content: `ChatGPT and similar tools can write SQL, but they hallucinate:

• Invent column names that do not exist
• Assume relationships that are not real
• Apply incorrect business logic
• Produce plausible but wrong results

The problem: LLMs do not know the schema. They guess based on training data.

AnswerLayer grounds AI in the actual semantic layer. The model does not guess—it uses defined entities, metrics, and relationships. Hallucination becomes nearly impossible.`,
    options: [
      { label: "See how grounding works", target: "access-how" },
      { label: "Learn about semantic layers", target: "access-semantic" },
      { label: "Try it out", target: "external-demo" },
      { label: "Back", target: "access-problems" }
    ]
  },

  "access-sql-complexity": {
    id: "access-sql-complexity",
    title: "SQL complexity barrier",
    content: `SQL is powerful but demanding:

• JOIN syntax is unintuitive
• Window functions are arcane
• Date handling varies by database
• Performance tuning requires expertise

Business users should not need SQL to answer business questions. AnswerLayer translates natural language to correct SQL, handling complexity automatically.`,
    options: [
      { label: "See query examples", target: "access-examples" },
      { label: "Try asking questions", target: "external-demo" },
      { label: "Back", target: "access-problems" }
    ]
  },

  // ============================================
  // AI AGENTS
  // ============================================

  "path-agents": {
    id: "path-agents",
    title: "AI agents and the semantic layer",
    content: `AI agents are autonomous software that accomplishes tasks. Agents that need data face a problem: databases are complex, unstructured, and dangerous to query without understanding.

The semantic layer makes databases agent-ready.`,
    options: [
      { label: "Understand the problem", target: "agents-problem" },
      { label: "See integration options", target: "agents-integration" },
      { label: "Back", target: "branch-root" }
    ]
  },

  "agents-problem": {
    id: "agents-problem",
    title: "Why agents need semantic layers",
    content: `Agents without semantic layers:

• **Hallucinate queries** — Invent columns and relationships
• **Expose sensitive data** — No awareness of PII
• **Break things** — Run expensive or destructive queries
• **Produce inconsistent results** — No shared definitions

Agents with semantic layers:

• **Query accurately** — Grounded in real schema
• **Respect privacy** — PII controls enforced
• **Stay safe** — Guardrails prevent damage
• **Deliver consistent answers** — Same definitions as humans`,
    options: [
      { label: "See integration options", target: "agents-integration" },
      { label: "Learn about guardrails", target: "access-guardrails" },
      { label: "Back", target: "path-agents" }
    ]
  },

  "agents-integration": {
    id: "agents-integration",
    title: "Agent integration",
    content: `AnswerLayer provides multiple integration points:

• **REST API** — Standard HTTP interface for any agent framework
• **MCP Server** — Native integration with Model Context Protocol
• **Python SDK** — For agents built in Python
• **TypeScript SDK** — For agents built in JavaScript/TypeScript

Agents authenticate with API keys. Permissions are scoped per key—different agents can have different access levels.`,
    options: [
      { label: "Read API documentation", target: "external-docs" },
      { label: "See MCP integration", target: "agents-mcp" },
      { label: "View SDK examples", target: "external-github" },
      { label: "Back", target: "path-agents" }
    ]
  },

  "agents-mcp": {
    id: "agents-mcp",
    title: "Model Context Protocol integration",
    content: `MCP is an emerging standard for connecting AI models to external systems. AnswerLayer provides an MCP server that exposes:

• **Available entities** — What can be queried
• **Available metrics** — What measurements exist
• **Query tool** — Execute natural language queries
• **Schema tool** — Inspect semantic layer structure

Agents using MCP can discover and use AnswerLayer automatically.`,
    options: [
      { label: "Read MCP documentation", target: "external-docs" },
      { label: "View open source MCP server", target: "external-github" },
      { label: "Back", target: "agents-integration" }
    ]
  },

  // ============================================
  // FAQ
  // ============================================

  "faq-root": {
    id: "faq-root",
    title: "Common questions",
    content: `Frequently asked questions about AnswerLayer.`,
    options: [
      { label: "General questions", target: "faq-general" },
      { label: "Technical questions", target: "faq-technical" },
      { label: "Security questions", target: "faq-security" },
      { label: "Pricing questions", target: "faq-pricing" },
      { label: "Back", target: "home" }
    ]
  },

  "faq-general": {
    id: "faq-general",
    title: "General questions",
    content: `**What is AnswerLayer?**
A platform that generates semantic layers from databases, enabling natural language queries with consistent results.

**What is a semantic layer?**
A mapping between business concepts (like "Revenue") and database structures (like \`SUM(orders.amount)\`).

**How is this different from ChatGPT?**
ChatGPT does not know the schema and hallucinates. AnswerLayer is grounded in the actual database structure.`,
    options: [
      { label: "More questions", target: "faq-technical" },
      { label: "Back", target: "faq-root" }
    ]
  },

  "faq-technical": {
    id: "faq-technical",
    title: "Technical questions",
    content: `**What databases are supported?**
PostgreSQL, MySQL, BigQuery, Snowflake, Redshift, Athena, and any SQL-compatible database.

**How does generation work?**
AI analyzes actual data samples to understand business meaning, then generates entities, metrics, dimensions, and relationships.

**Can the generated semantic layer be edited?**
Yes. Full curation interface for reviewing, editing, and extending generated definitions.

**Does it support joins across tables?**
Yes. Relationships are automatically detected and can be manually refined.`,
    options: [
      { label: "Security questions", target: "faq-security" },
      { label: "Back", target: "faq-root" }
    ]
  },

  "faq-security": {
    id: "faq-security",
    title: "Security questions",
    content: `**Where does AnswerLayer run?**
In customer cloud infrastructure (AWS, GCP, or Azure). VPC deployment is standard.

**Does data leave customer infrastructure?**
No. Queries execute against the database. Raw data is never exported.

**How are database credentials handled?**
Encrypted and stored in the customer's cloud secret manager. Never transmitted to AnswerLayer.

**Is AnswerLayer SOC 2 compliant?**
Yes. SOC 2 Type II certified with annual audits.`,
    options: [
      { label: "Pricing questions", target: "faq-pricing" },
      { label: "Visit Trust Centre", target: "external-trust" },
      { label: "Back", target: "faq-root" }
    ]
  },

  "faq-pricing": {
    id: "faq-pricing",
    title: "Pricing questions",
    content: `**How is AnswerLayer priced?**
Based on deployment type, query volume, number of users, and support tier.

**Is there a free tier?**
Contact for evaluation options.

**What is included in enterprise pricing?**
Custom deployment, priority support, SLAs, and dedicated success management.`,
    options: [
      { label: "See pricing details", target: "external-pricing" },
      { label: "Contact sales", target: "external-demo" },
      { label: "Back", target: "faq-root" }
    ]
  },

  // ============================================
  // EXTERNAL LINKS
  // ============================================

  "external-pricing": {
    id: "external-pricing",
    title: "Pricing",
    content: `Redirecting to pricing page...`,
    options: []
  },

  "external-demo": {
    id: "external-demo",
    title: "Request Demo",
    content: `Redirecting to demo request...`,
    options: []
  },

  "external-trust": {
    id: "external-trust",
    title: "Trust Centre",
    content: `Redirecting to Trust Centre...`,
    options: []
  },

  "external-docs": {
    id: "external-docs",
    title: "Documentation",
    content: `Redirecting to documentation...`,
    options: []
  },

  "external-github": {
    id: "external-github",
    title: "GitHub",
    content: `Redirecting to GitHub...`,
    options: []
  },

  "external-blog": {
    id: "external-blog",
    title: "Blog",
    content: `Redirecting to blog...`,
    options: []
  },

  "external-terraform": {
    id: "external-terraform",
    title: "Terraform Modules",
    content: `Redirecting to Terraform documentation...`,
    options: []
  },

  "external-contributing": {
    id: "external-contributing",
    title: "Contributing",
    content: `Redirecting to contribution guidelines...`,
    options: []
  },

  "external-issues": {
    id: "external-issues",
    title: "Open Issues",
    content: `Redirecting to GitHub issues...`,
    options: []
  },

  "external-careers": {
    id: "external-careers",
    title: "Careers",
    content: `Redirecting to careers page...`,
    options: []
  },

  "external-contact": {
    id: "external-contact",
    title: "Contact",
    content: `Redirecting to contact form...`,
    options: []
  },

  "external-home": {
    id: "external-home",
    title: "Home",
    content: `Redirecting to home...`,
    options: []
  }
};

// External link mappings
export const externalLinks: Record<string, string> = {
  "external-home": "/",
  "external-pricing": "/pricing",
  "external-demo": "/pricing", // TODO: Add demo page
  "external-trust": "/trust",
  "external-docs": "https://docs.getanswerlayer.com",
  "external-github": "https://github.com/AnswerLayer",
  "external-blog": "/blog",
  "external-terraform": "https://docs.getanswerlayer.com/deployment/terraform",
  "external-contributing": "https://github.com/AnswerLayer/answerlayer/blob/main/CONTRIBUTING.md",
  "external-issues": "https://github.com/AnswerLayer/answerlayer/issues",
  "external-careers": "/careers",
  "external-contact": "mailto:hello@getanswerlayer.com"
};

// Helper to check if a node is external
export function isExternalNode(nodeId: string): boolean {
  return nodeId.startsWith("external-");
}

// Get all valid node IDs for static path generation
export function getAllNodeIds(): string[] {
  return Object.keys(nodes).filter(id => !isExternalNode(id));
}
