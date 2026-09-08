import { test } from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { ServiceNow } from '../src/itsm/servicenow.js'
import { Confluence } from '../src/docs/confluence.js'
import { SharePoint } from '../src/docs/sharepoint.js'
import { Box } from '../src/docs/box.js'
import { AWX } from '../src/automation/awx.js'
import { Chef, signRequest, canonicalPath } from '../src/automation/chef.js'
import { checkEnv, connect, connectorNames } from '../src/index.js'
import { ValidationError } from '../src/core/errors.js'

/** Records every request and replies with whatever the route map says. */
function recorder(routes = {}) {
  const calls = []
  const fetchImpl = async (url, init = {}) => {
    const u = String(url)
    calls.push({ method: init.method ?? 'GET', url: u, body: init.body, headers: init.headers })
    for (const [pattern, body] of Object.entries(routes)) {
      if (u.includes(pattern)) {
        return new Response(typeof body === 'string' ? body : JSON.stringify(body),
          { headers: { 'content-type': 'application/json' } })
      }
    }
    return new Response(JSON.stringify({ result: [], results: [], entries: [], value: [] }),
      { headers: { 'content-type': 'application/json' } })
  }
  return { calls, fetchImpl }
}

test('every connector rejects incomplete config rather than failing at call time', () => {
  assert.throws(() => new ServiceNow({ instance: 'x' }), ValidationError)
  assert.throws(() => new Confluence({ site: 'x' }), ValidationError)
  assert.throws(() => new SharePoint({ tenantId: 't' }), ValidationError)
  assert.throws(() => new Box({}), ValidationError)
  assert.throws(() => new AWX({ host: 'https://a' }), ValidationError)
  assert.throws(() => new Chef({ serverUrl: 'https://c', org: 'o' }), ValidationError)
})

test('servicenow: PATCH is used for update so unsent fields are not blanked', async () => {
  const { calls, fetchImpl } = recorder({ '/table/incident/abc': { result: { sys_id: 'abc' } } })
  const sn = new ServiceNow({ instance: 'dev1', username: 'u', password: 'p', fetch: fetchImpl })
  await sn.incidents.update('abc', { state: '2' })
  assert.equal(calls.at(-1).method, 'PATCH')
})

test('servicenow: iterate stops when a short page arrives', async () => {
  let page = 0
  const fetchImpl = async () => new Response(
    JSON.stringify({ result: page++ === 0 ? Array.from({ length: 100 }, (_, i) => ({ sys_id: String(i) })) : [{ sys_id: 'last' }] }),
    { headers: { 'content-type': 'application/json' } })
  const sn = new ServiceNow({ instance: 'dev1', token: 't', fetch: fetchImpl })
  const all = await sn.incidents.all({})
  assert.equal(all.length, 101)
})

test('servicenow: query escaping neutralises the separators', () => {
  assert.equal(ServiceNow.escape('a^b,c'), 'a b c')
})

test('servicenow: table names are validated, not interpolated blindly', () => {
  const sn = new ServiceNow({ instance: 'd', token: 't', fetch: async () => new Response('{}') })
  assert.throws(() => sn.table('incident/../../admin'), ValidationError)
})

test('confluence: update fetches the current version when not given one', async () => {
  const { calls, fetchImpl } = recorder({ '/pages/123': { id: '123', title: 'T', version: { number: 7 } } })
  const c = new Confluence({ site: 'acme', email: 'e', apiToken: 't', fetch: fetchImpl })
  await c.updatePage('123', { body: '<p>x</p>' })
  const put = calls.find((x) => x.method === 'PUT')
  assert.equal(JSON.parse(put.body).version.number, 8, 'version is incremented from the current one')
})

test('confluence: search goes to v1 because CQL never moved to v2', async () => {
  const { calls, fetchImpl } = recorder()
  const c = new Confluence({ site: 'acme', email: 'e', apiToken: 't', fetch: fetchImpl })
  await c.searchAll('type=page', { limit: 1 })
  assert.match(calls[0].url, /\/wiki\/rest\/api\/search/)
})

test('confluence: cql escaping closes the quote injection', () => {
  assert.equal(Confluence.cql('say "hi"'), '"say \\"hi\\""')
})

test('box: uploads go to the upload host, not the api host', async () => {
  const { calls, fetchImpl } = recorder({ 'upload.box.com': { entries: [{ id: '1' }] } })
  const b = new Box({ accessToken: 't', fetch: fetchImpl })
  await b.upload({ name: 'a.txt', data: new Uint8Array([1, 2, 3]) })
  assert.match(calls.at(-1).url, /^https:\/\/upload\.box\.com/)
})

test('box: search stops at the provider offset ceiling instead of looping', async () => {
  let calls = 0
  const fetchImpl = async () => {
    calls++
    return new Response(JSON.stringify({ entries: Array.from({ length: 200 }, (_, i) => ({ id: String(i) })) }),
      { headers: { 'content-type': 'application/json' } })
  }
  const b = new Box({ accessToken: 't', fetch: fetchImpl })
  const found = await b.searchAll('x', { pageSize: 200 })
  assert.ok(found.length <= 10_000 + 200, 'bounded by the 10k ceiling')
  assert.ok(calls <= 51, `stopped paging, made ${calls} calls`)
})

test('sharepoint: the token is fetched once and reused', async () => {
  let tokens = 0
  const fetchImpl = async (url) => {
    if (String(url).includes('login.microsoftonline')) {
      tokens++
      return new Response(JSON.stringify({ access_token: 'a', expires_in: 3600 }), { headers: { 'content-type': 'application/json' } })
    }
    return new Response(JSON.stringify({ value: [] }), { headers: { 'content-type': 'application/json' } })
  }
  const sp = new SharePoint({ tenantId: 't', clientId: 'c', clientSecret: 's', fetch: fetchImpl })
  await sp.ping(); await sp.ping(); await sp.ping()
  assert.equal(tokens, 1)
})

test('sharepoint: an expired token triggers exactly one refresh', async () => {
  let tokens = 0
  const fetchImpl = async (url) => {
    if (String(url).includes('login.microsoftonline')) {
      tokens++
      return new Response(JSON.stringify({ access_token: 'a', expires_in: 0 }), { headers: { 'content-type': 'application/json' } })
    }
    return new Response(JSON.stringify({ value: [] }), { headers: { 'content-type': 'application/json' } })
  }
  const sp = new SharePoint({ tenantId: 't', clientId: 'c', clientSecret: 's', fetch: fetchImpl })
  await sp.ping(); await sp.ping()
  assert.equal(tokens, 2, 'a zero-lifetime token is refreshed every call')
})

test('sharepoint: a quote in the search text cannot terminate the OData call', async () => {
  const { calls, fetchImpl } = recorder({ 'login.microsoftonline': { access_token: 'a', expires_in: 3600 } })
  const sp = new SharePoint({ tenantId: 't', clientId: 'c', clientSecret: 's', fetch: fetchImpl })
  await sp.searchAll('d1', "o'brien", { limit: 1 })
  const call = calls.find((c) => c.url.includes('/search('))
  assert.match(decodeURIComponent(call.url), /q='o''brien'/)
})

test('awx: launch serialises extra_vars and follows relative next links', async () => {
  const { calls, fetchImpl } = recorder({
    '/launch/': { id: 42 },
    'page=2': { results: [{ id: 2 }], next: null },
    '/job_templates/?': { results: [{ id: 1 }], next: '/api/v2/job_templates/?page=2' },
  })
  const a = new AWX({ host: 'https://awx.test', token: 't', fetch: fetchImpl })
  await a.launch(7, { extraVars: { env: 'prod' } })
  assert.equal(JSON.parse(calls.at(-1).body).extra_vars, '{"env":"prod"}')
  const all = await a.jobTemplates.all({})
  assert.equal(all.length, 2, 'followed the relative next link')
})

test('awx: waitForJob gives up rather than polling forever', async () => {
  const fetchImpl = async () => new Response(JSON.stringify({ id: 1, status: 'running' }), { headers: { 'content-type': 'application/json' } })
  const a = new AWX({ host: 'https://awx.test', token: 't', fetch: fetchImpl })
  await assert.rejects(() => a.waitForJob(1, { timeout: 30, interval: 5 }), /still running/)
})

test('chef: the signature verifies against the public key, for both versions', () => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 })
  const key = privateKey.export({ type: 'pkcs1', format: 'pem' })
  for (const version of ['1.0', '1.3']) {
    const { headers, canonical } = signRequest({
      method: 'GET', path: '/organizations/acme/nodes', userId: 'bot', key, version,
      timestamp: '2026-09-09T10:00:00Z',
    })
    const sig = Buffer.from(
      Object.keys(headers).filter((k) => k.startsWith('x-ops-authorization-'))
        .sort((a, b) => Number(a.split('-').pop()) - Number(b.split('-').pop()))
        .map((k) => headers[k]).join(''), 'base64')
    const ok = version === '1.0'
      ? crypto.publicDecrypt({ key: publicKey, padding: crypto.constants.RSA_PKCS1_PADDING }, sig).toString() === canonical
      : crypto.verify('sha256', Buffer.from(canonical), { key: publicKey, padding: crypto.constants.RSA_PKCS1_PADDING }, sig)
    assert.ok(ok, `version ${version} signature round-trips`)
    assert.equal(headers['x-ops-sign'], `algorithm=${version === '1.0' ? 'sha1' : 'sha256'};version=${version}`)
  }
})

test('chef: the canonical path matches what the server normalises to', () => {
  assert.equal(canonicalPath('/organizations/acme//nodes/'), '/organizations/acme/nodes')
  assert.equal(canonicalPath('/'), '/')
})

test('chef: an unknown signing version is refused up front', () => {
  const { privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 })
  assert.throws(
    () => signRequest({ method: 'GET', path: '/x', userId: 'u', key: privateKey.export({ type: 'pkcs1', format: 'pem' }), version: '9.9' }),
    ValidationError)
})

test('registry: every connector is constructible from a complete environment', () => {
  const env = {
    SERVICENOW_INSTANCE: 'dev1', SERVICENOW_TOKEN: 't',
    CONFLUENCE_SITE: 'acme', CONFLUENCE_EMAIL: 'e', CONFLUENCE_API_TOKEN: 't',
    SHAREPOINT_ACCESS_TOKEN: 't',
    BOX_ACCESS_TOKEN: 't',
    AWX_HOST: 'https://awx.test', AWX_TOKEN: 't',
    CHEF_SERVER_URL: 'https://chef.test', CHEF_ORG: 'o', CHEF_CLIENT_NAME: 'c',
    CHEF_KEY: crypto.generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey.export({ type: 'pkcs1', format: 'pem' }),
  }
  for (const name of connectorNames()) {
    assert.equal(checkEnv(name, env).ok, true, `${name} reports configured`)
    assert.ok(connect(name, {}, env), `${name} constructs`)
  }
})

test('registry: a missing credential is reported, not discovered later', () => {
  const { ok, missing } = checkEnv('servicenow', { SERVICENOW_INSTANCE: 'dev1' })
  assert.equal(ok, false)
  assert.match(missing.join(' '), /SERVICENOW_TOKEN OR SERVICENOW_USERNAME/)
})
