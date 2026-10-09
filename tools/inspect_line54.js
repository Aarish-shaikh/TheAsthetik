const fs = require('fs');
const html = fs.readFileSync('E:/TheAsthetik/index.html', 'utf8');
const lines = html.split('\n');
console.log('Line 54:');
console.log(lines[53]);
