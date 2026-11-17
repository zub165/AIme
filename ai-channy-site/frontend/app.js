function setActiveTab(name) {
  const buttons = Array.from(document.querySelectorAll('[data-tab-button]'));
  if (!buttons.some(button => button.dataset.tabButton === name)) return;
  buttons.forEach(button => {
    button.classList.toggle('active', button.dataset.tabButton === name);
    button.setAttribute('aria-selected', button.dataset.tabButton === name ? 'true' : 'false');
  });
  document.querySelectorAll('[data-tab-panel]').forEach(panel => {
    panel.hidden = panel.dataset.tabPanel !== name;
  });
}

document.querySelectorAll('[data-tab-button]').forEach(button => {
  button.addEventListener('click', () => setActiveTab(button.dataset.tabButton));
});

const initialTab = window.location.hash.replace('#', '');
if (initialTab) setActiveTab(initialTab);

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '');
  if (hash) setActiveTab(hash);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;

    const scrollTarget = target.dataset.tabPanel ? document.querySelector('[data-tab-bar]')?.closest('section') || target : target;
    if (target.dataset.tabPanel) setActiveTab(target.id);

    scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.querySelectorAll('.nav-icon').forEach(icon => icon.classList.remove('active'));
    this.classList.add('active');
  });
});

const sections = Array.from(document.querySelectorAll('.content-section, .hero-section, [data-tab-panel]'));
const navIcons = document.querySelectorAll('.nav-icon');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (section.hidden || !section.clientHeight) return;
    if (pageYOffset >= section.offsetTop - 200) current = section.getAttribute('id');
  });

  navIcons.forEach(icon => {
    icon.classList.remove('active');
    if (icon.getAttribute('href') === `#${current}`) icon.classList.add('active');
  });
});

const aiModal = document.getElementById('ai-modal');
const closeAi = document.getElementById('close-ai');

if (closeAi) {
  closeAi.addEventListener('click', () => {
    if (aiModal) aiModal.setAttribute('aria-hidden', 'true');
  });
}

if (aiModal) {
  aiModal.addEventListener('click', e => {
    if (e.target === aiModal) aiModal.setAttribute('aria-hidden', 'true');
  });
}

const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const successMsg = document.getElementById('contact-success');

    const getApiBase = () => {
      const fromStorage = (localStorage.getItem('aimeApiBase') || '').trim();
      if (fromStorage) return fromStorage.replace(/\/$/, '');
      return 'https://api.docsoncalls.com/ml';
    };

    const showSuccess = text => {
      if (!successMsg) return;
      successMsg.textContent = text;
      successMsg.hidden = false;
      setTimeout(() => { successMsg.hidden = true; }, 6000);
    };

    const fallbackSend = () => {
      const subject = encodeURIComponent(`AIme Contact — ${data.name || 'Website visitor'}`);
      const body = encodeURIComponent(`Name: ${data.name || ''}\nEmail: ${data.email || ''}\n\nMessage:\n${data.message || ''}\n`);
      window.location.href = `mailto:info@innovatorsgeneration.com?subject=${subject}&body=${body}`;
      showSuccess('Draft email opened. If it did not open, please copy your message and email us.');
    };

    try {
      const response = await fetch(`${getApiBase()}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: window.location.href })
      });
      if (!response.ok) {
        fallbackSend();
        return;
      }
      const result = await response.json().catch(() => ({}));
      form.reset();
      showSuccess(result.message || "Thanks — we'll get back to you soon.");
    } catch (error) {
      console.error('Contact form error:', error);
      fallbackSend();
    }
  });
}

document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#')) return;
  const isPage = /^https?:/i.test(href) || /^\.?\//.test(href) || /\.(html?|php)(?:[?#]|$)/i.test(href);
  if (isPage && !link.target) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
});

const themes = ['twilight', 'daylight', 'dark', 'ocean', 'sunset', 'forest'];
let currentThemeIndex = 0;

const savedTheme = localStorage.getItem('theme');
if (savedTheme && themes.includes(savedTheme)) {
  currentThemeIndex = themes.indexOf(savedTheme);
  document.documentElement.setAttribute('data-theme', savedTheme);
} else {
  document.documentElement.setAttribute('data-theme', 'daylight');
  currentThemeIndex = themes.indexOf('daylight');
}

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const newTheme = themes[currentThemeIndex];
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => { themeToggle.style.transform = ''; }, 300);
  });
}
