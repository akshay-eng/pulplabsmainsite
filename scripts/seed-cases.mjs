#!/usr/bin/env node
/* Imports the two case studies that were hardcoded in src/data/services.js.
 * Safe to re-run: matched on slug. */
import Database from 'better-sqlite3'
const db = new Database(process.env.DATABASE_PATH || '.data/pulplabs.db')

db.exec(`CREATE TABLE IF NOT EXISTS case_studies (
  id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL UNIQUE, title TEXT NOT NULL,
  client TEXT NOT NULL DEFAULT '', industry TEXT NOT NULL DEFAULT '', summary TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '', metrics TEXT NOT NULL DEFAULT '[]', cover_image TEXT, loop_video TEXT,
  accent TEXT NOT NULL DEFAULT '#FF6B1A',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  position INTEGER NOT NULL DEFAULT 0, published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE INDEX IF NOT EXISTS idx_cases_status ON case_studies (status, position, published_at DESC);`)

const CASES = [
  {
    slug: 'quotes-in-minutes-not-days',
    title: 'Quotes in minutes, not days',
    client: 'Power & Pack Solutions',
    industry: 'Manufacturing',
    accent: '#FF6B1A',
    cover_image: '/void/cases/manufacturing.webp',
    loop_video: '/void/cases/manufacturing',
    position: 0,
    summary:
      'We connected their product catalogue and pricing rules to an AI quoting assistant, and put a support agent on WhatsApp and the website so enquiries stop dying overnight.',
    metrics: [
      { figure: '4×', caption: 'faster quote turnaround' },
      { figure: '62%', caption: 'enquiries handled solo' },
      { figure: '9 hrs', caption: 'returned per week' },
    ],
    body: `## The problem

Enquiries arrived at all hours and a quote took two days to leave the building. Anything that landed after five was answered the next morning, if at all.

## What we built

- The product catalogue and pricing rules connected to a quoting assistant
- A support agent on WhatsApp and the website
- A human approval step before any quote goes out

## What changed

Quotes that took two days now go out in twenty minutes, and the team gets about nine hours a week back.

_Body copy carried over from the original site — edit it in the admin._`,
  },
  {
    slug: 'from-transcripts-to-themes-overnight',
    title: 'From transcripts to themes overnight',
    client: 'Urban Ethnographers',
    industry: 'Research',
    accent: '#F0384B',
    cover_image: '/void/cases/research.webp',
    loop_video: '/void/cases/research',
    position: 1,
    summary:
      "Field recordings now transcribe, code and cluster themselves against the team's own framework — researchers spend their time on interpretation instead of tagging.",
    metrics: [
      { figure: '70%', caption: 'less manual coding' },
      { figure: '3×', caption: 'interviews per study' },
      { figure: '1 day', caption: 'to a draft insight deck' },
    ],
    body: `## The problem

Thematic coding was the slowest part of every study. Researchers spent more time tagging transcripts than interpreting them.

## What we built

Field recordings transcribe, code and cluster themselves against the team's own existing framework. The framework stayed theirs — that part is the research.

## What changed

Seventy per cent less manual coding, three times the interviews per study, and a draft insight deck inside a day.

_Body copy carried over from the original site — edit it in the admin._`,
  },
]

const stmt = db.prepare(
  `INSERT INTO case_studies (slug,title,client,industry,summary,body,metrics,cover_image,loop_video,accent,status,position,published_at)
   VALUES (@slug,@title,@client,@industry,@summary,@body,@metrics,@cover_image,@loop_video,@accent,'published',@position,@published_at)
   ON CONFLICT(slug) DO NOTHING`,
)

let added = 0
CASES.forEach((c, i) => {
  added += stmt.run({
    ...c,
    metrics: JSON.stringify(c.metrics),
    published_at: new Date(Date.now() - i * 86400000).toISOString(),
  }).changes
})
console.log(`✓ case studies: ${added} inserted, ${CASES.length - added} already present`)
