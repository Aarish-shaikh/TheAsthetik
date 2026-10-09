const https = require('https');

https.get('https://aestheticsbydrsamina.com/', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Search for trustindex in all style tags or link tags
    const styleMatches = [...data.matchAll(/<style[\s\S]*?<\/style>/gi)];
    console.log('Total style tags:', styleMatches.length);
    for (const m of styleMatches) {
      if (m[0].includes('ti-widget') || m[0].includes('ti-review')) {
        console.log('Found TI in style tag! Length:', m[0].length);
      }
    }
    const linkMatches = [...data.matchAll(/<link[\s\S]*?>/gi)];
    for (const m of linkMatches) {
      if (m[0].includes('trustindex')) {
        console.log('Found TI link tag:', m[0]);
      }
    }
  });
}).on('error', err => console.error(err));
