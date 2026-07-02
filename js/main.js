/* ============================================================
   IDEA AI — Main JavaScript
   Vanilla JS only. No framework.
   ============================================================ */

(function () {
  'use strict';

  // ── Nav scroll effect ──────────────────────────────────────
  const navbar = document.getElementById('navbar');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNavLink();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile nav toggle ──────────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    // Animate hamburger → X
    navToggle.classList.toggle('is-open', open);
  });

  navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('is-open');
    });
  });

  // Close nav if user taps outside
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('is-open');
    }
  });

  // ── Active nav link on scroll ──────────────────────────────
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 130;
    sections.forEach(function (section) {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector('.nav-link[href="#' + id + '"]');
      if (link) {
        link.classList.toggle('active', scrollPos >= top && scrollPos < bottom);
      }
    });
  }

  // ── Footer year ────────────────────────────────────────────
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Contact form (Formspree) ───────────────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    const submitBtn  = document.getElementById('submitBtn');
    const btnText    = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const formStatus = document.getElementById('formStatus');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Loading state
      submitBtn.disabled = true;
      btnText.hidden    = true;
      btnLoading.hidden = false;
      formStatus.hidden = true;
      formStatus.className = 'form-status';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          formStatus.textContent = '✓ Message sent! I\'ll get back to you soon.';
          formStatus.classList.add('form-status--success');
          form.reset();
        } else {
          const json = await response.json().catch(() => ({}));
          const msg  = json.errors && json.errors.length
            ? json.errors.map(function (err) { return err.message; }).join(', ')
            : 'Something went wrong. Please try again.';
          throw new Error(msg);
        }
      } catch (err) {
        formStatus.textContent = '✗ ' + (err.message || 'Could not send. Please try again.');
        formStatus.classList.add('form-status--error');
      } finally {
        formStatus.hidden = false;
        submitBtn.disabled = false;
        btnText.hidden    = false;
        btnLoading.hidden = true;
      }
    });
  }

  // ── Scroll-in animation (IntersectionObserver) ────────────
  const style = document.createElement('style');
  style.textContent = '.fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.55s ease, transform 0.55s ease; } .fade-in.visible { opacity: 1; transform: none; }';
  document.head.appendChild(style);

  const targets = document.querySelectorAll(
    '.product-card, .highlight, .contact-item, .visual-card, .about-text p, .coming-soon'
  );

  targets.forEach(function (el, i) {
    el.classList.add('fade-in');
    el.style.transitionDelay = (i * 0.04) + 's';
  });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

  targets.forEach(function (el) { observer.observe(el); });

})();
