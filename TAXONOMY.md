# Content taxonomy — how the categories link together

How the site's category systems relate, mapped from the data files. Three axes lead into the
same 17 solutions — **practice area** (`parent`), **function** (`fn`, exactly one per
solution), and **industry** (curated many-to-many) — plus a **status** axis (production vs
scoped). Sources: [`src/data/capabilities.js`](src/data/capabilities.js),
[`src/data/functions.js`](src/data/functions.js), [`src/data/clients.js`](src/data/clients.js),
the `case_studies` table.

## 1. The catalogue: practice areas × solutions × functions

```mermaid
flowchart LR
  classDef prod fill:#dcfce7,stroke:#16a34a,color:#14532d
  classDef scope fill:#fef9c3,stroke:#ca8a04,color:#713f12
  classDef practice fill:#e0e7ff,stroke:#4f46e5,color:#312e81
  classDef fn fill:#fae8ff,stroke:#a21caf,color:#701a75
  classDef people fill:#f1f5f9,stroke:#94a3b8,color:#334155

  subgraph P["Practice areas — how you engage · /services"]
    ADV["Advisory & strategy<br/>(tracks → /services/advisory)"]:::people
    ACC["Enterprise accelerators"]:::practice
    SB["Small business systems"]:::practice
    EN["Enablement & workshops<br/>(tracks → /services/enablement)"]:::people
    MG["Managed operations<br/>(tracks → /services/managed)"]:::people
  end

  subgraph S["Solutions — 17 · /services/#lt;slug#gt;"]
    II["Incident Intelligence"]:::prod
    CC["Change Copilot"]:::prod
    PO["Patch Orchestrator"]:::prod
    AM["Agent Migration"]:::prod
    IR["Invoice Recon"]:::scope
    CR["Contract Review"]:::scope
    RA["Report Assembly"]:::scope
    ME["Metric Explainer"]:::scope
    LE["Lead Engine"]:::prod
    PB["Proposal Builder"]:::scope
    PV["Pipeline Review"]:::scope
    SD["Support Desk"]:::prod
    KG["Knowledge Gap Finder"]:::scope
    VT["Voice Triage"]:::scope
    MS["Marketing Studio"]:::prod
    SO["Social Autopilot"]:::prod
    CF["Content Refresh"]:::scope
  end

  subgraph F["Functions — by team · /services/for/#lt;id#gt;"]
    FIT["IT Operations"]:::fn
    FSA["Sales"]:::fn
    FSU["Customer Support"]:::fn
    FMA["Marketing"]:::fn
    FFI["Finance & Back office"]:::fn
    FDA["Data & Reporting"]:::fn
  end

  ACC --> II & CC & PO & AM & IR & CR & RA & ME
  SB --> LE & PB & PV & SD & KG & VT & MS & SO & CF

  II & CC & PO & AM --> FIT
  LE & PB & PV --> FSA
  SD & KG & VT --> FSU
  MS & SO & CF --> FMA
  IR & CR --> FFI
  RA & ME --> FDA
```

**Legend:** green = `status: 'production'` (badge "Accelerator", 8 of 17) · yellow =
`status: 'scope'` ("Built to scope", 9) · grey = practices that hold people-work *tracks*
rather than solutions. Every solution has **exactly one** parent and **exactly one** function
(`byParent()` / `byFunction()` in `capabilities.js`).

## 2. Industries — the third lens (curated many-to-many)

Industries do not own solutions; each hand-picks from the same catalogue. `functions.js` is
explicit about why: *"Nothing sector-specific has been invented to fill a grid."*

```mermaid
flowchart LR
  classDef ind fill:#ffe4e6,stroke:#e11d48,color:#881337
  S["The same 17 solutions"]
  FIN["Financial services"]:::ind -. "7 solutions" .-> S
  HC["Healthcare & life sciences"]:::ind -. "6" .-> S
  MF["Manufacturing & industrial"]:::ind -. "6" .-> S
  RT["Retail & e-commerce"]:::ind -. "7" .-> S
  PS["Professional services"]:::ind -. "6" .-> S
  PB2["Public sector"]:::ind -. "6" .-> S
```

Functions **and** industries resolve through the same route — `/services/for/<id>` — with the
entry's `kind` deciding the "By team" / "By sector" framing on the page.

## 3. How the surfaces wire into these categories

```mermaid
flowchart TD
  classDef page fill:#e0f2fe,stroke:#0284c7,color:#0c4a6e
  classDef data fill:#f1f5f9,stroke:#94a3b8,color:#334155

  HOME["/ Home"]:::page
  SERV["/services hub"]:::page
  SOL["/services/#lt;slug#gt;"]:::page
  FOR["/services/for/#lt;id#gt;"]:::page
  CSD["/case-studies/#lt;slug#gt;"]:::page
  BLOG["/blog"]:::page

  HOME -->|"Function explorer (tabs = 6 functions)"| FOR
  HOME -->|"SolCards + Blueprints"| SOL
  HOME -->|"Case studies tabs"| CSD
  SERV -->|"5-practice accordion"| SOL
  SERV -->|"CategoryPicker: By team / By sector"| FOR
  FOR -->|"solution cards"| SOL

  CL["clients.js — 4 clients"]:::data
  CL -->|"logo belt + Voices testimonials"| HOME
  CL -->|"client field"| CSD
  DB["case_studies table<br/>industry label: Manufacturing · Research"]:::data --> CSD
  BC["Blog categories: Enablement · Engineering ·<br/>Field notes · Playbook (+ tags)"]:::data --> BLOG
```

## Observations

1. **The two solution-owning practices split by buyer, not by technology.** `accelerators` is
   the enterprise book (IT operations plus finance/data back office); `small-business` is the
   revenue side (sales, support, marketing). The other three practices sell people, not
   systems.
2. **The status axis maps the delivery record.** All four IT Operations solutions are
   `production`; every finance and data solution is `scope`. The badge distribution shows
   exactly where the firm has actually run.
3. **One loose thread.** `case_studies.industry` is a free-text label (`Manufacturing`,
   `Research`) with no link to the industries taxonomy — `Research` has no corresponding
   sector page at all. If case studies should ever surface on industry pages, that column
   needs to reference `industries[].id` instead of holding prose.
