const fs = require('fs');
const html = fs.readFileSync('E:/TheAsthetik/index.html', 'utf8');
const tiMatch = html.match(/<template id="trustindex-google-widget-html">([\s\S]*?)<\/template>/);
if (tiMatch) {
  console.log('Template length:', tiMatch[1].length);
  console.log('Template content sample:', tiMatch[1].slice(0, 1000));
}
