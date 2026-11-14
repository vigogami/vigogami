#!/usr/bin/env node
// Generates the SVGs of the profile README. No dependencies, no paid service.
//
//   node scripts/build.mjs static   -> assets/header.svg and assets/<project>.svg (committed)
//   node scripts/build.mjs live     -> dist/stats.svg and dist/trail.svg (GitHub Action, daily)
//
// "live" reads public contribution data with GraphQL; it needs GITHUB_TOKEN in the
// environment (the Action's own token is enough). The token is never written anywhere.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LOGIN = process.env.PROFILE_LOGIN || "vigogami";
const NAME = "Victor Antinori Broce";

const font = (file) => readFileSync(join(ROOT, "scripts/fonts", file)).toString("base64");
const FONTS = `@font-face{font-family:'SG';src:url(data:font/woff2;base64,${font("space-grotesk.woff2")}) format('woff2');font-weight:300 700}
@font-face{font-family:'JBM';src:url(data:font/woff2;base64,${font("jetbrains-mono.woff2")}) format('woff2');font-weight:100 800}`;
const SANS = "'SG','Space Grotesk','Segoe UI',system-ui,sans-serif";
const MONO = "'JBM','JetBrains Mono',ui-monospace,Consolas,monospace";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const out = (rel, svg) => {
  const file = join(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, svg.replace(/\n\s*/g, "\n"));
  console.log(`wrote ${rel} (${(svg.length / 1024).toFixed(1)} KB)`);
};

// ---------------------------------------------------------------- header

const PROJECTS = [
  {
    id: "kitsuden",
    name: "Kitsuden",
    kind: "backend for AI agents",
    lines: ["Your agent gets a key, not the database", "password. Declare a model once: REST, MCP", "tools and admin, with human approval."],
    stack: "TypeScript · Bun · PostgreSQL · MCP",
    site: "kitsuden.github.io/kitsuden",
    colors: ["#a855f7", "#ff2d6f"],
    glyph: "kit",
  },
  {
    id: "kons",
    name: "kitsuden-kons",
    kind: "installable modules",
    lines: ["Add a blog, a CRM or payments to your", "backend with one command. Each kon brings", "tables, routes, MCP tools and permissions."],
    stack: "30 kons · TypeScript",
    site: "kitsuden.github.io/kitsuden-kons",
    colors: ["#ff2d6f", "#c084fc"],
    glyph: "kons",
  },
  {
    id: "tallao",
    name: "tallao",
    kind: "Svelte 5 UI kit",
    lines: ["A UI kit for generative interfaces.", "Plain CSS on tokens, keyboard and screen", "reader ready, SSR-ready."],
    stack: "Svelte 5 · CSS tokens",
    site: "tallao-ui.github.io/tallao",
    colors: ["#b197fc", "#ff8a3d"],
    glyph: "tallao",
  },
  {
    id: "inti",
    name: "Inti.js",
    kind: "on-page editing for Astro",
    lines: ["AI for any CMS, without changing the CMS.", "Edit on the page; it is saved back to", "WordPress, Kitsuden, Strapi or Keystatic."],
    stack: "Astro · TypeScript · beta",
    site: "intijs.github.io/inti",
    colors: ["#facc15", "#f97316", "#ef4444"],
    glyph: "inti",
  },
];

function header() {
  const W = 1200, H = 340;
  const nodes = [
    { x: 985, y: 170, r: 30, label: "Kitsuden", c: ["#a855f7", "#ff2d6f"] },
    { x: 870, y: 78, r: 15, label: "kons", c: ["#ff2d6f", "#c084fc"] },
    { x: 1112, y: 84, r: 15, label: "tallao", c: ["#b197fc", "#ff8a3d"] },
    { x: 1110, y: 262, r: 15, label: "Inti", c: ["#facc15", "#ef4444"] },
    { x: 865, y: 262, r: 15, label: "agents", c: ["#e4e4e7", "#71717a"] },
  ];
  const hub = nodes[0];
  const links = nodes.slice(1).map((n, i) => {
    const d = i === 3 ? `M${n.x} ${n.y} L${hub.x} ${hub.y}` : `M${hub.x} ${hub.y} L${n.x} ${n.y}`;
    return `<path d="${d}" stroke="url(#ln${i})" stroke-width="1.4" stroke-dasharray="3 5" fill="none"/>
      <linearGradient id="ln${i}" gradientUnits="userSpaceOnUse" x1="${hub.x}" y1="${hub.y}" x2="${n.x}" y2="${n.y}"><stop offset="0" stop-color="#a855f7" stop-opacity=".9"/><stop offset="1" stop-color="${n.c[0]}" stop-opacity=".5"/></linearGradient>
      <circle r="3.2" fill="${i === 3 ? "#fafafa" : n.c[0]}" filter="url(#soft)"><animateMotion dur="${2.6 + i * 0.45}s" begin="${i * 0.7}s" repeatCount="indefinite" path="${d}"/></circle>`;
  }).join("");
  const nodeSvg = nodes.map((n, i) => `
    <linearGradient id="nd${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${n.c[0]}"/><stop offset="1" stop-color="${n.c[1]}"/></linearGradient>
    <circle cx="${n.x}" cy="${n.y}" r="${n.r + 10}" fill="url(#nd${i})" opacity=".14" class="pulse" style="animation-delay:${i * 0.6}s;transform-origin:${n.x}px ${n.y}px"/>
    <circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="#09090b" stroke="url(#nd${i})" stroke-width="2.2"/>
    <circle cx="${n.x}" cy="${n.y}" r="${i === 0 ? 9 : 4.5}" fill="url(#nd${i})"/>
    <text x="${n.x}" y="${n.y + n.r + (i === 0 ? 22 : 20)}" class="node" text-anchor="middle">${n.label}</text>`).join("");
  const chips = PROJECTS.map((p) => p.name === "kitsuden-kons" ? { ...p, name: "kons" } : p);
  let cx = 64;
  const chipSvg = chips.map((p, i) => {
    const w = 34 + p.name.length * 9.6;
    const g = `<g class="rise" style="animation-delay:${0.55 + i * 0.08}s">
      <rect x="${cx}" y="262" width="${w}" height="32" rx="16" fill="#ffffff" fill-opacity=".04" stroke="${p.colors[0]}" stroke-opacity=".45"/>
      <circle cx="${cx + 16}" cy="278" r="4.5" fill="${p.colors[0]}"/>
      <text x="${cx + 27}" y="283" class="chip">${p.name}</text></g>`;
    cx += w + 10;
    return g;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">
  <title id="t">${NAME} (@${LOGIN})</title>
  <desc id="d">Data and integration architect. Connects the systems companies already run and adds AI to them. Open source: Kitsuden, its kons, the tallao UI kit and Inti.js.</desc>
  <defs>
    <style>${FONTS}
      .handle{font:500 15px ${MONO};letter-spacing:4px;fill:#ff2d6f}
      .name{font:700 60px ${SANS};letter-spacing:-1.5px}
      .tag{font:500 23px ${SANS};fill:#e4e4e7}
      .mono{font:400 14.5px ${MONO};fill:#a1a1aa}
      .chip{font:500 14px ${MONO};fill:#e4e4e7}
      .node{font:500 12.5px ${MONO};fill:#a1a1aa}
      .tiny{font:400 11px ${MONO};fill:#52525b;letter-spacing:1px}
      .rise{animation:rise .9s cubic-bezier(.2,.7,.2,1) both}
      .cursor{animation:blink 1.05s steps(1) infinite}
      .pulse{animation:pulse 3.2s ease-in-out infinite}
      .drift1{animation:drift1 14s ease-in-out infinite alternate}
      .drift2{animation:drift2 17s ease-in-out infinite alternate}
      @keyframes rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
      @keyframes blink{50%{opacity:0}}
      @keyframes pulse{0%,100%{transform:scale(1);opacity:.10}50%{transform:scale(1.35);opacity:.22}}
      @keyframes drift1{to{transform:translate(160px,40px)}}
      @keyframes drift2{to{transform:translate(-180px,-30px)}}
    </style>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c084fc"/><stop offset=".55" stop-color="#a855f7"/><stop offset="1" stop-color="#ff2d6f"/></linearGradient>
    <linearGradient id="border" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${W}" y2="${H}">
      <stop offset="0" stop-color="#a855f7"/><stop offset=".35" stop-color="#27272a"/><stop offset=".65" stop-color="#27272a"/><stop offset="1" stop-color="#ff2d6f"/>
      <animateTransform attributeName="gradientTransform" type="rotate" values="0 600 170;360 600 170" dur="10s" repeatCount="indefinite"/>
    </linearGradient>
    <radialGradient id="gp"><stop offset="0" stop-color="#a855f7" stop-opacity=".38"/><stop offset="1" stop-color="#a855f7" stop-opacity="0"/></radialGradient>
    <radialGradient id="gk"><stop offset="0" stop-color="#ff2d6f" stop-opacity=".28"/><stop offset="1" stop-color="#ff2d6f" stop-opacity="0"/></radialGradient>
    <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#ffffff" fill-opacity=".06"/></pattern>
    <filter id="soft" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <clipPath id="card"><rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="26"/></clipPath>
  </defs>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="26" fill="#09090b"/>
  <g clip-path="url(#card)">
    <rect width="${W}" height="${H}" fill="url(#dots)"/>
    <circle class="drift1" cx="180" cy="40" r="300" fill="url(#gp)"/>
    <circle class="drift2" cx="1050" cy="330" r="280" fill="url(#gk)"/>
  </g>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="26" fill="none" stroke="url(#border)" stroke-width="2"/>

  <g class="rise" style="animation-delay:.05s"><text x="64" y="78" class="handle">@${LOGIN.toUpperCase()} · DATA &amp; INTEGRATION ARCHITECT</text></g>
  <g class="rise" style="animation-delay:.15s"><text x="62" y="150" class="name" fill="url(#brand)">${NAME}</text></g>
  <g class="rise" style="animation-delay:.3s"><text x="64" y="194" class="tag">I connect the systems companies already run, and add AI to them.</text></g>
  <g class="rise" style="animation-delay:.42s"><text x="64" y="232" class="mono">integrations · data pipelines · AI agents · Python · TypeScript<tspan class="cursor" fill="#ff2d6f"> ▍</tspan></text></g>
  ${chipSvg}

  <g class="rise" style="animation-delay:.5s">${links}${nodeSvg}</g>
  <text x="${W - 30}" y="${H - 18}" class="tiny" text-anchor="end">GITHUB.COM/${LOGIN.toUpperCase()}</text>
</svg>`;
}

// ---------------------------------------------------------------- project cards

function glyph(kind, x, y, gid) {
  switch (kind) {
    case "kit": // a key in a ring: agents get a key
      return `<circle cx="${x}" cy="${y}" r="22" fill="none" stroke="url(#${gid})" stroke-width="2.5"/>
        <circle cx="${x - 6}" cy="${y}" r="6.5" fill="none" stroke="url(#${gid})" stroke-width="2.5"/>
        <path d="M${x} ${y}h13m-4 0v6m-5-6v4" stroke="url(#${gid})" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    case "kons": // stacked modules
      return `<rect x="${x - 18}" y="${y - 18}" width="16" height="16" rx="4" fill="url(#${gid})"/>
        <rect x="${x + 2}" y="${y - 18}" width="16" height="16" rx="4" fill="none" stroke="url(#${gid})" stroke-width="2.2"/>
        <rect x="${x - 18}" y="${y + 2}" width="16" height="16" rx="4" fill="none" stroke="url(#${gid})" stroke-width="2.2"/>
        <rect x="${x + 2}" y="${y + 2}" width="16" height="16" rx="4" fill="url(#${gid})" class="blinky"/>`;
    case "tallao": // a pickaxe-ish chisel mark
      return `<rect x="${x - 20}" y="${y - 20}" width="40" height="40" rx="11" fill="none" stroke="url(#${gid})" stroke-width="2.5"/>
        <path d="M${x - 9} ${y + 9}L${x + 7} ${y - 7}M${x - 1} ${y - 11}c6-2 11 1 13 7" stroke="url(#${gid})" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    case "inti": // the sun
      return `<circle cx="${x}" cy="${y}" r="10" fill="url(#${gid})"/>
        <g class="spin" style="transform-origin:${x}px ${y}px">${Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4, r1 = 15, r2 = 22;
          return `<path d="M${(x + r1 * Math.cos(a)).toFixed(1)} ${(y + r1 * Math.sin(a)).toFixed(1)}L${(x + r2 * Math.cos(a)).toFixed(1)} ${(y + r2 * Math.sin(a)).toFixed(1)}" stroke="url(#${gid})" stroke-width="2.6" stroke-linecap="round"/>`;
        }).join("")}</g>`;
  }
}

function card(p) {
  const W = 600, H = 230;
  const stops = p.colors.map((c, i) => `<stop offset="${i / (p.colors.length - 1)}" stop-color="${c}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t">
  <title id="t">${esc(p.name)}: ${esc(p.kind)}. ${esc(p.lines.join(" "))}</title>
  <defs>
    <style>${FONTS}
      .name{font:700 30px ${SANS};fill:#fafafa;letter-spacing:-.5px}
      .kind{font:500 12px ${MONO};letter-spacing:2.5px}
      .body{font:400 16px ${SANS};fill:#a1a1aa}
      .foot{font:400 12.5px ${MONO};fill:#71717a}
      .site{font:500 12.5px ${MONO}}
      .glow{animation:glow 7s ease-in-out infinite alternate}
      .spin{animation:spin 24s linear infinite}
      .blinky{animation:blinky 2.4s ease-in-out infinite}
      @keyframes glow{to{transform:translate(-120px,30px)}}
      @keyframes spin{to{transform:rotate(360deg)}}
      @keyframes blinky{50%{opacity:.25}}
    </style>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">${stops}</linearGradient>
    <linearGradient id="b" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${W}" y2="${H}">
      <stop offset="0" stop-color="${p.colors[0]}" stop-opacity=".8"/><stop offset=".45" stop-color="#27272a"/><stop offset="1" stop-color="${p.colors.at(-1)}" stop-opacity=".6"/>
    </linearGradient>
    <radialGradient id="r"><stop offset="0" stop-color="${p.colors.at(-1)}" stop-opacity=".22"/><stop offset="1" stop-color="${p.colors.at(-1)}" stop-opacity="0"/></radialGradient>
    <clipPath id="c"><rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="20"/></clipPath>
  </defs>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="20" fill="#0c0c10"/>
  <g clip-path="url(#c)"><circle class="glow" cx="560" cy="20" r="210" fill="url(#r)"/></g>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="20" fill="none" stroke="url(#b)" stroke-width="1.6"/>
  ${glyph(p.glyph, 58, 62, "g")}
  <text x="100" y="56" class="name">${esc(p.name)}</text>
  <text x="101" y="80" class="kind" fill="${p.colors[0]}">${esc(p.kind.toUpperCase())}</text>
  ${p.lines.map((l, i) => `<text x="36" y="${128 + i * 23}" class="body">${esc(l)}</text>`).join("")}
  <line x1="36" y1="${H - 36}" x2="${W - 36}" y2="${H - 36}" stroke="#27272a"/>
  <text x="36" y="${H - 15}" class="foot">${esc(p.stack)}</text>
  <text x="${W - 36}" y="${H - 15}" class="site" text-anchor="end" fill="${p.colors.at(-1)}">${esc(p.site)} ↗</text>
</svg>`;
}

// ---------------------------------------------------------------- live data

async function gql(query) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not set");
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json", "User-Agent": "profile-readme-builder" },
    body: JSON.stringify({ query }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

async function contributions() {
  const cal = `contributionCalendar{totalContributions weeks{contributionDays{date contributionCount}}}`;
  const first = await gql(`{user(login:"${LOGIN}"){createdAt contributionsCollection{contributionYears ${cal}}}}`);
  const user = first.user;
  const lastYear = user.contributionsCollection.contributionCalendar;
  const byDate = new Map();
  let total = 0;
  for (const y of user.contributionsCollection.contributionYears) {
    const d = await gql(`{user(login:"${LOGIN}"){contributionsCollection(from:"${y}-01-01T00:00:00Z",to:"${y}-12-31T23:59:59Z"){${cal}}}}`);
    const c = d.user.contributionsCollection.contributionCalendar;
    total += c.totalContributions;
    for (const w of c.weeks) for (const day of w.contributionDays) byDate.set(day.date, day.contributionCount);
  }
  const days = [...byDate.entries()].sort(([a], [b]) => (a < b ? -1 : 1));
  const today = lastYear.weeks.at(-1).contributionDays.at(-1).date;
  const upto = days.filter(([d]) => d <= today);
  let longest = { n: 0 }, run = 0, start = null;
  for (const [d, n] of upto) {
    if (n > 0) { if (!run) start = d; run++; if (run > longest.n) longest = { n: run, from: start, to: d }; }
    else run = 0;
  }
  // Current streak: today without contributions yet does not break it.
  let i = upto.length - 1;
  if (i >= 0 && upto[i][1] === 0) i--;
  let current = { n: 0 };
  while (i >= 0 && upto[i][1] > 0) { current = { n: current.n + 1, from: upto[i][0], to: current.to ?? upto[i][0] }; i--; }
  const firstDay = days.find(([, n]) => n > 0)?.[0] ?? user.createdAt.slice(0, 10);
  return { total, lastYear, current, longest, firstDay, today };
}

const fmt = (iso) => new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const fmtShort = (iso) => new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const range = (s) => (s.n ? (s.from === s.to ? fmt(s.from) : `${fmtShort(s.from)} – ${fmt(s.to)}`) : "no streak yet");

function stats({ total, current, longest, firstDay, today }) {
  const W = 1000, H = 200;
  const R = 40, C = 2 * Math.PI * R;
  const fill = longest.n ? Math.max(0.08, current.n / longest.n) : 0;
  const col = (x, big, label, sub, delay) => `
    <g class="rise" style="animation-delay:${delay}s">
      <text x="${x}" y="96" class="big" text-anchor="middle">${big}</text>
      <text x="${x}" y="150" class="label" text-anchor="middle">${label}</text>
      <text x="${x}" y="174" class="sub" text-anchor="middle">${sub}</text>
    </g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t">
  <title id="t">${total} contributions since ${fmt(firstDay)}. Current streak ${current.n} days, longest ${longest.n} days.</title>
  <defs>
    <style>${FONTS}
      .big{font:700 42px ${SANS};fill:#fafafa}
      .label{font:500 16px ${SANS};fill:#e4e4e7}
      .sub{font:400 12px ${MONO};fill:#71717a}
      .ring{font:700 38px ${SANS};fill:#fafafa}
      .rise{animation:rise .8s cubic-bezier(.2,.7,.2,1) both}
      .arc{animation:draw 1.6s .3s cubic-bezier(.3,.7,.2,1) both}
      .flame{animation:flick 1.8s ease-in-out infinite;transform-origin:500px 40px}
      @keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
      @keyframes draw{from{stroke-dashoffset:${C.toFixed(1)}}}
      @keyframes flick{50%{transform:scale(1.12) translateY(-1px)}}
    </style>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a855f7"/><stop offset="1" stop-color="#ff2d6f"/></linearGradient>
    <linearGradient id="b" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${W}" y2="${H}"><stop offset="0" stop-color="#a855f7" stop-opacity=".7"/><stop offset=".5" stop-color="#27272a"/><stop offset="1" stop-color="#ff2d6f" stop-opacity=".6"/></linearGradient>
  </defs>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="20" fill="#09090b" stroke="url(#b)" stroke-width="1.6"/>
  <line x1="333" y1="34" x2="333" y2="${H - 34}" stroke="#27272a"/>
  <line x1="667" y1="34" x2="667" y2="${H - 34}" stroke="#27272a"/>
  ${col(167, total.toLocaleString("en-US"), "Total contributions", `${fmtShort(firstDay)} ${firstDay.slice(0, 4)} – present`, 0.05)}
  <g class="rise" style="animation-delay:.15s">
    <circle cx="500" cy="80" r="${R}" fill="none" stroke="#27272a" stroke-width="7"/>
    <circle class="arc" cx="500" cy="80" r="${R}" fill="none" stroke="url(#brand)" stroke-width="7" stroke-linecap="round"
      stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - fill)).toFixed(1)}" transform="rotate(-90 500 80)"/>
    <rect x="487" y="22" width="26" height="24" fill="#09090b"/>
    <path class="flame" d="M500 24c6 6 9 10 9 15a9 9 0 0 1-18 0c0-4 2-6 4-8 0 3 1 5 3 5 0-4 0-8 2-12z" fill="url(#brand)"/>
    <text x="500" y="94" class="ring" text-anchor="middle">${current.n}</text>
    <text x="500" y="150" class="label" text-anchor="middle">Current streak</text>
    <text x="500" y="174" class="sub" text-anchor="middle">${range(current)}</text>
  </g>
  ${col(833, longest.n, "Longest streak", range(longest), 0.25)}
</svg>`;
}

function trail({ lastYear }) {
  const weeks = lastYear.weeks;
  const CELL = 13, GAP = 3, STEP = CELL + GAP;
  const W = 1000, gx = (W - weeks.length * STEP + GAP) / 2, gy = 96;
  const H = gy + 7 * STEP + 40;
  const counts = weeks.flatMap((w) => w.contributionDays.map((d) => d.contributionCount)).filter((n) => n > 0).sort((a, b) => a - b);
  const q = (p) => counts[Math.min(counts.length - 1, Math.floor(p * counts.length))] ?? 1;
  const [q1, q2, q3] = [q(0.25), q(0.5), q(0.75)];
  const LEVEL = ["#18181b", "#4c1d95", "#7e22ce", "#c026d3", "#ff2d6f"];
  const level = (n) => (n === 0 ? 0 : n <= q1 ? 1 : n <= q2 ? 2 : n <= q3 ? 3 : 4);

  // Serpentine path: down even weeks, up odd weeks. Equal steps, so the speed is constant.
  const order = [];
  weeks.forEach((w, c) => {
    const days = w.contributionDays.map((d, idx) => ({ ...d, c, r: new Date(d.date + "T00:00:00Z").getUTCDay(), idx }));
    (c % 2 ? days.reverse() : days).forEach((d) => order.push(d));
  });
  const T = 0.055, total = order.length * T, PAUSE = 2.2, DUR = total + PAUSE;
  const at = (d) => [gx + d.c * STEP + CELL / 2, gy + d.r * STEP + CELL / 2];
  const path = "M" + order.map((d) => at(d).map((v) => v.toFixed(1)).join(" ")).join("L");
  const f = (v) => Math.min(0.999, Math.max(0, v)).toFixed(4);

  const cells = order.map((d, i) => {
    const [x, y] = at(d);
    const lv = level(d.contributionCount);
    const base = `x="${(x - CELL / 2).toFixed(1)}" y="${(y - CELL / 2).toFixed(1)}" width="${CELL}" height="${CELL}" rx="3"`;
    if (!lv) return `<rect ${base} fill="${LEVEL[0]}"/>`;
    const t = (i * T) / DUR, e = 0.05 / DUR;
    return `<rect ${base} fill="${LEVEL[lv]}"><title>${d.contributionCount} on ${d.date}</title><animate attributeName="fill" dur="${DUR.toFixed(2)}s" repeatCount="indefinite"
      values="${LEVEL[lv]};${LEVEL[lv]};#ffffff;#2e1065;#2e1065;${LEVEL[lv]}" keyTimes="0;${f(t)};${f(t + e)};${f(t + 6 * e)};${f(0.985)};1"/></rect>`;
  }).join("");
  const motion = (begin) => `<animateMotion dur="${DUR.toFixed(2)}s" begin="${begin}s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;${(total / DUR).toFixed(4)};1" calcMode="linear" path="${path}"/>`;
  const tail = [4, 3, 2, 1].map((k) => `<circle cx="0" cy="0" r="${3.4 - k * 0.45}" fill="#ff2d6f" opacity="${(0.9 - k * 0.18).toFixed(2)}" visibility="hidden"><set attributeName="visibility" to="visible" begin="${(k * T * 1.6).toFixed(3)}s"/>${motion((k * T * 1.6).toFixed(3))}</circle>`).join("");
  const months = [];
  weeks.forEach((w, c) => {
    const d = w.contributionDays[0].date;
    if (d.slice(8) <= "07" || c === 0) months.push({ c, m: new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }) });
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t">
  <title id="t">${lastYear.totalContributions} contributions in the last year</title>
  <defs>
    <style>${FONTS}
      .eyebrow{font:500 12px ${MONO};letter-spacing:4px;fill:#a855f7}
      .h{font:700 21px ${SANS};fill:#fafafa}
      .m{font:400 11px ${MONO};fill:#52525b}
      .live{font:500 11px ${MONO};letter-spacing:2px;fill:#e4e4e7}
      .dot{animation:blink 1.4s ease-in-out infinite}
      @keyframes blink{50%{opacity:.2}}
    </style>
    <linearGradient id="b" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${W}" y2="${H}"><stop offset="0" stop-color="#a855f7" stop-opacity=".7"/><stop offset=".5" stop-color="#27272a"/><stop offset="1" stop-color="#ff2d6f" stop-opacity=".6"/></linearGradient>
    <radialGradient id="r1"><stop offset="0" stop-color="#a855f7" stop-opacity=".22"/><stop offset="1" stop-color="#a855f7" stop-opacity="0"/></radialGradient>
    <filter id="glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <clipPath id="c"><rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="20"/></clipPath>
  </defs>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="20" fill="#09090b"/>
  <g clip-path="url(#c)"><circle cx="120" cy="10" r="260" fill="url(#r1)"/></g>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="20" fill="none" stroke="url(#b)" stroke-width="1.6"/>
  <text x="${gx}" y="40" class="eyebrow">CONTRIBUTION TRAIL</text>
  <text x="${gx}" y="68" class="h">${lastYear.totalContributions} contributions in the last year</text>
  <circle class="dot" cx="${W - gx - 46}" cy="36" r="4" fill="#ff2d6f"/>
  <text x="${W - gx}" y="40" class="live" text-anchor="end">LIVE</text>
  ${months.filter((m, i) => i === 0 || m.c - months[i - 1].c > 2).map((m) => `<text x="${gx + m.c * STEP}" y="${gy - 8}" class="m">${m.m}</text>`).join("")}
  ${cells}
  ${tail}
  <circle cx="0" cy="0" r="5.2" fill="#ffffff" filter="url(#glow)">${motion("0")}</circle>
  <text x="${W - gx}" y="${H - 14}" class="m" text-anchor="end">updated ${fmt(lastYear.weeks.at(-1).contributionDays.at(-1).date)}</text>
</svg>`;
}

// ---------------------------------------------------------------- main

const mode = process.argv[2] ?? "all";
if (mode === "static" || mode === "all") {
  out("assets/header.svg", header());
  for (const p of PROJECTS) out(`assets/${p.id}.svg`, card(p));
}
if (mode === "live" || mode === "all") {
  const data = await contributions();
  out("dist/stats.svg", stats(data));
  out("dist/trail.svg", trail(data));
  console.log(`total ${data.total}, current ${data.current.n}, longest ${data.longest.n}, last year ${data.lastYear.totalContributions}`);
}
