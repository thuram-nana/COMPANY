import { page } from "../lib/layout.js";
import { strings, routes } from "../data/strings.js";
import { h2, statusChip, cta, callout, guaranteeTable } from "../lib/ui.js";
import { seal } from "../assets/mark.js";
import { pipelineDiagram } from "../assets/diagrams.js";
import { orgNode, systemNode, statusTerms, faqNode, breadcrumb, graph } from "../lib/jsonld.js";
import facts from "../data/facts.json" with { type: "json" };

const sys = facts.systems.find((s) => s.slug === "recor");

const copy = {
  en: {
    title: "RÉCOR",
    description: "RÉCOR is a sovereign beneficial-ownership registry designed for Cameroon, built to satisfy FATF Recommendations 24 and 25 and to export to the Beneficial Ownership Data Standard (BODS v0.4). Conformance was confirmed to Open Ownership on 1 July 2026. Source code is kept strictly private.",
    problemH: "The problem",
    problemP: "Opaque company ownership lets illicit finance move unseen and holds a jurisdiction back from meeting international standards. A beneficial-ownership registry makes real ownership legible — but only if the data is trustworthy, the audit trail is tamper-evident, and citizens' rights over their own data are respected.",
    doesH: "What RÉCOR does",
    doesP: "A declaration of ownership passes a nine-stage verification pipeline before it is published and exported. Each stage either confirms, flags, or refers the declaration; nothing is published on trust alone.",
    pipe: {
      start: "A beneficial-ownership declaration",
      steps: [
        "Schema parity and signed attestation",
        "Identity gates",
        "Sanctions screening (UN / EU / OFAC)",
        "Politically-exposed-person screening",
        "Adverse-media review",
        "Graph and machine-learning pattern detection",
        "Dempster-Shafer cross-source fusion",
        "Stakeholder review",
        "Public consultation"
      ],
      end: "Published and exported to BODS v0.4",
      caption: "Nine verification stages stand between a declaration and publication."
    },
    standardsH: "Standards and conformance",
    standardsP: "RÉCOR is built to satisfy FATF Recommendations 24 and 25 and to export to the Beneficial Ownership Data Standard (BODS) v0.4. Its conformance with BODS v0.4 was confirmed in a demonstration to Open Ownership on 1 July 2026.",
    proofCallout: ["Verifiable", "RÉCOR's conformance with the Beneficial Ownership Data Standard (BODS v0.4) was confirmed in a demonstration to Open Ownership on 1 July 2026. This is a technical demonstration and conformance confirmation, not an endorsement."],
    guarH: "Sovereignty guarantees",
    guarHead: ["Guarantee", "How RÉCOR delivers it"],
    guarRows: [
      ["Data residency", "Designed to run on national infrastructure; the register and its evidence stay in-country."],
      ["Key custody", "Declarations are cryptographically signed; the institution holds the keys."],
      ["Citizen data rights", "Deletion rights are honoured by cryptographic shredding — destroying the key that makes a record readable."],
      ["Audit chain", "A triple-witnessed, Merkle-anchored audit chain makes every change tamper-evident."],
      ["Open standard", "Exports to BODS v0.4, so the data is portable and not locked to one vendor."],
      ["Source code", "Kept strictly private; not published or distributed."]
    ],
    faqH: "Questions institutions ask",
    faqs: [
      { q: "Does RÉCOR meet FATF Recommendations 24 and 25?", a: "RÉCOR is designed to satisfy FATF Recommendations 24 and 25 and to export to the Beneficial Ownership Data Standard. Its conformance with BODS v0.4 was confirmed in a demonstration to Open Ownership on 1 July 2026." },
      { q: "How are citizens' data-deletion rights handled?", a: "Through cryptographic shredding: when a record must be erased, the key that makes it readable is destroyed, rendering the data unrecoverable while the audit chain's integrity is preserved." },
      { q: "Is the ownership data portable?", a: "Yes. RÉCOR exports to the Beneficial Ownership Data Standard (BODS) v0.4, an open standard, so the data is not locked to a single vendor." },
      { q: "Is RÉCOR's source code available?", a: "No. All RÉCOR source code is kept strictly private. It is not published, mirrored, or distributed." }
    ]
  },
  fr: {
    title: "RÉCOR",
    description: "RÉCOR est un registre souverain des bénéficiaires effectifs conçu pour le Cameroun, bâti pour satisfaire les recommandations 24 et 25 du GAFI et exporter vers le standard de données sur les bénéficiaires effectifs (BODS v0.4). La conformité a été confirmée à Open Ownership le 1 juillet 2026. Le code source est gardé strictement privé.",
    problemH: "Le problème",
    problemP: "L’opacité de la propriété des entreprises laisse la finance illicite circuler sans être vue et empêche une juridiction de satisfaire les standards internationaux. Un registre des bénéficiaires effectifs rend la propriété réelle lisible — mais seulement si les données sont fiables, si la piste d’audit est infalsifiable, et si les droits des citoyens sur leurs propres données sont respectés.",
    doesH: "Ce que fait RÉCOR",
    doesP: "Une déclaration de propriété traverse une chaîne de vérification en neuf étapes avant d’être publiée et exportée. Chaque étape confirme, signale ou renvoie la déclaration ; rien n’est publié sur la seule confiance.",
    pipe: {
      start: "Une déclaration de bénéficiaire effectif",
      steps: [
        "Parité de schéma et attestation signée",
        "Contrôles d’identité",
        "Criblage des sanctions (ONU / UE / OFAC)",
        "Criblage des personnes politiquement exposées",
        "Revue de la presse défavorable",
        "Détection de motifs par graphe et apprentissage automatique",
        "Fusion multi-sources Dempster-Shafer",
        "Revue des parties prenantes",
        "Consultation publique"
      ],
      end: "Publiée et exportée vers BODS v0.4",
      caption: "Neuf étapes de vérification séparent une déclaration de sa publication."
    },
    standardsH: "Standards et conformité",
    standardsP: "RÉCOR est bâti pour satisfaire les recommandations 24 et 25 du GAFI et pour exporter vers le standard de données sur les bénéficiaires effectifs (BODS) v0.4. Sa conformité au BODS v0.4 a été confirmée lors d’une démonstration à Open Ownership le 1 juillet 2026.",
    proofCallout: ["Vérifiable", "La conformité de RÉCOR au standard de données sur les bénéficiaires effectifs (BODS v0.4) a été confirmée lors d’une démonstration à Open Ownership le 1 juillet 2026. Il s’agit d’une démonstration technique et d’une confirmation de conformité, non d’un soutien institutionnel."],
    guarH: "Garanties de souveraineté",
    guarHead: ["Garantie", "Comment RÉCOR l’assure"],
    guarRows: [
      ["Résidence des données", "Conçu pour s’exécuter sur l’infrastructure nationale ; le registre et ses preuves restent dans le pays."],
      ["Garde des clés", "Les déclarations sont signées cryptographiquement ; l’institution détient les clés."],
      ["Droits des citoyens", "Le droit à l’effacement est honoré par broyage cryptographique — destruction de la clé qui rend un enregistrement lisible."],
      ["Chaîne d’audit", "Une chaîne d’audit triple-témoin, ancrée par arbre de Merkle, rend chaque modification infalsifiable."],
      ["Standard ouvert", "Exporte vers BODS v0.4 ; les données sont portables et non verrouillées à un fournisseur."],
      ["Code source", "Gardé strictement privé ; ni publié ni distribué."]
    ],
    faqH: "Questions posées par les institutions",
    faqs: [
      { q: "RÉCOR satisfait-il les recommandations 24 et 25 du GAFI ?", a: "RÉCOR est conçu pour satisfaire les recommandations 24 et 25 du GAFI et exporter vers le standard de données sur les bénéficiaires effectifs. Sa conformité au BODS v0.4 a été confirmée lors d’une démonstration à Open Ownership le 1 juillet 2026." },
      { q: "Comment le droit des citoyens à l’effacement est-il assuré ?", a: "Par broyage cryptographique : lorsqu’un enregistrement doit être effacé, la clé qui le rend lisible est détruite, rendant les données irrécupérables tout en préservant l’intégrité de la chaîne d’audit." },
      { q: "Les données de propriété sont-elles portables ?", a: "Oui. RÉCOR exporte vers le standard de données sur les bénéficiaires effectifs (BODS) v0.4, un standard ouvert ; les données ne sont pas verrouillées à un fournisseur unique." },
      { q: "Le code source de RÉCOR est-il disponible ?", a: "Non. L’intégralité du code source de RÉCOR est gardée strictement privée. Il n’est ni publié, ni miroité, ni distribué." }
    ]
  }
};

export function recor(lang) {
  const c = copy[lang];
  const alt = lang === "en" ? "fr" : "en";
  const L = sys[lang];
  const jsonld = graph([
    orgNode(facts),
    systemNode(facts, sys, lang),
    statusTerms(facts),
    faqNode(c.faqs.map(f => ({ q: f.q, a: f.a }))),
    breadcrumb(facts, [
      { name: "SIGIL", path: routes.home[lang] },
      { name: strings[lang].nav.systems, path: routes.systems[lang] },
      { name: "RÉCOR", path: routes.recor[lang] }
    ])
  ]);

  const body = `
<section class="section wrap">
  <p class="eyebrow">${seal({ size: 20 })} ${strings[lang].nav.systems} — RÉCOR</p>
  <h1>RÉCOR</h1>
  <p style="margin-top:.5rem">${statusChip(sys.status, lang)}</p>
  <p class="lead" style="margin-top:1.5rem;max-width:62ch">${L.answer}</p>
  <p style="margin-top:2rem">${cta(lang)}</p>
</section>

<section class="section wrap rule-top">
  ${h2(c.problemH)}
  <p style="margin-top:1rem;max-width:62ch">${c.problemP}</p>
</section>

<section class="section wrap rule-top">
  ${h2(c.doesH)}
  <p style="margin-top:1rem;max-width:62ch">${c.doesP}</p>
  <figure class="diagram reveal" style="margin-top:2rem">
    ${pipelineDiagram(c.pipe)}
    <figcaption>${c.pipe.caption}</figcaption>
  </figure>
</section>

<section class="section wrap rule-top">
  ${h2(c.standardsH)}
  <p style="margin-top:1rem;max-width:62ch">${c.standardsP}</p>
  <div style="margin-top:1.5rem">${callout(c.proofCallout[0], c.proofCallout[1])}</div>
</section>

<section class="section wrap rule-top">
  ${h2(c.guarH)}
  <div style="margin-top:1.5rem">${guaranteeTable(c.guarHead, c.guarRows)}</div>
</section>

<section class="section wrap rule-top">
  ${h2(c.faqH)}
  <div class="stack" style="margin-top:1.5rem">
    ${c.faqs.map(f => `<details class="card"><summary class="mono" style="cursor:pointer;font-weight:600">${f.q}</summary><p style="margin-top:.8rem">${f.a}</p></details>`).join("")}
  </div>
  <p style="margin-top:2.5rem">${cta(lang)}</p>
</section>`;

  return page({
    lang, current: "systems", title: c.title, description: c.description,
    path: routes.recor[lang], altPath: routes.recor[alt], altLang: alt,
    ogType: "website", jsonld, body
  });
}
