import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error' && /THREE|shader|WebGL/i.test(message.text())) errors.push(message.text()); });

async function loadImages() {
  const broken = await page.locator('img').evaluateAll(images => Promise.all(images.map(async image => {
    image.loading = 'eager';
    try { await image.decode(); } catch { return image.currentSrc || image.src; }
    return image.naturalWidth > 0 ? null : image.currentSrc || image.src;
  })));
  assert.deepEqual(broken.filter(Boolean), [], 'All displayed image assets should load');
}

async function checkOverflow(label) {
  const overflow = await page.evaluate(() => ({ viewport: window.innerWidth, content: document.documentElement.scrollWidth }));
  assert(overflow.content <= overflow.viewport, `${label} horizontal overflow: ${JSON.stringify(overflow)}`);
}

async function revealSections() {
  for (const section of await page.locator('[data-reveal]').all()) {
    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveCSS('opacity', '1');
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
}

try {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await expect(page.locator('.hero h1')).toHaveText(/Energy for a billion\s*possibilities\./);
  await loadImages();
  await revealSections();
  await checkOverflow('Desktop');
  const emblem = page.locator('.hero-emblem [data-animated]');
  const emblemCanvas = page.locator('.hero-emblem canvas');
  await expect(emblemCanvas).toBeVisible();
  await expect(emblem).toHaveAttribute('data-animated', 'true');
  await page.waitForTimeout(1000);
  const firstFrame = await page.screenshot();
  await page.waitForTimeout(500);
  const secondFrame = await page.screenshot();
  if (firstFrame.equals(secondFrame)) await writeFile('artifacts/animation-debug.png', secondFrame);
  assert(!firstFrame.equals(secondFrame), 'The hero 3D energy emblem should animate');
  await page.screenshot({ path: 'artifacts/desktop-hero.png' });
  await page.screenshot({ path: 'artifacts/desktop.png', fullPage: true });

  await page.getByRole('button', { name: 'Next story', exact: true }).click();
  await expect(page.locator('.hero h1')).toHaveText(/A new kind of\s*good energy\./);
  await page.getByRole('button', { name: 'Previous story', exact: true }).click();
  await expect(page.locator('.hero h1')).toHaveText(/Energy for a billion\s*possibilities\./);
  await page.getByRole('button', { name: 'Show story 3', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Show story 3', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Show story 1', exact: true }).click();

  await page.getByRole('button', { name: 'Search website', exact: true }).click();
  const search = page.getByRole('searchbox', { name: 'Search content' });
  await expect(search).toBeFocused();
  await search.fill('LPG');
  await expect(page.locator('.search-results')).toContainText('Households & LPG');
  await search.fill('not-a-real-result');
  await expect(page.locator('.search-results')).toContainText('No results found.');
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog')).not.toBeVisible();

  await page.locator('.photo-stories').scrollIntoViewIfNeeded();
  await page.locator('.photo-stories').screenshot({ path: 'artifacts/photo-gallery.png' });
  await page.getByRole('tab', { name: '02 Pipelines' }).click();
  await expect(page.getByRole('tabpanel')).toContainText('An invisible network.');
  await page.getByRole('tab', { name: '02 Pipelines' }).press('ArrowDown');
  await expect(page.getByRole('tab', { name: '03 Research & Development' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tab', { name: '03 Research & Development' })).toBeFocused();
  await page.getByRole('tab', { name: '03 Research & Development' }).press('End');
  await expect(page.getByRole('tab', { name: '09 Cryogenics' })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('tab', { name: '09 Cryogenics' }).press('Home');
  await expect(page.getByRole('tab', { name: '01 Refining' })).toHaveAttribute('aria-selected', 'true');
  await page.locator('#businesses').screenshot({ path: 'artifacts/businesses.png' });
  await expect(emblem).toHaveAttribute('data-animated', 'false');

  const filters = page.getByRole('group', { name: 'Filter updates' });
  await filters.getByRole('button', { name: /^Recruitment/ }).click();
  await expect(page.locator('.news-card')).toHaveCount(2);
  await filters.getByRole('button', { name: /^Investors/ }).click();
  await expect(page.locator('.news-card')).toHaveCount(1);
  await filters.getByRole('button', { name: /^Public Notices/ }).click();
  await expect(page.locator('.news-card')).toHaveCount(1);
  await filters.getByRole('button', { name: /^All updates/ }).click();
  await expect(page.locator('.news-card')).toHaveCount(4);

  await page.getByRole('button', { name: /MAURITIUS IndianOil Mauritius/ }).click();
  await expect(page.getByText('Bringing our energy expertise to the Indian Ocean.')).toBeVisible();
  await page.locator('.global-section').scrollIntoViewIfNeeded();
  await expect(page.locator('.globe canvas')).toBeVisible();
  await page.waitForTimeout(1000);
  await page.locator('.global-section').screenshot({ path: 'artifacts/globe.png' });

  const missingTargets = await page.locator('a[href^="#"]').evaluateAll(links => links
    .map(link => link.getAttribute('href'))
    .filter(href => href.length > 1 && !document.getElementById(decodeURIComponent(href.slice(1)))));
  assert.deepEqual([...new Set(missingTargets)], [], 'All local section links should have targets');

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await loadImages();
  await revealSections();
  await checkOverflow('Tablet');
  await page.screenshot({ path: 'artifacts/tablet.png', fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await loadImages();
  await checkOverflow('Mobile');
  await page.screenshot({ path: 'artifacts/mobile-hero.png' });
  await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Close menu', exact: true })).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open menu', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Our businesses' }).click();
  await expect(page.getByRole('button', { name: 'Open menu', exact: true })).toHaveAttribute('aria-expanded', 'false');
  await revealSections();
  await page.screenshot({ path: 'artifacts/mobile.png', fullPage: true });
  await page.setViewportSize({ width: 320, height: 740 });
  await checkOverflow('Small mobile');

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await expect(page.locator('.hero h1')).toHaveText(/Energy for a billion\s*possibilities\./);
  await expect(emblem).toHaveAttribute('data-animated', 'false');
  await expect(emblemCanvas).toBeVisible();
  await page.addStyleTag({ content: '* { animation: none !important; transition: none !important; }' });
  await page.waitForTimeout(1000);
  const stillFrame = await page.screenshot();
  await page.waitForTimeout(400);
  const laterFrame = await page.screenshot();
  if (!stillFrame.equals(laterFrame)) await writeFile('artifacts/reduced-motion-debug.png', laterFrame);
  assert(stillFrame.equals(laterFrame), 'Reduced motion should keep the 3D emblem still');
  assert.deepEqual(errors, [], 'No uncaught browser errors');
  console.log(`PASS (${baseUrl}): desktop/tablet/mobile layout, loaded images, animated 3D emblem, hero carousel, search, keyboard tabs, filters, globe, section links, reduced motion, and browser errors.`);
} catch (error) {
  await page.screenshot({ path: 'artifacts/failure.png', fullPage: true }).catch(() => {});
  if (errors.length) console.error('Browser diagnostics:', errors);
  throw error;
} finally {
  await browser.close();
}
