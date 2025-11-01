// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Update active nav icon
      document.querySelectorAll('.nav-icon').forEach(icon => {
        icon.classList.remove('active');
      });
      this.classList.add('active');
    }
  });
});

// Update active nav on scroll
const sections = document.querySelectorAll('.content-section, .hero-section');
const navIcons = document.querySelectorAll('.nav-icon');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navIcons.forEach(icon => {
    icon.classList.remove('active');
    const href = icon.getAttribute('href');
    if (href === `#${current}`) {
      icon.classList.add('active');
    }
  });
});

// AI Modal functionality (if needed)
const aiModal = document.getElementById('ai-modal');
const closeAi = document.getElementById('close-ai');

if (closeAi) {
  closeAi.addEventListener('click', () => {
    if (aiModal) {
      aiModal.setAttribute('aria-hidden', 'true');
    }
  });
}

// Close modal on outside click
if (aiModal) {
  aiModal.addEventListener('click', (e) => {
    if (e.target === aiModal) {
      aiModal.setAttribute('aria-hidden', 'true');
    }
  });
}

// Contact form
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        form.reset();
        const successMsg = document.getElementById('contact-success');
        if (successMsg) {
          successMsg.hidden = false;
          setTimeout(() => {
            successMsg.hidden = true;
          }, 5000);
        }
      } else {
        alert('Could not send right now. Please email us directly.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      alert('Could not send right now. Please try again later.');
    }
  });
}

// Theme Switcher
const themes = ['dark', 'daylight', 'ocean', 'sunset', 'forest'];
let currentThemeIndex = 0;

// Load saved theme from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme && themes.includes(savedTheme)) {
  currentThemeIndex = themes.indexOf(savedTheme);
  document.documentElement.setAttribute('data-theme', savedTheme);
} else {
  document.documentElement.setAttribute('data-theme', themes[0]);
}

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const newTheme = themes[currentThemeIndex];
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Visual feedback
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
      themeToggle.style.transform = '';
    }, 300);
  });
}
