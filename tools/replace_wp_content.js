const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git') replaceInDir(full);
    } else if (f.endsWith('.css') || f.endsWith('.html')) {
      let c = fs.readFileSync(full, 'utf8');
      if (c.includes('https://aestheticsbydrsamina.com/wp-content/')) {
        c = c.replaceAll('https://aestheticsbydrsamina.com/wp-content/', '/wp-content/');
        fs.writeFileSync(full, c, 'utf8');
        console.log('Updated:', full);
      }
    }
  }
}
replaceInDir('E:\\TheAsthetik');
