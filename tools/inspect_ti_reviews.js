const fs = require('fs');
const html = fs.readFileSync('E:/TheAsthetik/index.html', 'utf8');
const tiMatch = html.match(/<template id="trustindex-google-widget-html">([\s\S]*?)<\/template>/);
if (tiMatch) {
  const content = tiMatch[1];
  const idx = content.indexOf('ti-reviews-container');
  console.log(content.slice(idx, idx + 2500));
}
