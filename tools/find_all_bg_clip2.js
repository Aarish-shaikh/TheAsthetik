const fs = require('fs');
const path = require('path');

function search(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git') search(full);
    } else if (f.endsWith('.html') || f.endsWith('.css')) {
      const c = fs.readFileSync(full, 'utf8');
      if (c.includes('-webkit-background-clip:text;')) {
        console.log('File containing -webkit-background-clip:text; :', full);
      }
    }
  }
}
search('E:\\TheAsthetik');
