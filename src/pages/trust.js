import { page } from "../lib/layout.js";
import { strings, routes } from "../data/strings.js";
import { h2 } from "../lib/ui.js";
import { seal } from "../assets/mark.js";
import { orgNode, breadcrumb, graph } from "../lib/jsonld.js";
import facts from "../data/facts.json" with { type: "json" };

const copy = {
  en: {
    title: "Trust",
    description: "SIGIL's own security posture, stated as a verifiable list: TLS 1.3 and HSTS, DNSSEC and CAA, a strict content-security policy, DMARC at reject, a signed disclosure policy, a published bill of materials, and no cookies or third-party trackers.",
    lede: "A company that builds sovereign security infrastructure should hold its own site to the standard it asks of others. Everything below can be checked with public tools.",
    groups: [
      ["Transport", [
        ["TLS", "TLS 1.3 only, with HSTS and preload."],
        ["Protocol", "HTTP/3, with OCSP stapling."]
      ]],
      ["Domain and DNS", [
        ["DNSSEC", "The domain is DNSSEC-signed."],
        ["Issuance", "CAA records restrict which authorities may issue certificates. No wildcard."]
      ]],
      ["Application", [
        ["Content-Security-Policy", "Strict, with no unsafe-inline and frames denied."],
        ["Isolation", "Cross-origin isolation headers set; permissions for camera, microphone, and geolocation denied."]
      ]],
      ["Mail", [
        ["Authentication", "SPF (hard fail), 2048-bit DKIM, and DMARC at reject with reporting."],
        ["Transport", "MTA-STS and TLS reporting enabled."]
      ]],
      ["Disclosure", [
        ["security.txt", "An RFC 9116 security.txt, signed with the SIGIL PGP key."],
        ["Policy", "A coordinated-disclosure policy with a safe-harbour statement; security@sigilsovereign.com is monitored."]
      ]],
      ["Supply chain", [
        ["Bill of materials", "This site's software bill of materials and build provenance are published per release."],
        ["Signing", "Builds are signed; what runs can be checked against what was shipped."]
      ]],
      ["Privacy", [
        ["No cookies", "This site sets no cookies and loads no third-party scripts."],
        ["Analytics", "Server-side log analysis only; no client-side tracking."]
      ]]
    ],
    pgpH: "PGP key",
    pgpP: "Encrypted correspondence and signature verification use the SIGIL PGP key.",
    fingerprint: "Fingerprint",
    keyState: "The full public key is published at /pgp.txt. Verify the fingerprint before use.",
    secLink: "Read security.txt"
  },
  fr: {
    title: "Confiance",
    description: "La posture de sécurité de SIGIL, présentée comme une liste vérifiable : TLS 1.3 et HSTS, DNSSEC et CAA, une politique de sécurité du contenu stricte, DMARC en rejet, une politique de divulgation signée, une nomenclature logicielle publiée, et aucun cookie ni traceur tiers.",
    lede: "Une entreprise qui construit une infrastructure de sécurité souveraine devrait tenir son propre site au standard qu’elle demande aux autres. Tout ce qui suit peut être vérifié avec des outils publics.",
    groups: [
      ["Transport", [
        ["TLS", "TLS 1.3 uniquement, avec HSTS et preload."],
        ["Protocole", "HTTP/3, avec agrafage OCSP."]
      ]],
      ["Domaine et DNS", [
        ["DNSSEC", "Le domaine est signé DNSSEC."],
        ["Émission", "Des enregistrements CAA restreignent les autorités pouvant émettre des certificats. Aucun wildcard."]
      ]],
      ["Application", [
        ["Content-Security-Policy", "Stricte, sans unsafe-inline et cadres refusés."],
        ["Isolation", "En-têtes d’isolation cross-origin définis ; permissions caméra, microphone et géolocalisation refusées."]
      ]],
      ["Messagerie", [
        ["Authentification", "SPF (échec strict), DKIM 2048 bits et DMARC en rejet avec rapports."],
        ["Transport", "MTA-STS et rapports TLS activés."]
      ]],
      ["Divulgation", [
        ["security.txt", "Un security.txt conforme RFC 9116, signé avec la clé PGP de SIGIL."],
        ["Politique", "Une politique de divulgation coordonnée avec clause de safe-harbour ; security@sigilsovereign.com est surveillé."]
      ]],
      ["Chaîne d’approvisionnement", [
        ["Nomenclature", "La nomenclature logicielle de ce site et sa provenance de build sont publiées à chaque version."],
        ["Signature", "Les builds sont signés ; ce qui s’exécute peut être vérifié par rapport à ce qui a été livré."]
      ]],
      ["Confidentialité", [
        ["Aucun cookie", "Ce site ne pose aucun cookie et ne charge aucun script tiers."],
        ["Analytique", "Analyse de journaux côté serveur uniquement ; aucun suivi côté client."]
      ]]
    ],
    pgpH: "Clé PGP",
    pgpP: "La correspondance chiffrée et la vérification de signature utilisent la clé PGP de SIGIL.",
    fingerprint: "Empreinte",
    keyState: "La clé publique complète est publiée sur /pgp.txt. Vérifiez l’empreinte avant usage.",
    secLink: "Lire security.txt"
  }
};

export function trust(lang) {
  const c = copy[lang];
  const alt = lang === "en" ? "fr" : "en";
  const jsonld = graph([
    orgNode(facts),
    breadcrumb(facts, [
      { name: "SIGIL", path: routes.home[lang] },
      { name: c.title, path: routes.trust[lang] }
    ])
  ]);

  const groups = c.groups.map(([title, rows]) => `
    <div class="card reveal">
      <h2 class="h-seal" style="font-size:var(--step-1)">${seal({ size: 18 })}<span>${title}</span></h2>
      <div class="table-wrap" style="margin-top:1rem;border:0">
        <table><tbody>${rows.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("")}</tbody></table>
      </div>
    </div>`).join("");

  const body = `
<section class="section wrap">
  <p class="eyebrow">${strings[lang].nav.trust}</p>
  <h1>${c.title}</h1>
  <p class="lead" style="margin-top:1rem;max-width:62ch">${c.lede}</p>
</section>
<section class="section wrap rule-top">
  <div class="grid-2">${groups}</div>
</section>
<section class="section wrap rule-top">
  ${h2(c.pgpH)}
  <p style="margin-top:1rem;max-width:62ch">${c.pgpP}</p>
  <div class="card" style="margin-top:1.5rem">
    <p class="eyebrow">${c.fingerprint}</p>
    <p class="mono" style="margin-top:.5rem;word-spacing:.2rem;font-size:var(--step-0)">${facts.org.pgpFingerprint}</p>
    <p class="muted" style="margin-top:1rem">${c.keyState}</p>
    <p style="margin-top:1rem"><a class="btn ghost" href="/.well-known/security.txt">${c.secLink} <span class="term" aria-hidden="true">→</span></a></p>
  </div>
</section>`;

  return page({
    lang, current: "trust", title: c.title, description: c.description,
    path: routes.trust[lang], altPath: routes.trust[alt], altLang: alt,
    ogType: "website", jsonld, body
  });
}
