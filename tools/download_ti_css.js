const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://cdn.trustindex.io/assets/widget-presetted-css/v2/5-light-background.css';
const dest = 'E:/TheAsthetik/assets/external/5-light-background.css';

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync(dest, data, 'utf8');
    console.log('Saved', dest, 'size:', data.length);
  });
}).on('error', err => console.error(err));
