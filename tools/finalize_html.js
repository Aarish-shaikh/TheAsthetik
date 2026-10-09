const fs = require('fs');
const path = require('path');

const files = [
  'index.html',
  'about-us/index.html',
  'book-an-appointment/index.html',
  'hydrafacial/index.html',
  'treatment-page-template/index.html',
  'elementor-7/index.html',
  'hello-world/index.html',
  'treatments/hydrafacial-in-karachi/index.html',
  '404.html'
];

const fallbackScript = `
<script>
// Clone helper: Ensure trustindex images and external embeds render properly offline & locally
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('trustindex-image').forEach(function(el) {
    if (!el.querySelector('img')) {
      var img = document.createElement('img');
      var url = el.getAttribute('data-imgurl') || '';
      if (url.includes('star/f.svg')) img.src = '/assets/external/star-f.svg';
      else if (url.includes('logo.svg')) img.src = '/assets/external/google-logo.svg';
      else if (url.includes('icon.svg')) img.src = '/assets/external/google-icon.svg';
      else img.src = url;
      img.alt = el.getAttribute('alt') || 'Google star';
      if (el.getAttribute('width')) img.width = el.getAttribute('width');
      if (el.getAttribute('height')) img.height = el.getAttribute('height');
      img.style.display = 'inline-block';
      img.style.verticalAlign = 'middle';
      el.appendChild(img);
    }
  });
});
</script>
`;

for (const rel of files) {
  const full = path.join(__dirname, rel);
  if (!fs.existsSync(full)) continue;
  let content = fs.readFileSync(full, 'utf-8');

  // Fix Elementor config asset URLs
  content = content.replace(/https:\/\/aestheticsbydrsamina\.com\/wp-content\/plugins\/elementor\/assets\//g, '/wp-content/plugins/elementor/assets/');
  content = content.replace(/https:\\\/\\\/aestheticsbydrsamina\.com\\\/wp-content\\\/plugins\\\/elementor\\\/assets\\\//g, '/wp-content/plugins/elementor/assets/');
  content = content.replace(/https:\/\/aestheticsbydrsamina\.com\/wp-content\/uploads/g, '/wp-content/uploads');
  content = content.replace(/https:\\\/\\\/aestheticsbydrsamina\.com\\\/wp-content\\\/uploads/g, '/wp-content/uploads');

  // Fix Elementor Pro config ajaxurl
  content = content.replace(/https:\\\/\\\/aestheticsbydrsamina\.com\\\/wp-admin\\\/admin-ajax\.php/g, '/wp-admin/admin-ajax.php');
  content = content.replace(/https:\/\/aestheticsbydrsamina\.com\/wp-admin\/admin-ajax\.php/g, '/wp-admin/admin-ajax.php');

  // Fix jkit ajax url
  content = content.replace(/https:\/\/aestheticsbydrsamina\.com\/\?jkit-ajax-request=jkit_elements/g, '/?jkit-ajax-request=jkit_elements');
  content = content.replace(/https:\\\/\\\/aestheticsbydrsamina\.com\\\/\?jkit-ajax-request=jkit_elements/g, '/?jkit-ajax-request=jkit_elements');

  // Fix metform
  content = content.replace(/https:\/\/aestheticsbydrsamina\.com\/wp-json\/metform\/v1\/forms\/views\//g, '/wp-json/metform/v1/forms/views/');
  content = content.replace(/https:\\\/\\\/aestheticsbydrsamina\.com\\\/wp-json\\\/metform\\\/v1\\\/forms\\\/views\\\//g, '/wp-json/metform/v1/forms/views/');

  // Fix any remaining root domain links
  content = content.replace(/https:\/\/aestheticsbydrsamina\.com\//g, '/');
  content = content.replace(/https:\\\/\\\/aestheticsbydrsamina\.com\\\//g, '/');

  // Append helper before </body>
  if (content.includes('</body>') && !content.includes('Clone helper')) {
    content = content.replace('</body>', fallbackScript + '\n</body>');
  }

  fs.writeFileSync(full, content, 'utf-8');
  console.log(`Updated ${rel}`);
}
