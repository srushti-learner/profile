import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const screenshotDir = process.env.PORTFOLIO_SCREENSHOT_DIR ?? 'test-results';

test('desktop content, navigation, case studies and accessibility', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('./');
  await expect(page).toHaveTitle('Srushti Borate — Software Engineer');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Srushti Borate.');
  await expect(page.locator('.hero .founding-role')).toBeInViewport({ ratio: 1 });
  expect(await page.locator('.hero .founding-role').evaluate((element) => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(28);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await expect(page.getByRole('link', { name: 'Skip to content' })).toHaveCSS('opacity', '1');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
  await expect(page.locator('#main')).toBeFocused();
  await expect(page.getByRole('link', { name: 'Skip to content' })).toHaveCSS('opacity', '0');
  await expect(page.locator('.hero-socials').getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.com/srushti-learner');
  await expect(page.locator('.hero-socials').getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('href', 'https://www.linkedin.com/in/srushti-borate-b1000020a/');
  await page.getByRole('link', { name: 'Work', exact: true }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.getByRole('link', { name: 'Work', exact: true })).toHaveAttribute('aria-current', 'location');
  const disclosure = page.getByText('Behind the work', { exact: false }).first();
  await disclosure.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('details').first()).toHaveAttribute('open', '');
  await expect(page.getByText('The problem', { exact: true }).first()).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.locator('details').first()).not.toHaveAttribute('open');
  for (const link of await page.locator('a[href^="#"]').all()) {
    const href = await link.getAttribute('href');
    expect(await page.locator(href!).count()).toBe(1);
  }
  await expect(page.getByRole('link', { name: 'View résumé', exact: true })).toHaveAttribute('href', '/profile/resume/');
  await expect(page.getByRole('link', { name: 'Email Srushti Borate' })).toHaveAttribute('href', 'mailto:srushtiborate100@gmail.com');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('./');
  await page.waitForTimeout(800);
  await page.locator('#main').focus();
  await mkdir(screenshotDir, { recursive: true });
  await page.screenshot({ path: path.join(screenshotDir, 'portfolio-desktop.png'), fullPage: false });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.screenshot({ path: path.join(screenshotDir, 'portfolio-full.png'), fullPage: true });
  await page.locator('#work').screenshot({ path: path.join(screenshotDir, 'portfolio-discovery.png') });
});

test('Discovery highlights separate product context from personal contributions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await expect(page.locator('.hero .founding-role strong')).toHaveText('One of the founding engineers of Microsoft Discovery.');
  await expect(page.locator('#work .section-heading')).toContainText('My work as a founding engineer.');
  await expect(page.locator('.hero-meta .eyebrow').first()).toHaveText('SOFTWARE ENGINEER AT MICROSOFT');
  await expect(page.locator('.build-highlight')).toContainText('ANNOUNCED AT MICROSOFT BUILD');
  const platform = page.getByRole('article', { name: 'Microsoft Discovery', exact: true });
  const app = page.getByRole('article', { name: 'Microsoft Discovery App', exact: true });
  await expect(platform.locator('.product-context')).toContainText('Azure-based platform');
  await expect(platform.getByRole('heading', { name: 'My contributions', exact: true })).toBeVisible();
  await expect(platform.locator('.contributions li')).toHaveText([
    'CI/CD automation for product delivery',
    'API authentication and authorization',
    'Admin APIs for privileged operational access',
    'MCP server exposing selected product APIs',
  ]);
  await expect(platform.getByRole('link', { name: /product overview/ })).toHaveAttribute('href', 'https://learn.microsoft.com/en-us/azure/microsoft-discovery/concept-discovery-and-discovery-app');
  await expect(platform.getByRole('link', { name: /Build announcement/ })).toHaveAttribute('href', /^https:\/\/azure\.microsoft\.com\/en-us\/blog\//);
  await page.getByRole('tab', { name: /Local app/ }).click();
  await expect(app.locator('.product-context')).toContainText('desktop experience');
  await expect(app.locator('.contributions li')).toHaveText([
    'Cross-platform AI desktop delivery',
    'MCP developer tooling',
    'Provider-aware telemetry',
  ]);
  await expect(app.getByRole('link', { name: /product overview/ })).toHaveAttribute('href', 'https://learn.microsoft.com/en-us/azure/microsoft-discovery/concept-discovery-and-discovery-app');
  await expect(app.getByRole('link', { name: /Build announcement/ })).toHaveAttribute('href', /^https:\/\/azure\.microsoft\.com\/en-us\/blog\//);
  await expect(page.locator('main')).not.toContainText(/Satya|sole author|presented the keynote/i);
});

test('mobile layout, navigation and accessibility', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await expect(page.locator('.hero .founding-role')).toBeInViewport({ ratio: 1 });
  expect(await page.locator('.hero .founding-role').evaluate((element) => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(22);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('dialog').getByRole('link', { name: /Beyond the code/ }).click();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.locator('#about-title')).toBeInViewport();
  await expect(page.locator('.about-copy')).toContainText('Outside of work, I’m a gym enthusiast and always up for a game of badminton or table tennis, or a swim. I also love travelling.');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.goto('./');
  await mkdir(screenshotDir, { recursive: true });
  await page.screenshot({ path: path.join(screenshotDir, 'portfolio-mobile.png'), fullPage: true });
  await page.screenshot({ path: path.join(screenshotDir, 'portfolio-mobile-hero.png') });
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('./');
  await expect(page.locator('.hero .founding-role')).toBeInViewport({ ratio: 1 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('reduced motion and content without JavaScript', async ({ browser, page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  expect(await page.locator('h1 span').first().evaluate((element) => getComputedStyle(element).animationName)).toBe('none');
  expect(await page.locator('html').evaluate((element) => getComputedStyle(element).scrollBehavior)).toBe('auto');
  const context = await browser.newContext({ javaScriptEnabled: false });
  const noJsPage = await context.newPage();
  await noJsPage.goto('http://localhost:4321/profile/');
  await expect(noJsPage.getByRole('heading', { level: 1 })).toBeVisible();
  await noJsPage.locator('summary').first().click();
  await expect(noJsPage.getByText('The problem', { exact: true }).first()).toBeVisible();
  await expect(noJsPage.locator('.reveal-ready')).toHaveCount(0);
  await expect(noJsPage.getByRole('link', { name: 'View résumé', exact: true })).toHaveAttribute('href', '/profile/resume/');
  await expect(noJsPage.getByRole('article', { name: 'Microsoft Discovery', exact: true })).toBeVisible();
  await expect(noJsPage.getByRole('article', { name: 'Microsoft Discovery App', exact: true })).toBeVisible();
  await expect(noJsPage.locator('.work-switcher')).toBeHidden();
  await noJsPage.setViewportSize({ width: 390, height: 844 });
  await expect(noJsPage.getByRole('link', { name: 'Work', exact: true })).toBeVisible();
  await noJsPage.getByRole('link', { name: 'Work', exact: true }).click();
  await expect(noJsPage).toHaveURL(/#work$/);
  await context.close();
});

test('complete graduation photo retains its natural proportions on desktop and mobile', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await mkdir(screenshotDir, { recursive: true });
  for (const [label, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]] as const) {
    await page.setViewportSize({ width, height });
    await page.goto('./#profile-photo');
    const portrait = page.getByRole('img', { name: 'Srushti Borate at her IIT Roorkee graduation, with the campus building behind her' });
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
    await expect(page.locator('.portrait-placeholder')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.locator('#about').screenshot({ path: path.join(screenshotDir, `portfolio-about-${label}.png`) });
    await page.locator('.hero-portrait').screenshot({ path: path.join(screenshotDir, `portfolio-portrait-${label}.png`) });
  }
});

test('product switcher supports keyboard navigation and independent disclosures', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#work');
  const enterprise = page.getByRole('tab', { name: /Enterprise platform/ });
  const app = page.getByRole('tab', { name: /Local app/ });
  await expect(enterprise).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#panel-discovery-app')).toBeHidden();
  await enterprise.focus();
  await page.keyboard.press('ArrowRight');
  await expect(app).toBeFocused();
  await expect(app).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#panel-discovery-platform')).toBeHidden();
  await expect(page.locator('#panel-discovery-app')).toBeVisible();
  await page.locator('#panel-discovery-app summary').click();
  await expect(page.locator('#panel-discovery-app details')).toHaveAttribute('open', '');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await app.focus();
  await page.keyboard.press('Home');
  await expect(enterprise).toBeFocused();
  await page.keyboard.press('End');
  await expect(app).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(enterprise).toBeFocused();
  await page.locator('#projects summary').first().click();
  await expect(page.locator('#projects details').first()).toHaveAttribute('open', '');
  await expect(page.locator('#projects .project-body').first()).toBeVisible();
});

test('theme works, persists, respects initial system preference and remains accessible', async ({ page, browser }) => {
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
  await page.goto('./');
  const toggle = page.getByRole('button', { name: 'Use dark theme' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('button', { name: 'Use light theme' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#141d19');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await mkdir(screenshotDir, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator('#main').focus();
  await page.screenshot({ path: path.join(screenshotDir, 'portfolio-dark-desktop.png') });
  await page.getByRole('tab', { name: /Local app/ }).click();
  await page.locator('#main').focus();
  await page.locator('#work').screenshot({ path: path.join(screenshotDir, 'portfolio-dark-discovery-app.png') });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.work-card:visible').screenshot({ path: path.join(screenshotDir, 'portfolio-dark-mobile-work.png') });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.goto('./resume/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  const systemContext = await browser.newContext({ colorScheme: 'dark' });
  const systemPage = await systemContext.newPage();
  await systemPage.goto('http://localhost:4321/profile/');
  await expect(systemPage.locator('html')).toHaveAttribute('data-theme', 'dark');
  await systemPage.getByRole('button', { name: 'Use light theme' }).click();
  await expect(systemPage.locator('html')).toHaveAttribute('data-theme', 'light');
  await systemContext.close();
});

test('menu traps keyboard focus, closes on Escape and navigates on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  const toggle = page.getByRole('button', { name: 'Menu' });
  await toggle.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Close menu' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('link', { name: 'View résumé', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: 'Close menu' })).toBeFocused();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await dialog.getByRole('link', { name: /Selected work/ }).click();
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/#work$/);
  for (const width of [320, 390, 760, 820, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test('public résumé, print action and local assets', async ({ page }) => {
  const failures: string[] = [];
  page.on('pageerror', (error) => failures.push(error.message));
  page.on('response', (response) => { if (response.status() >= 400) failures.push(response.url()); });
  await page.goto('./resume/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Srushti Borate');
  await expect(page.locator('.resume')).not.toContainText('Outside of work');
  await expect(page.locator('.resume img')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Software Engineer · Microsoft', exact: true })).toBeVisible();
  await expect(page.locator('#resume-experience').locator('..')).toContainText('One of the founding engineers of Microsoft Discovery.');
  await expect(page.getByRole('heading', { name: 'Microsoft Discovery', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Microsoft Discovery App', exact: true })).toBeVisible();
  await expect(page.locator('.resume-highlight').first()).toContainText('Admin APIs for privileged operational access');
  await expect(page.locator('.resume-highlight').last()).toContainText(/provider-aware telemetry/i);
  await page.evaluate(() => {
    window.print = () => document.body.setAttribute('data-print-called', 'true');
  });
  await page.getByRole('button', { name: 'Print / Save PDF' }).click();
  await expect(page.locator('body')).toHaveAttribute('data-print-called', 'true');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.resume-toolbar')).toBeHidden();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.goto('./');
  expect(failures).toEqual([]);
});
