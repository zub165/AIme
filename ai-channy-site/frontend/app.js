const aiModal = document.getElementById('ai-modal');
document.getElementById('open-ai').onclick = () => aiModal.setAttribute('aria-hidden','false');
document.getElementById('open-ai-2').onclick = () => aiModal.setAttribute('aria-hidden','false');
document.getElementById('close-ai').onclick = () => aiModal.setAttribute('aria-hidden','true');

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

