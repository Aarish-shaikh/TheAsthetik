const fs = require('fs');
const path = require('path');

const externalImages = [
  'https://cdn.trustindex.io/assets/platform/Google/star/f.svg',
  'https://cdn.trustindex.io/assets/platform/Google/logo.svg',
  'https://cdn.trustindex.io/assets/platform/Google/icon.svg',
  'https://cdn.trustindex.io/loader.js',
  'https://cdn-reach.hostinger.com/js/embed.js',
  'https://link.msgsndr.com/js/form_embed.js',
  'https://lh3.googleusercontent.com/a/ACg8ocL6LA_x7cHmvpmGDL_2-CNZbNk8K1PCEDIfzV8ImX3sCpzKnA=w40-h40-c-rp-mo-br100',
  'https://lh3.googleusercontent.com/a-/ALV-UjWGFMALXE3z2q2UNtftKN_CUbYKpAV1NKB_iD4aZpzLP65-4PM=w40-h40-c-rp-mo-br100',
  'https://lh3.googleusercontent.com/a/ACg8ocJKhhxywn-eYlUIToSXCuFY9ikFXYkWluKmGRuoyxEvRwdw4Doa=w40-h40-c-rp-mo-br100',
  'https://lh3.googleusercontent.com/a/ACg8ocIAVvW2Fa_xkmglV8IQWfNgl2hJhDrsSjLX0CJgYWoyMEilTg=w40-h40-c-rp-mo-br100',
  'https://lh3.googleusercontent.com/a/ACg8ocIRpzJZwkjZ7LVVewRMdtcAN38qijH5gyhncGNLvoIY3sYE2Q=w40-h40-c-rp-mo-br100',
  'https://lh3.googleusercontent.com/a/ACg8ocIAfJIYXyt0sDIUWl15io3vgN_m7qHln63eFN-TtTjnAv_gtQ=w40-h40-c-rp-mo-br100',
  'https://lh3.googleusercontent.com/a/ACg8ocK3TRhEuhJTamc5JJFJtF8LK0g9aQKlWRcdXjQBDwvZ8DhB_Q=w40-h40-c-rp-mo-br100',
  'https://lh3.googleusercontent.com/a/ACg8ocLFwME_EGBF-zAJAZi_u0BlSqBmr8iHbQBpUgsyyQ2dHRucjA=w40-h40-c-rp-mo-br100',
  'https://lh3.googleusercontent.com/a-/ALV-UjWNtdnIx6hI9Zi0OHSUQSrkySlL99v4bXv6p5Zhcb2HJigE9bJA=w40-h40-c-rp-mo-br100'
];

async function downloadExternal() {
  const targetDir = path.join(__dirname, 'assets', 'external');
  fs.mkdirSync(targetDir, { recursive: true });

  for (let i = 0; i < externalImages.length; i++) {
    const u = externalImages[i];
    let filename;
    if (u.includes('star/f.svg')) filename = 'star-f.svg';
    else if (u.includes('logo.svg')) filename = 'google-logo.svg';
    else if (u.includes('icon.svg')) filename = 'google-icon.svg';
    else if (u.includes('loader.js')) filename = 'trustindex-loader.js';
    else if (u.includes('embed.js')) filename = 'reach-embed.js';
    else if (u.includes('form_embed.js')) filename = 'form_embed.js';
    else filename = `avatar-${i}.jpg`;

    const filePath = path.join(targetDir, filename);
    try {
      console.log(`Fetching ${u} -> ${filename}`);
      const res = await fetch(u);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(filePath, buf);
      console.log(`Saved ${filename} (${buf.length} bytes)`);
    } catch (e) {
      console.error(`Failed ${u}:`, e.message);
    }
  }
}

downloadExternal().catch(console.error);
