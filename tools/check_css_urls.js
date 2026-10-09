const fs = require('fs');
const css = fs.readFileSync('E:/TheAsthetik/wp-content/uploads/elementor/css/post-177.css', 'utf8');
const urls = [...css.matchAll(/url\(([^)]+)\)/g)].map(m => m[1]);
console.log('Total URLs in post-177.css:', urls.length);
console.log('Sample URLs:', urls.slice(0, 10));
