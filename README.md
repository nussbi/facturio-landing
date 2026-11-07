# facturio-landing

Static marketing site, localized homepages and SEO blog for **facturio.ch**, deployed on Cloudflare Pages.

## Unified design

The 2026-11-07 refresh follows the user-provided Base44 reference: Inter typography, the receipt logo, indigo/blue/cyan gradients, white cards and consistent spacing. Reference illustrations and fonts are self-hosted. No Base44 runtime, badge or backend is embedded.

- `assets/facturio-brand.css`: shared navigation, footer, typography and responsive editorial styling.
- `assets/reference-design.css`: reference-derived homepage presentation.
- `assets/header-block.js`: accessible language/mobile menus, staging destinations and FAQ accordion behavior.
- `assets/facturio-logo.svg`, `assets/inter-latin.woff2`, `assets/reference-qr-*.svg`: self-hosted assets.
- Root and EN/DE/FR/IT homepages: fully rendered localized content; the data-export FAQ is marked Coming soon.

All 1,176 existing HTML pages share the design. Existing article text, canonical URLs and structured data remain; invalid language alternates are repaired using verified counterpart pages.

## Analytics and publishing

GA4 `G-9PFMBN2Z6X` remains present on every HTML page. GTM `GTM-KVC3DC5J` is retained. `_redirects` preserves legacy localized legal URLs and application aliases. Staging navigation stays on staging domains.

`assets/design-manifest.json` records source paths and SHA256 checksums. `assets/deployment-redirects.txt` is the source copy of the Cloudflare-reserved redirects file. The manual source-sync workflow accepts only immutable Facturio Pages deployment hosts, verifies every file checksum, and aborts on concurrent repository changes before committing the deployed source.

The separate application Worker handles authentication, signing and private customer portals. The original blog generator still requires missing `scripts/posts.js` and translation modules; those inputs are not recreated or guessed here.
