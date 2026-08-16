/* Products and open accelerators — the things that exist as code you can read,
 * as opposed to the catalogue in capabilities.js, which is work we scope and
 * build against a client's systems.
 *
 * HONESTY RULES — read before editing.
 *
 *  1. Every entry here is a real public repository. `repo` must resolve.
 *  2. `blurb` describes what the repository actually does, taken from its own
 *     README, PRODUCT.md or description — not from what we would like it to be.
 *  3. `stage` is load-bearing and must stay honest:
 *       'released'  — published, documented, has a site or docs of its own
 *       'building'  — public and working, still moving quickly
 *     Nothing here claims to be running in a client estate. The four
 *     production accelerators that ARE deployed in client estates live in
 *     capabilities.js with status 'production'; these are a different claim.
 *  4. `stack` lists the primary language reported by the repository plus the
 *     runtimes it names itself. Do not pad it.
 *
 * The split between the two lists is the useful one for a reader: products
 * stand alone and you can go and use them; the accelerator exists to make a
 * specific engagement shorter, and maps onto a capability we sell.
 */

export const products = [
  {
    slug: 'openlcm',
    name: 'OpenLCM',
    tagline: 'Unbounded memory, bounded context.',
    blurb:
      'A framework-agnostic Lossless Context Management SDK for AI agents. It compresses a conversation into a structure that can be expanded back to what was actually said, so an agent keeps its history without the context window deciding how long it is allowed to remember.',
    stack: ['LangGraph', 'CrewAI', 'AutoGen', 'Google ADK'],
    stage: 'released',
    repo: 'https://github.com/akshay-eng/OpenLCM',
    site: 'https://akshay-eng.github.io/OpenLCM/',
    art: '/void/products/openlcm.webp',
  },
  {
    slug: 'zig',
    name: 'ZiG — Zen i Guess',
    tagline: 'Notification triage that never leaves the phone.',
    blurb:
      'A privacy-first Android notification interceptor. Cheap deterministic checks run first and escalate to an on-device classifier only when nothing simpler can decide. The internet permission is stripped from the merged manifest, so the app is structurally incapable of network I/O.',
    stack: ['Kotlin', 'Rust (JNI)', 'On-device ML'],
    stage: 'released',
    repo: 'https://github.com/prithvi-vasistha/zen-i-guess',
    site: 'https://prithvi-vasistha.github.io/zig-landing/',
    art: '/void/products/zig.webp',
  },
  {
    slug: 'presoai',
    name: 'PresoAI',
    tagline: 'Demo decks, without the deck-building evening.',
    blurb:
      'A presentation builder for teams who produce the same three decks over and over — sales demos, client pitches, internal reviews. Built around getting to a polished, on-brand deck quickly rather than exposing every control a slide editor could have.',
    stack: ['TypeScript', 'Next.js'],
    stage: 'building',
    repo: 'https://github.com/akshay-eng/PresoAI',
    site: null,
    art: '/void/products/presoai.webp',
  },
  {
    slug: 'devops-copilot',
    name: 'DevOps Copilot',
    tagline: 'Cluster telemetry with tenant isolation from the first hop.',
    blurb:
      'A Kubernetes agent that watches pods, deployments and events in-cluster and streams them to a Kafka backbone, tagging every message with the tenant it came from. It authenticates as a service account, so no kubeconfig leaves the cluster, and it takes Alertmanager webhooks on the same path.',
    stack: ['Python', 'Node.js', 'Kafka', 'Kubernetes'],
    stage: 'building',
    repo: 'https://github.com/akshay-eng/DevopsCopilot-',
    site: null,
    art: '/void/products/devops-copilot.webp',
  },
]

/* Open accelerators.
 *
 * An accelerator here means the same thing it means everywhere else on this
 * site: it removes the expensive, repetitive part of an engagement without
 * removing the review. Wheatear maps directly onto the `agent-migration`
 * capability — `capability` is that link, and it is what makes the tab useful
 * rather than a second place to put a repository. */
export const accelerators = [
  {
    slug: 'wheatear',
    name: 'Wheatear',
    tagline: 'A platform switch becomes a migration, not a rebuild.',
    blurb:
      'Wheatear parses an agent workflow into a canonical intermediate representation and generates the target from it — deterministic where correctness matters, AI-assisted only where intent has to be recovered. What it removes is the manual re-derivation of structure, which is most of the work and nearly all of the risk of silent behaviour change.',
    stack: ['Python', 'Copilot Studio', 'watsonx Orchestrate', 'Vertex AI', 'n8n'],
    stage: 'building',
    repo: 'https://github.com/akshay-eng/Wheatear',
    site: null,
    capability: 'agent-migration',
    art: '/void/products/wheatear.webp',
  },
]

export const allProjects = [...products, ...accelerators]
export const getProject = (slug) => allProjects.find((p) => p.slug === slug)
