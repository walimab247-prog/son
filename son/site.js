/* site.js — My Sonic Lab: mobile menu · smooth scroll · FAQ accordion · footer year */
(function () {
  'use strict';

  /* ── helpers ──────────────────────────────────────────────────── */
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return (ctx || document).querySelectorAll(sel); }

  /* ── footer year ──────────────────────────────────────────────── */
  function updateYear() {
    var year = new Date().getFullYear();
    qsa('[data-section="footer"] .footer-year').forEach(function (el) {
      el.textContent = year;
    });
    qsa('[data-section="footer"] span').forEach(function (el) {
      el.textContent = el.textContent.replace(/\b20\d{2}\b(?=\.)/, year);
    });
  }

  /* ── fix invisible animated text (opacity:0 from scraped React) ── */
  function fixAnimatedText() {
    qsa('span.inline-block[style*="opacity: 0"], span.inline-block[style*="opacity:0"]').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  /* ── mobile menu ──────────────────────────────────────────────── */
  function initMobileMenu() {
    var nav = qs('[data-section="navbar"]');
    var menu = qs('#mobile-menu');
    var btn = qs('#mobile-menu-btn');
    if (!nav || !menu || !btn) return;

    function closeMenu() {
      menu.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
      var icon = qs('svg', btn);
      if (icon) icon.style.transform = 'rotate(0deg)';
    }

    function openMenu() {
      menu.classList.remove('hidden');
      btn.setAttribute('aria-expanded', 'true');
      var icon = qs('svg', btn);
      if (icon) icon.style.transform = 'rotate(45deg)';
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (menu.classList.contains('hidden')) { openMenu(); } else { closeMenu(); }
    });

    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !menu.contains(e.target)) { closeMenu(); }
    });

    qsa('a', menu).forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    /* close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeMenu(); }
    });
  }

  /* ── smooth scroll ────────────────────────────────────────────── */
  function initSmoothScroll() {
    qsa('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var hash = anchor.getAttribute('href');
        if (!hash || hash === '#') return;
        var target = qs(hash);
        if (!target) return;
        e.preventDefault();
        var navEl = qs('[data-section="navbar"]');
        var offset = navEl ? navEl.offsetHeight + 20 : 80;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
        /* close mobile menu if open */
        var menu = qs('#mobile-menu');
        if (menu && !menu.classList.contains('hidden')) {
          menu.classList.add('hidden');
          var btn = qs('#mobile-menu-btn');
          if (btn) {
            btn.setAttribute('aria-expanded', 'false');
            var icon = qs('svg', btn);
            if (icon) icon.style.transform = 'rotate(0deg)';
          }
        }
      });
    });
  }

  /* ── FAQ accordion ────────────────────────────────────────────── */
  function initFAQ() {
    var faqSection = qs('[data-section="faq"]');
    if (!faqSection) return;

    qsa('.faq-item', faqSection).forEach(function (item) {
      var trigger = qs('.faq-trigger', item);
      var answer = qs('.faq-answer', item);
      var icon = qs('.faq-icon', item);
      if (!trigger) return;

      answer && (answer.style.maxHeight = '0');
      answer && (answer.style.overflow = 'hidden');
      answer && (answer.style.transition = 'max-height 0.35s ease');

      trigger.addEventListener('click', function () {
        var isOpen = item.classList.toggle('faq-open');
        if (icon) icon.style.transform = isOpen ? 'rotate(45deg)' : 'rotate(0deg)';
        if (answer) answer.style.maxHeight = isOpen ? answer.scrollHeight + 'px' : '0';
        /* close siblings */
        qsa('.faq-item.faq-open', faqSection).forEach(function (other) {
          if (other !== item) {
            other.classList.remove('faq-open');
            var otherIcon = qs('.faq-icon', other);
            var otherAns = qs('.faq-answer', other);
            if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
            if (otherAns) otherAns.style.maxHeight = '0';
          }
        });
      });
    });
  }

  /* ── navbar scroll shadow ─────────────────────────────────────── */
  function initNavbarScroll() {
    var nav = qs('[data-section="navbar"]');
    if (!nav) return;
    var ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          nav.style.boxShadow = window.scrollY > 10
            ? '0 1px 0 rgba(255,255,255,0.07)'
            : 'none';
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── init ─────────────────────────────────────────────────────── */
  function init() {
    updateYear();
    fixAnimatedText();
    initMobileMenu();
    initSmoothScroll();
    initFAQ();
    initNavbarScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
