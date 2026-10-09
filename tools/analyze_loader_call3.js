const https = require('https');

https.get('https://cdn.trustindex.io/loader.js?ver=1', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    let p = data.indexOf('isWidgetStylesheetLoaded');
    console.log('Before isWidgetStylesheetLoaded:');
    console.log(data.substring(p - 800, p));
  });
}).on('error', err => console.error(err));
