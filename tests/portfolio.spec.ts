import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const screenshotDir = process.env.PORTFOLIO_SCREENSHOT_DIR ?? 'test-results';

test('desktop content, navigation, case studies and accessibility', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('./');
  await expect(page).toHaveTitle('Srushti Borate — Software Engineer');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Thoughtful code.Real-world impact.');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
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
  await expect(page.getByRole('link', { name: 'View résumé' })).toHaveAttribute('href', '/profile/resume/');
  await expect(page.getByRole('link', { name: 'Email Srushti Borate' })).toHaveAttribute('href', 'mailto:srushtiborate100@gmail.com');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('./');
  await page.waitForTimeout(800);
  await mkdir(screenshotDir, { recursive: true });
  await page.screenshot({ path: path.join(screenshotDir, 'portfolio-desktop.png'), fullPage: false });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.screenshot({ path: path.join(screenshotDir, 'portfolio-full.png'), fullPage: true });
});

test('mobile layout, navigation and accessibility', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole('link', { name: 'About', exact: true }).click();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.getByRole('heading', { name: 'An engineer. A systems thinker.' })).toBeInViewport();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.goto('./');
  await mkdir(screenshotDir, { recursive: true });
  await page.screenshot({ path: path.join(screenshotDir, 'portfolio-mobile.png'), fullPage: true });
  await page.setViewportSize({ width: 320, height: 720 });
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
  await expect(noJsPage.getByRole('link', { name: 'View résumé' })).toHaveAttribute('href', '/profile/resume/');
  await context.close();
});

test('public résumé, print action and local assets', async ({ page }) => {
  const failures: string[] = [];
  page.on('pageerror', (error) => failures.push(error.message));
  page.on('response', (response) => { if (response.status() >= 400) failures.push(response.url()); });
  await page.goto('./resume/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Srushti Borate');
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
