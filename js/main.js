/* ============================================================
   Idea AI — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  // ── Nav scroll effect ──────────────────────────────────────
  var navbar = document.getElementById('navbar');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNavLink();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile menu toggle (same pattern as adpye) ─────────────
  var navToggle   = document.getElementById('navToggle');
  var mobileMenu  = document.getElementById('mobileMenu');
  var iconOpen    = document.getElementById('icon-hamburger');
  var iconClose   = document.getElementById('icon-close');

  if (navToggle && mobileMenu && iconOpen && iconClose) {
    navToggle.addEventListener('click', function () {
      var isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isExpanded));

      if (isExpanded) {
        // Close menu
        mobileMenu.style.display = 'none';
        iconOpen.style.display = '';
        iconClose.style.display = 'none';
      } else {
        // Open menu
        mobileMenu.style.display = 'flex';
        iconOpen.style.display = 'none';
        iconClose.style.display = '';
      }
    });

    // Close on link click
    mobileMenu.querySelectorAll('.mobile-menu__link').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.style.display = 'none';
        iconOpen.style.display = '';
        iconClose.style.display = 'none';
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Active nav link on scroll ──────────────────────────────
  var sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    var scrollPos = window.scrollY + 130;
    sections.forEach(function (section) {
      var top    = section.offsetTop;
      var bottom = top + section.offsetHeight;
      var id     = section.getAttribute('id');
      var links  = document.querySelectorAll('.nav-link[href="#' + id + '"]');
      links.forEach(function (link) {
        link.classList.toggle('active', scrollPos >= top && scrollPos < bottom);
      });
    });
  }

  // ── Footer year ────────────────────────────────────────────
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Contact form (Formspree) ───────────────────────────────
  var form = document.getElementById('contactForm');
  if (form) {
    var submitBtn  = document.getElementById('submitBtn');
    var btnText    = submitBtn.querySelector('.btn-text');
    var btnLoading = submitBtn.querySelector('.btn-loading');
    var formStatus = document.getElementById('formStatus');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      submitBtn.disabled = true;
      btnText.hidden    = true;
      btnLoading.hidden = false;
      formStatus.hidden = true;
      formStatus.className = 'form-status';

      try {
        var response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          formStatus.textContent = '✓ Message sent! I\'ll get back to you soon.';
          formStatus.classList.add('form-status--success');
          form.reset();
        } else {
          var json = await response.json().catch(function() { return {}; });
          var msg  = json.errors && json.errors.length
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
  var style = document.createElement('style');
  style.textContent = '.fade-in{opacity:0;transform:translateY(24px);transition:opacity .55s ease,transform .55s ease}.fade-in.visible{opacity:1;transform:none}';
  document.head.appendChild(style);

  var targets = document.querySelectorAll(
    '.product-card, .highlight, .contact-item, .visual-card, .about-text p, .coming-soon'
  );

  targets.forEach(function (el, i) {
    el.classList.add('fade-in');
    el.style.transitionDelay = (i * 0.04) + 's';
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

  targets.forEach(function (el) { observer.observe(el); });

})();
