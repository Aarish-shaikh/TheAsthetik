const fs = require('fs');
const html = fs.readFileSync('E:/TheAsthetik/index.html', 'utf8');
const p1 = html.indexOf('elementor-widget-slides');
const p2 = html.indexOf('</div>', html.indexOf('elementor-swiper-button-next', p1) + 40);
console.log('Hero block length:', p2 - p1);
console.log(html.substring(p1 - 50, p2 + 50));
