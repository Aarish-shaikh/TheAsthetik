const fs = require('fs');
const path = require('path');

async function fix() {
  const targetDir = path.join(__dirname, 'assets', 'external');
  const res1 = await fetch('https://cdn-reach.hostinger.com/js/embed.js');
  fs.writeFileSync(path.join(targetDir, 'reach-embed.js'), Buffer.from(await res1.arrayBuffer()));
  
  const res2 = await fetch('https://link.msgsndr.com/js/form_embed.js');
  fs.writeFileSync(path.join(targetDir, 'form_embed.js'), Buffer.from(await res2.arrayBuffer()));
  console.log('Fixed reach-embed.js and form_embed.js');
}

fix().catch(console.error);
