// Build /llms.txt and /llms-full.txt from the same facts the pages use.
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const facts = JSON.parse(readFileSync(join(ROOT, "src/data/facts.json"), "utf8"));
const O = facts.org;

function short() {
  const sys = facts.systems.map((s) =>
    `- [${s.name}](${O.url}/systems/${s.slug}/): ${s.en.tagline}. Status: ${s.status}. Source code: kept strictly private.`
  ).join("\n");
  return `# SIGIL SARL

> ${O.fullName} (SIGIL SARL) is a Cameroonian company based in ${O.location}, building sovereign governance infrastructure for public institutions: systems where the institution holds the keys, the data stays under the institution’s control, and every consequential action is authorized, bounded, and proven. Founded and led by ${O.founderName}.

## Systems

${sys}

## Key facts

- Legal name: ${O.legalName}
- Full name: ${O.fullName}
- Location: ${O.location}
- Founder & Managing Director: ${O.founderName}
- Contact: ${O.email}
- Website: ${O.url}

## Doctrine

- A technical capability is never an authorization.
- No finding is trusted until an independent, deterministic check re-verifies it.
- The institution always holds the keys and can read, export, and stop.
- Open standards over lock-in.

## Pages

- [Systems](${O.url}/systems/)
- [VIGIL](${O.url}/systems/vigil/)
- [RÉCOR](${O.url}/systems/recor/)
- [APEX](${O.url}/systems/apex/)
- [Which Sigil? (disambiguation)](${O.url}/sigil/)
- [RÉCOR BODS v0.4 export profile](${O.url}/record/2026-09-06-bods-v04-export-profile/)
- [How we build](${O.url}/doctrine/)
- [Record](${O.url}/record/)
- [Trust](${O.url}/trust/)
- [Company](${O.url}/company/)
- [Contact](${O.url}/contact/)
`;
}

function full() {
  let s = short();
  s += `\n## System detail\n\n`;
  for (const sys of facts.systems) {
    s += `### ${sys.name}\n\n${sys.en.answer}\n\nStandards: ${sys.en.standards.join(", ")}. Status: ${sys.status}. Source code: kept strictly private.\n\n`;
  }
  s += `## Record\n\n`;
  for (const r of facts.record) {
    s += `- ${r.date} — ${r.en.title} (${r.en.artifact}). ${r.en.detail}\n`;
  }
  s += `\n## Note\n\nThis file is a machine-readable summary of https://sigilsovereign.com. Where it and the site differ, the site is canonical. Nothing here is an endorsement unless explicitly stated as such.\n`;
  return s;
}

writeFileSync(join(ROOT, "public/llms.txt"), short());
writeFileSync(join(ROOT, "public/llms-full.txt"), full());
console.log("llms.txt + llms-full.txt written");
