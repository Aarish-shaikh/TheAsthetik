const https = require('https');
const fs = require('fs');

const html = fs.readFileSync('E:/TheAsthetik/index.html', 'utf8');
const tiMatch = html.match(/<template id="trustindex-google-widget-html">([\s\S]*?)<\/template>/);
const urls = [...tiMatch[1].matchAll(/data-imgurl="(https:\/\/lh3\.googleusercontent\.com\/[^"]+)"/g)].map(m => m[1]);
console.log('Total avatar urls:', urls.length);

urls.forEach((url, i) => {
  const filename = `avatar-google-${i}.jpg`;
  https.get(url, res => {
    if (res.statusCode === 200) {
      const file = fs.createWriteStream('E:/TheAsthetik/assets/external/' + filename);
      res.pipe(file);
      file.on('finish', () => console.log('Saved', filename));
    }
  }).on('error', e => console.error(e));
});
