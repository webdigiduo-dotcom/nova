/**
 * Aurelia Estates — forms.js
 * ------------------------------------------------------------
 * Accessible client-side validation and submission for every
 * <form data-form novalidate>.
 *
 * Attributes on the <form>:
 *   data-success="modal"   + data-modal="#dialog-id"  -> opens a confirmation dialog
 *   data-success="inline"                             -> swaps the form for [data-form-success]
 *   data-success="message" + data-success-message="…" -> shows a status message
 *   data-endpoint="https://…"  POSTs FormData there (e.g. Formspree, Netlify, your API).
 *                              Without it, submission is simulated so the UI can be demoed.
 *
 * Field rules come from standard attributes: required, type="email",
 * type="tel", minlength, pattern. Custom message: data-error="…".
 * A hidden honeypot field named "company" silently drops bot submissions.
 */
(function () {
  'use strict';

  var A = window.Aurelia || {};
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var uid = 0;

  function labelText(field) {
    var label = field.id && document.querySelector('label[for="' + field.id + '"]');
    return label ? label.textContent.replace('*', '').trim().toLowerCase() : 'this field';
  }

  /** Returns an error message, or '' when the field is valid. */
  function validateField(field) {
    var value = field.type === 'checkbox' ? field.checked : field.value.trim();
    var custom = field.getAttribute('data-error');

    if (field.required && !value) {
      if (custom) return custom;
      if (field.tagName === 'SELECT') return 'Please choose ' + labelText(field) + '.';
      if (field.type === 'tel') return 'Please enter your phone number.';
      return 'Please enter your ' + labelText(field) + '.';
    }
    if (!value || field.type === 'checkbox') return '';

    if (field.type === 'email' && !EMAIL_RE.test(value)) return 'Please enter a valid email address (e.g. name@example.com).';
    if (field.type === 'tel') {
      var digits = value.replace(/\D/g, '');
      if (!/^\+?[\d\s()\-.]+$/.test(value) || digits.length < 10 || digits.length > 15) return 'Please enter a valid phone number (10–15 digits).';
    }
    var min = parseInt(field.getAttribute('minlength'), 10);
    if (min && value.length < min) return 'Please enter at least ' + min + ' characters.';
    var pattern = field.getAttribute('pattern');
    if (pattern && !new RegExp('^(?:' + pattern + ')$').test(value)) return custom || 'Please check the format of this field.';
    return '';
  }

  function errorEl(form, field) {
    var el = form.querySelector('.field__error[data-for="' + field.name + '"]');
    if (!el) {
      var wrap = field.closest('.field');
      el = wrap ? wrap.querySelector('.field__error') : null;
    }
    return el;
  }

  function showError(form, field, message) {
    var el = errorEl(form, field);
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (!el) return;
    if (!el.id) el.id = 'err-' + (field.id || field.name) + '-' + (++uid);
    var describedBy = (field.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
    if (describedBy.indexOf(el.id) === -1) { describedBy.push(el.id); field.setAttribute('aria-describedby', describedBy.join(' ')); }
    el.textContent = message;
  }

  function fieldsOf(form) {
    return Array.prototype.filter.call(form.elements, function (f) {
      return f.name && !f.disabled && f.type !== 'hidden' && f.type !== 'submit' && f.name !== 'company' && f.willValidate !== false;
    });
  }

  function validateForm(form) {
    var firstInvalid = null;
    fieldsOf(form).forEach(function (field) {
      var msg = validateField(field);
      showError(form, field, msg);
      if (msg && !firstInvalid) firstInvalid = field;
    });
    return firstInvalid;
  }

  function setStatus(form, type, message) {
    var status = form.querySelector('[data-form-status]');
    if (!status) return;
    status.className = 'form-status' + (type ? ' form-status--' + type : '');
    status.textContent = message || '';
  }

  function send(form) {
    var endpoint = form.getAttribute('data-endpoint');
    if (!endpoint) {
      // Demo mode: simulate network latency.
      return new Promise(function (resolve) { setTimeout(resolve, 1100); });
    }
    return fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res; });
  }

  function onSuccess(form) {
    var mode = form.getAttribute('data-success') || 'message';
    var name = form.elements.name ? form.elements.name.value.trim().split(' ')[0] : '';
    form.reset();
    fieldsOf(form).forEach(function (f) { f.removeAttribute('aria-invalid'); });
    form.removeAttribute('data-submitted');

    if (mode === 'modal') {
      var dialog = document.querySelector(form.getAttribute('data-modal'));
      var nameSlot = dialog && dialog.querySelector('[data-name]');
      if (nameSlot) nameSlot.textContent = name ? ', ' + name : '';
      if (A.modal) A.modal.open(dialog);
      setStatus(form, '', '');
    } else if (mode === 'inline') {
      var success = form.parentElement.querySelector('[data-form-success]');
      if (success) {
        var slot = success.querySelector('[data-name]');
        if (slot) slot.textContent = name ? ', ' + name : '';
        form.hidden = true;
        success.hidden = false;
        success.setAttribute('tabindex', '-1');
        success.focus();
      }
    } else {
      setStatus(form, 'success', form.getAttribute('data-success-message') || 'Thank you — we’ll be in touch shortly.');
    }
  }

  function initForm(form) {
    if (form._auroraInit) return;
    form._auroraInit = true;

    // Live re-validation after the first submit attempt, and on blur
    form.addEventListener('input', function (e) {
      if (form.hasAttribute('data-submitted') && e.target.name) showError(form, e.target, validateField(e.target));
    });
    form.addEventListener('change', function (e) {
      if (form.hasAttribute('data-submitted') && e.target.name) showError(form, e.target, validateField(e.target));
    });
    form.addEventListener('focusout', function (e) {
      var f = e.target;
      if (f.name && f.value && f.type !== 'checkbox') showError(form, f, validateField(f));
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.setAttribute('data-submitted', '');
      setStatus(form, '', '');

      var invalid = validateForm(form);
      if (invalid) {
        setStatus(form, 'error', 'Please correct the highlighted fields and try again.');
        invalid.focus();
        return;
      }

      // Honeypot: pretend success for bots
      if (form.elements.company && form.elements.company.value) { onSuccess(form); return; }

      var btn = form.querySelector('[type="submit"]');
      btn.classList.add('is-loading');
      btn.setAttribute('aria-busy', 'true');
      btn.disabled = true;

      send(form)
        .then(function () { onSuccess(form); })
        .catch(function () {
          setStatus(form, 'error', 'Sorry, something went wrong sending your message. Please try again, or call us on +91 98765 43210.');
        })
        .then(function () {
          btn.classList.remove('is-loading');
          btn.removeAttribute('aria-busy');
          btn.disabled = false;
        });
    });
  }

  /** Prefill the contact form from URL params (?subject=…&property=…). */
  function prefill() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var params = new URLSearchParams(window.location.search);
    var subject = params.get('subject');
    if (subject && form.elements.subject) {
      var select = form.elements.subject;
      var match = Array.prototype.find.call(select.options, function (o) { return o.value.toLowerCase() === subject.toLowerCase(); });
      if (!match) { match = new Option(subject, subject); select.add(match); }
      select.value = match.value;
    }
    var prop = params.get('property');
    if (prop && form.elements.message && !form.elements.message.value) {
      form.elements.message.value = 'I would like to know more about ' + prop + '.';
    }
  }

  A.forms = { init: function (root) { (root || document).querySelectorAll('form[data-form]').forEach(initForm); } };

  function boot() { prefill(); A.forms.init(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
