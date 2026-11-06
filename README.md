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
Intro and about copy live in `src/pages/index.astro`. The abstract `sb.` monogram
in the about section is an intentional portrait placeholder, not a photograph.
Replace the `.portrait-placeholder` element with an image and descriptive alt text
when a personal portrait is available; preserve the container dimensions to avoid
layout shift.

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

## GitHub Pages (prepared, not automatically published)

The site is configured for the repository path `/profile/`, with the intended
URL `https://srushti-learner.github.io/profile/`. That URL is not evidence that
deployment has happened.

When ready to publish:

1. In the repository's **Settings → Pages**, choose **GitHub Actions** as the source.
2. Push the reviewed changes to `main`. The Pages workflow builds and deploys
   the static output, or run the workflow manually after the changes reach `main`.
3. Check the workflow's deployment URL and verify the site and résumé there.

No deployment or pull request is needed to review locally. If a custom domain
or another host is selected, update `site` and `base` in `astro.config.mjs` and
recheck all links. Do not copy the source résumé into `public/`.
