const fs = require('fs');
const path = require('path');

const htmlFiles = [
  'index.html',
  'about-us/index.html',
  'book-an-appointment/index.html',
  'hydrafacial/index.html',
  'treatment-page-template/index.html',
  'elementor-7/index.html',
  'hello-world/index.html',
  'treatments/hydrafacial-in-karachi/index.html',
  '404.html'
];

async function verify() {
  for (const relPath of htmlFiles) {
    const fullPath = path.join(__dirname, relPath);
    if (!fs.existsSync(fullPath)) {
      console.log(`File NOT found: ${relPath}`);
      continue;
    }
    const html = fs.readFileSync(fullPath, 'utf-8');
    console.log(`\n=== Checking ${relPath} (size: ${html.length}) ===`);

    // Check remaining aestheticsbydrsamina references
    const domainMatches = [...html.matchAll(/https?:\/\/aestheticsbydrsamina\.com[^\s"'>]*/gi)].map(m => m[0]);
    console.log(`Remaining aestheticsbydrsamina URLs: ${domainMatches.length}`);
    if (domainMatches.length > 0) {
      console.log('Sample remaining:', [...new Set(domainMatches)].slice(0, 10));
    }

    // Check local scripts
    const scripts = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
    let missingScripts = 0;
    for (const s of scripts) {
      if (s.startsWith('/')) {
        const p = path.join(__dirname, s.split('?')[0].replace(/^\//, ''));
        if (!fs.existsSync(p)) {
          console.log(`Missing script: ${s} (at ${p})`);
          missingScripts++;
        }
      }
    }

    // Check local css
    const links = [...html.matchAll(/<link[^>]+href=["']([^"']+)["']/gi)].map(m => m[1]);
    let missingCss = 0;
    for (const l of links) {
      if (l.startsWith('/')) {
        const p = path.join(__dirname, l.split('?')[0].replace(/^\//, ''));
        if (!fs.existsSync(p)) {
          console.log(`Missing css/link: ${l} (at ${p})`);
          missingCss++;
        }
      }
    }

    // Check local images
    const imgs = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
    let missingImgs = 0;
    for (const img of imgs) {
      if (img.startsWith('/')) {
        const p = path.join(__dirname, img.split('?')[0].replace(/^\//, ''));
        if (!fs.existsSync(p)) {
          console.log(`Missing img: ${img} (at ${p})`);
          missingImgs++;
        }
      }
    }

    console.log(`Missing scripts: ${missingScripts}, Missing CSS: ${missingCss}, Missing Imgs: ${missingImgs}`);
  }
}

verify().catch(console.error);
