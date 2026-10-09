const fs = require('fs');
const path = require('path');
function search(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git') search(full);
    } else if (f.endsWith('.css')) {
      const c = fs.readFileSync(full, 'utf8');
      if (c.includes('elementor-slide-heading')) {
        console.log('Found in:', full);
        let p = 0;
        while ((p = c.indexOf('elementor-slide-heading', p)) !== -1) {
          console.log(c.substring(Math.max(0, p - 30), Math.min(c.length, p + 150)));
          p += 30;
        }
      }
    }
  }
}
search('E:\\TheAsthetik');
