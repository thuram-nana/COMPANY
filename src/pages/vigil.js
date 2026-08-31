import { page } from "../lib/layout.js";
import { strings, routes } from "../data/strings.js";
import { h2, statusChip, cta, callout, guaranteeTable, tagRow } from "../lib/ui.js";
import { seal } from "../assets/mark.js";
import { gateDiagram, truthDiagram } from "../assets/diagrams.js";
import { orgNode, systemNode, statusTerms, faqNode, breadcrumb, graph } from "../lib/jsonld.js";
import facts from "../data/facts.json" with { type: "json" };

const sys = facts.systems.find((s) => s.slug === "vigil");

const copy = {
  en: {
    title: "VIGIL — Governed cybersecurity and evidence platform",
    tagline: sys.en.tagline,
    description: "VIGIL is a governed cybersecurity and evidence platform: a capability is never an authorization, and a finding requires independent re-verification.",
    answerH: "What VIGIL is",
    principleH: "Capability is not authorization",
    principleP: "VIGIL's organizing rule is that being able to do something is never permission to do it. Models and agents may observe and propose; they never declare their own authority, and they never declare a finding true. Every consequential action passes a single conjunctive, fail-closed chain before anything runs.",
    gate: {
      propose: "A model or agent proposes an action",
      stages: [
        { k: "Authentication", v: "a valid local principal" },
        { k: "RBAC", v: "the exact permission for this action" },
        { k: "Entitlement", v: "a valid signed usage right" },
        { k: "Scope", v: "target, time, method, environment authorized" },
        { k: "WARDEN class", v: "risk A0–A3 derived from the real tool" },
        { k: "Approval", v: "human sign-off; quorum if destructive" },
        { k: "Egress", v: "destination and protocol permitted" }
      ],
      execute: "Only then does the executor act",
      caption: "The conjunctive authorization gate: every control must pass, in order, fail-closed, before the executor acts."
    },
    govH: "Governance",
    govP: "Identity, role, and a fail-closed risk classifier stand in front of every action. Roles are cumulative — viewer, analyst, operator, owner — and the owner role is the trust root, not a bearer account. WARDEN classifies each action A0–A3 and constrains the approval it needs.",
    govLink: "The authorization chain in detail",
    evH: "Evidence",
    evP: "A finding is a lead until an independent authority re-verifies it. VIGIL runs a set of deterministic checks — Oracles — that turn an observation into a confirmed fact only when a re-verifiable signal fires. A confirmed fact is signed and can be re-checked offline; a report always separates what is proven from what is merely observed.",
    evLink: "The Oracle model in detail",
    sovH: "Sovereignty",
    sovP: "A VIGIL installation belongs to the institution. It runs on the institution's own hardware, and the operator accounts, targets, logs, evidence, keys, and reports stay under the institution's control. SIGIL has no default access, receives no operational telemetry, and holds no hidden administrative account.",
    sovLink: "Deployment, keys, and revocation in detail",
    stateH: "Current state, stated plainly",
    stateP: "VIGIL's functional registry records the wiring status of every capability. Nothing on this site is presented as operational that the registry does not mark as live. The two-edition distribution model described in our institutional materials is a planned distribution architecture, not a shipped product.",
    codeCallout: ["Source code", "All VIGIL source code is kept strictly private. It is not published, mirrored, or distributed. Evaluation of the code, where appropriate, happens under a controlled, confidential arrangement — never as a public download."],
    guarH: "Sovereignty guarantees",
    guarHead: ["Guarantee", "How VIGIL delivers it"],
    guarRows: [
      ["Data residency", "Runs on the institution's own hardware; targets, logs, evidence, and reports never leave it."],
      ["Key custody", "The institution holds its private keys; SIGIL holds only the public key needed to verify signatures."],
      ["Telemetry", "None by default. SIGIL receives no operational data and does not see engagements."],
      ["Revocation", "Blocks new sensitive actions only; it never blocks the institution's access to its own data, and it is never a remote kill-switch."],
      ["Source code", "Kept strictly private; not published or distributed."],
      ["Update integrity", "Signed builds with a bill of materials; offline import is supported."]
    ],
    faqH: "Questions institutions ask",
    faqs: [
      { q: "Can SIGIL access our data or our results?", a: "No. A VIGIL installation runs on your hardware. Operator accounts, targets, logs, evidence, keys, and reports stay under your control. SIGIL receives no operational telemetry by default and holds no hidden administrative account." },
      { q: "Is there a remote kill-switch?", a: "No. Usage rights are verified locally by a signed certificate. If a right is revoked, VIGIL blocks new sensitive actions, but it never blocks your access to your own data, and it can never stop you from stopping the system yourself." },
      { q: "Can a model or agent decide something is vulnerable on its own?", a: "No. Models and agents may observe and propose. A finding becomes a confirmed fact only when an independent, re-verifiable Oracle fires; otherwise it stays a lead. Reports always distinguish the two." },
      { q: "Is VIGIL's source code available?", a: "No. All VIGIL source code is kept strictly private. Where a formal evaluation of the code is appropriate, it is arranged under confidential, controlled conditions." }
    ]
  },
  fr: {
    title: "VIGIL — Plateforme de cybersécurité gouvernée et de preuve",
    tagline: sys.fr.tagline,
    description: "VIGIL est une plateforme de cybersécurité gouvernée et de preuve : une capacité n’est jamais une autorisation ; un constat exige une re-vérification indépendante.",
    answerH: "Ce qu’est VIGIL",
    principleH: "Une capacité n’est pas une autorisation",
    principleP: "Le principe directeur de VIGIL est que pouvoir faire une chose ne vaut jamais permission de la faire. Les modèles et agents peuvent observer et proposer ; ils ne déclarent jamais leur propre autorité, ni la vérité de leur propre constat. Toute action conséquente traverse une chaîne unique, conjonctive et fail-closed, avant toute exécution.",
    gate: {
      propose: "Un modèle ou un agent propose une action",
      stages: [
        { k: "Authentification", v: "un principal local valide" },
        { k: "RBAC", v: "la permission exacte pour cette action" },
        { k: "Droit d’usage", v: "un droit signé valide" },
        { k: "Portée", v: "cible, durée, méthode, environnement autorisés" },
        { k: "Classe WARDEN", v: "risque A0–A3 dérivé de l’outil réel" },
        { k: "Approbation", v: "validation humaine ; quorum si destructif" },
        { k: "Sortie réseau", v: "destination et protocole autorisés" }
      ],
      execute: "Alors seulement l’exécuteur agit",
      caption: "La porte d’autorisation conjonctive : chaque contrôle doit passer, dans l’ordre, fail-closed, avant que l’exécuteur agisse."
    },
    govH: "Gouvernance",
    govP: "L’identité, le rôle et un classificateur de risque fail-closed se tiennent devant chaque action. Les rôles sont cumulatifs — viewer, analyst, operator, owner — et le rôle owner est la racine de confiance, non un simple compte bearer. WARDEN classe chaque action de A0 à A3 et contraint le niveau d’approbation requis.",
    govLink: "La chaîne d’autorisation en détail",
    evH: "Preuve",
    evP: "Un constat n’est qu’une piste tant qu’une autorité indépendante ne l’a pas re-vérifié. VIGIL exécute un ensemble de vérifications déterministes — les Oracles — qui transforment une observation en fait confirmé uniquement lorsqu’un signal re-vérifiable se déclenche. Un fait confirmé est signé et re-vérifiable hors ligne ; un rapport distingue toujours ce qui est prouvé de ce qui est seulement observé.",
    evLink: "Le modèle des Oracles en détail",
    sovH: "Souveraineté",
    sovP: "Une installation VIGIL appartient à l’institution. Elle s’exécute sur son propre matériel, et les comptes opérateurs, cibles, journaux, preuves, clés et rapports restent sous son contrôle. SIGIL ne dispose d’aucun accès par défaut, ne reçoit aucune télémétrie opérationnelle et ne détient aucun compte d’administration caché.",
    sovLink: "Déploiement, clés et révocation en détail",
    stateH: "État actuel, dit clairement",
    stateP: "Le registre fonctionnel de VIGIL consigne le statut de câblage de chaque capacité. Rien sur ce site n’est présenté comme opérationnel si le registre ne le marque pas comme actif. Le modèle de distribution en deux éditions décrit dans nos documents institutionnels est une architecture de diffusion proposée, non un produit livré.",
    codeCallout: ["Code source", "L’intégralité du code source de VIGIL est gardée strictement privée. Il n’est ni publié, ni miroité, ni distribué. L’évaluation du code, lorsqu’elle est pertinente, se déroule dans un cadre contrôlé et confidentiel — jamais sous forme de téléchargement public."],
    guarH: "Garanties de souveraineté",
    guarHead: ["Garantie", "Comment VIGIL l’assure"],
    guarRows: [
      ["Résidence des données", "S’exécute sur le matériel de l’institution ; cibles, journaux, preuves et rapports ne le quittent jamais."],
      ["Garde des clés", "L’institution détient ses clés privées ; SIGIL ne détient que la clé publique nécessaire à la vérification des signatures."],
      ["Télémétrie", "Aucune par défaut. SIGIL ne reçoit aucune donnée opérationnelle et ne voit pas les opérations."],
      ["Révocation", "Bloque uniquement les nouvelles actions sensibles ; elle ne bloque jamais l’accès de l’institution à ses données, et n’est jamais un kill-switch distant."],
      ["Code source", "Gardé strictement privé ; ni publié ni distribué."],
      ["Intégrité des mises à jour", "Builds signés avec nomenclature logicielle ; import hors ligne pris en charge."]
    ],
    faqH: "Questions posées par les institutions",
    faqs: [
      { q: "SIGIL peut-il accéder à nos données ou à nos résultats ?", a: "Non. Une installation VIGIL s’exécute sur votre matériel. Comptes opérateurs, cibles, journaux, preuves, clés et rapports restent sous votre contrôle. SIGIL ne reçoit aucune télémétrie opérationnelle par défaut et ne détient aucun compte d’administration caché." },
      { q: "Existe-t-il un kill-switch distant ?", a: "Non. Les droits d’usage sont vérifiés localement par un certificat signé. Si un droit est révoqué, VIGIL bloque les nouvelles actions sensibles, mais ne bloque jamais l’accès à vos données, et ne peut jamais vous empêcher d’arrêter vous-même le système." },
      { q: "Un modèle ou un agent peut-il décider seul qu’une chose est vulnérable ?", a: "Non. Les modèles et agents peuvent observer et proposer. Un constat devient un fait confirmé uniquement lorsqu’un Oracle indépendant et re-vérifiable se déclenche ; sinon il reste une piste. Les rapports distinguent toujours les deux." },
      { q: "Le code source de VIGIL est-il disponible ?", a: "Non. L’intégralité du code source de VIGIL est gardée strictement privée. Lorsqu’une évaluation formelle du code est pertinente, elle est organisée dans des conditions confidentielles et contrôlées." }
    ]
  }
};

export function vigil(lang) {
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
      { name: "VIGIL", path: routes.vigil[lang] }
    ])
  ]);

  const body = `
<section class="section wrap">
  <p class="eyebrow">${seal({ size: 20 })} ${strings[lang].nav.systems} — VIGIL</p>
  <h1>${c.title}</h1>
  <p style="margin-top:.5rem">${statusChip(sys.status, lang)}</p>
  <p class="lead" style="margin-top:1.5rem;max-width:62ch">${L.answer}</p>
  <p style="margin-top:2rem">${cta(lang)}</p>
</section>

<section class="section wrap rule-top">
  ${h2(c.principleH)}
  <p style="margin-top:1rem;max-width:62ch">${c.principleP}</p>
  <figure class="diagram reveal" style="margin-top:2rem">
    ${gateDiagram(c.gate)}
    <figcaption>${c.gate.caption}</figcaption>
  </figure>
</section>

<section class="section wrap rule-top">
  <div class="grid-3">
    <div class="card reveal">
      ${sealHeading(c.govH)}
      <p class="muted" style="margin-top:.5rem">${c.govP}</p>
      <p style="margin-top:1rem"><a href="${routes.vigilGov[lang]}" class="mono" style="color:var(--accent-ink)">${c.govLink} →</a></p>
    </div>
    <div class="card reveal">
      ${sealHeading(c.evH)}
      <p class="muted" style="margin-top:.5rem">${c.evP}</p>
      <p style="margin-top:1rem"><a href="${routes.vigilEvid[lang]}" class="mono" style="color:var(--accent-ink)">${c.evLink} →</a></p>
    </div>
    <div class="card reveal">
      ${sealHeading(c.sovH)}
      <p class="muted" style="margin-top:.5rem">${c.sovP}</p>
      <p style="margin-top:1rem"><a href="${routes.vigilSov[lang]}" class="mono" style="color:var(--accent-ink)">${c.sovLink} →</a></p>
    </div>
  </div>
</section>

<section class="section wrap rule-top">
  ${h2(c.guarH)}
  <div style="margin-top:1.5rem">${guaranteeTable(c.guarHead, c.guarRows)}</div>
</section>

<section class="section wrap rule-top">
  ${h2(c.stateH)}
  <p style="margin-top:1rem;max-width:62ch">${c.stateP}</p>
  <div style="margin-top:1.5rem">${callout(c.codeCallout[0], c.codeCallout[1])}</div>
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
    path: routes.vigil[lang], altPath: routes.vigil[alt], altLang: alt,
    ogType: "website", jsonld, body
  });
}

function sealHeading(t) {
  return `<h3 class="h-seal">${seal({ size: 18 })}<span>${t}</span></h3>`;
}

/* ---- sub-pages --------------------------------------------------------- */

function subPage(lang, key, data) {
  const alt = lang === "en" ? "fr" : "en";
  const routeKey = { governance: "vigilGov", evidence: "vigilEvid", sovereignty: "vigilSov" }[key];
  const jsonld = graph([
    orgNode(facts),
    breadcrumb(facts, [
      { name: "SIGIL", path: routes.home[lang] },
      { name: strings[lang].nav.systems, path: routes.systems[lang] },
      { name: "VIGIL", path: routes.vigil[lang] },
      { name: data.title, path: routes[routeKey][lang] }
    ])
  ]);
  const body = `
<section class="section wrap">
  <p class="eyebrow"><a href="${routes.vigil[lang]}" style="text-decoration:none;color:inherit">VIGIL</a> — ${data.crumb}</p>
  <h1>${data.title}</h1>
  <p class="lead" style="margin-top:1rem;max-width:62ch">${data.lede}</p>
  <div class="prose" style="margin-top:2.5rem">${data.body}</div>
  <p style="margin-top:2.5rem">${cta(lang)}</p>
</section>`;
  return page({
    lang, current: "systems", title: data.title + " — VIGIL", description: data.description,
    path: routes[routeKey][lang], altPath: routes[routeKey][alt], altLang: alt,
    ogType: "article", jsonld, body
  });
}

const govCopy = {
  en: {
    crumb: "Governance", title: "The authorization chain",
    description: "VIGIL's authorization chain is conjunctive and fail-closed: RBAC, signed usage right, signed scope, WARDEN class, human approval, and egress control.",
    lede: "Every consequential action in VIGIL passes the same chain of controls. They are conjunctive — all must pass — and fail-closed — the absence of a control is a denial, never a default allow.",
    body: `
${sectionH("Roles are cumulative, and owner is the trust root")}
<p>VIGIL uses four cumulative roles. Each inherits the permissions below it and adds its own:</p>
<div class="table-wrap" style="margin-top:1rem"><table>
<thead><tr><th>Role</th><th>Adds</th></tr></thead>
<tbody>
<tr><td>viewer</td><td>read state, read evidence, trip a safe stop</td></tr>
<tr><td>analyst</td><td>queue proposals and analysis, without launching an engagement</td></tr>
<tr><td>operator</td><td>run ordinary engagements, approve the operator tier, toggle guards, set non-secret config</td></tr>
<tr><td>owner</td><td>the trust root: owner-tier approvals, key release, promotion, secrets, offense authority, user management</td></tr>
</tbody></table></div>
<p>The owner role is not a bearer account that can be handed around; it corresponds to the holder of the trust root. An unknown route or permission is denied by default.</p>
${sectionH("WARDEN classifies every action, fail-closed")}
<p>Before an action runs, WARDEN derives a risk class from the real name of the tool or action — A0 through A3 — and constrains the level of approval required. An action it cannot classify is treated as high risk and denied, not waved through.</p>
${sectionH("The admission chain")}
<p>An action is admitted only if it passes, in order: authentication (a valid local principal), RBAC (the exact permission), a valid signed usage right, an authorized scope (target, time, method, environment), the WARDEN class and its required approval, and egress control. A destructive action additionally requires a multi-party quorum. Any step can end the action; none can be skipped.</p>
${sectionH("Emergency stop is always available")}
<p>Any authenticated principal can move in the safe direction — stop activity or trip a kill switch. Lifting a stop and restoring capability is owner-only. A revoked usage right never prevents an institution from stopping its own system.</p>`
  },
  fr: {
    crumb: "Gouvernance", title: "La chaîne d’autorisation",
    description: "La chaîne d’autorisation de VIGIL est conjonctive et fail-closed : RBAC, droit d’usage signé, portée signée, classe WARDEN, approbation humaine, contrôle de sortie.",
    lede: "Toute action conséquente dans VIGIL traverse la même chaîne de contrôles. Ils sont conjonctifs — tous doivent passer — et fail-closed — l’absence d’un contrôle est un refus, jamais une autorisation par défaut.",
    body: `
${sectionH("Les rôles sont cumulatifs, et owner est la racine de confiance")}
<p>VIGIL utilise quatre rôles cumulatifs. Chacun hérite des permissions inférieures et ajoute les siennes :</p>
<div class="table-wrap" style="margin-top:1rem"><table>
<thead><tr><th>Rôle</th><th>Ajoute</th></tr></thead>
<tbody>
<tr><td>viewer</td><td>lire l’état, lire les preuves, déclencher un arrêt sûr</td></tr>
<tr><td>analyst</td><td>préparer propositions et analyses, sans lancer d’évaluation</td></tr>
<tr><td>operator</td><td>lancer les évaluations ordinaires, approuver le niveau opérateur, basculer les gardes, config non secrète</td></tr>
<tr><td>owner</td><td>la racine de confiance : approbations owner, libération de clés, promotion, secrets, autorité offensive, gestion des utilisateurs</td></tr>
</tbody></table></div>
<p>Le rôle owner n’est pas un compte bearer que l’on se transmet ; il correspond au détenteur de la racine de confiance. Une route ou permission inconnue est refusée par défaut.</p>
${sectionH("WARDEN classe chaque action, fail-closed")}
<p>Avant l’exécution, WARDEN dérive une classe de risque du nom réel de l’outil ou de l’action — de A0 à A3 — et contraint le niveau d’approbation requis. Une action qu’il ne peut pas classer est traitée comme à risque élevé et refusée, non laissée passer.</p>
${sectionH("La chaîne d’admission")}
<p>Une action n’est admise que si elle passe, dans l’ordre : authentification (un principal local valide), RBAC (la permission exacte), un droit d’usage signé valide, une portée autorisée (cible, durée, méthode, environnement), la classe WARDEN et son approbation requise, et le contrôle de sortie réseau. Une action destructive exige en outre un quorum multipartite. Toute étape peut arrêter l’action ; aucune ne peut être contournée.</p>
${sectionH("L’arrêt d’urgence est toujours disponible")}
<p>Tout principal authentifié peut aller dans le sens sûr — arrêter l’activité ou déclencher un kill switch. Lever un arrêt et rétablir une capacité est réservé à owner. Un droit d’usage révoqué n’empêche jamais une institution d’arrêter son propre système.</p>`
  }
};

const evidCopy = {
  en: {
    crumb: "Evidence", title: "The Oracle model: lead versus fact",
    description: "VIGIL's Oracle model separates lead from fact: an observation becomes a confirmed fact only when an independent, deterministic Oracle re-verifies it.",
    lede: "VIGIL refuses to guess. An observation stays a lead until an independent authority re-verifies it into a confirmed fact — and if the check does not fire, the item is not quietly promoted.",
    body: `
${sectionH("What an Oracle is")}
<p>An Oracle is a deterministic rule that re-runs against retained evidence. It does not produce the original observation; it independently checks whether that observation holds. A missing Oracle, absent input, or ambiguous evidence produces a refusal or a skip — never an assumed success.</p>
<figure class="diagram" style="margin-top:1.5rem">${truthDiagram({
      observation: "Observation", observationSub: "sensor / agent output",
      lead: "LEAD", leadSub: "held, not trusted",
      fact: "FACT", factSub: "signed, re-verifiable",
      discard: "Discarded", discardSub: "no confirming signal",
      oracleYes: "Oracle fires", oracleNo: "no signal",
      caption: "An observation becomes a fact only when an independent Oracle re-verifies it; otherwise it stays a lead or is discarded."
    })}<figcaption>An observation becomes a fact only when an independent Oracle re-verifies it.</figcaption></figure>
${sectionH("Proof that survives leaving the tool")}
<p>A confirmed fact is signed and can be re-verified offline: the raw evidence, its digest, its context, and its provenance are retained, and a compatible Oracle can re-run later. A report always distinguishes the levels of truth — what is proven, and what is merely observed.</p>
${sectionH("What the checks do and do not prove")}
<p>The honesty of the model is in its limits. A posture check proves a retained state, not that a live attack was carried out. A request-side parse-proof proves a hostile structure was present, not that the backend was exploited. The absence of a signal is not proof that no vulnerability exists — it means VIGIL does not hold enough evidence to confirm one.</p>`
  },
  fr: {
    crumb: "Preuve", title: "Le modèle des Oracles : piste ou fait",
    description: "Le modèle des Oracles de VIGIL sépare piste et fait : une observation ne devient un fait confirmé que si un Oracle indépendant et déterministe la re-vérifie.",
    lede: "VIGIL refuse de deviner. Une observation reste une piste tant qu’une autorité indépendante ne l’a pas re-vérifiée en fait confirmé — et si la vérification ne se déclenche pas, l’élément n’est pas promu en silence.",
    body: `
${sectionH("Ce qu’est un Oracle")}
<p>Un Oracle est une règle déterministe qui se ré-exécute sur une preuve retenue. Il ne produit pas l’observation initiale ; il vérifie de façon indépendante si cette observation tient. Un Oracle manquant, une entrée absente ou une preuve ambiguë produit un refus ou un saut — jamais un succès supposé.</p>
<figure class="diagram" style="margin-top:1.5rem">${truthDiagram({
      observation: "Observation", observationSub: "sortie capteur / agent",
      lead: "PISTE", leadSub: "retenue, non fiable",
      fact: "FAIT", factSub: "signé, re-vérifiable",
      discard: "Écartée", discardSub: "aucun signal confirmant",
      oracleYes: "Oracle déclenché", oracleNo: "aucun signal",
      caption: "Une observation devient un fait uniquement lorsqu’un Oracle indépendant la re-vérifie ; sinon elle reste une piste ou est écartée."
    })}<figcaption>Une observation devient un fait uniquement lorsqu’un Oracle indépendant la re-vérifie.</figcaption></figure>
${sectionH("Une preuve qui survit à la sortie de l’outil")}
<p>Un fait confirmé est signé et re-vérifiable hors ligne : la preuve brute, son empreinte, son contexte et sa provenance sont conservés, et un Oracle compatible peut se ré-exécuter plus tard. Un rapport distingue toujours les niveaux de vérité — ce qui est prouvé, et ce qui est seulement observé.</p>
${sectionH("Ce que les vérifications prouvent, et ne prouvent pas")}
<p>L’honnêteté du modèle réside dans ses limites. Une vérification de posture prouve un état retenu, non qu’une attaque live a été menée. Un parse-proof côté requête prouve qu’une structure hostile était présente, non que le backend a été exploité. L’absence de signal ne prouve pas l’absence de vulnérabilité — elle signifie que VIGIL ne détient pas assez de preuve pour en confirmer une.</p>`
  }
};

const sovCopy = {
  en: {
    crumb: "Sovereignty", title: "Deployment, keys, and revocation",
    description: "A VIGIL installation runs on the institution's hardware: no default SIGIL access, no telemetry, and revocation never blocks the institution's data.",
    lede: "The sovereignty model is concrete. The institution controls the hardware, the keys, the targets, the logs, the evidence, and the reports. SIGIL's role stops at signing the software and issuing usage rights.",
    body: `
${sectionH("No backdoor, no telemetry, no hidden account")}
<p>Both editions run on the institution's infrastructure. Operator accounts, targets, logs, evidence, reports, keys, and results stay under the institution's control. SIGIL has no default access to that data, does not see engagements, and holds no hidden administrative account.</p>
${sectionH("A revocable right that is not a kill-switch")}
<p>An installation with no telemetry — possibly air-gapped — cannot be revoked instantly from afar without introducing a control channel, and that channel would contradict sovereignty and create risk. Instead, usage rights take the form of a signed usage-rights certificate, verified locally. The institution holds only the public key needed to verify it.</p>
${sectionH("What revocation does, and does not, do")}
<div class="table-wrap" style="margin-top:1rem"><table>
<thead><tr><th>Always permitted</th><th>Blocked on expiry or revocation</th></tr></thead>
<tbody>
<tr><td>Read, search, and export your data</td><td>New active scans</td></tr>
<tr><td>Verify and replay existing evidence</td><td>Launching advanced engines</td></tr>
<tr><td>Backup, staging restore, and migration</td><td>Creating new permits</td></tr>
<tr><td>Emergency stop and safe shutdown</td><td>Re-enabling or bypassing the status</td></tr>
</tbody></table></div>
<p>Revocation blocks new sensitive actions. It never blocks the institution's access to its own data, and it never prevents the institution from stopping the system.</p>
${sectionH("Updates and support")}
<p>Updates are signed and shipped with a build manifest and a software bill of materials; offline import is supported. Optional version reporting sends only a version and channel identifier — never assets or results. Support receives only a redacted diagnostic bundle generated locally and shared voluntarily. For a sensitive incident, temporary access must be approved by the institution, logged, bounded, and revoked at closure; the default remains no access.</p>`
  },
  fr: {
    crumb: "Souveraineté", title: "Déploiement, clés et révocation",
    description: "Une installation VIGIL s’exécute sur le matériel de l’institution : aucun accès SIGIL par défaut, aucune télémétrie, et la révocation ne bloque jamais les données.",
    lede: "Le modèle de souveraineté est concret. L’institution contrôle le matériel, les clés, les cibles, les journaux, les preuves et les rapports. Le rôle de SIGIL s’arrête à la signature du logiciel et à l’émission des droits d’usage.",
    body: `
${sectionH("Aucune backdoor, aucune télémétrie, aucun compte caché")}
<p>Les deux éditions s’exécutent sur l’infrastructure de l’institution. Comptes opérateurs, cibles, journaux, preuves, rapports, clés et résultats restent sous son contrôle. SIGIL ne dispose d’aucun accès par défaut à ces données, ne voit pas les opérations et ne détient aucun compte d’administration caché.</p>
${sectionH("Un droit révocable qui n’est pas un kill-switch")}
<p>Une installation sans télémétrie — éventuellement air-gapped — ne peut pas être révoquée instantanément à distance sans introduire un canal de contrôle, et ce canal contredirait la souveraineté et créerait un risque. À la place, les droits d’usage prennent la forme d’un certificat de droits d’usage signé, vérifié localement. L’institution ne détient que la clé publique nécessaire à sa vérification.</p>
${sectionH("Ce que la révocation fait, et ne fait pas")}
<div class="table-wrap" style="margin-top:1rem"><table>
<thead><tr><th>Toujours permis</th><th>Bloqué à l’expiration ou révocation</th></tr></thead>
<tbody>
<tr><td>Lire, rechercher et exporter vos données</td><td>Nouveaux scans actifs</td></tr>
<tr><td>Vérifier et rejouer les preuves existantes</td><td>Lancement des moteurs avancés</td></tr>
<tr><td>Sauvegarde, restauration en staging et migration</td><td>Création de nouveaux permis</td></tr>
<tr><td>Arrêt d’urgence et extinction sûre</td><td>Réactivation ou contournement du statut</td></tr>
</tbody></table></div>
<p>La révocation bloque les nouvelles actions sensibles. Elle ne bloque jamais l’accès de l’institution à ses données, et n’empêche jamais l’institution d’arrêter le système.</p>
${sectionH("Mises à jour et support")}
<p>Les mises à jour sont signées et livrées avec un manifeste de build et une nomenclature logicielle ; l’import hors ligne est pris en charge. Le rapport de version facultatif n’envoie qu’un identifiant de version et de canal — jamais d’actifs ni de résultats. Le support ne reçoit qu’un bundle diagnostique expurgé, généré localement et partagé volontairement. Pour un incident sensible, un accès temporaire doit être approuvé par l’institution, journalisé, borné et révoqué à la clôture ; le défaut reste sans accès.</p>`
  }
};

function sectionH(t) { return `<h2 class="h-seal">${seal({ size: 20 })}<span>${t}</span></h2>`; }

export function vigilGovernance(lang) { return subPage(lang, "governance", govCopy[lang]); }
export function vigilEvidence(lang) { return subPage(lang, "evidence", evidCopy[lang]); }
export function vigilSovereignty(lang) { return subPage(lang, "sovereignty", sovCopy[lang]); }
