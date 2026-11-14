<a href="https://github.com/vigogami"><img src="assets/header.svg" width="100%" alt="Victor Antinori Broce (@vigogami), data and integration architect. I connect the systems companies already run, and add AI to them."></a>

**Data & integration architect, and the author of [Kitsuden](https://github.com/Kitsuden/kitsuden).** Most of my work sits between systems: getting data out of the programs a company already runs, moving it where it is useful, and putting AI on top without rewriting what works. Kitsuden is that experience turned into open source: the backend I wanted for letting AI agents into real systems safely.

### Open source: Kitsuden and its ecosystem

Kitsuden is the project I am proudest of. Around it: **kons** to add features with one command, **tallao** for the interfaces, and **Inti** to edit Astro sites in place.

<a href="https://kitsuden.github.io/kitsuden/"><img src="assets/kitsuden.svg" width="49%" alt="Kitsuden: backend for AI agents. Declare a model once and get REST, MCP tools and admin, with human approval."></a> <a href="https://kitsuden.github.io/kitsuden-kons/"><img src="assets/kons.svg" width="49%" alt="kitsuden-kons: installable modules for Kitsuden. Add a blog, a CRM or payments with one command."></a>

<a href="https://tallao-ui.github.io/tallao/"><img src="assets/tallao.svg" width="49%" alt="tallao: Svelte 5 UI kit for generative interfaces."></a> <a href="https://intijs.github.io/inti/"><img src="assets/inti.svg" width="49%" alt="Inti.js: AI for any CMS, without changing the CMS. On-page editing for Astro."></a>

<p align="center"><sub>
Code: <a href="https://github.com/Kitsuden/kitsuden">Kitsuden/kitsuden</a> ·
<a href="https://github.com/Kitsuden/kitsuden-kons">Kitsuden/kitsuden-kons</a> ·
<a href="https://github.com/tallao-ui/tallao">tallao-ui/tallao</a> ·
<a href="https://github.com/IntiJS/inti">IntiJS/inti</a>
</sub></p>

### How Kitsuden is designed

```mermaid
flowchart TB
  subgraph callers["Who calls"]
    direction LR
    agent["AI agent<br/>scoped key"]
    site["Astro site<br/>edited with Inti"]
    human["Reviewer<br/>admin on tallao"]
  end
  subgraph kit["Kitsuden"]
    direction LR
    api["REST + MCP + admin<br/>from one model"] --> perm{"Scopes and<br/>permissions"}
    perm -- "safe" --> exec["Execute<br/>+ audit log"]
    perm -- "risky" --> queue["Approval<br/>queue"]
    queue -- "approved" --> exec
  end
  kons["kons<br/>blog · CRM · payments"]
  db[("PostgreSQL<br/>row-level security")]
  agent --> api
  site --> api
  human -- "approve or reject" --> queue
  kons -. "one command" .-> kit
  exec --> db
```

- **An agent gets a key, never the database password.** Every key has scopes and every call lands in the audit log.
- **Declare a model once.** REST, MCP tools and the admin panel come from the same declaration, so they cannot drift apart.
- **Risky actions wait for a human.** The agent proposes; a person approves or rejects.
- **The database enforces isolation.** PostgreSQL row-level security, not just checks in application code.
- **The source of truth stays where it is.** Inti saves an edit back to the CMS the content came from.

### What I do at work

- **Data platform:** ELT pipelines into a data warehouse, orchestrated as flows, with APIs over the BI layer.
- **Integrations:** legacy systems, web services and new web apps (CRM, intranet, workflow) talking to each other.
- **AI on existing programs:** agents for data reconciliation and operations, OCR for documents, added to tools people already use.
- **Legacy modernization:** migrating and archiving old finance systems without losing their history.

### Activity

<img src="https://raw.githubusercontent.com/vigogami/vigogami/output/trail.svg" width="100%" alt="Contribution trail: the contribution grid of the last year with an animated trail.">
<img src="https://raw.githubusercontent.com/vigogami/vigogami/output/stats.svg" width="100%" alt="Total contributions, current streak and longest streak.">

### Toolbox

<p>
<img alt="Python" src="https://img.shields.io/badge/Python-18181b?style=for-the-badge&logo=python&logoColor=3776AB">
<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-18181b?style=for-the-badge&logo=typescript&logoColor=3178C6">
<img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-18181b?style=for-the-badge&logo=postgresql&logoColor=4169E1">
<img alt="Prefect" src="https://img.shields.io/badge/Prefect-18181b?style=for-the-badge&logo=prefect&logoColor=FFFFFF">
<img alt="Django" src="https://img.shields.io/badge/Django-18181b?style=for-the-badge&logo=django&logoColor=44B78B">
<img alt="Docker" src="https://img.shields.io/badge/Docker-18181b?style=for-the-badge&logo=docker&logoColor=2496ED">
<img alt="Svelte" src="https://img.shields.io/badge/Svelte_5-18181b?style=for-the-badge&logo=svelte&logoColor=FF3E00">
<img alt="Astro" src="https://img.shields.io/badge/Astro-18181b?style=for-the-badge&logo=astro&logoColor=BC52EE">
<img alt="MCP" src="https://img.shields.io/badge/MCP-18181b?style=for-the-badge&logo=anthropic&logoColor=D97757">
</p>

<sub>The cards above are SVGs drawn by <a href="scripts/build.mjs">scripts/build.mjs</a>; the activity cards are redrawn every day by a GitHub Action from public contribution data.</sub>
