// CANARINHO 5★ — shared interactions (vanilla JS)
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Smooth momentum scrolling (Lenis)
  if (!reduceMotion && window.Lenis) {
    var lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1.05 });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  // Mobile nav
  var toggle = document.querySelector('[data-testid="nav-toggle"]');
  var nav = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  // Hero masked line-by-line reveal + staggered fade-ins
  var heroLines = document.querySelectorAll('.mask-line > span');
  var heroFades = document.querySelectorAll('.hero-fade');
  if (!reduceMotion && window.gsap) {
    var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.to(heroLines, { y: 0, duration: 1.15, stagger: 0.12 }, 0.25)
      .to(heroFades, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, '-=0.55');
  } else {
    heroLines.forEach(function (s) { s.style.transform = 'translateY(0)'; });
    heroFades.forEach(function (s) { s.style.opacity = '1'; s.style.transform = 'none'; });
  }

  // Hero parallax
  var heroImg = document.querySelector('[data-parallax]');
  if (heroImg && !reduceMotion) {
    if (window.gsap && window.ScrollTrigger) {
      gsap.to(heroImg, {
        yPercent: 16, scale: 1.02, ease: 'none',
        scrollTrigger: { trigger: heroImg.closest('.hero, .page-hero'), start: 'top top', end: 'bottom top', scrub: true }
      });
    } else {
      window.addEventListener('scroll', function () {
        var y = window.scrollY;
        if (y < window.innerHeight) heroImg.style.transform = 'scale(1.12) translateY(' + y * 0.22 + 'px)';
      }, { passive: true });
    }
  }

  // Scroll reveals
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('revealed'); });
  }

  // Count-up numbers
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / 1400, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        co.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }
})();
