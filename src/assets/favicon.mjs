import { writeFileSync } from "fs";
// A square favicon: centered astroid seal with a short reticle, ink on transparent.
//
// The committed raster set is rendered from the SVG this script writes:
//   magick -density 512 -background none public/favicon.svg -resize 460x460 \
//     -gravity center -extent 512x512 PNG32:- | magick - -background "#F7F5F0" -flatten PNG24:public/logo.png
//   magick -density 512 -background none public/favicon.svg -resize 140x140 \
//     -gravity center -extent 180x180 -background "#F7F5F0" -flatten PNG24:public/apple-touch-icon.png
//   magick -density 512 -background none public/favicon.svg -define icon:auto-resize=48,32,16 public/favicon.ico
//   magick -density 512 -background none public/favicon.svg -resize 96x96 PNG32:public/icon-96.png
// logo.png (square, bone plate) is what Organization.logo in the JSON-LD points
// at — Google's requirement for the logo shown beside search results / panels.
const SEAL = "#F8605A", INK = "#303030";
function astroid(a){let d="";const n=96;for(let i=0;i<=n;i++){const t=i/n*Math.PI*2;const x=a*Math.cos(t)**3;const y=a*Math.sin(t)**3;d+=(i===0?"M":"L")+x.toFixed(2)+","+y.toFixed(2)+" ";}return d+"Z";}
const S=64,c=S/2,seal=S*0.26;
const arm=(x2,y2)=>`<line x1="0" y1="0" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}">`+
`<g transform="translate(${c},${c})">`+
`<line x1="${-seal*1.5}" y1="0" x2="${seal*1.9}" y2="0" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`+
`<line x1="0" y1="${-seal*1.4}" x2="0" y2="${seal*1.4}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`+
`<path d="${astroid(seal)}" fill="${SEAL}"/>`+
`</g></svg>`;
writeFileSync(new URL("../../public/favicon.svg", import.meta.url), svg);

// OG image 1200x630, mark on bone with wordmark.
const W=1200,H=630;
const og=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`+
`<rect width="${W}" height="${H}" fill="#F7F5F0"/>`+
`<rect x="0" y="0" width="${W}" height="8" fill="${SEAL}"/>`+
`<g transform="translate(140,300)">`+
`<line x1="-70" y1="0" x2="150" y2="0" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>`+
`<line x1="0" y1="-70" x2="0" y2="70" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>`+
`<path d="${astroid(70)}" fill="${SEAL}"/></g>`+
`<text x="140" y="470" font-family="IBM Plex Mono, monospace" font-size="72" font-weight="500" fill="${INK}" letter-spacing="4">SIGIL SARL</text>`+
`<text x="144" y="530" font-family="IBM Plex Sans, sans-serif" font-size="30" fill="#6B7280">Sovereign governance infrastructure · Buea, Cameroon</text>`+
`</svg>`;
writeFileSync(new URL("../../public/og-image.svg", import.meta.url), og);
console.log("favicon.svg + og-image.svg written");
