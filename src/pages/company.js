import { page } from "../lib/layout.js";
import { strings, routes } from "../data/strings.js";
import { h2, cta, entityFaq, entityBlock } from "../lib/ui.js";
import { seal } from "../assets/mark.js";
import { orgNode, breadcrumb, faqNode, graph } from "../lib/jsonld.js";
import facts from "../data/facts.json" with { type: "json" };

const copy = {
  en: {
    title: "Company",
    description: "SIGIL SARL is a Cameroonian company based in Buea that builds sovereign governance infrastructure. Founded in 2023 and led by Junior Thuram Nana.",
    lede: "SIGIL SARL — Sovereign Integrity Governance Infrastructure Labs — is a Cameroonian company based in Buea, building sovereign governance infrastructure for public institutions.",
    whoH: "Who we are",
    whoP: `SIGIL SARL is registered in Cameroon and based in Buea. It designs and builds a small number of systems for public institutions — today, VIGIL and RÉCOR — each intended to run on the institution's own infrastructure, under the institution's own control.`,
    founderH: "Leadership",
    founderP: `${facts.org.founderName} is the Founder &amp; Managing Director of SIGIL SARL. Other members of the team are not named publicly.`,
    methodH: "How the work holds together",
    methodP: "Because we do not present a roster, it is fair to ask how the work stays dependable. The answer is method, not headcount. The same doctrine we apply to the systems governs how we build them:",
    methodPoints: [
      ["Signed authority", "Consequential actions in our own tooling are signed and attributable, so decisions have provenance."],
      ["Roles and separation", "Access follows least privilege and role separation; unknown permissions are denied by default."],
      ["Written procedure", "Build, release, key management, backup, and incident response are documented procedures, not tacit knowledge."],
      ["Reproducible builds", "Releases are signed and shipped with a software bill of materials, so what runs can be checked against what was shipped."],
      ["Recoverable custody", "Key custody uses escrow and threshold recovery, so no single point is unrecoverable."]
    ],
    approachH: "How we work with institutions",
    approachP: "We prefer to work in the open with the relevant authorities rather than develop a unilateral interpretation of our obligations. The goal is technology that is developed locally, auditable, and operable within a clearly defined authorization framework — so that the institution, not the vendor, remains in control.",
    factsH: "Company facts",
    factsRows: [
      ["Legal name", "SIGIL SARL"],
      ["Full name", "Sovereign Integrity Governance Infrastructure Labs"],
      ["Location", "Buea, Cameroon"],
      ["Founder &amp; Managing Director", facts.org.founderName],
      ["Contact", facts.org.email]
    ]
  },
  fr: {
    title: "Entreprise",
    description: "SIGIL SARL est une entreprise camerounaise basée à Buea qui construit une infrastructure de gouvernance souveraine. Fondée en 2023 et dirigée par Junior Thuram Nana.",
    lede: "SIGIL SARL — Sovereign Integrity Governance Infrastructure Labs — est une entreprise camerounaise basée à Buea, qui construit une infrastructure de gouvernance souveraine pour les institutions publiques.",
    whoH: "Qui nous sommes",
    whoP: `SIGIL SARL est immatriculée au Cameroun et basée à Buea. Elle conçoit et construit un petit nombre de systèmes pour les institutions publiques — aujourd’hui VIGIL et RÉCOR — chacun destiné à s’exécuter sur l’infrastructure de l’institution, sous son propre contrôle.`,
    founderH: "Direction",
    founderP: `${facts.org.founderName} est le Fondateur et Directeur Général de SIGIL SARL. Les autres membres de l’équipe ne sont pas nommés publiquement.`,
    methodH: "Ce qui rend le travail fiable",
    methodP: "Puisque nous ne présentons pas d’organigramme, il est légitime de demander comment le travail reste fiable. La réponse est la méthode, non l’effectif. La doctrine que nous appliquons aux systèmes gouverne aussi la façon dont nous les construisons :",
    methodPoints: [
      ["Autorité signée", "Les actions conséquentes de notre propre outillage sont signées et attribuables ; les décisions ont une provenance."],
      ["Rôles et séparation", "L’accès suit le moindre privilège et la séparation des rôles ; les permissions inconnues sont refusées par défaut."],
      ["Procédure écrite", "Build, release, gestion des clés, sauvegarde et réponse à incident sont des procédures documentées, non un savoir tacite."],
      ["Builds reproductibles", "Les versions sont signées et livrées avec une nomenclature logicielle ; ce qui s’exécute peut être vérifié par rapport à ce qui a été livré."],
      ["Garde récupérable", "La garde des clés utilise l’escrow et la récupération à seuil ; aucun point unique n’est irrécupérable."]
    ],
    approachH: "Comment nous travaillons avec les institutions",
    approachP: "Nous préférons travailler ouvertement avec les autorités compétentes plutôt que de développer une interprétation unilatérale de nos obligations. L’objectif est une technologie développée localement, auditable et exploitable dans un cadre d’autorisation clairement défini — afin que l’institution, et non le fournisseur, garde le contrôle.",
    factsH: "Informations sur l’entreprise",
    factsRows: [
      ["Raison sociale", "SIGIL SARL"],
      ["Nom complet", "Sovereign Integrity Governance Infrastructure Labs"],
      ["Localisation", "Buea, Cameroun"],
      ["Fondateur et Directeur Général", facts.org.founderName],
      ["Contact", facts.org.email]
    ]
  }
};

export function company(lang) {
  const c = copy[lang];
  const alt = lang === "en" ? "fr" : "en";
  const jsonld = graph([
    orgNode(facts),
    faqNode(entityFaq(lang)),
    breadcrumb(facts, [
      { name: "SIGIL", path: routes.home[lang] },
      { name: c.title, path: routes.company[lang] }
    ])
  ]);

  const method = c.methodPoints.map(([t, p]) => `
    <div class="card reveal">
      <h3 class="mono" style="color:var(--accent-ink)">${t}</h3>
      <p class="muted" style="margin-top:.4rem">${p}</p>
    </div>`).join("");

  const body = `
<section class="section wrap">
  <p class="eyebrow">${strings[lang].nav.company}</p>
  <h1>SIGIL SARL</h1>
  <p class="lead" style="margin-top:1rem;max-width:62ch">${c.lede}</p>
</section>

${entityBlock(lang)}

<section class="section wrap rule-top">
  ${h2(lang === "fr" ? "Questions fréquentes" : "Frequently asked")}
  <div class="stack" style="margin-top:1.5rem">
    ${entityFaq(lang).map(f => `<details class="card"><summary class="mono" style="cursor:pointer;font-weight:600">${f.q}</summary><p style="margin-top:.8rem">${f.a}</p></details>`).join("")}
  </div>
</section>

<section class="section wrap rule-top">
  <div class="grid-2 lead-col">
    <div>${h2(c.whoH)}<p style="margin-top:1rem">${c.whoP}</p></div>
    <div>${h2(c.founderH)}<p style="margin-top:1rem">${c.founderP}</p></div>
  </div>
</section>

<section class="section wrap rule-top">
  ${h2(c.methodH)}
  <p style="margin-top:1rem;max-width:62ch">${c.methodP}</p>
  <div class="grid-3" style="margin-top:2rem">${method}</div>
</section>

<section class="section wrap rule-top">
  ${h2(c.approachH)}
  <p style="margin-top:1rem;max-width:62ch">${c.approachP}</p>
</section>

<section class="section wrap rule-top">
  ${h2(c.factsH)}
  <div class="table-wrap" style="margin-top:1.5rem">
    <table><tbody>${c.factsRows.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("")}</tbody></table>
  </div>
  <p style="margin-top:2.5rem">${cta(lang)}</p>
</section>`;

  return page({
    lang, current: "company", title: c.title, description: c.description,
    path: routes.company[lang], altPath: routes.company[alt], altLang: alt,
    ogType: "website", jsonld, body
  });
}
