const fs = require('fs');

async function main() {
  const res = await fetch('https://aestheticsbydrsamina.com/');
  const html = await res.text();
  fs.writeFileSync('raw_home.html', html, 'utf-8');
  console.log('Saved raw_home.html, size:', html.length);

  const links = [...html.matchAll(/<link\s+([^>]+)>/gi)].map(m => m[1]);
  console.log('Total <link> tags:', links.length);
  const stylesheets = links.filter(l => l.includes('stylesheet'));
  console.log('Stylesheet link tags count:', stylesheets.length);
  stylesheets.slice(0, 10).forEach(s => console.log('Link:', s));
}

main().catch(console.error);
