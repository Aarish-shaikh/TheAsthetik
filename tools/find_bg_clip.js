const fs = require('fs');
const html = fs.readFileSync('E:/TheAsthetik/index.html', 'utf8');

let count = 0;
let pos = 0;
while ((pos = html.indexOf('-webkit-background-clip:text', pos)) !== -1) {
  count++;
  console.log(`Match ${count} at pos ${pos}:`, html.substring(pos - 20, pos + 80));
  pos += 25;
}
