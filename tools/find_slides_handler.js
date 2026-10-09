const fs = require('fs');
const path = require('path');
function search(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git') search(full);
    } else if (f.endsWith('.js')) {
      const c = fs.readFileSync(full, 'utf8');
      if (c.includes('slides.default')) {
        console.log('Found slides.default in:', full);
      }
    }
  }
}
search('E:\\TheAsthetik');
