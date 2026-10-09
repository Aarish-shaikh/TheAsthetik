const fs = require('fs');
const html = fs.readFileSync('E:/TheAsthetik/index.html', 'utf8');
const tiMatch = html.match(/<template id="trustindex-google-widget-html">([\s\S]*?)<\/template>/);
if (tiMatch) {
  const content = tiMatch[1];
  const items = [...content.matchAll(/class="ti-name">\s*([^<]+)\s*<\/div>[\s\S]*?<trustindex-image data-imgurl="([^"]+)"/g)];
  console.log('Found names and avatar URLs:');
  for (const it of items) {
    console.log(it[1].trim(), '->', it[2]);
  }
}
