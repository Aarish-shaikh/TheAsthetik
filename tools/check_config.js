const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf-8');
const elemConfig = html.match(/var ElementorConfig = (\{.*?\});/);
console.log('ElementorConfig found:', !!elemConfig);

const frontendConfig = html.match(/var elementorFrontendConfig = (\{.*?\});/);
console.log('elementorFrontendConfig found:', !!frontendConfig);

if (frontendConfig) {
  try {
    const parsed = JSON.parse(frontendConfig[1]);
    console.log('Config keys:', Object.keys(parsed));
    console.log('urls:', parsed.urls);
  } catch (e) {
    console.log('JSON parse error:', e.message);
  }
}
