const fs = require('fs');
const html = fs.readFileSync('E:/TheAsthetik/index.html', 'utf8');
const re = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let m;
while ((m = re.exec(html)) !== null) {
  const tag = m[0];
  const srcMatch = tag.match(/src=["']([^"']+)["']/);
  if (srcMatch) console.log('SRC:', srcMatch[1]);
  else console.log('INLINE:', m[1].trim().slice(0, 80).replace(/\s+/g, ' '));
}
