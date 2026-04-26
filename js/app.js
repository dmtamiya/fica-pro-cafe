/**
 * app.js — Lógica principal do app (entrypoint)
 *
 * Responsável por:
 *   - Estado global (idioma, tema, deck atual, fila de perguntas)
 *   - Persistência em localStorage
 *   - Renderização do card de pergunta (próxima pergunta, copy, swipe)
 *   - Listas de configuração (temas, tamanhos de fonte, decks)
 *   - Painéis (config, about) — abrir, fechar, click-outside
 *   - Language picker (instanciado nos elementos .js-language-picker)
 *
 * Importa de:
 *   - i18n.js: função t() pra traduzir strings
 *   - config.js: lista de THEMES e FONT_SIZES
 *   - decks.js: banco de perguntas
 */

import { t } from './i18n.js';
import { THEMES, FONT_SIZES } from './config.js';
import { DECKS } from './decks.js';
import { attachFeedbackHandler, VERSION } from './feedback.js';

const APP_URL = '';

const DEFAULTS = {
  lang: 'pt',
  theme: 'default',
  deck: 'all',
  fontSize: 'medium',
};

const THEME_BAR_COLORS = {
  'default':                  '#974315',
  'theme-noite-aconchegante': '#061021',
};


const els = {
  landing:           document.getElementById('landing'),
  startBtn:          document.getElementById('startBtn'),
  landingFeedback:   document.getElementById('landingFeedback'),
  card:              document.getElementById('card'),
  question:          document.getElementById('questionText'),
  questionPill:      document.getElementById('questionPill'),
  nextBtn:           document.getElementById('nextBtn'),
  copyBtn:           document.getElementById('copyBtn'),
  catTrigger:        document.getElementById('catTrigger'),
  catName:           document.getElementById('catName'),
  catOverlay:        document.getElementById('catOverlay'),
  catOverlayList:    document.getElementById('catOverlayList'),
  configBtn:         document.getElementById('configBtn'),
  configPanel:       document.getElementById('configPanel'),
  closeConfigPanel:  document.getElementById('closeConfigPanel'),
  themeList:         document.getElementById('themeList'),
  fontSizeList:      document.getElementById('fontSizeList'),
  currentThemeName:  document.getElementById('currentThemeName'),
  currentFontSize:   document.getElementById('currentFontSize'),
  aboutBtn:          document.getElementById('aboutBtn'),
  aboutPanel:        document.getElementById('aboutPanel'),
  closeAboutPanel:   document.getElementById('closeAboutPanel'),
  sairBtn:           document.getElementById('sairBtn'),
  feedbackLink:      document.getElementById('feedbackLink'),
};

let state = {
  lang:        DEFAULTS.lang,
  theme:       DEFAULTS.theme,
  deckId:      DEFAULTS.deck,
  fontSize:    DEFAULTS.fontSize,
  queue:       [],
  orderedIds:  [],
  map:         new Map(),
  touch:       null,
  catOpen:     false,
  copyTimer:   null,
};

function load() {
  try {
    const r = JSON.parse(localStorage.getItem('qna-settings'));
    if (!r) return;
    state.lang     = r.lang     || DEFAULTS.lang;
    state.theme    = r.theme    || DEFAULTS.theme;
    state.deckId   = r.deckId   || DEFAULTS.deck;
    state.fontSize = r.fontSize || DEFAULTS.fontSize;
    if (state.deckId === 'reflexivas' || state.deckId === 'relacoes') {
      state.deckId = 'profundas';
    }
  } catch {
  }
}

function save() {
  localStorage.setItem('qna-settings', JSON.stringify({
    lang:     state.lang,
    theme:    state.theme,
    deckId:   state.deckId,
    fontSize: state.fontSize,
  }));
}

function updateThemeBarColor(id) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;
  meta.setAttribute('content', THEME_BAR_COLORS[id] || THEME_BAR_COLORS['default']);
}

function setTheme(id) {
  const html = document.documentElement;
  html.classList.remove(...THEMES.map(t => t.id).filter(Boolean));
  if (id !== 'default') html.classList.add(id);
  state.theme = id;
  updateThemeBarColor(id);
  save();
}

function setFontSize(id) {
  const fs = FONT_SIZES.find(f => f.id === id);
  if (!fs) return;
  document.documentElement.style.setProperty('--font-scale', fs.scale);
  state.fontSize = id;
  save();
}

function setLang(lang) {
  state.lang = lang;
  save();
  applyI18n();
  rebuildDecks();
  populateThemeList();
  populateFontSizeList();
  syncCatName();
  if (window.__syncLanguagePickers) window.__syncLanguagePickers(lang);
}

function shuffle(a) {
  let m = a.length, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    [a[m], a[i]] = [a[i], a[m]];
  }
  return a;
}

function getLangDecks() {
  return DECKS[state.lang];
}

function buildAllDeck(langDecks) {
  const all = [];
  for (const cat of langDecks) {
    for (const q of cat.questions) all.push({ ...q, categoryId: cat.id });
  }
  return { id: 'all', nameKey: 'deckAll', questions: all };
}

function buildMapAndQueue() {
  const decks = getLangDecks();
  const map = new Map();
  const ids = [];

  if (state.deckId === 'all') {
    for (const c of decks) {
      for (const q of c.questions) {
        map.set(q.id, { text: q.text, categoryId: c.id });
        ids.push(q.id);
      }
    }
  } else {
    const c = decks.find(d => d.id === state.deckId);
    if (c) {
      for (const q of c.questions) {
        map.set(q.id, { text: q.text, categoryId: c.id });
        ids.push(q.id);
      }
    }
  }

  state.map = map;
  state.orderedIds = [...ids];
  state.queue = shuffle([...ids]);
}

function nextQuestion() {
  closeCat();
  clearCopied();
  if (state.queue.length === 0) buildMapAndQueue();

  const qid = state.queue.pop();
  const q = state.map.get(qid);
  if (!q) return;

  const pillText = qid.toUpperCase();

  els.question.style.transition = 'opacity .18s, transform .18s';
  els.question.style.opacity = '0';
  els.question.style.transform = 'translateY(6px)';
  els.questionPill.style.transition = 'opacity .18s';
  els.questionPill.style.opacity = '0';

  setTimeout(() => {
    els.question.textContent = q.text;
    els.questionPill.textContent = pillText;
    els.question.style.transform = 'translateY(-6px)';
    requestAnimationFrame(() => {
      els.question.style.opacity = '1';
      els.question.style.transform = 'translateY(0)';
      els.questionPill.style.opacity = '1';
    });
  }, 180);
}

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(n => {
    n.textContent = t(n.getAttribute('data-i18n'), state.lang);
  });
}

function syncCatName() {
  els.catName.textContent = state.deckId === 'all'
    ? t('deckAll', state.lang)
    : t('cat_' + state.deckId, state.lang);
}

function openCat() {
  state.catOpen = true;
  document.body.classList.add('cat-open');
  populateCatList();
}

function closeCat() {
  state.catOpen = false;
  document.body.classList.remove('cat-open');
}

function toggleCat() {
  state.catOpen ? closeCat() : openCat();
}

function populateCatList() {
  const decks = getLangDecks();
  const list = [buildAllDeck(decks), ...decks];

  els.catOverlayList.innerHTML = '';
  for (const d of list) {
    const btn = document.createElement('button');
    btn.textContent = d.id === 'all'
      ? t('deckAll', state.lang)
      : t(d.nameKey, state.lang);
    if (d.id === state.deckId) btn.classList.add('active');
    btn.addEventListener('click', () => {
      state.deckId = d.id;
      save();
      buildMapAndQueue();
      syncCatName();
      nextQuestion();
    });
    els.catOverlayList.appendChild(btn);
  }
}

function clearCopied() {
  if (state.copyTimer) {
    clearTimeout(state.copyTimer);
    state.copyTimer = null;
  }
  els.copyBtn.classList.remove('copied');
}

function copyQuestion() {
  const text = els.question.textContent;
  if (!text) return;

  navigator.clipboard.writeText(buildShareText(text)).then(() => {
    els.copyBtn.classList.add('copied');
    state.copyTimer = setTimeout(() => {
      els.copyBtn.classList.remove('copied');
      state.copyTimer = null;
    }, 2500);
  }).catch(() => {
  });
}

function buildShareText(question) {
  if (!APP_URL) return question;
  const prefix = t('shareText', state.lang);
  return prefix + ' ' + APP_URL + '!\n' + question;
}

window.__buildShareText = buildShareText;

function getThemeColors(id) {
  const t = THEMES.find(x => x.id === id);
  return t && t.previewColors ? t.previewColors : [];
}

function populateThemeList() {
  els.themeList.innerHTML = '';

  for (const th of THEMES) {
    const btn = document.createElement('button');
    btn.className = 'theme-row' + (th.id === state.theme ? ' active' : '');
    const colors = getThemeColors(th.id);
    const themeName = t(th.nameKey, state.lang);

    btn.innerHTML =
      `<span class="theme-name">${themeName}</span>` +
      `<span class="theme-colors">${colors.map(c => `<span style="background:${c}"></span>`).join('')}</span>`;

    btn.addEventListener('click', () => {
      setTheme(th.id);
      populateThemeList();
      els.currentThemeName.textContent = themeName;
    });
    els.themeList.appendChild(btn);
  }

  const cur = THEMES.find(x => x.id === state.theme);
  if (cur) els.currentThemeName.textContent = t(cur.nameKey, state.lang);
}

function populateFontSizeList() {
  els.fontSizeList.innerHTML = '';

  for (const fs of FONT_SIZES) {
    const btn = document.createElement('button');
    btn.className = 'font-size-row' + (fs.id === state.fontSize ? ' active' : '');
    btn.innerHTML =
      `<span class="size-label">${t(fs.labelKey, state.lang)}</span>` +
      `<span class="size-preview" style="font-size:${fs.previewSize}">${fs.preview}</span>`;

    btn.addEventListener('click', () => {
      setFontSize(fs.id);
      populateFontSizeList();
      els.currentFontSize.textContent = t(fs.labelKey, state.lang);
    });
    els.fontSizeList.appendChild(btn);
  }

  const cur = FONT_SIZES.find(f => f.id === state.fontSize);
  if (cur) els.currentFontSize.textContent = t(cur.labelKey, state.lang);
}

function openPanel(panel, btn) {
  closeAllPanels();
  panel.setAttribute('aria-hidden', 'false');
  if (btn) btn.classList.add('active-menu');
}

function closePanel(panel, btn) {
  panel.setAttribute('aria-hidden', 'true');
  if (btn) btn.classList.remove('active-menu');
}

function togglePanel(panel, btn) {
  if (panel.getAttribute('aria-hidden') === 'true') openPanel(panel, btn);
  else closePanel(panel, btn);
}

function closeAllPanels() {
  closePanel(els.configPanel, els.configBtn);
  closePanel(els.aboutPanel,  els.aboutBtn);
}

function attachTouch() {
  els.card.addEventListener('touchstart', e => {
    if (state.catOpen) return;
    const t = e.touches[0];
    state.touch = { x: t.clientX, y: t.clientY, moved: false };
  }, { passive: true });

  els.card.addEventListener('touchmove', e => {
    if (!state.touch || state.catOpen) return;
    const t = e.touches[0];
    const dx = t.clientX - state.touch.x;
    const dy = t.clientY - state.touch.y;
    if (Math.hypot(dx, dy) > 6) state.touch.moved = true;
    els.card.style.transform = `translate(${dx * .2}px, ${dy * .2}px) rotate(${dx * .02}deg)`;
    els.card.style.opacity = String(Math.max(.65, 1 - Math.abs(dx) / 600));
  }, { passive: true });

  function end() {
    if (!state.touch) return;
    const t = state.touch;
    state.touch = null;
    els.card.style.transform = '';
    els.card.style.opacity = '';
    if (t.moved) nextQuestion();
  }

  els.card.addEventListener('touchend',    end, { passive: true });
  els.card.addEventListener('touchcancel', end, { passive: true });
}

function showLanding() {
  els.landing.classList.remove('hidden');
  try {
    sessionStorage.removeItem('qna-entered');
  } catch {}
}

function hideLanding() {
  els.landing.classList.add('hidden');
  try {
    sessionStorage.setItem('qna-entered', 'true');
  } catch {
  }
}

function initUI() {
  populateThemeList();
  setTheme(state.theme);
  setFontSize(state.fontSize);
  populateFontSizeList();

  const versionLabel = document.getElementById('appVersionLabel');
  if (versionLabel) versionLabel.textContent = 'v' + VERSION;

  attachFeedbackHandler('feedbackLink');
  attachFeedbackHandler('landingFeedback');
  attachFeedbackHandler('landingFeedbackMobile');
  attachFeedbackHandler('feedbackLinkMobile');
  attachFeedbackHandler('feedbackLinkAboutMobile');

  els.nextBtn.addEventListener('click',    nextQuestion);
  els.copyBtn.addEventListener('click',    copyQuestion);
  els.sairBtn.addEventListener('click',    showLanding);
  els.startBtn.addEventListener('click',   hideLanding);
  els.catTrigger.addEventListener('click', toggleCat);

  els.configBtn.addEventListener('click',         () => togglePanel(els.configPanel, els.configBtn));
  els.closeConfigPanel.addEventListener('click',  () => closePanel(els.configPanel,  els.configBtn));
  els.aboutBtn.addEventListener('click',          () => togglePanel(els.aboutPanel,  els.aboutBtn));
  els.closeAboutPanel.addEventListener('click',   () => closePanel(els.aboutPanel,   els.aboutBtn));

  document.addEventListener('click', e => {
    const path = e.composedPath ? e.composedPath() : [];
    const startedInConfig = path.some(el => el === els.configPanel || el === els.configBtn);
    const startedInAbout  = path.some(el => el === els.aboutPanel  || el === els.aboutBtn);

    const configOpen = els.configPanel.getAttribute('aria-hidden') === 'false';
    const aboutOpen  = els.aboutPanel.getAttribute('aria-hidden')  === 'false';

    if (!startedInConfig && configOpen
        && !els.configPanel.contains(e.target)
        && !els.configBtn.contains(e.target)) {
      closePanel(els.configPanel, els.configBtn);
    }
    if (!startedInAbout && aboutOpen
        && !els.aboutPanel.contains(e.target)
        && !els.aboutBtn.contains(e.target)) {
      closePanel(els.aboutPanel, els.aboutBtn);
    }
    if (state.catOpen
        && !els.catOverlay.contains(e.target)
        && !els.catTrigger.contains(e.target)
        && !document.getElementById('catTriggerWrap').contains(e.target)) {
      closeCat();
    }
  });

  attachTouch();

  let alreadyEntered = false;
  try {
    alreadyEntered = sessionStorage.getItem('qna-entered') === 'true';
  } catch {
  }
  if (alreadyEntered) {
    els.landing.classList.add('hidden');
  } else {
    showLanding();
  }
}

function rebuildDecks() {
  buildMapAndQueue();
  nextQuestion();
  syncCatName();
}

function initLanguagePickers() {
  const arrowSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
    '<polyline points="9 18 15 12 9 6"></polyline></svg>';

  function LanguagePicker(el) {
    this.el    = el;
    this.sel   = el.getElementsByTagName('select')[0];
    this.opts  = this.sel.getElementsByTagName('option');
    this.pid   = this.sel.getAttribute('id');
    this.arrow = arrowSvg;
    init(this);
    events(this);
  }

  function selectedText(p) {
    return p.opts[p.sel.selectedIndex].text;
  }

  function init(p) {
    const triggerClass = p.el.getAttribute('data-trigger-class')
      ? ' ' + p.el.getAttribute('data-trigger-class')
      : '';
    const v = p.sel.value;

    const button =
      `<button class="language-picker__button${triggerClass}" aria-expanded="false">` +
        `<span class="language-picker__flag language-picker__flag--${v}"></span>` +
        `<em>${selectedText(p)}</em>${p.arrow}` +
      `</button>`;

    let listHtml = '<div class="language-picker__dropdown"><ul class="language-picker__list" role="listbox">';
    for (let i = 0; i < p.opts.length; i++) {
      const isSelected = p.opts[i].selected ? ' aria-selected="true"' : '';
      listHtml +=
        `<li><a href="#"${isSelected} role="option" data-value="${p.opts[i].value}" ` +
        `class="language-picker__item language-picker__flag language-picker__flag--${p.opts[i].value}">` +
        `<span>${p.opts[i].text}</span></a></li>`;
    }
    listHtml += '</ul></div>';

    p.el.insertAdjacentHTML('beforeend', button + listHtml);
    p.dd   = p.el.getElementsByClassName('language-picker__dropdown')[0];
    p.trig = p.el.getElementsByClassName('language-picker__button')[0];
  }

  function events(p) {
    p.trig.addEventListener('click', e => {
      e.stopPropagation();
      const expanded = p.trig.getAttribute('aria-expanded') === 'true';
      p.trig.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });

    p.dd.addEventListener('click', e => {
      e.preventDefault();
      const item = e.target.closest('.language-picker__item');
      if (!item) return;

      const v = item.getAttribute('data-value');
      p.dd.querySelector('[aria-selected="true"]').removeAttribute('aria-selected');
      item.setAttribute('aria-selected', 'true');
      p.trig.querySelector('.language-picker__flag').className =
        'language-picker__flag language-picker__flag--' + v;
      p.trig.querySelector('em').textContent = item.querySelector('span').textContent;
      p.trig.setAttribute('aria-expanded', 'false');

      syncAllPickers(v);
      setLang(v);
    });

    document.addEventListener('click', e => {
      if (!p.el.contains(e.target)) p.trig.setAttribute('aria-expanded', 'false');
    });
  }

  function syncAllPickers(v) {
    document.querySelectorAll('.js-language-picker').forEach(el => {
      const button = el.querySelector('.language-picker__button');
      const flag   = button ? button.querySelector('.language-picker__flag') : null;
      const em     = button ? button.querySelector('em') : null;

      if (flag) flag.className = 'language-picker__flag language-picker__flag--' + v;

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
  for (let i = 0; i < pickers.length; i++) new LanguagePicker(pickers[i]);

  syncAllPickers(state.lang);

  window.__syncLanguagePickers = syncAllPickers;
}

(function boot() {
  load();
  applyI18n();
  initUI();
  initLanguagePickers();
  rebuildDecks();
})();