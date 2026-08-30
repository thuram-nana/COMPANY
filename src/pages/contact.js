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
    formP: "Tell us who you are and what you would like to discuss; you can also write to us directly at the addresses above.",
    f_name: "Your name",
    f_org: "Organization",
    f_email: "Your email",
    f_msg: "What would you like to discuss?",
    f_send: "Compose email",
    f_note: "This opens your email application with the message prepared. Nothing is sent until you send it.",
    f_send_live: "Send request",
    f_note_live: "Your request is sent to us directly and you receive a receipt number. If that fails, the button opens your email application instead.",
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
    formP: "Dites-nous qui vous êtes et ce que vous souhaitez aborder ; vous pouvez aussi nous écrire directement aux adresses ci-dessus.",
    f_name: "Votre nom",
    f_org: "Organisation",
    f_email: "Votre courriel",
    f_msg: "Que souhaitez-vous aborder ?",
    f_send: "Composer le courriel",
    f_note: "Ceci ouvre votre application de messagerie avec le message préparé. Rien n’est envoyé tant que vous ne l’envoyez pas.",
    f_send_live: "Envoyer la demande",
    f_note_live: "Votre demande nous est transmise directement et vous recevez un numéro de reçu. En cas d’échec, le bouton ouvre votre messagerie à la place.",
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

  // The form is a progressive-enhancement mailto: composer (the subject rides in
  // the action URL; form fields can only become the mail body). With JS,
  // src/assets/briefing.js posts to data-endpoint (api/briefing.js on Vercel,
  // the PHP handler on cPanel, the Worker on Cloudflare) and swaps the copy to the *_live
  // strings; if that POST fails it reverts to the native mailto: behaviour.
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
        action="mailto:${facts.org.email}?subject=${encodeURIComponent(c.subject)}" method="post" enctype="text/plain">
    <div class="stack">
      <label>${c.f_name}<br><input type="text" name="name" required minlength="2" maxlength="200" autocomplete="name" style="width:100%;margin-top:.3rem;padding:.6rem;border:1px solid var(--rule-strong);border-radius:var(--radius-control);background:var(--surface);color:var(--text);font:inherit"></label>
      <label>${c.f_org}<br><input type="text" name="organization" maxlength="200" autocomplete="organization" style="width:100%;margin-top:.3rem;padding:.6rem;border:1px solid var(--rule-strong);border-radius:var(--radius-control);background:var(--surface);color:var(--text);font:inherit"></label>
      <label>${c.f_email}<br><input name="email" type="email" required pattern="[^\s@]+@[^\s@]+\.[^\s@]+" autocomplete="email" style="width:100%;margin-top:.3rem;padding:.6rem;border:1px solid var(--rule-strong);border-radius:var(--radius-control);background:var(--surface);color:var(--text);font:inherit"></label>
      <label>${c.f_msg}<br><textarea name="message" rows="5" required minlength="10" maxlength="5000" style="width:100%;margin-top:.3rem;padding:.6rem;border:1px solid var(--rule-strong);border-radius:var(--radius-control);background:var(--surface);color:var(--text);font:inherit"></textarea></label>
      <div>
        <button class="btn" type="submit" data-label-native="${c.f_send}" data-label-send="${c.f_send_live}"><span data-label>${c.f_send}</span> <span class="term" aria-hidden="true">→</span></button>
      </div>
      <p class="muted" id="briefing-note" data-note-native="${c.f_note}" data-note-send="${c.f_note_live}" style="font-size:var(--step--1)">${c.f_note}</p>
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
