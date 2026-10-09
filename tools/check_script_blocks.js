const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf-8');
const scriptBlocks = [...html.matchAll(/<script(?:\s+id=["']([^"']*)["'])?[^>]*>([\s\S]*?)<\/script>/gi)];

for (const s of scriptBlocks) {
  const id = s[1];
  const body = s[2];
  if (body.includes('aestheticsbydrsamina.com')) {
    console.log(`Script block id="${id || 'none'}":`);
    const lines = body.split('\n').filter(l => l.includes('aestheticsbydrsamina.com'));
    lines.forEach(l => console.log('  ', l.trim().substring(0, 120)));
  }
}
