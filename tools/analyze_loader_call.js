const https = require('https');

https.get('https://cdn.trustindex.io/loader.js?ver=1', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const idx = data.indexOf('addCSS(');
    console.log('Surroundings of addCSS:');
    console.log(data.substring(idx - 300, idx + 400));
  });
}).on('error', err => console.error(err));
