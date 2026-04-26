/**
 * about-content.js — Conteúdo (textos longos e releases) da página About
 *
 * Este arquivo contém só DADOS de CONTEÚDO, não strings de UI.
 *
 *   - Textos longos das seções (parágrafos, listas em HTML).
 *   - Releases com features e fixes.
 *
 * As strings de UI (botões "Voltar", labels de aba, etc) ficam em js/i18n.js
 * sob o prefixo about_*. Acessadas via t('about_back', lang).
 *
 * Estrutura:
 *   - C[lang] = textos longos (HTML inline) das seções "Sobre".
 *     Cada idioma é uma chave (pt, en, ...). Pra adicionar idioma novo,
 *     replicar a estrutura de pt.
 *   - R[lang] = array de releases, do mais recente pro mais antigo.
 *     Cada release: { ver, title, date, author, summary, features[], fixes[] }.
 *     Pra adicionar release nova, prepende ela no array de cada idioma.
 */

export const C = {
  pt: {
    sobreApp: '<p>O <strong>Fica pro Café</strong> é um pequeno deck de perguntas pensadas pra serem usadas em mesa de bar, almoço de domingo, primeiro encontro, jantar com sogro, viagem de carro longa, ou qualquer momento em que você queira ir além do "e aí, tudo certo?".</p><p>São perguntas que vão de absurdas e divertidas ("se você fosse um prato de comida, qual seria?") até profundas e meio escabrosas ("qual mentira você conta pra si mesmo e já percebeu que conta?"). A ideia é que você sempre tenha uma carta na manga quando a conversa estiver morrendo — ou quando você quiser, de propósito, virar a mesa pra um lado mais profundo.</p><p>Funciona offline, dá pra instalar como aplicativo na tela inicial do celular, e tudo roda no seu próprio dispositivo: nada é enviado pra servidor nenhum.</p>',
    sobrePerguntas: '<p>O app começou como uma brincadeira: as perguntas de ask.fm de uns anos atrás eram uma curtição com amigos, e a vontade de ter aquilo numa forma mais cuidada nunca passou. Conexões humanas são meu xodó — gosto de conversa que instiga e aproxima ao mesmo tempo.</p><p>As perguntas estão divididas em três vibes:</p><ul><li><strong>Profundas</strong> — pra quando você quer ir fundo (em si mesmo, no outro, ou nos dois)</li><li><strong>Divertidas</strong> — pra quando a conversa precisa de risada</li><li><strong>Sobre o grupo</strong> — pras pessoas que estão com você ali, naquele momento</li></ul><p>Tem perguntas idiotas, tem perguntas que mexem com você. Tem das duas porque ambas têm seu lugar.</p>',
    sobreCriadora: '<p>Oi, eu sou a Dani.</p><p>Adoro board games, tabuleiros, e reunir gente em casa pra jogar. Os melhores momentos de jogo, na real, raramente são os melhores lances — são as conversas que rolam no meio: a piada que ninguém esperava, o desabafo que apareceu do nada, o "espera, sério?" depois de uma resposta inesperada.</p><p>Isso vale pra mesa de jogo, pra Discord madrugada adentro, pra café com amigo que você não vê faz tempo. Esse app é uma tentativa de empacotar um pedaço disso — perguntas pra ter na manga quando você quiser puxar uma boa conversa, sem precisar fingir que tem alguma habilidade nata pra isso (eu também não tenho).</p>',
    licenca: '<p>O <strong>Fica pro Café</strong> é um software livre, distribuído sob a <strong>Licença MIT</strong>.</p><p>Copyright © 2026 Daniela Miura Tamiya</p><p>Na prática, isso quer dizer que você pode:</p><ul><li>Usar o app pra qualquer fim, inclusive comercial</li><li>Copiar, modificar e redistribuir o código</li><li>Pegar partes dele e usar em outros projetos seus</li></ul><p>Contanto que você mantenha o aviso de copyright nas cópias e aceite que o software é fornecido "como está", sem garantias de qualquer tipo. Se ele quebrar alguma coisa, eu tô fora.</p><p>O texto completo da licença, em inglês (que é o que tem validade legal), está logo abaixo:</p><pre style="white-space:pre-wrap;font-family:monospace;font-size:.85rem;line-height:1.6;padding:1rem;background:rgba(0,0,0,0.04);border-radius:8px;margin-top:1rem">MIT License\n\nCopyright (c) 2026 Daniela Miura Tamiya\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</pre>',
  },
  en: {
    sobreApp: '<p><strong>Fica pro Café</strong> is a small deck of questions made for bar tables, Sunday lunches, first dates, dinner with the in-laws, long road trips, or any moment when you want to go beyond "so, how have you been?".</p><p>The questions range from absurd and fun ("if you were a dish, which one would you be?") to deep and a bit uncomfortable ("what lie do you tell yourself, that you already noticed you tell?"). The idea is to always have an ace up your sleeve when conversation runs dry — or when you intentionally want to flip the table toward something deeper.</p><p>It works offline, can be installed as an app on your home screen, and everything runs on your own device: nothing is sent to any server.</p>',
    sobrePerguntas: '<p>The app started as a goof: those ask.fm questions from a few years ago were a fun thing to do with friends, and the urge to have something like that in a more polished form never went away. Human connection is my soft spot — I love conversations that provoke and bring people closer at the same time.</p><p>The questions are split into three vibes:</p><ul><li><strong>Deep</strong> — for when you want to dig in (into yourself, the other person, or both)</li><li><strong>Fun</strong> — for when the conversation needs laughter</li><li><strong>About the group</strong> — for the people who are with you, right there, in that moment</li></ul><p>There are silly questions, and there are questions that hit you. Both are here because both have their place.</p>',
    sobreCriadora: '<p>Hi, I\'m Dani.</p><p>I love board games, tabletop, and gathering people at home to play. The best moments of a game, honestly, are rarely the best plays — they\'re the conversations that happen along the way: the unexpected joke, the random heart-to-heart, the "wait, really?" after a surprising answer.</p><p>That\'s true at the table, on Discord at 3 AM, over coffee with a friend you haven\'t seen in ages. This app is an attempt to bottle some of that — questions to keep on hand for when you want to spark a good conversation, without having to pretend you have any natural talent for it (I don\'t either).</p>',
    licenca: '<p><strong>Fica pro Café</strong> is free software, distributed under the <strong>MIT License</strong>.</p><p>Copyright © 2026 Daniela Miura Tamiya</p><p>In practice, this means you are free to:</p><ul><li>Use the app for any purpose, including commercial</li><li>Copy, modify, and redistribute the code</li><li>Take parts of it and use in your own projects</li></ul><p>As long as you keep the copyright notice in copies and accept that the software is provided "as is", without warranty of any kind. If it breaks anything, I\'m out.</p><p>The full license text is below:</p><pre style="white-space:pre-wrap;font-family:monospace;font-size:.85rem;line-height:1.6;padding:1rem;background:rgba(0,0,0,0.04);border-radius:8px;margin-top:1rem">MIT License\n\nCopyright (c) 2026 Daniela Miura Tamiya\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</pre>',
  }
};

export const R = {
  pt: [
    { ver:'v 1.0.0', title:'A primeira xícara', date:'27 abr 2026', author:'Daniela Tamiya',
      summary:'Primeiro lançamento público. 273 perguntas em 3 categorias, dois temas, dois idiomas, e interface amigável.',
      features:[
        '273 perguntas curadas em 3 categorias: Profundas, Divertidas e Sobre o grupo',
        'Deck "Todas" que mistura tudo aleatoriamente',
        'Suporte a português e inglês — adaptado culturalmente, não traduzido literalmente',
        'Dois temas visuais: Casinha (claro) e Noite Aconchegante (escuro)',
        'Três tamanhos de fonte ajustáveis',
        'Gesto de swipe no mobile pra trocar de pergunta',
        'Compartilhar pergunta via Web Share API (mobile) ou copiar (desktop)',
        'PWA instalável na tela inicial (Android e iOS)',
        'Funciona offline depois da primeira visita',
        'Sistema de feedback via formulário — sem login, com dados técnicos pré-preenchidos',
        'Sem analytics, sem tracking, sem servidor: tudo roda no seu dispositivo'
      ],
      fixes:[] }
  ],
  en: [
    { ver:'v 1.0.0', title:'The first cup', date:'Apr 27 2026', author:'Daniela Tamiya',
      summary:'First public release. 273 questions in 3 categories, two themes, two languages, and amicable interface.',
      features:[
        '273 curated questions in 3 categories: Deep, Fun, and About the group',
        '"All" deck that mixes everything randomly',
        'Portuguese and English support — culturally adapted, not literally translated',
        'Two visual themes: Casinha (light) and Cozy Night (dark)',
        'Three adjustable font sizes',
        'Swipe gesture on mobile to switch questions',
        'Share questions via Web Share API (mobile) or copy (desktop)',
        'Installable PWA on home screen (Android and iOS)',
        'Works offline after the first visit',
        'Feedback system via form — no login, with technical data pre-filled',
        'No analytics, no tracking, no server: everything runs on your device'
      ],
      fixes:[] }
  ]
};