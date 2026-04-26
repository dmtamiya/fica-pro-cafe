/**
 * ui-mobile.js — Comportamento de UI específico do mobile (e algumas pontes desktop/mobile)
 *
 * O app.js cuida da lógica principal (perguntas, decks, configurações, i18n).
 * Este arquivo cuida da camada de UI que é mais "cosmética" e específica de mobile,
 * agrupada em seções nesse arquivo:
 *
 *   1. Proxies de botões mobile
 *      Os botões mobile (configBtnMobile, sairBtnMobile, etc) só "redirecionam"
 *      cliques pros botões desktop equivalentes, que já têm os handlers do app.js.
 *
 *   2. Stop-propagation dos painéis
 *      Evita que cliques em áreas vazias dos drawers (config/about) vazem pro
 *      document e disparem handlers globais que não deveriam (ex: outside-click).
 *
 *   3. Sincronização de href do feedback
 *      Replica o href do <a> de feedback principal nos botões mobile/landing.
 *
 *   4. Botão Share (mobile)
 *      Usa Web Share API quando disponível, com fallback pra copiar.
 *
 *   5. Lista de idiomas no painel mobile
 *      Constrói a lista de seleção de idioma a partir do <select> existente
 *      e mantém em sincronia com o language-picker desktop.
 *
 *   6. Painéis colapsáveis (<details>)
 *      No desktop: todas seções ficam abertas e travadas (sem accordion).
 *      No mobile: accordion com animação de altura (uma abre, as outras fecham).
 *
 *   7. Balão "Arraste o cartão"
 *      Aparece na primeira visita, depois da landing sumir. Some no primeiro toque
 *      ou após 5 segundos. Só mostra uma vez (flag dragTipShown no localStorage).
 */

window.addEventListener('DOMContentLoaded', () => {

  const proxy = (mobileId, desktopId) => {
    const m = document.getElementById(mobileId);
    const d = document.getElementById(desktopId);
    if (m && d) {
      m.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        d.click();
      });
    }
  };
  proxy('sairBtnMobile',     'sairBtn');
  proxy('aboutBtnMobile',    'aboutBtn');
  proxy('configBtnMobile',   'configBtn');
  proxy('backConfigPanel',   'closeConfigPanel');
  proxy('backAboutPanel',    'closeAboutPanel');

  ['configPanel', 'aboutPanel'].forEach(id => {
    const panel = document.getElementById(id);
    if (panel) {
      panel.addEventListener('click', e => { e.stopPropagation(); });
    }
  });

  const syncFeedbackHref = () => {
    const main = document.getElementById('feedbackLink');
    if (!main) return;
    ['feedbackLinkMobile', 'feedbackLinkAboutMobile', 'landingFeedbackMobile'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.href = main.href;
    });
  };
  syncFeedbackHref();
  setTimeout(syncFeedbackHref, 50);
  setTimeout(syncFeedbackHref, 500);

  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const raw = (document.getElementById('questionText')?.textContent || '').trim();
      if (!raw) return;

      const text = (typeof window.__buildShareText === 'function')
        ? window.__buildShareText(raw)
        : raw;

      if (navigator.share) {
        try { await navigator.share({ text }); }
        catch { }
      } else {
        const copy = document.getElementById('copyBtn');
        if (copy) copy.click();
      }
    });
  }

  const langListEl     = document.getElementById('languageList');
  const langSelect     = document.getElementById('langSelect');
  const currentLangEl  = document.getElementById('currentLanguageName');

  function syncCurrentLang() {
    if (!langSelect || !currentLangEl) return;
    const value = langSelect.value;
    const text = langSelect.options[langSelect.selectedIndex].text;
    currentLangEl.innerHTML =
      '<span class="language-picker__flag language-picker__flag--' + value + '"></span>' + text;
  }

  function buildLangList() {
    if (!langListEl || !langSelect) return;
    langListEl.innerHTML = '';

    for (let i = 0; i < langSelect.options.length; i++) {
      const opt = langSelect.options[i];
      const btn = document.createElement('button');
      btn.className = 'lang-row' + (opt.selected ? ' active' : '');
      btn.innerHTML =
        '<span class="language-picker__flag language-picker__flag--' + opt.value + '"></span>' +
        '<span class="lang-name">' + opt.text + '</span>';

      btn.addEventListener('click', e => {
        e.stopPropagation();
        langSelect.value = opt.value;
        langSelect.dispatchEvent(new Event('change', { bubbles: true }));

        const item     = document.querySelector('.js-language-picker [data-value="' + opt.value + '"]');
        const cfgPanel = document.getElementById('configPanel');
        const cfgBtn   = document.getElementById('configBtn');
        const wasOpen  = cfgPanel && cfgPanel.getAttribute('aria-hidden') === 'false';

        let origTransition = '';
        if (wasOpen && cfgPanel) {
          origTransition = cfgPanel.style.transition;
          cfgPanel.style.transition = 'none';
        }
        if (item) item.click();
        if (wasOpen && cfgPanel && cfgPanel.getAttribute('aria-hidden') === 'true') {
          cfgPanel.setAttribute('aria-hidden', 'false');
          if (cfgBtn) cfgBtn.classList.add('active-menu');
        }
        if (wasOpen && cfgPanel) {
          requestAnimationFrame(() => { cfgPanel.style.transition = origTransition; });
        }

        buildLangList();
        syncCurrentLang();
      });

      langListEl.appendChild(btn);
    }
  }

  buildLangList();
  syncCurrentLang();

  const flagHolder = document.querySelector('.js-language-picker [aria-selected="true"]');
  if (flagHolder) {
    new MutationObserver(() => { buildLangList(); syncCurrentLang(); })
      .observe(flagHolder.parentElement, {
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-selected']
      });
  }

  const mqlMobile = window.matchMedia('(max-width: 600px)');
  const allDetails = () => document.querySelectorAll('details.is-collapsible');

  function applyDesktop() {
    allDetails().forEach(d => {
      d.setAttribute('open', '');
      if (!d._desktopLocked) {
        d._desktopLocked = true;
        d._onToggle = () => { if (!d.open) d.setAttribute('open', ''); };
        d.addEventListener('toggle', d._onToggle);

        const sum = d.querySelector('summary');
        if (sum) {
          d._onClick = e => e.preventDefault();
          d._onKey = e => { if (e.key === 'Enter' || e.key === ' ') e.preventDefault(); };
          sum.addEventListener('click', d._onClick);
          sum.addEventListener('keydown', d._onKey);
        }
      }
    });
  }

  function applyMobile() {
    allDetails().forEach(d => {
      if (d._desktopLocked) {
        d.removeEventListener('toggle', d._onToggle);
        const sum = d.querySelector('summary');
        if (sum) {
          sum.removeEventListener('click', d._onClick);
          sum.removeEventListener('keydown', d._onKey);
        }
        d._desktopLocked = false;
      }

      d.removeAttribute('open');
      const body = d.querySelector('.panel-section-body');
      if (body) {
        body.style.height = '0px';
        body.style.opacity = '0';
      }

      if (!d._mobileBound) {
        d._mobileBound = true;
        const sum = d.querySelector('summary');
        if (!sum || !body) return;

        sum.addEventListener('click', e => {
          e.preventDefault(); 
          const isOpen = d.hasAttribute('open');

          if (isOpen) {
            d.classList.add('is-closing');

            const h = body.scrollHeight;
            body.style.height = h + 'px';
            body.offsetHeight;
            requestAnimationFrame(() => {
              body.style.height = '0px';
              body.style.opacity = '0';
            });
            body.addEventListener('transitionend', function onEnd(ev) {
              if (ev.propertyName !== 'height') return;
              body.removeEventListener('transitionend', onEnd);
              d.removeAttribute('open');
              d.classList.remove('is-closing');
            });

          } else {
            d.parentElement
              .querySelectorAll(':scope > details.is-collapsible[open]')
              .forEach(other => {
                if (other === d) return;
                other.classList.add('is-closing');
                const otherBody = other.querySelector('.panel-section-body');
                if (!otherBody) {
                  other.removeAttribute('open');
                  other.classList.remove('is-closing');
                  return;
                }
                const oh = otherBody.scrollHeight;
                otherBody.style.height = oh + 'px';
                otherBody.offsetHeight;
                requestAnimationFrame(() => {
                  otherBody.style.height = '0px';
                  otherBody.style.opacity = '0';
                });
                otherBody.addEventListener('transitionend', function onEnd(ev) {
                  if (ev.propertyName !== 'height') return;
                  otherBody.removeEventListener('transitionend', onEnd);
                  other.removeAttribute('open');
                  other.classList.remove('is-closing');
                });
              });

            d.setAttribute('open', '');
            const target = body.scrollHeight;
            body.style.height = '0px';
            body.style.opacity = '0';
            body.offsetHeight;
            requestAnimationFrame(() => {
              body.style.height = target + 'px';
              body.style.opacity = '1';
            });
            body.addEventListener('transitionend', function onEnd(ev) {
              if (ev.propertyName !== 'height') return;
              body.removeEventListener('transitionend', onEnd);
              body.style.height = 'auto';
            });
          }
        });
      }
    });

    ['configPanel', 'aboutPanel'].forEach(id => {
      const panel = document.getElementById(id);
      if (!panel || panel._resetBound) return;
      panel._resetBound = true;

      new MutationObserver(() => {
        if (panel.getAttribute('aria-hidden') === 'true') {
          panel.querySelectorAll('details.is-collapsible[open]').forEach(d => {
            d.removeAttribute('open');
            const b = d.querySelector('.panel-section-body');
            if (b) {
              b.style.height = '0px';
              b.style.opacity = '0';
            }
          });
        }
      }).observe(panel, { attributes: true, attributeFilter: ['aria-hidden'] });
    });
  }

  function applyViewport() {
    if (mqlMobile.matches) applyMobile();
    else applyDesktop();
  }
  applyViewport();
  mqlMobile.addEventListener('change', applyViewport);

  const bubble = document.getElementById('dragBubble');
  if (bubble) {
    try {
      const settings = JSON.parse(localStorage.getItem('qna-settings') || '{}');
      if (!settings.dragTipShown) {
        const showBubble = () => {
          bubble.setAttribute('aria-hidden', 'false');
          bubble.classList.add('show');

          const hide = () => {
            bubble.classList.remove('show');
            bubble.setAttribute('aria-hidden', 'true');
            try {
              const cur = JSON.parse(localStorage.getItem('qna-settings') || '{}');
              cur.dragTipShown = true;
              localStorage.setItem('qna-settings', JSON.stringify(cur));
            } catch {}
            document.removeEventListener('touchstart', hide);
            document.removeEventListener('click', hide);
          };

          setTimeout(hide, 5000);
          setTimeout(() => {
            document.addEventListener('touchstart', hide, { once: true, passive: true });
            document.addEventListener('click', hide, { once: true });
          }, 500);
        };

        const landing = document.getElementById('landing');
        const isHidden = el =>
          el && (
            el.classList.contains('hidden') ||
            document.documentElement.classList.contains('has-visited')
          );

        if (isHidden(landing)) {
          setTimeout(showBubble, 800);
        } else if (landing) {
          const observer = new MutationObserver(() => {
            if (landing.classList.contains('hidden')) {
              observer.disconnect();
              setTimeout(showBubble, 500);
            }
          });
          observer.observe(landing, { attributes: true, attributeFilter: ['class'] });
        } else {
          setTimeout(showBubble, 800);
        }
      }
    } catch {}
  }
});
