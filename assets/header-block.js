/* ============================================================
   SHARED HEADER INJECTOR — facturio.ch
   ------------------------------------------------------------
   Injects the header into #sh-placeholder on every external page
   (main site + all blog posts, DE/FR/IT/EN). app.facturio.ch is
   NOT included.

   v3 (2026-11-06) — two production regressions fixed at source:

   1. RESPONSIVE LADDER INLINED.
      The old file had a single `@media(max-width:640px)` block and
      no min-width rungs, so tablet/desktop inherited phone values
      (18px logo, 12px links). The ladder now lives here, in the
      injector, so there is no second stylesheet to load or forget.

   2. DROPDOWN LOGIC INLINED.
      The language dropdown used to be driven by a separate
      /assets/header-i18n.js fetched at runtime. That file was
      missing from the repo, so any deploy dropped it → 404 → the
      menu never opened. The logic is now inline: one request, no
      way to 404. Language URLs also fall back to a computed path
      when a page has no <link rel="alternate" hreflang> tags
      (the main page has none), so switching language navigates
      instead of only relabelling the header.
   ============================================================ */
(function () {
  var placeholder = document.getElementById("sh-placeholder");
  if (!placeholder) return;

  var html = `<!-- ============================================================
   SHARED HEADER BLOCK — facturio.ch
   Edit this one file to update the header on every external page
   (main site + all blog posts, DE/FR/IT/EN).
   app.facturio.ch is NOT included.
   ============================================================ -->
<style>
/* Shared header — self-contained, no conflicts with page CSS */
#shared-header{position:sticky;top:0;z-index:50;width:100%}
#shared-header .sh-bar{border-bottom:none;background:#ffffff;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
#shared-header .sh-inner{display:flex;align-items:center;width:100%;max-width:1152px;margin:0 auto;padding:11px 14px;box-sizing:border-box}
#shared-header .sh-left{display:flex;align-items:center;flex-shrink:0}
#shared-header .sh-center{display:flex;align-items:center;gap:6px;flex-shrink:0}
#shared-header .sh-right{display:flex;align-items:center;gap:10px;margin-left:auto;flex-shrink:0}
#shared-header .sh-logo{font-size:18px;font-weight:700;letter-spacing:-.025em;line-height:1;white-space:nowrap;text-decoration:none;color:#111827;flex-shrink:0}
#shared-header .sh-logo .grad{background-image:linear-gradient(to right,#4f46e5,#2563eb,#06b6d4);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}
#shared-header .sh-center a.sh-link{font-size:12px;font-weight:500;color:#4b5563;text-decoration:none;white-space:nowrap;line-height:1;padding:6px 8px;border-radius:6px}
#shared-header .sh-center a.sh-link:hover{color:#111827;background:#f3f4f6}
#shared-header .sh-right a.sh-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;border-radius:8px;padding:7px 14px;font-size:12px;font-weight:600;color:#fff;text-decoration:none;line-height:1;background-image:linear-gradient(to right,#4f46e5,#2563eb,#06b6d4);box-shadow:0 1px 2px rgba(0,0,0,.05)}
#shared-header .sh-right a.sh-btn:hover{filter:brightness(1.08)}
#shared-header .sh-lang{display:inline-flex;align-items:center;gap:4px;cursor:pointer;font-size:12px;font-weight:500;color:#4b5563;line-height:1;padding:6px 8px;border-radius:6px;position:relative}
#shared-header .sh-lang:hover{background:#f3f4f6}
#shared-header .sh-lang:focus-visible{outline:2px solid #4f46e5;outline-offset:2px}
#shared-header .sh-lang .sh-label{font-weight:500;color:#4b5563}
#shared-header .sh-lang .sh-chev{font-size:9px;color:#6b7280}
#shared-header .sh-menu{display:none;position:absolute;left:50%;transform:translateX(-50%);top:calc(100% + 6px);min-width:160px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;box-shadow:0 10px 25px rgba(0,0,0,.10);padding:6px;z-index:1000}
#shared-header .sh-menu.open{display:block}
#shared-header .sh-menu a{display:flex;align-items:center;gap:8px;width:100%;padding:8px 10px;font-size:14px;color:#374151;text-decoration:none;border-radius:6px}
#shared-header .sh-menu a:hover{background:#f3f4f6}
#shared-header .sh-menu a .sh-tick{margin-left:auto;color:#4f46e5;font-weight:700}

/* ---- Mobile (< 640px) — unchanged from the original design ---- */
@media(max-width:640px){
  #shared-header .sh-inner{padding:9px 14px;flex-wrap:wrap;gap:8px}
  #shared-header .sh-right{margin-left:auto}
  #shared-header .sh-logo{font-size:16px}
  #shared-header .sh-lang{font-size:12px;padding:6px 8px}
}

/* ---- Responsive ladder (>= 640px) -------------------------------
   Mobile-first values above are phone values. These rungs scale the
   header up so tablet and desktop do not inherit them.
   ---------------------------------------------------------------- */
@media(min-width:640px){
  #shared-header .sh-inner{padding:11px 20px;gap:12px}
  #shared-header .sh-logo{font-size:20px}
  #shared-header .sh-center{gap:8px}
  #shared-header .sh-center a.sh-link{font-size:13px;padding:7px 10px}
  #shared-header .sh-lang{font-size:13px;padding:7px 10px}
  #shared-header .sh-lang .sh-chev{font-size:10px}
  #shared-header .sh-right a.sh-btn{font-size:13px;padding:8px 16px}
}
@media(min-width:768px){
  #shared-header .sh-inner{padding:14px 32px;gap:16px}
  #shared-header .sh-logo{font-size:24px}
  #shared-header .sh-center{gap:20px}
  #shared-header .sh-center a.sh-link{font-size:14px;padding:8px 12px}
  #shared-header .sh-right{gap:14px}
  #shared-header .sh-lang{font-size:14px;padding:8px 12px}
  #shared-header .sh-lang .sh-chev{font-size:10px}
  #shared-header .sh-right a.sh-btn{font-size:14px;padding:10px 20px}
  #shared-header .sh-menu a{font-size:15px}
}
@media(min-width:1024px){
  #shared-header .sh-inner{padding:16px 32px;gap:20px}
  #shared-header .sh-logo{font-size:28px}
  #shared-header .sh-center{gap:24px}
  #shared-header .sh-center a.sh-link{font-size:15px;padding:9px 14px}
  #shared-header .sh-right{gap:16px}
  #shared-header .sh-lang{font-size:15px;padding:9px 14px}
  #shared-header .sh-lang .sh-chev{font-size:11px}
  #shared-header .sh-right a.sh-btn{font-size:15px;padding:11px 24px}
  #shared-header .sh-menu a{font-size:15px}
}
@media(min-width:1280px){
  #shared-header .sh-inner{padding:16px 32px}
  #shared-header .sh-logo{font-size:30px}
  #shared-header .sh-center{gap:28px}
  #shared-header .sh-center a.sh-link{font-size:16px;padding:10px 16px}
  #shared-header .sh-lang{font-size:16px;padding:10px 16px}
  #shared-header .sh-lang .sh-chev{font-size:11px}
  #shared-header .sh-right a.sh-btn{font-size:16px;padding:12px 26px}
  #shared-header .sh-menu a{font-size:16px}
}

/* Keep the row on one line in the 640–900px band; let the centre
   links absorb the squeeze instead of wrapping the Login button. */
@media(min-width:640px) and (max-width:900px){
  #shared-header .sh-inner{flex-wrap:nowrap}
  #shared-header .sh-center{min-width:0}
}

/* Dropdown items must not outgrow the nav links beside them in the
   640–767px band. Upper bound is required: this selector has the same
   specificity as the .sh-menu a rules above, so a bare min-width here
   would sit later in the file and flatten the menu on desktop too. */
@media(min-width:640px) and (max-width:767px){
  #shared-header .sh-menu a{font-size:13px}
}
</style>

<header id="shared-header">
  <div class="sh-bar">
    <div class="sh-inner">
      <div class="sh-left">
        <a href="/" class="sh-logo"><span class="grad">facturio.ch</span></a>
      </div>
      <div class="sh-center">
        <a href="/about" class="sh-link" data-i18n="nav.about">About</a>
        <a href="/blog/" class="sh-link" data-i18n="nav.blog">Blog</a>
      </div>
      <div class="sh-right">
        <div class="sh-lang" id="shLang" role="button" tabindex="0" aria-haspopup="true" aria-expanded="false" aria-label="Language">
          <span class="sh-label" id="shLangLabel">EN</span><span class="sh-chev">▾</span>
          <div class="sh-menu" id="shMenu" role="menu"></div>
        </div>
        <a href="https://app.facturio.ch/login" class="sh-link sh-btn" data-i18n="nav.signin">Log in</a>
      </div>
    </div>
  </div>
</header>`;

  placeholder.innerHTML = html;

  /* Flag for the legacy /assets/header-i18n.js shim: when this injector
     has already wired the dropdown, that file must not run a second time
     (double-binding would toggle the menu open then straight back shut). */
  window.__shHeaderReady = true;

  /* ---------------- i18n + language dropdown (inlined) ---------------- */
  var I18N = {
    en: { "nav.about": "About", "nav.blog": "Blog", "nav.signup": "Sign up", "nav.signin": "Log in" },
    de: { "nav.about": "Über uns", "nav.blog": "Blog", "nav.signup": "Registrieren", "nav.signin": "Anmelden" },
    fr: { "nav.about": "À propos", "nav.blog": "Blog", "nav.signup": "S'inscrire", "nav.signin": "Se connecter" },
    it: { "nav.about": "Chi siamo", "nav.blog": "Blog", "nav.signup": "Registrati", "nav.signin": "Accedi" }
  };
  var LANGS = {
    en: { code: "EN", name: "English" },
    de: { code: "DE", name: "Deutsch" },
    fr: { code: "FR", name: "Français" },
    it: { code: "IT", name: "Italiano" }
  };
  var LANG_KEY = "facturio-lang";
  var SLUGS = { en: "about", de: "ueber-uns", fr: "a-propos", it: "chi-siamo" };

  /* Detect the page language from the URL. Handles both /de/… and
     /blog/de/… (and /de/blog/…), which the old startsWith('/de/')
     check missed for the /blog/de/ family. */
  function urlLang() {
    var m = window.location.pathname.match(/(?:^|\/)(en|de|fr|it)(?:\/|$)/);
    return m ? m[1] : "en";
  }

  /* Language URL for a page that ships no hreflang alternates
     (the main page has none). Swap the language segment if there is
     one, otherwise fall back to the localised home page. */
  function fallbackUrl(lang) {
    var p = window.location.pathname;
    if (/(?:^|\/)(en|de|fr|it)(?:\/|$)/.test(p)) {
      return p.replace(/(^|\/)(en|de|fr|it)(\/|$)/, function (_, a, _l, b) {
        return lang === "en" ? a + b : a + lang + b;
      });
    }
    return lang === "en" ? "/" : "/" + lang + "/";
  }

  function alternates() {
    var map = {};
    var links = document.querySelectorAll('link[rel="alternate"][hreflang]');
    for (var i = 0; i < links.length; i++) {
      var hl = links[i].getAttribute("hreflang");
      if (hl && hl !== "x-default") map[hl.replace("-CH", "")] = links[i].getAttribute("href");
    }
    return map;
  }

  function buildMenu() {
    var menu = document.getElementById("shMenu");
    if (!menu) return;
    var alt = alternates();
    menu.innerHTML = "";
    ["en", "de", "fr", "it"].forEach(function (k) {
      var a = document.createElement("a");
      a.setAttribute("role", "menuitem");
      a.setAttribute("data-lang", k);
      a.href = alt[k] || fallbackUrl(k);
      a.innerHTML = "<b>" + LANGS[k].code + "</b> <span>" + LANGS[k].name + "</span>";
      a.addEventListener("click", function () {
        try { localStorage.setItem(LANG_KEY, k); } catch (e) {}
      });
      menu.appendChild(a);
    });
  }

  function apply(l) {
    var dict = I18N[l] || I18N.en;
    document.documentElement.lang = l;
    var els = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute("data-i18n");
      if (dict[key] != null) els[i].textContent = dict[key];
    }
    var lbl = document.getElementById("shLangLabel");
    if (lbl) lbl.textContent = LANGS[l].code;

    var menu = document.getElementById("shMenu");
    if (menu) {
      var items = menu.querySelectorAll("[data-lang]");
      for (var j = 0; j < items.length; j++) {
        var active = items[j].getAttribute("data-lang") === l;
        var tick = items[j].querySelector(".sh-tick");
        if (active && !tick) {
          var s = document.createElement("span");
          s.className = "sh-tick";
          s.textContent = "✓";
          items[j].appendChild(s);
        } else if (!active && tick) {
          tick.remove();
        }
      }
    }
    try { localStorage.setItem(LANG_KEY, l); } catch (e) {}

    var logins = document.querySelectorAll('a[href*="app.facturio.ch/login"]');
    for (var n = 0; n < logins.length; n++) {
      try {
        var u = new URL(logins[n].href);
        u.searchParams.set("lang", l);
        logins[n].href = u.toString();
      } catch (e) {}
    }
  }

  function updateNavHrefs() {
    var lang = urlLang();
    var prefix = lang === "en" ? "" : "/" + lang;
    var about = document.querySelector('a.sh-link[data-i18n="nav.about"]');
    var blog = document.querySelector('a.sh-link[data-i18n="nav.blog"]');
    var logo = document.querySelector("a.sh-logo");
    if (about) about.href = prefix + "/" + SLUGS[lang];
    if (blog) blog.href = prefix + "/blog/";
    if (logo) logo.href = prefix + "/";
  }

  function closeMenu() {
    var m = document.getElementById("shMenu");
    var b = document.getElementById("shLang");
    if (m) m.classList.remove("open");
    if (b) b.setAttribute("aria-expanded", "false");
  }

  function init() {
    buildMenu();
    updateNavHrefs();
    apply(urlLang());

    var btn = document.getElementById("shLang");
    var menu = document.getElementById("shMenu");

    if (btn && menu) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = menu.classList.toggle("open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      btn.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          menu.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
          var first = menu.querySelector("a");
          if (first) first.focus();
        } else if (e.key === "Escape") {
          closeMenu();
        }
      });
      menu.addEventListener("click", function (e) {
        if (e.target.closest("[data-lang]")) closeMenu();
      });
    }

    document.addEventListener("click", function (e) {
      if (!e.target.closest("#shLang")) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
