const fs = require('fs');
const html = fs.readFileSync('E:/TheAsthetik/index.html', 'utf8');
const match = html.match(/\/\/ Clone helper:[\s\S]*?<\/script>/);
if (match) console.log(match[0]);
