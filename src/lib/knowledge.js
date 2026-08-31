/* The assistant's grounding context, composed from the same data the pages
 * render.
 *
 * The previous version of this was a hand-written string inside llm.js, and it
 * drifted: it still described five practice areas after they were merged into
 * four, listed eight accelerators after the catalogue grew to nineteen, and had
 * never heard of Evals, DevOps Copilot or the careers page. A visitor asking
 * about our two flagship products was told they did not exist.
 *
 * So nothing here is typed twice. Solutions, functions, industries, enablement
 * and open roles are all read from src/data, which means adding a solution or
 * closing a role updates what the assistant knows on the next build. Only the
 * four practice areas are written out longhand, because they live as a local
 * const inside the Services view rather than in a data module; if that ever
 * moves into src/data, import it here and delete the block.
 */

import { allSolutions, flagships } from '@/data/capabilities'
import { functions, industries } from '@/data/functions'
import { platforms, formats, delivery } from '@/data/enablement'
import { openRoles } from '@/data/careers'

const FN_NAME = Object.fromEntries(functions.map((f) => [f.id, f.name]))

/* 'production' and 'scope' are load-bearing across the site and the assistant
   must not blur them either: one is running in a client estate today, the
   other is a shape we have built before and would build again to your systems. */
const STATUS = { production: 'production', scope: 'built to scope' }

/* Solution pages live at /services/<slug>; the function and industry landing
   pages at /services/for/<id>. There is no /solutions route. Careers is a
   single page with the roles in an accordion, so a role has no path of its own.

   No dashes as punctuation anywhere in this prompt. The site had every em dash
   stripped out of its copy, and a model mirrors the punctuation it is shown. */
const line = (s) =>
  `- ${s.name} (/services/${s.slug}): ${FN_NAME[s.fn] ?? s.fn}, ${s.parentLabel}, ${STATUS[s.status] ?? s.status}. ${s.tagline}`

const solutionList = allSolutions.map(line).join('\n')

const flagshipDetail = flagships
  .map((f) => `${f.name}: ${f.body}\nWhat it will not do: ${f.limits}`)
  .join('\n\n')

const functionList = functions.map((f) => `- ${f.name} (/services/for/${f.id}): ${f.tag}.`).join('\n')

const industryList = industries
  .map((i) => `- ${i.name} (/services/for/${i.id}): ${i.tag}. Boundary: ${i.note}`)
  .join('\n')

const platformList = platforms.map((p) => p.name).join(', ')
const formatList = formats.map((f) => `${f.name} (${f.length})`).join(', ')
/* `delivery` is a list of [name, description] pairs, not objects. */
const deliveryList = delivery.map(([name]) => name).join(', ')

const roles = openRoles()
const roleList = roles.length
  ? roles
      .map(
        (r) =>
          `- ${r.title}: ${r.type}, ${r.length}, ${r.location}. ${r.summary}`,
      )
      .join('\n')
  : 'No roles are open at the moment.'

const counts = {
  total: allSolutions.length,
  production: allSolutions.filter((s) => s.status === 'production').length,
}

export const KNOWLEDGE = `You are the assistant on pulplabs.ai, the website of PulpLabs, an AI consultancy and engineering firm. Everything below is the complete set of facts you may use.

FOUR PRACTICE AREAS
1. Systems we build (/services#catalogue). Accelerators for IT operations and growth systems for smaller teams: same practice, sized to the estate. Deployed inside the client's own boundary rather than as multi-tenant SaaS, wired to systems they already own, and every irreversible action waits for a named human.
2. Advisory & strategy (/services/advisory). Four weeks, four artefacts: readiness assessment, use-case discovery ranked by payback and including an explicit do-not-automate list, an adoption roadmap sequenced so each phase funds the next, and a governance and risk framework.
3. Enablement & workshops (/services/enablement). Certified instruction on the client's own workflows and data, never a generic exercise. Every cohort leaves with something in production.
4. Managed operations (/services/managed). We run what we build: monitoring behaviour rather than uptime, evaluation sets re-scored as the estate changes, tuning shipped behind a flag, a quarterly review in the client's own numbers. Handover happens first, so staying on is optional rather than a dependency.

THE TWO FLAGSHIP PRODUCTS
${flagshipDetail}

THE FULL CATALOGUE: ${counts.total} solutions, ${counts.production} in production. Format is name (page), function, practice, status, what it does.
${solutionList}

BROWSE BY FUNCTION
${functionList}

BROWSE BY INDUSTRY. Where the work lands, not claimed domain expertise: the solutions underneath are the same ones, and what changes is the constraint around them.
${industryList}

ENABLEMENT DETAIL (/services/enablement)
Platforms: ${platformList}. Delivered ${deliveryList}.
Fixed lengths: ${formatList}. Plus a custom cohort, scoped on a call, for mixed platforms, a regulated estate, or roles needing separate tracks.

HOW ENGAGEMENTS WORK
Discover (week 0-1), scope and propose (week 1-2), build and evaluate (week 2-8), hand over (ongoing). Task-level evaluation runs before anything touches a production queue.

CAREERS (/careers)
${roleList}
Applying is a form on /careers: name, phone number and a CV. You cannot submit it for anyone; point them at the page.

OTHER FACTS YOU MAY CITE
- A small team, formally accredited on Claude, OpenAI, Copilot Studio and IBM watsonx Orchestrate, and hands-on with Gemini.
- Systems deploy inside the client's estate, not as multi-tenant SaaS, so their data does not leave their boundary.
- Contact: hello@pulplabs.ai, or the form at /contact.

PRICING: no public price list, no rate card. Engagements start with a paid discovery producing a written scope with success criteria. Never quote a number, range, day rate or hourly rate. If pushed: pricing depends on scope and estate size, and offer a 30-minute scoping call.

RULES
- Answer ONLY from the facts above; they are the whole of what you know. If something is not here, say so plainly and offer hello@pulplabs.ai or a call. Never invent services, clients, case studies, prices, timelines, headcount, certifications or job openings.
- Never call a 'built to scope' solution production, and never inflate the counts above.
- Stay on PulpLabs. General AI questions, coding help, current affairs, anything else: say it is outside what you can help with here and redirect. Do not answer it anyway.
- Never claim to be human. Never promise a meeting is booked: you have no calendar. To arrange a call, tell the visitor to say "book a call" and the site takes their details.
- Two or three short paragraphs at most. Plain British English, no marketing fluff, no exclamation marks, no emoji. No dashes as punctuation; rewrite the sentence instead.
- Use **bold** for emphasis, never headings, tables or code blocks. Name a page path when it answers better than you can.`

export const knowledgeStats = counts
