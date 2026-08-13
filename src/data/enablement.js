/* The enablement catalogue.
 *
 * Five platforms, three fixed formats, plus custom. That is fifteen curricula
 * — far too much to put on a page at once, so the page shows exactly one at a
 * time and the visitor picks the two axes. Nothing here is a generic
 * "intro to AI" outline: every session runs on the client's own workflows,
 * which is why each format ends with something in production rather than a
 * certificate.
 *
 * Outcomes are written as things a person can DO afterwards. "Understands
 * prompting" is not an outcome; "can write and version an evaluated prompt
 * against your own data" is. */

export const platforms = [
  {
    id: 'claude',
    name: 'Claude',
    vendor: 'Anthropic',
    tag: 'Long-context reasoning, tool use, agents',
    blurb:
      'Strongest of the current models on long documents, careful reasoning and staying inside instructions. Where teams put it to work: contract and policy review, codebase-wide changes, and agents that have to be trusted with tools.',
  },
  {
    id: 'openai',
    name: 'Codex & ChatGPT',
    vendor: 'OpenAI',
    tag: 'General assistants, code generation, realtime',
    blurb:
      'The broadest tooling surface — Assistants, function calling, realtime voice, and Codex for engineering work. Usually the fastest route from an idea to something a team can click on.',
  },
  {
    id: 'copilot',
    name: 'Copilot',
    vendor: 'Microsoft',
    tag: 'M365, Power Platform, low-code agents',
    blurb:
      'The one that matters if your organisation already lives in Microsoft 365. Copilot Studio lets non-engineers build governed agents against SharePoint, Dataverse and your line-of-business systems.',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    vendor: 'Google',
    tag: 'Multimodal, Workspace, Vertex AI',
    blurb:
      'Native multimodality — documents, images, audio and video in one context — plus tight Workspace integration and Vertex AI for teams already on Google Cloud.',
  },
  {
    id: 'watsonx',
    name: 'watsonx Orchestrate',
    vendor: 'IBM',
    tag: 'Enterprise automation, governance, skills',
    blurb:
      'Built for regulated estates: skill catalogues, approval flows and an audit posture that satisfies people who have to sign things. Slower to build in, much easier to defend.',
  },
]

export const formats = [
  {
    id: 'one-day',
    name: 'One day',
    length: '6 hours',
    cohort: 'Up to 20',
    who: 'Leaders and teams who need a straight answer and a first working artefact.',
  },
  {
    id: 'three-day',
    name: 'Three days',
    length: '3 × 6 hours',
    cohort: 'Up to 14',
    who: 'Builders who will own what gets shipped after we leave.',
  },
  {
    id: 'one-week',
    name: 'One week',
    length: '5 × 6 hours',
    cohort: 'Up to 10',
    who: 'A team taking one real workflow all the way into production.',
  },
]

/* Delivery is a genuine choice, not a downgrade — the remote format is
   restructured rather than the same day on a call. */
export const delivery = [
  ['On-site', 'At your office, on your network, against your own systems. Best for the one-week format, where access to real data matters most.'],
  ['Online', 'Live and instructor-led, split into shorter blocks across more days so nobody sits on a call for six hours. Same labs, same outcome.'],
  ['Hybrid', 'Kick-off and final review in the room, the build days remote. What most distributed teams end up choosing.'],
]

const C = (modules, outcomes) => ({ modules, outcomes })

export const curriculum = {
  claude: {
    'one-day': C(
      [
        ['Where this model is actually better', 'Long-context reasoning, careful instruction-following and refusal behaviour — and the tasks where a cheaper model is the right call.'],
        ['Prompting as engineering', 'Structure, examples, and why "be concise" is not an instruction. Everyone rewrites one of their own prompts.'],
        ['Grounding on your documents', 'Getting answers that cite your material instead of inventing it. Lab on a corpus you bring.'],
        ['Where it goes wrong', 'Confident wrong answers, silent truncation, and the review step that catches both.'],
      ],
      [
        'Write a structured, grounded prompt against your own documents and tell a good answer from a plausible one.',
        'Judge which of your workflows suit this model and which do not.',
        'Leave with one working assistant on your own material.',
      ],
    ),
    'three-day': C(
      [
        ['Day 1 — Foundations and grounding', 'Model behaviour, prompt structure, retrieval over your own corpus, and a first working assistant.'],
        ['Day 2 — Tools and agents', 'Function calling, multi-step tool use, and the approval gate that stands between an agent and an irreversible action.'],
        ['Day 3 — Evaluation and handover', 'Building an eval set from your real history, scoring it, and wiring it into CI so a prompt change cannot silently regress.'],
      ],
      [
        'Build an agent that calls your own tools, with human approval on every write.',
        'Stand up an evaluation harness and read its results honestly.',
        'Ship one reviewed workflow to a pilot group before we leave.',
      ],
    ),
    'one-week': C(
      [
        ['Day 1 — Discovery and scope', 'Pick the workflow, define what a win measures, and agree what would make it not worth doing.'],
        ['Day 2 — Grounding and retrieval', 'Ingest your material, tune retrieval, and establish the citation discipline.'],
        ['Day 3 — Tools, agents and guardrails', 'Tool integration against your systems, approval gates, and failure handling.'],
        ['Day 4 — Evaluation and hardening', 'Eval sets from live history, regression gates, cost and latency budgets, prompt versioning.'],
        ['Day 5 — Production and handover', 'Deploy behind a flag, monitoring and alerting on behaviour, runbook, and the team takes the keys.'],
      ],
      [
        'One real workflow live in production, owned by your team, with an eval suite behind it.',
        'A written runbook and a monitoring dashboard your on-call can actually use.',
        'Enough fluency that the second workflow does not need us.',
      ],
    ),
  },

  openai: {
    'one-day': C(
      [
        ['The tooling surface', 'Assistants, function calling, structured outputs and realtime — what each is for and what it costs.'],
        ['Prompting and structured output', 'Getting JSON you can rely on instead of prose you have to parse.'],
        ['Codex for engineering work', 'Repo-aware changes, test generation, and where review still has to happen.'],
        ['Cost, latency and model choice', 'Picking a model per task rather than defaulting to the largest.'],
      ],
      [
        'Call the API with structured outputs and validate what comes back.',
        'Use Codex on your own repository for a real change, with review discipline intact.',
        'Estimate what a workflow will cost per run before building it.',
      ],
    ),
    'three-day': C(
      [
        ['Day 1 — API foundations', 'Structured outputs, function calling, streaming, and a first working service against your data.'],
        ['Day 2 — Codex in the engineering loop', 'Repo-aware tasks, test generation, review workflow, and what must never be auto-merged.'],
        ['Day 3 — Retrieval and evaluation', 'Grounding on your corpus, building an eval set, and cost and latency budgets.'],
      ],
      [
        'Ship a service that returns validated structured output to your own systems.',
        'Run Codex inside a real review workflow without weakening the review.',
        'Score a change against an eval set instead of a vibe.',
      ],
    ),
    'one-week': C(
      [
        ['Day 1 — Scope and success criteria', 'Choose the workflow, define the measure, and agree the abandon condition.'],
        ['Day 2 — Build the core service', 'Structured outputs, function calling, error handling against your systems.'],
        ['Day 3 — Retrieval and context', 'Ingest your corpus, tune retrieval, enforce citations.'],
        ['Day 4 — Evaluation and cost', 'Eval harness from live history, regression gates, per-run cost budget, model selection per task.'],
        ['Day 5 — Ship and hand over', 'Deploy behind a flag, monitoring, runbook, ownership transfer.'],
      ],
      [
        'A production service your team owns, with evals and a cost budget attached.',
        'Codex embedded in your engineering workflow with review gates that hold.',
        'A documented model-selection policy so the next build starts from a decision, not a default.',
      ],
    ),
  },

  copilot: {
    'one-day': C(
      [
        ['Copilot across M365', 'What it genuinely does in Teams, Outlook, Word and Excel — and the expectations worth resetting early.'],
        ['Your first Copilot Studio agent', 'Build a governed agent against SharePoint content, in the room.'],
        ['Grounding and permissions', 'Why an agent inherits the oversharing already in your tenant, and what to fix first.'],
        ['Adoption, not licences', 'What actually drives usage after the pilot, based on what we have watched fail.'],
      ],
      [
        'Build and publish a Copilot Studio agent grounded on your own SharePoint content.',
        'Spot the permission problems an agent will surface before it surfaces them.',
        'Write a realistic adoption plan rather than a licence rollout.',
      ],
    ),
    'three-day': C(
      [
        ['Day 1 — Copilot Studio foundations', 'Topics, generative answers, knowledge sources, publishing to Teams.'],
        ['Day 2 — Actions and connectors', 'Power Platform connectors, Dataverse, calling your line-of-business systems, approval flows.'],
        ['Day 3 — Governance and rollout', 'DLP policies, environment strategy, tenant permission hygiene, monitoring and measured rollout.'],
      ],
      [
        'Ship an agent that reads and writes to your line-of-business systems through governed connectors.',
        'Configure DLP and environment policy so citizen builders cannot create an incident.',
        'Instrument adoption and answer quality from day one.',
      ],
    ),
    'one-week': C(
      [
        ['Day 1 — Scope and tenant readiness', 'Pick the workflow; audit permissions and content sprawl before building on top of it.'],
        ['Day 2 — Agent build', 'Topics, generative answers, knowledge sources, conversation design.'],
        ['Day 3 — Actions and integration', 'Connectors, Dataverse, approvals, error paths.'],
        ['Day 4 — Governance and security', 'DLP, environments, ALM across dev/test/prod, audit posture.'],
        ['Day 5 — Rollout and handover', 'Pilot cohort, telemetry, feedback loop, and your admins take ownership.'],
      ],
      [
        'A governed agent in production, promoted through a real dev/test/prod pipeline.',
        'A tenant permission position you can defend to security.',
        'An internal team able to build the next agent without us.',
      ],
    ),
  },

  gemini: {
    'one-day': C(
      [
        ['Multimodal in practice', 'Documents, images, audio and video in one context — and the tasks that genuinely need it.'],
        ['Gemini across Workspace', 'Docs, Sheets, Gmail and Meet, with an honest read on what is useful today.'],
        ['Long context and grounding', 'Working with very large documents without losing the thread.'],
        ['Vertex AI, briefly', 'What changes when you move from the app to the platform.'],
      ],
      [
        'Build a multimodal workflow over your own documents or media.',
        'Judge where long context replaces retrieval and where it does not.',
        'Decide whether Workspace or Vertex is the right surface for a given job.',
      ],
    ),
    'three-day': C(
      [
        ['Day 1 — Multimodal foundations', 'Prompting across text, image, audio and video; structured outputs; a first working pipeline.'],
        ['Day 2 — Vertex AI', 'Grounding, function calling, deployment, and IAM done properly.'],
        ['Day 3 — Evaluation and cost', 'Eval sets for multimodal output, latency and cost budgets, model routing.'],
      ],
      [
        'Ship a multimodal pipeline on Vertex against your own media.',
        'Evaluate output quality where the answer is not a string.',
        'Route between models on cost and capability rather than habit.',
      ],
    ),
    'one-week': C(
      [
        ['Day 1 — Scope and data', 'Choose the workflow, inventory the media, define the measure.'],
        ['Day 2 — Pipeline build', 'Ingestion, multimodal prompting, structured extraction.'],
        ['Day 3 — Vertex and integration', 'Grounding, function calling, IAM, wiring into your systems.'],
        ['Day 4 — Evaluation and hardening', 'Eval harness, regression gates, cost and latency budgets.'],
        ['Day 5 — Ship and hand over', 'Deployment, monitoring, runbook, ownership transfer.'],
      ],
      [
        'A multimodal workflow in production with evaluation behind it.',
        'A Vertex footprint your platform team is comfortable operating.',
        'Clear internal guidance on when multimodal is worth its cost.',
      ],
    ),
  },

  watsonx: {
    'one-day': C(
      [
        ['Orchestrate and the skill model', 'Skills, catalogues and how work is actually assembled here.'],
        ['Your first orchestration', 'Build a multi-step flow across two systems, in the room.'],
        ['Governance from the start', 'Approval chains, audit trail and the questions your risk function will ask.'],
        ['Where it fits', 'When Orchestrate is the right answer and when a lighter tool is.'],
      ],
      [
        'Build and run a multi-step orchestration across two of your systems.',
        'Explain the audit position to someone who has to sign off on it.',
        'Judge honestly whether this platform suits the workflow in front of you.',
      ],
    ),
    'three-day': C(
      [
        ['Day 1 — Skills and catalogue', 'Skill authoring, the catalogue, connecting your first systems.'],
        ['Day 2 — Orchestration and approvals', 'Multi-step flows, decision points, human approval chains, error handling.'],
        ['Day 3 — Governance and audit', 'Audit trail, access model, regulated-estate constraints, monitoring.'],
      ],
      [
        'Publish reusable skills your wider organisation can assemble.',
        'Build an approval chain that satisfies a real internal control.',
        'Produce the audit evidence a reviewer will accept.',
      ],
    ),
    'one-week': C(
      [
        ['Day 1 — Scope and controls', 'Pick the workflow; establish the control and audit requirements before designing anything.'],
        ['Day 2 — Skill authoring', 'Build and publish skills against your systems.'],
        ['Day 3 — Orchestration', 'Multi-step flows, decision points, approvals, failure paths.'],
        ['Day 4 — Governance and hardening', 'Audit trail, access model, monitoring, regression testing.'],
        ['Day 5 — Production and handover', 'Deployment, operational runbook, ownership transfer to your team.'],
      ],
      [
        'An orchestration live in production with its audit trail accepted by your risk function.',
        'A skill catalogue other teams can build on.',
        'An internal owner who can extend it without external help.',
      ],
    ),
  },
}

/* The fourth option. Most enterprise enquiries end up here, because the useful
   version is usually "our stack, our constraints, these six people". */
export const custom = {
  name: 'Custom',
  blurb:
    'Most of the work we do does not fit a fixed length. Mixed platforms, a regulated estate, a cohort split across time zones, or a curriculum built around one specific system you already run — all of that is a scoping conversation, not a menu item.',
  points: [
    ['Mixed platforms', 'Teams rarely standardise on one model. We teach the comparison and the routing decision alongside the tools.'],
    ['Your constraints', 'Air-gapped environments, data-residency rules, or a security review before anything is installed.'],
    ['Role-split cohorts', 'Executives, builders and operators need different days. We run them as separate tracks against the same workflow.'],
    ['Ongoing', 'A standing session each month while a team ramps, rather than one intense week and silence.'],
  ],
}
