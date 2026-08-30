import { page } from "../lib/layout.js";
import { strings, routes } from "../data/strings.js";
import { h2 } from "../lib/ui.js";
import { seal } from "../assets/mark.js";
import { orgNode, breadcrumb, graph } from "../lib/jsonld.js";
import { phoneDisplay } from "../lib/layout.js";
import facts from "../data/facts.json" with { type: "json" };

const copy = {
  en: {
    title: "Contact",
    description: "Contact SIGIL SARL in Buea, Cameroon: institutional enquiries, security disclosure, and press. Request an institutional briefing on VIGIL or RÉCOR.",
    lede: "For institutional enquiries, evaluations, or a briefing on VIGIL or RÉCOR, reach us directly. Security disclosures have their own channel.",
    channelsH: "Channels",
    channels: [
      ["Institutional", facts.org.email, "General and institutional enquiries."],
      ["Security", facts.org.securityEmail, "Coordinated disclosure. See security.txt for the PGP key."],
      ["Press", facts.org.pressEmail, "Press and media."]
    ],
    detailsH: "Details",
    phone: "Phone",
    location: "Location",
    pgp: "PGP",
    pgpVal: "See security.txt",
    formH: "Request a briefing",
    formP: "Tell us who you are and what you would like to discuss. This form opens your email client with the details filled in; you can also write to us directly.",
    f_name: "Your name",
    f_org: "Organization",
    f_email: "Your email",
    f_msg: "What would you like to discuss?",
    f_send: "Compose email",
    f_note: "This opens your email application with the message prepared. Nothing is sent until you send it.",
    subject: "Briefing request — VIGIL / RÉCOR"
  },
  fr: {
    title: "Contact",
    description: "Contactez SIGIL SARL à Buea, au Cameroun : demandes institutionnelles, divulgation de sécurité et presse. Demandez une présentation institutionnelle de VIGIL ou RÉCOR.",
    lede: "Pour les demandes institutionnelles, les évaluations ou une présentation de VIGIL ou RÉCOR, contactez-nous directement. Les divulgations de sécurité disposent de leur propre canal.",
    channelsH: "Canaux",
    channels: [
      ["Institutionnel", facts.org.email, "Demandes générales et institutionnelles."],
      ["Sécurité", facts.org.securityEmail, "Divulgation coordonnée. Voir security.txt pour la clé PGP."],
      ["Presse", facts.org.pressEmail, "Presse et médias."]
    ],
    detailsH: "Coordonnées",
    phone: "Téléphone",
    location: "Localisation",
    pgp: "PGP",
    pgpVal: "Voir security.txt",
    formH: "Demander une présentation",
    formP: "Dites-nous qui vous êtes et ce que vous souhaitez aborder. Ce formulaire ouvre votre messagerie avec les informations pré-remplies ; vous pouvez aussi nous écrire directement.",
    f_name: "Votre nom",
    f_org: "Organisation",
    f_email: "Votre courriel",
    f_msg: "Que souhaitez-vous aborder ?",
    f_send: "Composer le courriel",
    f_note: "Ceci ouvre votre application de messagerie avec le message préparé. Rien n’est envoyé tant que vous ne l’envoyez pas.",
    subject: "Demande de présentation — VIGIL / RÉCOR"
  }
};

export function contact(lang) {
  const c = copy[lang];
  const alt = lang === "en" ? "fr" : "en";
  const jsonld = graph([
    orgNode(facts),
    breadcrumb(facts, [
      { name: "SIGIL", path: routes.home[lang] },
      { name: c.title, path: routes.contact[lang] }
    ])
  ]);

  const channels = c.channels.map(([label, email, note]) => `
    <div class="card reveal">
      <p class="eyebrow">${label}</p>
      <p style="margin-top:.4rem"><a class="mono" href="mailto:${email}" style="font-size:var(--step-1)">${email}</a></p>
      <p class="muted" style="margin-top:.4rem">${note}</p>
    </div>`).join("");

  // The form is a progressive-enhancement mailto: composer. It works with zero
  // JS-server dependency; the Worker (see /worker) can replace the action for a
  // true POST once deployed. data-endpoint lets app-side code upgrade it later.
  const body = `
<section class="section wrap">
  <p class="eyebrow">${strings[lang].nav.contact}</p>
  <h1>${c.title}</h1>
  <p class="lead" style="margin-top:1rem;max-width:62ch">${c.lede}</p>
</section>

<section class="section wrap rule-top">
  ${h2(c.channelsH)}
  <div class="grid-3" style="margin-top:1.5rem">${channels}</div>
</section>

<section class="section wrap rule-top">
  ${h2(c.detailsH)}
  <div class="table-wrap" style="margin-top:1.5rem">
    <table><tbody>
      <tr><td>${c.phone}</td><td><a class="mono" href="tel:${facts.org.phone.replace(/\s+/g, "")}">${phoneDisplay(facts.org.phone)}</a></td></tr>
      <tr><td>${c.location}</td><td>Buea, ${lang === "fr" ? "Cameroun" : "Cameroon"}</td></tr>
      <tr><td>${c.pgp}</td><td><a href="/.well-known/security.txt">${c.pgpVal}</a></td></tr>
    </tbody></table>
  </div>
</section>

<section class="section wrap rule-top">
  ${h2(c.formH)}
  <p style="margin-top:1rem;max-width:62ch">${c.formP}</p>
  <form class="card" style="margin-top:1.5rem;max-width:44rem" id="briefing-form"
        data-endpoint="/api/briefing"
        action="mailto:${facts.org.email}" method="post" enctype="text/plain">
    <div class="stack">
      <label>${c.f_name}<br><input type="text" name="name" required autocomplete="name" style="width:100%;margin-top:.3rem;padding:.6rem;border:1px solid var(--rule-strong);border-radius:var(--radius-control);background:var(--surface);color:var(--text);font:inherit"></label>
      <label>${c.f_org}<br><input type="text" name="organization" autocomplete="organization" style="width:100%;margin-top:.3rem;padding:.6rem;border:1px solid var(--rule-strong);border-radius:var(--radius-control);background:var(--surface);color:var(--text);font:inherit"></label>
      <label>${c.f_email}<br><input name="email" type="email" required autocomplete="email" style="width:100%;margin-top:.3rem;padding:.6rem;border:1px solid var(--rule-strong);border-radius:var(--radius-control);background:var(--surface);color:var(--text);font:inherit"></label>
      <label>${c.f_msg}<br><textarea name="message" rows="5" required style="width:100%;margin-top:.3rem;padding:.6rem;border:1px solid var(--rule-strong);border-radius:var(--radius-control);background:var(--surface);color:var(--text);font:inherit"></textarea></label>
      <input type="hidden" name="subject" value="${c.subject}">
      <div>
        <button class="btn" type="submit">${c.f_send} <span class="term" aria-hidden="true">→</span></button>
      </div>
      <p class="muted" style="font-size:var(--step--1)">${c.f_note}</p>
    </div>
  </form>
</section>`;

  return page({
    lang, current: "contact", title: c.title, description: c.description,
    path: routes.contact[lang], altPath: routes.contact[alt], altLang: alt,
    ogType: "website", jsonld, body,
    head: `<script src="/briefing.js" defer></script>`
  });
}
