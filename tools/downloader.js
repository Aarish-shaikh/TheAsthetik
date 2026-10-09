const fs = require('fs');
const path = require('path');

const PAGES = [
  { path: '', file: 'index.html', url: 'https://aestheticsbydrsamina.com/' },
  { path: 'about-us', file: 'about-us/index.html', url: 'https://aestheticsbydrsamina.com/about-us/' },
  { path: 'book-an-appointment', file: 'book-an-appointment/index.html', url: 'https://aestheticsbydrsamina.com/book-an-appointment/' },
  { path: 'hydrafacial', file: 'hydrafacial/index.html', url: 'https://aestheticsbydrsamina.com/hydrafacial/' },
  { path: 'treatment-page-template', file: 'treatment-page-template/index.html', url: 'https://aestheticsbydrsamina.com/treatment-page-template/' },
  { path: 'elementor-7', file: 'elementor-7/index.html', url: 'https://aestheticsbydrsamina.com/elementor-7/' },
  { path: 'hello-world', file: 'hello-world/index.html', url: 'https://aestheticsbydrsamina.com/hello-world/' },
  { path: 'treatments/hydrafacial-in-karachi', file: 'treatments/hydrafacial-in-karachi/index.html', url: 'https://aestheticsbydrsamina.com/treatments/hydrafacial-in-karachi/' },
  { path: '404', file: '404.html', url: 'https://aestheticsbydrsamina.com/treatments/hydrafacial-in-karachi/' }
];

const downloadedAssets = new Set();
const assetQueue = [];

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function fetchBufferWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      return buffer;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

async function downloadAsset(assetUrl) {
  // Strip query string for file path
  let cleanUrl = assetUrl;
  let urlObj;
  try {
    urlObj = new URL(assetUrl, 'https://aestheticsbydrsamina.com/');
  } catch (e) {
    return;
  }

  // Only download if it belongs to aestheticsbydrsamina.com
  if (urlObj.hostname !== 'aestheticsbydrsamina.com') {
    return;
  }

  const pathname = decodeURIComponent(urlObj.pathname);
  if (!pathname || pathname === '/' || pathname.endsWith('.php')) {
    return;
  }

  const localFilePath = path.join(__dirname, pathname.replace(/^\//, ''));
  if (downloadedAssets.has(localFilePath)) return;
  downloadedAssets.add(localFilePath);

  if (fs.existsSync(localFilePath) && fs.statSync(localFilePath).size > 0) {
    // Already downloaded
    return;
  }

  try {
    ensureDirSync(path.dirname(localFilePath));
    const fullUrl = urlObj.href;
    console.log(`Downloading asset: ${pathname}`);
    const buffer = await fetchBufferWithRetry(fullUrl);
    fs.writeFileSync(localFilePath, buffer);

    // If it's a CSS file, parse for urls
    if (pathname.endsWith('.css')) {
      const cssContent = buffer.toString('utf-8');
      const cssUrls = [...cssContent.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi)].map(m => m[1]);
      for (const u of cssUrls) {
        if (u.startsWith('data:')) continue;
        try {
          const resolvedUrl = new URL(u, fullUrl).href;
          await downloadAsset(resolvedUrl);
        } catch (e) {}
      }
    }
  } catch (err) {
    console.warn(`Failed downloading ${assetUrl}: ${err.message}`);
  }
}

async function processHtmlAssets(html) {
  // Extract all src, href, srcset, data-*, url(...)
  const urls = new Set();

  const srcMatches = [...html.matchAll(/(?:src|href|data-src|data-lazy-src|data-imgurl)=["']([^"']+)["']/gi)].map(m => m[1]);
  srcMatches.forEach(u => urls.add(u));

  const srcsetMatches = [...html.matchAll(/(?:srcset|data-srcset)=["']([^"']+)["']/gi)].map(m => m[1]);
  srcsetMatches.forEach(s => {
    s.split(',').forEach(part => {
      const u = part.trim().split(/\s+/)[0];
      if (u) urls.add(u);
    });
  });

  const inlineCssMatches = [...html.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi)].map(m => m[1]);
  inlineCssMatches.forEach(u => urls.add(u));

  for (const u of urls) {
    if (u.startsWith('data:') || u.startsWith('#') || u.startsWith('tel:') || u.startsWith('mailto:') || u.startsWith('javascript:')) {
      continue;
    }
    try {
      const resolved = new URL(u, 'https://aestheticsbydrsamina.com/');
      if (resolved.hostname === 'aestheticsbydrsamina.com') {
        const p = resolved.pathname;
        if (p.includes('/wp-content/') || p.includes('/wp-includes/') || p.match(/\.(css|js|png|jpe?g|webp|gif|svg|woff2?|ttf|eot|ico)$/i)) {
          await downloadAsset(resolved.href);
        }
      }
    } catch (e) {}
  }
}

function rewriteHtml(html) {
  let modified = html;

  // Replace aestheticsbydrsamina.com links and assets
  // 1. Assets: wp-content and wp-includes
  modified = modified.replace(/https:\/\/aestheticsbydrsamina\.com\/wp-content\//g, '/wp-content/');
  modified = modified.replace(/https:\/\/aestheticsbydrsamina\.com\/wp-includes\//g, '/wp-includes/');
  modified = modified.replace(/http:\/\/aestheticsbydrsamina\.com\/wp-content\//g, '/wp-content/');
  modified = modified.replace(/http:\/\/aestheticsbydrsamina\.com\/wp-includes\//g, '/wp-includes/');

  // 2. Specific pages
  modified = modified.replace(/https:\/\/aestheticsbydrsamina\.com\/about-us\/?/g, '/about-us/');
  modified = modified.replace(/https:\/\/aestheticsbydrsamina\.com\/book-an-appointment\/?/g, '/book-an-appointment/');
  modified = modified.replace(/https:\/\/aestheticsbydrsamina\.com\/hydrafacial\/?/g, '/hydrafacial/');
  modified = modified.replace(/https:\/\/aestheticsbydrsamina\.com\/treatment-page-template\/?/g, '/treatment-page-template/');
  modified = modified.replace(/https:\/\/aestheticsbydrsamina\.com\/elementor-7\/?/g, '/elementor-7/');
  modified = modified.replace(/https:\/\/aestheticsbydrsamina\.com\/hello-world\/?/g, '/hello-world/');
  modified = modified.replace(/https:\/\/aestheticsbydrsamina\.com\/treatments\/hydrafacial-in-karachi\/?/g, '/treatments/hydrafacial-in-karachi/');

  // 3. Root links
  modified = modified.replace(/https:\/\/aestheticsbydrsamina\.com\/?(?=["'#\s>])/g, '/');
  modified = modified.replace(/https:\/\/aestheticsbydrsamina\.com(?=["'#\s>])/g, '/');

  return modified;
}

async function main() {
  console.log('Starting site clone download...');

  for (const page of PAGES) {
    console.log(`\n--- Fetching page: ${page.url} ---`);
    try {
      const res = await fetch(page.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const html = await res.text();
      console.log(`Downloaded ${page.url} (${html.length} bytes, status: ${res.status})`);

      // Harvest assets
      await processHtmlAssets(html);

      // Rewrite and save page
      const rewrittenHtml = rewriteHtml(html);
      const targetFilePath = path.join(__dirname, page.file);
      ensureDirSync(path.dirname(targetFilePath));
      fs.writeFileSync(targetFilePath, rewrittenHtml, 'utf-8');
      console.log(`Saved page to ${page.file}`);
    } catch (err) {
      console.error(`Error processing page ${page.url}:`, err.message);
    }
  }

  console.log(`\nAsset downloading complete! Total unique assets processed: ${downloadedAssets.size}`);
}

main().catch(console.error);
