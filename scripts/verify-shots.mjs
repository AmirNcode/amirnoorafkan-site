import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';
const OUT = '/private/tmp/claude-501/-Users-amir-Workspace-MyWebsite/164f684d-f13d-44f1-b2fd-65c7a08d7b6a/scratchpad';
const URL = 'http://localhost:4322/';

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });

async function shot(name, { width, height, scheme }) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1.5 });
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: scheme }]);
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30_000 });
  await new Promise((r) => setTimeout(r, 1800));
  await page.evaluate(async () => {
    scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 700));
    scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 300));
  });
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  await page.close();
  console.log(name, 'done');
}

await shot('site-desktop-dark', { width: 1280, height: 900, scheme: 'dark' });
await shot('site-desktop-light', { width: 1280, height: 900, scheme: 'light' });
await shot('site-mobile-dark', { width: 375, height: 812, scheme: 'dark' });
await browser.close();
