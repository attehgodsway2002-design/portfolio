'use strict';

/* ===========================================================
   Godsway Atteh — Portfolio Script (iPortfolio-style layout)
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initSidebarToggle();
  initScrollSpy();
  initRevealAnimations();
  initTypedText();
  initCounters();
  initSkillBars();
  initPortfolioFilter();
  initScrollTop();
  initContactForm();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------- Sidebar toggle (mobile) ---------- */
function initSidebarToggle() {
  const toggle = document.getElementById('headerToggle');
  const header = document.getElementById('header');

  toggle.addEventListener('click', () => {
    header.classList.toggle('header-show');
    toggle.classList.toggle('bi-list');
    toggle.classList.toggle('bi-x');
  });

  document.querySelectorAll('#navmenu a').forEach((link) => {
    link.addEventListener('click', () => {
      header.classList.remove('header-show');
      toggle.classList.add('bi-list');
      toggle.classList.remove('bi-x');
    });
  });
}

/* ---------- Scroll spy (active nav link) ---------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('#navmenu a');

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );
  sections.forEach((section) => observer.observe(section));
}

/* ---------- Reveal on scroll ---------- */
function initRevealAnimations() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
  );
  items.forEach((item) => observer.observe(item));

  // Safety net: guarantee nothing stays permanently hidden — covers deep
  // links (e.g. #skills on load), bfcache restores, and slow observer
  // startup where the first IO callback can be missed.
  const revealIfVisible = () => {
    items.forEach((item) => {
      if (item.classList.contains('in-view')) return;
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        item.classList.add('in-view');
      }
    });
  };
  window.addEventListener('load', revealIfVisible);
  window.addEventListener('hashchange', revealIfVisible);
  setTimeout(() => items.forEach((item) => item.classList.add('in-view')), 2500);
}

/* ---------- Typed rotating text ---------- */
function initTypedText() {
  const el = document.getElementById('typed');
  if (!el) return;

  const phrases = [
    'Network & Systems Specialist',
    'Full-Stack Developer',
    'Linux & Windows Server Admin',
    'Problem Solver'
  ];

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    el.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const TYPE_SPEED = 55;
  const DELETE_SPEED = 30;
  const HOLD_TIME = 1600;

  function tick() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, HOLD_TIME);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  tick();
}

/* ---------- Animated counters ---------- */
function initCounters() {
  const counters = document.querySelectorAll('.purecounter');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((counter) => observer.observe(counter));
}

/* ---------- Skill progress bars ---------- */
function initSkillBars() {
  const bars = document.querySelectorAll('.progress-bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          bar.style.width = `${bar.getAttribute('data-width')}%`;
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.4 }
  );
  bars.forEach((bar) => observer.observe(bar));
}

/* ---------- Portfolio filter ---------- */
function initPortfolioFilter() {
  const filters = document.querySelectorAll('#portfolioFilters li');
  const items = document.querySelectorAll('#portfolioGrid .portfolio-item');
  if (!filters.length) return;

  filters.forEach((filter) => {
    filter.addEventListener('click', () => {
      filters.forEach((f) => f.classList.remove('filter-active'));
      filter.classList.add('filter-active');

      const target = filter.getAttribute('data-filter');
      items.forEach((item) => {
        const show = target === '*' || item.classList.contains(target.slice(1));
        item.classList.toggle('hidden', !show);
      });
    });
  });
}

/* ---------- Scroll to top button ---------- */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  window.addEventListener(
    'scroll',
    () => btn.classList.toggle('active', window.scrollY > 500),
    { passive: true }
  );
}

/* ---------- Contact form (client-side validation + mailto handoff) ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const status = document.getElementById('formStatus');

  const fields = {
    name: { el: document.getElementById('name-field'), error: document.getElementById('nameError') },
    email: { el: document.getElementById('email-field'), error: document.getElementById('emailError') },
    subject: { el: document.getElementById('subject-field'), error: document.getElementById('subjectError') },
    message: { el: document.getElementById('message-field'), error: document.getElementById('messageError') }
  };

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(field, msg) {
    field.el.closest('.form-group').classList.add('error');
    field.error.textContent = msg;
  }

  function validate() {
    let valid = true;
    Object.values(fields).forEach(({ el, error }) => {
      el.closest('.form-group').classList.remove('error');
      error.textContent = '';
    });

    if (!fields.name.el.value.trim()) { setError(fields.name, 'Please enter your name.'); valid = false; }
    if (!fields.email.el.value.trim() || !emailRe.test(fields.email.el.value.trim())) {
      setError(fields.email, 'Please enter a valid email address.'); valid = false;
    }
    if (!fields.subject.el.value.trim()) { setError(fields.subject, 'Please add a subject.'); valid = false; }
    if (!fields.message.el.value.trim() || fields.message.el.value.trim().length < 10) {
      setError(fields.message, 'Message should be at least 10 characters.'); valid = false;
    }
    return valid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = '';
    status.className = 'form-status';

    if (!validate()) {
      status.textContent = 'Please fix the highlighted fields.';
      status.classList.add('error');
      return;
    }

    const name = fields.name.el.value.trim();
    const email = fields.email.el.value.trim();
    const subject = fields.subject.el.value.trim();
    const message = fields.message.el.value.trim();

    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailto = `mailto:attehgodsway2002@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;

    status.textContent = 'Your email client should now be open — thanks for reaching out!';
    status.classList.add('success');
    form.reset();
  });

  Object.values(fields).forEach(({ el }) => {
    el.addEventListener('input', () => el.closest('.form-group').classList.remove('error'));
  });
}
