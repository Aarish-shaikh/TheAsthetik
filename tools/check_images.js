const fs = require('fs');

const html = fs.readFileSync('raw_home.html', 'utf-8');
const starMatches = [...html.matchAll(/<trustindex-image[^>]+>/gi)];
console.log('Trustindex images count:', starMatches.length);
if (starMatches.length > 0) {
  console.log('Sample:', starMatches[0][0]);
}

const allImgMatches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)];
console.log('Total img tags:', allImgMatches.length);
allImgMatches.slice(0, 10).forEach(m => console.log('IMG src:', m[1]));
