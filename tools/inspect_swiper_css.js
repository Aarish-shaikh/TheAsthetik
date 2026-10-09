const fs = require('fs');
const css = fs.readFileSync('E:/TheAsthetik/wp-content/plugins/elementor-pro/assets/css/widget-slides.min.css', 'utf8');
console.log('widget-slides:', css);
const swiperCss = fs.readFileSync('E:/TheAsthetik/wp-content/plugins/elementor/assets/lib/swiper/v8/css/swiper.min.css', 'utf8');
const p = swiperCss.indexOf('.swiper-slide{');
if (p !== -1) console.log('swiper-slide rule:', swiperCss.slice(p, p + 200));
