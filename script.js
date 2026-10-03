/* ============================================================
   GLAMOUR STUDIO — Main JavaScript
   ============================================================ */

'use strict';

// ─── PRELOADER ───────────────────────────────────────────────
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  document.body.classList.add('loading');

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.classList.remove('loading');
    }, 1800);
  });
})();

// ─── NAVBAR SCROLL ───────────────────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (!navbar) return;

  function onScroll() {
    const scrollY = window.scrollY;

    // Scrolled class for background
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link based on section
    let current = '';
    sections.forEach(sec => {
      const sectionTop = sec.offsetTop - 100;
      if (scrollY >= sectionTop) current = sec.getAttribute('id');
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ─── HAMBURGER MENU ──────────────────────────────────────────
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });
})();

// ─── FLOATING PARTICLES ──────────────────────────────────────
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = window.innerWidth < 768 ? 12 : 25;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left   = Math.random() * 100 + '%';
    p.style.width  = (Math.random() * 4 + 2) + 'px';
    p.style.height = p.style.width;
    p.style.animationDuration = (Math.random() * 12 + 8) + 's';
    p.style.animationDelay   = (Math.random() * 8) + 's';
    p.style.opacity = (Math.random() * 0.5 + 0.1).toString();
    container.appendChild(p);
  }
})();

// ─── ANIMATED COUNTERS ───────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;

  let started = false;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2200;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString();
    }, 16);
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      counters.forEach(animateCounter);
    }
  }, { threshold: 0.5 });

  const hero = document.querySelector('.hero-stats');
  if (hero) observer.observe(hero);
})();

// ─── SCROLL REVEAL ───────────────────────────────────────────
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = (Array.from(el.parentElement.children).indexOf(el)) * 80;
        setTimeout(() => {
          el.classList.add('revealed');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

// ─── SERVICE FILTER TABS ─────────────────────────────────────
(function initServiceTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.service-card');

  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-tab');

      cards.forEach(card => {
        const cat = card.getAttribute('data-cat');
        if (filter === 'all' || cat === filter) {
          card.style.display = '';
          card.classList.remove('hidden');
          // Re-trigger reveal
          setTimeout(() => card.classList.add('revealed'), 50);
        } else {
          card.classList.add('hidden');
          card.style.display = 'none';
        }
      });
    });
  });
})();

// ─── TESTIMONIAL SLIDER ──────────────────────────────────────
(function initTestimonialSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots   = document.querySelectorAll('.testi-dot');
  const prev   = document.getElementById('testi-prev');
  const next   = document.getElementById('testi-next');

  if (!slides.length) return;

  let current = 0;
  let autoTimer;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  if (prev) prev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  if (next) next.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.getAttribute('data-idx'), 10));
      resetAuto();
    });
  });

  startAuto();
})();

// ─── GALLERY LIGHTBOX ────────────────────────────────────────
(function initGalleryLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  // Create lightbox
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.style.cssText = `
    display:none; position:fixed; inset:0; z-index:9000;
    background:rgba(0,0,0,0.95); align-items:center; justify-content:center;
    cursor:zoom-out;
  `;

  const lbImg = document.createElement('img');
  lbImg.style.cssText = `
    max-width:90vw; max-height:90vh; border-radius:12px;
    box-shadow: 0 30px 80px rgba(0,0,0,0.5);
    animation: fadeInUp 0.4s ease;
    object-fit:contain;
  `;

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = `
    position:absolute; top:24px; right:28px;
    color:white; font-size:1.8rem; background:none; border:none;
    cursor:pointer; opacity:0.7; transition:opacity 0.2s;
  `;
  closeBtn.onmouseenter = () => closeBtn.style.opacity = '1';
  closeBtn.onmouseleave = () => closeBtn.style.opacity = '0.7';

  lb.appendChild(lbImg);
  lb.appendChild(closeBtn);
  document.body.appendChild(lb);

  function open(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt;
    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.style.display = 'none';
    document.body.style.overflow = '';
  }

  items.forEach(item => {
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) open(img.src, img.alt);
    });
  });

  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

// ─── BOOKING FORM ────────────────────────────────────────────
(function initBookingForm() {
  const form    = document.getElementById('booking-form');
  const success = document.getElementById('booking-success');
  const again   = document.getElementById('book-again-btn');

  if (!form) return;

  // Set min date to today
  const dateInput = document.getElementById('book-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = document.getElementById('submit-booking');
    if (btn) {
      btn.innerHTML = '<span>Processing...</span>';
      btn.disabled = true;
    }

    // Simulate booking submission (replace with real API call)
    setTimeout(() => {
      form.style.display = 'none';
      if (success) success.style.display = 'block';
    }, 1500);
  });

  if (again) {
    again.addEventListener('click', () => {
      form.reset();
      form.style.display = 'block';
      if (success) success.style.display = 'none';

      const btn = document.getElementById('submit-booking');
      if (btn) {
        btn.innerHTML = '<span>Confirm Appointment</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
        btn.disabled = false;
      }
    });
  }
})();

// ─── SMOOTH SCROLL FOR ANCHOR LINKS ──────────────────────────
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// ─── PARALLAX HERO ───────────────────────────────────────────
(function initParallax() {
  const heroImg = document.getElementById('hero-bg-img');
  if (!heroImg || window.innerWidth < 768) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight * 1.2) {
      heroImg.style.transform = `scale(1.08) translateY(${scrollY * 0.15}px)`;
    }
  }, { passive: true });
})();

// ─── NAVBAR CLOSE ON SCROLL (MOBILE) ─────────────────────────
(function initNavScrollClose() {
  const navLinks  = document.getElementById('nav-links');
  const hamburger = document.getElementById('hamburger');

  window.addEventListener('scroll', () => {
    if (navLinks && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      if (hamburger) hamburger.classList.remove('open');
    }
  }, { passive: true });
})();

// ─── TYPED TEXT EFFECT IN HERO ───────────────────────────────
(function initTypedEffect() {
  const target = document.querySelector('.hero-title-line2');
  if (!target) return;

  const words = ['Artistry', 'Excellence', 'Glamour', 'You'];
  let wIdx = 0;

  function typeWord(word, callback) {
    const em = target.querySelector('em');
    if (!em) return;
    em.textContent = '';
    let i = 0;
    const typeTimer = setInterval(() => {
      em.textContent += word[i];
      i++;
      if (i >= word.length) {
        clearInterval(typeTimer);
        setTimeout(() => eraseWord(em, callback), 2500);
      }
    }, 100);
  }

  function eraseWord(em, callback) {
    let text = em.textContent;
    const eraseTimer = setInterval(() => {
      text = text.slice(0, -1);
      em.textContent = text;
      if (text.length === 0) {
        clearInterval(eraseTimer);
        callback();
      }
    }, 60);
  }

  function cycle() {
    typeWord(words[wIdx], () => {
      wIdx = (wIdx + 1) % words.length;
      setTimeout(cycle, 300);
    });
  }

  // Start after preloader
  setTimeout(cycle, 2500);
})();

// ─── SERVICE CARD 3D TILT EFFECT ─────────────────────────────
(function init3DTilt() {
  if (window.innerWidth < 768) return;

  const cards = document.querySelectorAll('.service-card, .why-card, .team-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-10px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ─── WHATSAPP FLOAT ANIMATION DELAY ──────────────────────────
(function initWhatsappFloat() {
  const float = document.getElementById('whatsapp-float');
  if (!float) return;

  float.style.opacity = '0';
  float.style.transform = 'scale(0)';
  float.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

  setTimeout(() => {
    float.style.opacity = '1';
    float.style.transform = 'scale(1)';
  }, 3000);

  // Show/hide on scroll
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll < 300) {
      float.style.opacity = '0';
      float.style.transform = 'scale(0)';
    } else {
      float.style.opacity = '1';
      float.style.transform = 'scale(1)';
    }
    lastScroll = currentScroll;
  }, { passive: true });
})();

// ─── LOG READY ───────────────────────────────────────────────
console.log('%cGlamour Studio — Luxury Salon', 'color:#c9a84c; font-size:18px; font-weight:bold;');
console.log('%cBuilt with love | glamourstudio.in', 'color:#888; font-size:12px;');
