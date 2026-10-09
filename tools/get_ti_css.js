const https = require('https');

https.get('https://cdn.trustindex.io/assets/widget-presetted-css/v2/5-light-background.css', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('CSS Length:', data.length);
    console.log('Sample CSS:', data.slice(0, 500));
  });
}).on('error', err => console.error(err));
