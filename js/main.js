/**
 * Aurelia Estates — main.js
 * ------------------------------------------------------------
 * Shared behaviour loaded on every page:
 *   - Aurelia namespace: formatting, icons, favourites, property cards, modal, toast
 *   - Header scroll state, mobile menu, smooth anchors
 *   - Scroll reveal, animated counters, hero parallax, button ripple
 *   - Testimonial slider, featured properties (home), hero search, FAQ accordion
 *
 * Depends on js/data/properties.js (window.AURELIA_DATA).
 */
(function () {
  'use strict';

  var A = (window.Aurelia = window.Aurelia || {});
  var DATA = window.AURELIA_DATA || { properties: [], agents: {}, img: function (s) { return s; } };
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  A.data = DATA;
  A.reducedMotion = function () { return motionQuery.matches; };

  /* ----------------------------------------------------------------------
   * Utilities
   * -------------------------------------------------------------------- */
  A.escape = function (str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /** Format an INR amount as "₹8.75 Cr" / "₹45 L". */
  A.formatINR = function (amount) {
    if (amount >= 1e7) return '₹' + (amount / 1e7).toFixed(2) + ' Cr';
    if (amount >= 1e5) return '₹' + (amount / 1e5).toFixed(2).replace(/\.?0+$/, '') + ' L';
    return '₹' + new Intl.NumberFormat('en-IN').format(amount);
  };

  /** Price label for a property — rentals get a "/ month" suffix. */
  A.priceHTML = function (p) {
    var value = A.formatINR(p.price);
    return p.status === 'rent' ? value + ' <small>/ month</small>' : value;
  };
  A.priceText = function (p) {
    return A.formatINR(p.price) + (p.status === 'rent' ? ' / month' : '');
  };

  A.formatArea = function (n) { return new Intl.NumberFormat('en-IN').format(n) + ' sq.ft'; };

  A.typeLabel = function (t) {
    return { apartment: 'Apartment', villa: 'Villa', plot: 'Plot', commercial: 'Commercial' }[t] || t;
  };

  A.getProperty = function (id) {
    for (var i = 0; i < DATA.properties.length; i++) if (DATA.properties[i].id === id) return DATA.properties[i];
    return null;
  };

  A.propertyUrl = function (p) { return 'property.html?id=' + encodeURIComponent(p.id); };

  /* ----------------------------------------------------------------------
   * Icons (inline SVG strings for JS-rendered markup)
   * -------------------------------------------------------------------- */
  var ICONS = {
    bed: '<path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8M2 16h20M5 10V6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v4"/>',
    bath: '<path d="M4 12h16v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-3zM6 12V5.5a2.5 2.5 0 0 1 5 0M7 20l-1 2M17 20l1 2"/>',
    area: '<path d="M3 8V3h5M21 8V3h-5M3 16v5h5M21 16v5h-5"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    heart: '<path d="M12 20.5s-7.5-4.6-9.3-9.6C1.5 7.5 3.8 4 7.3 4c2 0 3.4 1.1 4.7 2.8C13.3 5.1 14.7 4 16.7 4c3.5 0 5.8 3.5 4.6 6.9-1.8 5-9.3 9.6-9.3 9.6z"/>',
    arrow: '<path d="M4 12h16M14 6l6 6-6 6"/>',
    car: '<path d="M5 17h14M3 17v-4l2.2-5.2A2 2 0 0 1 7 6.5h10a2 2 0 0 1 1.8 1.3L21 13v4M6 17v2M18 17v2M3 13h18"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="1.5"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    sofa: '<path d="M4 11V8a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v3M2 13a2 2 0 0 1 4 0v2h12v-2a2 2 0 0 1 4 0v5H2v-5zM5 18v2M19 18v2"/>',
    home: '<path d="M3 11 12 4l9 7M5 10v10h14V10M10 20v-6h4v6"/>',
    check: '<path d="M4 12.5 9.5 18 20 6"/>',
    share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    phone: '<path d="M5 3h3.5l1.8 4.5-2.3 1.4a11 11 0 0 0 7.1 7.1l1.4-2.3L21 15.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m3.5 6 8.5 7 8.5-7"/>',
    whatsapp: '<path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3.2 3.1z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .8a4.6 4.6 0 0 1-2.2-2.2l.8-1-1-2z"/>',
    linkedin: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 10v7M8 7v.01M12 17v-7M12 13a3 3 0 0 1 6 0v4"/>',
    x: '<path d="M4 4l16 16M20 4 4 20"/>',
    expand: '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
    camera: '<path d="M3 8a2 2 0 0 1 2-2h2.5l1.5-2h6l1.5 2H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.5"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'
  };
  A.icon = function (name, cls) {
    return '<svg class="icon ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (ICONS[name] || '') + '</svg>';
  };

  /* ----------------------------------------------------------------------
   * Favourites (localStorage)
   * -------------------------------------------------------------------- */
  var FAV_KEY = 'aurelia:favorites';
  A.favorites = {
    list: function () {
      try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch (e) { return []; }
    },
    has: function (id) { return this.list().indexOf(id) !== -1; },
    toggle: function (id) {
      var list = this.list();
      var idx = list.indexOf(id);
      if (idx === -1) list.push(id); else list.splice(idx, 1);
      try { localStorage.setItem(FAV_KEY, JSON.stringify(list)); } catch (e) { /* storage unavailable */ }
      document.dispatchEvent(new CustomEvent('aurelia:favorites', { detail: { id: id, saved: idx === -1 } }));
      return idx === -1;
    }
  };

  /** Keep every favourite button for a property in sync. */
  function syncFavButtons() {
    document.querySelectorAll('[data-fav]').forEach(function (btn) {
      var saved = A.favorites.has(btn.getAttribute('data-fav'));
      btn.setAttribute('aria-pressed', String(saved));
      var label = btn.querySelector('[data-fav-label]');
      if (label) label.textContent = saved ? 'Saved' : 'Save';
    });
  }
  A.syncFavButtons = syncFavButtons;

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-fav]');
    if (!btn) return;
    e.preventDefault();
    var saved = A.favorites.toggle(btn.getAttribute('data-fav'));
    A.toast(saved ? 'Saved to your shortlist' : 'Removed from your shortlist');
  });
  document.addEventListener('aurelia:favorites', syncFavButtons);

  /* ----------------------------------------------------------------------
   * Property card renderer (shared by home, listings, similar properties)
   * -------------------------------------------------------------------- */
  A.renderCard = function (p, opts) {
    opts = opts || {};
    var esc = A.escape;
    var badges = [];
    if (p.badges.indexOf('new') !== -1) badges.push('<span class="badge badge--new">New</span>');
    if (p.badges.indexOf('featured') !== -1) badges.push('<span class="badge badge--featured">Featured</span>');
    badges.push(p.status === 'rent' ? '<span class="badge badge--rent">For Rent</span>' : '<span class="badge badge--sale">For Sale</span>');

    var meta = [];
    if (p.beds) meta.push('<li>' + A.icon('bed') + p.beds + ' <span class="visually-hidden">bedrooms</span><span aria-hidden="true">Beds</span></li>');
    if (p.baths) meta.push('<li>' + A.icon('bath') + p.baths + ' <span class="visually-hidden">bathrooms</span><span aria-hidden="true">Baths</span></li>');
    meta.push('<li>' + A.icon('area') + A.formatArea(p.area) + '</li>');
    if (!p.beds) meta.unshift('<li>' + A.icon('home') + A.typeLabel(p.type) + '</li>');

    var reveal = opts.reveal === false ? '' : ' data-reveal style="--reveal-delay:' + ((opts.index || 0) % 3) * 0.1 + 's"';
    var headingTag = opts.headingTag || 'h3';

    return (
      '<article class="property-card"' + reveal + '>' +
        '<div class="property-card__media">' +
          '<img src="' + DATA.img(p.images[0], 800) + '" alt="' + esc(p.title + ', ' + p.locality + ', ' + p.city) + '" width="800" height="600" loading="lazy" decoding="async">' +
          '<div class="property-card__badges">' + badges.join('') + '</div>' +
        '</div>' +
        '<button type="button" class="fav-btn" data-fav="' + esc(p.id) + '" aria-pressed="' + A.favorites.has(p.id) + '" aria-label="Save ' + esc(p.title) + ' to shortlist">' + A.icon('heart') + '</button>' +
        '<div class="property-card__body">' +
          '<p class="property-card__price">' + A.priceHTML(p) + '</p>' +
          '<' + headingTag + ' class="property-card__title"><a href="' + A.propertyUrl(p) + '">' + esc(p.title) + '</a></' + headingTag + '>' +
          '<p class="property-card__location">' + A.icon('pin') + esc(p.locality + ', ' + p.city) + '</p>' +
          '<p class="property-card__summary">' + esc(p.summary) + '</p>' +
          '<ul class="property-card__meta">' + meta.join('') + '</ul>' +
        '</div>' +
      '</article>'
    );
  };

  /* ----------------------------------------------------------------------
   * Toast
   * -------------------------------------------------------------------- */
  var toastEl, toastTimer;
  A.toast = function (message) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    requestAnimationFrame(function () { toastEl.classList.add('is-visible'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 2600);
  };

  /* ----------------------------------------------------------------------
   * Modal helpers (native <dialog>)
   * -------------------------------------------------------------------- */
  A.modal = {
    open: function (dialog) {
      if (typeof dialog === 'string') dialog = document.querySelector(dialog);
      if (!dialog) return;
      dialog._returnFocus = document.activeElement;
      if (!dialog._aureliaBound) {
        dialog._aureliaBound = true;
        // Native Esc closes the dialog without calling A.modal.close — clean up here too
        dialog.addEventListener('close', function () { afterClose(dialog); });
      }
      if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
      document.body.classList.add('is-locked');
    },
    close: function (dialog) {
      if (typeof dialog === 'string') dialog = document.querySelector(dialog);
      if (!dialog) return;
      if (typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open');
      afterClose(dialog);
    }
  };
  /** Restore page scroll and return focus to the element that opened the dialog. */
  function afterClose(dialog) {
    document.body.classList.remove('is-locked');
    var target = dialog._returnFocus;
    dialog._returnFocus = null;
    if (target && target.focus && document.contains(target)) target.focus();
  }
  function initDialogs() {
    document.addEventListener('click', function (e) {
      var closer = e.target.closest('[data-close-dialog]');
      if (closer) { A.modal.close(closer.closest('dialog')); return; }
      // Click on the backdrop (the dialog element itself) closes it
      if (e.target.tagName === 'DIALOG' && e.target.classList.contains('modal')) A.modal.close(e.target);
    });
  }

  /* ----------------------------------------------------------------------
   * Header: solid on scroll + hide/show of the shadow
   * -------------------------------------------------------------------- */
  function initHeader() {
    var header = document.querySelector('[data-header]');
    if (!header) return;
    var ticking = false;
    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ----------------------------------------------------------------------
   * Mobile menu
   * -------------------------------------------------------------------- */
  function initMobileMenu() {
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;
    var header = document.querySelector('[data-header]');

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.classList.toggle('is-open', open);
      menu.toggleAttribute('inert', !open);
      menu.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('is-locked', open);
      if (header) header.style.color = open ? 'var(--ivory)' : '';
      if (open) {
        var first = menu.querySelector('a');
        if (first) setTimeout(function () { first.focus(); }, 50);
      }
    }
    menu.setAttribute('inert', '');
    menu.setAttribute('aria-hidden', 'true');

    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
      // Simple focus trap between the toggle and menu links
      if (e.key === 'Tab' && toggle.getAttribute('aria-expanded') === 'true') {
        var items = [toggle].concat(Array.prototype.slice.call(menu.querySelectorAll('a, button')));
        var first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (mq) { if (mq.matches) setOpen(false); });
  }

  /* ----------------------------------------------------------------------
   * Smooth scroll for same-page anchors (CSS handles most; this moves focus)
   * -------------------------------------------------------------------- */
  function initSmoothAnchors() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link || link.getAttribute('href').length < 2) return;
      var target = document.getElementById(decodeURIComponent(link.getAttribute('href').slice(1)));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: A.reducedMotion() ? 'auto' : 'smooth', block: 'start' });
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      history.replaceState(null, '', link.getAttribute('href'));
    });
  }

  /* ----------------------------------------------------------------------
   * Scroll reveal (IntersectionObserver). Call A.reveal(root) for new nodes.
   * -------------------------------------------------------------------- */
  var revealObserver = null;
  A.reveal = function (root) {
    var nodes = (root || document).querySelectorAll('[data-reveal]:not(.is-visible)');
    if (!('IntersectionObserver' in window) || A.reducedMotion()) {
      nodes.forEach(function (n) { n.classList.add('is-visible'); });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    }
    nodes.forEach(function (n) { revealObserver.observe(n); });
  };

  /* ----------------------------------------------------------------------
   * Animated counters: <span data-count="2400" data-suffix="+">0</span>
   * -------------------------------------------------------------------- */
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var decimals = (el.getAttribute('data-count').split('.')[1] || '').length;
    var fmt = new Intl.NumberFormat('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    if (A.reducedMotion()) { el.textContent = prefix + fmt.format(target) + suffix; return; }
    var duration = 2000, start = null;
    function step(ts) {
      if (!start) start = ts;
      var t = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      el.textContent = prefix + fmt.format(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    if (!('IntersectionObserver' in window)) { counters.forEach(animateCounter); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCounter(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { io.observe(c); });
  }

  /* ----------------------------------------------------------------------
   * Parallax for hero media: <div data-parallax="0.3">
   * -------------------------------------------------------------------- */
  function initParallax() {
    var layers = document.querySelectorAll('[data-parallax]');
    if (!layers.length || A.reducedMotion()) return;
    var ticking = false;
    function update() {
      var y = window.scrollY;
      layers.forEach(function (layer) {
        if (y > window.innerHeight * 1.2) return; // off-screen, skip work
        var speed = parseFloat(layer.getAttribute('data-parallax')) || 0.3;
        layer.style.transform = 'translate3d(0,' + (y * speed).toFixed(1) + 'px,0)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
  }

  /* ----------------------------------------------------------------------
   * Button ripple
   * -------------------------------------------------------------------- */
  function initRipple() {
    document.addEventListener('pointerdown', function (e) {
      var btn = e.target.closest('.btn');
      if (!btn || A.reducedMotion()) return;
      var rect = btn.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);
      var ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 700);
    });
  }

  /* ----------------------------------------------------------------------
   * Testimonial slider: autoplay, arrows, dots, swipe, pause on hover/focus
   * -------------------------------------------------------------------- */
  function initSlider(root) {
    var track = root.querySelector('[data-slider-track]');
    var slides = Array.prototype.slice.call(track.children);
    var dotsWrap = root.querySelector('[data-slider-dots]');
    var prev = root.querySelector('[data-slider-prev]');
    var next = root.querySelector('[data-slider-next]');
    var interval = parseInt(root.getAttribute('data-autoplay'), 10) || 6500;
    var index = 0, timer = null, paused = false;

    slides.forEach(function (slide, i) {
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', (i + 1) + ' of ' + slides.length);
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'slider-dot';
      dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
      dot.addEventListener('click', function () { go(i); restart(); });
      dotsWrap.appendChild(dot);
    });
    var dots = dotsWrap.children;

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translate3d(' + (-index * 100) + '%,0,0)';
      slides.forEach(function (s, n) {
        s.setAttribute('aria-hidden', String(n !== index));
        s.toggleAttribute('inert', n !== index);
      });
      for (var d = 0; d < dots.length; d++) dots[d].setAttribute('aria-current', String(d === index));
    }
    function start() {
      if (A.reducedMotion() || paused) return;
      stop();
      timer = setInterval(function () { go(index + 1); }, interval);
    }
    function stop() { clearInterval(timer); timer = null; }
    function restart() { stop(); start(); }

    prev.addEventListener('click', function () { go(index - 1); restart(); });
    next.addEventListener('click', function () { go(index + 1); restart(); });
    root.addEventListener('mouseenter', function () { paused = true; stop(); });
    root.addEventListener('mouseleave', function () { paused = false; start(); });
    root.addEventListener('focusin', function () { paused = true; stop(); });
    root.addEventListener('focusout', function (e) { if (!root.contains(e.relatedTarget)) { paused = false; start(); } });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { go(index - 1); }
      if (e.key === 'ArrowRight') { go(index + 1); }
    });
    // Swipe
    var x0 = null;
    track.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) { go(index + (dx < 0 ? 1 : -1)); restart(); }
      x0 = null;
    });
    // Pause when tab hidden
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });

    go(0);
    // Only autoplay once the slider is on screen
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) start(); else stop(); });
      }, { threshold: 0.3 }).observe(root);
    } else start();
  }

  /* ----------------------------------------------------------------------
   * Home: featured properties
   * -------------------------------------------------------------------- */
  function initFeatured() {
    var wrap = document.querySelector('[data-featured]');
    if (!wrap) return;
    var limit = parseInt(wrap.getAttribute('data-featured'), 10) || 6;
    var featured = DATA.properties.filter(function (p) { return p.badges.indexOf('featured') !== -1 && p.status === 'sale' && p.type !== 'commercial'; }).slice(0, limit);
    wrap.innerHTML = featured.map(function (p, i) { return A.renderCard(p, { index: i }); }).join('');
    A.reveal(wrap);
  }

  /* ----------------------------------------------------------------------
   * Hero search -> properties.html with query params
   * -------------------------------------------------------------------- */
  function initHeroSearch() {
    var form = document.querySelector('[data-hero-search]');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var params = new URLSearchParams();
      new FormData(form).forEach(function (value, key) { if (String(value).trim()) params.set(key, String(value).trim()); });
      window.location.href = 'properties.html' + (params.toString() ? '?' + params.toString() : '');
    });
  }

  /* ----------------------------------------------------------------------
   * Accordion (FAQ)
   * -------------------------------------------------------------------- */
  function initAccordions() {
    document.querySelectorAll('[data-accordion]').forEach(function (acc) {
      acc.addEventListener('click', function (e) {
        var trigger = e.target.closest('.accordion__trigger');
        if (!trigger) return;
        var expanded = trigger.getAttribute('aria-expanded') === 'true';
        if (acc.hasAttribute('data-single')) {
          acc.querySelectorAll('.accordion__trigger[aria-expanded="true"]').forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
        }
        trigger.setAttribute('aria-expanded', String(!expanded));
      });
    });
  }

  /* ----------------------------------------------------------------------
   * Image fallback — swap broken remote images for a local placeholder
   * -------------------------------------------------------------------- */
  document.addEventListener('error', function (e) {
    var el = e.target;
    if (el && el.tagName === 'IMG' && !el.hasAttribute('data-fallback')) {
      el.setAttribute('data-fallback', '');
      el.removeAttribute('srcset');
      el.src = 'images/placeholder.svg';
    }
  }, true);

  /* ----------------------------------------------------------------------
   * Boot
   * -------------------------------------------------------------------- */
  function init() {
    document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
    initDialogs();
    initHeader();
    initMobileMenu();
    initSmoothAnchors();
    initFeatured();
    initHeroSearch();
    initAccordions();
    initCounters();
    initParallax();
    initRipple();
    document.querySelectorAll('[data-slider]').forEach(initSlider);
    A.reveal();
    syncFavButtons();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
