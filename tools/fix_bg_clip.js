const fs = require('fs');
const path = require('path');

const filesToFix = [
  'E:/TheAsthetik/index.html',
  'E:/TheAsthetik/404.html',
  'E:/TheAsthetik/about-us/index.html',
  'E:/TheAsthetik/book-an-appointment/index.html',
  'E:/TheAsthetik/elementor-7/index.html',
  'E:/TheAsthetik/hello-world/index.html',
  'E:/TheAsthetik/hydrafacial/index.html',
  'E:/TheAsthetik/treatment-page-template/index.html',
  'E:/TheAsthetik/treatments/hydrafacial-in-karachi/index.html'
];

for (const filePath of filesToFix) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Replace -webkit-background-clip:text; where background-clip:text; is not already present
    content = content.replace(/-webkit-background-clip:\s*text;(?!background-clip:\s*text;)/g, '-webkit-background-clip:text;background-clip:text;');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed background-clip in:', filePath);
  }
}
