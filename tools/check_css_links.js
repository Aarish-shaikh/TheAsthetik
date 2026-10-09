const fs = require('fs');
const html = fs.readFileSync('E:/TheAsthetik/index.html', 'utf8');
const linkMatches = [...html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi)];
for (const m of linkMatches) {
  const hrefMatch = m[0].match(/href=["']([^"']+)["']/);
  if (hrefMatch) console.log('CSS:', hrefMatch[1]);
}
