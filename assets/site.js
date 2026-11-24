(() => {
  'use strict';
  const measurementId = 'G-SWQYZ30J20';
  const publicPaths = new Set(["/", "/long-distance-moving/", "/packing-and-storage/", "/service-areas/", "/service-areas/texas/", "/service-areas/midwest/", "/service-areas/northeast/", "/how-it-works/", "/moving-estimates/", "/about/", "/faqs/", "/get-a-quote/", "/privacy/", "/terms/"]);
  const analyticsEnabled = location.hostname === 'openroadmovingandstorage.com' && publicPaths.has(location.pathname);
  const pageLocation = location.origin + location.pathname;
  function track(name, parameters = {}) {
    if (!analyticsEnabled) return;
    try {
      window.gtag('event', name, {
        send_to: measurementId,
        brand: 'openroad',
        page_location: pageLocation,
        page_path: location.pathname,
        ...parameters
      });
    } catch { /* Measurement must never interrupt a quote request. */ }
  }
  if (analyticsEnabled) {
    try {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      let pageReferrer = '';
      try { pageReferrer = new URL(document.referrer).origin; } catch {}
      window.gtag('js', new Date());
      window.gtag('config', measurementId, {
        send_page_view: false,
        page_location: pageLocation,
        page_referrer: pageReferrer,
        allow_google_signals: false,
        allow_ad_personalization_signals: false
      });
      track('page_view', { page_referrer: pageReferrer });
      const tag = document.createElement('script');
      tag.async = true;
      tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
      document.head.appendChild(tag);
    } catch { /* The site and its forms work when analytics is unavailable. */ }
  }
  function captureAttribution() {
    const url = new URL(location.href);
    const clean = value => (value || '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 160);
    const tags = Object.fromEntries(['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].map(k => [k, clean(url.searchParams.get(k))]));
    const tagged = Object.values(tags).some(Boolean);
    let ref;
    try { ref = new URL(document.referrer); } catch {}
    const host = ref?.hostname.toLowerCase().replace(/^www\./, '') || '';
    const internal = host === url.hostname.replace(/^www\./, '');
    const search = /^(?:[\w-]+\.)*bing\.com$/.test(host) ? 'bing'
      : /^(?:www\.)?google\.(?:com|[a-z]{2}|co\.[a-z]{2}|com\.[a-z]{2})$/.test(host) ? 'google'
      : /^(?:[\w-]+\.)*yahoo\.com$/.test(host) ? 'yahoo'
      : host === 'duckduckgo.com' ? 'duckduckgo' : '';
    const source = tags.utm_source || (tagged ? 'unknown' : search || (host && !internal ? host : 'direct'));
    const medium = tags.utm_medium || (tagged ? 'campaign' : search ? 'organic' : host && !internal ? 'referral' : 'none');
    const landing = url.origin + url.pathname;
    const key = 'openroad_acquisition_v1';
    const record = { ...tags, traffic_source: source, traffic_medium: medium,
      landing_page: landing, referrer: host && !internal && /^https?:$/.test(ref.protocol) ? ref.origin : '' };
    try {
      const previous = JSON.parse(sessionStorage.getItem(key) || 'null');
      if (!tagged && (!host || internal) && previous && typeof previous.landing_page === 'string' &&
          new URL(previous.landing_page).origin === url.origin) return previous;
      sessionStorage.setItem(key, JSON.stringify(record));
    } catch { /* Attribution storage must not block the quote form. */ }
    return record;
  }
  const acquisition = captureAttribution();
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
    const formId = location.pathname === '/' ? 'homepage_quote' : 'contact_quote';
    let started = false;
    function recordStart(event) {
      if (started || !event.isTrusted || !event.target.matches('input:not([type="hidden"]):not([name="botcheck"]),select,textarea')) return;
      started = true;
      track('openroad_form_start', { form_id: formId });
    }
    form.addEventListener('input', recordStart);
    form.addEventListener('change', recordStart);
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
    let sending = false;
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (sending || form.dataset.submitted === 'true') return;
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
      const submit = form.querySelector('[data-submit]');
      const back = form.querySelector('[data-back]');
      sending = true;
      submit.disabled = true;
      back.disabled = true;
      submit.textContent = 'Sending…';
      status.hidden = false;
      status.setAttribute('role', 'status');
      status.textContent = 'Sending your quote request…';
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      let failureCategory = 'network';
      try {
        const payload = {
          acquisition_source: acquisition.traffic_source + ' / ' + acquisition.traffic_medium,
          ...acquisition,
          current_page_url: location.origin + location.pathname,
          ...Object.fromEntries(new FormData(form))
        };
        const response = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        failureCategory = response.ok ? 'response' : 'http';
        const result = await response.json();
        if (!response.ok || result.success !== true) throw new Error('Submission was not confirmed');
        form.dataset.submitted = 'true';
        track('generate_lead', { form_id: formId });
        sections.forEach(section => { section.disabled = true; });
        back.hidden = true;
        submit.textContent = 'Request submitted';
        status.textContent = 'Your quote request was submitted. We’ll follow up to discuss your move. This is not a booking or a final estimate.';
      } catch (error) {
        track('openroad_form_error', { form_id: formId, error_category: error.name === 'AbortError' ? 'timeout' : failureCategory });
        showStep(current, false);
        submit.disabled = false;
        back.disabled = false;
        submit.textContent = 'Try sending again';
        status.setAttribute('role', 'alert');
        status.textContent = 'We couldn’t confirm your submission. Your details are still here. Please try again, or use the call or email option to reach us.';
      } finally {
        clearTimeout(timeout);
        sending = false;
      }
    });
    showStep(0, false);
  });
})();
