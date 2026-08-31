import { page } from "../lib/layout.js";
import { strings, routes } from "../data/strings.js";
import { h2, cta } from "../lib/ui.js";
import { seal } from "../assets/mark.js";
import { orgNode, articleNode, breadcrumb, graph } from "../lib/jsonld.js";
import facts from "../data/facts.json" with { type: "json" };

// Each note is authored in both languages. Slugs differ per language tree.
const NOTES = [
  {
    slug: { en: "beneficial-ownership-register-cameroon", fr: "registre-beneficiaire-effectif-cameroun" },
    date: "2026-08-31",
    en: {
      title: "Cameroon’s central register of beneficial owners: what companies need to know",
      abstract: "Cameroon’s central register of beneficial owners: who must declare, how, by which deadlines, under which penalties, and what the FATF requires.",
      body: `
<p>The Central Register of Beneficial Owners (Registre Central du Bénéficiaire Effectif, RCBE) is the system Cameroon’s tax administration operates to collect and store information on the natural persons who ultimately own or control legal entities. It concerns legal persons and administrators of legal arrangements, under Cameroonian or foreign law, established in Cameroon. The declaration obligation is in force, the procedure is online, and failures carry quantified fines.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>What is the central register of beneficial owners?</span></h2>
<p>The <a href="https://www.impots.cm/sites/default/files/documents/GUIDE%20CONTRIBUABLE%20-%20REGISTRE%20CENTRAL%20DU%20BENEFICIAIRE%20EFFECTIF.pdf">taxpayer guide</a> of the Directorate General of Taxation (DGI) defines it as a system for collecting and storing information on the beneficial owners of legal entities. Its purpose is to increase transparency and to prevent money laundering and terrorist financing. The central register is held by the tax administration, and its contents are covered by professional secrecy. Access is reserved to the authorities and bodies the decree lists, under arrangements a text from the Minister of Finance is to specify. The administration may also consult entities’ internal registers during its audits. <a href="https://www.openownership.org/en/map/country/cameroon/">Open Ownership</a> now lists Cameroon among the countries with a live beneficial-ownership register.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Who must declare?</span></h2>
<p>The obligation rests on Article L8 quinquies of the Livre des Procédures Fiscales of the <a href="https://www.impots.cm/sites/default/files/documents/CGI%202024%20version%20francaise.pdf">General Tax Code</a>. It covers legal persons as well as administrators of legal arrangements under Cameroonian or foreign law established in Cameroon. The scope is broad: liability to corporate tax or to personal income tax makes no difference. Each entity must identify its beneficial owners, keep an updated internal register, then declare the information to the tax administration. The obligation was introduced by <a href="https://www.prc.cm/fr/actualites/actes/lois/6217-loi-n-2022-020-du-27-decembre-2022-portant-loi-de-finances-de-la-republique-du-cameroun-pour-l-exercice-2023">Law No. 2022/020 of 27 December 2022</a>, the Finance Law for the 2023 fiscal year. Decree No. 2023/06801/CAB/PM of 27 September 2023 lays down its implementing rules. Entities had three months after that decree’s entry into force to comply.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>What is a beneficial owner?</span></h2>
<p>The DGI defines the beneficial owner as the natural person who ultimately owns, controls or benefits from the entity’s assets or income. A beneficial owner is therefore always a natural person. The implementing decree covers any person holding, directly or indirectly, twenty percent (20%) or more of the capital or voting rights. It extends to persons exercising control by any other means, in law or in fact, and, failing that, to the principal manager. The decree specifies that ultimate ownership or control can also run through a chain of ownership. This approach sits within the regional framework: Regulation No. 01/CEMAC/UMAC/CM of 11 April 2016 is the regional anti-money-laundering instrument applicable in Cameroon.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>How and where to file?</span></h2>
<p>Declarations are filed online on the platform <a href="https://bef.harmony2.cm">bef.harmony2.cm</a>, also reachable from the DGI website, www.impots.cm. The login is the entity’s NIU; the password is the one used for Fiscalis tele-declaration. The platform works on desktop and on mobile, in French and in English. The path is: Déclarations, then Bénéficiaires effectifs, then Nouvelle Déclaration. The filer selects the fiscal year, completes entity and manager details, adds each beneficiary while separating direct and indirect holdings, uploads supporting documents, then submits the declaration. It then moves from the DRAFT state to the SUBMITTED state. The DGI has published an implementing circular and a user guide for the platform.</p>
<p>Three deadlines structure the obligation. The initial declaration is due within thirty days of registration. The annual declaration is due by 15 March, together with the statistical and tax return (DSF). The DSF itself has staggered deadlines by tax office, but Article L8 quinquies fixes 15 March. The decree adds that any change must be declared within forty-five (45) days of the event requiring it. Beneficial owners must themselves supply their identification documents to the entity, within fifteen days on request and thirty days on a change. Records and supporting documents are kept at least five years after the person ceases to be a beneficial owner or the entity ceases to exist.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>What are the penalties for non-compliance?</span></h2>
<p>The regime carries precise fines. Article L104 punishes false information, or failure to communicate the required information, with a flat fine of up to five million FCFA. A further penalty of one hundred thousand FCFA per day of delay applies to attempts to defer the administration’s right of communication. Article L99 punishes late filing of the declarations required by Article L8 quinquies with a fine of one million FCFA per month, after formal notice. The same fine punishes the absence of the required registers or the failure to keep them updated. These amounts make non-declaration a direct financial risk for the entity.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>What does FATF Recommendation 24 require?</span></h2>
<p><a href="https://www.fatf-gafi.org/en/publications/Fatfrecommendations/R24-statement-march-2022.html">Recommendation 24</a>, as amended on 4 March 2022, requires countries to prevent the misuse of legal persons for money laundering. It demands adequate, accurate and up-to-date information on their beneficial owners, with accuracy based on verification. The approach is multi-pronged: companies hold their own information, and the state has it held by a public authority functioning as a registry, or by an alternative mechanism that likewise provides competent authorities with efficient access. The recommendation also prohibits the issuance of new bearer shares and tightens controls on nominee arrangements.</p>
<p>Cameroon starts from a weak position here. The GABAC <a href="https://www.fatf-gafi.org/content/dam/fatf-gafi/fsrb-mer/GABAC-Mutual-Evaluation-Report-Cameroon-2022.pdf">mutual evaluation report</a>, published in 2022, rates the country Non-Compliant with Recommendation 24 and Largely Compliant with Recommendation 25. The report finds that the availability of beneficial-ownership information is a major challenge. Since June 2023, Cameroon has been implementing an action plan agreed with the FATF and GABAC, which includes enhancing beneficial-ownership transparency. As of the 19 June 2026 update, the country remains on the list of jurisdictions under increased monitoring. The central register sits squarely within that workstream.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>What is BODS and why does it matter?</span></h2>
<p>The Beneficial Ownership Data Standard (BODS) is an open standard for producing adequate, accurate and up-to-date data on who owns, controls or benefits from corporate vehicles. It is developed by Open Ownership in partnership with Open Data Services. <a href="https://www.openownership.org/en/blog/an-open-solution-for-interoperability-the-launch-of-version-04-of-the-beneficial-ownership-data-standard/">Version 0.4</a> launched on 24 June 2024. It captures how ownership relationships change over time, how declarations are represented, and how core data is separated from metadata, with guidance for trusts and nominees. <a href="https://standard.openownership.org/en/0.4.0/standard/system/conformance.html">Conformance</a> has a precise technical meaning: any JSON serialisation must validate against the standard’s JSON schema, and the schema’s terms must be used consistently with their definitions. For a registry, this means emitting immutable statements about persons, entities and relationships, each with its source and date, under stable record identifiers. A register built to this standard produces data that is comparable, portable and interoperable.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Where does RÉCOR fit?</span></h2>
<p>SIGIL is building RÉCOR, a sovereign beneficial-ownership registry designed for Cameroon. RÉCOR is built to the Beneficial Ownership Data Standard (BODS v0.4) and was fully demonstrated to Open Ownership on 1 July 2026, confirming its conformance. This is a technical demonstration and conformance confirmation, not an endorsement.</p>`
    },
    fr: {
      title: "Le registre central du bénéficiaire effectif au Cameroun : ce que les entreprises doivent savoir",
      abstract: "Le registre central du bénéficiaire effectif au Cameroun : qui doit déclarer, comment, à quelles échéances, sous quelles sanctions et ce que le GAFI exige.",
      body: `
<p>Le Registre Central du Bénéficiaire Effectif (RCBE) est le système mis en place par l’administration fiscale camerounaise pour collecter et conserver les informations sur les personnes physiques qui, en dernier ressort, possèdent ou contrôlent les entités légales. Il concerne les personnes morales et les administrateurs de constructions juridiques, de droit camerounais ou étranger, établis au Cameroun. L’obligation de déclarer est en vigueur, la procédure est en ligne et les manquements sont sanctionnés par des amendes chiffrées.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Qu’est-ce que le registre central du bénéficiaire effectif ?</span></h2>
<p>Le <a href="https://www.impots.cm/sites/default/files/documents/GUIDE%20CONTRIBUABLE%20-%20REGISTRE%20CENTRAL%20DU%20BENEFICIAIRE%20EFFECTIF.pdf">guide du contribuable</a> de la Direction Générale des Impôts (DGI) le définit comme un système de collecte et de stockage des informations sur les bénéficiaires effectifs des entités légales. Son objet est d’accroître la transparence et de prévenir le blanchiment de capitaux et le financement du terrorisme. Le registre central est tenu par l’administration fiscale et ses informations sont couvertes par le secret professionnel. L’accès est réservé aux autorités et organismes énumérés par le décret, selon des modalités qu’un texte du Ministre des Finances doit préciser. L’administration peut par ailleurs consulter le registre interne des entités lors de ses contrôles. <a href="https://www.openownership.org/en/map/country/cameroon/">Open Ownership</a> recense désormais le Cameroun parmi les pays disposant d’un registre des bénéficiaires effectifs en service.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Qui doit déclarer ?</span></h2>
<p>L’obligation repose sur l’article L8 quinquies du Livre des Procédures Fiscales du <a href="https://www.impots.cm/sites/default/files/documents/CGI%202024%20version%20francaise.pdf">Code Général des Impôts</a>. Il vise les personnes morales ainsi que les administrateurs de constructions juridiques de droit camerounais ou étranger établis au Cameroun. Le champ est large : l’assujettissement à l’Impôt sur les Sociétés ou à l’Impôt sur les Revenus des Personnes Physiques est sans incidence. Chaque entité doit identifier ses bénéficiaires effectifs, tenir un registre interne actualisé, puis déclarer ces informations à l’administration fiscale. L’obligation a été introduite par la <a href="https://www.prc.cm/fr/actualites/actes/lois/6217-loi-n-2022-020-du-27-decembre-2022-portant-loi-de-finances-de-la-republique-du-cameroun-pour-l-exercice-2023">loi n° 2022/020 du 27 décembre 2022</a> portant loi de finances pour l’exercice 2023. Le décret n° 2023/06801/CAB/PM du 27 septembre 2023 en fixe les modalités d’application. Les entités disposaient de trois mois après l’entrée en vigueur de ce décret pour se conformer.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Qu’est-ce qu’un bénéficiaire effectif ?</span></h2>
<p>La DGI le définit comme la personne physique qui, en dernier ressort, possède ou contrôle les actifs ou les revenus de l’entité légale, ou en bénéficie. Un bénéficiaire effectif est donc toujours une personne physique. Le décret d’application retient toute personne détenant, directement ou indirectement, vingt pour cent (20 %) ou plus des parts du capital ou des droits de vote. S’y ajoutent les personnes exerçant un contrôle par tout autre moyen, de fait ou de droit, et, à défaut, le dirigeant principal. Le décret précise que la possession ou le contrôle en dernier ressort peuvent aussi s’exercer à travers une chaîne de propriété. Cette approche s’inscrit dans le cadre communautaire : le règlement n° 01/CEMAC/UMAC/CM du 11 avril 2016 est l’instrument régional de lutte contre le blanchiment de capitaux applicable au Cameroun.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Comment et où déclarer ?</span></h2>
<p>La déclaration s’effectue en ligne sur la plateforme <a href="https://bef.harmony2.cm">bef.harmony2.cm</a>, également accessible depuis le site de la DGI, www.impots.cm. L’identifiant est le NIU de l’entité ; le mot de passe est celui de la télédéclaration Fiscalis. La plateforme fonctionne sur ordinateur et sur mobile, en français et en anglais. Le parcours est : Déclarations, puis Bénéficiaires effectifs, puis Nouvelle Déclaration. Le déclarant choisit l’exercice, renseigne l’entité et ses dirigeants, ajoute chaque bénéficiaire en distinguant détentions directes et indirectes, joint les pièces justificatives, puis soumet sa déclaration. Celle-ci passe alors de l’état DRAFT à l’état SUBMITTED. La DGI a publié une circulaire d’application ainsi qu’un guide utilisateur de la plateforme.</p>
<p>Trois échéances structurent l’obligation. La déclaration initiale intervient dans les trente jours suivant l’immatriculation. La déclaration annuelle est due au plus tard le 15 mars, en même temps que la Déclaration Statistique et Fiscale (DSF). La DSF connaît des échéances échelonnées selon le centre de rattachement, mais l’article L8 quinquies retient la date du 15 mars. Le décret ajoute que toute modification doit être déclarée dans les quarante-cinq (45) jours suivant l’événement qui la rend nécessaire. Les bénéficiaires effectifs doivent eux-mêmes fournir leurs documents d’identification à l’entité, sous quinze jours sur demande et sous trente jours en cas de changement. Les informations et pièces justificatives sont conservées au moins cinq ans après que la personne a cessé d’être bénéficiaire effectif ou que l’entité a cessé d’exister.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Quelles sanctions en cas de manquement ?</span></h2>
<p>Le dispositif est assorti d’amendes précises. L’article L104 punit la communication de fausses informations, ou le défaut de communication des informations exigées, d’une amende forfaitaire pouvant atteindre cinq millions de FCFA. Une astreinte de cent mille FCFA par jour de retard s’applique aux tentatives de différer le droit de communication de l’administration. L’article L99 punit le dépôt tardif des déclarations prévues à l’article L8 quinquies d’une amende d’un million de FCFA par mois, après mise en demeure. La même amende frappe l’absence des registres exigés ou le défaut de leur mise à jour. Ces montants font du défaut de déclaration un risque financier direct pour l’entité.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Qu’exige la recommandation 24 du GAFI ?</span></h2>
<p>La <a href="https://www.fatf-gafi.org/en/publications/Fatfrecommendations/R24-statement-march-2022.html">recommandation 24</a>, amendée le 4 mars 2022, impose aux pays de prévenir l’utilisation abusive des personnes morales à des fins de blanchiment de capitaux. Elle exige des informations adéquates, exactes et à jour sur leurs bénéficiaires effectifs, l’exactitude reposant sur la vérification. L’approche est à plusieurs volets : les sociétés détiennent leurs propres informations, et l’État en confie la tenue à une autorité publique faisant office de registre, ou à un mécanisme alternatif offrant lui aussi aux autorités compétentes un accès efficace. La recommandation interdit également l’émission de nouvelles actions au porteur et renforce l’encadrement du recours aux prête-noms.</p>
<p>Le Cameroun part de loin sur ce terrain. Le <a href="https://www.fatf-gafi.org/content/dam/fatf-gafi/fsrb-mer/GABAC-Mutual-Evaluation-Report-Cameroon-2022.pdf">rapport d’évaluation mutuelle</a> du GABAC, publié en 2022, note le pays « non conforme » à la recommandation 24 et « largement conforme » à la recommandation 25. Le rapport relève que la disponibilité de l’information sur les bénéficiaires effectifs constitue un défi majeur. Depuis juin 2023, le Cameroun met en œuvre un plan d’action convenu avec le GAFI et le GABAC, qui inclut le renforcement de la transparence des bénéficiaires effectifs. À la mise à jour du 19 juin 2026, le pays figure toujours sur la liste des juridictions soumises à une surveillance renforcée. Le registre central s’inscrit directement dans ce chantier.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Qu’est-ce que le BODS et pourquoi est-ce important ?</span></h2>
<p>Le Beneficial Ownership Data Standard (BODS) est un standard ouvert pour produire des données adéquates, exactes et à jour sur les personnes qui possèdent ou contrôlent les véhicules juridiques, ou qui en bénéficient. Il est développé par Open Ownership en partenariat avec Open Data Services. La <a href="https://www.openownership.org/en/blog/an-open-solution-for-interoperability-the-launch-of-version-04-of-the-beneficial-ownership-data-standard/">version 0.4</a> a été lancée le 24 juin 2024. Elle capture l’évolution des relations de propriété dans le temps, la représentation des déclarations et la séparation entre les données et leurs métadonnées, avec des orientations pour les trusts et les prête-noms. La <a href="https://standard.openownership.org/en/0.4.0/standard/system/conformance.html">conformité</a> a un sens technique précis : toute sérialisation JSON doit satisfaire au schéma du standard, et les termes du schéma doivent être employés conformément à leurs définitions. Pour un registre, cela signifie émettre des déclarations immuables sur les personnes, les entités et les relations, chacune avec sa source et sa date, sous des identifiants de référence stables. Un registre bâti sur ce standard produit des données comparables, portables et interopérables.</p>
<h2 class="h-seal">${seal({ size: 20 })}<span>Où se situe RÉCOR ?</span></h2>
<p>SIGIL développe RÉCOR, un registre souverain des bénéficiaires effectifs conçu pour le Cameroun. RÉCOR est bâti selon le standard de données sur les bénéficiaires effectifs (BODS v0.4) et a fait l’objet d’une démonstration complète auprès d’Open Ownership le 1 juillet 2026, confirmant sa conformité. Il s’agit d’une démonstration technique et d’une confirmation de conformité, non d’un soutien institutionnel.</p>`
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
    ? "Notes d’ingénierie et de doctrine de SIGIL : le registre des bénéficiaires effectifs au Cameroun, capacité et autorisation, piste contre fait."
    : "Engineering and doctrine notes from SIGIL: Cameroon’s beneficial-ownership register, capability versus authorization, and lead versus fact.";
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
