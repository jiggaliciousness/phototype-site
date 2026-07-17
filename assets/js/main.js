function initNavToggle() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');
  const backdrop = document.getElementById('nav-backdrop');
  if (!toggle || !nav) return;

  const setOpen = (isOpen) => {
    nav.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    if (backdrop) backdrop.classList.toggle('open', isOpen);
  };

  toggle.addEventListener('click', () => {
    setOpen(!nav.classList.contains('open'));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  if (backdrop) {
    backdrop.addEventListener('click', () => setOpen(false));
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('open')) setOpen(false);
  });
}

function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll);
  onScroll();
}

const portfolioCategories = ['food', 'wedding', 'event'];

function activatePortfolioCategory(category) {
  const tabs = document.querySelectorAll('.portfolio-tab');
  const items = document.querySelectorAll('#gallery .gallery-item');
  if (!tabs.length || !items.length) return;

  tabs.forEach((tab) => {
    const isActive = tab.dataset.category === category;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  items.forEach((item) => {
    item.hidden = item.dataset.category !== category;
  });
}

function initPortfolioFilter() {
  const tabs = document.querySelectorAll('.portfolio-tab');
  const prevButton = document.getElementById('portfolio-prev');
  const nextButton = document.getElementById('portfolio-next');
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activatePortfolioCategory(tab.dataset.category));
  });

  const currentCategoryIndex = () => {
    const activeTab = document.querySelector('.portfolio-tab.active');
    const current = activeTab ? activeTab.dataset.category : portfolioCategories[0];
    return portfolioCategories.indexOf(current);
  };

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      const index = (currentCategoryIndex() - 1 + portfolioCategories.length) % portfolioCategories.length;
      activatePortfolioCategory(portfolioCategories[index]);
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      const index = (currentCategoryIndex() + 1) % portfolioCategories.length;
      activatePortfolioCategory(portfolioCategories[index]);
    });
  }
}

function initLightbox() {
  const gallery = document.getElementById('gallery');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const closeButton = document.getElementById('lightbox-close');
  if (!gallery || !lightbox || !lightboxImage || !closeButton) return;

  gallery.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      lightboxImage.src = item.dataset.full;
      lightboxImage.alt = item.querySelector('img').alt;
      lightbox.hidden = false;
    });
  });

  const close = () => {
    lightbox.hidden = true;
    lightboxImage.src = '';
  };
  closeButton.addEventListener('click', close);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
}

function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', String(!isOpen));
      answer.hidden = isOpen;
    });
  });
}

function buildMailtoLink({ name, email, service, message }, to) {
  const subject = encodeURIComponent(`New ${service} inquiry from ${name}`);
  const bodyLines = [`From: ${name} (${email})`, `Service: ${service}`, '', message];
  const body = encodeURIComponent(bodyLines.join('\n'));
  return `mailto:${to}?subject=${subject}&body=${body}`;
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  const confirmation = document.getElementById('contact-confirmation');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const service = form.elements.service.value;
    const message = form.elements.message.value.trim();
    window.location.href = buildMailtoLink({ name, email, service, message }, 'hello@phototype.ca');
    if (confirmation) confirmation.hidden = false;
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initNavToggle();
    initStickyHeader();
    initPortfolioFilter();
    initLightbox();
    initFaqAccordion();
    initContactForm();
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { buildMailtoLink };
}
