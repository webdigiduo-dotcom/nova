/**
 * Aurelia Estates — property-detail.js
 * ------------------------------------------------------------
 * Renders property.html?id=<id> from js/data/properties.js:
 *   gallery + lightbox (keyboard + swipe), overview specs, description,
 *   amenities, map placeholder, agent card, inquiry form, share buttons,
 *   favourite toggle, similar properties and per-property SEO tags.
 */
(function () {
  'use strict';

  var A = window.Aurelia;
  var root = document.getElementById('property-root');
  if (!A || !root) return;

  var esc = A.escape;
  var img = A.data.img;
  var id = new URLSearchParams(window.location.search).get('id');
  var property = id ? A.getProperty(id) : null;

  /* ---------- Not found ---------- */
  if (!property) {
    document.title = 'Property not found | Aurelia Estates';
    setMeta('name', 'robots', 'noindex');
    root.innerHTML =
      '<section class="not-found-inline"><div class="container container--narrow">' +
        '<div class="empty-state">' + A.icon('search') +
          '<h1>We couldn’t find that residence</h1>' +
          '<p>The listing may have been sold, leased or withdrawn. Explore our current portfolio or ask our advisors about similar off-market homes.</p>' +
          '<div class="hero__actions" style="justify-content:center">' +
            '<a class="btn btn--gold" href="properties.html"><span class="btn__label">Browse properties</span></a>' +
            '<a class="btn btn--outline" href="contact.html"><span class="btn__label">Speak to an advisor</span></a>' +
          '</div>' +
        '</div>' +
      '</div></section>';
    return;
  }

  var p = property;
  var agent = A.data.agents[p.agent] || A.data.agents[Object.keys(A.data.agents)[0]];
  var pageUrl = window.location.href.split('#')[0];
  var place = p.locality + ', ' + p.city;

  /* ---------- SEO: title, description, OG, canonical, JSON-LD ---------- */
  function setMeta(attr, key, value) {
    var el = document.head.querySelector('meta[' + attr + '="' + key + '"]');
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
    el.setAttribute('content', value);
  }
  var titleText = p.title + ' — ' + A.typeLabel(p.type) + ' ' + (p.status === 'rent' ? 'for Rent' : 'for Sale') + ' in ' + place + ' | Aurelia Estates';
  var descText = A.priceText(p) + ' · ' + (p.beds ? p.beds + ' beds · ' + p.baths + ' baths · ' : '') + A.formatArea(p.area) + '. ' + p.summary;
  document.title = titleText;
  setMeta('name', 'description', descText);
  setMeta('property', 'og:title', p.title + ' | Aurelia Estates');
  setMeta('property', 'og:description', descText);
  setMeta('property', 'og:image', img(p.images[0], 1200));
  setMeta('property', 'og:url', pageUrl);
  setMeta('name', 'twitter:title', p.title + ' | Aurelia Estates');
  setMeta('name', 'twitter:description', descText);
  setMeta('name', 'twitter:image', img(p.images[0], 1200));
  var canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.href = canonical.href.split('?')[0] + '?id=' + encodeURIComponent(p.id);

  var schemaType = { apartment: 'Apartment', villa: 'SingleFamilyResidence', plot: 'Place', commercial: 'Place' }[p.type];
  var listing = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: p.title,
    description: p.description.join(' '),
    url: pageUrl,
    image: p.images.map(function (src) { return img(src, 1600); }),
    datePosted: p.listedOn,
    offers: {
      '@type': 'Offer',
      price: p.price,
      priceCurrency: 'INR',
      businessFunction: p.status === 'rent' ? 'http://purl.org/goodrelations/v1#LeaseOut' : 'http://purl.org/goodrelations/v1#Sell',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'RealEstateAgent', name: 'Aurelia Estates', telephone: '+91 98765 43210' }
    },
    about: {
      '@type': schemaType,
      name: p.title,
      address: { '@type': 'PostalAddress', streetAddress: p.address, addressLocality: p.city, addressCountry: 'IN' },
      floorSize: { '@type': 'QuantitativeValue', value: p.area, unitCode: 'FTK' }
    }
  };
  if (p.beds) { listing.about.numberOfRooms = p.beds; listing.about.numberOfBedrooms = p.beds; listing.about.numberOfBathroomsTotal = p.baths; }
  if (p.yearBuilt) listing.about.yearBuilt = p.yearBuilt;
  var ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify(listing);
  document.head.appendChild(ld);

  /* ---------- Markup ---------- */
  var badges = [];
  if (p.badges.indexOf('new') !== -1) badges.push('<span class="badge badge--new">New</span>');
  if (p.badges.indexOf('featured') !== -1) badges.push('<span class="badge badge--featured">Featured</span>');
  badges.push(p.status === 'rent' ? '<span class="badge badge--rent">For Rent</span>' : '<span class="badge badge--sale" style="background:var(--ivory-3)">For Sale</span>');

  var specs = [
    ['Price', A.priceText(p), 'home'],
    ['Type', A.typeLabel(p.type), 'home'],
    ['Area', A.formatArea(p.area), 'area']
  ];
  if (p.beds) specs.push(['Bedrooms', p.beds, 'bed']);
  if (p.baths) specs.push(['Bathrooms', p.baths, 'bath']);
  if (p.yearBuilt) specs.push(['Year built', p.yearBuilt, 'calendar']);
  if (p.parking) specs.push(['Parking', p.parking + ' spaces', 'car']);
  specs.push(['Furnishing', p.furnishing, 'sofa']);
  if (specs.length % 2) specs.push(['Status', p.status === 'rent' ? 'For rent' : 'For sale', 'check']);

  var thumbs = p.images.map(function (src, i) {
    return '<li><button type="button" class="gallery__thumb" data-thumb="' + i + '" aria-label="Show image ' + (i + 1) + ' of ' + p.images.length + '"' + (i === 0 ? ' aria-current="true"' : '') + '>' +
      '<img src="' + img(src, 320) + '" alt="" width="320" height="240" loading="lazy" decoding="async"></button></li>';
  }).join('');

  var mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(p.address);
  var shareText = encodeURIComponent(p.title + ' — ' + A.priceText(p) + ' in ' + place);
  var shareUrl = encodeURIComponent(pageUrl);
  var phoneHref = 'tel:' + agent.phone.replace(/\s/g, '');

  root.innerHTML =
    '<div class="detail-top"><div class="container">' +
      '<nav class="breadcrumb breadcrumb--dark" aria-label="Breadcrumb"><ol>' +
        '<li><a href="index.html">Home</a></li><li><a href="properties.html">Properties</a></li><li aria-current="page">' + esc(p.title) + '</li>' +
      '</ol></nav>' +
      '<header class="detail-header">' +
        '<div>' +
          '<div class="detail-header__badges">' + badges.join('') + '</div>' +
          '<h1>' + esc(p.title) + '</h1>' +
          '<p class="detail-header__location">' + A.icon('pin') + esc(p.address) + '</p>' +
        '</div>' +
        '<div class="detail-header__aside">' +
          '<p class="detail-header__price">' + A.priceHTML(p) + '</p>' +
          '<div class="detail-header__tools">' +
            '<button type="button" class="icon-btn" data-fav="' + esc(p.id) + '" aria-pressed="false">' + A.icon('heart') + '<span data-fav-label>Save</span></button>' +
            '<a class="icon-btn" href="#share">' + A.icon('share') + 'Share</a>' +
          '</div>' +
        '</div>' +
      '</header>' +

      '<section class="gallery" aria-label="Photo gallery">' +
        '<div class="gallery__main">' +
          '<img id="gallery-main" src="' + img(p.images[0], 1800) + '" alt="' + esc(p.title + ' — image 1') + '" width="1800" height="1000" fetchpriority="high">' +
          '<button type="button" class="gallery__open" data-open-lightbox aria-label="Open full-screen gallery"></button>' +
          '<button type="button" class="gallery__nav gallery__nav--prev" data-gallery-prev aria-label="Previous image">' + A.icon('arrow') + '</button>' +
          '<button type="button" class="gallery__nav gallery__nav--next" data-gallery-next aria-label="Next image">' + A.icon('arrow') + '</button>' +
          '<span class="gallery__count">' + A.icon('camera') + '<span id="gallery-count">1 / ' + p.images.length + '</span></span>' +
        '</div>' +
        '<ul class="gallery__thumbs" role="list">' + thumbs + '</ul>' +
      '</section>' +
    '</div></div>' +

    '<div class="container"><div class="detail-layout">' +
      '<div class="detail-main">' +
        '<section class="detail-section" aria-labelledby="overview-h">' +
          '<h2 id="overview-h">Property overview</h2>' +
          '<dl class="spec-grid">' + specs.map(function (s) {
            return '<div class="spec"><dt>' + A.icon(s[2]) + s[0] + '</dt><dd>' + esc(s[1]) + '</dd></div>';
          }).join('') + '</dl>' +
        '</section>' +
        '<section class="detail-section" aria-labelledby="desc-h">' +
          '<h2 id="desc-h">About this residence</h2>' +
          p.description.map(function (para) { return '<p>' + esc(para) + '</p>'; }).join('') +
        '</section>' +
        '<section class="detail-section" aria-labelledby="amen-h">' +
          '<h2 id="amen-h">Features &amp; amenities</h2>' +
          '<ul class="amenities" role="list">' + p.amenities.map(function (a) { return '<li>' + A.icon('check') + '<span>' + esc(a) + '</span></li>'; }).join('') + '</ul>' +
        '</section>' +
        '<section class="detail-section" aria-labelledby="loc-h">' +
          '<h2 id="loc-h">Location</h2>' +
          '<div class="map-placeholder" role="img" aria-label="Map placeholder showing ' + esc(place) + '">' +
            '<div class="map-placeholder__pin">' + A.icon('pin') +
              '<strong>' + esc(place) + '</strong>' +
              '<p>Exact location shared on request for privacy.</p>' +
              '<a class="link-arrow" href="' + mapsUrl + '" target="_blank" rel="noopener">View area on Google Maps ' + A.icon('arrow', 'icon--arrow') + '<span class="visually-hidden">(opens in a new tab)</span></a>' +
            '</div>' +
          '</div>' +
        '</section>' +
        '<section class="detail-section" id="share" aria-labelledby="share-h">' +
          '<h2 id="share-h">Share this property</h2>' +
          '<ul class="share-list" role="list">' +
            '<li><button type="button" data-native-share aria-label="Share via device" hidden>' + A.icon('share') + '</button></li>' +
            '<li><a href="https://wa.me/?text=' + shareText + '%20' + shareUrl + '" target="_blank" rel="noopener" aria-label="Share on WhatsApp">' + A.icon('whatsapp') + '</a></li>' +
            '<li><a href="https://www.linkedin.com/sharing/share-offsite/?url=' + shareUrl + '" target="_blank" rel="noopener" aria-label="Share on LinkedIn">' + A.icon('linkedin') + '</a></li>' +
            '<li><a href="https://twitter.com/intent/tweet?text=' + shareText + '&url=' + shareUrl + '" target="_blank" rel="noopener" aria-label="Share on X">' + A.icon('x') + '</a></li>' +
            '<li><a href="mailto:?subject=' + shareText + '&body=' + shareUrl + '" aria-label="Share by email">' + A.icon('mail') + '</a></li>' +
            '<li><button type="button" data-copy-link aria-label="Copy link">' + A.icon('link') + '</button></li>' +
          '</ul>' +
        '</section>' +
      '</div>' +

      '<aside class="detail-aside" aria-label="Contact the agent">' +
        '<div class="panel">' +
          '<div class="agent-card">' +
            '<img src="' + img(agent.photo, 200) + '" alt="' + esc(agent.name) + '" width="76" height="76" loading="lazy">' +
            '<div><h2 style="font-size:1.15rem;margin:0">' + esc(agent.name) + '</h2><p class="agent-card__role">' + esc(agent.role) + '</p></div>' +
            '<div class="agent-card__links">' +
              '<a href="' + phoneHref + '">' + A.icon('phone') + esc(agent.phone) + '</a>' +
              '<a href="mailto:' + esc(agent.email) + '?subject=' + encodeURIComponent('Enquiry: ' + p.title) + '">' + A.icon('mail') + esc(agent.email) + '</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="panel">' +
          '<h2>Arrange a private viewing</h2>' +
          '<p>Share a few details and ' + esc(agent.name.split(' ')[0]) + ' will be in touch within one business day.</p>' +
          '<form class="form" data-form data-success="modal" data-modal="#inquiry-modal" novalidate>' +
            '<input type="hidden" name="property" value="' + esc(p.title + ' (' + p.id + ')') + '">' +
            '<div class="hp-field" aria-hidden="true"><label for="i-company">Company</label><input id="i-company" name="company" tabindex="-1" autocomplete="off"></div>' +
            '<div class="field"><label for="i-name">Full name <span class="req" aria-hidden="true">*</span></label><input id="i-name" name="name" type="text" autocomplete="name" required minlength="2"><p class="field__error"></p></div>' +
            '<div class="field"><label for="i-email">Email <span class="req" aria-hidden="true">*</span></label><input id="i-email" name="email" type="email" autocomplete="email" required><p class="field__error"></p></div>' +
            '<div class="field"><label for="i-phone">Phone <span class="req" aria-hidden="true">*</span></label><input id="i-phone" name="phone" type="tel" autocomplete="tel" required placeholder="+91 98765 43210"><p class="field__error"></p></div>' +
            '<div class="field"><label for="i-message">Message</label><textarea id="i-message" name="message" rows="4">I’m interested in ' + esc(p.title) + ' and would like to arrange a viewing.</textarea><p class="field__error"></p></div>' +
            '<label class="check"><input type="checkbox" name="consent" required data-error="Please agree so we can contact you."> I agree to be contacted about this property.</label>' +
            '<p class="field__error" data-for="consent"></p>' +
            '<p class="form-status" data-form-status role="alert"></p>' +
            '<button type="submit" class="btn btn--gold btn--block"><span class="btn__label">Request viewing</span></button>' +
          '</form>' +
        '</div>' +
      '</aside>' +
    '</div></div>' +

    '<section class="section section--ivory2" aria-labelledby="similar-h"><div class="container">' +
      '<div class="section-head section-head--split"><div><span class="eyebrow">You may also like</span><h2 id="similar-h">Similar properties</h2></div>' +
      '<a class="link-arrow" href="properties.html?type=' + p.type + '">View all ' + A.typeLabel(p.type).toLowerCase() + 's ' + A.icon('arrow', 'icon--arrow') + '</a></div>' +
      '<div class="property-grid" id="similar"></div>' +
    '</div></section>';

  /* ---------- Similar properties: same type, then same city, then status ---------- */
  var similar = A.data.properties
    .filter(function (o) { return o.id !== p.id; })
    .map(function (o) {
      var score = (o.type === p.type ? 3 : 0) + (o.city === p.city ? 2 : 0) + (o.status === p.status ? 1 : 0);
      return { o: o, score: score };
    })
    .sort(function (a, b) { return b.score - a.score || Math.abs(a.o.price - p.price) - Math.abs(b.o.price - p.price); })
    .slice(0, 3)
    .map(function (x, i) { return A.renderCard(x.o, { index: i }); });
  document.getElementById('similar').innerHTML = similar.join('');
  A.reveal(root);
  A.syncFavButtons();

  /* ---------- Gallery + lightbox ---------- */
  var current = 0;
  var mainImg = document.getElementById('gallery-main');
  var countEl = document.getElementById('gallery-count');
  var thumbBtns = root.querySelectorAll('[data-thumb]');
  var lightbox = document.getElementById('lightbox');
  var lbImg = lightbox && lightbox.querySelector('[data-lb-img]');
  var lbCount = lightbox && lightbox.querySelector('[data-lb-count]');
  var lbCaption = lightbox && lightbox.querySelector('[data-lb-caption]');

  // Preload neighbours for snappy navigation
  function preload(i) { var im = new Image(); im.src = img(p.images[(i + p.images.length) % p.images.length], 1800); }

  function swap(el, src, alt) {
    if (A.reducedMotion()) { el.src = src; el.alt = alt; return; }
    el.classList.add('is-swapping');
    setTimeout(function () {
      el.src = src; el.alt = alt;
      var done = function () { el.classList.remove('is-swapping'); };
      if (el.complete) done(); else { el.onload = done; el.onerror = done; }
    }, 180);
  }

  function show(i) {
    current = (i + p.images.length) % p.images.length;
    var alt = p.title + ' — image ' + (current + 1);
    swap(mainImg, img(p.images[current], 1800), alt);
    countEl.textContent = (current + 1) + ' / ' + p.images.length;
    thumbBtns.forEach(function (t, n) { if (n === current) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current'); });
    if (lightbox && lightbox.open) {
      swap(lbImg, img(p.images[current], 2000), alt);
      lbCount.textContent = (current + 1) + ' / ' + p.images.length;
      lbCaption.textContent = p.title + ' · ' + place;
    }
    preload(current + 1);
  }

  root.querySelector('[data-gallery-prev]').addEventListener('click', function () { show(current - 1); });
  root.querySelector('[data-gallery-next]').addEventListener('click', function () { show(current + 1); });
  thumbBtns.forEach(function (t) { t.addEventListener('click', function () { show(parseInt(t.getAttribute('data-thumb'), 10)); }); });

  function openLightbox() {
    if (!lightbox) return;
    lbImg.src = img(p.images[current], 2000);
    lbImg.alt = p.title + ' — image ' + (current + 1);
    lbCount.textContent = (current + 1) + ' / ' + p.images.length;
    lbCaption.textContent = p.title + ' · ' + place;
    A.modal.open(lightbox);
  }
  root.querySelector('[data-open-lightbox]').addEventListener('click', openLightbox);

  if (lightbox) {
    lightbox.querySelector('[data-lb-prev]').addEventListener('click', function () { show(current - 1); });
    lightbox.querySelector('[data-lb-next]').addEventListener('click', function () { show(current + 1); });
    lightbox.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
    });
    // Click outside the image closes
    lightbox.querySelector('.lightbox__stage').addEventListener('click', function (e) { if (e.target === e.currentTarget) A.modal.close(lightbox); });
  }

  // Swipe on both the inline gallery and the lightbox
  function addSwipe(el) {
    var x0 = null, y0 = null;
    el.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    el.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1));
      x0 = y0 = null;
    });
  }
  addSwipe(root.querySelector('.gallery__main'));
  if (lightbox) addSwipe(lightbox.querySelector('.lightbox__stage'));

  // Arrow keys on the inline gallery when it has focus
  root.querySelector('.gallery').addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  /* ---------- Share ---------- */
  var nativeBtn = root.querySelector('[data-native-share]');
  if (navigator.share && nativeBtn) {
    nativeBtn.hidden = false;
    nativeBtn.addEventListener('click', function () {
      navigator.share({ title: p.title, text: p.title + ' — ' + A.priceText(p), url: pageUrl }).catch(function () {});
    });
  } else if (nativeBtn) {
    nativeBtn.parentNode.remove();
  }
  root.querySelector('[data-copy-link]').addEventListener('click', function () {
    var done = function () { A.toast('Link copied to clipboard'); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(pageUrl).then(done, fallback);
    else fallback();
    function fallback() {
      var t = document.createElement('textarea');
      t.value = pageUrl; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); done(); } catch (e) { A.toast('Copy failed — please copy the address bar'); }
      t.remove();
    }
  });
})();
