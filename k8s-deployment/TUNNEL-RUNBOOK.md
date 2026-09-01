# Runbook: putting a domain in front of this cluster with a Cloudflare Tunnel

Written after doing it for `pulplabs.ai` on 1 September 2026. Every command here
was actually run, and every trap in the Troubleshooting section is one that was
actually hit rather than one imagined for completeness.

If you are an assistant picking this up in a new session, read **Facts about
this setup** first. It tells you what already exists so you do not recreate it.

---

## Facts about this setup

| | |
|---|---|
| Domain | `pulplabs.ai`, registered at **GoDaddy**, DNS delegated to **Cloudflare** |
| Cluster | single node `stallion`, `192.168.1.5`, **amd64**, k8s v1.31, containerd |
| Namespace | `pulplabs` |
| Site Service | `pulplabs-site` (NodePort 30081, also has a ClusterIP) |
| Tunnel name | `pulplabs` |
| Tunnel ID | `8dc51ea9-1dca-4f72-b38d-a836f0b6f7d5` |
| Credentials | `~/.cloudflared/8dc51ea9-1dca-4f72-b38d-a836f0b6f7d5.json` on Akshay's Mac |
| In cluster | Secret `cloudflared-creds`, ConfigMap `cloudflared-config`, Deployment `cloudflared` |
| Other tunnel | `minio` also runs on this box. **Not ours.** Leave it alone. |
| Ingress | ingress-nginx exists; the tunnel does **not** use it (see step 6) |
| cert-manager | **not installed.** TLS comes from Cloudflare's edge |

The node has no static IP and goes offline fairly often. That is a fact to
design around, not a thing to be surprised by.

---

## Why a tunnel and not an A record

The obvious approach is a Cloudflare A record kept current by dynamic DNS. It
needs the router to forward ports 80 and 443 inbound to the node. Most Indian
residential ISPs use **CGNAT**, where the public IP is shared and inbound
forwarding is unavailable at any price. DDNS does not rescue that: it points a
name at an address that still refuses connections.

`cloudflared` dials **outward** and holds the connection open, so requests
arrive back down that pipe:

- no inbound ports, no forwarding, no firewall holes
- works behind CGNAT
- a changing IP stops mattering, and the DDNS becomes unnecessary for this
- the home IP is never published in DNS
- TLS terminates at Cloudflare's edge, which is also how a cluster with no
  cert-manager gets HTTPS

---

## Step 1. Delegate the domain to Cloudflare

1. Cloudflare dashboard, **Add a domain**, free plan is enough.
2. It shows two nameservers.
3. At GoDaddy, change the nameservers to those two. GoDaddy stays the
   registrar; only DNS moves. Usually live within the hour.

`.ai` works fine for this.

Cloudflare imports whatever records it finds, including the registrar's parking
records. Those matter in step 4.

## Step 2. Install cloudflared

```bash
brew install cloudflared
```

## Step 3. Create the tunnel from the CLI, not the dashboard

**The Zero Trust dashboard asks for a credit card before it will create a
tunnel. The CLI does not.** It authenticates against the zone API instead, and
the free tier covers it. This is the single most useful thing in this document.

```bash
cloudflared tunnel login          # opens a browser; authorise the zone
cloudflared tunnel create pulplabs
cloudflared tunnel list           # confirm it exists
```

`login` writes `~/.cloudflared/cert.pem`. `create` writes
`~/.cloudflared/<TUNNEL_ID>.json`, which is the tunnel's **private key**.
Anyone holding it can impersonate the tunnel. Never commit it.

Going through the CLI makes this a **locally managed** tunnel, which means
routing lives in a ConfigMap in this repo rather than in the dashboard. That is
the better half of the bargain: reviewable, versioned, and deployed with
everything else.

## Step 4. Point the hostnames at the tunnel

```bash
cloudflared tunnel route dns --overwrite-dns pulplabs www.pulplabs.ai
cloudflared tunnel route dns --overwrite-dns pulplabs pulplabs.ai
```

**The apex will probably fail the first time** with:

```
code: 1003 ... An A, AAAA, or CNAME record with that host already exists
```

`--overwrite-dns` replaces **one** conflicting record. Cloudflare had imported
**two** proxied A records for the apex from GoDaddy, and it errors rather than
picking one. Delete both A records for `pulplabs.ai` (shown as `@`) in
**DNS → Records**, then re-run the command.

Check for MX and TXT records before deleting anything. On this zone there were
none, so removing the A records broke no email. Do not assume that next time.

Note that `dig` cannot tell you whether this worked: proxied records always
resolve to Cloudflare edge IPs whether the underlying record is an A or a CNAME.
The route command succeeding is the signal.

## Step 5. Load the credentials into the cluster

```bash
kubectl create secret generic cloudflared-creds -n pulplabs \
  --from-file=credentials.json=$HOME/.cloudflared/8dc51ea9-1dca-4f72-b38d-a836f0b6f7d5.json
```

## Step 6. Deploy cloudflared

`kubectl apply -f k8s-deployment/cloudflared.yaml`. That file holds a ConfigMap
with the routing and a Deployment with two replicas.

The routing points **straight at the site Service**, not at ingress-nginx:

```yaml
ingress:
  - hostname: pulplabs.ai
    service: http://pulplabs-site.pulplabs.svc.cluster.local:80
  - hostname: www.pulplabs.ai
    service: http://pulplabs-site.pulplabs.svc.cluster.local:80
  - service: http_status:404      # required; cloudflared will not start without it
```

Both work, but going direct is one hop shorter and keeps ingress-nginx out of
the path entirely, which avoids the redirect loop described in Troubleshooting.
Switch to `ingress-nginx-controller.ingress-nginx.svc.cluster.local:80` only
when one tunnel needs to carry several sites and you would rather route with
Ingress rules than with the list above.

Two replicas so a pod restart does not take the site off the internet.

## Step 7. Confirm the tunnel connected

```bash
kubectl rollout status deploy/cloudflared -n pulplabs
kubectl logs -n pulplabs deploy/cloudflared --tail=20 | grep "Registered tunnel connection"
cloudflared tunnel info pulplabs
```

Healthy output names edge locations, e.g. `1xbom09, 1xbom12, 2xmaa05`.

## Step 8. Cloudflare settings

- **SSL/TLS → Overview → Full**
- **SSL/TLS → Edge Certificates → Always Use HTTPS.** Without it
  `http://pulplabs.ai` answers 200 instead of redirecting.
- **Caching → Configuration → Always Online** is worth enabling here. It serves
  a cached copy when the origin is unreachable, which given how often this node
  drops turns error 1033 into a slightly stale page. It does not help `/api/*`.

## Step 9. Rebuild the image for the real domain

**Do not skip this.** `NEXT_PUBLIC_SITE_URL` is compiled into the browser bundle
at build time. Until the image is rebuilt, the live sitemap and `og:url` still
advertise whatever the last build used, which here was `http://192.168.1.5:30081`
— a LAN address, published to anything that crawled the domain. No ConfigMap
edit can fix it.

```bash
docker buildx create --name incluster --driver kubernetes \
  --driver-opt namespace=pulplabs,replicas=1 --platform linux/amd64
docker buildx build --builder incluster --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_SITE_URL=https://pulplabs.ai \
  --build-arg NEXT_PUBLIC_WHATSAPP=919448055577 \
  -t ak3hay/pulplabs-site:$(git rev-parse --short HEAD)-amd64 --push .
docker buildx rm incluster
```

Then bump the tag in `kustomization.yaml` **and** `seed-job.yaml`, and
`kubectl apply -k k8s-deployment`.

(The build runs inside the cluster because amd64 cannot be cross-built on an
Apple Silicon Mac; see the main README for why.)

## Step 10. Verify on the real domain

```bash
for p in / /team /careers /services /api/health; do
  echo "$p $(curl -s -o /dev/null -w '%{http_code}' https://pulplabs.ai$p)"
done
curl -s https://pulplabs.ai/ | grep -o '<meta property="og:url" content="[^"]*"'
curl -s https://pulplabs.ai/sitemap.xml | grep -o "<loc>[^<]*</loc>" | head -3
```

`og:url` and the sitemap must say `https://pulplabs.ai`. If they say anything
else, step 9 did not happen.

---

## Troubleshooting

### Error 1033 / HTTP 530

Cloudflare has no connector registered for the tunnel. Almost always the node
is down rather than anything being misconfigured.

```bash
ping -c 2 192.168.1.5
cloudflared tunnel info pulplabs
cloudflared tunnel info minio     # the control test
```

If `minio` is also dead, the machine is the fault, not your configuration.
`minio` predates all of this, so it is a clean signal. Nothing to fix in
Cloudflare; cloudflared reconnects by itself when the box boots.

### ERR_TOO_MANY_REDIRECTS

Only if the tunnel is pointed at ingress-nginx. TLS ends at Cloudflare and
cloudflared speaks plain HTTP to the controller; ingress-nginx sees a TLS block
on the Ingress, assumes it is serving HTTPS, and 308s every request back out to
Cloudflare, which returns it as HTTP. Infinite loop, and no log says why.

Fix: `nginx.ingress.kubernetes.io/ssl-redirect: "false"` on the Ingress. It is
already set in `ingress.yaml` with the reason. Turn it back on only when
cert-manager issues a real certificate and the origin genuinely serves HTTPS.

### `failed to push ... no active session ... context deadline exceeded`

The in-cluster BuildKit push. Registry credentials travel from the Mac to the
BuildKit pod over the kubectl connection, and that tunnel drops on a long push.
The build layers are fine. **Re-run the identical command**; it finishes in
under a minute off cache. If it becomes routine, mount a Docker Hub
`config.json` into the BuildKit pod so it authenticates on its own.

### The tunnel exists but a hostname 404s

The catch-all `- service: http_status:404` is matching, so no hostname rule
matched. Hostnames in the ConfigMap must match exactly; `pulplabs.ai` does not
cover `www.pulplabs.ai`. Both need their own rule and their own DNS route.

### Recreating the tunnel from scratch

```bash
kubectl delete -f k8s-deployment/cloudflared.yaml
kubectl delete secret cloudflared-creds -n pulplabs
cloudflared tunnel delete pulplabs
```

Then repeat from step 3. The DNS CNAMEs survive and will be overwritten by the
new `route dns` calls.

---

## What this does not cover

- **The database.** SQLite on `local-path` storage, node-local, no snapshot. The
  tunnel makes the site public; it does nothing for durability. Losing
  `stallion` loses the content.
- **The admin user.** Never created. `scripts/seed.mjs` only makes one when
  `ADMIN_EMAIL` and `ADMIN_PASSWORD` are both set.
- **Uptime.** A single-node cluster behind one machine that sleeps is not
  highly available, and no amount of tunnel configuration changes that.
