// The SIGIL registration mark, rebuilt as vector from the corrected logo.
// Coral astroid seal in a reticle of ink rules with T-terminals; the right
// arm runs 2.5x the other three (the reading axis). Geometry measured from
// the dossier's sigil-logo.png. Colours: seal #F8605A, ink #303030.
//
// The mark is drawn from a 0,0-centred coordinate space and exported at a few
// sizes. `animated` adds the draw-in classes the CSS/JS signature hooks into.

const SEAL = '#F8605A';
const INK = '#303030';

// astroid: x = a·cos^3 t, y = a·sin^3 t  (a = half-diagonal of the seal)
function astroidPath(a) {
  const steps = 96;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const x = a * Math.pow(Math.cos(t), 3);
    const y = a * Math.pow(Math.sin(t), 3);
    d += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ',' + y.toFixed(2) + ' ';
  }
  return d + 'Z';
}

// A single arm: a rule from the seal edge to a length L, capped with a
// perpendicular T-terminal bar. Rendered horizontally then rotated.
function arm(L, seal) {
  const start = seal * 0.34;          // begin just outside the cusp
  const bar = seal * 0.42;            // terminal half-length
  const sw = seal * 0.11;             // stroke width
  return (
    `<line x1="${start.toFixed(1)}" y1="0" x2="${L.toFixed(1)}" y2="0" ` +
    `stroke="${INK}" stroke-width="${sw.toFixed(1)}" stroke-linecap="round"/>` +
    `<line x1="${L.toFixed(1)}" y1="${(-bar).toFixed(1)}" x2="${L.toFixed(1)}" y2="${bar.toFixed(1)}" ` +
    `stroke="${INK}" stroke-width="${sw.toFixed(1)}" stroke-linecap="round"/>`
  );
}

/**
 * @param {object} o
 * @param {number} o.size   viewBox size (square)
 * @param {boolean} o.animated add draw-in classes
 * @param {string} o.title accessible title (omit for decorative)
 * @param {string} o.cls extra class on the root svg
 */
export function mark({ size = 120, animated = false, title = '', cls = '' } = {}) {
  const seal = size * 0.21;           // seal half-diagonal
  const shortArm = size * 0.40;
  const longArm = size * 0.40 * 2.5 / 2.5 * 2.5; // keep ratio explicit below
  const L = size * 0.40;              // short arm reach from centre
  const LONG = size * 0.40 * 2.5;     // long (right) arm reach = 2.5x

  const armClass = animated ? ' class="mk-arm"' : '';
  const sealClass = animated ? ' class="mk-seal"' : '';

  const arms =
    `<g${armClass} style="--mk-i:0">${arm(LONG, seal)}</g>` +                                  // right (long)
    `<g${armClass} style="--mk-i:1" transform="rotate(180)">${arm(L, seal)}</g>` +             // left
    `<g${armClass} style="--mk-i:2" transform="rotate(-90)">${arm(L, seal)}</g>` +             // up
    `<g${armClass} style="--mk-i:3" transform="rotate(90)">${arm(L, seal)}</g>`;               // down

  const seatd = astroidPath(seal);
  const titleTag = title ? `<title>${title}</title>` : '';
  const role = title ? 'img' : 'presentation';
  const ariaHidden = title ? '' : ' aria-hidden="true"';
  const rootCls = ('mk ' + (animated ? 'mk-animated ' : '') + cls).trim();

  // viewBox is centred; the long right arm needs the most room.
  const pad = size * 0.06;
  const minX = -(L + pad);
  const maxX = LONG + pad;
  const w = maxX - minX;
  const minY = -(L + pad);
  const h = (L + pad) * 2;

  return (
    `<svg class="${rootCls}" role="${role}"${ariaHidden} viewBox="${minX.toFixed(1)} ${minY.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}" ` +
    `xmlns="http://www.w3.org/2000/svg" width="${(w).toFixed(0)}" height="${(h).toFixed(0)}">` +
    titleTag +
    arms +
    `<path${sealClass} d="${seatd}" fill="${SEAL}"/>` +
    `</svg>`
  );
}

// A compact seal-only glyph (astroid, no arms) for section headings that "stamp".
export function seal({ size = 20, cls = '' } = {}) {
  const s = size * 0.5;
  const d = astroidPath(s);
  const pad = size * 0.08;
  const v = (s + pad);
  return (
    `<svg class="${('mk-glyph ' + cls).trim()}" aria-hidden="true" ` +
    `viewBox="${(-v).toFixed(1)} ${(-v).toFixed(1)} ${(v * 2).toFixed(1)} ${(v * 2).toFixed(1)}" ` +
    `xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
    `<path d="${d}" fill="${SEAL}"/></svg>`
  );
}

export { SEAL, INK };
