/* ============ ENERGY SYSTEM — Interactivity ============ */

// Flag JS availability so CSS only hides .animate-in elements when reveal can run
document.documentElement.classList.add('js');

// Reduced motion detection
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReduced) {
  document.documentElement.classList.add('reduced-motion');
}

// ============================================================
// NAVBAR SCROLL EFFECT
// ============================================================
const siteHeader = document.getElementById('site-header');

function onScroll() {
  if (!siteHeader) return;
  if (window.scrollY > 60) {
    siteHeader.classList.add('scrolled');
  } else {
    siteHeader.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // Set initial state

// ============================================================
// MOBILE MENU
// ============================================================
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuClose = document.getElementById('mobile-menu-close');

function openMenu() {
  if (mobileMenu) mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  if (mobileMenu) mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', openMenu);
}
if (mobileMenuClose) {
  mobileMenuClose.addEventListener('click', closeMenu);
}
// Close on link click
if (mobileMenu) {
  mobileMenu.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}
// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

// ============================================================
// FAQ ACCORDION
// ============================================================
document.querySelectorAll('.faq-item .summary, .faq-item .faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const answer = item.querySelector('.answer') || item.querySelector('.faq-a');
    if (!answer) return;
    const isOpen = item.classList.contains('open');

    // Close all others
    document.querySelectorAll('.faq-item.open').forEach(other => {
      if (other !== item) {
        other.classList.remove('open');
        const a = other.querySelector('.answer') || other.querySelector('.faq-a');
        if (a) a.style.maxHeight = '0';
      }
    });

    if (isOpen) {
      item.classList.remove('open');
      answer.style.maxHeight = '0';
    } else {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
    }
  });
});

// ============================================================
// SCROLL REVEAL (IntersectionObserver)
// ============================================================
if (!prefersReduced) {
  const revealElements = document.querySelectorAll('.animate-in');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: just show them all
    revealElements.forEach(el => el.classList.add('visible'));
  }
} else {
  // Reduced motion: show everything immediately
  document.querySelectorAll('.animate-in').forEach(el => el.classList.add('visible'));
}

// ============================================================
// SMOOTH SCROLL (for anchor links)
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================================
// CONTACT FORM VALIDATION
// ============================================================
const contactForm = document.querySelector('form.contact-form');
if (contactForm) {
  const successMsg = contactForm.querySelector('.form-success');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    contactForm.querySelectorAll('input[required], textarea[required]').forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.style.borderColor = '#D93333';
        input.addEventListener('input', function handler() {
          this.style.borderColor = '';
          this.removeEventListener('input', handler);
        });
      }
    });

    if (valid) {
      if (successMsg) successMsg.style.display = 'block';
      contactForm.reset();
      setTimeout(() => { if (successMsg) successMsg.style.display = 'none'; }, 5000);
    }
  });
}
