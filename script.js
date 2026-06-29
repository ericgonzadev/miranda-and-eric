// ===== Countdown Timer =====
(function () {
  const weddingDate = new Date('2026-06-27T16:00:00').getTime();

  function setDigit(id, value) {
    const el = document.getElementById(id);
    if (!el || el.textContent === value) return;
    el.textContent = value;
    el.classList.remove('tick');
    // Force reflow so the animation restarts even when the same class is re-added quickly.
    void el.offsetWidth;
    el.classList.add('tick');
  }

  function updateCountdown() {
    const now = Date.now();
    const diff = weddingDate - now;

    if (diff <= 0) {
      setDigit('days', '0');
      setDigit('hours', '0');
      setDigit('minutes', '0');
      setDigit('seconds', '0');
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setDigit('days', String(days));
    setDigit('hours', String(hours).padStart(2, '0'));
    setDigit('minutes', String(minutes).padStart(2, '0'));
    setDigit('seconds', String(seconds).padStart(2, '0'));
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

// ===== Header Scroll Effect =====
(function () {
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', function () {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });
})();

// ===== Mobile Menu =====
(function () {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('mainNav');

  hamburger.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when clicking a nav link
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();

// ===== Scroll Reveal =====
(function () {
  const reveals = document.querySelectorAll('.reveal');

  function checkReveal() {
    const windowHeight = window.innerHeight;
    reveals.forEach(function (el) {
      const top = el.getBoundingClientRect().top;
      if (top < windowHeight - 80) {
        el.classList.add('visible');
      }
    });
  }

  checkReveal();
  window.addEventListener('scroll', checkReveal, { passive: true });
})();

// ===== Smooth Scroll for Nav Links =====
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = document.getElementById('header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });
})();

// ===== Engagement Photos Carousel =====
(function () {
  const track = document.getElementById('carouselTrack');
  if (!track) return;

  const slides = Array.from(track.children);
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsWrap = document.getElementById('carouselDots');
  let index = 0;

  // Build dot indicators
  const dots = slides.map(function (_, i) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to photo ' + (i + 1));
    dot.addEventListener('click', function () { goTo(i); });
    dotsWrap.appendChild(dot);
    return dot;
  });

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(' + (-index * 100) + '%)';
    dots.forEach(function (d, di) { d.classList.toggle('active', di === index); });
  }

  prevBtn.addEventListener('click', function () { goTo(index - 1); });
  nextBtn.addEventListener('click', function () { goTo(index + 1); });

  // Keyboard navigation when carousel is focused/hovered
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') goTo(index - 1);
    else if (e.key === 'ArrowRight') goTo(index + 1);
  });

  // Touch swipe support
  let startX = 0;
  let dragging = false;

  track.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
    dragging = true;
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    if (!dragging) return;
    dragging = false;
    const delta = e.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 40) {
      goTo(delta < 0 ? index + 1 : index - 1);
    }
  }, { passive: true });
})();
