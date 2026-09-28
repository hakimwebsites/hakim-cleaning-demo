(function () {
  'use strict';
  // Quote requests open WhatsApp with the details filled in
  var CONFIG = { whatsapp: '971558311047' };

  var header = document.querySelector('.site-header');
  var nav = document.getElementById('nav');
  var menuBtn = document.querySelector('.menu-btn');

  function setMenu(open) {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
  });

  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Active nav link
  var links = [].slice.call(nav.querySelectorAll('a[href^="#"]:not(.btn)'));
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + en.target.id;
          a.classList.toggle('active', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) {
      var s = document.querySelector(a.getAttribute('href'));
      if (s) spy.observe(s);
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    [].forEach.call(document.querySelectorAll('.reveal'), function (el, i) {
      el.style.transitionDelay = (i % 3) * 80 + 'ms';
      io.observe(el);
    });
  } else {
    [].forEach.call(document.querySelectorAll('.reveal'), function (el) { el.classList.add('in'); });
  }

  // Accordion
  [].forEach.call(document.querySelectorAll('.item button'), function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !open);
      document.getElementById(btn.getAttribute('aria-controls')).classList.toggle('open', !open);
    });
  });

  // Slider
  var slider = document.querySelector('.slider');
  [].forEach.call(document.querySelectorAll('[data-dir]'), function (b) {
    b.addEventListener('click', function () {
      var step = slider.firstElementChild.getBoundingClientRect().width + 24;
      slider.scrollBy({ left: step * Number(b.dataset.dir), behavior: 'smooth' });
    });
  });
  slider.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      slider.scrollBy({ left: (e.key === 'ArrowRight' ? 1 : -1) * 300, behavior: 'smooth' });
    }
  });

  // Quote form
  var form = document.getElementById('quote-form');
  var status = form.querySelector('.status');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = [];
    [].forEach.call(form.querySelectorAll('[required]'), function (f) {
      var invalid = !f.value.trim();
      f.classList.toggle('invalid', invalid);
      f.setAttribute('aria-invalid', invalid);
      if (invalid) bad.push(f);
    });
    if (bad.length) {
      status.className = 'status err';
      status.textContent = 'Please complete the highlighted fields.';
      bad[0].focus();
      return;
    }
    var d = new FormData(form);
    var text = 'Hello Hakim Cleaning Hub, I would like a quote.\nName: ' + d.get('name') + '\nPhone: ' + d.get('phone') + '\nService: ' + d.get('service') + (d.get('msg') ? '\nDetails: ' + d.get('msg') : '');
    window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    status.className = 'status ok';
    status.textContent = 'Opening WhatsApp to send your request.';
    form.reset();
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
