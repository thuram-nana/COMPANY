// Architecture diagrams drawn in the brand's own vocabulary (ink rules, coral
// seals, T-terminals) so brand and diagram are one system and stay crisp at any
// zoom. Colours come from CSS custom properties, so diagrams theme with the page.
// Each function takes a small label bundle so the same SVG serves EN and FR.

const INK = "var(--text)";
const SOFT = "var(--text-soft)";
const SEAL = "var(--seal)";
const RULE = "var(--rule-strong)";
const COOL = "var(--diagram-cool)";

function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

/* The conjunctive authorization gate: a proposal must pass every control, in
   order, fail-closed, before the executor acts. */
export function gateDiagram(t) {
  // t.stages: array of short labels; t.propose, t.execute, t.caption
  const stages = t.stages;
  const w = 900, rowH = 46, top = 70, gap = 12;
  const h = top + stages.length * (rowH + gap) + 90;
  const cx = w / 2;
  let rows = "";
  stages.forEach((s, i) => {
    const y = top + i * (rowH + gap);
    rows +=
      `<g transform="translate(${cx - 300},${y})">` +
      `<rect width="600" height="${rowH}" rx="8" fill="${COOL}" stroke="${RULE}"/>` +
      `<path d="M-26 ${rowH / 2} l-14 0 M-40 ${rowH / 2 - 8} l0 16" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` +
      `<text x="18" y="${rowH / 2 + 5}" font-family="var(--font-mono)" font-size="15" fill="${INK}">${esc(s.k)}</text>` +
      `<text x="590" y="${rowH / 2 + 5}" text-anchor="end" font-family="var(--font-sans)" font-size="13" fill="${SOFT}">${esc(s.v)}</text>` +
      `</g>`;
    if (i < stages.length - 1) {
      rows += `<line x1="${cx}" y1="${y + rowH}" x2="${cx}" y2="${y + rowH + gap}" stroke="${RULE}" stroke-width="2"/>`;
    }
  });
  const yProp = 28, yExec = h - 44;
  return (
    `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(t.caption)}">` +
    `<text x="${cx}" y="${yProp}" text-anchor="middle" font-family="var(--font-mono)" font-size="15" fill="${SOFT}">${esc(t.propose)}</text>` +
    `<line x1="${cx}" y1="${yProp + 8}" x2="${cx}" y2="${top}" stroke="${RULE}" stroke-width="2"/>` +
    rows +
    `<line x1="${cx}" y1="${top + stages.length * (rowH + gap) - gap}" x2="${cx}" y2="${yExec - 22}" stroke="${SEAL}" stroke-width="2.5"/>` +
    `<g transform="translate(${cx - 120},${yExec - 18})"><rect width="240" height="36" rx="8" fill="none" stroke="${SEAL}" stroke-width="2"/>` +
    `<text x="120" y="23" text-anchor="middle" font-family="var(--font-mono)" font-size="15" fill="${INK}">${esc(t.execute)}</text></g>` +
    `</svg>`
  );
}

/* Truth-state model: an observation stays a LEAD until an independent Oracle
   re-verifies it into a FACT; otherwise it is discarded. */
export function truthDiagram(t) {
  const w = 900, h = 260;
  const box = (x, y, wd, label, sub, accent) =>
    `<g transform="translate(${x},${y})">` +
    `<rect width="${wd}" height="64" rx="10" fill="${accent ? "none" : COOL}" stroke="${accent ? SEAL : RULE}" stroke-width="${accent ? 2 : 1}"/>` +
    `<text x="${wd / 2}" y="28" text-anchor="middle" font-family="var(--font-mono)" font-size="16" fill="${INK}">${esc(label)}</text>` +
    `<text x="${wd / 2}" y="48" text-anchor="middle" font-family="var(--font-sans)" font-size="12" fill="${SOFT}">${esc(sub)}</text>` +
    `</g>`;
  const arrow = (x1, y1, x2, y2, label) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${RULE}" stroke-width="2"/>` +
    (label ? `<text x="${(x1 + x2) / 2}" y="${y1 - 8}" text-anchor="middle" font-family="var(--font-mono)" font-size="12" fill="${SOFT}">${esc(label)}</text>` : "");
  return (
    `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(t.caption)}">` +
    box(40, 100, 190, t.observation, t.observationSub, false) +
    box(355, 100, 190, t.lead, t.leadSub, false) +
    box(670, 30, 190, t.fact, t.factSub, true) +
    box(670, 170, 190, t.discard, t.discardSub, false) +
    arrow(230, 132, 355, 132, "") +
    arrow(545, 132, 670, 70, t.oracleYes) +
    arrow(545, 132, 670, 202, t.oracleNo) +
    `</svg>`
  );
}

/* RÉCOR verification pipeline: a declaration passes nine checks before it is
   published and exported to BODS. Rendered as a labelled spine. */
export function pipelineDiagram(t) {
  const steps = t.steps; // array of short strings
  const w = 900, colH = 44, top = 60, gap = 10;
  const h = top + steps.length * (colH + gap) + 70;
  const cx = 150;
  let rows = "";
  steps.forEach((s, i) => {
    const y = top + i * (colH + gap);
    rows +=
      `<g transform="translate(${cx},${y})">` +
      `<circle cx="0" cy="${colH / 2}" r="6" fill="${SEAL}"/>` +
      `<rect x="24" width="640" height="${colH}" rx="8" fill="${COOL}" stroke="${RULE}"/>` +
      `<text x="44" y="${colH / 2 + 5}" font-family="var(--font-mono)" font-size="13" fill="${SOFT}">${String(i + 1).padStart(2, "0")}</text>` +
      `<text x="86" y="${colH / 2 + 5}" font-family="var(--font-sans)" font-size="15" fill="${INK}">${esc(s)}</text>` +
      `</g>`;
    if (i < steps.length - 1) rows += `<line x1="${cx}" y1="${y + colH}" x2="${cx}" y2="${y + colH + gap}" stroke="${RULE}" stroke-width="2"/>`;
  });
  return (
    `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(t.caption)}">` +
    `<text x="${cx}" y="34" text-anchor="middle" font-family="var(--font-mono)" font-size="15" fill="${SOFT}">${esc(t.start)}</text>` +
    rows +
    `<text x="${cx}" y="${h - 24}" text-anchor="middle" font-family="var(--font-mono)" font-size="15" fill="${INK}">${esc(t.end)}</text>` +
    `</svg>`
  );
}
