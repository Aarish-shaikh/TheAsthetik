const https = require('https');

https.get('https://cdn.trustindex.io/loader.js?ver=1', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    let p = data.indexOf('addCSS(');
    p = data.indexOf('addCSS(', p + 1);
    console.log('Surroundings of second addCSS:');
    console.log(data.substring(p - 300, p + 400));
  });
}).on('error', err => console.error(err));
