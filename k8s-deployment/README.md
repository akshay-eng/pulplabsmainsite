# Deploying the PulpLabs site to Kubernetes

Manifests for a single-instance deployment of the Next.js site, its SQLite
database and its uploaded files.

Image: `ak3hay/pulplabs-site` on Docker Hub. Tags are `latest`, the short git
SHA of the commit it was built from, and `arm64`.

## Building for amd64: build on the cluster

`linux/amd64` cannot be cross-built on an Apple Silicon machine. Under the QEMU
emulation buildx falls back to, `next build` segfaults:

```
qemu: uncaught target signal 11 (Segmentation fault) - core dumped
Next.js build worker exited with code: null and signal: SIGSEGV
```

Forcing a single-threaded build (`NEXT_BUILD_SINGLE_THREAD=1`, wired into the
Dockerfile and `next.config.mjs`) gets it past compilation and static generation
and it still dies afterwards. There is nothing to fix in our code.

The cluster node is amd64, so build there instead. buildx runs BuildKit as a
Deployment and streams the local build context to it, which means the build is
native, needs no git access and no registry secret in the cluster: your own
Docker Hub login travels with the request.

```bash
docker buildx create --name incluster --driver kubernetes \
  --driver-opt namespace=pulplabs,replicas=1 --platform linux/amd64
docker buildx build --builder incluster --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_SITE_URL=http://192.168.1.5:30081 \
  --build-arg NEXT_PUBLIC_WHATSAPP=919448055577 \
  -t ak3hay/pulplabs-site:$(git rev-parse --short HEAD)-amd64 --push .
docker buildx rm incluster        # frees the node; recreating takes a minute
```

Then point `kustomization.yaml` and `seed-job.yaml` at the new tag.

The push occasionally fails with `no active session ... context deadline
exceeded`. Registry credentials travel from your machine to the in-cluster
BuildKit over the kubectl connection, and that tunnel drops on a long push. The
build itself is fine and its layers are cached, so re-running the same command
finishes in under a minute. If it keeps failing, mount a Docker Hub
`config.json` into the BuildKit pod so it authenticates on its own instead.

`.github/workflows/docker.yml` does the same thing on native runners and
produces a proper multi-arch manifest, which is the better answer once the
Docker Hub secrets are set on the repository.

**Tags on Docker Hub are not interchangeable.** `:latest` and `:arm64` are the
arm64 build; `:amd64` and `:<sha>-amd64` are the amd64 one. Pulling `:latest`
onto this cluster fails with `no matching manifest for linux/amd64`. Tags are
also pinned rather than floating because `imagePullPolicy: IfNotPresent` never
re-pulls a tag the node already has, so a redeploy on `:latest` would silently
keep serving the old image.

## Deployed on `stallion` (192.168.1.5)

Live at **http://192.168.1.5:30081**.

| | |
|---|---|
| Namespace | `pulplabs` |
| Node | `stallion`, single control-plane, **amd64**, k8s v1.31 |
| Storage | `local-path` (the default class), 5Gi, `WaitForFirstConsumer` |
| Exposure | NodePort **30081**, pinned so the URL survives a redeploy |
| Ingress | Applied, `pulplabs.ai`, class `nginx` |

Two things to know about this cluster specifically:

- **No cert-manager.** The `cert-manager.io/cluster-issuer` annotation on the
  Ingress resolves to nothing, so `pulplabs-tls` is never created and nginx
  serves its own default certificate. The TLS block is left in as the shape to
  keep; install cert-manager and it starts working. Until then use the NodePort.
- **`local-path` storage is node-local.** The database lives in a directory on
  `stallion`. Losing that node loses the content, and no volume snapshot exists.
  Take backups (below) rather than assuming the PVC is durable.

`NEXT_PUBLIC_SITE_URL` is baked into the deployed image as
`http://192.168.1.5:30081` so in-page absolute URLs and OG tags resolve on the
LAN. A production image needs a rebuild with the real domain.

## First deploy

```bash
# 1. Credentials. Never commit the result; secret.yaml is gitignored.
cp secret.example.yaml secret.yaml
$EDITOR secret.yaml

# 2. Namespace and volume, before anything that mounts them.
kubectl apply -f namespace.yaml
kubectl apply -f pvc.yaml
kubectl apply -f secret.yaml

# 3. Everything else.
kubectl apply -k .

# 4. Seed the empty volume with the posts and case studies.
#    The site must be down for this. SQLite is single-writer and the volume is
#    ReadWriteOnce, so the Job and the pod cannot both hold it.
kubectl scale deploy/pulplabs-site -n pulplabs --replicas=0
kubectl wait --for=delete pod -n pulplabs -l app.kubernetes.io/name=pulplabs-site --timeout=90s
kubectl apply -f seed-job.yaml
kubectl wait --for=condition=complete job/pulplabs-seed -n pulplabs --timeout=300s
kubectl scale deploy/pulplabs-site -n pulplabs --replicas=1

# 5. The admin login is NOT created by the step above, because seed.mjs only
#    makes one when both variables are present and the password should be
#    yours rather than something generated into a file:
#      kubectl set env job/pulplabs-seed ... is no use once a Job has run, so
#    edit seed-job.yaml to add ADMIN_EMAIL and ADMIN_PASSWORD (12+ characters),
#    delete the finished Job and re-apply it with the site scaled to zero.

kubectl rollout status deploy/pulplabs-site -n pulplabs
```

## The trap: NEXT_PUBLIC_* is baked at build time

`NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_WHATSAPP` are substituted into the
client bundle by the compiler. They are **not** in the ConfigMap, because
setting them there does nothing at all: the strings are already inside the
JavaScript the browser downloads. They are build arguments.

Changing either one needs a new image:

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --build-arg NEXT_PUBLIC_SITE_URL=https://pulplabs.ai \
  --build-arg NEXT_PUBLIC_WHATSAPP=919448055577 \
  -t ak3hay/pulplabs-site:latest \
  -t ak3hay/pulplabs-site:$(git rev-parse --short HEAD) \
  --push .
```

`NEXT_PUBLIC_WHATSAPP` is the one to watch. `StartCta` degrades to a plain link
to `/contact` when it is empty, so a forgotten build arg does not error; it just
quietly removes the WhatsApp deep link from every CTA on mobile. Check a
rendered `href` after any rebuild.

## Configuration

| Where | What | Why there |
|---|---|---|
| Build args | `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP` | Compiled into the browser bundle |
| `configmap.yaml` | Paths, ports, LLM model, enquiry recipients | Not secret, changeable without a rebuild |
| `secret.yaml` | `SESSION_SECRET`, `API_TOKEN`, `GROQ_API_KEY`, `RESEND_API_KEY`, SMTP | Live credentials |

Two things worth knowing about the runtime config:

- **The assistant.** Groq's free tier allows 8000 tokens a minute for the whole
  deployment and the grounding prompt costs about 2300, so roughly three
  questions a minute reach the model and the rest are served by the offline
  intent matcher in `src/lib/assistant.js`. That fallback is accurate, but it is
  a fallback. Raise the tier before launch if the assistant matters.
- **Mail.** `ENQUIRY_RECIPIENTS` lists one address because Resend rejects the
  entire request, delivering to nobody, if any single recipient is unverified.
  Add the second address once the domain is verified in Resend. Losing mail
  never loses a lead: both `/api/enquiry` and `/api/apply` write to the database
  before they try to send.

## Probes

Readiness hits `/api/health`, which opens the database and runs `select 1`. A
pod that cannot read its content is taken out of the Service.

Liveness is a **TCP check, not that endpoint**, and deliberately so. Restarting
the container does nothing for a broken volume; pointing liveness at a database
check turns one storage fault into a crash loop that buries the real error.

## Putting pulplabs.ai in front of it

The node has no static IP, so the answer is a **Cloudflare Tunnel**, not a
Cloudflare A record.

An A record plus dynamic DNS needs your router to forward ports 80 and 443
inbound. Most Indian residential connections sit behind CGNAT, where the public
IP is shared and inbound forwarding is not available at any price. DDNS does not
rescue that: it points a name at an address that still refuses connections.

`cloudflared` dials **out** and holds the connection open, so requests arrive
back down that pipe. No inbound ports, no forwarding, works behind CGNAT, the
changing IP stops mattering, and the home IP is never published. TLS terminates
at Cloudflare's edge, which also settles this cluster having no cert-manager.

**The step-by-step runbook is [TUNNEL-RUNBOOK.md](TUNNEL-RUNBOOK.md).** Start
there for anything to do with the domain: creating the tunnel, the DNS records,
deploying cloudflared, and every trap that came up doing it the first time.

The short version: add the domain to Cloudflare, point GoDaddy's nameservers at
it (GoDaddy stays the registrar), create the tunnel **from the CLI rather than
the Zero Trust dashboard, which asks for a credit card**, load its credentials
as a Secret, apply the manifest, and set SSL/TLS to Full.

Three things that are easy to get wrong:

- **`ssl-redirect` must be off.** It is already set in `ingress.yaml` with the
  reason. TLS ends at Cloudflare and cloudflared speaks HTTP to nginx; if
  ingress-nginx thinks it is serving HTTPS it 308-redirects every request back
  out to Cloudflare, which returns it as HTTP, forever. The browser reports
  ERR_TOO_MANY_REDIRECTS and no log says why.
- **`NEXT_PUBLIC_SITE_URL` needs a rebuild.** The deployed image has
  `http://192.168.1.5:30081` compiled into it, so canonical links, OG tags and
  the sitemap will all point at a LAN address. Rebuild with
  `https://pulplabs.ai` when the domain is live. It is a build argument, not
  something a ConfigMap can change.
- **Keep the NodePort.** It stays useful for reaching the site from the LAN when
  the tunnel or Cloudflare is the thing that is broken.

The tunnel points at ingress-nginx rather than at the site Service directly, so
the existing Ingress rules do the host routing and a single tunnel can carry
preso and anything else added later.

## Storage

`pvc.yaml` requests 5Gi with no `storageClassName`, so the cluster default is
used. Check yours with `kubectl get storageclass`. Set it explicitly if there is
no default, or if you want a class that survives node loss: with local-path
storage on a single node, losing the node loses the database.

Back it up by copying the file out; SQLite is one file:

```bash
kubectl exec -n pulplabs deploy/pulplabs-site -- \
  sqlite3 /data/pulplabs.db ".backup /tmp/backup.db"
kubectl cp pulplabs/$(kubectl get pod -n pulplabs -o name | cut -d/ -f2):/tmp/backup.db ./backup.db
```

Use `.backup` rather than `cp` on the live file, which can copy a torn page
mid-write.

## Ingress

`ingress.yaml` assumes ingress-nginx and cert-manager, with a `letsencrypt-prod`
ClusterIssuer. On Traefik, GKE ingress or an AWS ALB controller, the annotations
and `ingressClassName` are what change; the rules stay.

`proxy-body-size: 10m` is there for CV uploads. The nginx default of 1MB
rejects a PDF résumé with a bare 413 that the candidate cannot act on.

## Security posture

The container runs as UID 10001, non-root, with no privilege escalation and
every capability dropped. `/data` is the PersistentVolumeClaim; `/tmp` and
`.next/cache` are emptyDirs, which keeps that churn off the container's writable
layer where it would grow until the node evicted the pod under disk pressure.

`readOnlyRootFilesystem` is deliberately **off**, and that was tested rather
than assumed. Four routes use ISR (the home page, the feed, blog posts and case
studies, all revalidating from SQLite) and Next writes each regenerated page
back into `/app/.next/server/app`. Under a read-only root that write fails with
`Failed to update prerender cache for /index [Error: EROFS]` on every
revalidation: pages still render, so it degrades quietly into re-rendering
everything from the database while filling the log with errors that look like a
fault and are not. Mounting a volume over `.next/server` would shadow the built
output and break the app outright.

A `.dockerignore` was added alongside these manifests. Before it, `COPY . .`
pulled `.env.local` into an image layer, so anyone who pulled the image could
read the Resend and Groq keys straight out of it. If any image was pushed from
this repo before that fix, treat those keys as public and rotate them.
