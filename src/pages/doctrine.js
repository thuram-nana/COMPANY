import { page } from "../lib/layout.js";
import { strings, routes } from "../data/strings.js";
import { h2, cta } from "../lib/ui.js";
import { seal } from "../assets/mark.js";
import { orgNode, faqNode, breadcrumb, graph } from "../lib/jsonld.js";
import facts from "../data/facts.json" with { type: "json" };

const copy = {
  en: {
    title: "How we build",
    description: "SIGIL's doctrine: capability is never authorization, no finding is trusted until independently re-verified, the institution always holds the keys and can read, export, and stop, and open standards keep data portable. These are properties you can check.",
    lede: "One doctrine runs through both systems. It is written as things you can verify, not things you have to believe. Each principle below is a claim an evaluator can test against the system in front of them.",
    principles: [
      ["Capability is never authorization", "Being able to do something is never permission to do it. Models, agents, plugins, imported results, and external tools never receive the power to declare their own permission or the truth of their own finding. Every consequential action passes a conjunctive, fail-closed chain of controls."],
      ["No finding is trusted until it is re-verified", "An observation is a lead until an independent, deterministic authority re-verifies it into a fact. A confirmed fact is signed and re-checkable offline. Reports always separate what is proven from what is merely observed, and the absence of a signal is never reported as proof of absence."],
      ["The institution holds the keys", "The institution controls its own hardware, keys, data, and reports. SIGIL has no default access, receives no operational telemetry, and holds no hidden administrative account. Where a usage right is revocable, that revocation is a signed certificate verified locally — never a remote channel into the deployment."],
      ["The institution can always read, export, and stop", "Whatever a system's licensing state, the institution can always read and export its own data and always trip a safe stop. Revocation or expiry blocks new sensitive actions; it never blocks access to data, and it never prevents the institution from stopping the system."],
      ["Open standards, not lock-in", "Where a standard exists, we build to it and export to it — so the institution's data is portable and outlives any one vendor. RÉCOR exports to the Beneficial Ownership Data Standard; both systems ship signed builds with a software bill of materials."],
      ["Built to degrade safely, and to be audited", "Controls fail closed: the absence of a control is a denial, not a default allow. Every consequential action is attributable in a tamper-evident audit trail, and every build is signed and accompanied by a bill of materials so what runs can be checked against what was shipped."]
    ],
    closeH: "Why this matters for you",
    closeP: "An institution should not have to trust a vendor's good intentions. It should be able to check. Everything above is written so that an evaluator, a regulator, or an auditor can put the system in front of them and confirm it — or find that it does not hold."
  },
  fr: {
    title: "Notre méthode",
    description: "La doctrine de SIGIL : une capacité n’est jamais une autorisation, aucun constat n’est retenu tant qu’il n’a pas été re-vérifié de façon indépendante, l’institution détient toujours les clés et peut lire, exporter et arrêter, et les standards ouverts gardent les données portables. Ce sont des propriétés vérifiables.",
    lede: "Une même doctrine traverse les deux systèmes. Elle est écrite comme des choses vérifiables, non comme des choses à croire. Chaque principe ci-dessous est une affirmation qu’un évaluateur peut tester sur le système qu’il a devant lui.",
    principles: [
      ["Une capacité n’est jamais une autorisation", "Pouvoir faire une chose ne vaut jamais permission de la faire. Modèles, agents, plugins, résultats importés et outils externes ne reçoivent jamais le pouvoir de déclarer leur propre permission ni la vérité de leur propre constat. Toute action conséquente traverse une chaîne de contrôles conjonctive et fail-closed."],
      ["Aucun constat n’est retenu tant qu’il n’est pas re-vérifié", "Une observation est une piste tant qu’une autorité indépendante et déterministe ne l’a pas re-vérifiée en fait. Un fait confirmé est signé et re-vérifiable hors ligne. Les rapports séparent toujours ce qui est prouvé de ce qui est seulement observé, et l’absence de signal n’est jamais présentée comme une preuve d’absence."],
      ["L’institution détient les clés", "L’institution contrôle son propre matériel, ses clés, ses données et ses rapports. SIGIL ne dispose d’aucun accès par défaut, ne reçoit aucune télémétrie opérationnelle et ne détient aucun compte d’administration caché. Lorsqu’un droit d’usage est révocable, cette révocation est un certificat signé vérifié localement — jamais un canal distant vers le déploiement."],
      ["L’institution peut toujours lire, exporter et arrêter", "Quel que soit l’état de licence d’un système, l’institution peut toujours lire et exporter ses propres données et toujours déclencher un arrêt sûr. La révocation ou l’expiration bloque les nouvelles actions sensibles ; elle ne bloque jamais l’accès aux données, et n’empêche jamais l’institution d’arrêter le système."],
      ["Standards ouverts, pas de verrouillage", "Lorsqu’un standard existe, nous le respectons et exportons vers lui — pour que les données de l’institution soient portables et survivent à tout fournisseur unique. RÉCOR exporte vers le standard de données sur les bénéficiaires effectifs ; les deux systèmes livrent des builds signés avec une nomenclature logicielle."],
      ["Conçu pour dégrader sûrement, et pour être audité", "Les contrôles échouent en position fermée : l’absence d’un contrôle est un refus, non une autorisation par défaut. Toute action conséquente est attribuable dans une piste d’audit infalsifiable, et chaque build est signé et accompagné d’une nomenclature afin que ce qui s’exécute puisse être vérifié par rapport à ce qui a été livré."]
    ],
    closeH: "Pourquoi cela compte pour vous",
    closeP: "Une institution ne devrait pas avoir à faire confiance aux bonnes intentions d’un fournisseur. Elle devrait pouvoir vérifier. Tout ce qui précède est écrit pour qu’un évaluateur, un régulateur ou un auditeur puisse mettre le système devant lui et le confirmer — ou constater qu’il ne tient pas."
  }
};

export function doctrine(lang) {
  const c = copy[lang];
  const alt = lang === "en" ? "fr" : "en";
  const jsonld = graph([
    orgNode(facts),
    faqNode(c.principles.map(([q, a]) => ({ q, a }))),
    breadcrumb(facts, [
      { name: "SIGIL", path: routes.home[lang] },
      { name: c.title, path: routes.doctrine[lang] }
    ])
  ]);

  const list = c.principles.map(([t, p], i) => `
    <div class="card reveal">
      <h2 class="h-seal" style="font-size:var(--step-1)">${seal({ size: 18 })}<span>${t}</span></h2>
      <p class="muted" style="margin-top:.6rem">${p}</p>
    </div>`).join("");

  const body = `
<section class="section wrap">
  <p class="eyebrow">${strings[lang].nav.doctrine}</p>
  <h1>${c.title}</h1>
  <p class="lead" style="margin-top:1rem;max-width:62ch">${c.lede}</p>
</section>
<section class="section wrap rule-top">
  <div class="grid-2">${list}</div>
</section>
<section class="section wrap rule-top">
  ${h2(c.closeH)}
  <p style="margin-top:1rem;max-width:62ch">${c.closeP}</p>
  <p style="margin-top:2rem">${cta(lang)}</p>
</section>`;

  return page({
    lang, current: "doctrine", title: c.title, description: c.description,
    path: routes.doctrine[lang], altPath: routes.doctrine[alt], altLang: alt,
    ogType: "article", jsonld, body
  });
}
