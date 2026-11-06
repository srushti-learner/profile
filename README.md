# Srushti Borate — portfolio

A static, mobile-first Astro and TypeScript portfolio. No backend, paid service,
external font request, or analytics is required.

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
Intro and about copy live in `src/pages/index.astro`. The graduation portrait in
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
JavaScript-disabled content, and automated accessibility. Screenshots are saved
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
