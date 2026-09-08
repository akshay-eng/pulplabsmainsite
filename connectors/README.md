# @pulplabs/connectors

Connectors for ITSM, document stores and automation platforms. Plain Node ESM,
**no runtime dependencies**, nothing coupled to the website — this directory can
be lifted into its own repo unchanged.

```bash
cd connectors
cp .env.example .env.local     # fill in what you have
npm run probe                  # verifies each credential against the real API
npm test                       # 32 tests, no credentials needed
```

## What is covered

| Connector | Auth | Surface |
|---|---|---|
| **ServiceNow** | Basic or OAuth2 bearer | Full CRUD on **any table**, aggregate counts, attachments |
| **Confluence** Cloud | Basic + API token | Spaces, pages CRUD (version-aware), CQL search, attachments |
| **SharePoint** / OneDrive | Graph client credentials | Sites, drives, item CRUD, search, up/download inc. large-file sessions |
| **Box** | Bearer token | Files and folders CRUD, versioned upload, download, search |
| **AWX** / Automation Controller | Bearer or basic | CRUD on any resource, launch, stdout, cancel, poll to completion |
| **Chef** Infra Server | RSA-signed requests | Nodes, roles, environments, clients, data bags, Solr search |

## Using one

```js
import { connect, ServiceNow } from '@pulplabs/connectors'

const sn = connect('servicenow')             // from the environment
const sn2 = new ServiceNow({ instance: 'dev12345', username: 'admin', password: '…' })

// The Table API is one uniform CRUD surface over every table.
const open = await sn.incidents.all({ query: 'active=true^priority<=2', limit: 50 })
const inc  = await sn.incidents.create({ short_description: 'Disk full on web-03', urgency: '2' })
await sn.incidents.update(inc.sys_id, { state: '2' })

// Anything else in the instance works the same way.
for await (const ci of sn.cmdb('cmdb_ci_server').iterate({ query: 'operational_status=1' })) {
  console.log(ci.name)
}
```

Long result sets are async iterators, so nothing loads a whole table into
memory. `.all()` is there when you genuinely want the array.

```js
import { connect } from '@pulplabs/connectors'

const awx = connect('awx')
const job = await awx.run(42, { extraVars: { env: 'prod' }, limit: 'web*' })
console.log(job.status, await awx.jobStdout(job.id))
```

## Design notes

**One HTTP path.** Every connector goes through `src/core/http.js`: timeouts
that actually abort, retry with full jitter, `Retry-After` honoured rather than
guessed, and provider errors mapped onto one taxonomy. So a caller can write
`catch (e) { if (e.retryable) … }` without knowing which system it was talking
to.

**POSTs are not retried by default.** Replaying one can open two incidents or
launch a job twice. Callers who know a POST is safe opt in with
`idempotent: true`; a 429 is still retried, since the request never reached the
business logic.

**Secrets never escape.** Errors carry the provider payload for debugging, and
`redact()` strips anything matching a credential-shaped key first. The natural
thing — attaching the failed request to the error — otherwise puts an
`Authorization` header into every log aggregator you own. There is a test for
this.

**Configuration fails at startup.** `checkEnv()` reports every missing variable
at once, distinguishing "must have" from "one of these sets". `npm run probe`
turns that into a green tick per connector before anything runs for real.

## Per-connector gotchas

Each of these cost real time to find, so they are recorded rather than left to
be rediscovered.

- **ServiceNow** — `update()` uses PATCH. PUT replaces the record and silently
  blanks every field you did not send. Reads use `sysparm_display_value=all`, so
  reference fields come back with a readable label as well as the sys_id.
- **Confluence** — updates must carry the *current* version number plus one, so
  `updatePage()` fetches it when you do not pass one. Search still lives on the
  v1 API because CQL was never ported to v2; the connector talks to both.
- **SharePoint** — needs **Application** permissions with admin consent.
  Delegated permissions of the same name authorise fine and then 403 on every
  call. Tokens refresh 60s early, because refreshing exactly at expiry loses a
  race with clock skew and produces intermittent 401s that look like a bad
  secret. Files over 4MB use an upload session automatically.
- **Box** — uploads go to `upload.box.com`, everything else to `api.box.com`.
  Search cannot page past offset 10,000, so it stops there rather than looping.
  Deleting a non-empty folder needs `recursive`, which defaults to true here.
- **AWX** — launch parameters only apply if the template has them enabled as
  "prompt on launch"; otherwise AWX accepts the request and ignores the field.
  That is the usual reason a launch "works" but runs the wrong inventory.
  `waitForJob` backs off to 15s rather than polling every second.
- **Chef** — signs every request with an RSA key across numbered
  `X-Ops-Authorization-N` headers. Paths are normalised before hashing, because
  the server hashes *its* normalised form and `/nodes/` vs `/nodes` otherwise
  fails as a signature mismatch that looks like a bad key.

## Verification status

Signing, pagination, retry, error mapping and configuration are covered by 32
tests that run without credentials, using an injected `fetch`.

**None of these have been run against a live system yet.** The ServiceNow
instance supplied for testing no longer resolves in DNS — ServiceNow reclaims
Personal Developer Instances after about ten days idle, and the hostname goes
with it. Wake or re-request it at developer.servicenow.com, put the credentials
in `.env.local`, and `npm run probe` will confirm in a second.

Chef deserves a specific caveat: its signature is verified here by
round-tripping against the public key, which proves the construction is
mechanically correct, but it has not been checked against a real Chef Infra
Server. That is the one most likely to need a small fix on first contact.
