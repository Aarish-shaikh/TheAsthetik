const fs = require('fs');

const files = [
  'index.html',
  'about-us/index.html',
  'book-an-appointment/index.html',
  'hydrafacial/index.html',
  'treatment-page-template/index.html',
  'elementor-7/index.html',
  'hello-world/index.html',
  'treatments/hydrafacial-in-karachi/index.html',
  '404.html'
];

const externalUrls = new Set();
for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const urls = [...content.matchAll(/https?:\/\/[^\s"'<>()]+/gi)].map(m => m[0]);
  for (const u of urls) {
    if (!u.includes('aestheticsbydrsamina.com')) {
      externalUrls.add(u);
    }
  }
}

console.log('Total external URLs:', externalUrls.size);
console.log([...externalUrls].sort());
