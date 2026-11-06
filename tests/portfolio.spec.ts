import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const screenshotDir = process.env.PORTFOLIO_SCREENSHOT_DIR ?? 'test-results';
const foundingRole = 'One of the founding engineers of Microsoft Discovery.';
const photoAlt = 'Srushti Borate at her IIT Roorkee graduation, with the campus building behind her';

test('social profile clicks and keyboard activation navigate without a popup', async ({ page }) => {
  const popups: string[] = [];
  page.on('popup', () => popups.push('Unexpected popup'));
  const destinations = [
    { name: 'GitHub', url: 'https://github.com/srushti-learner' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/srushti-borate-b1000020a/' },
  ];
  for (const destination of destinations) {
    await page.route(destination.url, (route) => route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: `<!doctype html><html lang="en"><title>Profile destination</title><h1>${destination.name} destination</h1></html>`,
    }));
    for (const section of ['#hero', 'footer']) {
      await page.goto('./');
      const link = page.locator(section).getByRole('link', { name: destination.name, exact: true });
      await expect(link).not.toHaveAttribute('target');
      if (section === '#hero') await link.click();
      else {
        await link.focus();
        await page.keyboard.press('Enter');
      }
      await expect(page).toHaveURL(destination.url);
      await expect(page.getByRole('heading', { name: `${destination.name} destination` })).toBeVisible();
    }
  }
  expect(popups).toEqual([]);
});

test('copy email writes actual clipboard contents and announces successful keyboard activation', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://localhost:4321' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('./');
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  for (const section of ['#hero', 'footer']) {
    const contact = page.locator(`${section} [data-email-contact]`);
    const button = contact.getByRole('button', { name: 'Copy email', exact: true });
    await expect(button).toBeVisible();
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(contact.getByRole('status')).toHaveText('Email copied.');
    await expect(contact.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    await expect(contact.getByRole('status')).toHaveAttribute('aria-atomic', 'true');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('srushtiborate100@gmail.com');
    await expect(button).toBeEnabled();
    await expect(contact.locator('[data-email-address]')).toBeVisible();
  }
  await page.goto('./');
  await page.locator('#hero').getByRole('button', { name: 'Copy email', exact: true }).click();
  await expect(page.locator('#hero-email-status')).toHaveText('Email copied.');
  await mkdir(screenshotDir, { recursive: true });
  await page.screenshot({ path: path.join(screenshotDir, 'devportfolio-copy-email.png') });
});

test('copy email denial shows explicit fallback without claiming success or overlapping content', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    Object.defineProperty(navigator.clipboard, 'writeText', {
      value: () => Promise.reject(new DOMException('Clipboard access denied', 'NotAllowedError')),
    });
  });
  await page.goto('./');
  for (const section of ['#hero', 'footer']) {
    const contact = page.locator(`${section} [data-email-contact]`);
    await contact.getByRole('button', { name: 'Copy email', exact: true }).click();
    await expect(contact.getByRole('status')).toHaveText('Could not copy automatically. Select and copy the email address below.');
    await expect(contact.getByRole('status')).not.toContainText('Email copied.');
    await expect(contact.locator('[data-email-address]')).toHaveText('srushtiborate100@gmail.com');
    await expect(contact.locator('[data-email-address]')).toHaveCSS('user-select', 'all');
    await expect(contact.getByRole('button', { name: 'Copy email', exact: true })).toBeEnabled();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const intro = await page.locator('#hero').getByText('Building AI and cloud platforms.', { exact: true }).boundingBox();
  const controls = await page.locator('#hero .social-links').boundingBox();
  expect(controls!.y).toBeGreaterThanOrEqual(intro!.y + intro!.height);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.goto('./');
  await page.locator('#hero').getByRole('button', { name: 'Copy email', exact: true }).click();
  await mkdir(screenshotDir, { recursive: true });
  await page.locator('#hero').screenshot({ path: path.join(screenshotDir, 'devportfolio-copy-fallback.png') });
});

test('unsupported and insecure clipboard leave a selectable address without a dead button', async ({ browser }) => {
  for (const reason of ['unsupported', 'insecure']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await context.addInitScript((mode) => {
      if (mode === 'unsupported') Object.defineProperty(navigator, 'clipboard', { value: undefined });
      else Object.defineProperty(window, 'isSecureContext', { value: false });
    }, reason);
    const page = await context.newPage();
    await page.goto('http://localhost:4321/profile/');
    await expect(page.getByRole('button', { name: 'Copy email', exact: true })).toHaveCount(0);
    for (const section of ['#hero', 'footer']) {
      const contact = page.locator(`${section} [data-email-contact]`);
      await expect(contact.getByRole('status')).toHaveText('Automatic copying is unavailable here. Select and copy the address below.');
      await expect(contact.locator('[data-email-address]')).toBeVisible();
    }
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
    await context.close();
  }
});

test('copy email never reports success before the clipboard promise resolves', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator.clipboard, 'writeText', {
      value: () => new Promise<void>((resolve) => {
        document.addEventListener('complete-email-copy', () => resolve(), { once: true });
      }),
    });
  });
  await page.goto('./');
  const button = page.locator('#hero').getByRole('button', { name: 'Copy email', exact: true });
  await button.click();
  await expect(button).toBeDisabled();
  await expect(button).toHaveAttribute('aria-busy', 'true');
  await expect(page.locator('#hero-email-status')).toHaveText('Copying email...');
  await expect(page.locator('#hero-email-status')).not.toContainText('Email copied.');
  await page.evaluate(() => document.dispatchEvent(new Event('complete-email-copy')));
  await expect(page.locator('#hero-email-status')).toHaveText('Email copied.');
  await expect(button).toBeEnabled();
});

test('template introduction, keyboard navigation, anchors and accessibility', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
  await page.goto('./');
  await expect(page).toHaveTitle('Srushti Borate — Software Engineer');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText("I'm Srushti Borate");
  await expect(page.locator('#hero .founding-role')).toHaveText(foundingRole);
  await expect(page.locator('#hero .founding-role')).toBeInViewport({ ratio: 1 });
  expect(await page.locator('.founding-role').evaluate((element) => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(28);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await expect(page.getByRole('link', { name: 'Skip to content' })).toHaveCSS('opacity', '0');
  await expect(page.locator('#hero').getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/srushti-learner');
  await expect(page.locator('#hero').getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', 'https://www.linkedin.com/in/srushti-borate-b1000020a/');
  await expect(page.locator('#hero').getByRole('link', { name: /View résumé/ })).toHaveAttribute('href', '/profile/resume/');
  await page.locator('header .nav-link').filter({ hasText: /^Discovery$/ }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator('header .nav-link').filter({ hasText: /^Discovery$/ })).toHaveAttribute('aria-current', 'location');
  for (const link of await page.locator('a[href^="#"]').all()) {
    expect(await page.locator((await link.getAttribute('href'))!).count()).toBe(1);
  }
  await expect(page.getByRole('link', { name: 'Twitter' })).toHaveCount(0);
  await expect(page.locator('#experience h3')).toHaveText(['Software Engineer', 'Software Engineering Intern']);
  await expect(page.locator('#experience li')).toHaveText([
    'Engineering AI and cloud products across service foundations, desktop experiences, and reliable delivery.',
    'Worked on isolated testing for C#/.NET components using xUnit and Moq.',
  ]);
  await expect(page.locator('#experience')).toContainText('Jul 2024 — Present');
  await expect(page.locator('#experience')).not.toContainText(foundingRole);
  await expect(page.locator('#experience')).not.toContainText(/Admin APIs|four runtime targets|signed installers/);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.goto('./');
  await mkdir(screenshotDir, { recursive: true });
  await page.screenshot({ path: path.join(screenshotDir, 'devportfolio-desktop.png') });
  await page.screenshot({ path: path.join(screenshotDir, 'devportfolio-full.png'), fullPage: true });
  await page.locator('#work').screenshot({ path: path.join(screenshotDir, 'devportfolio-discovery.png'), style: '#header { visibility: hidden !important; }' });
  await page.locator('#experience').screenshot({ path: path.join(screenshotDir, 'devportfolio-experience.png'), style: '#header { visibility: hidden !important; }' });
});

test('Discovery separates both products, personal contributions and public sources', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('#hero')).toContainText('Software Engineer at Microsoft');
  await expect(page.locator('#work')).toContainText('Announced at Microsoft Build.');
  const platform = page.getByRole('article', { name: 'Microsoft Discovery', exact: true });
  const app = page.getByRole('article', { name: 'Microsoft Discovery App', exact: true });
  await expect(platform.locator('.product-context')).toContainText('Azure-based platform');
  await expect(platform.locator('.contributions li')).toHaveText([
    'CI/CD automation for product delivery',
    'API authentication and authorization, with managed identity and RBAC',
    'Controlled access to privileged Admin APIs, with cloud delivery guided by applicable security and compliance requirements',
    'MCP server exposing selected product APIs',
  ]);
  await expect(app.locator('.product-context')).toContainText('desktop experience');
  await expect(app.locator('.contributions li')).toHaveText([
    'Worked on cross-platform delivery across four runtime targets: Windows x64, Windows ARM64, macOS Apple Silicon, and RHEL Linux.',
    'Contributed to secure cross-platform releases, including signed installers and update workflows, with attention to app security and compliance requirements',
    'MCP developer tooling', 'Provider-aware telemetry',
  ]);
  for (const product of [platform, app]) {
    await expect(product.getByRole('link', { name: /product overview/ })).toHaveAttribute('href', 'https://learn.microsoft.com/en-us/azure/microsoft-discovery/concept-discovery-and-discovery-app');
    await expect(product.getByRole('link', { name: /Build announcement/ })).toHaveAttribute('href', /^https:\/\/azure\.microsoft\.com\/en-us\/blog\//);
  }
  await expect(page.locator('main')).not.toContainText(/Satya|sole author|presented the keynote/i);
  await expect(page.locator('#projects article')).toHaveCount(3);
  await expect(page.locator('#education')).toContainText('CGPA 8.55 / 10');
});

test('mobile layout, founding distinction, hobbies and menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await expect(page.locator('#hero .founding-role')).toBeInViewport({ ratio: 1 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('#mobile-menu summary').click();
  await expect(page.locator('#mobile-menu')).toHaveAttribute('open', '');
  await page.locator('#mobile-menu').getByRole('link', { name: 'About', exact: true }).click();
  await expect(page.locator('#mobile-menu')).not.toHaveAttribute('open');
  await expect(page).toHaveURL(/#about$/);
  await expect(page.locator('#about-title')).toBeInViewport();
  await expect(page.locator('.personal-interests')).toHaveText('Outside of work, I’m a gym enthusiast and always up for a game of badminton or table tennis, or a swim. I also love travelling.');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.goto('./');
  await mkdir(screenshotDir, { recursive: true });
  await page.screenshot({ path: path.join(screenshotDir, 'devportfolio-mobile.png') });
  await page.screenshot({ path: path.join(screenshotDir, 'devportfolio-mobile-full.png'), fullPage: true });
  for (const width of [320, 390, 760, 820, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('./');
  await expect(page.locator('#hero .founding-role')).toBeInViewport({ ratio: 1 });
});

test('dark default and readable interactive content without JavaScript', async ({ browser, page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  expect(await page.locator('h1').evaluate((element) => getComputedStyle(element).animationName)).toBe('none');
  expect(await page.locator('html').evaluate((element) => getComputedStyle(element).scrollBehavior)).toBe('auto');
  const context = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'light', viewport: { width: 390, height: 844 } });
  const noJsPage = await context.newPage();
  await noJsPage.goto('http://localhost:4321/profile/');
  await expect(noJsPage.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(noJsPage.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(noJsPage.getByRole('button', { name: 'Copy email', exact: true })).toHaveCount(0);
  await expect(noJsPage.locator('[data-email-address]')).toHaveText(['srushtiborate100@gmail.com', 'srushtiborate100@gmail.com']);
  await expect(noJsPage.locator('a[href^="mailto:"]')).toHaveCount(0);
  await expect(noJsPage.getByRole('button', { name: /Use light theme/ })).toHaveCount(0);
  await noJsPage.locator('#mobile-menu summary').click();
  await noJsPage.locator('#mobile-menu').getByRole('link', { name: 'Discovery', exact: true }).click();
  await expect(noJsPage).toHaveURL(/#work$/);
  await noJsPage.locator('.discovery-details summary').first().click();
  await expect(noJsPage.getByText('The problem', { exact: true }).first()).toBeVisible();
  await expect(noJsPage.getByRole('article', { name: 'Microsoft Discovery App', exact: true })).toBeVisible();
  await expect(noJsPage.locator('#hero').getByRole('link', { name: /View résumé/ })).toHaveAttribute('href', '/profile/resume/');
  await context.close();
});

test('complete graduation photo has no clipping or geometry changes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await mkdir(screenshotDir, { recursive: true });
  for (const [label, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]] as const) {
    await page.setViewportSize({ width, height });
    await page.goto('./#about');
    const portrait = page.getByRole('img', { name: photoAlt });
    await expect(portrait).toBeVisible();
    await expect.poll(() => portrait.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    await expect(portrait).toHaveAttribute('width', '1200');
    await expect(portrait).toHaveAttribute('height', '1600');
    await expect(portrait).toHaveAttribute('src', /^\/profile\/_astro\//);
    await expect(portrait).toHaveAttribute('srcset', /360w.*600w.*900w.*1200w/);
    const proportions = await portrait.evaluate(async (image: HTMLImageElement) => {
      const bounds = image.getBoundingClientRect();
      const response = await fetch(image.currentSrc);
      const bitmap = await createImageBitmap(await response.blob());
      const natural = bitmap.width / bitmap.height;
      bitmap.close();
      return { natural, rendered: bounds.width / bounds.height };
    });
    expect(proportions.natural).toBeCloseTo(3 / 4, 3);
    expect(proportions.rendered).toBeCloseTo(3 / 4, 3);
    await expect(page.locator('.portrait-frame')).toHaveCSS('overflow', 'visible');
    await page.locator('#about').screenshot({ path: path.join(screenshotDir, `devportfolio-about-${label}.png`), style: '#header { visibility: hidden !important; }' });
  }
});

test('native case studies support keyboard and independent expanded states', async ({ page }) => {
  await page.goto('./#work');
  const summaries = page.locator('.discovery-details summary');
  await summaries.first().focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.discovery-details').first()).toHaveAttribute('open', '');
  await summaries.last().click();
  await expect(page.locator('.discovery-details').last()).toHaveAttribute('open', '');
  await expect(page.locator('.discovery-details').first()).toHaveAttribute('open', '');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await summaries.first().focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.discovery-details').first()).not.toHaveAttribute('open');
});

test('dark overrides system light, explicit theme persists, both themes accessible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
  await page.addInitScript(() => localStorage.setItem('portfolio-theme', 'light'));
  await page.goto('./');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#101816');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole('button', { name: 'Use light theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.getByRole('button', { name: 'Use dark theme' })).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#fafcf9');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await mkdir(screenshotDir, { recursive: true });
  await page.screenshot({ path: path.join(screenshotDir, 'devportfolio-light-desktop.png') });
  await page.getByRole('button', { name: 'Use dark theme' }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.goto('./resume/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
});

test('mobile menu keyboard Escape restores focus and links close menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  const summary = page.locator('#mobile-menu summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#mobile-menu')).toHaveAttribute('open', '');
  await page.keyboard.press('Tab');
  await expect(page.locator('#mobile-menu').getByRole('link', { name: 'About', exact: true })).toBeFocused();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(page.locator('#mobile-menu')).not.toHaveAttribute('open');
  await expect(summary).toBeFocused();
  await summary.click();
  await page.locator('#mobile-menu').getByRole('link', { name: 'Projects' }).click();
  await expect(page.locator('#mobile-menu')).not.toHaveAttribute('open');
  await expect(page).toHaveURL(/#projects$/);
});

test('public photo-free résumé, print action, local assets and no page errors', async ({ page }) => {
  const failures: string[] = [];
  page.on('pageerror', (error) => failures.push(error.message));
  page.on('response', (response) => { if (response.status() >= 400) failures.push(response.url()); });
  await page.goto('./resume/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Srushti Borate');
  await expect(page.locator('.resume')).not.toContainText('Outside of work');
  await expect(page.locator('.resume img')).toHaveCount(0);
  await expect(page.locator('.resume-links')).toContainText('srushtiborate100@gmail.com');
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Software Engineer · Microsoft', exact: true })).toBeVisible();
  await expect(page.locator('#resume-experience').locator('..')).toContainText(foundingRole);
  await expect(page.getByRole('heading', { name: 'Microsoft Discovery', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Microsoft Discovery App', exact: true })).toBeVisible();
  await expect(page.locator('.resume-highlight').first()).toContainText('controlled access to privileged Admin APIs');
  await expect(page.locator('.resume-highlight').first()).toContainText('API authentication and authorization with managed identity and RBAC');
  await expect(page.locator('.resume-highlight').first()).toContainText('cloud delivery guided by applicable security and compliance requirements');
  await expect(page.locator('.resume-highlight').last()).toContainText(/provider-aware telemetry/i);
  await expect(page.locator('.resume-highlight').last()).toContainText('four runtime targets: Windows x64, Windows ARM64, macOS Apple Silicon, and RHEL Linux');
  await expect(page.locator('.resume-highlight').last()).toContainText('signed installers and release/update workflows with attention to app security and compliance requirements');
  await page.evaluate(() => { window.print = () => document.body.setAttribute('data-print-called', 'true'); });
  await page.getByRole('button', { name: 'Print / Save PDF' }).click();
  await expect(page.locator('body')).toHaveAttribute('data-print-called', 'true');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.resume-toolbar')).toBeHidden();
  await page.goto('./');
  expect(failures).toEqual([]);
});
