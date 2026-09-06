import { page } from "../lib/layout.js";
import { strings, routes } from "../data/strings.js";
import { h2, statusChip, cta, callout, guaranteeTable } from "../lib/ui.js";
import { seal } from "../assets/mark.js";
import { pipelineDiagram } from "../assets/diagrams.js";
import { orgNode, systemNode, statusTerms, faqNode, breadcrumb, graph } from "../lib/jsonld.js";
import facts from "../data/facts.json" with { type: "json" };

const sys = facts.systems.find((s) => s.slug === "apex");

const copy = {
  en: {
    title: "APEX — Anti-corruption procurement intelligence",
    description: "APEX is SIGIL SARL's anti-corruption intelligence platform for public procurement, built in Buea, Cameroon, for oversight institutions. Pre-deployment.",
    problemH: "The problem",
    problemP: "Public money is most often lost where contracts are awarded. The institutions that exist to catch this are not short of mandate — they are short of evidence collected at scale. Cross-referencing dozens of public sources by hand, a small team can review only a handful of contracts a year. The mechanical work of finding what to look at is the bottleneck, not the judgement of whether to act.",
    doesH: "What APEX does",
    doesP: "APEX automates the mechanical cross-referencing and hands human investigators a calibrated signal — never a verdict. A finding travels a defined forensic pipeline; at each stage it is confirmed, scored, or challenged, and nothing escalates on a single source or a single person's say-so.",
    pipe: {
      start: "A public procurement notice",
      steps: [
        "Ingest from public sources only",
        "Field extraction and entity resolution",
        "Pattern detection (43 patterns, 8 categories)",
        "Calibrated certainty scoring",
        "Adversarial counter-evidence review",
        "Multi-source corroboration",
        "Five-member council quorum",
        "Signed bilingual dossier"
      ],
      end: "Delivered to the mandated institution",
      caption: "A finding is confirmed, scored, or challenged at each stage before any escalation."
    },
    commitH: "Three architectural commitments",
    commitP: "The platform's design rests on three rules that hold whatever the case:",
    commits: [
      ["Multi-source proof, never single-source", "A pattern only counts when independent sources agree; a finding only escalates with several independent signals at high confidence. No single feed can move a case on its own."],
      ["No single human can act alone", "Decrypting a citizen tip and escalating a finding each require a quorum of a five-member council, every member authenticating with their own hardware key. There is no lone override."],
      ["Every claim is independently verifiable", "Anyone — a journalist, a citizen, a foreign auditor — can check a finding against a public ledger without trusting the platform at all. Signed dossiers are deterministic, so a third party can re-render and compare."]
    ],
    standardsH: "Standards and posture",
    standardsP: "APEX is built against the principles of the United Nations Convention Against Corruption (UNCAC) and the Open Contracting Data Standard (OCDS). It operates on public data only — mandated-disclosure portals, open APIs, and licensed access to public records. It does not decide guilt, does not prosecute, and does not publicly accuse; it compiles evidence and signals confidence, and a human institution makes every consequential decision.",
    statusCallout: ["Pre-deployment", "APEX is a built Phase 1 platform undergoing engineering hardening. It is not yet in operational use by any institution: the governance council is not yet formed and multi-institution federation is designed and scaffolded, not running. Nothing on this page describes a live national deployment."],
    guarH: "Sovereignty guarantees",
    guarHead: ["Guarantee", "How APEX delivers it"],
    guarRows: [
      ["Public data only", "Every source is mandated disclosure, an open API, or licensed access to public records. The platform does not ingest private or covertly obtained data."],
      ["Data residency", "Designed to run on national infrastructure; findings and their evidence stay in-country."],
      ["No lone escalation", "Escalation and tip decryption require a quorum of a five-member council, each authenticating with a hardware key."],
      ["Independent verifiability", "Every finding can be checked against a public ledger without trusting the platform; signed dossiers are deterministic and re-renderable."],
      ["Human decision", "The platform signals calibrated confidence; a mandated human institution makes every consequential decision. It does not decide guilt or prosecute."],
      ["Audit chain", "A triple-witnessed, hash-linked audit chain makes every state change tamper-evident."],
      ["Source code", "Kept strictly private; not published, mirrored, or distributed."]
    ],
    faqH: "Questions institutions ask",
    faqs: [
      { q: "Does APEX decide whether someone is guilty?", a: "No. It compiles evidence and reports a calibrated probability that something warrants investigation. It does not decide guilt, prosecute, or publicly accuse. A five-member governance council decides whether the evidence is strong enough to forward, and a mandated human institution makes the consequential decision." },
      { q: "What data does it use?", a: "Public data only — mandated-disclosure procurement portals, sanctions lists, corporate registries, court records, open APIs, and citizen tips submitted to the platform. It does not ingest private or covertly obtained data." },
      { q: "Can a single person escalate a case?", a: "No. Decrypting a citizen tip and escalating a finding each require a quorum of a five-member council, with every member authenticating using their own hardware key. There is no single-person override." },
      { q: "Is APEX deployed?", a: "No. It is a built Phase 1 platform undergoing engineering hardening, pre-deployment. It is not in operational use by any institution; the council is not yet formed and multi-institution federation is designed and scaffolded, not running." },
      { q: "Is APEX's source code available?", a: "No. All APEX source code is kept strictly private. It is not published, mirrored, or distributed." }
    ]
  },
  fr: {
    title: "APEX — Renseignement anti-corruption",
    description: "APEX est la plateforme de renseignement anti-corruption de SIGIL SARL (Buea, Cameroun) pour la commande publique. Pré-déploiement ; code privé.",
    problemH: "Le problème",
    problemP: "L’argent public se perd le plus souvent là où les marchés sont attribués. Les institutions chargées de le détecter ne manquent pas de mandat — elles manquent de preuves collectées à grande échelle. En recoupant des dizaines de sources publiques à la main, une petite équipe n’examine qu’une poignée de marchés par an. Le goulot d’étranglement est le travail mécanique consistant à trouver quoi examiner, non le jugement d’agir ou non.",
    doesH: "Ce que fait APEX",
    doesP: "APEX automatise le recoupement mécanique et remet aux enquêteurs humains un signal calibré — jamais un verdict. Un constat traverse une chaîne forensique définie ; à chaque étape il est confirmé, évalué ou contesté, et rien n’est escaladé sur une seule source ou la parole d’une seule personne.",
    pipe: {
      start: "Un avis de marché public",
      steps: [
        "Collecte à partir de sources publiques uniquement",
        "Extraction des champs et résolution d’entités",
        "Détection de schémas (43 schémas, 8 catégories)",
        "Évaluation de certitude calibrée",
        "Revue adversariale des contre-preuves",
        "Corroboration multi-sources",
        "Quorum d’un conseil de cinq membres",
        "Dossier bilingue signé"
      ],
      end: "Remis à l’institution compétente",
      caption: "Un constat est confirmé, évalué ou contesté à chaque étape avant toute escalade."
    },
    commitH: "Trois engagements d’architecture",
    commitP: "La conception de la plateforme repose sur trois règles valables quel que soit le dossier :",
    commits: [
      ["Preuve multi-sources, jamais mono-source", "Un schéma ne compte que lorsque des sources indépendantes concordent ; un constat n’est escaladé qu’avec plusieurs signaux indépendants à forte confiance. Aucun flux seul ne peut faire avancer un dossier."],
      ["Aucune personne seule ne peut agir", "Déchiffrer un signalement citoyen et escalader un constat exigent chacun le quorum d’un conseil de cinq membres, chaque membre s’authentifiant avec sa propre clé matérielle. Il n’existe aucune dérogation individuelle."],
      ["Chaque constat est vérifiable de façon indépendante", "N’importe qui — journaliste, citoyen, auditeur étranger — peut vérifier un constat sur un registre public sans faire aucune confiance à la plateforme. Les dossiers signés sont déterministes : un tiers peut les regénérer et comparer."]
    ],
    standardsH: "Standards et posture",
    standardsP: "APEX est bâti selon les principes de la Convention des Nations Unies contre la corruption (CNUCC) et du standard de données sur la commande ouverte (OCDS). Il fonctionne exclusivement sur des données publiques — portails à divulgation obligatoire, API ouvertes et accès licencié à des registres publics. Il ne décide pas de la culpabilité, ne poursuit pas et n’accuse pas publiquement ; il rassemble des preuves et signale un niveau de confiance, et une institution humaine prend chaque décision conséquente.",
    statusCallout: ["Pré-déploiement", "APEX est une plateforme de Phase 1 construite, en cours de durcissement technique. Elle n’est pas encore en usage opérationnel par une institution : le conseil de gouvernance n’est pas encore constitué et la fédération multi-institutions est conçue et préparée, non exécutée. Rien sur cette page ne décrit un déploiement national en service."],
    guarH: "Garanties de souveraineté",
    guarHead: ["Garantie", "Comment APEX l’assure"],
    guarRows: [
      ["Données publiques uniquement", "Chaque source est à divulgation obligatoire, une API ouverte ou un accès licencié à des registres publics. La plateforme n’ingère aucune donnée privée ou obtenue de façon occulte."],
      ["Résidence des données", "Conçu pour s’exécuter sur l’infrastructure nationale ; les constats et leurs preuves restent dans le pays."],
      ["Pas d’escalade individuelle", "L’escalade et le déchiffrement des signalements exigent le quorum d’un conseil de cinq membres, chacun s’authentifiant avec une clé matérielle."],
      ["Vérifiabilité indépendante", "Chaque constat peut être vérifié sur un registre public sans faire confiance à la plateforme ; les dossiers signés sont déterministes et regénérables."],
      ["Décision humaine", "La plateforme signale une confiance calibrée ; une institution humaine compétente prend chaque décision conséquente. Elle ne décide pas de la culpabilité et ne poursuit pas."],
      ["Chaîne d’audit", "Une chaîne d’audit triple-témoin, à chaînage de hachage, rend chaque changement d’état infalsifiable."],
      ["Code source", "Gardé strictement privé ; ni publié, ni miroité, ni distribué."]
    ],
    faqH: "Questions posées par les institutions",
    faqs: [
      { q: "APEX décide-t-il de la culpabilité ?", a: "Non. Il rassemble des preuves et rapporte une probabilité calibrée qu’une situation mérite enquête. Il ne décide pas de la culpabilité, ne poursuit pas et n’accuse pas publiquement. Un conseil de gouvernance de cinq membres décide si les preuves sont assez solides pour être transmises, et une institution humaine compétente prend la décision conséquente." },
      { q: "Quelles données utilise-t-il ?", a: "Des données publiques uniquement — portails de marchés à divulgation obligatoire, listes de sanctions, registres d’entreprises, décisions de justice, API ouvertes et signalements citoyens soumis à la plateforme. Il n’ingère aucune donnée privée ou obtenue de façon occulte." },
      { q: "Une seule personne peut-elle escalader un dossier ?", a: "Non. Déchiffrer un signalement citoyen et escalader un constat exigent chacun le quorum d’un conseil de cinq membres, chaque membre s’authentifiant avec sa propre clé matérielle. Aucune dérogation individuelle n’existe." },
      { q: "APEX est-il déployé ?", a: "Non. C’est une plateforme de Phase 1 construite, en cours de durcissement technique, en pré-déploiement. Elle n’est pas en usage opérationnel par une institution ; le conseil n’est pas encore constitué et la fédération multi-institutions est conçue et préparée, non exécutée." },
      { q: "Le code source de APEX est-il disponible ?", a: "Non. L’intégralité du code source de APEX est gardée strictement privée. Il n’est ni publié, ni miroité, ni distribué." }
    ]
  }
};

const deep = {"en": {"spec": {"h": "At a glance", "rows": [["System name", "APEX"], ["Category", "Anti-corruption intelligence for public procurement"], ["Status", "Pre-deployment"], ["Designed for", "Public institutions — national oversight institutions with an investigative mandate"], ["Standards", "Built against the principles of <a href=\"https://www.unodc.org/unodc/en/corruption/uncac.html\">UNCAC</a> and the <a href=\"https://standard.open-contracting.org/\">Open Contracting Data Standard (OCDS)</a>"], ["Authorization model", "Five-member council quorum, each member authenticating with their own hardware key; no lone escalation"], ["Source code", "Kept strictly private; not published, mirrored, or distributed"]]}, "section": {"h": "From public data to defensible findings", "paras": ["A finding that cannot survive scrutiny is worse than no finding at all, so APEX treats defensibility as a property of the pipeline, not a quality of the report. It begins with what is read: public sources only — procurement notices, sanctions lists, corporate registries, court records, and citizen tips submitted to the platform. Against this material it applies defined patterns of procurement fraud — 43 patterns in 8 categories — rather than open-ended suspicion, so every match traces back to a stated, reviewable rule.", "Each match is then scored by a calibrated certainty engine, challenged in an adversarial counter-evidence review, and corroborated across independent sources; nothing escalates on a single source or a single person's say-so. What survives corroboration goes before the five-member council; only on quorum is a signed, bilingual, deterministic dossier produced and delivered to the mandated institution — a dossier a third party can re-render and compare. What APEX hands investigators is a calibrated signal, never a verdict. A mandated human institution decides whether to investigate, and it alone makes every consequential decision."]}, "faqs": [{"q": "How can a third party verify a finding?", "a": "Without trusting the platform. Every finding can be checked against a public ledger, and signed dossiers are deterministic: a journalist, a citizen, or a foreign auditor can re-render a dossier and compare the result with what was signed. Verification rests on the public record and the signature, not on APEX's word."}, {"q": "What happens when the evidence cuts both ways?", "a": "It is weighed, not ignored. Every finding passes an adversarial counter-evidence review — a stage whose purpose is to challenge the finding, not to confirm it — and must then be corroborated across independent sources. A pattern only counts when independent sources agree, and a finding only escalates with several independent signals at high confidence; no single feed, and no single person, can move a case on its own. A finding that does not survive this scrutiny is not escalated."}]}, "fr": {"spec": {"h": "En bref", "rows": [["Nom du système", "APEX"], ["Catégorie", "Renseignement anti-corruption pour la commande publique"], ["Statut", "Pré-déploiement"], ["Conçu pour", "Les institutions publiques — les institutions nationales de contrôle dotées d’un mandat d’enquête"], ["Standards", "Bâti selon les principes de la <a href=\"https://www.unodc.org/unodc/en/corruption/uncac.html\">CNUCC</a> et de l’<a href=\"https://standard.open-contracting.org/\">OCDS</a> (Open Contracting Data Standard)"], ["Modèle d’autorisation", "Quorum d’un conseil de cinq membres, chacun s’authentifiant avec sa propre clé matérielle ; aucune escalade individuelle"], ["Code source", "Gardé strictement privé ; ni publié, ni miroité, ni distribué"]]}, "section": {"h": "Des données publiques aux constats défendables", "paras": ["Un constat qui ne résiste pas à l’examen vaut moins que pas de constat du tout ; APEX fait donc de la solidité d’un constat une propriété de la chaîne, non une qualité du rapport. Tout commence par ce qui est lu : des sources publiques uniquement — avis de marchés, listes de sanctions, registres d’entreprises, décisions de justice et signalements citoyens soumis à la plateforme. Sur cette matière, il applique des schémas définis de fraude aux marchés publics — 43 schémas en 8 catégories — et non une suspicion ouverte : chaque correspondance renvoie à une règle énoncée et révisable.", "Chaque correspondance est ensuite évaluée par un moteur de certitude calibré, contestée lors d’une revue adversariale des contre-preuves, puis corroborée par des sources indépendantes ; rien n’est escaladé sur une seule source ni sur la parole d’une seule personne. Ce qui résiste à la corroboration est soumis au conseil de cinq membres ; ce n’est qu’au quorum qu’un dossier bilingue signé et déterministe est produit et remis à l’institution compétente — un dossier qu’un tiers peut regénérer et comparer. Ce qu’APEX remet aux enquêteurs est un signal calibré, jamais un verdict. Une institution humaine compétente décide d’enquêter ou non, et elle seule prend chaque décision conséquente."]}, "faqs": [{"q": "Comment un tiers peut-il vérifier un constat ?", "a": "Sans faire confiance à la plateforme. Chaque constat peut être vérifié sur un registre public, et les dossiers signés sont déterministes : un journaliste, un citoyen ou un auditeur étranger peut regénérer un dossier et comparer le résultat avec ce qui a été signé. La vérification repose sur le registre public et la signature, non sur la parole d’APEX."}, {"q": "Que se passe-t-il lorsque les preuves se contredisent ?", "a": "Elles sont pesées, non ignorées. Chaque constat traverse une revue adversariale des contre-preuves — une étape dont le rôle est de contester le constat, non de le confirmer — puis doit être corroboré par des sources indépendantes. Un schéma ne compte que lorsque des sources indépendantes concordent, et un constat n’est escaladé qu’avec plusieurs signaux indépendants à forte confiance ; aucun flux seul, et aucune personne seule, ne peut faire avancer un dossier. Un constat qui ne résiste pas à cet examen n’est pas escaladé."}]}};
const stripA = (t) => String(t).replace(/<a [^>]*>/g, "").replace(/<\/a>/g, "");

export function apex(lang) {
  const c = copy[lang];
  const alt = lang === "en" ? "fr" : "en";
  const L = sys[lang];
  const d = deep[lang];
  const jsonld = graph([
    orgNode(facts),
    systemNode(facts, sys, lang),
    statusTerms(facts),
    faqNode([...c.faqs, ...d.faqs].map(f => ({ q: f.q, a: stripA(f.a) }))),
    breadcrumb(facts, [
      { name: "SIGIL", path: routes.home[lang] },
      { name: strings[lang].nav.systems, path: routes.systems[lang] },
      { name: "APEX", path: routes.apex[lang] }
    ])
  ]);

  const body = `
<section class="section wrap">
  <p class="eyebrow">${seal({ size: 20 })} ${strings[lang].nav.systems} — APEX</p>
  <h1>APEX</h1>
  <p style="margin-top:.5rem">${statusChip(sys.status, lang)}</p>
  <p class="lead" style="margin-top:1.5rem;max-width:64ch">${L.answer}</p>
  <div style="margin-top:1.5rem">${callout(c.statusCallout[0], c.statusCallout[1])}</div>
  <p style="margin-top:2rem">${cta(lang)}</p>
</section>

<section class="section wrap rule-top">
  ${h2(d.spec.h, "at-a-glance")}
  <div class="table-wrap" style="margin-top:1.5rem"><table><tbody>
    ${d.spec.rows.map(([k2, v2]) => `<tr><th scope="row">${k2}</th><td>${v2}</td></tr>`).join("")}
  </tbody></table></div>
</section>

<section class="section wrap rule-top">
  ${h2(c.problemH)}
  <p style="margin-top:1rem;max-width:64ch">${c.problemP}</p>
</section>

<section class="section wrap rule-top">
  ${h2(c.doesH)}
  <p style="margin-top:1rem;max-width:64ch">${c.doesP}</p>
  <figure class="diagram reveal" style="margin-top:2rem">
    ${pipelineDiagram(c.pipe)}
    <figcaption>${c.pipe.caption}</figcaption>
  </figure>
</section>

<section class="section wrap rule-top">
  ${h2(c.commitH)}
  <p style="margin-top:1rem;max-width:64ch">${c.commitP}</p>
  <div class="stack" style="margin-top:1.5rem">
    ${c.commits.map(([t, d]) => `<div class="card"><p class="mono" style="font-weight:600">${t}</p><p style="margin-top:.6rem">${d}</p></div>`).join("")}
  </div>
</section>

<section class="section wrap rule-top">
  ${h2(d.section.h, "public-data-to-findings")}
  ${d.section.paras.map((p2) => `<p style="margin-top:1rem;max-width:64ch">${p2}</p>`).join("")}
</section>

<section class="section wrap rule-top">
  ${h2(c.standardsH)}
  <p style="margin-top:1rem;max-width:64ch">${c.standardsP}</p>
</section>

<section class="section wrap rule-top">
  ${h2(c.guarH)}
  <div style="margin-top:1.5rem">${guaranteeTable(c.guarHead, c.guarRows)}</div>
</section>

<section class="section wrap rule-top">
  ${h2(c.faqH)}
  <div class="stack" style="margin-top:1.5rem">
    ${[...c.faqs, ...d.faqs].map(f => `<details class="card"><summary class="mono" style="cursor:pointer;font-weight:600">${f.q}</summary><p style="margin-top:.8rem">${f.a}</p></details>`).join("")}
  </div>
  <p style="margin-top:2.5rem">${cta(lang)}</p>
</section>`;

  return page({
    lang, current: "systems", title: c.title, description: c.description,
    path: routes.apex[lang], altPath: routes.apex[alt], altLang: alt,
    ogType: "website", jsonld, body
  });
}
