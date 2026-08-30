/* Briefing form enhancement. Loaded only on the contact page. If the Worker
   endpoint is reachable, the form submits via fetch and shows an inline result;
   otherwise the native mailto: action remains the fallback. */
(function () {
  "use strict";
  var form = document.getElementById("briefing-form");
  if (!form) return;
  var endpoint = form.getAttribute("data-endpoint");
  if (!endpoint) return;

  var status = document.createElement("p");
  status.setAttribute("role", "status");
  status.style.marginTop = "1rem";
  status.style.fontFamily = "var(--font-mono)";
  status.style.fontSize = "var(--step--1)";
  form.appendChild(status);

  var lang = (document.documentElement.getAttribute("lang") || "en").slice(0, 2);
  var T = lang === "fr"
    ? { sending: "Envoi…", ok: "Merci. Votre demande a été envoyée.", err: "L’envoi a échoué. Vous pouvez nous écrire directement à info@sigilsovereign.com." }
    : { sending: "Sending…", ok: "Thank you. Your request has been sent.", err: "Sending failed. You can write to us directly at info@sigilsovereign.com." };

  form.addEventListener("submit", function (ev) {
    // Only intercept if fetch is available; else let mailto: proceed.
    if (!window.fetch) return;
    ev.preventDefault();
    var btn = form.querySelector("button[type=submit]");
    if (btn) btn.disabled = true;
    status.style.color = "var(--text-soft)";
    status.textContent = T.sending;

    var payload = {
      name: form.name.value,
      organization: form.organization ? form.organization.value : "",
      email: form.email.value,
      message: form.message.value,
      website: form.website ? form.website.value : ""
    };

    fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json().catch(function () { return { ok: r.ok }; }); })
      .then(function (res) {
        if (res && res.ok) {
          status.style.color = "var(--accent-ink)";
          status.textContent = T.ok + (res.id ? " (" + res.id + ")" : "");
          form.reset();
        } else { throw new Error("bad"); }
      })
      .catch(function () {
        status.style.color = "var(--seal-700)";
        status.textContent = T.err;
        // As a courtesy, offer the mailto fallback by re-enabling native submit.
        if (btn) btn.disabled = false;
      });
  });

  // Honeypot field (hidden), appended so bots fill it but humans never see it.
  var hp = document.createElement("input");
  hp.type = "text"; hp.name = "website"; hp.tabIndex = -1; hp.autocomplete = "off";
  hp.setAttribute("aria-hidden", "true");
  hp.style.position = "absolute"; hp.style.left = "-9999px"; hp.style.width = "1px"; hp.style.height = "1px";
  form.appendChild(hp);
})();
