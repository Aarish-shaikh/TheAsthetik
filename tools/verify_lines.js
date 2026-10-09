const fs = require('fs');
const html = fs.readFileSync('E:/TheAsthetik/index.html', 'utf8');
const lines = html.split('\n');

[54, 74].forEach(lineNum => {
  const line = lines[lineNum - 1];
  console.log(`--- Line ${lineNum} ---`);
  const matches = [...line.matchAll(/-webkit-background-clip:text;background-clip:text;/g)];
  console.log(`Found ${matches.length} fixed pattern(s) in line ${lineNum}`);
});
