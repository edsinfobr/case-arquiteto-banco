// Visualizador standalone dos diagramas .eas.json do case.
// Renderiza nós (box, person, boundary, archimate-element) e arestas em SVG.
// Sem dependências — funciona abrindo index.html diretamente (file://) quando
// servido por um servidor estático; para file:// use um servidor local simples
// (ver README). Lê a lista a partir de diagrams/manifest.json.

const SVGNS = "http://www.w3.org/2000/svg";

async function loadManifest() {
  try {
    const res = await fetch("./diagrams/manifest.json", { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch {
    /* ignore */
  }
  // Fallback: lista fixa (ordem do case).
  return {
    diagrams: [
      "01-visao-de-arquitetura-togaf-fase-a.eas.json",
      "02-mapa-de-problemas-de-negocio-subdominios-ddd.eas.json",
      "03-mapa-de-capacidades-de-negocio.eas.json",
      "04-cadeia-de-valor-value-chain.eas.json",
      "05-value-stream-realizar-um-pagamento.eas.json",
      "06-arquitetura-alvo-to-be-microservices-c4.eas.json",
      "07-roadmap-de-migracao-arquiteturas-intermediarias.eas.json",
    ],
  };
}

async function loadDiagram(file) {
  const res = await fetch(`./diagrams/${file}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Falha ao carregar ${file}`);
  return res.json();
}

function el(name, attrs = {}, parent) {
  const n = document.createElementNS(SVGNS, name);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
  if (parent) parent.appendChild(n);
  return n;
}

function wrapText(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > maxChars) {
      if (line) lines.push(line);
      line = w;
    } else {
      line = (line + " " + w).trim();
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawLabel(g, node, topPad) {
  const cx = node.width / 2;
  const lines = wrapText(node.label, Math.max(10, Math.floor(node.width / 8)));
  const extra = [];
  if (node.technology) extra.push({ t: node.technology, size: 10, op: 0.85 });
  if (node.description) extra.push({ t: node.description, size: 10, op: 0.8 });
  const total = lines.length + extra.length;
  const lh = 15;
  let y = node.height / 2 - ((total - 1) * lh) / 2 + 4;
  if (node.shape === "boundary") y = 18;
  for (const ln of lines) {
    const t = el("text", {
      x: node.shape === "boundary" ? 12 : cx,
      y,
      "text-anchor": node.shape === "boundary" ? "start" : "middle",
      "font-size": 13,
      "font-weight": 600,
      fill: node.text,
    }, g);
    t.textContent = ln;
    y += lh;
  }
  for (const e of extra) {
    const t = el("text", {
      x: cx, y, "text-anchor": "middle", "font-size": e.size,
      fill: node.text, opacity: e.op,
    }, g);
    t.textContent = e.t;
    y += 13;
  }
}

function drawNode(svg, node) {
  const g = el("g", { transform: `translate(${node.x},${node.y})` }, svg);
  if (node.shape === "person") {
    const cx = node.width / 2;
    el("circle", { cx, cy: 28, r: 22, fill: node.fill, stroke: node.stroke, "stroke-width": 1.5 }, g);
    el("rect", {
      x: node.width * 0.12, y: 50, width: node.width * 0.76, height: node.height - 60,
      rx: 18, fill: node.fill, stroke: node.stroke, "stroke-width": 1.5,
    }, g);
    const t = el("text", { x: cx, y: node.height - 24, "text-anchor": "middle", "font-size": 12, "font-weight": 600, fill: node.text }, g);
    t.textContent = node.label;
  } else if (node.shape === "boundary") {
    el("rect", {
      width: node.width, height: node.height, rx: 10, fill: "rgba(100,116,139,0.04)",
      stroke: node.stroke, "stroke-width": 1.5, "stroke-dasharray": "8 6",
    }, g);
    drawLabel(g, node, 0);
  } else {
    const rx = node.shape === "archimate-element" ? 4 : 8;
    const fill = node.fill === "transparent" ? "#ffffff" : node.fill;
    el("rect", { width: node.width, height: node.height, rx, fill, stroke: node.stroke, "stroke-width": 1.5 }, g);
    drawLabel(g, node, 16);
  }
}

function center(n) { return { x: n.x + n.width / 2, y: n.y + n.height / 2 }; }

function borderPoint(n, toward) {
  const c = center(n);
  const dx = toward.x - c.x, dy = toward.y - c.y;
  if (dx === 0 && dy === 0) return c;
  const hw = n.width / 2, hh = n.height / 2;
  const scale = 1 / Math.max(Math.abs(dx) / hw, Math.abs(dy) / hh);
  return { x: c.x + dx * scale, y: c.y + dy * scale };
}

function drawEdge(svg, edge, byId, defs) {
  const s = byId.get(edge.source), t = byId.get(edge.target);
  if (!s || !t) return;
  const p1 = borderPoint(s, center(t)), p2 = borderPoint(t, center(s));
  const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
  const dash = edge.lineStyle === "dashed" ? "7 5" : edge.lineStyle === "dotted" ? "2 4" : null;

  // marker
  const mid2 = `m-${edge.id}`;
  if (edge.endArrow && edge.endArrow !== "none") {
    const marker = el("marker", {
      id: mid2, markerWidth: 12, markerHeight: 12, refX: 9, refY: 5, orient: "auto", markerUnits: "userSpaceOnUse",
    }, defs);
    if (edge.endArrow === "triangle") {
      el("path", { d: "M0,0 L10,5 L0,10 z", fill: "#fff", stroke: edge.color, "stroke-width": 1.2 }, marker);
    } else if (edge.endArrow === "open") {
      el("path", { d: "M0,0 L10,5 L0,10", fill: "none", stroke: edge.color, "stroke-width": 1.5 }, marker);
    } else {
      el("path", { d: "M0,0 L10,5 L0,10 z", fill: edge.color }, marker);
    }
  }
  const lineAttrs = {
    x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, stroke: edge.color, "stroke-width": 1.5,
  };
  if (dash) lineAttrs["stroke-dasharray"] = dash;
  if (edge.endArrow && edge.endArrow !== "none") lineAttrs["marker-end"] = `url(#${mid2})`;
  el("line", lineAttrs, svg);

  if (edge.label) {
    const w = Math.max(28, edge.label.length * 6.5 + 14);
    el("rect", { x: mid.x - w / 2, y: mid.y - 11, width: w, height: 20, rx: 4, fill: "#fff", stroke: "#e2e8f0" }, svg);
    const t = el("text", { x: mid.x, y: mid.y + 3, "text-anchor": "middle", "font-size": 11, fill: "#334155" }, svg);
    t.textContent = edge.label;
  }
}

function render(diagram) {
  const pad = 40;
  const maxX = Math.max(400, ...diagram.nodes.map((n) => n.x + n.width)) + pad;
  const maxY = Math.max(300, ...diagram.nodes.map((n) => n.y + n.height)) + pad;
  const svg = el("svg", {
    width: maxX, height: maxY, viewBox: `0 0 ${maxX} ${maxY}`, xmlns: SVGNS,
  });
  const defs = el("defs", {}, svg);
  const byId = new Map(diagram.nodes.map((n) => [n.id, n]));
  // edges first, boundaries behind, then nodes
  for (const e of diagram.edges) drawEdge(svg, e, byId, defs);
  const sorted = [...diagram.nodes].sort((a, b) => (a.z ?? 1) - (b.z ?? 1));
  for (const n of sorted) drawNode(svg, n);
  return svg;
}

// ---- UI wiring ----
const navEl = document.getElementById("nav");
const stageEl = document.getElementById("stage");
const titleEl = document.getElementById("title");
let current = null;

async function show(file) {
  try {
    const diagram = await loadDiagram(file);
    current = diagram;
    titleEl.textContent = diagram.name;
    stageEl.innerHTML = "";
    stageEl.appendChild(render(diagram));
    [...navEl.querySelectorAll("button")].forEach((b) =>
      b.classList.toggle("active", b.dataset.file === file)
    );
  } catch (err) {
    stageEl.innerHTML = `<p class="hint">${err.message}. Sirva a pasta por um servidor local (ver README).</p>`;
  }
}

function downloadSvg() {
  if (!current) return;
  const svg = stageEl.querySelector("svg");
  if (!svg) return;
  const data = new XMLSerializer().serializeToString(svg);
  const blob = new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n' + data], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = (current.name || "diagram").replace(/[^a-z0-9]+/gi, "-").toLowerCase() + ".svg";
  a.click();
  URL.revokeObjectURL(url);
}

(async function init() {
  const manifest = await loadManifest();
  for (const file of manifest.diagrams) {
    const btn = document.createElement("button");
    btn.dataset.file = file;
    btn.textContent = file.replace(/\.eas\.json$/, "").replace(/-/g, " ");
    btn.onclick = () => show(file);
    navEl.appendChild(btn);
  }
  document.getElementById("btn-svg").onclick = downloadSvg;
  if (manifest.diagrams.length) show(manifest.diagrams[0]);
})();
