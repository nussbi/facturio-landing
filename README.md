# facturio-landing

Marketing site and SEO blog for **facturio.ch** — a static site (HTML/CSS/JS) deployed on **Cloudflare Pages**.

## Contents

```
.
├── index.html                 # Landing page (hero, dashboard preview, pricing, CTA)
├── scripts/
│   └── generate-blog.cjs      # Static blog generator (EN/DE/FR/IT, hreflang, JSON-LD, redirects)
└── content/
    └── topics.md              # SEO keyword/topic queue driving the daily blog job
```

## Landing page

Single-file `index.html` with client-side i18n (EN/DE/FR/IT), a language switcher, GTM + GA4, and JSON-LD (`SoftwareApplication`, `WebSite`, `Organization`). The shared header is injected by `/assets/header-block.js`.

## Blog generator

`scripts/generate-blog.cjs` builds the localized blog from a `posts.js` source plus `translations/{de,fr,it}.js`:

- Emits `/blog/` (EN) and `/blog/{de,fr,it}/` with **localized slugs**.
- Writes `hreflang` alternates + `x-default`, canonical, Open Graph/Twitter tags and `BlogPosting` JSON-LD.
- Generates `_redirects` (301) preserving every legacy shared-slug URL.
- Fails loudly on slug collisions or redirects that would shadow a live page.

> The generator expects `posts.js` and `translations/*.js` alongside it (not included in this snapshot). `content/topics.md` is the evergreen keyword queue the daily job consumes.

## Deploy (Cloudflare Pages)

- Build command: *(none — static)*
- Output directory: `/` (repo root)
- Custom domain: `facturio.ch`

## Security

No secrets are committed. See [SECURITY.md](./SECURITY.md).
