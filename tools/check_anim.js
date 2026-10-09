const fs = require('fs');
const css1 = fs.readFileSync('E:/TheAsthetik/wp-content/plugins/elementor/assets/lib/animations/styles/fadeInUp.min.css', 'utf8');
console.log('fadeInUp css:', css1);
const css2 = fs.readFileSync('E:/TheAsthetik/wp-content/plugins/elementor-pro/assets/css/widget-slides.min.css', 'utf8');
const p = css2.indexOf('elementor-animated');
if (p !== -1) console.log('widget-slides animated:', css2.slice(p, p + 200));
else console.log('widget-slides does not mention elementor-animated');
