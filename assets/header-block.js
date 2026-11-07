(function () {
  window.__shHeaderReady = true;
  function init() {
    var language = document.documentElement.lang.slice(0, 2);
    var langButton = document.querySelector('[data-language-trigger]');
    var langMenu = document.querySelector('[data-language-menu]');
    var mobileButton = document.querySelector('[data-mobile-trigger]');
    var mobileMenu = document.querySelector('[data-mobile-nav]');
    function closeLanguage() { if (langMenu) langMenu.hidden = true; if (langButton) langButton.setAttribute('aria-expanded', 'false'); }
    if (langButton && langMenu) {
      langButton.addEventListener('click', function () { langMenu.hidden = !langMenu.hidden; langButton.setAttribute('aria-expanded', String(!langMenu.hidden)); });
      langButton.addEventListener('keydown', function (event) { if (event.key === 'ArrowDown') { event.preventDefault(); langMenu.hidden = false; langButton.setAttribute('aria-expanded', 'true'); langMenu.querySelector('a').focus(); } });
      langMenu.addEventListener('keydown', function (event) { var links = Array.from(langMenu.querySelectorAll('a')); var index = links.indexOf(document.activeElement); if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); links[(index + (event.key === 'ArrowDown' ? 1 : links.length - 1)) % links.length].focus(); } });
    }
    document.addEventListener('click', function (event) { if (!event.target.closest('.f-language')) closeLanguage(); });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape') { closeLanguage(); if (mobileMenu) mobileMenu.hidden = true; if (mobileButton) mobileButton.setAttribute('aria-expanded', 'false'); } });
    document.querySelectorAll('[data-lang]').forEach(function (link) { link.addEventListener('click', function () { var value = link.dataset.lang; try { localStorage.setItem('facturio-lang', value); } catch (_) {} var domain = location.hostname === 'facturio.ch' || location.hostname.endsWith('.facturio.ch') ? ';domain=.facturio.ch' : ''; document.cookie = 'facturio-lang=' + value + ';path=/;max-age=31536000;samesite=lax' + domain; }); });
    if (mobileButton && mobileMenu) mobileButton.addEventListener('click', function () { mobileMenu.hidden = !mobileMenu.hidden; mobileButton.setAttribute('aria-expanded', String(!mobileMenu.hidden)); });
    var isStaging = location.hostname === 'staging.facturio.ch' || location.hostname.includes('facturio-staging');
    if (isStaging) document.querySelectorAll('a[href]').forEach(function (link) { var url = new URL(link.href); var hosts = { 'facturio.ch': location.hostname, 'app.facturio.ch': 'staging.app.facturio.ch', 'sign.facturio.ch': 'staging.sign.facturio.ch' }; if (hosts[url.hostname]) { url.hostname = hosts[url.hostname]; link.href = url.toString(); } });
    document.querySelectorAll('a[href*="app.facturio.ch/login"],a[href*="app.facturio.ch/reset"]').forEach(function (link) { var url = new URL(link.href); url.searchParams.set('lang', language); link.href = url.toString(); });
    document.querySelectorAll('#faq details').forEach(function (detail) { detail.addEventListener('toggle', function () { if (detail.open) document.querySelectorAll('#faq details').forEach(function (other) { if (other !== detail) other.open = false; }); }); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
