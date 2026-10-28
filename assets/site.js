(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  if (toggle && nav) {
    const close = () => { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); };
    toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('is-open')) { close(); toggle.focus(); } });
    nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
  }
  const localToday = new Date();
  const today = `${localToday.getFullYear()}-${String(localToday.getMonth()+1).padStart(2,'0')}-${String(localToday.getDate()).padStart(2,'0')}`;
  document.querySelectorAll('input[type="date"]').forEach(input => { input.min = today; });
  document.querySelectorAll('.quote-form').forEach(form => {
    const sections = [...form.querySelectorAll('fieldset[data-step]')];
    let current = 0;
    const indicator = form.querySelector('.form-progress');
    const status = form.querySelector('.form-status');
    function showStep(next, focus = true) {
      current = next;
      sections.forEach((section, index) => { section.hidden = index !== current; section.disabled = index !== current; });
      indicator.textContent = `Step ${current + 1} of ${sections.length} · ${['Your move', 'Move details', 'Your contact details'][current]}`;
      form.querySelector('[data-back]').hidden = current === 0;
      form.querySelector('[data-next]').hidden = current === sections.length - 1;
      form.querySelector('[data-next]').textContent = current === 0 ? 'Start my quote →' : 'Continue →';
      form.querySelector('[data-submit]').hidden = current !== sections.length - 1;
      if (focus) sections[current].querySelector('input,select,textarea')?.focus();
    }
    function validCurrent() { return [...sections[current].querySelectorAll('input,select,textarea')].every(input => input.reportValidity()); }
    form.querySelector('[data-next]').addEventListener('click', () => { if (validCurrent()) showStep(current + 1); });
    form.querySelector('[data-back]').addEventListener('click', () => showStep(Math.max(0, current - 1)));
    form.addEventListener('keydown', event => { if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA' && event.target.tagName !== 'BUTTON' && current < sections.length - 1) { event.preventDefault(); if (validCurrent()) showStep(current + 1); } });
    form.addEventListener('submit', event => {
      if (current !== sections.length - 1) { event.preventDefault(); if (validCurrent()) showStep(current + 1); return; }
      sections.forEach(section => { section.disabled = false; });
      if (!form.checkValidity()) {
        event.preventDefault();
        const firstInvalid = form.querySelector(':invalid');
        const invalidStep = sections.findIndex(section => section.contains(firstInvalid));
        showStep(Math.max(0, invalidStep), false);
        firstInvalid?.reportValidity();
        return;
      }
      // FormSubmit owns spam verification and delivery; do not show a client-only success.
      status.hidden = false;
      status.textContent = 'Opening secure verification. Complete the next screen to send your request.';
    });
    showStep(0, false);
  });
})();
