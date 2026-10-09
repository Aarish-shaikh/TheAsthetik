const https = require('https');

https.get('https://cdn.trustindex.io/loader.js?ver=1', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const cssUrls = [...data.matchAll(/https?:\/\/[^"'\s]+\.css[^"'\s]*/g)].map(m => m[0]);
    console.log('CSS URLs found in loader:', [...new Set(cssUrls)]);
    const cdnMatches = [...data.matchAll(/cdn\.trustindex\.io[^"'\s]*/g)].map(m => m[0]);
    console.log('CDN paths in loader:', [...new Set(cdnMatches)].slice(0, 20));
  });
}).on('error', err => console.error(err));
