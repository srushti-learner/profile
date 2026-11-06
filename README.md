# Srushti Borate — portfolio

A static, mobile-first Astro and TypeScript portfolio. No backend, paid service,
external font request, or analytics is required.

This adaptation uses the actual [DevPortfolio source by Ryan Fitzgerald](https://github.com/RyanFitzgerald/devportfolio),
pinned at `852d650fb0a8cf0c98f874af5a56a0a9b7d7d4b7`. Its Astro components,
grid-backed introduction, monospace typography, two-column sections, project
cards and experience timeline form the design foundation. The original MIT
notice is retained in `LICENSE.md`; embedded Tabler icons are covered by
`TABLER-LICENSE.md`. Attribution also appears in the footer.

Customizations include a dark-default charcoal/teal palette, optional light
toggle, mobile navigation, founding-engineer highlight, Discovery case studies,
full graduation photo and printable résumé. Tailwind CSS v4 is used with the
existing Astro version. The font is a local system monospace stack.
Dark is the default even with a light system preference or JavaScript disabled.
An explicitly selected theme is saved under `devportfolio-theme` in local storage.
Motion is finite, reduced motion is respected, and text is never hidden while
waiting for animation. Without JavaScript, navigation, both Discovery products
and native case-study disclosures remain usable.

GitHub and LinkedIn contact links navigate in the same tab so they do not depend
on popup/new-tab support in an embedded preview. LinkedIn may require sign-in.
Email links use `mailto:` and require a configured email app; some embedded
previews cannot launch it. The email address is also shown as selectable text
in the footer.

## Local development

Use Node.js 24.

```sh
npm ci
npm run dev
```

Open `http://localhost:4321/profile/`. To check the production site:

```sh
npm run build
npm run preview
```

## Content and portrait

Edit `src/data/profile.ts` for experience, projects, case studies, and contact links.
The featured Microsoft Discovery section separates public product context (linked
Microsoft announcements and documentation) from personal engineering contributions.
Its contribution summaries are also used by the printable résumé. Keep that
distinction when editing; product milestones are not individual achievements.
Template configuration and About copy live in `src/config.ts`, which maps the
shared approved data into the upstream configuration shape. Theme colors live
in `src/styles/global.css`. The graduation portrait in
`src/assets/srushti-graduation.webp` is an optimized, metadata-free copy of the
complete user-provided photo, including the campus background. Astro generates
responsive image sizes; explicit dimensions reserve space to prevent layout shift.
Keep the natural 3:4 proportions and automatic height on desktop and mobile:
do not crop the asset or use a fixed-height cover treatment. When replacing the
image, strip metadata and update its alt text and dimensions.
The printable résumé intentionally remains photo-free.

`/profile/resume/` is a public-safe résumé with a Print / Save PDF action. The
uploaded source résumé is deliberately not included in the repository or site.
Review all new copy before publication; do not add internal architecture,
operational details, private contact information, or unsupported metrics.

## Checks

```sh
npx playwright install chromium
npm test
```

The browser suite checks the production site at desktop and mobile sizes,
keyboard navigation, anchors, case studies, résumé printing, reduced motion,
JavaScript-disabled content, dark default, theme persistence, the mobile menu,
uncropped photo proportions, and automated accessibility. Screenshots are saved
under `test-results/` (or `PORTFOLIO_SCREENSHOT_DIR` when set).

## GitHub Pages

The public portfolio uses `https://srushti-learner.github.io/profile/`.
GitHub Pages is configured to deploy through GitHub Actions, with HTTPS enforced.
The workflow in `.github/workflows/pages.yml` builds and deploys changes pushed
to `main`; it can also be run manually from the repository's Actions tab.

To publish an update:

1. Review the content and run the local checks above.
2. Push the approved changes to `main`.
3. Wait for the Pages workflow to succeed, then check its deployment URL and
   verify the public site, photo, and résumé.

No deployment or pull request is needed to review locally. If a custom domain
or another host is selected, update `site` and `base` in `astro.config.mjs` and
recheck all links. Do not copy the source résumé into `public/`.
