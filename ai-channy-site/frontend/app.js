const aiModal = document.getElementById('ai-modal');
const openAiLink = document.getElementById('open-ai-link');
const openAi2 = document.getElementById('open-ai-2');
const closeAi = document.getElementById('close-ai');

if (openAiLink) {
  openAiLink.addEventListener('click', (e) => {
    e.preventDefault();
    aiModal.setAttribute('aria-hidden','false');
  });
}

if (openAi2) {
  openAi2.addEventListener('click', (e) => {
    e.preventDefault();
    aiModal.setAttribute('aria-hidden','false');
  });
}

if (closeAi) {
  closeAi.addEventListener('click', () => aiModal.setAttribute('aria-hidden','true'));
}

// Contact form → backend
const form = document.getElementById('contact-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const r = await fetch('/api/contact', {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify(data)
  });
  if (r.ok) {
    form.reset();
    document.getElementById('contact-success').hidden = false;
  } else {
    alert('Could not send right now. Please email us.');
  }
});

