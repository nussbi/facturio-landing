const fs = require('fs');
const path = require('path');
const { allPosts } = require('./posts.js');
const de = require('./translations/de.js');
const fr = require('./translations/fr.js');
const it = require('./translations/it.js');
const TRANS = { de, fr, it };

const DIR = '/data/workspace/facturio';
const BLOG = path.join(DIR, 'blog');

const UI = {
  en: {
    blogDesc: 'Guides on Swiss invoicing, QR-bills, and self-employment for freelancers and SMEs.',
    blog: 'Blog', signin: 'Log in',
    footerCopy: '© 2026 facturio.ch — Swiss QR invoicing', startFree: 'Start free', footerStart: 'Start for Free',
    ctaTitle: 'Create compliant Swiss QR-bills in minutes',
    ctaSub: 'facturio.ch generates SIX-compliant QR-bills with every invoice — so you can focus on your work, not the paperwork.',
    indexTitle: 'The facturio.ch Blog',
    indexSub: 'Practical guides on Swiss invoicing, QR-bills, and self-employment — for freelancers and SMEs.',
    breadcrumb: '← All articles',
    newer: 'Newer', older: 'Older', page: 'Page', of: 'of',
    related: 'Related reading', relatedOn: 'on', relatedSub: 'practical AI routines for Swiss freelancers and SMEs.',
  },
  de: {
    blogDesc: 'Ratgeber zu Schweizer Rechnungsstellung, QR-Rechnungen und Selbstständigkeit für Freelancer und KMU.',
    blog: 'Blog', signin: 'Anmelden',
    footerCopy: '© 2026 facturio.ch — Schweizer QR-Rechnungsstellung', startFree: 'Kostenlos starten', footerStart: 'Kostenlos starten',
    ctaTitle: 'Erstelle in Minuten konforme Schweizer QR-Rechnungen',
    ctaSub: 'facturio.ch erstellt mit jeder Rechnung SIX-konforme QR-Rechnungen – damit du dich auf deine Arbeit konzentrieren kannst, nicht auf den Papierkram.',
    indexTitle: 'Der facturio.ch-Blog',
    indexSub: 'Praktische Ratgeber zu Schweizer Rechnungsstellung, QR-Rechnungen und Selbstständigkeit – für Freelancer und KMU.',
    breadcrumb: '← Alle Artikel',
    newer: 'Neuer', older: 'Älter', page: 'Seite', of: 'von',
    related: 'Weiterführende Lektüre', relatedOn: 'auf', relatedSub: 'praktische KI-Routinen für Schweizer Freelancer und KMU.',
  },
  fr: {
    blogDesc: 'Guides sur la facturation suisse, les QR-factures et l’indépendance pour les freelances et PME.',
    blog: 'Blog', signin: 'Se connecter',
    footerCopy: '© 2026 facturio.ch — Facturation QR suisse', startFree: 'Commencer gratuitement', footerStart: 'Commencer gratuitement',
    ctaTitle: 'Créez des QR-factures suisses conformes en quelques minutes',
    ctaSub: 'facturio.ch génère des QR-factures conformes SIX avec chaque facture – pour que vous puissiez vous concentrer sur votre travail, pas sur la paperasse.',
    indexTitle: 'Le blog facturio.ch',
    indexSub: 'Guides pratiques sur la facturation suisse, les QR-factures et l’indépendance – pour les freelances et PME.',
    breadcrumb: '← Tous les articles',
    newer: 'Plus récents', older: 'Plus anciens', page: 'Page', of: 'sur',
    related: 'Lecture complémentaire', relatedOn: 'sur', relatedSub: 'des routines IA pratiques pour les freelances et PME suisses.',
  },
  it: {
    blogDesc: 'Guide su fatturazione svizzera, QR-fatture e lavoro autonomo per liberi professionisti e PMI.',
    blog: 'Blog', signin: 'Accedi',
    footerCopy: '© 2026 facturio.ch — Fatturazione QR svizzera', startFree: 'Inizia gratis', footerStart: 'Inizia gratis',
    ctaTitle: 'Crea QR-fatture svizzere conformi in pochi minuti',
    ctaSub: 'facturio.ch genera QR-fatture conformi SIX con ogni fattura — così puoi concentrarti sul tuo lavoro, non sulla burocrazia.',
    indexTitle: 'Il blog di facturio.ch',
    indexSub: 'Guide pratiche su fatturazione svizzera, QR-fatture e lavoro autonomo — per liberi professionisti e PMI.',
    breadcrumb: '← Tutti gli articoli',
    newer: 'Più recenti', older: 'Meno recenti', page: 'Pagina', of: 'di',
    related: 'Letture correlate', relatedOn: 'su', relatedSub: 'routine pratiche di IA per liberi professionisti e PMI svizzeri.',
  },
};

const LOCALES = { en: 'en-US', de: 'de-CH', fr: 'fr-CH', it: 'it-CH' };

// Resolved content for a post in a language (falls back to EN when untranslated).
function T(lang, p) {
  if (lang === 'en') return { title: p.title, excerpt: p.excerpt, body: p.body };
  const tr = TRANS[lang] && TRANS[lang][p.slug];
  return tr ? { title: tr.title, excerpt: tr.excerpt, body: tr.body } : { title: p.title, excerpt: p.excerpt, body: p.body };
}

function dateLabel(lang, iso) {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString(LOCALES[lang], { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function decodeTitleEntities(value) {
  const named = { auml: 'ä', Auml: 'Ä', ouml: 'ö', Ouml: 'Ö', uuml: 'ü', Uuml: 'Ü',
    eacute: 'é', Eacute: 'É', rsquo: '’', lsquo: '‘', mdash: '—', ndash: '–', amp: '&',
    apos: "'", quot: '"', nbsp: ' ' };
  return String(value).replace(/&(#x[\\da-f]+|#\\d+|[a-z]+);/gi, (entity, code) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : entity;
    }
    return Object.prototype.hasOwnProperty.call(named, code) ? named[code] : entity;
  });
}

function slugifyTitle(title) {
  return decodeTitleEntities(title)
    .replace(/&/g, ' and ')
    .replace(/ß/g, 'ss')
    .replace(/æ/g, 'ae')
    .replace(/œ/g, 'oe')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
    .replace(/-+$/g, '');
}

// URLs use the translated post title, while the source post keeps one stable
// internal slug for joining EN/DE/FR/IT content and building hreflang links.
function localizedSlug(lang, sourceSlug) {
  const p = allPosts.find(post => post.slug === sourceSlug);
  if (!p) return sourceSlug;
  return slugifyTitle(T(lang, p).title) || sourceSlug;
}

function urlFor(lang, sourceSlug) {
  const s = sourceSlug ? localizedSlug(lang, sourceSlug) + '/' : '';
  return lang === 'en' ? `/blog/${s}` : `/blog/${lang}/${s}`;
}

function legacyUrlFor(lang, sourceSlug) {
  const s = sourceSlug ? sourceSlug + '/' : '';
  return lang === 'en' ? `/blog/${s}` : `/blog/${lang}/${s}`;
}

const BASE = 'https://facturio.ch';
const HREFLANG = { en: 'en', de: 'de-CH', fr: 'fr-CH', it: 'it-CH' };

function headLinks(lang, active) {
  const s = active === 'index' ? null : active;
  const alt = ['en', 'de', 'fr', 'it'].map(l =>
    `<link rel="alternate" hreflang="${HREFLANG[l]}" href="${BASE}${urlFor(l, s)}"/>`).join('');
  const xd = `<link rel="alternate" hreflang="x-default" href="${BASE}${urlFor('en', s)}"/>`;
  const canonical = `<link rel="canonical" href="${BASE}${urlFor(lang, s)}"/>`;
  return alt + xd + canonical;
}

function switcher(lang, slug) {
  const CODE = { en: 'EN', de: 'DE', fr: 'FR', it: 'IT' };
  const NM = { en: 'English', de: 'Deutsch', fr: 'Français', it: 'Italiano' };
  const items = ['en', 'de', 'fr', 'it'].map(l =>
    `<a href="${urlFor(l, slug)}"${l === lang ? ' class="active"' : ''}>${CODE[l]} ${NM[l]}</a>`).join('');
  return `<span class="langs">
    <span class="lang-dd">
      <button class="lang-btn" type="button" aria-haspopup="true" aria-expanded="false" onclick="var m=this.nextElementSibling;var o=m.classList.toggle('open');this.setAttribute('aria-expanded',o?'true':'false');">${CODE[lang]} <span class="chev">▾</span></button>
      <span class="lang-menu">${items}</span>
    </span>
  </span>`;
}

function headMeta(lang, active) {
  const u = UI[lang];
  const isIndex = active === 'index';
  const p = isIndex ? null : allPosts.find(x => x.slug === active);
  const title = isIndex ? u.indexTitle : `${T(lang, p).title} — facturio.ch`;
  const desc = isIndex ? u.blogDesc : T(lang, p).excerpt;
  const url = BASE + urlFor(lang, isIndex ? null : active);
  const og = `<meta property="og:type" content="${isIndex ? 'website' : 'article'}"/>
<meta property="og:site_name" content="facturio.ch"/>
<meta property="og:title" content="${title}"/>
<meta property="og:description" content="${desc}"/>
<meta property="og:url" content="${url}"/>
<meta property="og:locale" content="${LOCALES[lang]}"/>
<meta property="og:image" content="${BASE}/assets/og-facturio.png"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${title}"/>
<meta name="twitter:description" content="${desc}"/>
<meta name="twitter:image" content="${BASE}/assets/og-facturio.png"/>`;
  const langName = lang === 'en' ? 'en' : lang + '-CH';
  let ld;
  if (isIndex) {
    ld = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'facturio.ch',
      url: BASE + '/',
      description: u.blogDesc,
      inLanguage: langName
    });
  } else {
    const c = T(lang, p);
    ld = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: c.title,
      description: c.excerpt,
      datePublished: p.date,
      dateModified: p.date,
      inLanguage: langName,
      author: { '@type': 'Organization', name: 'facturio.ch' },
      publisher: { '@type': 'Organization', name: 'facturio.ch' },
      mainEntityOfPage: url
    });
  }
  return og + '\n<script type="application/ld+json">' + ld + '</script>';
}

function header(lang, active) {
  const u = UI[lang];
  const isIndex = active === 'index';
  const title = isIndex
    ? u.indexTitle
    : `${T(lang, allPosts.find(p => p.slug === active)).title} — facturio.ch`;
  const desc = isIndex ? u.blogDesc : T(lang, allPosts.find(p => p.slug === active)).excerpt;
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${title}</title>
<meta name="description" content="${desc}"/>
${headLinks(lang, active)}
${headMeta(lang, active)}
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"/>
<link rel="stylesheet" href="/blog/blog.css"/>
<style>
.langs{margin-left:26px}
.lang-flags{display:none;align-items:center;gap:4px}
.lang-flags a{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;opacity:.45;padding:2px 3px;border-radius:6px;border:1px solid transparent}
.lang-flags a:hover{opacity:.9}
.lang-flags a.active{opacity:1;border-color:#4f46e5}
.lang-dd{position:relative;display:inline-block}
.lang-btn{display:inline-flex;align-items:center;gap:4px;font-size:16px;line-height:1;background:none;border:1px solid #e5e7eb;border-radius:8px;padding:6px 8px;cursor:pointer}
.lang-btn .chev{font-size:9px;color:#6b7280}
.lang-menu{display:none;position:absolute;right:0;top:calc(100% + 6px);min-width:150px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;box-shadow:0 10px 25px rgba(0,0,0,.10);padding:6px;z-index:60;text-align:left}
.lang-menu.open{display:block}
.lang-menu a{display:flex;align-items:center;gap:8px;padding:8px 10px;font-size:14px;color:#374151;text-decoration:none;border-radius:6px}
.lang-menu a:hover{background:#f3f4f6}
.lang-menu a.active{font-weight:600}
@media(min-width:640px){.lang-flags{display:none}.lang-dd{display:inline-block}}
@media(max-width:640px){header.site .inner{padding:12px 16px}header.site nav a{margin-left:14px}header.site .logo{font-size:1.15rem;white-space:nowrap}.langs{margin-left:14px}.btn{padding:8px 14px}}
</style>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KVC3DC5J');</script>
<!-- End Google Tag Manager -->
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-9PFMBN2Z6X"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-9PFMBN2Z6X');
</script>
<!-- End Google Analytics -->
</head>
<body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KVC3DC5J"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
<header class="site">
  <div class="inner">
    <a href="/" class="logo grad">facturio.ch</a>
    <nav>
      <a href="${urlFor(lang, null)}">${u.blog}</a>
      <a href="https://app.facturio.ch/login" class="btn">${u.signin}</a>
      ${switcher(lang, active === 'index' ? null : active)}
    </nav>
  </div>
</header>`;
}

function footer(lang) {
  const u = UI[lang];
  return `<footer class="site">
  <div class="inner">
    <span class="copy">${u.footerCopy}</span>
    <span class="copy"><a href="https://strongwinds.ch" style="text-decoration:underline;text-underline-offset:2px">strongwinds.ch</a></span>
    <a href="https://app.facturio.ch/login" class="grad" style="font-weight:600">${u.footerStart}</a>
  </div>
</footer>
<script>document.addEventListener('click',function(e){if(!e.target.closest('.lang-dd')){var m=document.querySelector('.lang-menu.open');if(m){m.classList.remove('open');var b=m.previousElementSibling;if(b)b.setAttribute('aria-expanded','false');}}});</script>
</body>
</html>`;
}

function cta(lang) {
  const u = UI[lang];
  return `<div class="cta">
  <h3>${u.ctaTitle}</h3>
  <p>${u.ctaSub}</p>
  <a href="https://app.facturio.ch/login" class="btn">${u.startFree}</a>
</div>`;
}

// --- build pages ---
function buildIndex(lang) {
  const u = UI[lang];
  const listItems = allPosts.map(p => `
  <a class="post-card" href="${urlFor(lang, p.slug)}">
    <div class="date">${dateLabel(lang, p.date)}</div>
    <h2>${T(lang, p).title}</h2>
    <p>${T(lang, p).excerpt}</p>
  </a>`).join('');
  return header(lang, 'index') + `
<main class="blog">
  <div class="container">
    <h1 class="page-title">${u.indexTitle}</h1>
    <p class="page-sub">${u.indexSub}</p>
    <div class="post-list">${listItems}</div>
    <nav class="pagination" aria-label="Blog pages">
      <button id="pg-prev" class="pg-btn" type="button">&larr; ${u.newer}</button>
      <span id="pg-info" class="pg-info"></span>
      <button id="pg-next" class="pg-btn" type="button">${u.older} &rarr;</button>
    </nav>
  </div>
</main>
<script>
(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll('.post-list .post-card'));
  function perPage() { return window.innerWidth >= 768 ? 20 : 10; }
  var page = 1;
  function totalPages() { return Math.max(1, Math.ceil(cards.length / perPage())); }
  function render() {
    var pp = perPage();
    var start = (page - 1) * pp;
    cards.forEach(function (c, i) { c.style.display = (i >= start && i < start + pp) ? '' : 'none'; });
    document.getElementById('pg-info').textContent = '${u.page} ' + page + ' ${u.of} ' + totalPages();
    document.getElementById('pg-prev').disabled = page <= 1;
    document.getElementById('pg-next').disabled = page >= totalPages();
  }
  document.getElementById('pg-prev').addEventListener('click', function () { if (page > 1) { page--; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); } });
  document.getElementById('pg-next').addEventListener('click', function () { if (page < totalPages()) { page++; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); } });
  var t;
  window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(function () { if (page > totalPages()) page = totalPages(); render(); }, 100); });
  render();
})();
</script>` + footer(lang);
}

function buildPost(lang, p) {
  const u = UI[lang];
  const c = T(lang, p);
  return header(lang, p.slug) + `
<main class="blog">
  <div class="container">
    <a class="breadcrumb" href="${urlFor(lang, null)}">${u.breadcrumb}</a>
    <article class="post">
      <h1>${c.title}</h1>
      <div class="meta">${dateLabel(lang, p.date)} · facturio.ch</div>
      ${c.body}
      ${cta(lang)}
    </article>
  </div>
</main>` + footer(lang);
}

// Validate localized slugs before touching generated output.
const languages = ['en', 'de', 'fr', 'it'];
const currentPaths = new Set();
for (const lang of languages) {
  const seen = new Map();
  for (const p of allPosts) {
    const slug = localizedSlug(lang, p.slug);
    if (seen.has(slug)) {
      throw new Error(`Localized slug collision (${lang}): ${p.slug} and ${seen.get(slug)} -> ${slug}`);
    }
    seen.set(slug, p.slug);
    currentPaths.add(urlFor(lang, p.slug));
  }
}

// The blog directory is generated output. Remove old post directories first so
// obsolete shared-language slugs cannot remain live beside the localized URLs.
fs.mkdirSync(BLOG, { recursive: true });
for (const entry of fs.readdirSync(BLOG, { withFileTypes: true })) {
  if (entry.isDirectory()) fs.rmSync(path.join(BLOG, entry.name), { recursive: true, force: true });
}

// Preserve every former shared-slug URL with a permanent redirect. Refuse to
// create a redirect that would shadow a current localized page.
const redirects = [];
for (const lang of languages) {
  for (const p of allPosts) {
    const oldPath = legacyUrlFor(lang, p.slug);
    const newPath = urlFor(lang, p.slug);
    if (oldPath === newPath) continue;
    if (currentPaths.has(oldPath)) {
      throw new Error(`Legacy redirect would shadow a localized page: ${oldPath}`);
    }
    redirects.push(`${oldPath} ${newPath} 301`);
  }
}
fs.writeFileSync(path.join(DIR, '_redirects'), redirects.join('\n') + '\n');

// English -> root (/blog/, /blog/<localized-title>/)
fs.writeFileSync(path.join(BLOG, 'index.html'), buildIndex('en'));
for (const p of allPosts) {
  const dir = path.join(BLOG, localizedSlug('en', p.slug));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), buildPost('en', p));
}

// German + French + Italian -> /blog/de/, /blog/fr/, /blog/it/
for (const lang of ['de', 'fr', 'it']) {
  fs.mkdirSync(path.join(BLOG, lang), { recursive: true });
  fs.writeFileSync(path.join(BLOG, lang, 'index.html'), buildIndex(lang));
  for (const p of allPosts) {
    const dir = path.join(BLOG, lang, localizedSlug(lang, p.slug));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), buildPost(lang, p));
  }
}

// ---------------------------------------------------------------------------
// Guard: /blog/blog.css must stay a FILE, never a directory.
//
// A previous "restore from live deployment" import created de/blog/blog.css/,
// fr/blog/blog.css/ and it/blog/blog.css/ as DIRECTORIES (each holding an
// index.html). Cloudflare Pages then resolved /de/blog/blog.css to the
// directory, 308-redirected to /de/blog/blog.css/, and served HTML with
// `content-type: text/html` — so every legacy-tree page lost its stylesheet.
//
// Fail the build loudly if that shape ever comes back.
// ---------------------------------------------------------------------------
const cssFile = path.join(BLOG, 'blog.css');
if (fs.existsSync(cssFile) && !fs.statSync(cssFile).isFile()) {
  throw new Error(
    `blog.css must be a file, but ${cssFile} is a directory. ` +
    `Remove it (git rm -r) — it shadows the stylesheet and breaks every blog page.`
  );
}
for (const lang of ['de', 'fr', 'it']) {
  const shadow = path.join(BLOG, lang, 'blog.css');
  if (fs.existsSync(shadow)) {
    throw new Error(
      `Stray ${shadow} shadows the stylesheet. Blog pages must link /blog/blog.css.`
    );
  }
}

console.log('Wrote', allPosts.length, 'posts x 4 localized URL languages + indexes to', BLOG);
console.log('Wrote', redirects.length, 'legacy URL redirects to', path.join(DIR, '_redirects'));
