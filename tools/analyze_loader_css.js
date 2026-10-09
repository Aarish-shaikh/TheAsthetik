const https = require('https');

https.get('https://cdn.trustindex.io/loader.js?ver=1', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const idx = data.indexOf('addCSS');
    let pos = 0;
    while ((pos = data.indexOf('addCSS', pos)) !== -1) {
      console.log('addCSS usage:', data.substring(pos, pos + 150));
      pos += 6;
    }
  });
}).on('error', err => console.error(err));
