# The Ästhetik - Aesthetics by Dr. Samina (1:1 Complete Clone)

A pixel-perfect, 1:1 identical clone of [https://aestheticsbydrsamina.com/](https://aestheticsbydrsamina.com/), replicating every page, design style, responsive layout, asset, font, script, and all existing site quirks and mistakes.

---

## 🚀 Quick Start

To launch and explore the clone locally:

```bash
# Start the local server
npm start
# or
npm run dev
# or
node server.js
```

Then open your browser at **`http://localhost:3000`**.

---

## 📄 Replicated Pages & Routes

All pages are cloned 1-to-1 with all styles, animations, layouts, and assets:

| Route | Page Name | Description |
|---|---|---|
| [`/`](http://localhost:3000/) | **Home Page** | Complete hero section, services, doctor intro, approach steps, testimonials, Trustindex reviews, and footer. |
| [`/about-us/`](http://localhost:3000/about-us/) | **About Us** | Dr. Samina Habib credentials, team, clinic statistics, video popup, and modern tech showcase. |
| [`/book-an-appointment/`](http://localhost:3000/book-an-appointment/) | **Book Appointment** | Appointment booking page with embedded LeadConnector booking widget and consultation details. |
| [`/hydrafacial/`](http://localhost:3000/hydrafacial/) | **HydraFacial Treatment** | Dedicated treatment page with procedure breakdown, before/after gallery, FAQs accordion, and booking CTA. |
| [`/treatment-page-template/`](http://localhost:3000/treatment-page-template/) | **Treatment Template** | The live site's draft treatment template with contact/booking form layout. |
| [`/elementor-7/`](http://localhost:3000/elementor-7/) | **Elementor 7** | The draft/template page from the live site containing placeholder hero sections. |
| [`/hello-world/`](http://localhost:3000/hello-world/) | **Hello World Post** | The default WordPress blog post and comments section published on the live site. |
| [`/treatments/hydrafacial-in-karachi/`](http://localhost:3000/treatments/hydrafacial-in-karachi/) | **Original 404 Page** | The exact 404 error page from the live site sitemap. |

---

## 🔍 Preserved Quirks, Bugs & Mistakes (Exact Reproduction)

Per the requirement to replicate **everything same to same including mistakes and problems**:

1. **Default "Hello world!" Blog Post**:
   - The original WordPress placeholder post (*"Welcome to WordPress. This is your first post. Edit or delete it, then start writing!"*) under `/hello-world/` and linked in the "Our Blog" section of the homepage.
2. **Lorem Ipsum Testimonials**:
   - The patient review cards featuring placeholder Latin copy: *"Lorem ipsum dolor sit amet, consectetur adipiscing elit..."* with roles *"Banker"*, *"Entrepreneur"*, and *"Actor"*.
3. **Duplicate Navigation Entries**:
   - Repetitive navigation links in the header and mobile menu (*Home Page*, *About Us*, *Treatments*, *HydraFacial* repeated).
4. **Placeholder Template Pages**:
   - The incomplete `/elementor-7/` and `/treatment-page-template/` pages preserved with their original placeholder images (`Image_Placeholder_Hero-1024x833.jpeg`, `placeholder.png`).
5. **Broken Sitemap Link**:
   - The sitemap URL `/treatments/hydrafacial-in-karachi/` preserved to return the live site's styled 404 template.
6. **Footer "Credentials" Typo**:
   - The standalone *"Credentials"* text immediately above the copyright notice in the footer.
7. **Duplicate Footer Link Lists**:
   - The "Quick Links" and "Useful Links" sections repeating the same targets.

---

## 📦 Asset Architecture

- **`wp-content/`**: All original Elementor themes, plugins, uploads, and media.
- **`wp-includes/`**: WordPress core scripts, jQuery 3.7.1, imagesLoaded, block styles.
- **`assets/external/`**: Locally cached Trustindex review SVGs, Google review avatars, and embed helpers.
- **`server.js`**: Lightweight, zero-dependency Node.js HTTP server supporting clean URLs, MIME types, and 404 fallbacks.
- **`tools/`**: Crawling, asset downloading, and verification scripts.
