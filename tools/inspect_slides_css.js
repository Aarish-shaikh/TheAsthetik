const fs = require('fs');
const cssPath = 'E:/TheAsthetik/wp-content/plugins/elementor-pro/assets/css/widget-slides.min.css';
if (fs.existsSync(cssPath)) {
  console.log('widget-slides.min.css content:');
  console.log(fs.readFileSync(cssPath, 'utf8'));
}
const swiperCss = 'E:/TheAsthetik/wp-content/plugins/elementor/assets/lib/swiper/v8/css/swiper.min.css';
if (fs.existsSync(swiperCss)) {
  console.log('swiper.min.css sample:');
  console.log(fs.readFileSync(swiperCss, 'utf8').slice(0, 300));
}
