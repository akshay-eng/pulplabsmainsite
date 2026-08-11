#!/usr/bin/env node
/* Seeds the database: creates the admin user and imports the hardcoded posts
 * that used to live in src/data/blog.js.
 *
 *   ADMIN_EMAIL=you@x.com ADMIN_PASSWORD=... SESSION_SECRET=... npm run seed
 *
 * Safe to re-run: the admin is upserted and posts are matched on slug. */

import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const DB_PATH = process.env.DATABASE_PATH || '.data/pulplabs.db'
mkdirSync(dirname(DB_PATH), { recursive: true })
const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT '',
    tags TEXT NOT NULL DEFAULT '[]',
    cover_image TEXT,
    author TEXT NOT NULL DEFAULT 'PulpLabs',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
    published_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_posts_status_published ON posts (status, published_at DESC);
  CREATE INDEX IF NOT EXISTS idx_posts_category ON posts (category);
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`)

/* ------------------------------------------------------------- admin --- */

const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim()
const password = process.env.ADMIN_PASSWORD || ''

if (email && password) {
  if (password.length < 12) {
    console.error('✗ ADMIN_PASSWORD must be at least 12 characters.')
    process.exit(1)
  }
  db.prepare(
    `INSERT INTO admin_users (email, password_hash) VALUES (?, ?)
     ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash`,
  ).run(email, bcrypt.hashSync(password, 12))
  console.log(`✓ admin ${email} ready`)
} else {
  const n = db.prepare('SELECT COUNT(*) AS n FROM admin_users').get().n
  if (n === 0) console.log('… no admin yet — re-run with ADMIN_EMAIL and ADMIN_PASSWORD set')
  else console.log(`… admin unchanged (${n} existing)`)
}

/* ------------------------------------------------------------- posts --- */

/* Carried over from src/data/blog.js. Bodies are short stubs: the originals
   were titles only, and inventing full articles for a real consultancy's blog
   would put words in their mouth. Edit them in the admin. */
const POSTS = [
  {
    slug: 'why-your-incident-bot-keeps-guessing',
    title: 'Why your incident bot keeps guessing (and how evals fix it)',
    category: 'Engineering',
    tags: ['evals', 'incident-response', 'llm'],
    description:
      'Most incident bots fail the same way: confident answers, no ground truth. Here is the task-level evaluation harness we run before anything touches a production queue.',
    body: `Most incident bots fail the same way: confident answers, no ground truth.

## The failure mode

A model that has never been scored against your estate will answer every question with the same confidence, whether it is right or not. Confidence is not calibration.

## What we do instead

Before anything touches a production queue we build a task-level evaluation harness:

1. **Collect real tickets.** Not synthetic ones — a sample of what actually lands in the queue.
2. **Write the expected outcome** for each, with the engineer who would normally handle it.
3. **Score every change** against that set, so a prompt tweak that helps one class and breaks another shows up immediately.

## Why it matters

> The evaluation step is the one people skip. It is also the reason incident bots ship confident and wrong.

_This post is a stub carried over from the original site — replace it in the admin._`,
  },
  {
    slug: 'what-a-12-person-manufacturer-needed-from-ai',
    title: 'What a 12-person manufacturer actually needed from AI',
    category: 'Field notes',
    tags: ['small-business', 'manufacturing'],
    description:
      'Not a copilot. Not a chatbot. A way to stop losing quotes overnight — and the smallest system that fixed it.',
    body: `Not a copilot. Not a chatbot.

They were losing enquiries overnight because nobody was there to answer them, and a quote took two days to leave the building.

## The smallest thing that worked

- Product catalogue and pricing rules connected to a quoting assistant
- A support agent on WhatsApp and the website
- A human approval step they kept

_This post is a stub carried over from the original site — replace it in the admin._`,
  },
  {
    slug: 'migrating-rpa-flows-to-agents-without-breaking-audit',
    title: 'Migrating RPA flows to agents without breaking audit',
    category: 'Playbook',
    tags: ['rpa', 'agents', 'compliance'],
    description:
      'Agents are more capable than RPA scripts and far less predictable. Here is how to move without losing the audit trail your auditors rely on.',
    body: `Agents are more capable than RPA scripts and far less predictable.

## The constraint nobody mentions upfront

Your RPA flows are auditable because they are deterministic. Swap in an agent and that property disappears unless you design for it.

## Keeping the trail

- Log the inputs, the plan and the tool calls — not just the outcome
- Keep every irreversible action behind an approval
- Version the prompt alongside the code

_This post is a stub carried over from the original site — replace it in the admin._`,
  },
  {
    slug: 'coding-qualitative-data-with-llms',
    title: 'Coding qualitative data with LLMs: what held up in the field',
    category: 'Field notes',
    tags: ['research', 'qualitative', 'llm'],
    description:
      'Thematic coding is the slowest part of qualitative research. Some of it survives automation; some of it very much does not.',
    body: `Thematic coding is the slowest part of qualitative research.

## What held up

Clustering transcripts against a framework the team already uses. The model is good at the first pass.

## What did not

Inventing the framework. That is the research.

_This post is a stub carried over from the original site — replace it in the admin._`,
  },
  {
    slug: 'the-workshop-exercise-that-predicts-adoption',
    title: "The workshop exercise that predicts who'll actually adopt AI",
    category: 'Enablement',
    tags: ['workshops', 'adoption', 'change'],
    description:
      'One exercise, run in the first hour of every bootcamp, that reliably separates the teams who will ship from the teams who will not.',
    body: `One exercise, run in the first hour of every bootcamp.

Ask each person to name the task they would hand over tomorrow if they trusted the output completely.

The teams who answer in seconds ship. The teams who cannot name one are not ready — and that is useful to know on day one rather than week six.

_This post is a stub carried over from the original site — replace it in the admin._`,
  },
]

const insert = db.prepare(
  `INSERT INTO posts (slug, title, description, body, category, tags, author, status, published_at)
   VALUES (@slug, @title, @description, @body, @category, @tags, 'PulpLabs', 'published', @published_at)
   ON CONFLICT(slug) DO NOTHING`,
)

let added = 0
POSTS.forEach((p, i) => {
  // Space them a day apart, newest first, so the feed has a sane order.
  const d = new Date(Date.now() - i * 86400000).toISOString()
  const r = insert.run({ ...p, tags: JSON.stringify(p.tags), published_at: d })
  added += r.changes
})

console.log(`✓ posts: ${added} inserted, ${POSTS.length - added} already present`)
console.log(`✓ database at ${DB_PATH}`)
