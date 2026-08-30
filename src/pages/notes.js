import { page } from "../lib/layout.js";
import { strings, routes } from "../data/strings.js";
import { h2, cta } from "../lib/ui.js";
import { seal } from "../assets/mark.js";
import { orgNode, articleNode, breadcrumb, graph } from "../lib/jsonld.js";
import facts from "../data/facts.json" with { type: "json" };

// Each note is authored in both languages. Slugs differ per language tree.
const NOTES = [
  {
    slug: { en: "capability-is-not-authorization", fr: "capacite-nest-pas-autorisation" },
    date: "2026-08-15",
    en: {
      title: "Capability is not authorization",
      abstract: "Why a system should treat the ability to act and the permission to act as two separate things — and how a conjunctive, fail-closed gate enforces that separation.",
      body: `
<p>Most security incidents are not caused by a system that could not do something. They are caused by a system that could, and did, without anyone having decided it should. The lesson is old, and it has a compact statement: a technical capability is never an authorization.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>The two things people conflate</span></h2>
<p>"Can this run?" and "May this run?" are different questions with different owners. The first is a fact about the software. The second is a decision that belongs to a person or a policy. When a design lets the first answer stand in for the second, it has quietly handed authority to whatever component happens to be able to act — a model, an agent, an imported result, a plugin.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>A gate, not a checkbox</span></h2>
<p>Separating the two means every consequential action must pass an explicit chain of controls before it runs: an authenticated identity, the exact permission for the action, a valid signed usage right, an authorized scope, a risk classification, the human approval that risk demands, and control over where the action may reach on the network. The chain is conjunctive — all of it must pass — and fail-closed — a control that is missing or unreadable is a denial, not a default allow.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Why fail-closed is the whole point</span></h2>
<p>A gate that fails open is not a gate; it is a speed bump. The value of the design is precisely in what it refuses when something is ambiguous. An action whose risk cannot be classified is treated as high risk and denied. A finding whose evidence cannot be re-verified stays a lead. The system's honesty lives in the cases where it declines to proceed.</p>`
    },
    fr: {
      title: "Une capacité n’est pas une autorisation",
      abstract: "Pourquoi un système devrait traiter la capacité d’agir et la permission d’agir comme deux choses distinctes — et comment une porte conjonctive et fail-closed impose cette séparation.",
      body: `
<p>La plupart des incidents de sécurité ne viennent pas d’un système qui ne pouvait pas faire quelque chose. Ils viennent d’un système qui le pouvait, et l’a fait, sans que personne n’ait décidé qu’il le devait. La leçon est ancienne, et elle a un énoncé compact : une capacité technique n’est jamais une autorisation.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Les deux choses que l’on confond</span></h2>
<p>« Cela peut-il s’exécuter ? » et « Cela doit-il s’exécuter ? » sont deux questions distinctes, avec des responsables distincts. La première est un fait sur le logiciel. La seconde est une décision qui appartient à une personne ou à une politique. Lorsqu’une conception laisse la première réponse tenir lieu de la seconde, elle a discrètement remis l’autorité à ce qui se trouve capable d’agir — un modèle, un agent, un résultat importé, un plugin.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Une porte, pas une case à cocher</span></h2>
<p>Séparer les deux signifie que toute action conséquente doit passer une chaîne explicite de contrôles avant de s’exécuter : une identité authentifiée, la permission exacte pour l’action, un droit d’usage signé valide, une portée autorisée, une classification de risque, l’approbation humaine que ce risque exige, et le contrôle de la destination réseau. La chaîne est conjonctive — tout doit passer — et fail-closed — un contrôle manquant ou illisible est un refus, non une autorisation par défaut.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Pourquoi le fail-closed est l’essentiel</span></h2>
<p>Une porte qui échoue en position ouverte n’est pas une porte ; c’est un ralentisseur. La valeur de la conception réside précisément dans ce qu’elle refuse lorsqu’une chose est ambiguë. Une action dont le risque ne peut être classé est traitée comme à risque élevé et refusée. Un constat dont la preuve ne peut être re-vérifiée reste une piste. L’honnêteté du système vit dans les cas où il refuse d’avancer.</p>`
    }
  },
  {
    slug: { en: "lead-versus-fact", fr: "piste-contre-fait" },
    date: "2026-08-08",
    en: {
      title: "Lead versus fact: why a scanner should refuse to guess",
      abstract: "The difference between an observation and a confirmed fact, and why re-verifiable evidence is the only honest basis for a security finding.",
      body: `
<p>A security tool that reports everything it suspects is not thorough; it is noisy, and noise is expensive. The discipline that makes findings useful is a refusal to promote a suspicion to a fact without an independent check.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Three states, not two</span></h2>
<p>An observation is what a sensor or an agent produced. A lead is an observation that has been retained but not trusted. A fact is a lead that an independent, deterministic check has re-verified. The third state is the only one a report should present as true — and it should always be distinguishable from the second.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Re-verifiable or it did not happen</span></h2>
<p>Confirmation should not depend on the tool that made the claim. A confirmed fact carries its raw evidence, a digest, its context, and its provenance, so that a compatible check can re-run later — offline, by someone else. If a finding cannot survive leaving the tool that produced it, it is not yet a fact.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>The honest null result</span></h2>
<p>The absence of a confirming signal is not proof that nothing is wrong. It means the tool does not hold enough evidence to confirm that something is. Reporting the two as the same thing is the most common way a security report misleads the person reading it.</p>`
    },
    fr: {
      title: "Piste contre fait : pourquoi un scanner devrait refuser de deviner",
      abstract: "La différence entre une observation et un fait confirmé, et pourquoi une preuve re-vérifiable est la seule base honnête d’un constat de sécurité.",
      body: `
<p>Un outil de sécurité qui signale tout ce qu’il soupçonne n’est pas rigoureux ; il est bruyant, et le bruit coûte cher. La discipline qui rend les constats utiles est un refus de promouvoir un soupçon en fait sans vérification indépendante.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Trois états, pas deux</span></h2>
<p>Une observation est ce qu’un capteur ou un agent a produit. Une piste est une observation retenue mais non fiable. Un fait est une piste qu’une vérification indépendante et déterministe a re-vérifiée. Le troisième état est le seul qu’un rapport devrait présenter comme vrai — et il devrait toujours être distinguable du second.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Re-vérifiable, sinon cela n’a pas eu lieu</span></h2>
<p>La confirmation ne devrait pas dépendre de l’outil qui a émis l’affirmation. Un fait confirmé porte sa preuve brute, une empreinte, son contexte et sa provenance, afin qu’une vérification compatible puisse se ré-exécuter plus tard — hors ligne, par quelqu’un d’autre. Si un constat ne peut survivre à la sortie de l’outil qui l’a produit, ce n’est pas encore un fait.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Le résultat nul honnête</span></h2>
<p>L’absence de signal confirmant n’est pas la preuve que rien ne va. Elle signifie que l’outil ne détient pas assez de preuve pour confirmer que quelque chose ne va pas. Présenter les deux comme identiques est la manière la plus courante par laquelle un rapport de sécurité trompe son lecteur.</p>`
    }
  },
  {
    slug: { en: "a-key-that-is-not-a-kill-switch", fr: "une-cle-qui-nest-pas-un-kill-switch" },
    date: "2026-08-01",
    en: {
      title: "A revocable key that is not a kill-switch",
      abstract: "How to make a usage right revocable without building a remote channel into a sovereign deployment — and why the difference matters.",
      body: `
<p>A vendor that can revoke a licence from afar has, by construction, a channel into the customer's system. For most software that is unremarkable. For sovereign infrastructure — a deployment an institution runs on its own hardware, possibly air-gapped — it is a contradiction: the very channel that enables instant remote revocation is the channel that breaks the promise of sovereignty.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>The tension, stated plainly</span></h2>
<p>You want two things that pull apart. You want the institution to hold its own system with no outside control channel. And you want usage rights that can expire or be withdrawn. A naive design resolves the tension by adding a channel — and quietly loses the first property to gain the second.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Resolve it with a signed certificate, verified locally</span></h2>
<p>The alternative is to make the usage right a signed usage-rights certificate that the deployment verifies locally. The institution holds only the public key needed to check it. There is no channel in; there is a document that the system reads. Revocation, where it applies, is a signed statement the institution can import — connected or by hand — not a remote command.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>What revocation may and may not touch</span></h2>
<p>The line that makes this safe is simple. Revocation blocks new sensitive actions. It never blocks the institution's access to its own data, and it never prevents the institution from stopping the system. A right that could lock an institution out of its own records, or keep it from pulling its own emergency stop, would not be a licence term — it would be the backdoor the design set out to avoid.</p>`
    },
    fr: {
      title: "Une clé révocable qui n’est pas un kill-switch",
      abstract: "Comment rendre un droit d’usage révocable sans construire un canal distant vers un déploiement souverain — et pourquoi la différence compte.",
      body: `
<p>Un fournisseur qui peut révoquer une licence à distance dispose, par construction, d’un canal vers le système du client. Pour la plupart des logiciels, cela n’a rien de remarquable. Pour une infrastructure souveraine — un déploiement qu’une institution exécute sur son propre matériel, éventuellement air-gapped — c’est une contradiction : le canal même qui permet la révocation distante instantanée est celui qui brise la promesse de souveraineté.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>La tension, dite clairement</span></h2>
<p>Vous voulez deux choses qui s’opposent. Vous voulez que l’institution détienne son propre système sans canal de contrôle extérieur. Et vous voulez des droits d’usage qui peuvent expirer ou être retirés. Une conception naïve résout la tension en ajoutant un canal — et perd discrètement la première propriété pour gagner la seconde.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Résolvez-la par un certificat signé, vérifié localement</span></h2>
<p>L’alternative consiste à faire du droit d’usage un certificat de droits d’usage signé que le déploiement vérifie localement. L’institution ne détient que la clé publique nécessaire à sa vérification. Il n’y a pas de canal entrant ; il y a un document que le système lit. La révocation, lorsqu’elle s’applique, est une déclaration signée que l’institution peut importer — connectée ou à la main — non une commande distante.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Ce que la révocation peut, et ne peut pas, toucher</span></h2>
<p>La ligne qui rend cela sûr est simple. La révocation bloque les nouvelles actions sensibles. Elle ne bloque jamais l’accès de l’institution à ses données, et n’empêche jamais l’institution d’arrêter le système. Un droit qui pourrait verrouiller une institution hors de ses propres enregistrements, ou l’empêcher de déclencher son propre arrêt d’urgence, ne serait pas une clause de licence — ce serait la backdoor que la conception cherchait à éviter.</p>`
    }
  }
];

function notePath(n, lang) { return routes.notes[lang] + n.slug[lang] + "/"; }

export function notesIndex(lang) {
  const alt = lang === "en" ? "fr" : "en";
  const title = lang === "fr" ? "Notes" : "Notes";
  const description = lang === "fr"
    ? "Notes d’ingénierie et de doctrine de SIGIL : capacité et autorisation, piste contre fait, et licences souveraines sans backdoor."
    : "Engineering and doctrine notes from SIGIL: capability versus authorization, lead versus fact, and sovereign licensing without a backdoor.";
  const lede = lang === "fr"
    ? "Notes brèves sur la façon dont nous construisons et pourquoi. Chacune répond à une question que les institutions posent."
    : "Short notes on how we build and why. Each answers one question institutions ask.";

  const jsonld = graph([
    orgNode(facts),
    breadcrumb(facts, [
      { name: "SIGIL", path: routes.home[lang] },
      { name: "Notes", path: routes.notes[lang] }
    ])
  ]);

  const items = NOTES.map((n) => {
    const L = n[lang];
    return `<li class="reveal">
      <span class="date">${new Date(n.date).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
      <div>
        <div class="title"><a href="${notePath(n, lang)}" style="text-decoration:none">${L.title}</a></div>
        <p class="muted" style="margin-top:.4rem">${L.abstract}</p>
        <a class="mono" href="${notePath(n, lang)}" style="color:var(--accent-ink);font-size:var(--step--1)">${strings[lang].read_more} →</a>
      </div>
    </li>`;
  }).join("");

  const body = `
<section class="section wrap">
  <p class="eyebrow">${strings[lang].nav.notes}</p>
  <h1>${title}</h1>
  <p class="lead" style="margin-top:1rem;max-width:62ch">${lede}</p>
  <ul class="record" style="margin-top:2.5rem">${items}</ul>
</section>`;

  return page({
    lang, current: "notes", title, description,
    path: routes.notes[lang], altPath: routes.notes[alt], altLang: alt,
    ogType: "website", jsonld, body
  });
}

export function notePages(lang) {
  const alt = lang === "en" ? "fr" : "en";
  return NOTES.map((n) => {
    const L = n[lang];
    const path = notePath(n, lang);
    const altPath = notePath(n, alt);
    const jsonld = graph([
      orgNode(facts),
      articleNode(facts, { path, title: L.title, abstract: L.abstract, date: n.date }, lang),
      breadcrumb(facts, [
        { name: "SIGIL", path: routes.home[lang] },
        { name: "Notes", path: routes.notes[lang] },
        { name: L.title, path }
      ])
    ]);
    const body = `
<article class="section wrap">
  <p class="eyebrow"><a href="${routes.notes[lang]}" style="color:inherit;text-decoration:none">${strings[lang].nav.notes}</a> · ${new Date(n.date).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
  <h1>${L.title}</h1>
  <p class="lead" style="margin-top:1rem;max-width:62ch">${L.abstract}</p>
  <div class="prose" style="margin-top:2.5rem">${L.body}</div>
  <p style="margin-top:2.5rem">${cta(lang)}</p>
</article>`;
    return {
      path,
      html: page({
        lang, current: "notes", title: L.title, description: L.abstract,
        path, altPath, altLang: alt, ogType: "article", jsonld, body
      })
    };
  });
}
