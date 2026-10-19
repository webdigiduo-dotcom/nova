# Aurelia Estates: Luxury Real Estate Website

A luxury real estate agency website built with **HTML5, CSS3 and vanilla JavaScript only**. There are no frameworks, no build step and no dependencies beyond Google Fonts. Open `index.html` to view it, or upload the folder to any static host.

> *Exceptional Homes. Exceptional Living.*

---

## Features

| Area | What's included |
| --- | --- |
| **Pages** | Home, Properties, Property Detail (dynamic), About, Services, Contact, Legal (privacy/terms/disclaimer) and 404 |
| **Home** | A sticky transparent header that turns solid and blurred on scroll. Full-screen hero with a Ken Burns effect and parallax, plus a search bar (location, type, budget). Also: animated trust stats, a featured properties grid (a swipeable carousel on mobile), "Why Choose Us" with counters, a services preview, a testimonial slider (autoplay, arrows, dots, swipe), market insights and a newsletter form |
| **Listings** | Filters for location (with suggestions), type, price range, bedrooms, status and "saved only". Sort by newest or by price. Grid/list toggle (remembered between visits), loading skeletons and an empty state. Filters sync to the URL, so filtered results can be shared as a link |
| **Detail** | Gallery with thumbnails, a full-screen lightbox (arrow keys, Esc, swipe), overview specs, description, amenities, a map placeholder, an agent card and an inquiry form with a confirmation dialog. Also share buttons (native share, WhatsApp, LinkedIn, X, email, copy link), a save toggle stored in `localStorage` and similar properties |
| **Contact** | Validated form with inline success and error states, contact details, office hours, a map placeholder and an accessible FAQ accordion |
| **Motion** | Scroll reveal through IntersectionObserver, smooth anchors, button shine and ripple, card lift and image zoom. Animations use only transform and opacity, and `prefers-reduced-motion` is respected |
| **Accessibility** | Semantic landmarks, a skip link, visible focus states, keyboard support everywhere, ARIA for the menu, slider, accordion and dialogs, live regions, labelled form errors and AA colour contrast |
| **SEO** | Unique titles and meta descriptions, canonical URLs, Open Graph and Twitter tags, `robots.txt` and `sitemap.xml`. JSON-LD for `RealEstateAgent`, `WebSite`, `ItemList`, `Service`, `FAQPage` and a per-property `RealEstateListing` |

---

## Folder structure

```
.
├── index.html              Home
├── properties.html         Listings with filters, sort and view toggle
├── property.html           Property detail, rendered from ?id=<property-id>
├── about.html              Story, principles, team, milestones, awards
├── services.html           Five services plus the process
├── contact.html            Contact form, details, hours, map, FAQ
├── legal.html              Privacy policy, terms, disclaimer (#privacy #terms #disclaimer)
├── 404.html                Not-found page
├── robots.txt
├── sitemap.xml
├── css/
│   └── styles.css          All styles: design tokens at the top, sections numbered
├── js/
│   ├── data/
│   │   └── properties.js   13 property objects, 4 agents and an image URL helper
│   ├── main.js             Shared: header, menu, reveal, counters, parallax, slider,
│   │                       favourites, card renderer, modal, toast, accordion
│   ├── properties.js       Listings page logic
│   ├── property-detail.js  Detail page rendering, gallery and lightbox, share, SEO tags
│   └── forms.js            Validation and submission for every form
└── images/
    ├── favicon.svg
    └── placeholder.svg     Local fallback used if a remote image fails to load
```

Scripts load with `defer` in this order: `data/properties.js`, then `main.js`, then the page script, then `forms.js`.

---

## Running locally

Open `index.html` directly in a browser. For the most realistic behaviour (clipboard copy, the native share sheet, clean URLs), serve the folder over HTTP:

```bash
npx serve .
```

```bash
python -m http.server 8080
```

---

## Customisation

### Brand colours and typography
Every colour, font, spacing step and easing curve is a CSS custom property at the top of `css/styles.css` (section **1. Design tokens**):

```css
--ink: #0e0e10;       /* deep charcoal / black */
--ivory: #f8f5ef;     /* warm ivory background */
--gold: #b8975a;      /* muted gold accent */
--gold-text: #7d5f2c; /* gold for text on light backgrounds (AA contrast) */
--font-serif: 'Playfair Display', ...;
--font-sans: 'Inter', ...;
```

To change fonts, update the Google Fonts `<link>` in each page's `<head>` and the two `--font-*` tokens.

### Adding or editing properties
Edit `js/data/properties.js`. Each listing is a plain object:

```js
{
  id: 'the-ivory-residence',          // URL slug: property.html?id=the-ivory-residence
  title: 'The Ivory Residence',
  type: 'apartment',                  // apartment | villa | plot | commercial
  status: 'sale',                     // sale | rent
  price: 87500000,                    // INR. For rentals, the monthly rent
  locality: 'Bandra West', city: 'Mumbai', address: '…',
  beds: 4, baths: 5, area: 3850,      // area in sq.ft. Use 0 beds for plots/commercial
  yearBuilt: 2022, parking: 3, furnishing: 'Semi-furnished',
  badges: ['featured', 'new'],        // drives the badges and the home "Featured" grid
  listedOn: '2026-09-28',             // used for "Newest" sorting
  summary: '…', description: ['para 1', 'para 2'], amenities: ['…'],
  images: ['photo-1545324418-cc1a3fa10c00', 'images/my-photo.jpg'],
  agent: 'meera'                      // key from the agents object
}
```

- **Images** can be Unsplash photo IDs, which `img()` turns into sized CDN URLs, or any path or URL such as `images/ivory-1.jpg`. For production, replace the Unsplash placeholders with your own photography in `/images`. Use roughly 1800 px wide JPG/WebP files.
- The **home page** shows up to 6 properties that have the `featured` badge, are for sale and are not commercial (see `initFeatured()` in `main.js`).
- After adding listings, add their URLs to `sitemap.xml`.

### Header, footer and contact details
The site has no build step, so the header, mobile menu and footer markup are repeated in every HTML file. Use find-and-replace across all `*.html` files to change a link, phone number or address. Also update the `RealEstateAgent` JSON-LD in each `<head>`.

### Connecting the forms to a backend
By default, forms **simulate** a successful submission so the UI can be demoed. To send real submissions, add a `data-endpoint` attribute to any `<form data-form>`. It will `POST` the form data there as `FormData` with `Accept: application/json`:

```html
<form class="form" id="contact-form" data-form data-success="inline"
      data-endpoint="https://formspree.io/f/your-id" novalidate>
```

This works with Formspree, Getform, Basin, Netlify Functions or your own API. Any non-2xx response shows the error state. Success modes:

- `data-success="inline"`: replaces the form with the `[data-form-success]` panel (Contact)
- `data-success="modal"` with `data-modal="#id"`: opens a confirmation `<dialog>` (Property inquiry)
- `data-success="message"` with `data-success-message="…"`: shows a status message (Newsletter)

For the inquiry form on the detail page, set the endpoint in `js/property-detail.js` where the form markup is built.

Validation uses the standard `required`, `type="email"`, `type="tel"`, `minlength` and `pattern` attributes. Add `data-error="…"` to customise a field's message. A hidden honeypot field named `company` filters basic spam bots.

The contact form can be prefilled from the URL: `contact.html?subject=Investment%20Advisory&property=The%20Ivory%20Residence`.

### Maps
Map areas are styled placeholders with a "View on Google Maps" link. To embed a real map, replace a `.map-placeholder` element with a Google Maps or OpenStreetMap `<iframe>` (add `loading="lazy"` and a `title`).

### Domain and SEO
Replace `https://www.aureliaestates.com` with your real domain in:
- each page's `<link rel="canonical">`, `og:url` and JSON-LD
- `robots.txt` and `sitemap.xml`

Use a 1200×630 image you own for `og:image`.

---

## Deployment

The site is static, so any host works. Upload the whole folder with `index.html` at the web root.

| Host | Steps |
| --- | --- |
| **Netlify** | Drag the folder onto app.netlify.com/drop, or connect the Git repo with an empty build command and `.` as the publish directory. `404.html` is used automatically. |
| **Vercel** | `npx vercel` in the folder and choose "Other" as the framework, with no build command. |
| **GitHub Pages** | Push to a repo, then go to Settings → Pages → Deploy from branch → `main` / root. `404.html` is used automatically. |
| **Cloudflare Pages** | Connect the repo, leave the build command empty and set the output directory to `/`. |
| **Apache / cPanel** | Upload the files to `public_html`. Add `ErrorDocument 404 /404.html` to `.htaccess`. |
| **Nginx** | `root /var/www/aurelia; error_page 404 /404.html;` |

**Production checklist**
- [ ] Replace the placeholder Unsplash images with licensed photography and compress them (WebP/AVIF)
- [ ] Set `data-endpoint` on the forms
- [ ] Update the domain in canonicals, OG tags, JSON-LD, `robots.txt` and `sitemap.xml`
- [ ] Update the social profile URLs in the footer and the JSON-LD `sameAs`
- [ ] Add analytics (and a cookie banner if your jurisdiction requires one)
- [ ] Have your legal team review `legal.html`
- [ ] Test with Lighthouse and the Google Rich Results Test

---

## Browser support

The site supports the latest versions of Chrome, Edge, Firefox and Safari (desktop and iOS). It relies on native `<dialog>`, IntersectionObserver, CSS custom properties, `clamp()` and `inert`, all of which are supported in every current evergreen browser. Core content stays readable without JavaScript, and `<noscript>` messages appear on the JS-rendered sections.
