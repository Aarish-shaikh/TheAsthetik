const fs = require('fs');

async function checkEmbeds() {
  const res = await fetch('https://aestheticsbydrsamina.com/book-an-appointment/');
  const html = await res.text();
  const iframes = [...html.matchAll(/<iframe[\s\S]*?<\/iframe>/gi)];
  console.log('Book appointment iframes:', iframes.length);
  iframes.forEach((f, i) => console.log(`Iframe ${i}:`, f[0]));

  const msgsndr = [...html.matchAll(/<[^>]+msgsndr[^>]*>/gi)];
  console.log('Msgsndr tags:', msgsndr.length);
  msgsndr.forEach((t, i) => console.log(`Tag ${i}:`, t[0]));
}

checkEmbeds().catch(console.error);
