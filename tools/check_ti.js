const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf-8');
const tiImages = [...html.matchAll(/data-imgurl=["']([^"']+)["']/gi)].map(m => m[1]);
console.log('Total data-imgurl in index.html:', tiImages.length);
console.log('Unique data-imgurls:', [...new Set(tiImages)]);

const trustindexImages = [...html.matchAll(/https:\/\/cdn\.trustindex\.io\/[^"'\s>]+/gi)].map(m => m[0]);
console.log('Unique trustindex URLs:', [...new Set(trustindexImages)]);
