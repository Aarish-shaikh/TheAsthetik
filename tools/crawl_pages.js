const fs = require('fs');

async function findPages() {
  const visited = new Set();
  const toVisit = [
    'https://aestheticsbydrsamina.com/',
    'https://aestheticsbydrsamina.com/about-us/',
    'https://aestheticsbydrsamina.com/book-an-appointment/',
    'https://aestheticsbydrsamina.com/hydrafacial/',
    'https://aestheticsbydrsamina.com/treatment-page-template/',
    'https://aestheticsbydrsamina.com/elementor-7/',
    'https://aestheticsbydrsamina.com/hello-world/',
    'https://aestheticsbydrsamina.com/treatments/hydrafacial-in-karachi/'
  ];

  const allFoundPages = new Set(toVisit);

  while (toVisit.length > 0) {
    const url = toVisit.shift();
    if (visited.has(url)) continue;
    visited.add(url);

    try {
      console.log('Fetching:', url);
      const res = await fetch(url);
      const text = await res.text();
      console.log(`Status: ${res.status}, length: ${text.length}`);

      // Extract all internal links
      const hrefMatches = [...text.matchAll(/href=["'](https?:\/\/aestheticsbydrsamina\.com[^"'#?]*)/gi)];
      for (const m of hrefMatches) {
        let link = m[1];
        if (!link.endsWith('/') && !link.match(/\.[a-zA-Z0-9]+$/)) {
          link += '/';
        }
        // Exclude wp-admin, wp-json, feed, etc.
        if (
          !link.includes('/wp-admin') &&
          !link.includes('/wp-json') &&
          !link.includes('/feed') &&
          !link.includes('/wp-content') &&
          !link.includes('/wp-includes') &&
          !link.endsWith('.css') &&
          !link.endsWith('.js') &&
          !link.endsWith('.jpg') &&
          !link.endsWith('.png') &&
          !link.endsWith('.xml')
        ) {
          if (!allFoundPages.has(link)) {
            allFoundPages.add(link);
            toVisit.push(link);
            console.log('Discovered new page:', link);
          }
        }
      }
    } catch (err) {
      console.error('Failed:', url, err.message);
    }
  }

  console.log('\n--- ALL DISCOVERED PAGES ---');
  for (const page of allFoundPages) {
    console.log(page);
  }
}

findPages().catch(console.error);
