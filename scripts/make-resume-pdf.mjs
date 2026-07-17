// Renders resume-src/resume.html to public/AmirNoorafkan_Resume.pdf.
// Usage: node scripts/make-resume-pdf.mjs
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';

const CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
].find(existsSync);

const src = new URL('../resume-src/resume.html', import.meta.url).href;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
await page.goto(src, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
await page.pdf({
  path: 'public/AmirNoorafkan_Resume.pdf',
  format: 'Letter',
  printBackground: true,
  margin: { top: 0, bottom: 0, left: 0, right: 0 },
});
await browser.close();
console.log('public/AmirNoorafkan_Resume.pdf written');
