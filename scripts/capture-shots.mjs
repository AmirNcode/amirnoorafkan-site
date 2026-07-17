// Captures homepage screenshots of the three live project sites for the
// portfolio cards. Uses the locally installed Chrome via puppeteer-core.
// Usage: node scripts/capture-shots.mjs
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync } from 'node:fs';

const CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
].find(existsSync);

if (!CHROME) {
  console.error('No Chrome/Chromium found. Install Google Chrome and re-run.');
  process.exit(1);
}

const targets = [
  { slug: 'worldcup', url: 'https://worldcup-teams-stats.netlify.app/' },
  { slug: 'hausofballoons', url: 'https://hausofballoons.ca/' },
  { slug: 'simpleqr', url: 'https://simplqrgen.netlify.app/' },
];

mkdirSync('src/assets/shots', { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });

for (const { slug, url } of targets) {
  process.stdout.write(`Capturing ${url} … `);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60_000 });
  await new Promise((r) => setTimeout(r, 2500));
  await page.screenshot({ path: `src/assets/shots/${slug}.png` });
  console.log('done');
}

await browser.close();
