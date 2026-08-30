/* Briefing form enhancement. Loaded only on the contact page.
   If /api/briefing is live (the PHP handler on cPanel, or the Cloudflare Worker),
   the form submits via fetch and shows an inline receipt; the button and the
   note under it say so. If that POST fails, the button and note revert to the
   native mailto: behaviour and the next submit opens the visitor's mail client,
   so the form always works — with or without a server. */
(function () {
  "use strict";
  var form = document.getElementById("briefing-form");
  if (!form) return;
  var endpoint = form.getAttribute("data-endpoint");
  if (!endpoint || !window.fetch) return; // native mailto: stays in charge

  var btn = form.querySelector("button[type=submit]");
  var note = document.getElementById("briefing-note");
  var lang = (document.documentElement.getAttribute("lang") || "en").slice(0, 2);
  var T = lang === "fr"
    ? { sending: "Envoi…",
        ok: "Merci. Votre demande a été envoyée.",
        invalid: "Veuillez vérifier les champs (nom : 2 caractères minimum, message : 10 minimum, adresse valide) et réessayer.",
        err: "L’envoi a échoué. Appuyez sur « Composer le courriel » pour ouvrir votre messagerie avec le message, ou écrivez-nous directement à info@sigilsovereign.com." }
    : { sending: "Sending…",
        ok: "Thank you. Your request has been sent.",
        invalid: "Please check the fields (name: at least 2 characters, message: at least 10, a valid email) and try again.",
        err: "Sending failed. Press “Compose email” to open your email application with the message instead, or write to us directly at info@sigilsovereign.com." };
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var status = document.createElement("p");
  status.setAttribute("role", "status");
  status.style.marginTop = "1rem";
  status.style.fontFamily = "var(--font-mono)";
  status.style.fontSize = "var(--step--1)";
  form.appendChild(status);

  // Honeypot field (hidden), appended so bots fill it but humans never see it.
  var hp = document.createElement("input");
  hp.type = "text"; hp.name = "website"; hp.tabIndex = -1; hp.autocomplete = "off";
  hp.setAttribute("aria-hidden", "true");
  hp.style.position = "absolute"; hp.style.left = "-9999px"; hp.style.width = "1px"; hp.style.height = "1px";
  form.appendChild(hp);

  // Set after a failed POST: the next submit is not intercepted, so the native
  // mailto: action (the form's own action attribute) takes over.
  var useNative = false;

  function setMode(live) {
    var label = btn && btn.querySelector("[data-label]");
    if (label && btn.getAttribute(live ? "data-label-send" : "data-label-native")) {
      label.textContent = btn.getAttribute(live ? "data-label-send" : "data-label-native");
    }
    if (note && note.getAttribute(live ? "data-note-send" : "data-note-native")) {
      note.textContent = note.getAttribute(live ? "data-note-send" : "data-note-native");
    }
    // A disabled control is left out of the mailto: body.
    hp.disabled = !live;
  }
  setMode(true);

  function val(name) {
    var el = form.elements[name];
    return el && typeof el.value === "string" ? el.value : "";
  }
  function trimField(name) {
    var el = form.elements[name];
    if (el && typeof el.value === "string") el.value = el.value.trim();
  }

  form.addEventListener("submit", function (ev) {
    if (useNative) return; // native mailto: submit

    // Trim first so the browser and the server agree on lengths.
    trimField("name"); trimField("organization"); trimField("email"); trimField("message");
    var payload = {
      name: val("name"),
      organization: val("organization"),
      email: val("email"),
      message: val("message"),
      website: hp.value
    };
    ev.preventDefault();
    if (payload.name.length < 2 || payload.message.length < 10 || !EMAIL.test(payload.email)) {
      status.style.color = "var(--seal-700)";
      status.textContent = T.invalid;
      return;
    }
    if (btn) btn.disabled = true;
    status.style.color = "var(--text-soft)";
    status.textContent = T.sending;

    fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (r) {
      // A live endpoint always answers JSON; anything else (404 page, 5xx, HTML)
      // means there is no handler behind /api/briefing on this host.
      return r.json().then(function (j) { return { status: r.status, json: j }; },
                           function () { return { status: r.status, json: null }; });
    })
      .then(function (res) {
        if (res.json && res.json.ok) {
          status.style.color = "var(--accent-ink)";
          status.textContent = T.ok + (res.json.id ? " (" + res.json.id + ")" : "");
          form.reset();
          if (btn) btn.disabled = false;
          return;
        }
        if (res.json && res.status === 422) {
          // The handler is alive and rejected the input: let the visitor fix it
          // and retry through the endpoint (do not fall back to mailto).
          status.style.color = "var(--seal-700)";
          status.textContent = T.invalid;
          if (btn) btn.disabled = false;
          return;
        }
        throw new Error("endpoint unavailable");
      })
      .catch(function () {
        useNative = true;
        setMode(false);
        status.style.color = "var(--seal-700)";
        status.textContent = T.err;
        if (btn) btn.disabled = false;
      });
  });
})();
