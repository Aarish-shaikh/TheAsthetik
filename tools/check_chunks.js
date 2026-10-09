const fs = require('fs');

const w1 = fs.readFileSync('wp-content/plugins/elementor/assets/js/webpack.runtime.min.js', 'utf-8');
console.log('webpack.runtime.min.js length:', w1.length);
const chunks1 = [...w1.matchAll(/[a-zA-Z0-9_\-]+\.bundle\.min\.js/g)].map(m => m[0]);
console.log('Chunks in webpack.runtime.min.js:', [...new Set(chunks1)]);

const w2 = fs.readFileSync('wp-content/plugins/elementor-pro/assets/js/webpack-pro.runtime.min.js', 'utf-8');
console.log('webpack-pro.runtime.min.js length:', w2.length);
const chunks2 = [...w2.matchAll(/[a-zA-Z0-9_\-]+\.bundle\.min\.js/g)].map(m => m[0]);
console.log('Chunks in webpack-pro.runtime.min.js:', [...new Set(chunks2)]);
