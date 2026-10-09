const fs = require('fs');
const css = fs.readFileSync('E:/TheAsthetik/wp-content/uploads/elementor/css/post-177.css', 'utf8');
let p = 0;
while ((p = css.indexOf('elementor-element-30e4fc9', p)) !== -1) {
  console.log('Match:');
  console.log(css.substring(Math.max(0, p - 50), Math.min(css.length, p + 250)));
  p += 25;
}
