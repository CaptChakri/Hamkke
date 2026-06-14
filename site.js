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

    [['how', 'How it works'], ['trust', 'Trust & safety'], ['features', 'Features'],
     ['pricing', 'Pricing'], ['faq', 'FAQ']].forEach(function (item) {
      var a = document.createElement('a');
      a.href = '#' + item[0];
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
  // No backend yet — validate client-side, remember the signup in
  // localStorage so a reload greets the member instead of re-asking,
  // and swap the form for a success state.
  var form = document.getElementById('signup');
  if (form) {
    var input = document.getElementById('signup-email');
    var msg = document.getElementById('signup-msg');
    var STORE = 'hamkke.earlyaccess';
    // Pragmatic check — type=email already guards in the browser, this is
    // the friendlier second pass with our own copy.
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    // Clear the error the moment they start correcting it.
    input.addEventListener('input', clearError);

    function succeed(email) {
      try {
        var list = JSON.parse(localStorage.getItem(STORE) || '[]');
        if (list.indexOf(email) < 0) list.push(email);
        localStorage.setItem(STORE, JSON.stringify(list));
      } catch (err) { /* storage blocked — still show success */ }

      form.innerHTML =
        '<div class="signup-done" role="status">' +
        '  <span class="signup-check" aria-hidden="true">' +
        '    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5L20 6"/></svg>' +
        '  </span>' +
        '  <h3>You’re on the list.</h3>' +
        '  <p>We’ll email <b></b> the moment we open up your gym.</p>' +
        '</div>';
      // textContent so the address can never be injected as markup.
      form.querySelector('.signup-done b').textContent = email;
      form.classList.add('is-done');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (input.value || '').trim();
      if (!email) { showError('Enter your email to join.'); return; }
      if (!EMAIL_RE.test(email)) { showError('That doesn’t look like a valid email.'); return; }
      succeed(email);
    });

    // Already signed up in this browser? Greet them instead of re-asking.
    try {
      var prev = JSON.parse(localStorage.getItem(STORE) || '[]');
      if (prev.length) succeed(prev[prev.length - 1]);
    } catch (err) { /* ignore */ }
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
