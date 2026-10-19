/**
 * Aurelia Estates — properties.js
 * ------------------------------------------------------------
 * Listings page: filtering, sorting, grid/list toggle, skeleton
 * loading, empty state and URL sync (filters are shareable links).
 *
 * URL params: location, type, budget, beds, status, sort, saved
 *   budget format: "<status>:<min>:<max>"  e.g. "sale:30000000:60000000"
 */
(function () {
  'use strict';

  var A = window.Aurelia;
  var form = document.querySelector('[data-filters]');
  var results = document.getElementById('results');
  if (!A || !form || !results) return;

  var countEl = document.getElementById('results-count');
  var sortEl = document.getElementById('sort');
  var viewBtns = document.querySelectorAll('[data-view]');
  var toggleBtn = form.querySelector('.filters__toggle');
  var body = document.getElementById('filters-body');
  var activeCountEl = form.querySelector('[data-active-count]');
  var VIEW_KEY = 'aurelia:view';
  var all = A.data.properties.slice();
  var renderTimer = null;

  /* ---------- Populate the location suggestions from the data ---------- */
  var datalist = document.getElementById('location-options');
  if (datalist) {
    var seen = {};
    all.forEach(function (p) { seen[p.city] = 1; seen[p.locality + ', ' + p.city] = 1; });
    datalist.innerHTML = Object.keys(seen).sort().map(function (l) { return '<option value="' + A.escape(l) + '"></option>'; }).join('');
  }

  /* ---------- Read state from URL into the form ---------- */
  var params = new URLSearchParams(window.location.search);
  ['location', 'type', 'budget', 'beds', 'status'].forEach(function (key) {
    var field = form.elements[key];
    if (field && params.has(key)) field.value = params.get(key);
  });
  if (form.elements.saved) form.elements.saved.checked = params.get('saved') === '1';
  if (params.has('sort')) sortEl.value = params.get('sort');

  /* ---------- State helpers ---------- */
  function getState() {
    return {
      location: form.elements.location.value.trim().toLowerCase(),
      type: form.elements.type.value,
      budget: form.elements.budget.value,
      beds: parseInt(form.elements.beds.value, 10) || 0,
      status: form.elements.status.value,
      saved: form.elements.saved ? form.elements.saved.checked : false,
      sort: sortEl.value
    };
  }

  function writeUrl(state) {
    var q = new URLSearchParams();
    if (state.location) q.set('location', form.elements.location.value.trim());
    if (state.type) q.set('type', state.type);
    if (state.budget) q.set('budget', state.budget);
    if (state.beds) q.set('beds', state.beds);
    if (state.status) q.set('status', state.status);
    if (state.saved) q.set('saved', '1');
    if (state.sort && state.sort !== 'newest') q.set('sort', state.sort);
    var qs = q.toString();
    history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : ''));
  }

  /* ---------- Filtering & sorting ---------- */
  function matches(p, s) {
    if (s.location) {
      var hay = (p.title + ' ' + p.locality + ' ' + p.city + ' ' + p.address).toLowerCase();
      // Every word typed must appear somewhere (so "bandra mumbai" works)
      var words = s.location.replace(/,/g, ' ').split(/\s+/).filter(Boolean);
      for (var i = 0; i < words.length; i++) if (hay.indexOf(words[i]) === -1) return false;
    }
    if (s.type && p.type !== s.type) return false;
    if (s.status && p.status !== s.status) return false;
    if (s.beds && p.beds < s.beds) return false;
    if (s.budget) {
      var parts = s.budget.split(':');
      var bStatus = parts[0], min = parseFloat(parts[1]) || 0, max = parseFloat(parts[2]) || Infinity;
      if (p.status !== bStatus || p.price < min || p.price >= max) return false;
    }
    if (s.saved && !A.favorites.has(p.id)) return false;
    return true;
  }

  function sortList(list, sort) {
    var sorted = list.slice();
    if (sort === 'price-asc') sorted.sort(function (a, b) { return a.price - b.price; });
    else if (sort === 'price-desc') sorted.sort(function (a, b) { return b.price - a.price; });
    else sorted.sort(function (a, b) { return new Date(b.listedOn) - new Date(a.listedOn); });
    return sorted;
  }

  function activeFilterCount(s) {
    return ['location', 'type', 'budget', 'beds', 'status', 'saved'].filter(function (k) { return !!s[k]; }).length;
  }

  /* ---------- Rendering ---------- */
  function skeleton(n) {
    var card =
      '<div class="skeleton-card" aria-hidden="true">' +
        '<div class="skeleton skeleton-card__media"></div>' +
        '<div class="skeleton-card__body">' +
          '<div class="skeleton skeleton--title"></div>' +
          '<div class="skeleton skeleton--line"></div>' +
          '<div class="skeleton skeleton--line skeleton--short"></div>' +
        '</div>' +
      '</div>';
    return new Array(n + 1).join(card);
  }

  function emptyState() {
    return (
      '<div class="empty-state" role="status">' +
        A.icon('search') +
        '<h2>No residences match your search</h2>' +
        '<p>Try widening your budget or location — or tell us what you are looking for and our advisors will search our off-market portfolio for you.</p>' +
        '<div class="hero__actions" style="justify-content:center;margin-top:.5rem">' +
          '<button type="button" class="btn btn--outline" data-reset-filters><span class="btn__label">Clear all filters</span></button>' +
          '<a class="btn btn--gold" href="contact.html?subject=Property%20search%20request"><span class="btn__label">Request a private search</span></a>' +
        '</div>' +
      '</div>'
    );
  }

  function render(delay) {
    var state = getState();
    writeUrl(state);
    if (activeCountEl) {
      var n = activeFilterCount(state);
      activeCountEl.textContent = n ? '(' + n + ')' : '';
    }

    results.setAttribute('aria-busy', 'true');
    results.innerHTML = skeleton(Math.min(6, Math.max(3, all.length)));
    clearTimeout(renderTimer);

    // The short delay keeps the skeleton visible long enough to avoid a jarring
    // flash; replace with a real fetch() when listings come from an API.
    renderTimer = setTimeout(function () {
      var list = sortList(all.filter(function (p) { return matches(p, state); }), state.sort);
      results.innerHTML = list.length
        ? list.map(function (p, i) { return A.renderCard(p, { index: i, headingTag: 'h2' }); }).join('')
        : emptyState();
      results.setAttribute('aria-busy', 'false');
      countEl.innerHTML = 'Showing <strong>' + list.length + '</strong> of ' + all.length + ' properties';
      A.reveal(results);
      updateSchema(list);
    }, delay);
  }

  /* ---------- JSON-LD ItemList for the current results ---------- */
  function updateSchema(list) {
    var el = document.getElementById('listings-schema');
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = 'listings-schema';
      document.head.appendChild(el);
    }
    var base = window.location.origin + window.location.pathname.replace(/[^/]*$/, '');
    el.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Aurelia Estates property listings',
      numberOfItems: list.length,
      itemListElement: list.map(function (p, i) {
        return { '@type': 'ListItem', position: i + 1, url: base + A.propertyUrl(p), name: p.title };
      })
    });
  }

  /* ---------- View toggle ---------- */
  function setView(view) {
    results.classList.toggle('is-list', view === 'list');
    viewBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-view') === view)); });
    try { localStorage.setItem(VIEW_KEY, view); } catch (e) { /* ignore */ }
  }
  viewBtns.forEach(function (b) { b.addEventListener('click', function () { setView(b.getAttribute('data-view')); }); });
  var storedView = 'grid';
  try { storedView = localStorage.getItem(VIEW_KEY) || 'grid'; } catch (e) { /* ignore */ }
  setView(storedView);

  /* ---------- Mobile filter panel toggle ---------- */
  var desktop = window.matchMedia('(min-width: 1024px)');
  if (toggleBtn && body) {
    if (!desktop.matches) body.hidden = true;
    toggleBtn.addEventListener('click', function () {
      var open = toggleBtn.getAttribute('aria-expanded') !== 'true';
      toggleBtn.setAttribute('aria-expanded', String(open));
      body.hidden = !open;
    });
  }

  /* ---------- Events ---------- */
  var debounce;
  form.addEventListener('input', function (e) {
    if (e.target.name === 'location') {
      clearTimeout(debounce);
      debounce = setTimeout(function () { render(250); }, 300);
    }
  });
  form.addEventListener('change', function (e) {
    if (e.target.name === 'location') return; // handled by input
    // Choosing a rent budget implies "For rent" (and vice versa)
    if (e.target.name === 'budget' && e.target.value) form.elements.status.value = e.target.value.split(':')[0];
    if (e.target.name === 'status' && form.elements.budget.value && form.elements.budget.value.split(':')[0] !== e.target.value) form.elements.budget.value = '';
    render(300);
  });
  form.addEventListener('submit', function (e) { e.preventDefault(); clearTimeout(debounce); render(250); });
  form.addEventListener('reset', function () { setTimeout(function () { render(250); }, 0); });
  sortEl.addEventListener('change', function () { render(250); });
  results.addEventListener('click', function (e) {
    if (e.target.closest('[data-reset-filters]')) { form.reset(); }
  });
  // Re-filter when a card is un-saved while "saved only" is active
  document.addEventListener('aurelia:favorites', function () { if (form.elements.saved && form.elements.saved.checked) render(150); });

  render(650);
})();
