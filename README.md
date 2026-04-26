# Fica pro Café

> Um deck de perguntas pra puxar boa conversa em mesa de bar, jantar de família, primeiro encontro, road trip, ou qualquer momento em que você queira ir além do "e aí, tudo certo?".

PWA gratuita, funciona offline, instalável na tela inicial. Tudo roda no próprio dispositivo do usuário — nenhum dado é enviado pra servidor.

---

## Funcionalidades

- **273 perguntas** divididas em 3 categorias: Profundas, Divertidas, Grupo
- Deck **"Todas"** que mistura todas as categorias aleatoriamente
- **2 idiomas:** pt-BR e en-US (troca sem recarregar)
- **2 temas visuais:** Casinha (padrão) e Noite aconchegante
- **Tamanho de fonte ajustável** (pequeno / médio / grande)
- **Mobile:** arraste o cartão pra trocar de pergunta + botão de compartilhar (Web Share API)
- **Desktop:** seta lateral pra próxima pergunta + botão de copiar
- **Texto compartilhado formatado:** "Veja essa pergunta que vi em [link]! [pergunta]"
- **Sem repetição:** não repete pergunta até passar por todas as do deck
- **PWA instalável** com cache offline via Service Worker

---

## Estrutura do projeto

```
fica-pro-cafe/
├── index.html                      # tela principal (card de perguntas)
├── about.html                      # página Sobre / Atualizações / Licença / Feedback
├── manifest.webmanifest            # configuração PWA
├── service-worker.js               # cache offline
├── LICENSE                         # MIT License (oficial, em inglês)
├── README.md                       # este arquivo (visão geral)
├── .gitignore                      # arquivos ignorados pelo Git
├── docs/
│   ├── TECHNICAL.md                # documentação técnica (arquitetura, padrões, boas práticas)
│   ├── PRODUCT.md                  # documentação de produto (visão, princípios, decisões)
│   └── translations/
│       └── LICENSE.pt-BR.md        # tradução não-oficial da licença pra PT
├── js/
│   ├── boot.js                     # anti-flash + registro do Service Worker
│   ├── app.js                      # lógica principal do app (entrypoint)
│   ├── ui-mobile.js                # UI mobile (drawer, painéis, balão, share)
│   ├── about.js                    # lógica da página About
│   ├── i18n.js                     # todas as strings de UI traduzidas
│   ├── config.js                   # configurações (temas, tamanhos de fonte)
│   ├── decks.js                    # banco de perguntas
│   ├── about-content.js            # textos longos e releases do About
│   └── feedback.js                 # construtor da URL do Google Forms (com auto-preenchimento)
├── styles/
│   ├── 01-base.css                 # variáveis, temas, html/body, scrollbar
│   ├── 02-layout.css               # header, footer, stage, card, landing
│   ├── 03-components.css           # drawer, painéis, language-picker, releases
│   └── 04-mobile.css               # adaptações responsivas (media queries)
└── assets/
    └── icons/
        ├── favicon.svg             # coração marrom (browser tab)
        ├── icon-192.png            # xícara (PWA instalada)
        ├── icon-512.png            # xícara (PWA instalada)
        ├── maskable-512.png        # xícara com fundo creme (Android maskable)
        └── br.png, en.png, jp.png  # bandeiras do language picker
```

---

## Como rodar localmente

Precisa de um servidor HTTP local (não abre direto via `file://` por causa dos ES Modules).

```bash
# Opção 1: live-server (npm) — recarrega automaticamente ao salvar arquivos
npx live-server

# Opção 2: Python (já vem instalado em macOS e Linux)
python3 -m http.server 8080

# Opção 3: serve (npm)
npx serve .
```

Depois acesse `http://localhost:8080/` (ou a porta que o servidor mostrar).

---

## Como editar

### Adicionar/editar perguntas
Abra `js/decks.js`. Cada categoria tem um array `questions` com objetos `{ id, text }`. Adicione, edite ou remova à vontade. Mantenha os `id` únicos dentro de cada categoria.

### Editar textos do About
Abra `js/about-content.js`. Os textos longos estão em `C[lang]` como HTML inline.

### Adicionar uma release nova
Em `js/about-content.js`, no array `R.pt` (e `R.en`), prepende um objeto novo no começo:

```js
{ ver:'v 1.3.0', title:'Título', date:'15 mai 2026', author:'Daniela Tamiya',
  summary:'Resumo curto.',
  features:['Feature 1', 'Feature 2'],
  fixes:['Fix 1'] }
```

### Mudar string de UI
Abra `js/i18n.js`. Strings da página About têm prefixo `about_*`.

### Adicionar tema novo
Veja o passo-a-passo em [`docs/TECHNICAL.md`](docs/TECHNICAL.md#como-adicionar-um-tema-novo).

### Configurar formulário de feedback (Google Forms)
O app coleta feedback via um Google Form com auto-preenchimento de dados técnicos (navegador, sistema, idioma, tema, etc). Veja [`docs/TECHNICAL.md`](docs/TECHNICAL.md#-sistema-de-feedback) pra:
- Estrutura sugerida do form
- Categorias prontas pra bug e sugestão (copiar e colar)
- Como descobrir os IDs `entry.X` dos campos
- Como configurar `js/feedback.js`

---

## Atualizando o app já publicado

O app usa Service Worker pra cache offline. Quando publicar mudanças, **bumpe a versão** no `service-worker.js`:

```js
const CACHE = 'qna-pwa-v17'; // incremente o número
```

Sem isso, navegadores que já visitaram vão continuar servindo a versão antiga do cache.

Se mudou a lista de arquivos do projeto, atualize também o array `ASSETS` no `service-worker.js`.

---

## Como publicar

Como é PWA estática, qualquer servidor HTTP serve. Opções gratuitas:

- **GitHub Pages** — push num repo público, ative em Settings → Pages
- **Netlify** — arrasta o ZIP no painel, ou conecta o repo
- **Vercel** — `vercel deploy` no terminal, ou conecta o repo

Depois de publicar, edite o `APP_URL` em `js/app.js` (linha ~28) com a URL real, pra que o botão "Compartilhar" inclua o link correto.

Para SEO e previews ricos no WhatsApp/redes sociais, veja a seção sobre Open Graph em [`docs/TECHNICAL.md`](docs/TECHNICAL.md#seo-e-open-graph).

---

## Documentação adicional

- **[`docs/TECHNICAL.md`](docs/TECHNICAL.md)** — Arquitetura, padrões de código, convenções, boas práticas. Leia antes de mexer em código.
- **[`docs/PRODUCT.md`](docs/PRODUCT.md)** — Visão de produto, princípios, decisões tomadas, roadmap. Leia antes de propor novas features.

---

## Stack técnica

- **HTML/CSS/JavaScript vanilla** — sem framework, sem build tool
- **ES Modules** — imports nativos do navegador
- **Service Worker** — cache offline
- **localStorage** — persistência de preferências do usuário

Decisão consciente: nada de React/Vue/build/bundlers. O app é pequeno, performático, fácil de manter sem dependências.

---

## Licença

MIT — veja [LICENSE](LICENSE) (oficial, em inglês) ou [docs/translations/LICENSE.pt-BR.md](docs/translations/LICENSE.pt-BR.md) (tradução).

Copyright © 2026 Daniela Miura Tamiya