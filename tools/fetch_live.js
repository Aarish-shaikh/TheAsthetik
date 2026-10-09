const https = require('https');

https.get('https://aestheticsbydrsamina.com/', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Live HTML size:', data.length);
    const iReviews = data.indexOf('Hear From Our Patients');
    if (iReviews !== -1) {
      console.log('Live reviews snippet:');
      console.log(data.substring(iReviews, iReviews + 3000));
    }
    const iHero = data.indexOf('Modern Treatments');
    if (iHero !== -1) {
      console.log('Live hero snippet:');
      console.log(data.substring(iHero - 200, iHero + 500));
    }
  });
}).on('error', err => console.error(err));
