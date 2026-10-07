/*
 * ToyBox visitor-event tracker — consent-gated, privacy-respecting.
 * Fires GA4 events ONLY if visitor has accepted analytics consent.
 * Also captures events in window._tbEventLog for future first-party logging.
 *
 * Events emitted (consent-gated):
 *   tool_view          — auto on tool page load
 *   tool_email_sent    — when "Send my results" clicked successfully
 *   calendly_clicked   — any click/middle-click on a link to calendly.com (link_url, page_path, cta_text)
 *   crisp_opened       — Crisp chat window opened
 *   outbound_click     — any external (non-self-domain) link click
 *   newsletter_clicked — click on a data-cta="newsletter" link (page_path, link_url); outbound_click also fires
 *   scroll_depth       — 25/50/75/100% page scroll
 *   time_on_page       — 30s / 60s / 180s milestones (max 3 events/page)
 *   form_submit        — successful site form submission (form_id, page_path)
 *
 * No data is collected if visitor rejected analytics. All events respect the
 * toybox_consent cookie set by the consent banner.
 */
(function () {
  'use strict';

  // Local event log for future first-party analytics endpoint
  window._tbEventLog = window._tbEventLog || [];

  function consentGiven() {
    try {
      var m = document.cookie.match(/(?:^|; )toybox_consent=([^;]*)/);
      if (!m) return false;
      var c = JSON.parse(decodeURIComponent(m[1]));
      return c && c.analytics === true;
    } catch (e) { return false; }
  }

  function tbEvent(name, params) {
    var payload = Object.assign({}, params || {}, { ts: Date.now(), page: location.pathname });
    window._tbEventLog.push({ name: name, params: payload });
    if (!consentGiven()) return;
    if (typeof window.gtag === 'function') {
      try { window.gtag('event', name, payload); } catch (e) {}
    }
  }

  // Expose for external use
  window.tbEvent = tbEvent;

  // ===== Page-type detection =====
  var path = location.pathname;
  var isTool = /\/tools\//.test(path);
  var toolName = '';
  if (isTool) {
    var titleParts = (document.title || '').split('·');
    toolName = titleParts[0].trim();
    tbEvent('tool_view', { tool: toolName });
  }

  // ===== Outbound + Calendly link tracking =====
  // Delegated on document (capture phase) so it also sees links injected later by JS
  // (tool result panels, etc.) and clicks whose page handlers stop propagation.
  function linkHref(a) {
    var h = a.href;
    if (h && typeof h === 'object' && 'baseVal' in h) h = h.baseVal; // <a> inside SVG
    return String(h || a.getAttribute('href') || a.getAttribute('xlink:href') || '');
  }
  function bareHost(h) { return String(h || '').toLowerCase().replace(/^www\./, ''); }
  function onLinkClick(e) {
    if (e.type === 'auxclick' && e.button !== 1) return; // middle-click opens in new tab
    var t = e.target;
    if (t && t.nodeType !== 1) t = t.parentElement;
    var a = t && t.closest ? t.closest('a, area') : null;
    if (!a) return;
    var href = linkHref(a);
    if (!href) return;
    var text = (a.textContent || a.getAttribute('aria-label') || a.getAttribute('title') || '')
      .replace(/\s+/g, ' ').trim().slice(0, 100);
    if (a.getAttribute('data-cta') === 'newsletter') {
      tbEvent('newsletter_clicked', { page_path: location.pathname, link_url: href });
    }
    if (/calendly\.com/i.test(href)) {
      tbEvent('calendly_clicked', { link_url: href, page_path: location.pathname, cta_text: text });
      return;
    }
    var m = href.match(/^https?:\/\/([^\/?#:]+)/i);
    if (m && bareHost(m[1]) !== bareHost(location.hostname)) {
      tbEvent('outbound_click', { url: href, text: text.slice(0, 80) });
    }
  }
  document.addEventListener('click', onLinkClick, true);
  document.addEventListener('auxclick', onLinkClick, true);

  // ===== Tool email-sent tracking =====
  var emailBtn = document.getElementById('emailBtn');
  if (emailBtn && isTool) {
    emailBtn.addEventListener('click', function () {
      tbEvent('tool_email_sent', { tool: toolName });
    }, true);
  }

  // ===== Form submissions (form_submit) =====
  // Site forms post via fetch (Web3Forms, the toybox-tools-mail Worker, Brevo), so the page code
  // signals success itself:  document.dispatchEvent(new CustomEvent('tb:form_submit', {detail:{form_id:'contactForm'}}))
  // Forms with no success callback opt in with data-tb-track="submit" and are counted on the submit event.
  function formSubmit(formId) {
    tbEvent('form_submit', { form_id: String(formId || '(unnamed)'), page_path: location.pathname });
  }
  window.tbFormSubmit = formSubmit;
  document.addEventListener('tb:form_submit', function (e) {
    formSubmit(e && e.detail && e.detail.form_id);
  });
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f && f.getAttribute && f.getAttribute('data-tb-track') === 'submit') {
      formSubmit(f.id || f.getAttribute('name'));
    }
  }, true);

  // ===== Scroll depth tracking =====
  var scrollMarks = { 25: false, 50: false, 75: false, 100: false };
  function onScroll() {
    var doc = document.documentElement;
    var scrolled = (window.pageYOffset || doc.scrollTop) + window.innerHeight;
    var total = Math.max(doc.scrollHeight, doc.offsetHeight, document.body.scrollHeight) || 1;
    var pct = (scrolled / total) * 100;
    [25, 50, 75, 100].forEach(function (m) {
      if (pct >= m && !scrollMarks[m]) {
        scrollMarks[m] = true;
        tbEvent('scroll_depth', { percent: m });
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  // Fire once on load for short pages
  setTimeout(onScroll, 500);

  // ===== Time on page milestones =====
  [30, 60, 180].forEach(function (secs) {
    setTimeout(function () {
      // Only fire if tab is still visible
      if (document.visibilityState === 'visible') {
        tbEvent('time_on_page', { seconds: secs });
      }
    }, secs * 1000);
  });

  // ===== Crisp chat-opened detection =====
  function bindCrisp() {
    if (window.$crisp && window.$crisp.push) {
      try {
        window.$crisp.push(['on', 'chat:opened', function () {
          tbEvent('crisp_opened', {});
        }]);
        return true;
      } catch (e) { return false; }
    }
    return false;
  }
  if (!bindCrisp()) {
    // Retry after Crisp finishes loading
    var crispRetry = setInterval(function () {
      if (bindCrisp()) clearInterval(crispRetry);
    }, 2000);
    setTimeout(function () { clearInterval(crispRetry); }, 30000);
  }
})();
