const fs = require('fs');

let html = fs.readFileSync('E:/TheAsthetik/index.html', 'utf8');

// 1. Ensure 5-light-background.css is linked in head
if (!html.includes('/assets/external/5-light-background.css')) {
  html = html.replace('</head>', '  <link rel="stylesheet" href="/assets/external/5-light-background.css">\n</head>');
  console.log('Added 5-light-background.css link');
}

// 2. Extract and format Trustindex template
const tiMatch = html.match(/<pre class="ti-widget" style="display: none"><template id="trustindex-google-widget-html">([\s\S]*?)<\/template><\/pre>/);

if (tiMatch) {
  let tiContent = tiMatch[1];
  
  // Replace star SVGs
  tiContent = tiContent.replace(/<trustindex-image class="ti-star" data-imgurl="https:\/\/cdn\.trustindex\.io\/assets\/platform\/Google\/star\/f\.svg"[^>]*><\/trustindex-image>/g,
    '<img src="/assets/external/star-f.svg" alt="Google star" width="17" height="17" class="ti-star" style="display:inline-block;vertical-align:middle;margin-right:2px;" />');
  
  // Replace Google logo
  tiContent = tiContent.replace(/<trustindex-image class="ti-logo-fb" data-imgurl="https:\/\/cdn\.trustindex\.io\/assets\/platform\/Google\/logo\.svg"[^>]*><\/trustindex-image>/g,
    '<img src="/assets/external/google-logo.svg" alt="Google" width="140" height="24" class="ti-logo-fb" style="display:inline-block;vertical-align:middle;" />');

  // Replace Google icon
  tiContent = tiContent.replace(/<trustindex-image data-imgurl="https:\/\/cdn\.trustindex\.io\/assets\/platform\/Google\/icon\.svg"[^>]*><\/trustindex-image>/g,
    '<img src="/assets/external/google-icon.svg" alt="Google" width="20" height="20" style="display:inline-block;vertical-align:middle;" />');

  // Replace avatar images with local avatar files
  const avatarUrls = [
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

  avatarUrls.forEach((url, i) => {
    const regex = new RegExp('<trustindex-image data-imgurl="' + url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"[^>]*><\\/trustindex-image>', 'g');
    tiContent = tiContent.replace(regex, `<img src="/assets/external/avatar-google-${i}.jpg" width="40" height="40" style="width:40px;height:40px;border-radius:50%;object-fit:cover;" />`);
  });

  // Ensure remaining trustindex-images are converted
  tiContent = tiContent.replace(/<trustindex-image[^>]*data-imgurl="([^"]+)"[^>]*><\/trustindex-image>/g, (m, src) => {
    return `<img src="${src}" width="20" height="20" />`;
  });

  // Replace verified badges with crisp SVG checkmarks
  tiContent = tiContent.replace(/<span class="ti-verified-review ti-verified-platform">[\s\S]*?<\/span>/g,
    '<span class="ti-verified-review ti-verified-platform" title="Trustindex verifies that the original source of the review is Google."><svg width="15" height="15" viewBox="0 0 16 16" fill="#1a73e8" style="vertical-align:middle;margin-left:4px;"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l4-4.97a.75.75 0 0 0-.02-1.07z"/></svg></span>');

  // Add the Trustindex verified badge button at the bottom of the widget
  const badgeHtml = `
  <div class="ti-verified-badge-row" style="display:flex;justify-content:flex-end;margin-top:14px;padding-right:10px;">
    <a href="https://www.trustindex.io" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;background:#00875a;color:#ffffff;padding:6px 14px;border-radius:4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:12px;font-weight:600;text-decoration:none;box-shadow:0 1px 3px rgba(0,0,0,0.15);letter-spacing:0.2px;">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      Verified by Trustindex
    </a>
  </div>
  `;

  tiContent = tiContent + badgeHtml;

  // Replace the hidden template with active unpacked markup
  html = html.replace(tiMatch[0], tiContent);
  console.log('Unpacked Trustindex template successfully');
}

// 3. Inject dedicated CSS and slider JS before </body>
const customStylesAndScripts = `
<style id="custom-clone-fixes">
/* ===== HERO SLIDER STYLES ===== */
.elementor-element-30e4fc9.elementor-widget-slides {
  position: relative !important;
  width: 100% !important;
  overflow: hidden !important;
  background-color: #0d1b2a !important;
}
.elementor-element-30e4fc9 .elementor-slides-wrapper {
  position: relative !important;
  width: 100% !important;
  overflow: hidden !important;
}
.elementor-element-30e4fc9 .swiper-wrapper {
  display: flex !important;
  width: 100% !important;
  transition: transform 0.6s ease-in-out !important;
}
.elementor-element-30e4fc9 .swiper-slide {
  position: relative !important;
  width: 100% !important;
  height: 75vh !important;
  min-height: 520px !important;
  flex-shrink: 0 !important;
  overflow: hidden !important;
}
.elementor-element-30e4fc9 .swiper-slide-bg {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background-position: center center !important;
  background-size: cover !important;
  background-repeat: no-repeat !important;
  z-index: 1 !important;
}
.elementor-element-30e4fc9 .elementor-repeater-item-63aeb41 .swiper-slide-bg {
  background-image: url('/wp-content/uploads/2025/11/2-min-scaled.webp') !important;
}
.elementor-element-30e4fc9 .elementor-repeater-item-5acea6e .swiper-slide-bg {
  background-image: url('/wp-content/uploads/2025/11/1-min-scaled.webp') !important;
}
.elementor-element-30e4fc9 .elementor-repeater-item-e4d38fb .swiper-slide-bg {
  background-image: url('/wp-content/uploads/2025/11/3-min-scaled.webp') !important;
}
.elementor-element-30e4fc9 .elementor-background-overlay {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background: linear-gradient(180deg, rgba(2, 79, 110, 0.35) 0%, rgba(2, 79, 110, 0.65) 100%) !important;
  z-index: 2 !important;
}
.elementor-element-30e4fc9 .swiper-slide-inner {
  position: absolute !important;
  inset: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 3 !important;
  padding: 0 15% !important;
  text-align: center !important;
}
.elementor-element-30e4fc9 .swiper-slide-contents {
  max-width: 900px !important;
  margin: 0 auto !important;
}
.elementor-element-30e4fc9 .elementor-slide-heading {
  color: #ffffff !important;
  font-family: inherit !important;
  font-size: 50px !important;
  font-weight: 700 !important;
  line-height: 1.2 !important;
  margin-bottom: 20px !important;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5) !important;
}
.elementor-element-30e4fc9 .elementor-slide-description {
  color: #ffffff !important;
  font-size: 17px !important;
  line-height: 1.6 !important;
  margin-bottom: 30px !important;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.5) !important;
}
.elementor-element-30e4fc9 .elementor-slide-button {
  display: inline-block !important;
  padding: 12px 36px !important;
  border: 2px solid #ffffff !important;
  border-radius: 50px !important;
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.12) !important;
  backdrop-filter: blur(4px) !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  text-decoration: none !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
}
.elementor-element-30e4fc9 .elementor-slide-button:hover {
  background: #ffffff !important;
  color: #024f6e !important;
}
.elementor-element-30e4fc9 .elementor-swiper-button {
  position: absolute !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  z-index: 10 !important;
  width: 50px !important;
  height: 50px !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: #ffffff !important;
  user-select: none !important;
}
.elementor-element-30e4fc9 .elementor-swiper-button svg {
  width: 28px !important;
  height: 28px !important;
  fill: #ffffff !important;
  filter: drop-shadow(0 2px 5px rgba(0,0,0,0.6)) !important;
}
.elementor-element-30e4fc9 .elementor-swiper-button-prev {
  left: 20px !important;
}
.elementor-element-30e4fc9 .elementor-swiper-button-next {
  right: 20px !important;
}

@media (max-width: 768px) {
  .elementor-element-30e4fc9 .swiper-slide {
    height: 85vh !important;
  }
  .elementor-element-30e4fc9 .elementor-slide-heading {
    font-size: 32px !important;
  }
  .elementor-element-30e4fc9 .elementor-slide-description {
    font-size: 15px !important;
  }
  .elementor-element-30e4fc9 .swiper-slide-inner {
    padding: 0 8% !important;
  }
}

/* ===== TRUSTINDEX REVIEWS STYLES ===== */
.ti-widget.ti-goog {
  width: 100% !important;
  margin: 0 auto !important;
}
.ti-widget-container.ti-col-4 {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 24px !important;
  width: 100% !important;
}
.ti-widget-container .ti-footer {
  flex: 0 0 220px !important;
  max-width: 220px !important;
  text-align: center !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
}
.ti-widget-container .ti-reviews-container {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  position: relative !important;
  overflow: hidden !important;
  padding: 10px 0 !important;
}
.ti-reviews-container-wrapper {
  display: flex !important;
  flex-direction: row !important;
  gap: 16px !important;
  overflow-x: auto !important;
  scroll-behavior: smooth !important;
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
  padding: 10px 4px !important;
}
.ti-reviews-container-wrapper::-webkit-scrollbar {
  display: none !important;
}
.ti-review-item {
  flex: 0 0 310px !important;
  width: 310px !important;
  max-width: 310px !important;
  background: #ffffff !important;
  border-radius: 12px !important;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid #e8e8e8 !important;
  box-sizing: border-box !important;
  margin-bottom: 0 !important;
  display: flex !important;
  flex-direction: column !important;
}
.ti-review-item .ti-inner {
  padding: 18px 20px !important;
  display: flex !important;
  flex-direction: column !important;
  height: 100% !important;
}
.ti-review-header {
  display: flex !important;
  align-items: center !important;
  position: relative !important;
  margin-bottom: 10px !important;
}
.ti-profile-img {
  margin-right: 12px !important;
}
.ti-profile-img img {
  width: 40px !important;
  height: 40px !important;
  border-radius: 50% !important;
  object-fit: cover !important;
}
.ti-platform-icon {
  position: absolute !important;
  right: 0 !important;
  top: 0 !important;
}
.ti-name {
  font-weight: 700 !important;
  font-size: 15px !important;
  color: #111111 !important;
}
.ti-date {
  font-size: 12px !important;
  color: #888888 !important;
}
.ti-stars {
  display: flex !important;
  align-items: center !important;
  gap: 2px !important;
  margin-bottom: 12px !important;
}
.ti-review-text {
  font-size: 14px !important;
  line-height: 1.55 !important;
  color: #333333 !important;
  flex-grow: 1 !important;
}
.ti-controls .ti-next,
.ti-controls .ti-prev {
  position: absolute !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  z-index: 10 !important;
  width: 40px !important;
  height: 40px !important;
  background: #ffffff !important;
  border-radius: 50% !important;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18) !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.2s ease !important;
}
.ti-controls .ti-next:hover,
.ti-controls .ti-prev:hover {
  background: #f8f8f8 !important;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25) !important;
}
.ti-controls .ti-next {
  right: 4px !important;
}
.ti-controls .ti-prev {
  left: 4px !important;
}
.ti-controls .ti-next::after {
  content: "›" !important;
  font-size: 26px !important;
  font-weight: 600 !important;
  color: #333333 !important;
  line-height: 1 !important;
  margin-top: -2px !important;
  margin-left: 2px !important;
}
.ti-controls .ti-prev::after {
  content: "‹" !important;
  font-size: 26px !important;
  font-weight: 600 !important;
  color: #333333 !important;
  line-height: 1 !important;
  margin-top: -2px !important;
  margin-right: 2px !important;
}

@media (max-width: 900px) {
  .ti-widget-container.ti-col-4 {
    flex-direction: column !important;
  }
  .ti-widget-container .ti-footer {
    max-width: 100% !important;
    margin-bottom: 20px !important;
  }
  .ti-widget-container .ti-reviews-container {
    width: 100% !important;
  }
  .ti-review-item {
    flex: 0 0 280px !important;
    width: 280px !important;
  }
}
</style>

<script id="custom-clone-slider-scripts">
document.addEventListener('DOMContentLoaded', function() {
  // 1. Hero Slider Navigation & Autoplay
  const heroContainer = document.querySelector('.elementor-element-30e4fc9');
  if (heroContainer) {
    const wrapper = heroContainer.querySelector('.swiper-wrapper');
    const slides = heroContainer.querySelectorAll('.swiper-slide');
    const prevBtn = heroContainer.querySelector('.elementor-swiper-button-prev');
    const nextBtn = heroContainer.querySelector('.elementor-swiper-button-next');

    if (slides.length > 0 && wrapper) {
      let currentIndex = 0;
      let timer = null;

      function updateSlide(idx) {
        currentIndex = (idx + slides.length) % slides.length;
        wrapper.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
      }

      function next() { updateSlide(currentIndex + 1); }
      function prev() { updateSlide(currentIndex - 1); }

      function startTimer() {
        stopTimer();
        timer = setInterval(next, 5000);
      }
      function stopTimer() {
        if (timer) clearInterval(timer);
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
          e.preventDefault();
          next();
          startTimer();
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
          e.preventDefault();
          prev();
          startTimer();
        });
      }

      heroContainer.addEventListener('mouseenter', stopTimer);
      heroContainer.addEventListener('mouseleave', startTimer);

      updateSlide(0);
      startTimer();
    }
  }

  // 2. Trustindex Reviews Carousel
  const reviewsWrapper = document.querySelector('.ti-reviews-container-wrapper');
  const reviewNext = document.querySelector('.ti-controls .ti-next');
  const reviewPrev = document.querySelector('.ti-controls .ti-prev');

  if (reviewsWrapper) {
    const scrollStep = 326; // Card width (310px) + gap (16px)

    if (reviewNext) {
      reviewNext.addEventListener('click', function(e) {
        e.preventDefault();
        reviewsWrapper.scrollBy({ left: scrollStep, behavior: 'smooth' });
      });
    }

    if (reviewPrev) {
      reviewPrev.addEventListener('click', function(e) {
        e.preventDefault();
        reviewsWrapper.scrollBy({ left: -scrollStep, behavior: 'smooth' });
      });
    }
  }
});
</script>
`;

// Remove previous custom fixes if present and insert before </body>
html = html.replace(/<style id="custom-clone-fixes">[\s\S]*?<\/script>/, '');
html = html.replace('</body>', customStylesAndScripts + '\n</body>');

fs.writeFileSync('E:/TheAsthetik/index.html', html, 'utf8');
console.log('Successfully updated E:/TheAsthetik/index.html! File size:', html.length);
