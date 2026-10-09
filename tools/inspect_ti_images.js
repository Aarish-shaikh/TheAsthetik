const fs = require('fs');
const html = fs.readFileSync('E:/TheAsthetik/index.html', 'utf8');
const tiMatch = html.match(/<template id="trustindex-google-widget-html">([\s\S]*?)<\/template>/);
if (tiMatch) {
  const content = tiMatch[1];
  const imgMatches = [...content.matchAll(/data-imgurl=["']([^"']+)["']/g)].map(m => m[1]);
  console.log('Unique data-imgurls:', [...new Set(imgMatches)]);
}
