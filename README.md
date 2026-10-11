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

---

## 👨‍💻 Developer Guide: Adding New Pages (Blog, Treatments, etc.)

If you are joining development or pulling the latest updates from another machine:

### 1. Update Your Local Clone
Run the following in your terminal to get all latest updates, new brand styles, and branch pages:
```bash
git fetch origin
git checkout main
git pull origin main
```
*(If you have uncommitted local edits that you wish to discard, run `git reset --hard origin/main`)*

### 2. Brand Guidelines & Palette
Always adhere to the luxury homepage palette across all new pages:
- **Background:** Cream / Linen `#FAF7F2`
- **Cards / Containers:** White `#FFFFFF` with border `rgba(227, 176, 119, 0.28)`
- **Headings & Primary Text:** Deep Charcoal `#18162B`
- **Pills / Gold Accents / Buttons:** Warm Gold `#E3B077` (hover: `#d49d60`)
- **Body Text:** `#555266` | Muted: `#7B798C`
- **Typography:** `'Lato', 'Inter', sans-serif`
- ⚠️ **Strict Rule:** Never use dark navy blue (`#0b1320`, `#0d1b2a`, `#111f30`).

### 3. How to Add a New Page (e.g. `/blog/` or `/treatments/...`)
The project uses clean folder-based URLs served automatically by `server.js`:
1. Create a folder (e.g. `blog/index.html` or `treatments/chemical-peel/index.html`).
2. Copy the header navigation and footer structure from `about-us/index.html` or `shah-faisal-colony/index.html`.
3. Include the floating WhatsApp widget and clinic config before `</body>`:
   ```html
   <!-- Central Clinic Config & Floating WhatsApp Widget -->
   <script src="/clinic-config.js"></script>
   <link rel="stylesheet" href="/assets/whatsapp/whatsapp.css">
   <script src="/assets/whatsapp/whatsapp.js"></script>
   ```
4. For treatments:
   - Add the new treatment link to the dropdown navigation under the `Treatments` menu in the headers.
   - If the treatment can be booked online, add it to the `treatments` list in `clinic-config.js` so it automatically appears in the interactive booking calendar on `/book-an-appointment/`.

### 4. Running Locally
```bash
node server.js
```
Then open `http://localhost:3000`.

