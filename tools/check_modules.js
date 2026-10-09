const fs = require('fs');
const path = require('path');

const candidates = [
  '/wp-content/plugins/elementor/assets/js/preloaded-modules.min.js',
  '/wp-content/plugins/elementor/assets/js/preloaded-elements-handlers.min.js',
  '/wp-content/plugins/elementor/assets/js/frontend.min.js',
  '/wp-content/plugins/elementor/assets/js/webpack.runtime.min.js',
  '/wp-content/plugins/elementor/assets/js/lightbox.min.js',
  '/wp-content/plugins/elementor/assets/lib/dialog/dialog.min.js',
  '/wp-content/plugins/elementor/assets/lib/share-link/share-link.min.js',
  '/wp-content/plugins/elementor/assets/lib/swiper/v8/swiper.min.js',
  '/wp-content/plugins/elementor/assets/lib/swiper/swiper.min.js',
  '/wp-content/plugins/elementor/assets/lib/waypoints/waypoints.min.js',
  '/wp-content/plugins/elementor/assets/lib/slick/slick.min.js',
  '/wp-content/plugins/elementor/assets/lib/e-gallery/js/e-gallery.min.js',
  '/wp-content/plugins/elementor-pro/assets/js/preloaded-elements-handlers.min.js',
  '/wp-content/plugins/elementor-pro/assets/js/frontend.min.js',
  '/wp-content/plugins/elementor-pro/assets/js/webpack-pro.runtime.min.js',
  '/wp-content/plugins/elementor-pro/assets/js/elements-handlers.min.js',
  '/wp-content/plugins/jeg-elementor-kit/assets/js/elements/sticky-element.js',
  '/wp-content/plugins/jeg-elementor-kit/assets/js/elements/nav-menu.js',
  '/wp-content/plugins/jeg-elementor-kit/assets/js/elements/post-pagination.js'
];

async function checkAndDownload() {
  for (const rel of candidates) {
    const local = path.join(__dirname, rel.replace(/^\//, ''));
    if (!fs.existsSync(local)) {
      try {
        const url = 'https://aestheticsbydrsamina.com' + rel;
        console.log('Fetching candidate:', url);
        const res = await fetch(url);
        if (res.ok) {
          const buf = Buffer.from(await res.arrayBuffer());
          fs.mkdirSync(path.dirname(local), { recursive: true });
          fs.writeFileSync(local, buf);
          console.log(`Saved ${rel} (${buf.length} bytes)`);
        } else {
          console.log(`Status ${res.status} for ${rel}`);
        }
      } catch (e) {
        console.log(`Error ${rel}: ${e.message}`);
      }
    } else {
      console.log(`Already exists: ${rel}`);
    }
  }
}

checkAndDownload().catch(console.error);
