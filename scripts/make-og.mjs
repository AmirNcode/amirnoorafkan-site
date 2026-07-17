// Renders public/og.png (1200x630) for social sharing cards.
// Usage: node scripts/make-og.mjs
import puppeteer from 'puppeteer-core';
import { readFileSync, existsSync } from 'node:fs';

const CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
].find(existsSync);

const font = (path) =>
  readFileSync(new URL(`../node_modules/${path}`, import.meta.url)).toString('base64');

const archivo = font('@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2');
const plexMono = font('@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2');

const html = `<!doctype html><html><head><style>
  @font-face { font-family: Archivo; src: url(data:font/woff2;base64,${archivo}) format('woff2-variations'); font-weight: 100 900; }
  @font-face { font-family: Mono; src: url(data:font/woff2;base64,${plexMono}) format('woff2'); font-weight: 500; }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: #0b0e14; overflow: hidden; position: relative; font-family: Archivo, sans-serif; }
  svg { position: absolute; inset: 0; }
  .inner { position: absolute; inset: 0; padding: 84px 90px; display: flex; flex-direction: column; justify-content: center; }
  .kicker { font-family: Mono; font-size: 26px; letter-spacing: 0.14em; color: #ffb224; margin-bottom: 18px; }
  h1 { font-size: 108px; font-weight: 800; font-stretch: 110%; letter-spacing: -0.015em; color: #e6eaf2; line-height: 1.02; }
  .sub { font-family: Mono; font-size: 30px; color: #8a93a6; margin-top: 26px; }
  .rule { width: 110px; height: 7px; background: #ffb224; border-radius: 4px; margin-top: 34px; }
</style></head><body>
  <svg viewBox="0 0 1200 630">
    <defs><pattern id="g" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgb(42 50 69 / 0.5)" stroke-width="1"/>
    </pattern></defs>
    <rect width="1200" height="630" fill="url(#g)"/>
    <path d="M 30 600 C 380 590, 500 480, 680 300 C 860 120, 960 80, 1180 40"
      fill="none" stroke="#ffb224" stroke-width="3" stroke-linecap="round" opacity="0.9"/>
    <circle cx="680" cy="300" r="7" fill="#ffb224"/>
  </svg>
  <div class="inner">
    <div class="kicker">TORONTO, CANADA</div>
    <h1>Amir Noorafkan</h1>
    <div class="sub">Engineer &amp; developer — apps, automation, cost control</div>
    <div class="rule"></div>
  </div>
</body></html>`;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og.png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
console.log('public/og.png written');
