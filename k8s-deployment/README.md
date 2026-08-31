# Deploying the PulpLabs site to Kubernetes

Manifests for a single-instance deployment of the Next.js site, its SQLite
database and its uploaded files.

Image: `ak3hay/pulplabs-site` on Docker Hub. Tags are `latest`, the short git
SHA of the commit it was built from, and `arm64`.

## Read this before you deploy: the published image is arm64 only

The image on Docker Hub today is **`linux/arm64` only**. It was built and smoke
tested on an Apple Silicon machine, where arm64 is native.

`linux/amd64` could not be built there. Cross-building it runs the whole
toolchain under QEMU and `next build` segfaults partway through:

```
qemu: uncaught target signal 11 (Segmentation fault) - core dumped
Next.js build worker exited with code: null and signal: SIGSEGV
```

Forcing a single-threaded build (`NEXT_BUILD_SINGLE_THREAD=1`, wired into the
Dockerfile and `next.config.mjs`) gets it past compilation and static
generation, and it still dies afterwards. This is emulation, not our code.

**So check what your nodes are before deploying:**

```bash
kubectl get nodes -o wide   # look at the ARCH column
```

- **arm64 nodes** (Raspberry Pi, Ampere, Graviton, Docker Desktop on an M-series
  Mac): deploy as is.
- **amd64 nodes**: the pull fails with `no matching manifest for linux/amd64`.
  Build it on a native amd64 machine. `.github/workflows/docker.yml` does
  exactly that: it builds each architecture on a runner of that architecture and
  joins them into one manifest. Add `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`
  as repository secrets and run it, and `:latest` becomes multi-arch with no
  change to any manifest here.

## The one constraint that shapes everything here

The site stores its content in **SQLite**, in a single file on a volume. That is
a reasonable choice for a marketing site with two authors, and it is why these
manifests look the way they do:

- **`replicas: 1`**, and not as a placeholder to raise later. A second pod
  cannot mount a ReadWriteOnce volume on another node, and if it lands on the
  same node it corrupts the database instead.
- **`strategy: Recreate`**, not RollingUpdate. A rolling update starts the new
  pod before stopping the old one, both want the same volume, and the rollout
  wedges in `ContainerCreating` until it times out. A few seconds of downtime
  buys a deploy that finishes.
- **No HorizontalPodAutoscaler.** There is nothing to scale to.

Scaling this out means moving to Postgres first. There is no replica count that
makes SQLite safe, so if traffic ever justifies it, that is the change to make.

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

# 4. Seed the empty volume: admin user, posts, case studies.
#    The site must be down for this. SQLite is single-writer and the volume is
#    ReadWriteOnce, so the Job and the pod cannot both hold it.
kubectl scale deploy/pulplabs-site -n pulplabs --replicas=0
kubectl apply -f seed-job.yaml
kubectl wait --for=condition=complete job/pulplabs-seed -n pulplabs --timeout=300s
kubectl scale deploy/pulplabs-site -n pulplabs --replicas=1

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
