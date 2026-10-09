const https = require('https');

https.get('https://cdn.trustindex.io/loader.js?ver=1', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Includes localhost?:', data.includes('localhost'));
    console.log('Includes domain check?:', data.includes('location.hostname') || data.includes('location.host'));
    console.log('Includes whitelist?:', data.includes('whitelist'));
    // Let us see where ti-reviews-container or slider init is
    let p = 0;
    while ((p = data.indexOf('ti-reviews-container', p)) !== -1) {
      console.log('Found ti-reviews-container at', p, 'context:', data.substring(p - 50, p + 100));
      p += 20;
    }
  });
}).on('error', err => console.error(err));
