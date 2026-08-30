import { page } from "../lib/layout.js";
import { strings, routes } from "../data/strings.js";
import { seal } from "../assets/mark.js";
import { orgNode, breadcrumb, graph } from "../lib/jsonld.js";
import { phoneDisplay } from "../lib/layout.js";
import facts from "../data/facts.json" with { type: "json" };

function sectionH(t) { return `<h2 class="h-seal">${seal({ size: 20 })}<span>${t}</span></h2>`; }

const privacyCopy = {
  en: {
    title: "Privacy",
    description: "SIGIL's privacy policy: this site sets no cookies, loads no third-party scripts, and performs no client-side tracking. Server-side log analysis only.",
    updated: "Last updated",
    body: `
${sectionH("The short version")}
<p>This website sets no cookies, loads no third-party scripts, and runs no client-side analytics or advertising. We do not build profiles of visitors.</p>
${sectionH("What is processed, and why")}
<p>Our server and content-delivery network keep standard request logs (for example, IP address, timestamp, requested URL, and user agent) for security and to understand aggregate traffic. These logs are analysed only in aggregate and are retained for a limited period. A theme and language preference you set is stored locally in your browser, not on our servers, and is never transmitted to us.</p>
${sectionH("When you contact us")}
<p>If you email us or use the briefing form — which composes an email in your own mail application — we receive the information you choose to send. We use it only to respond to you.</p>
${sectionH("Your rights")}
<p>You may ask what information we hold about your correspondence with us, ask for it to be corrected, or ask for it to be deleted. Write to <a href="mailto:${facts.org.email}">${facts.org.email}</a>.</p>
${sectionH("Changes")}
<p>If this policy changes, the date above changes with it.</p>`
  },
  fr: {
    title: "Confidentialité",
    description: "La politique de confidentialité de SIGIL : ce site ne pose aucun cookie, ne charge aucun script tiers et n’effectue aucun suivi côté client. Analyse de journaux côté serveur uniquement.",
    updated: "Dernière mise à jour",
    body: `
${sectionH("En bref")}
<p>Ce site ne pose aucun cookie, ne charge aucun script tiers et n’exécute aucune analytique ni publicité côté client. Nous ne constituons pas de profils de visiteurs.</p>
${sectionH("Ce qui est traité, et pourquoi")}
<p>Notre serveur et notre réseau de diffusion conservent des journaux de requêtes standard (par exemple adresse IP, horodatage, URL demandée et agent utilisateur) pour la sécurité et pour comprendre le trafic agrégé. Ces journaux ne sont analysés qu’en agrégat et sont conservés pour une durée limitée. Une préférence de thème et de langue que vous définissez est stockée localement dans votre navigateur, non sur nos serveurs, et ne nous est jamais transmise.</p>
${sectionH("Lorsque vous nous contactez")}
<p>Si vous nous écrivez ou utilisez le formulaire de présentation — qui compose un courriel dans votre propre messagerie — nous recevons les informations que vous choisissez d’envoyer. Nous ne les utilisons que pour vous répondre.</p>
${sectionH("Vos droits")}
<p>Vous pouvez demander quelles informations nous détenons sur votre correspondance avec nous, en demander la correction ou la suppression. Écrivez à <a href="mailto:${facts.org.email}">${facts.org.email}</a>.</p>
${sectionH("Modifications")}
<p>Si cette politique change, la date ci-dessus change avec elle.</p>`
  }
};

const mentionsCopy = {
  en: {
    title: "Legal notice",
    description: "Legal notice for sigilsovereign.com, published by SIGIL SARL, Buea, Cameroon.",
    body: `
${sectionH("Publisher")}
<p>This site is published by SIGIL SARL (Sovereign Integrity Governance Infrastructure Labs), a company based in Buea, Cameroon.</p>
<p>Contact: <a href="mailto:${facts.org.email}">${facts.org.email}</a> · ${phoneDisplay(facts.org.phone)}</p>
<p>Managing Director: ${facts.org.founderName}.</p>
${sectionH("Content")}
<p>The content of this site is provided for information. It describes SIGIL's systems as they stand at the date of publication and does not constitute a warranty, an offer, or a contractual commitment. Statements about system status reflect a defined vocabulary set out on the site.</p>
${sectionH("Intellectual property")}
<p>The SIGIL name, the SIGIL mark, the names VIGIL and RÉCOR, and the text and design of this site are the property of SIGIL SARL unless otherwise stated. They may not be reproduced without permission.</p>
${sectionH("Hosting")}
<p>Hosting provider details are available on request from the contact address above.</p>`
  },
  fr: {
    title: "Mentions légales",
    description: "Mentions légales de sigilsovereign.com, publié par SIGIL SARL, Buea, Cameroun.",
    body: `
${sectionH("Éditeur")}
<p>Ce site est publié par SIGIL SARL (Sovereign Integrity Governance Infrastructure Labs), entreprise basée à Buea, au Cameroun.</p>
<p>Contact : <a href="mailto:${facts.org.email}">${facts.org.email}</a> · ${phoneDisplay(facts.org.phone)}</p>
<p>Directeur de la publication : ${facts.org.founderName}.</p>
${sectionH("Contenu")}
<p>Le contenu de ce site est fourni à titre d’information. Il décrit les systèmes de SIGIL tels qu’ils sont à la date de publication et ne constitue ni une garantie, ni une offre, ni un engagement contractuel. Les mentions relatives au statut des systèmes renvoient à un vocabulaire défini présenté sur le site.</p>
${sectionH("Propriété intellectuelle")}
<p>Le nom SIGIL, la marque SIGIL, les noms VIGIL et RÉCOR, ainsi que les textes et le design de ce site sont la propriété de SIGIL SARL sauf mention contraire. Ils ne peuvent être reproduits sans autorisation.</p>
${sectionH("Hébergement")}
<p>Les informations sur l’hébergeur sont disponibles sur demande à l’adresse de contact ci-dessus.</p>`
  }
};

export function privacy(lang) {
  const c = privacyCopy[lang];
  const alt = lang === "en" ? "fr" : "en";
  const jsonld = graph([
    orgNode(facts),
    breadcrumb(facts, [
      { name: "SIGIL", path: routes.home[lang] },
      { name: c.title, path: routes.privacy[lang] }
    ])
  ]);
  const body = `
<section class="section wrap">
  <p class="eyebrow">${strings[lang].footer.privacy}</p>
  <h1>${c.title}</h1>
  <p class="muted mono" style="margin-top:.5rem;font-size:var(--step--1)">${c.updated}: 2026-08-29</p>
  <div class="prose" style="margin-top:2rem">${c.body}</div>
</section>`;
  return page({
    lang, current: "", title: c.title, description: c.description,
    path: routes.privacy[lang], altPath: routes.privacy[alt], altLang: alt,
    ogType: "article", jsonld, body
  });
}

export function mentions(lang) {
  const c = mentionsCopy[lang];
  const alt = lang === "en" ? "fr" : "en";
  const jsonld = graph([
    orgNode(facts),
    breadcrumb(facts, [
      { name: "SIGIL", path: routes.home[lang] },
      { name: c.title, path: routes.mentions[lang] }
    ])
  ]);
  const body = `
<section class="section wrap">
  <p class="eyebrow">${strings[lang].footer.mentions}</p>
  <h1>${c.title}</h1>
  <div class="prose" style="margin-top:2rem">${c.body}</div>
</section>`;
  return page({
    lang, current: "", title: c.title, description: c.description,
    path: routes.mentions[lang], altPath: routes.mentions[alt], altLang: alt,
    ogType: "article", jsonld, body
  });
}
