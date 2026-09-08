import { ServiceNow } from './itsm/servicenow.js'
import { Confluence } from './docs/confluence.js'
import { SharePoint } from './docs/sharepoint.js'
import { Box } from './docs/box.js'
import { AWX } from './automation/awx.js'
import { Chef } from './automation/chef.js'
import { ValidationError } from './core/errors.js'

export { ServiceNow, Confluence, SharePoint, Box, AWX, Chef }
export * from './core/index.js'

/* The registry.
 *
 * `env` maps the variables each connector reads. It is data rather than
 * scattered process.env lookups so that the probe CLI and the docs can both be
 * generated from it, and so a missing variable is reported as a list rather
 * than discovered one restart at a time.
 */
export const CONNECTORS = {
  servicenow: {
    kind: 'itsm', Ctor: ServiceNow,
    env: { instance: 'SERVICENOW_INSTANCE', username: 'SERVICENOW_USERNAME', password: 'SERVICENOW_PASSWORD', token: 'SERVICENOW_TOKEN' },
    requiredAll: ['instance'],
    oneOf: [['token'], ['username', 'password']],
  },
  confluence: {
    kind: 'docs', Ctor: Confluence,
    env: { site: 'CONFLUENCE_SITE', email: 'CONFLUENCE_EMAIL', apiToken: 'CONFLUENCE_API_TOKEN' },
    requiredAll: ['site', 'email', 'apiToken'],
  },
  sharepoint: {
    kind: 'docs', Ctor: SharePoint,
    env: { tenantId: 'SHAREPOINT_TENANT_ID', clientId: 'SHAREPOINT_CLIENT_ID', clientSecret: 'SHAREPOINT_CLIENT_SECRET', accessToken: 'SHAREPOINT_ACCESS_TOKEN' },
    oneOf: [['tenantId', 'clientId', 'clientSecret'], ['accessToken']],
  },
  box: {
    kind: 'docs', Ctor: Box,
    env: { accessToken: 'BOX_ACCESS_TOKEN' },
    requiredAll: ['accessToken'],
  },
  awx: {
    kind: 'automation', Ctor: AWX,
    env: { host: 'AWX_HOST', token: 'AWX_TOKEN', username: 'AWX_USERNAME', password: 'AWX_PASSWORD', insecure: 'AWX_INSECURE' },
    requiredAll: ['host'],
    oneOf: [['token'], ['username', 'password']],
  },
  chef: {
    kind: 'automation', Ctor: Chef,
    env: { serverUrl: 'CHEF_SERVER_URL', org: 'CHEF_ORG', clientName: 'CHEF_CLIENT_NAME', key: 'CHEF_KEY', signingVersion: 'CHEF_SIGNING_VERSION' },
    requiredAll: ['serverUrl', 'org', 'clientName', 'key'],
  },
}

/** Reads a connector's config out of an environment object. */
export function configFromEnv(name, env = process.env) {
  const spec = CONNECTORS[name]
  if (!spec) throw new ValidationError(`unknown connector ${JSON.stringify(name)}`)
  const cfg = {}
  for (const [key, varName] of Object.entries(spec.env)) {
    const v = env[varName]
    if (v !== undefined && v !== '') cfg[key] = key === 'insecure' ? v === 'true' : v
  }
  return cfg
}

/**
 * Reports what is missing without throwing, so a health check can list every
 * unconfigured connector at once rather than failing on the first.
 * @returns {{ok: boolean, missing: string[]}}
 */
export function checkEnv(name, env = process.env) {
  const spec = CONNECTORS[name]
  const cfg = configFromEnv(name, env)
  /* Two distinct things, kept apart because conflating them produced a message
     saying ServiceNow needed "an instance OR a password", which is nonsense:
     it needs the instance AND one of the credential pairs.
       requiredAll — every one of these must be present
       oneOf       — at least one of these sets must be satisfied */
  const missing = []
  for (const k of spec.requiredAll ?? []) {
    if (cfg[k] === undefined) missing.push(spec.env[k])
  }
  const alts = spec.oneOf ?? []
  if (alts.length && !alts.some((g) => g.every((k) => cfg[k] !== undefined))) {
    missing.push(alts.map((g) => g.map((k) => spec.env[k]).join(' + ')).join(' OR '))
  }
  return { ok: missing.length === 0, missing }
}

/** Builds a connector from the environment. */
export function connect(name, overrides = {}, env = process.env) {
  const spec = CONNECTORS[name]
  if (!spec) throw new ValidationError(`unknown connector ${JSON.stringify(name)}`)
  const { ok, missing } = checkEnv(name, env)
  if (!ok && !Object.keys(overrides).length) {
    throw new ValidationError(`${name}: missing configuration — ${missing.join(', ')}`, { connector: name })
  }
  return new spec.Ctor({ ...configFromEnv(name, env), ...overrides })
}

export const connectorNames = () => Object.keys(CONNECTORS)
