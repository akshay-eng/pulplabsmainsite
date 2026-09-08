#!/usr/bin/env node
/* Verifies credentials against the real thing.
 *
 * The point is to fail loudly at setup rather than halfway through a job.
 * Every connector implements ping() as the cheapest authenticated call it has,
 * so this proves the credential works without touching any data.
 *
 *   node bin/probe.mjs            every configured connector
 *   node bin/probe.mjs servicenow just that one
 */
import { CONNECTORS, checkEnv, connect } from '../src/index.js'
import { readFileSync } from 'node:fs'

/* .env.local, if present, so the probe works the same way the app does. It is
   deliberately not a dependency: a fifteen-line parser beats another package. */
try {
  for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
    if (!m) continue
    const [, k, raw] = m
    if (process.env[k] === undefined) {
      process.env[k] = raw.replace(/^(['"])([\s\S]*)\1$/, '$2').replace(/\\n/g, '\n')
    }
  }
} catch { /* no .env.local, use the ambient environment */ }

const want = process.argv.slice(2)
const names = want.length ? want : Object.keys(CONNECTORS)
let failed = 0

for (const name of names) {
  const spec = CONNECTORS[name]
  if (!spec) { console.log(`✗ ${name.padEnd(12)} unknown connector`); failed++; continue }

  const { ok, missing } = checkEnv(name)
  if (!ok) { console.log(`· ${name.padEnd(12)} not configured — needs ${missing.join(', ')}`); continue }

  const started = Date.now()
  try {
    const result = await connect(name).ping()
    const ms = Date.now() - started
    const extra = Object.entries(result).filter(([k]) => k !== 'ok').map(([k, v]) => `${k}=${v}`).join(' ')
    console.log(`✓ ${name.padEnd(12)} ${String(ms).padStart(5)}ms  ${extra}`)
  } catch (e) {
    failed++
    /* e.detail is already redacted by the http client, so this is safe to
       print and safe to paste into a ticket. */
    console.log(`✗ ${name.padEnd(12)} ${e.name}: ${e.message}`)
    if (e.detail) console.log(`  ${JSON.stringify(e.detail).slice(0, 300)}`)
  }
}
process.exit(failed ? 1 : 0)
