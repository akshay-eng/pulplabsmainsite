import Database from 'better-sqlite3'
import { mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

/* ==========================================================================
   SQLite connection.

   DATABASE_PATH points at the file. In production that should live on a
   mounted volume (Fly: /data/pulplabs.db) — anywhere else and the data is
   lost on redeploy, which is the classic way SQLite-on-a-PaaS goes wrong.
   ========================================================================== */

/* Resolved to an absolute path against the process cwd, and logged, because a
   relative path is a silent-failure trap: `output: standalone` starts the
   server from .next/standalone/, so `.data/pulplabs.db` resolved to a
   DIFFERENT directory, SQLite happily created an empty database there, and
   the site served 200s with no posts and no case studies. Always set an
   absolute DATABASE_PATH in production. */
const DB_PATH = resolve(process.env.DATABASE_PATH || '.data/pulplabs.db')

/* Next dev reloads modules on every edit; without a global singleton each
   reload would open another handle to the same file and eventually exhaust
   them. Attaching to globalThis survives module reloads. */
const globalForDb = globalThis

function connect() {
  const isNew = !existsSync(DB_PATH)
  mkdirSync(dirname(DB_PATH), { recursive: true })
  const db = new Database(DB_PATH)

  // WAL lets reads proceed during a write — worth it even for one admin.
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  // Wait rather than throwing instantly if a write lock is held.
  db.pragma('busy_timeout = 5000')

  migrate(db)

  /* Creating a database from scratch is expected on a first run and a red flag
     anywhere else — in production it almost always means DATABASE_PATH is
     pointing somewhere unintended and the site is about to serve empty pages. */
  if (isNew && process.env.NODE_ENV === 'production') {
    console.warn(
      `[db] Created a NEW empty database at ${DB_PATH}. ` +
        'If you expected existing content, DATABASE_PATH is wrong — it must be absolute in production.',
    )
  } else {
    console.log(`[db] ${DB_PATH}${isNew ? ' (new)' : ''}`)
  }

  return db
}

function migrate(db) {
  /* Added after the table shipped, so existing databases need it explicitly —
     CREATE TABLE IF NOT EXISTS leaves an existing table alone. */
  const caseCols = db.prepare(`PRAGMA table_info(case_studies)`).all().map((c) => c.name)
  if (caseCols.length && !caseCols.includes('loop_video')) {
    db.exec(`ALTER TABLE case_studies ADD COLUMN loop_video TEXT`)
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      slug         TEXT    NOT NULL UNIQUE,
      title        TEXT    NOT NULL,
      description  TEXT    NOT NULL DEFAULT '',
      body         TEXT    NOT NULL DEFAULT '',
      category     TEXT    NOT NULL DEFAULT '',
      -- JSON array. SQLite's json_each() makes this queryable without a
      -- join table, which a blog this size does not need.
      tags         TEXT    NOT NULL DEFAULT '[]',
      cover_image  TEXT,
      author       TEXT    NOT NULL DEFAULT 'PulpLabs',
      status       TEXT    NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
      published_at TEXT,
      created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_posts_status_published
      ON posts (status, published_at DESC);
    CREATE INDEX IF NOT EXISTS idx_posts_category ON posts (category);

    CREATE TABLE IF NOT EXISTS case_studies (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      slug         TEXT    NOT NULL UNIQUE,
      title        TEXT    NOT NULL,
      client       TEXT    NOT NULL DEFAULT '',
      industry     TEXT    NOT NULL DEFAULT '',
      summary      TEXT    NOT NULL DEFAULT '',
      body         TEXT    NOT NULL DEFAULT '',
      -- JSON array of { figure, caption }. Fixed shape, small, always read
      -- together — a metrics table would be three joins for no benefit.
      metrics      TEXT    NOT NULL DEFAULT '[]',
      cover_image  TEXT,
      -- Path WITHOUT extension: LoopVideo appends .webm and .mp4 itself, and
      -- cover_image doubles as the poster. Null means the card falls back to
      -- the still, which is also what every suppressed playback path shows.
      loop_video   TEXT,
      accent       TEXT    NOT NULL DEFAULT '#FF6B1A',
      status       TEXT    NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
      -- Manual ordering: the newest case study is not always the best one to
      -- lead with, so the carousel order is editorial rather than chronological.
      position     INTEGER NOT NULL DEFAULT 0,
      published_at TEXT,
      created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_cases_status ON case_studies (status, position, published_at DESC);

    -- Single-admin credential store. Kept in the DB rather than an env var so
    -- the password can be rotated without a redeploy.
    CREATE TABLE IF NOT EXISTS admin_users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)
}

export const db = globalForDb.__pulplabsDb ?? (globalForDb.__pulplabsDb = connect())
