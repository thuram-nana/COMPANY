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
    title: "RÉCOR — Sovereign beneficial-ownership registry",
    description: "RÉCOR is SIGIL SARL's sovereign beneficial-ownership registry designed for Cameroon, built to FATF Recommendations 24 and 25, exporting to BODS v0.4.",
    problemH: "The problem",
    problemP: "Opaque company ownership lets illicit finance move unseen and holds a jurisdiction back from meeting international standards. A beneficial-ownership registry makes real ownership legible — but only if the data is trustworthy, the audit trail is tamper-evident, and citizens' rights over their own data are respected.",
    doesH: "What RÉCOR does",
    doesP: "A declaration of ownership passes a nine-stage verification pipeline before it is published and exported. Each stage either confirms, flags, or refers the declaration; nothing is published on trust alone. RÉCOR is designed to be governed by a consortium of Cameroonian institutions with international observers, and its declarant portal is trilingual: French, English, and Cameroonian Pidgin.",
    pipe: {
      start: "A beneficial-ownership declaration",
      steps: [
        "Schema parity and signed attestation",
        "Identity gates",
        "Sanctions screening (UN / EU / OFAC, plus ICIJ offshore-leaks data)",
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
    standardsP: 'RÉCOR is built to satisfy <a href="https://www.fatf-gafi.org/en/topics/fatf-recommendations.html" rel="noopener">FATF Recommendations 24 and 25</a> and to export to the <a href="https://standard.openownership.org/" rel="noopener">Beneficial Ownership Data Standard (BODS) v0.4</a>. It was fully demonstrated to <a href="https://www.openownership.org/" rel="noopener">Open Ownership</a> on 1 July 2026, and Open Ownership acknowledged the demonstration.',
    proofCallout: ["Verifiable", 'RÉCOR is built to the <a href="https://standard.openownership.org/" rel="noopener">Beneficial Ownership Data Standard (BODS v0.4)</a> and was fully demonstrated to, and acknowledged by, Open Ownership on 1 July 2026. This is a technical demonstration, not an endorsement.'],
    guarH: "Sovereignty guarantees",
    guarHead: ["Guarantee", "How RÉCOR delivers it"],
    guarRows: [
      ["Data residency", "Designed to run on national infrastructure; the register and its evidence stay in-country."],
      ["Key custody", "Each declaration is signed in the declarant’s own browser with a key only the declarant holds; platform and custody keys remain with the operating institution."],
      ["Citizen data rights", "Deletion rights are designed to be honoured by cryptographic shredding — destroying the key that makes a record readable."],
      ["Audit chain", "A triple-witnessed, Merkle-anchored audit chain makes every change tamper-evident."],
      ["Open standard", "Exports to BODS v0.4, so the data is portable and not locked to one vendor."],
      ["Source code", "Kept strictly private; not published or distributed."]
    ],
    faqH: "Questions institutions ask",
    faqs: [
      { q: "Does RÉCOR meet FATF Recommendations 24 and 25?", a: "RÉCOR is designed to satisfy FATF Recommendations 24 and 25 and to export to the Beneficial Ownership Data Standard. It was fully demonstrated to Open Ownership on 1 July 2026, and Open Ownership acknowledged the demonstration." },
      { q: "How are citizens' data-deletion rights handled?", a: "Deletion rights are designed to be honoured through cryptographic shredding: when a record must be erased, the key that makes it readable is destroyed, rendering the data unrecoverable while the audit chain's integrity is preserved." },
      { q: "Is the ownership data portable?", a: "Yes. RÉCOR exports to the Beneficial Ownership Data Standard (BODS) v0.4, an open standard, so the data is not locked to a single vendor." },
      { q: "Is RÉCOR's source code available?", a: "No. All RÉCOR source code is kept strictly private. It is not published, mirrored, or distributed." }
    ]
  },
  fr: {
    title: "RÉCOR — Registre des bénéficiaires effectifs",
    description: "RÉCOR, registre souverain des bénéficiaires effectifs de SIGIL SARL pour le Cameroun, bâti selon les recommandations 24 et 25 du GAFI, exporte vers BODS v0.4.",
    problemH: "Le problème",
    problemP: "L’opacité de la propriété des entreprises laisse la finance illicite circuler sans être vue et empêche une juridiction de satisfaire les standards internationaux. Un registre des bénéficiaires effectifs rend la propriété réelle lisible — mais seulement si les données sont fiables, si la piste d’audit est infalsifiable, et si les droits des citoyens sur leurs propres données sont respectés.",
    doesH: "Ce que fait RÉCOR",
    doesP: "Une déclaration de propriété traverse une chaîne de vérification en neuf étapes avant d’être publiée et exportée. Chaque étape confirme, signale ou renvoie la déclaration ; rien n’est publié sur la seule confiance. RÉCOR est conçu pour être gouverné par un consortium d’institutions camerounaises avec des observateurs internationaux, et son portail déclarant est trilingue : français, anglais et pidgin camerounais.",
    pipe: {
      start: "Une déclaration de bénéficiaire effectif",
      steps: [
        "Parité de schéma et attestation signée",
        "Contrôles d’identité",
        "Criblage des sanctions (ONU / UE / OFAC, plus données ICIJ sur les sociétés offshore)",
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
    standardsP: 'RÉCOR est bâti pour satisfaire les <a href="https://www.fatf-gafi.org/en/topics/fatf-recommendations.html" rel="noopener">recommandations 24 et 25 du GAFI</a> et pour exporter vers le <a href="https://standard.openownership.org/" rel="noopener">standard de données sur les bénéficiaires effectifs (BODS) v0.4</a>. Il a fait l’objet d’une démonstration complète auprès d’<a href="https://www.openownership.org/" rel="noopener">Open Ownership</a> le 1 juillet 2026, et Open Ownership en a pris acte.',
    proofCallout: ["Vérifiable", 'RÉCOR est bâti selon le <a href="https://standard.openownership.org/" rel="noopener">standard de données sur les bénéficiaires effectifs (BODS v0.4)</a> et a fait l’objet d’une démonstration complète auprès d’Open Ownership le 1 juillet 2026, qui en a pris acte. Il s’agit d’une démonstration technique, non d’un soutien institutionnel.'],
    guarH: "Garanties de souveraineté",
    guarHead: ["Garantie", "Comment RÉCOR l’assure"],
    guarRows: [
      ["Résidence des données", "Conçu pour s’exécuter sur l’infrastructure nationale ; le registre et ses preuves restent dans le pays."],
      ["Garde des clés", "Chaque déclaration est signée dans le navigateur du déclarant, avec une clé que seul le déclarant détient ; les clés de plateforme et de garde restent auprès de l’institution exploitante."],
      ["Droits des citoyens", "Le droit à l’effacement est conçu pour être honoré par broyage cryptographique — destruction de la clé qui rend un enregistrement lisible."],
      ["Chaîne d’audit", "Une chaîne d’audit triple-témoin, ancrée par arbre de Merkle, rend chaque modification infalsifiable."],
      ["Standard ouvert", "Exporte vers BODS v0.4 ; les données sont portables et non verrouillées à un fournisseur."],
      ["Code source", "Gardé strictement privé ; ni publié ni distribué."]
    ],
    faqH: "Questions posées par les institutions",
    faqs: [
      { q: "RÉCOR satisfait-il les recommandations 24 et 25 du GAFI ?", a: "RÉCOR est conçu pour satisfaire les recommandations 24 et 25 du GAFI et exporter vers le standard de données sur les bénéficiaires effectifs. Il a fait l’objet d’une démonstration complète auprès d’Open Ownership le 1 juillet 2026, et Open Ownership en a pris acte." },
      { q: "Comment le droit des citoyens à l’effacement est-il assuré ?", a: "Le droit à l’effacement est conçu pour être honoré par broyage cryptographique : lorsqu’un enregistrement doit être effacé, la clé qui le rend lisible est détruite, rendant les données irrécupérables tout en préservant l’intégrité de la chaîne d’audit." },
      { q: "Les données de propriété sont-elles portables ?", a: "Oui. RÉCOR exporte vers le standard de données sur les bénéficiaires effectifs (BODS) v0.4, un standard ouvert ; les données ne sont pas verrouillées à un fournisseur unique." },
      { q: "Le code source de RÉCOR est-il disponible ?", a: "Non. L’intégralité du code source de RÉCOR est gardée strictement privée. Il n’est ni publié, ni miroité, ni distribué." }
    ]
  }
};

const deep = {"en": {"stages": [{"name": "Schema parity and signed attestation", "para": "Every declaration arrives as a fixed, canonical byte sequence signed in the declarant’s own browser. This stage checks that the structure is complete, that ownership shares sum to exactly 100 per cent, that no owner appears twice, and that the Ed25519 signature verifies against those exact bytes. A failed signature or malformed declaration is refused outright — the pipeline fails closed rather than proceeding on doubt."}, {"name": "Identity gates", "para": "Each named beneficial owner is checked against official civil-identity sources, so a declaration cannot rest on an invented person. When every owner resolves, the declaration gains a measured degree of confidence — never proof. When none resolve, a strong falsity signal is raised; when the identity source is unreachable, the stage records insufficient evidence rather than silently passing."}, {"name": "Sanctions screening (UN / EU / OFAC, plus ICIJ offshore-leaks data)", "para": "Declared names are screened against the UN, EU and OFAC sanctions lists and the <a href=\"https://offshoreleaks.icij.org/\" rel=\"noopener\">ICIJ Offshore Leaks</a> data, using tiered fuzzy matching that quantifies how close each candidate match is. A near-certain match flags the declaration for the strictest scrutiny; a weak match records uncertainty for a human analyst; and the stage is designed to refuse to conclude from stale list data."}, {"name": "Politically-exposed-person screening", "para": "The same screening machinery asks a different question: is any declared owner a politically exposed person, or a close associate of one? A match is treated as a risk signal, not an accusation — it raises the weight of scrutiny rather than blocking the declaration, and confirmed exposure routes the file toward human review."}, {"name": "Adverse-media review", "para": "Retrieved public reporting about each owner is assessed by a deliberately conservative automated reviewer that must return a verdict, a confidence level, and citations for its claims. Adverse findings with high confidence flag the declaration; anything ambiguous is recorded as insufficient evidence. The stage is designed never to convert an absence of information into a clean result."}, {"name": "Graph and machine-learning pattern detection", "para": "Ownership structures are analysed as a graph for known concealment patterns — circular ownership, nominee arrangements, and clusters of entities sharing one address. Each detected pattern carries a severity weight: the more suspicious the structure, the heavier its contribution to the fused risk picture. Where no pattern score exists, the stage records that fact rather than inventing a signal."}, {"name": "Dempster-Shafer cross-source fusion", "para": "Evidence from every prior stage — and from independent government and institutional sources — is combined using Dempster-Shafer belief theory, which can say “we do not know” instead of forcing a probability. Sources that agree reinforce belief; sources that contradict each other — one official source showing an entity active while another shows it dissolved — raise a flag on their own."}, {"name": "Stakeholder review", "para": "Declarations the machine cannot clear or condemn go to human reviewers from the operating institutions. A pending review never resolves itself: the file waits. A reviewer’s decision requires a written justification, is recorded in an append-only log, and carries decisive weight in the final outcome — so that a person, not a model, settles the hard cases."}, {"name": "Public consultation", "para": "The final gate is public scrutiny. RÉCOR is designed to accept discrepancy reports on any entry — anonymously, if the reporter prefers — and to log each report in an append-only record for institutional triage. A substantiated challenge is designed to send a declaration back to stakeholder review, so the public functions as a standing check on the register."}], "dataModel": {"h": "Data model and what is published", "paras": ["A declaration names the legal entity or arrangement it concerns and lists every natural person who ultimately owns or controls it. For each person it records the exact share held — stored as integer basis points, so 99.99% and 100.00% remain arithmetically distinct — the kind of interest (equity, voting rights, family or proxy arrangements, contractual control, or other), any nominee status and the person behind the nominee, and the legal basis of control where ownership alone does not explain it. The declarant signs the whole record in their own browser, together with a formal claim that it is adequate, accurate, and up to date — the wording of <a href=\"https://www.fatf-gafi.org/\" rel=\"noopener\">FATF Recommendation 24</a>, carried into the data itself.", "What the public sees is deliberately smaller than what the institution holds. The public record is designed to show five fields per beneficial owner — name, nationality, role, ownership percentage, and control percentage — and nothing else: no residential address, no date of birth, no national identity number. The full declaration, its evidence, and its verification history remain with the operating institution, accessible only to authorized reviewers under access controls that are themselves logged.", "For interoperability, RÉCOR exports to the <a href=\"https://standard.openownership.org/\" rel=\"noopener\">Beneficial Ownership Data Standard (BODS) v0.4</a>, an open, statement-based format: separate statements describe each person, each entity, and each ownership-or-control relationship, with typed interests such as shareholding and voting rights. Because the format is an open standard, the data can be read by any BODS-compatible tool and is not locked to RÉCOR itself. The export mapping is self-declared by SIGIL; it has not been certified by any third party.", "Personal-data minimisation runs through the design: publication is limited to the five public fields, log lines are redacted before they are written, and anonymous public feedback requires no contact details. When a record must be erased, deletion rights are designed to be honoured by cryptographic shredding — destroying the key that makes the record readable — so erasure is real without breaking the integrity of the audit chain."]}, "threat": {"h": "Threat model", "intro": "A beneficial-ownership registry is a target: for those who would feed it lies, and for those who would quietly rewrite what it remembers. RÉCOR is engineered against specific classes of attack, and each class is answered by a named mechanism rather than by policy alone.", "table": {"head": ["Attack class", "Answering mechanism"], "rows": [["Falsified declarations", "Nine verification stages stand between submission and publication; the declaration’s Ed25519 attestation is verified against the exact signed bytes, and a failed signature is refused outright."], ["Insider tampering", "The declaration log is append-only at the database level — updates and deletes are refused regardless of role — and a triple-witnessed, Merkle-anchored audit chain makes every change tamper-evident."], ["Silent record edits", "Every change is an event in the audit chain, and a record’s cryptographic proof is designed to be re-verifiable by anyone — so an edit that bypasses the chain becomes detectable rather than invisible."], ["Coerced deletion", "Erasure is designed to be honoured by cryptographic shredding — the key is destroyed, the audit chain’s integrity survives — so a deletion can never silently rewrite history."], ["Vendor lock-in", "The register exports to BODS v0.4, an open standard; the operating institution can take its data elsewhere at any time."], ["Data exfiltration", "The declarant’s signing key never leaves the browser; platform and custody keys remain with the operating institution; services run under default-deny network rules, and logs are redacted before they are written."]]}}, "interfaces": {"h": "Interfaces and languages", "paras": ["The declarant portal is trilingual — French, English, and Cameroonian Pidgin — because a declaration obligation that cannot be read is not an obligation, it is a trap. French is the legal-primary language and the fallback for every interface string: a missing translation renders in French rather than as an error. The portal generates the declarant’s signing key in the browser, walks the declarant through the declaration, and returns a cryptographic receipt.", "Around the declarant portal sit the institutional surfaces: a public search interface limited to the minimal published record, review consoles for the stakeholder-review stage of the pipeline and for institutional supervision, an operations dashboard whose consequential actions are designed to require two people rather than one, a self-service surface through which declarants and data subjects exercise their access, rectification, and restriction rights, and a controlled export interface for BODS v0.4 data. An anonymous reporting channel accepts public tips without requiring identity, and is designed to retain no personally identifying network data."]}, "spec": {"h": "At a glance", "rows": [["System name", "RÉCOR"], ["Category", "Sovereign beneficial-ownership registry"], ["Status", "Pre-deployment"], ["Operating model", "Designed for institutional operation under consortium governance"], ["Designed for", "Cameroon"], ["Standards", "FATF R.24, FATF R.25, BODS v0.4"], ["Export format", "BODS v0.4 JSON"], ["Portal languages", "French / English / Cameroonian Pidgin"], ["Source code", "Kept strictly private; not published or distributed"]]}, "faqs": [{"q": "How is a declaration verified before it is published?", "a": "Never on trust alone. The declarant signs the declaration in their own browser; nine verification stages then check its structure and signature, the identity of every named owner, sanctions and politically-exposed-person exposure, adverse media, and concealment patterns in the ownership graph, before Dempster-Shafer fusion weighs all of the evidence together. Hard cases go to human reviewers, and the public can challenge any entry. Only then is a declaration published and exported."}, {"q": "What does the BODS v0.4 export enable?", "a": "The Beneficial Ownership Data Standard is the open format in which ownership data becomes comparable across borders and usable by tools the register’s operator did not build — analysis platforms, journalism tooling, and other jurisdictions’ systems. RÉCOR exports to <a href=\"https://standard.openownership.org/\" rel=\"noopener\">BODS v0.4</a>, and was fully demonstrated to, and acknowledged by, Open Ownership on 1 July 2026. This is a technical demonstration, not an endorsement. The demonstration is listed in <a href=\"/record/\">the record</a>."}, {"q": "How is the consortium governance designed?", "a": "RÉCOR is designed to be governed by a consortium of Cameroonian institutions with international observers, not by any single administrator. Consequential operations are designed to require a cryptographic quorum of consortium members, sensitive administrative actions require two people rather than one, and every decision leaves a signed, auditable trace. This follows SIGIL’s standing rule: the institution holds the keys; the data stays under the institution’s control; every consequential action is authorized, bounded, and proven."}], "stagesH": "The nine stages, in detail"}, "fr": {"stages": [{"name": "Parité de schéma et attestation signée", "para": "Chaque déclaration arrive sous forme d’une suite d’octets canonique et fixe, signée dans le navigateur du déclarant. Cette étape vérifie que la structure est complète, que les parts déclarées totalisent exactement 100 %, qu’aucun bénéficiaire n’apparaît deux fois, et que la signature Ed25519 correspond à ces octets précis. Une signature invalide ou une déclaration malformée est refusée d’emblée — la chaîne échoue en position fermée plutôt que d’avancer dans le doute."}, {"name": "Contrôles d’identité", "para": "Chaque bénéficiaire effectif déclaré est confronté à des sources officielles d’identité civile, afin qu’une déclaration ne puisse reposer sur une personne inventée. Quand tous les bénéficiaires sont résolus, la déclaration gagne un degré de confiance mesuré — jamais une preuve. Quand aucun ne l’est, un fort signal de fausseté est levé ; quand la source est injoignable, l’étape consigne l’insuffisance de preuve au lieu de passer en silence."}, {"name": "Criblage des sanctions (ONU / UE / OFAC, plus données ICIJ sur les sociétés offshore)", "para": "Les noms déclarés sont criblés contre les listes de sanctions de l’ONU, de l’UE et de l’OFAC et les données <a href=\"https://offshoreleaks.icij.org/\" rel=\"noopener\">ICIJ Offshore Leaks</a>, par un rapprochement flou à paliers qui quantifie la proximité de chaque correspondance. Une correspondance quasi certaine appelle l’examen le plus strict ; une correspondance faible consigne l’incertitude pour un analyste ; et l’étape est conçue pour refuser de conclure sur des listes périmées."}, {"name": "Criblage des personnes politiquement exposées", "para": "La même mécanique de criblage pose une question différente : un bénéficiaire déclaré est-il une personne politiquement exposée, ou un proche d’une telle personne ? Une correspondance est traitée comme un signal de risque, non comme une accusation — elle alourdit l’examen au lieu de bloquer la déclaration, et une exposition confirmée oriente le dossier vers la revue humaine."}, {"name": "Revue de la presse défavorable", "para": "Les informations publiquement accessibles recueillies au sujet de chaque bénéficiaire sont évaluées par un examinateur automatique délibérément conservateur, tenu de rendre un verdict, un niveau de confiance et des citations à l’appui. Un constat défavorable à haute confiance signale la déclaration ; toute ambiguïté est consignée comme preuve insuffisante. L’étape est conçue pour ne jamais convertir l’absence d’information en résultat favorable."}, {"name": "Détection de motifs par graphe et apprentissage automatique", "para": "Les structures de propriété sont analysées comme un graphe à la recherche de schémas de dissimulation connus — propriété circulaire, montages de prête-noms, grappes d’entités partageant une même adresse. Chaque schéma détecté porte un poids de sévérité : plus la structure est suspecte, plus sa contribution au tableau de risque fusionné est lourde. En l’absence de score, l’étape le consigne plutôt que d’inventer un signal."}, {"name": "Fusion multi-sources Dempster-Shafer", "para": "Les preuves de chaque étape précédente — et de sources gouvernementales et institutionnelles indépendantes — sont combinées par la théorie des croyances de Dempster-Shafer, capable de dire « nous ne savons pas » au lieu de forcer une probabilité. Les sources qui concordent renforcent la croyance ; celles qui se contredisent — une source officielle donnant une entité active, une autre la donnant dissoute — lèvent un signalement à elles seules."}, {"name": "Revue des parties prenantes", "para": "Les déclarations que la machine ne peut ni innocenter ni condamner passent à des examinateurs humains des institutions exploitantes. Une revue en attente ne se résout jamais d’elle-même : le dossier attend. La décision de l’examinateur exige une justification écrite, est consignée dans un journal en ajout seul, et pèse de manière décisive sur l’issue — une personne, non un modèle, tranche les cas difficiles."}, {"name": "Consultation publique", "para": "Le dernier verrou est le regard du public. RÉCOR est conçu pour recevoir des signalements de divergence sur toute inscription — anonymement, si l’auteur le préfère — et pour consigner chaque signalement dans un journal en ajout seul destiné au triage institutionnel. Une contestation étayée est conçue pour renvoyer la déclaration en revue des parties prenantes : le public devient un contrôle permanent du registre."}], "dataModel": {"h": "Modèle de données et ce qui est publié", "paras": ["Une déclaration nomme l’entité ou la construction juridique concernée et énumère chaque personne physique qui la possède ou la contrôle en dernier ressort. Pour chaque personne, elle consigne la part exacte détenue — stockée en points de base entiers, de sorte que 99,99 % et 100,00 % restent arithmétiquement distincts —, la nature de l’intérêt (capital, droits de vote, arrangements familiaux ou par procuration, contrôle contractuel, ou autre), l’éventuelle qualité de prête-nom et la personne derrière le prête-nom, ainsi que le fondement juridique du contrôle lorsque la propriété seule ne l’explique pas. Le déclarant signe l’ensemble dans son propre navigateur, avec l’affirmation formelle que la déclaration est adéquate, exacte et à jour — la formule de la <a href=\"https://www.fatf-gafi.org/\" rel=\"noopener\">recommandation 24 du GAFI</a>, portée dans les données elles-mêmes.", "Ce que voit le public est délibérément plus restreint que ce que détient l’institution. La fiche publique est conçue pour montrer cinq champs par bénéficiaire effectif — nom, nationalité, rôle, pourcentage de propriété et pourcentage de contrôle — et rien d’autre : ni adresse résidentielle, ni date de naissance, ni numéro national d’identité. La déclaration complète, ses preuves et son historique de vérification restent auprès de l’institution exploitante, accessibles aux seuls examinateurs autorisés, sous des contrôles d’accès eux-mêmes journalisés.", "Pour l’interopérabilité, RÉCOR exporte vers le <a href=\"https://standard.openownership.org/\" rel=\"noopener\">standard de données sur les bénéficiaires effectifs (BODS) v0.4</a>, un format ouvert fondé sur des énoncés : des énoncés distincts décrivent chaque personne, chaque entité et chaque relation de propriété ou de contrôle, avec des types d’intérêts tels que la participation au capital ou les droits de vote. Le format étant un standard ouvert, les données sont lisibles par tout outil compatible BODS et ne sont pas verrouillées à RÉCOR lui-même. La correspondance d’export est auto-déclarée par SIGIL ; elle n’est certifiée par aucun tiers.", "La minimisation des données personnelles traverse la conception : la publication se limite aux cinq champs publics, les journaux sont caviardés avant d’être écrits, et le signalement public anonyme n’exige aucune coordonnée. Lorsqu’un enregistrement doit être effacé, le droit à l’effacement est conçu pour être honoré par broyage cryptographique — destruction de la clé qui rend l’enregistrement lisible — de sorte que l’effacement est réel sans briser l’intégrité de la chaîne d’audit."]}, "threat": {"h": "Modèle de menace", "intro": "Un registre des bénéficiaires effectifs est une cible : pour ceux qui voudraient le nourrir de mensonges, et pour ceux qui voudraient réécrire discrètement ce qu’il retient. RÉCOR est conçu contre des classes d’attaque précises, et chaque classe reçoit pour réponse un mécanisme nommé, non une simple politique.", "table": {"head": ["Classe d’attaque", "Mécanisme de réponse"], "rows": [["Déclarations falsifiées", "Neuf étapes de vérification séparent la soumission de la publication ; l’attestation Ed25519 de la déclaration est vérifiée contre les octets signés exacts, et une signature invalide est refusée d’emblée."], ["Altération par un initié", "Le journal des déclarations est en ajout seul au niveau même de la base de données — mises à jour et suppressions sont refusées quel que soit le rôle — et une chaîne d’audit triple-témoin, ancrée par arbre de Merkle, rend chaque modification infalsifiable."], ["Modifications silencieuses des enregistrements", "Chaque changement est un événement de la chaîne d’audit, et la preuve cryptographique d’un enregistrement est conçue pour être re-vérifiable par chacun — une modification qui contourne la chaîne devient détectable au lieu de rester invisible."], ["Suppression sous contrainte", "L’effacement est conçu pour être honoré par broyage cryptographique — la clé est détruite, l’intégrité de la chaîne d’audit survit — si bien qu’une suppression ne peut jamais réécrire l’histoire en silence."], ["Verrouillage fournisseur", "Le registre exporte vers BODS v0.4, un standard ouvert ; l’institution exploitante peut emporter ses données ailleurs à tout moment."], ["Exfiltration de données", "La clé de signature du déclarant ne quitte jamais son navigateur ; les clés de plateforme et de garde restent auprès de l’institution exploitante ; les services s’exécutent sous des règles réseau de refus par défaut, et les journaux sont caviardés avant d’être écrits."]]}}, "interfaces": {"h": "Interfaces et langues", "paras": ["Le portail déclarant est trilingue — français, anglais et pidgin camerounais — car une obligation déclarative qu’on ne peut pas lire n’est pas une obligation, c’est un piège. Le français est la langue juridique de référence et le repli de chaque chaîne d’interface : une traduction manquante s’affiche en français plutôt qu’en erreur. Le portail génère la clé de signature du déclarant dans le navigateur, guide le déclarant à travers sa déclaration, et remet un reçu cryptographique.", "Autour du portail déclarant se trouvent les surfaces institutionnelles : une interface publique de recherche limitée à l’extrait minimal publié, des consoles de revue pour l’étape de revue des parties prenantes et pour la supervision institutionnelle, un tableau de bord d’exploitation dont les actions conséquentes sont conçues pour exiger deux personnes plutôt qu’une, une surface en libre-service par laquelle déclarants et personnes concernées exercent leurs droits d’accès, de rectification et de limitation, et une interface d’export contrôlée pour les données BODS v0.4. Un canal de signalement anonyme accepte les alertes du public sans exiger d’identité, et est conçu pour ne conserver aucune donnée réseau identifiante."]}, "spec": {"h": "En bref", "rows": [["Nom du système", "RÉCOR"], ["Catégorie", "Registre souverain des bénéficiaires effectifs"], ["Statut", "Pré-déploiement"], ["Modèle d’exploitation", "Conçu pour une exploitation institutionnelle sous gouvernance de consortium"], ["Conçu pour", "Le Cameroun"], ["Standards", "GAFI R.24, GAFI R.25, BODS v0.4"], ["Format d’export", "BODS v0.4 JSON"], ["Langues du portail", "français / anglais / pidgin camerounais"], ["Code source", "Gardé strictement privé ; ni publié ni distribué"]]}, "faqs": [{"q": "Comment une déclaration est-elle vérifiée avant publication ?", "a": "Jamais sur la seule confiance. Le déclarant signe sa déclaration dans son propre navigateur ; neuf étapes de vérification contrôlent ensuite la structure et la signature, l’identité de chaque bénéficiaire déclaré, l’exposition aux sanctions et aux personnes politiquement exposées, la presse défavorable et les schémas de dissimulation dans le graphe de propriété, avant que la fusion Dempster-Shafer ne pèse l’ensemble des preuves. Les cas difficiles passent à des examinateurs humains, et le public peut contester toute inscription. Alors seulement la déclaration est publiée et exportée."}, {"q": "Que permet l’export BODS v0.4 ?", "a": "Le standard de données sur les bénéficiaires effectifs est le format ouvert par lequel les données de propriété deviennent comparables d’une juridiction à l’autre et exploitables par des outils que l’exploitant du registre n’a pas construits — plateformes d’analyse, outils de journalisme, systèmes d’autres juridictions. RÉCOR exporte vers <a href=\"https://standard.openownership.org/\" rel=\"noopener\">BODS v0.4</a> et a fait l’objet d’une démonstration complète auprès d’Open Ownership le 1 juillet 2026, et Open Ownership en a pris acte. Il s’agit d’une démonstration technique, non d’un soutien institutionnel. La démonstration figure dans <a href=\"/fr/references/\">les références</a>."}, {"q": "Comment la gouvernance de consortium est-elle conçue ?", "a": "RÉCOR est conçu pour être gouverné par un consortium d’institutions camerounaises avec des observateurs internationaux, et non par un administrateur unique. Les opérations conséquentes sont conçues pour exiger un quorum cryptographique de membres du consortium, les actions administratives sensibles exigent deux personnes plutôt qu’une, et chaque décision laisse une trace signée et auditable. C’est la règle constante de SIGIL : l’institution détient les clés ; les données restent sous le contrôle de l’institution ; chaque action conséquente est autorisée, bornée et prouvée."}], "stagesH": "Les neuf étapes, en détail"}};
const stripA = (t) => String(t).replace(/<a [^>]*>/g, "").replace(/<\/a>/g, "");

export function recor(lang) {
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
  ${h2(d.spec.h, "at-a-glance")}
  <div class="table-wrap" style="margin-top:1.5rem"><table><tbody>
    ${d.spec.rows.map(([k2, v2]) => `<tr><th scope="row">${k2}</th><td>${v2}</td></tr>`).join("")}
  </tbody></table></div>
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
  ${h2(d.stagesH, "stages")}
  <div class="stack" style="margin-top:1.5rem">
    ${d.stages.map((s2) => `<div class="card"><p class="mono" style="font-weight:600">${s2.name}</p><p style="margin-top:.6rem">${s2.para}</p></div>`).join("")}
  </div>
</section>

<section class="section wrap rule-top">
  ${h2(d.dataModel.h, "data-model")}
  ${d.dataModel.paras.map((p2) => `<p style="margin-top:1rem;max-width:62ch">${p2}</p>`).join("")}
</section>

<section class="section wrap rule-top">
  ${h2(d.threat.h, "threat-model")}
  <p style="margin-top:1rem;max-width:62ch">${d.threat.intro}</p>
  <div style="margin-top:1.5rem">${guaranteeTable(d.threat.table.head, d.threat.table.rows)}</div>
</section>

<section class="section wrap rule-top">
  ${h2(d.interfaces.h, "interfaces")}
  ${d.interfaces.paras.map((p2) => `<p style="margin-top:1rem;max-width:62ch">${p2}</p>`).join("")}
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
    ${[...c.faqs, ...d.faqs].map(f => `<details class="card"><summary class="mono" style="cursor:pointer;font-weight:600">${f.q}</summary><p style="margin-top:.8rem">${f.a}</p></details>`).join("")}
  </div>
  <p style="margin-top:2.5rem">${cta(lang)}</p>
</section>`;

  return page({
    lang, current: "systems", title: c.title, description: c.description,
    path: routes.recor[lang], altPath: routes.recor[alt], altLang: alt,
    ogType: "website", jsonld, body
  });
}
