/**
 * boot.js — Inicialização precoce da página
 *
 * Carregado no <head> de forma SÍNCRONA (sem defer), antes do body renderizar.
 * Responsável por:
 *
 * 1. Aplicação do tema (anti-flash de tema)
 *    Lê o tema salvo do localStorage e aplica a classe correspondente no
 *    <html> imediatamente. Sem isso, a página pinta primeiro com o tema
 *    default (cores claras) e só depois o app.js/about.js aplica o tema
 *    salvo — causando um "flash" desagradável pra quem usa tema noite.
 *
 *    Funciona pras duas páginas (index e about) porque está no <head> de
 *    ambas. Aplica a classe no <html> em vez do <body> porque <html>
 *    existe antes do parser do HTML chegar no <body>.
 *
 * 2. Listener "ir pro about" — captura cliques em links pra about.html
 *    ANTES da navegação acontecer e marca de onde o usuário veio (landing
 *    ou cards). O about.js usa essa flag pra decidir pra onde voltar.
 *
 *    Por que aqui (boot.js) e não no app.js (módulo)? Módulos rodam com
 *    `defer` implícito — só executam DEPOIS do HTML parsear todo. Se o
 *    usuário clicar antes (e o módulo é grande, leva alguns ms), o listener
 *    nem foi registrado ainda. Aqui no boot.js síncrono, o listener é
 *    anexado assim que o body existe — o mais cedo possível.
 *
 * 3. Marcar transições suaves após primeira pintada
 *    Adiciona .theme-loaded no <html> pra ativar transições suaves de tema
 *    (definidas no CSS). Sem isso, a primeira pintada teria animação esquisita.
 *
 * 4. Registro do Service Worker
 *    Habilita o cache offline da PWA.
 */

(function applyTheme() {
  try {
    var settings = JSON.parse(localStorage.getItem('qna-settings') || '{}');
    if (settings.theme && settings.theme !== 'default') {
      document.documentElement.classList.add(settings.theme);
    }
  } catch (e) {
  }
})();

if (!/about\.html$/.test(window.location.pathname)) {
  document.addEventListener('click', function (e) {
    var link = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!link) return;
    var href = link.getAttribute('href') || '';
    if (href.indexOf('about.html') === -1) return;

    var landing = document.getElementById('landing');
    var onLanding = landing && !landing.classList.contains('hidden');
    try {
      sessionStorage.setItem('qna-about-origin', onLanding ? 'landing' : 'cards');
    } catch (err) {
    }
  }, true); 
}

window.addEventListener('DOMContentLoaded', function () {
  requestAnimationFrame(function () {
    document.documentElement.classList.add('theme-loaded');
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./service-worker.js');
  });
}
