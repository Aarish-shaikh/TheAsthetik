const https = require('https');

https.get('https://cdn.trustindex.io/loader.js?ver=1', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Loader.js length:', data.length);
    console.log('Loader.js content:', data.slice(0, 500));
  });
}).on('error', err => console.error(err));
