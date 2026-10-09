const https = require('https');

https.get('https://cdn.trustindex.io/assets/widget-presetted-css/v2/5-light-background.css', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Search for ti-widget-container
    let p = 0;
    while ((p = data.indexOf('.ti-widget-container', p)) !== -1) {
      console.log('Match container:');
      console.log(data.substring(p, p + 200));
      p += 25;
    }
    p = 0;
    while ((p = data.indexOf('.ti-reviews-container', p)) !== -1) {
      console.log('Match reviews container:');
      console.log(data.substring(p, p + 200));
      p += 25;
    }
  });
}).on('error', err => console.error(err));
