const fs = require('fs');
const html = fs.readFileSync('E:/TheAsthetik/index.html', 'utf8');
const tiMatch = html.match(/<template id="trustindex-google-widget-html">([\s\S]*?)<\/template>/);
if (tiMatch) {
  const content = tiMatch[1];
  console.log('Length:', content.length);
  // Look for the main container divs
  const lines = content.split('>');
  for (let i = 0; i < 20; i++) {
    if (lines[i]) console.log(lines[i].trim() + '>');
  }
}
