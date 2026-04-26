/**
 * about.js — Lógica da página "Sobre" (about.html)
 *
 * Responsável por toda a interatividade da página de informações:
 *   1. Lê o idioma persistido em localStorage (compartilhado com index.html)
 *   2. Renderiza textos do idioma ativo nos elementos da página
 *   3. Gerencia a navegação entre abas (Sobre / Atualizações / Licença / Feedback)
 *   4. Renderiza a lista de releases e a tela de release individual
 *   5. Constrói a sidebar de navegação (TOC) específica de cada aba
 *   6. Implementa scroll spy (destaca o item ativo conforme rola)
 *   7. Setup do language-picker e do menu hambúrguer mobile
 *
 * Dependências:
 *   - i18n.js: strings de UI (about_*)
 *   - about-content.js: textos longos e releases
 */

import { t } from './i18n.js';
import { C, R } from './about-content.js';
import { attachFeedbackHandler } from './feedback.js';

function tt(key, lang) {
  return t('about_' + key, lang);
}

let lang = 'pt';
let selectedRelease = null;

try {
  const s = JSON.parse(localStorage.getItem('qna-settings') || '{}');
  if (s.lang) lang = s.lang;
} catch {}


function apply(l) {
  lang = l;

  try {
    const s = JSON.parse(localStorage.getItem('qna-settings') || '{}');
    s.lang = l;
    localStorage.setItem('qna-settings', JSON.stringify(s));
  } catch {}

  const c = C[l] || C.pt;
  const releases = R[l] || R.pt;

  document.getElementById('backLabel').textContent = tt('back', lang);
  document.getElementById('tabSobre').textContent = tt('tabSobre', lang);
  document.getElementById('tabAtualizacoes').textContent = tt('tabAtualizacoes', lang);
  document.getElementById('tabLicenca').textContent = tt('tabLicenca', lang);
  document.getElementById('tabFeedback').textContent = tt('tabFeedback', lang);

  document.getElementById('h-sobre-app').textContent = tt('hSobreApp', lang);
  document.getElementById('c-sobre-app').innerHTML = c.sobreApp;
  document.getElementById('h-sobre-perguntas').textContent = tt('hSobrePerguntas', lang);
  document.getElementById('c-sobre-perguntas').innerHTML = c.sobrePerguntas;
  document.getElementById('h-sobre-criadora').textContent = tt('hSobreCriadora', lang);
  document.getElementById('c-sobre-criadora').innerHTML = c.sobreCriadora;
  document.getElementById('h-licenca').textContent = tt('hLicenca', lang);
  document.getElementById('c-licenca').innerHTML = c.licenca;
  document.getElementById('h-feedback').textContent = tt('hFeedback', lang);
  document.getElementById('feedbackText').textContent = tt('feedbackText', lang);
  document.getElementById('feedbackLinkText').textContent = tt('feedbackLink', lang);

  const footer = document.getElementById('aboutFooterText');
  if (footer) footer.textContent = tt('footer', lang) || '';

  const hero = document.getElementById('releaseHero');
  const list = document.getElementById('releaseList');
  list.innerHTML = '';

  if (selectedRelease === null) {
    const latest = releases[0];
    hero.style.display = '';
    hero.style.cursor = 'pointer';
    hero.innerHTML =
      '<h2>' + latest.ver + ' — ' + latest.title + '</h2>' +
      '<p>' + latest.summary + '</p>' +
      '<div class="release-author">' + latest.author + ' | ' + latest.date + '</div>';
    hero.onclick = () => {
      selectedRelease = 0;
      apply(lang);
      window.scrollTo(0, 0);
    };
    releases.slice(0, 3).forEach((r, i) => list.appendChild(renderEntry(r, i, true)));
  } else {
    hero.style.display = 'none';
    list.appendChild(renderEntry(releases[selectedRelease], selectedRelease, false));
  }

  const mt = document.getElementById('mobileTitleAtualizacoes');
  if (mt) mt.textContent = tt('mobileTitleAtualizacoes', lang);

  document.querySelectorAll('[data-mm]').forEach(el => {
    const key = el.getAttribute('data-mm');
    const val = tt(key, lang);
    if (val !== 'about_' + key) el.textContent = val;
  });

  updateBackLabel();
  buildSidebar(getActiveTab());
}

function renderEntry(r, i, clickable) {
  const d = document.createElement('div');
  d.className = 'release-entry' + (clickable ? ' is-preview' : '');
  d.id = 'rel-' + i;
  d.style.scrollMarginTop = '80px';
  d.setAttribute('data-toc', '[' + r.date + '] ' + r.ver);

  let h = '<div class="release-entry-header"><h2>' + r.ver + ' — ' + r.title + '</h2>';
  if (clickable) h += '<span class="release-date">' + r.date + '</span>';
  h += '</div>';
  if (!clickable) h += '<div class="release-detail-author">' + r.author + ' - ' + r.date + '</div>';
  h += '<p>' + r.summary + '</p>';
  if (r.features.length) {
    h += '<h3>Features</h3><ul>' + r.features.map(f => '<li>' + f + '</li>').join('') + '</ul>';
  }
  if (r.fixes.length) {
    h += '<h3>Fixes</h3><ul>' + r.fixes.map(f => '<li>' + f + '</li>').join('') + '</ul>';
  }
  d.innerHTML = h;

  if (clickable) {
    d.style.cursor = 'pointer';
    d.onclick = () => {
      selectedRelease = i;
      apply(lang);
      window.scrollTo(0, 0);
    };
  }
  return d;
}

function updateBackLabel() {
  const lbl = document.getElementById('backLabel');
  const onReleaseDetail = getActiveTab() === 'atualizacoes' && selectedRelease !== null;
  lbl.textContent = onReleaseDetail ? tt('backReleaseNotes', lang) : tt('back', lang);
}

const tabLinks = document.querySelectorAll('.action-btn');
const tabPages = document.querySelectorAll('.tab-page');
const sidebar = document.getElementById('aboutSidebar');

function getActiveTab() {
  const a = document.querySelector('.action-btn.active');
  return a ? a.dataset.tab : 'sobre';
}

function activateTab(id) {
  if (id === 'atualizacoes') selectedRelease = null;
  tabLinks.forEach(l => l.classList.toggle('active', l.dataset.tab === id));
  tabPages.forEach(p => p.classList.toggle('active', p.id === 'tab-' + id));
  sidebar.style.display = (id === 'licenca' || id === 'feedback-tab') ? 'none' : '';
  buildSidebar(id);
  updateBackLabel();
  window.scrollTo(0, 0);
}

tabLinks.forEach(l => {
  l.addEventListener('click', e => {
    e.preventDefault();
    activateTab(l.dataset.tab);
    history.replaceState(null, '', '#' + l.dataset.tab);
  });
});

document.getElementById('backBtn').addEventListener('click', () => {
  if (getActiveTab() === 'atualizacoes' && selectedRelease !== null) {
    selectedRelease = null;
    apply(lang);
    window.scrollTo(0, 0);
    return;
  }

  let origin = 'landing'; 
  try {
    origin = sessionStorage.getItem('qna-about-origin') || 'landing';
  } catch {}

  try {
    if (origin === 'cards') {
      sessionStorage.setItem('qna-entered', 'true');
    } else {
      sessionStorage.removeItem('qna-entered');
    }
    sessionStorage.removeItem('qna-about-origin');
  } catch {}

  window.location.href = './';
});

const mobileMenu = document.getElementById('mobileMenu');
const openMobileMenu  = () => mobileMenu.setAttribute('aria-hidden', 'false');
const closeMobileMenu = () => mobileMenu.setAttribute('aria-hidden', 'true');

const hamburgerBtn = document.getElementById('hamburgerBtn');
if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMobileMenu);
document.getElementById('mobileMenuClose').addEventListener('click', closeMobileMenu);
document.getElementById('mobileMenuBack').addEventListener('click', () => {
  closeMobileMenu();
  window.location.href = './';
});

document.querySelectorAll('[data-mm-tab]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    activateTab(a.getAttribute('data-mm-tab'));
    history.replaceState(null, '', '#' + a.getAttribute('data-mm-tab'));
    closeMobileMenu();
  });
});

function buildSidebar(tabId) {
  sidebar.innerHTML = '';
  const page = document.getElementById('tab-' + tabId);
  if (!page) return;

  let items = [];

  if (tabId === 'sobre') {
    items = [
      { id: 'sec-sobre-app',       label: tt('tocSobreApp', lang) },
      { id: 'sec-sobre-perguntas', label: tt('tocPerguntas', lang) },
      { id: 'sec-sobre-criadora',  label: tt('tocCriadora', lang) }
    ];
  } else if (tabId === 'atualizacoes') {
    const releases = R[lang] || R.pt;
    const recentesLabel = tt('recentes', lang);
    items.push({ id: '_recentes', label: recentesLabel });
    releases.forEach((r, i) => items.push({ id: 'rel-' + i, label: '[' + r.date + '] ' + r.ver }));
  } else {
    page.querySelectorAll('[data-toc]').forEach(el => {
      items.push({ id: el.id, label: el.getAttribute('data-toc') });
    });
  }

  items.forEach((it, i) => {
    const a = document.createElement('a');
    a.href = '#' + it.id;
    a.textContent = it.label;

    if (tabId === 'atualizacoes') {
      const active =
        (it.id === '_recentes' && selectedRelease === null) ||
        (it.id === 'rel-' + selectedRelease);
      if (active) a.classList.add('active');
    } else if (i === 0) {
      a.classList.add('active');
    }

    a.addEventListener('click', e => {
      e.preventDefault();
      if (tabId === 'atualizacoes') {
        selectedRelease = (it.id === '_recentes')
          ? null
          : parseInt(it.id.replace('rel-', ''), 10);
        apply(lang);
        window.scrollTo(0, 0);
      } else {
        document.getElementById(it.id).scrollIntoView({ behavior: 'smooth', block: 'start' });
        sidebar.querySelectorAll('a').forEach(s => s.classList.remove('active'));
        a.classList.add('active');
      }
    });

    sidebar.appendChild(a);
  });
}

const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      sidebar.querySelectorAll('a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
      });
    }
  });
}, { rootMargin: '-20% 0px -70% 0px' });

function observe() {
  document.querySelectorAll('.about-section').forEach(s => {
    if (s.id) obs.observe(s);
  });
}

const hash = window.location.hash.replace('#', '');
if (['sobre', 'atualizacoes', 'licenca', 'feedback-tab'].includes(hash)) {
  activateTab(hash);
}
apply(lang);
observe();

attachFeedbackHandler('feedbackLinkText');

(function () {
  const arrowSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
    '<polyline points="9 18 15 12 9 6"></polyline></svg>';

  function LP(el) {
    this.el = el;
    this.sel = el.getElementsByTagName('select')[0];
    this.opts = this.sel.getElementsByTagName('option');
    this.pid = this.sel.getAttribute('id');
    this.arrow = arrowSvg;
    init(this);
    events(this);
  }

  function txt(p) { return p.opts[p.sel.selectedIndex].text; }

  function init(p) {
    const cc = p.el.getAttribute('data-trigger-class') ? ' ' + p.el.getAttribute('data-trigger-class') : '';
    const v = p.sel.value;

    let b = '<button class="language-picker__button' + cc + '" aria-expanded="false">' +
            '<span class="language-picker__flag language-picker__flag--' + v + '"></span>' +
            '<em>' + txt(p) + '</em>' + p.arrow +
            '</button>';

    let l = '<div class="language-picker__dropdown"><ul class="language-picker__list" role="listbox">';
    for (let i = 0; i < p.opts.length; i++) {
      const s = p.opts[i].selected ? ' aria-selected="true"' : '';
      l += '<li><a href="#"' + s + ' role="option" data-value="' + p.opts[i].value + '" ' +
           'class="language-picker__item language-picker__flag language-picker__flag--' + p.opts[i].value + '">' +
           '<span>' + p.opts[i].text + '</span></a></li>';
    }
    l += '</ul></div>';

    p.el.insertAdjacentHTML('beforeend', b + l);
    p.dd   = p.el.getElementsByClassName('language-picker__dropdown')[0];
    p.trig = p.el.getElementsByClassName('language-picker__button')[0];
  }

  function events(p) {
    p.trig.addEventListener('click', function (e) {
      e.stopPropagation();
      const ex = p.trig.getAttribute('aria-expanded') === 'true';
      p.trig.setAttribute('aria-expanded', ex ? 'false' : 'true');
    });

    p.dd.addEventListener('click', function (e) {
      e.preventDefault();
      const it = e.target.closest('.language-picker__item');
      if (!it) return;

      const v = it.getAttribute('data-value');
      p.trig.setAttribute('aria-expanded', 'false');

      syncAllPickers(v);
      apply(v);
      observe();
    });

    document.addEventListener('click', function (e) {
      if (!p.el.contains(e.target)) p.trig.setAttribute('aria-expanded', 'false');
    });
  }

  function syncAllPickers(v) {
    document.querySelectorAll('.js-language-picker').forEach(function (el) {
      const b = el.querySelector('.language-picker__button');
      if (!b) return;

      const f = b.querySelector('.language-picker__flag');
      if (f) f.className = 'language-picker__flag language-picker__flag--' + v;

      const em = b.querySelector('em');
      const dd = el.querySelector('.language-picker__dropdown');
      if (!dd) return;

      const prev = dd.querySelector('[aria-selected="true"]');
      if (prev) prev.removeAttribute('aria-selected');

      const next = dd.querySelector('[data-value="' + v + '"]');
      if (next) {
        next.setAttribute('aria-selected', 'true');
        if (em) em.textContent = next.querySelector('span').textContent;
      }
    });
  }

  const pickers = document.getElementsByClassName('js-language-picker');
  for (let i = 0; i < pickers.length; i++) new LP(pickers[i]);

  syncAllPickers(lang);
})();