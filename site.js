/* Hamkke site — interactions */
(function () {
  'use strict';

  // ── FAQ accordion ─────────────────────────────────────────────
  // Animation is handled in CSS (grid-template-rows 0fr→1fr), which
  // stays correct when the viewport is resized while an item is open.
  var faqList = document.getElementById('faqList');
  if (faqList) {
    faqList.addEventListener('click', function (e) {
      var btn = e.target.closest('.qa > button');
      if (!btn) return;
      var qa = btn.parentElement;
      var open = qa.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  }

  // ── Training-calendar heatmap (decorative) ───────────────────
  // Fill the Progress mockup's calendar with deterministic "activity"
  // so it reads like a real GitHub-style contribution grid.
  var LEVELS = ['var(--bg-soft)', 'rgba(207,212,218,0.3)', 'rgba(207,212,218,0.55)', 'rgba(207,212,218,0.78)', 'var(--accent)'];
  document.querySelectorAll('[data-heat]').forEach(function (grid) {
    var cells = 13 * 7; // weeks × days
    for (var i = 0; i < cells; i++) {
      var r = Math.sin(i * 12.9898) * 43758.5453;
      r = r - Math.floor(r); // deterministic 0..1
      // ~30% rest days; the rest spread across levels 1–4, busier lately.
      var level = r < 0.3 ? 0 : Math.min(4, 1 + Math.floor(r * 4 * (0.6 + i / cells)));
      var cell = document.createElement('span');
      cell.style.background = LEVELS[level];
      grid.appendChild(cell);
    }
  });

  // ── Scroll reveal ─────────────────────────────────────────────
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    // No IntersectionObserver — show everything immediately.
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // ── Mobile menu ───────────────────────────────────────────────
  var burger = document.getElementById('burger');
  var menu = null;

  function buildMenu() {
    menu = document.createElement('div');
    menu.id = 'mobile-menu';

    [['#how', 'How it works'], ['#trust', 'Trust & safety'], ['#features', 'Features'],
     ['#faq', 'FAQ'], ['/changelog', 'Changelog']].forEach(function (item) {
      var a = document.createElement('a');
      a.href = item[0];
      a.textContent = item[1];
      a.className = 'mm-link';
      a.addEventListener('click', closeMenu);
      menu.appendChild(a);
    });

    var cta = document.createElement('a');
    cta.href = '#get';
    cta.textContent = 'Get early access';
    cta.className = 'btn btn-primary mm-cta';
    cta.addEventListener('click', closeMenu);
    menu.appendChild(cta);

    document.body.appendChild(menu);
  }

  function openMenu() {
    if (!menu) buildMenu();
    document.body.classList.add('menu-open');
    burger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    document.body.classList.remove('menu-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }

  if (burger) {
    burger.setAttribute('aria-expanded', 'false');
    burger.addEventListener('click', function () {
      if (document.body.classList.contains('menu-open')) closeMenu();
      else openMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  // ── Early-access signup ───────────────────────────────────────
  // Static GitHub Pages has no backend, so the form posts to Formspree
  // (AJAX + JSON) and the email lands in the Formspree dashboard, ready
  // to export when we email the waitlist at launch.
  //
  // SETUP: create a form at https://formspree.io, then paste its endpoint
  // below (looks like https://formspree.io/f/abcdwxyz). Until that's done
  // the form falls back to a pre-filled mailto so signups still reach us.
  var FORM_ENDPOINT = 'https://formspree.io/f/mykqkkzy';
  var SIGNUP_TO = 'hello@hamkke.fit';

  var form = document.getElementById('signup');
  if (form) {
    var input = document.getElementById('signup-email');
    var msg = document.getElementById('signup-msg');
    var submitBtn = form.querySelector('.signup-btn');
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var endpointReady = FORM_ENDPOINT.indexOf('YOUR_FORM_ID') === -1;

    function showError(text) {
      input.classList.add('is-error');
      msg.textContent = text;
      msg.className = 'signup-msg error';
      input.focus();
    }

    function clearError() {
      input.classList.remove('is-error');
      msg.textContent = '';
      msg.className = 'signup-msg';
    }

    function showDone(html) {
      form.innerHTML =
        '<div class="signup-done" role="status">' +
        '  <span class="signup-check" aria-hidden="true">' +
        '    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5L20 6"/></svg>' +
        '  </span>' + html +
        '</div>';
      form.classList.add('is-done');
    }

    // No backend wired yet (or the network call failed): open a pre-filled
    // email so the request still has a path to reach us.
    function mailtoFallback(email) {
      var subject = 'Hamkke early access request';
      var body =
        'Please add me to the Hamkke early access list.\n\n' +
        'Email: ' + email + '\n' +
        'Source: https://hamkke.fit/';
      window.location.href =
        'mailto:' + SIGNUP_TO +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      showDone(
        '<h3>You’re nearly on the list.</h3>' +
        '<p>Your email app should open with a ready-to-send request.</p>' +
        '<p class="signup-fine">Send that email and we’ll add you to early access. If nothing opened, email hello@hamkke.fit directly.</p>'
      );
    }

    function setLoading(on) {
      if (!submitBtn) return;
      submitBtn.disabled = on;
      submitBtn.classList.toggle('is-loading', on);
    }

    input.addEventListener('input', clearError);

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var email = (input.value || '').trim();

      if (!email) {
        showError('Enter your email to join.');
        return;
      }

      if (!EMAIL_RE.test(email)) {
        showError('That doesn’t look like a valid email.');
        return;
      }

      if (!endpointReady) {
        mailtoFallback(email);
        return;
      }

      clearError();
      setLoading(true);

      var data = new FormData();
      data.append('email', email);
      data.append('_subject', 'Hamkke early access request');
      data.append('source', 'https://hamkke.fit/');

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (res.ok) {
            showDone(
              '<h3>You’re on the list.</h3>' +
              '<p>We’ll send one heads-up the moment Hamkke opens in your gym.</p>'
            );
            return;
          }
          // Formspree returns 4xx with a JSON error (e.g. invalid email).
          return res.json().then(function (out) {
            var first = out && out.errors && out.errors[0];
            setLoading(false);
            showError(first && first.message ? first.message : 'Something went wrong. Try again.');
          });
        })
        .catch(function () {
          // Network/blocked: don't lose the signup — hand off to email.
          mailtoFallback(email);
        });
    });
  }

  // Any in-page "Get early access" CTA jumps to #get; once the smooth
  // scroll settles, drop the cursor into the email field. Delegated so it
  // also covers the CTA the mobile menu builds at runtime. preventScroll
  // keeps focus from yanking the page mid-scroll.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href="#get"]');
    if (!a) return;
    var el = document.getElementById('signup-email');
    if (!el) return;
    setTimeout(function () {
      try { el.focus({ preventScroll: true }); } catch (err) { el.focus(); }
    }, 420);
  });
})();
