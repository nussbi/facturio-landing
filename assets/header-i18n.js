/* ============================================================
   LEGACY SHIM — /assets/header-i18n.js
   ------------------------------------------------------------
   The language dropdown used to live in this file, fetched at
   runtime by header-block.js. It was never committed to the repo,
   so every deploy 404'd it and the dropdown stopped working.

   As of v3 the i18n + dropdown logic is INLINED in
   /assets/header-block.js. This file is kept only so that a page
   cached from before the fix (which still requests it) does not
   log a 404.

   It deliberately does nothing when the injector has already run.
   Running the old logic here as well would bind a second click
   handler to #shLang, toggling the menu open and immediately shut.
   ============================================================ */
(function () {
  if (window.__shHeaderReady) return; // injector already wired the dropdown
  // No injector on this page: nothing to enhance.
})();
