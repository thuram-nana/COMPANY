import { page } from "../lib/layout.js";
import { strings, routes } from "../data/strings.js";
import { h2, cta } from "../lib/ui.js";
import { seal } from "../assets/mark.js";
import { orgNode, articleNode, breadcrumb, graph } from "../lib/jsonld.js";
import facts from "../data/facts.json" with { type: "json" };

// Each note is authored in both languages. Slugs differ per language tree.
const NOTES = [
  {
    slug: { en: "commonwealth-yaounde-ai-anticorruption", fr: "commonwealth-yaounde-ia-anticorruption" },
    date: "2026-09-06",
    en: {
      title: "Anti-corruption technology in Cameroon: after Yaoundé",
      abstract: "The Commonwealth's Yaoundé conference set an AI agenda. What anti-corruption technology in Cameroon requires of procurement data before any model helps.",
      body: `
<h2 class="h-seal">${seal({ size: 20 })}<span>What was proposed in Yaoundé</span></h2>
<p>From 4 to 8 May 2026, Yaoundé hosted the <a href="https://thecommonwealth.org/events/16th-commonwealth-regional-conference-heads-anti-corruption-agencies-africa" rel="noopener">16th Commonwealth Regional Conference of Heads of Anti-Corruption Agencies in Africa</a>, convened by the Government of Cameroon in partnership with the Commonwealth Secretariat under a deliberately pointed theme: “Deploying Artificial Intelligence in the Fight Against Corruption in Commonwealth Africa.” For anyone following anti-corruption technology in Cameroon, the event marked a shift worth recording: the question in the room was no longer whether machine analysis belongs in the anti-corruption toolkit, but how to deploy it.</p>
<p>The sessions were concrete about the intended uses. According to the <a href="https://thecommonwealth.org/news/commonwealth-conference-champions-ai-solutions-combat-corruption-africa" rel="noopener">Commonwealth Secretariat's account of the conference</a>, delegates examined how AI-driven tools can support investigations, sharpen data analysis, improve risk detection and strengthen public-sector oversight, with national case studies turning on the ethical safeguards responsible deployment requires. Dr Roger Koranteng of the Secretariat's Governance and Peace Directorate stated the conditional that matters: AI offers new tools, new insights and new opportunities — but only if it is harnessed with integrity.</p>
<p>The scale of the problem was quantified in the host country's own figures. As <a href="https://iafrica.com/commonwealth-anti-corruption-conference-in-cameroon-sets-out-vision-for-ai-powered-fight-against-corruption-in-africa/" rel="noopener">reported from the conference</a>, Cameroon's National Anti-Corruption Commission (CONAC) received 10,520 corruption reports in 2024, with the resulting loss to the state estimated at just over 4 billion CFA francs; the Commonwealth noted that it has trained more than 7,000 officials across its 21 African member countries since 2011.</p>
<p>The conference closed with practical recommendations rather than a declaration of victory. <a href="https://www.financialafrik.com/en/2026/05/11/in-yaounde-the-commonwealth-leads-the-reflection-on-anti-corruption-efforts-in-africa/" rel="noopener">Coverage of the closing sessions</a> records more than 200 participants and three recurring asks: data sharing among member states, sustained training of officials, and harmonisation of legal frameworks. The Secretariat said the outcomes would inform Commonwealth Heads of Government discussions on governance reform and progress toward SDG 16.</p>
<p>The ambition is the right one, and this note takes it seriously. Precisely for that reason, the useful next question is unglamorous. Between a conference recommendation and a working detection system sits a layer nobody photographs: the procurement data itself, and the properties of the system that reads it. That layer decides whether AI against corruption becomes an instrument or a press release.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>What anti-corruption technology requires of the data</span></h2>
<p>Corruption-pattern detection is not a model problem first; it is a disclosure problem first. An algorithm cannot find bid rigging in a scanned PDF of an award notice. It needs structured records — who bought, who bid, who won, at what price, on what dates, amended how — published as data across the whole contracting cycle, from planning through tender, award, contract and implementation. This is what the <a href="https://standard.open-contracting.org/latest/en/" rel="noopener">Open Contracting Data Standard (OCDS)</a> exists to make possible: a common, open data model for the full lifecycle, so that analysis is not locked to one buyer's filing habits or one vendor's schema.</p>
<p>Completeness matters more than sophistication. The signature patterns of procurement fraud — a tender window too short to be real, repeated single-bidder awards, amendments that quietly double a contract's value after signature — live in exactly the fields that partial disclosure omits. A model trained on incomplete records learns the shape of the gap, not the shape of the fraud. And the discipline has a corollary any honest system must state plainly: in a dataset with holes, the absence of a red flag is not evidence of a clean process. It is evidence of nothing.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Entity resolution: knowing who is actually bidding</span></h2>
<p>The unit of procurement corruption is rarely a single tender; it is a network. The same supplier appearing under three spellings. Two “competing” bidders sharing a director, an address or an owner. A winning company connected to the official who signed the award. None of this is visible in tender data alone; it becomes visible only when records about companies and people are resolved to stable identities and linked across sources.</p>
<p>Entity resolution is therefore where procurement analytics quietly succeeds or fails, and it must be engineered as evidence, not as guessing. A match between two names is a claim with a measurable confidence, never a fact by default. Merge too eagerly and the system accuses the innocent — two genuinely distinct companies fused into one suspicious profile. Merge too timidly and a coordinated ring appears as unrelated strangers. A serious system quantifies the uncertainty of every link, records the basis of every merge, and routes the ambiguous cases to a human reviewer rather than resolving them by default.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>The analytical system must itself stand audit</span></h2>
<p>A system that flags a company for investigation is exercising a fragment of public power. That carries an implication the Yaoundé theme, to its credit, acknowledged in its attention to safeguards: an unauditable anti-corruption tool is a new opaque authority — the very thing anti-corruption work exists to eliminate.</p>
<p>Auditability here is specific, not rhetorical. For any flag the system raises, it must be possible to establish afterwards: which version of which data it read; which rule or model fired, and why; what evidence supports the finding; who saw it, and when; and what was decided. Findings must be re-verifiable outside the tool that produced them — carried with their evidence, so that an inspector, a judge or a defence lawyer can re-run the check without trusting the platform's word. A finding that cannot survive leaving the system that produced it is not yet a fact; it is a lead, and it must be labelled as one.</p>
<p>This is also what protects the analysis from its own operators. Tamper-evident logs and signed findings do not only prove what the system did; they make it detectable when someone tries to make the system un-see something.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Decision authority stays human</span></h2>
<p>The last requirement is the one most easily eroded in deployment: no model output should, by itself, open an investigation, refer a company or trigger a sanction. The machine compiles evidence and states its confidence; an accountable institution decides. The distinction is not a courtesy — it is an integrity control. A capability to flag is not an authorization to act, and a pipeline that lets the first quietly become the second has recreated, in software, the unaccountable discretion it was built to remove.</p>
<p>Human authority must itself be structured to survive pressure: consequential decisions taken by more than one person, with written justification, on the record. That protects citizens from the model's errors — and it protects officials too. A decision made by named people on recorded evidence survives review; “the system said so” does not.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>What this means for Central Africa</span></h2>
<p>It matters that this conversation happened in Yaoundé. <a href="https://www.financialafrik.com/en/2026/05/11/in-yaounde-the-commonwealth-leads-the-reflection-on-anti-corruption-efforts-in-africa/" rel="noopener">Coverage of the conference</a> pointed to the breadth of Cameroon's existing control institutions — CONAC, the National Financial Investigations Agency (ANIF), the Chamber of Accounts, the Supreme State Audit (CONSUPE). The machinery of oversight exists; the question the conference posed is what that machinery can see. For Central Africa, the answer will be decided less by which model a country licenses than by which data its procurement process emits.</p>
<p>The practical opportunity is sequencing. Structured disclosure, resolved entities, auditable analysis, human authority: the first item is the cheapest and the least glamorous, and everything else depends on it. A jurisdiction that invests first in complete, structured, open-standard procurement data will find that even simple analytics begin to work — and that the sophisticated tools finally have something real to read. We map the institutions and frameworks that shape this terrain at <a href="/procurement-integrity-cameroon/">procurement integrity in Cameroon</a>.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Where SIGIL stands</span></h2>
<p>SIGIL is a Cameroonian company, in Buea, building in exactly this space — and it is early. <a href="/systems/apex/">APEX</a>, our anti-corruption intelligence system for public procurement, is designed to the requirements this note describes: it reads public data, detects defined patterns of procurement fraud, scores each finding with a calibrated certainty engine, and keeps every consequential decision with a human institution — no single person, and no model, can escalate a case. APEX is pre-deployment: it has no customers, no pilots and no deployments, and we say so plainly. Our standing rule is the one against which Yaoundé's theme will ultimately be judged: the institution holds the keys; the data stays under the institution's control; every consequential action is authorized, bounded, and proven.</p>`
    },
    fr: {
      title: "Technologie anti-corruption au Cameroun : après Yaoundé",
      abstract: "La conférence du Commonwealth à Yaoundé a fixé un agenda d'IA. Ce que la technologie anti-corruption au Cameroun exige des données de la commande publique.",
      body: `
<h2 class="h-seal">${seal({ size: 20 })}<span>Ce qui a été proposé à Yaoundé</span></h2>
<p>Du 4 au 8 mai 2026, Yaoundé a accueilli la <a href="https://thecommonwealth.org/events/16th-commonwealth-regional-conference-heads-anti-corruption-agencies-africa" rel="noopener">16e Conférence régionale du Commonwealth des dirigeants des agences anti-corruption d'Afrique</a>, organisée par le gouvernement du Cameroun en partenariat avec le Secrétariat du Commonwealth, autour d'un thème sans ambiguïté : le déploiement de l'intelligence artificielle dans la lutte contre la corruption en Afrique du Commonwealth. Pour qui suit la technologie anti-corruption au Cameroun, l'événement marque un déplacement qu'il faut consigner : la question posée n'était plus de savoir si l'analyse automatique a sa place dans l'arsenal anti-corruption, mais comment la déployer.</p>
<p>Les sessions ont été concrètes sur les usages visés. Selon le <a href="https://thecommonwealth.org/news/commonwealth-conference-champions-ai-solutions-combat-corruption-africa" rel="noopener">compte rendu du Secrétariat du Commonwealth</a>, les délégués ont examiné comment des outils fondés sur l'IA peuvent appuyer les enquêtes, affiner l'analyse des données, améliorer la détection des risques et renforcer le contrôle du secteur public, des études de cas nationales portant sur les garde-fous éthiques qu'exige un déploiement responsable. Le Dr Roger Koranteng, de la direction Gouvernance et Paix du Secrétariat, a posé la condition qui compte : l'IA offre de nouveaux outils, de nouvelles perspectives et de nouvelles possibilités — mais seulement si elle est mise en œuvre avec intégrité.</p>
<p>L'ampleur du problème a été chiffrée par le pays hôte lui-même. Comme <a href="https://iafrica.com/commonwealth-anti-corruption-conference-in-cameroon-sets-out-vision-for-ai-powered-fight-against-corruption-in-africa/" rel="noopener">rapporté depuis la conférence</a>, la Commission nationale anti-corruption (CONAC) a reçu 10 520 signalements de corruption en 2024, la perte subie par l'État étant estimée à un peu plus de 4 milliards de francs CFA ; le Commonwealth a rappelé avoir formé plus de 7 000 agents dans ses 21 États membres africains depuis 2011.</p>
<p>La conférence s'est conclue sur des recommandations pratiques, non sur une déclaration de victoire. <a href="https://www.financialafrik.com/en/2026/05/11/in-yaounde-the-commonwealth-leads-the-reflection-on-anti-corruption-efforts-in-africa/" rel="noopener">La couverture des sessions de clôture</a> fait état de plus de 200 participants et de trois demandes récurrentes : le partage de données entre États membres, la formation soutenue des agents, et l'harmonisation des cadres juridiques. Le Secrétariat a indiqué que les conclusions nourriraient les discussions des chefs de gouvernement du Commonwealth sur la réforme de la gouvernance et l'ODD 16.</p>
<p>L'ambition est la bonne, et cette note la prend au sérieux. Précisément pour cette raison, la question utile qui suit est sans éclat. Entre une recommandation de conférence et un système de détection qui fonctionne se trouve une couche que personne ne photographie : les données de la commande publique elles-mêmes, et les propriétés du système qui les lit. C'est cette couche qui décide si l'IA contre la corruption devient un instrument ou un communiqué de presse.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Ce que la technologie anti-corruption exige des données</span></h2>
<p>La détection des schémas de corruption n'est pas d'abord un problème de modèle ; c'est d'abord un problème de publication. Un algorithme ne trouvera pas une entente sur les offres dans le PDF scanné d'un avis d'attribution. Il lui faut des enregistrements structurés — qui a acheté, qui a soumissionné, qui a gagné, à quel prix, à quelles dates, avec quels avenants — publiés en données sur l'ensemble du cycle contractuel, de la planification à l'exécution en passant par l'appel d'offres, l'attribution et le contrat. C'est ce que le <a href="https://standard.open-contracting.org/latest/en/" rel="noopener">standard de données sur la commande publique ouverte (OCDS)</a> existe pour rendre possible : un modèle de données commun et ouvert couvrant tout le cycle de vie, afin que l'analyse ne soit prisonnière ni des habitudes de classement d'un acheteur, ni du schéma d'un fournisseur.</p>
<p>La complétude compte davantage que la sophistication. Les schémas caractéristiques de la fraude aux marchés publics — un délai de soumission trop court pour être réel, des attributions répétées à soumissionnaire unique, des avenants qui doublent discrètement la valeur d'un contrat après signature — vivent exactement dans les champs qu'une publication partielle omet. Un modèle entraîné sur des enregistrements incomplets apprend la forme du trou, pas la forme de la fraude. Et la discipline a un corollaire que tout système honnête doit énoncer clairement : dans un jeu de données troué, l'absence de signal d'alerte n'est pas la preuve d'un processus sain. Ce n'est la preuve de rien.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Résolution d'entités : savoir qui soumissionne réellement</span></h2>
<p>L'unité de la corruption dans les marchés publics est rarement un appel d'offres isolé ; c'est un réseau. Le même fournisseur sous trois orthographes. Deux soumissionnaires « concurrents » partageant un dirigeant, une adresse ou un propriétaire. Une entreprise attributaire liée au responsable qui a signé l'attribution. Rien de tout cela n'est visible dans les seules données d'appels d'offres ; cela ne devient visible que lorsque les enregistrements relatifs aux entreprises et aux personnes sont résolus en identités stables et reliés entre les sources.</p>
<p>La résolution d'entités est donc l'endroit où l'analyse des marchés publics réussit ou échoue en silence, et elle doit être construite comme une preuve, non comme une devinette. Une correspondance entre deux noms est une affirmation dotée d'une confiance mesurable, jamais un fait par défaut. Fusionner trop vite, et le système accuse des innocents — deux entreprises réellement distinctes fondues en un seul profil suspect. Fusionner trop timidement, et un réseau coordonné apparaît comme des inconnus sans lien. Un système sérieux quantifie l'incertitude de chaque lien, consigne le fondement de chaque fusion, et renvoie les cas ambigus à un examinateur humain au lieu de les trancher par défaut.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Le système d'analyse doit lui-même supporter l'audit</span></h2>
<p>Un système qui signale une entreprise pour enquête exerce un fragment de puissance publique. Cela emporte une conséquence que le thème de Yaoundé, à son crédit, a reconnue par son attention aux garde-fous : un outil anti-corruption inauditable est une nouvelle autorité opaque — précisément ce que le travail anti-corruption existe pour éliminer.</p>
<p>L'auditabilité, ici, est précise, non rhétorique. Pour tout signalement émis par le système, il doit être possible d'établir après coup : quelle version de quelles données il a lue ; quelle règle ou quel modèle s'est déclenché, et pourquoi ; quelles preuves soutiennent le constat ; qui l'a vu, et quand ; et ce qui a été décidé. Les constats doivent être re-vérifiables hors de l'outil qui les a produits — portés avec leurs preuves, afin qu'un inspecteur, un juge ou un avocat de la défense puisse ré-exécuter la vérification sans croire la plateforme sur parole. Un constat qui ne survit pas à la sortie du système qui l'a produit n'est pas encore un fait ; c'est une piste, et il doit être étiqueté comme telle.</p>
<p>C'est aussi ce qui protège l'analyse de ses propres opérateurs. Des journaux infalsifiables et des constats signés ne prouvent pas seulement ce que le système a fait ; ils rendent détectable toute tentative de faire « dé-voir » quelque chose au système.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>La décision reste humaine</span></h2>
<p>La dernière exigence est celle qui s'érode le plus facilement en déploiement : aucune sortie de modèle ne devrait, à elle seule, ouvrir une enquête, déférer une entreprise ou déclencher une sanction. La machine rassemble des preuves et énonce sa confiance ; une institution responsable décide. La distinction n'est pas une politesse — c'est un contrôle d'intégrité. La capacité de signaler n'est pas l'autorisation d'agir, et une chaîne qui laisse la première devenir discrètement la seconde a recréé, en logiciel, le pouvoir discrétionnaire sans comptes à rendre qu'elle devait supprimer.</p>
<p>L'autorité humaine doit elle-même être structurée pour résister à la pression : des décisions conséquentes prises à plusieurs, avec justification écrite, consignées. Cela protège les citoyens des erreurs du modèle — et cela protège aussi les agents publics. Une décision prise par des personnes nommées sur des preuves enregistrées survit au contrôle ; « le système l'a dit » n'y survit pas.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Ce que cela signifie pour l'Afrique centrale</span></h2>
<p>Il compte que cette conversation ait eu lieu à Yaoundé. <a href="https://www.financialafrik.com/en/2026/05/11/in-yaounde-the-commonwealth-leads-the-reflection-on-anti-corruption-efforts-in-africa/" rel="noopener">La couverture de la conférence</a> a rappelé l'étendue des institutions de contrôle existantes du Cameroun — la CONAC, l'Agence nationale d'investigation financière (ANIF), la Chambre des comptes, le Contrôle supérieur de l'État (CONSUPE). La machinerie du contrôle existe ; la question posée par la conférence est ce que cette machinerie peut voir. Pour l'Afrique centrale, la réponse dépendra moins du modèle qu'un pays licencie que des données que son processus de commande publique produit.</p>
<p>L'occasion pratique est une affaire de séquence. Publication structurée, entités résolues, analyse auditable, autorité humaine : le premier chantier est le moins coûteux et le moins spectaculaire, et tout le reste en dépend. Une juridiction qui investit d'abord dans des données de commande publique complètes, structurées et au standard ouvert constatera que même des analyses simples se mettent à fonctionner — et que les outils sophistiqués ont enfin quelque chose de réel à lire. Nous cartographions les institutions et les cadres de ce terrain dans notre page <a href="/fr/integrite-marches-publics-cameroun/">intégrité des marchés publics au Cameroun</a>.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Où en est SIGIL</span></h2>
<p>SIGIL est une entreprise camerounaise, à Buea, qui construit exactement dans cet espace — et qui en est au début. <a href="/fr/systemes/apex/">APEX</a>, notre système de renseignement anti-corruption pour la commande publique, est conçu selon les exigences décrites dans cette note : il lit des données publiques, détecte des schémas définis de fraude aux marchés publics, évalue chaque constat au moyen d'un moteur de certitude calibré, et laisse chaque décision conséquente à une institution humaine — aucune personne seule, et aucun modèle, ne peut escalader une affaire. APEX est en pré-déploiement : sans client, sans pilote et sans déploiement, et nous le disons clairement. Notre règle constante est celle à l'aune de laquelle le thème de Yaoundé sera finalement jugé : l'institution détient les clés ; les données restent sous le contrôle de l'institution ; chaque action conséquente est autorisée, bornée et prouvée.</p>`
    }
  },
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
    ? "Notes d’ingénierie et de doctrine de SIGIL SARL (Buea, Cameroun) : capacité et autorisation, piste contre fait, et licences souveraines sans backdoor."
    : "Engineering and doctrine notes from SIGIL SARL, Buea, Cameroon: capability versus authorization, lead versus fact, and sovereign licensing without a backdoor.";
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
      <span class="date">${new Date(n.date).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</span>
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
  <p class="eyebrow"><a href="${routes.notes[lang]}" style="color:inherit;text-decoration:none">${strings[lang].nav.notes}</a> · ${new Date(n.date).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</p>
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

export const notes = NOTES;
