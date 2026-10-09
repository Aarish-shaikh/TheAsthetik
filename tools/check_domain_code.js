const https = require('https');

https.get('https://cdn.trustindex.io/loader.js?ver=1', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    let p = 0;
    while ((p = data.indexOf('hostname', p)) !== -1) {
      console.log('Hostname match at', p, 'context:');
      console.log(data.substring(Math.max(0, p - 100), Math.min(data.length, p + 200)));
      p += 8;
    }
  });
}).on('error', err => console.error(err));
