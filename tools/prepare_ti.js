const fs = require('fs');
const html = fs.readFileSync('E:/TheAsthetik/index.html', 'utf8');
const tiMatch = html.match(/<template id="trustindex-google-widget-html">([\s\S]*?)<\/template>/);
if (!tiMatch) {
  console.log('No template found!');
  process.exit(1);
}

let tiHtml = tiMatch[1];
console.log('Original template length:', tiHtml.length);

// Replace trustindex-image tags with standard img tags
tiHtml = tiHtml.replace(/<trustindex-image([^>]*)data-imgurl="([^"]+)"([^>]*)><\/trustindex-image>/g, (m, b1, url, b2) => {
  let src = url;
  if (url.includes('star/f.svg')) src = '/assets/external/star-f.svg';
  else if (url.includes('logo.svg')) src = '/assets/external/google-logo.svg';
  else if (url.includes('icon.svg')) src = '/assets/external/google-icon.svg';
  return `<img src="${src}" ${b1} ${b2} loading="lazy" />`;
});

console.log('Replaced images length:', tiHtml.length);
console.log('Contains /assets/external/star-f.svg?:', tiHtml.includes('/assets/external/star-f.svg'));
console.log('Contains /assets/external/google-logo.svg?:', tiHtml.includes('/assets/external/google-logo.svg'));
console.log('Contains /assets/external/google-icon.svg?:', tiHtml.includes('/assets/external/google-icon.svg'));
