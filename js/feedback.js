/**
 * feedback.js — Construtor da URL do Google Forms de feedback
 *
 * Compartilhado entre app.js (página principal) e about.js (página Sobre).
 * Detecta navegador/sistema e injeta esses + outros metadados (idioma, tema,
 * versão, timestamp, URL) como query params, pré-preenchendo campos do form.
 *
 * COMO CONFIGURAR:
 *   1. Cria o form no Google Forms seguindo a estrutura em docs/TECHNICAL.md
 *   2. Copia a URL base do form e cola em FEEDBACK_FORM.baseUrl
 *   3. Pra cada campo "técnico" do form, descobre o entry.X via:
 *      - Abre o form, clica nos 3 pontos → "Get pre-filled link"
 *      - Preenche todos os campos com valores tipo TESTE_BROWSER, TESTE_TEMA, etc
 *      - Clica "Get link" no fim — a URL gerada terá entry.123456=TESTE_BROWSER
 *   4. Cola cada número (123456) no FEEDBACK_FORM.fields.X correspondente
 *
 * Se algum entry estiver com valor 0, o campo simplesmente não é pré-preenchido
 * (silencioso). O form continua funcionando, só falta automação naquele campo.
 */

export const VERSION = '1.0.2';

const DEFAULTS = { lang: 'pt', theme: 'default' };

export const FEEDBACK_FORM = {
  baseUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfIQpN9AibVkXToRhHddRm-bLAEHGcsb-7uZBkNpcZvLUAoQg/viewform',
  fields: {
    browser:   1471723539,  // pergunta "Navegador"
    system:    807488389,   // pergunta "Sistema (mobile/desktop)"
    lang:      106493052,   // pergunta "Idioma do app"
    theme:     2080104158,  // pergunta "Tema do app"
    version:   1202250622,  // pergunta "Versão do app"
    timestamp: 126652895,   // pergunta "Data/hora do report"
    pageUrl:   817445997,   // pergunta "URL onde aconteceu"
  },
};

function detectBrowser() {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua))                          return 'Edge';
  if (/Chrome\//.test(ua) && !/Edg/.test(ua))    return 'Chrome';
  if (/Firefox\//.test(ua))                      return 'Firefox';
  if (/Safari\//.test(ua) && !/Chrome/.test(ua)) return 'Safari';
  if (/Opera|OPR\//.test(ua))                    return 'Opera';
  return 'Outro (' + ua.slice(0, 80) + ')';
}

function detectSystem() {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS (iPhone/iPad)';
  if (/Android/.test(ua))          return 'Android';
  if (/Windows/.test(ua))          return 'Windows';
  if (/Mac OS X/.test(ua))         return 'macOS';
  if (/Linux/.test(ua))            return 'Linux';
  return 'Outro';
}

export function buildFeedbackUrl() {
  const params = new URLSearchParams();
  const f = FEEDBACK_FORM.fields;

  let lang = DEFAULTS.lang;
  let theme = DEFAULTS.theme;
  try {
    const r = JSON.parse(localStorage.getItem('qna-settings') || '{}');
    if (r.lang)  lang  = r.lang;
    if (r.theme) theme = r.theme;
  } catch {
  }

  const data = {
    [f.browser]:   detectBrowser(),
    [f.system]:    detectSystem(),
    [f.lang]:      lang,
    [f.theme]:     theme,
    [f.version]:   VERSION,
    [f.timestamp]: new Date().toISOString(),
    [f.pageUrl]:   window.location.href,
  };

  for (const [entryId, value] of Object.entries(data)) {
    if (entryId === '0' || !entryId) continue;
    params.set('entry.' + entryId, value);
  }

  const qs = params.toString();
  return FEEDBACK_FORM.baseUrl + (qs ? '?' + qs : '');
}

export function attachFeedbackHandler(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.addEventListener('click', () => {
    el.href = buildFeedbackUrl();
  });
}