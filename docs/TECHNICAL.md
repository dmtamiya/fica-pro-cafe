# Documentação Técnica — Fica pro Café

> Arquitetura, padrões de código, convenções e boas práticas adotadas no projeto.

Este documento é pra quem vai mexer no código. Cobre **como** o projeto é construído, **por quê** algumas decisões foram tomadas e **regras** que devem ser seguidas pra manter a coerência.

---

## Arquitetura geral

### Visão de alto nível

O Fica pro Café é uma **Progressive Web App (PWA)** estática, sem servidor próprio. Tudo roda no navegador do usuário.

```
┌─────────────────────────────────────────────────┐
│  Navegador do usuário                           │
│                                                 │
│  ┌─────────────┐    ┌─────────────────────┐    │
│  │  index.html │    │   about.html         │    │
│  └──────┬──────┘    └──────────┬──────────┘    │
│         │                       │               │
│         ▼                       ▼               │
│  ┌─────────────────────────────────────────┐   │
│  │  ES Modules (js/*.js)                  │   │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌────────┐ │   │
│  │  │ app  │ │about │ │ i18n │ │ decks  │ │   │
│  │  └──────┘ └──────┘ └──────┘ └────────┘ │   │
│  └─────────────────────────────────────────┘   │
│         │                                       │
│         ▼                                       │
│  ┌─────────────────────────────────────────┐   │
│  │  localStorage  +  Service Worker         │   │
│  │  (preferências) (cache offline)          │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

**Não há backend.** Não há banco de dados. Não há requests pra API externa (exceto Google Fonts no carregamento inicial).

### Páginas

São **2 HTMLs estáticos**, cada um com seu entrypoint JS:

| Página | HTML | Entrypoint JS |
|---|---|---|
| App principal | `index.html` | `js/app.js` |
| Sobre / Releases | `about.html` | `js/about.js` |

Os 2 compartilham:
- O mesmo CSS (4 arquivos em `styles/`)
- A mesma `localStorage` (chave `qna-settings`) — idioma persistido entre páginas
- O Service Worker (`service-worker.js`)

---

## Estrutura de arquivos JavaScript

### Princípio: **dados, lógica e UI separados**

Cada arquivo JS tem **uma responsabilidade clara**. Isso evita o famoso "deus arquivo" de 3000 linhas misturando tudo.

| Arquivo | Tipo | Responsabilidade |
|---|---|---|
| `boot.js` | Boot | Anti-flash do tema + registro do Service Worker. Roda síncrono no `<head>`. |
| `app.js` | Lógica | Estado global, render do card, listas de configuração, painéis, language picker. |
| `ui-mobile.js` | UI | Comportamentos específicos do mobile (drawer, balão, share, proxy de botões). |
| `about.js` | Lógica | Lógica da página About: tabs, releases, sidebar, scroll spy. |
| `feedback.js` | Compartilhado | Construtor da URL do Google Forms com auto-preenchimento técnico. Usado por app.js e about.js. |
| `i18n.js` | Dados | Strings de UI em PT e EN. Função `t()` pra traduzir. |
| `config.js` | Dados | Lista de temas e tamanhos de fonte disponíveis. |
| `decks.js` | Dados | Banco de perguntas (273 perguntas em 3 categorias). |
| `about-content.js` | Dados | Textos longos do About (HTML inline) + array de releases. |

**Regra:** arquivos de "Dados" (i18n, config, decks, about-content) são **passivos** — só constantes e exports, sem lógica.

### Imports e ES Modules

`app.js` é o entrypoint do `index.html`. Ele importa de `i18n.js`, `config.js` e `decks.js`. O navegador resolve a cascata automaticamente — não precisa listar cada módulo no HTML.

```html
<!-- No index.html, só isso é necessário: -->
<script type="module" src="./js/app.js"></script>
```

### `boot.js` é especial

`boot.js` roda **síncrono no `<head>`** (sem `defer`, sem `type="module"`). Por quê? Pra evitar **flash do tema errado** ao carregar.

Sem ele: o body começa com tema default → JS carrega → vê localStorage com tema noite → aplica → flash visual desagradável.

Com ele: antes do body renderizar, lê localStorage e adiciona a classe correta no `<html>`.

```html
<head>
  <script src="./js/boot.js"></script>  <!-- síncrono, ANTES dos outros -->
</head>
```

---

## Sistema de temas

### Camadas de variáveis CSS

Em `styles/01-base.css`, as variáveis são organizadas em **3 camadas**:

```
┌────────────────────────────────────────────┐
│  1. Tokens de design (não-cor)             │
│     --radius, --transition-default, etc    │
├────────────────────────────────────────────┤
│  2. Cores PRIMITIVAS (paleta crua)         │
│     --accent-1, --neutral-dark-1, etc      │
├────────────────────────────────────────────┤
│  3. Cores SEMÂNTICAS (uso na UI)           │
│     --bg, --card-text, --navbar-accent     │
└────────────────────────────────────────────┘
```

**Regra de ouro:** componentes (em `02-layout.css`, `03-components.css`, `04-mobile.css`) **só usam variáveis semânticas**. Nunca referencie `--accent-1` ou `--neutral-dark-1` direto num componente.

```css
/* ❌ ERRADO (em 02-layout.css) */
.app-header {
    background: var(--neutral-light-2);  /* primitiva direto = ruim */
}

/* ✅ CORRETO */
.app-header {
    background: var(--navbar-bg);  /* semântica que aponta pra primitiva */
}
```

**Por quê?** Porque quando você cria um tema novo (dark mode, etc), você só sobrescreve as **semânticas**. As primitivas continuam intactas. Senão você teria que mexer em 100 lugares.

### Como adicionar um tema novo

1. **`styles/01-base.css`** — adicione a classe que sobrescreve as semânticas:

   ```css
   .theme-X {
       --bg: #cor-do-bg;
       --navbar-bg: #cor-da-navbar;
       /* ... cobrir todas as ~56 variáveis semânticas ... */
   }
   ```

2. **`js/config.js`** — adicione o tema ao array:

   ```js
   { id: 'theme-X', nameKey: 'theme_X' }
   ```

3. **`js/i18n.js`** — adicione a tradução:

   ```js
   theme_X: 'Nome em PT',  // dentro do bloco pt
   theme_X: 'Name in EN',  // dentro do bloco en
   ```

4. **`js/app.js`** — adicione a cor da barra do navegador:

   ```js
   const THEME_BAR_COLORS = {
       'default': '#974315',
       'theme-X': '#sua-cor',
   };
   ```

Em runtime, a classe vai pra `<body>` e todas as variáveis são re-resolvidas pelo CSS. Zero JS extra.

---

## Internacionalização (i18n)

### Como funciona

Todo texto traduzível tem uma **chave** em `i18n.js`. Há 2 idiomas: `pt` e `en`.

```js
// js/i18n.js
export const UI_STRINGS = {
    pt: { sair: 'Sair', config: 'Configurações', ... },
    en: { sair: 'Exit', config: 'Settings', ... },
};

export function t(key, lang) {
    return (UI_STRINGS[lang] && UI_STRINGS[lang][key]) || key;
}
```

### No HTML

Use o atributo `data-i18n="chave"`:

```html
<button data-i18n="sair">Sair</button>
```

O `app.js` percorre todos os elementos com `data-i18n` e atualiza o texto:

```js
function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(n => {
        n.textContent = t(n.getAttribute('data-i18n'), state.lang);
    });
}
```

### No JS

Use a função `t()` direto:

```js
btn.textContent = t('cat_profundas', state.lang);
```

### Convenção de chaves

- Strings da app principal: nome direto (`sair`, `config`, `categoriaLabel`)
- Strings da página About: prefixo `about_` (`about_back`, `about_tabSobre`, `about_hLicenca`)
- Nomes de tema: prefixo `theme_` (`theme_default`, `theme_noite_aconchegante`)
- Nomes de categoria: prefixo `cat_` (`cat_profundas`, `cat_divertidas`, `cat_grupo`)

---

## Persistência (localStorage)

### Chave única: `qna-settings`

Tudo que persiste fica num único objeto JSON no localStorage:

```js
{
    "lang": "pt",
    "theme": "default",
    "deckId": "all",
    "fontSize": "medium",
    "hasVisited": true
}
```

### Quem escreve

- `app.js` chama `save()` após qualquer mudança (setTheme, setLang, etc)
- `about.js` também escreve em `qna-settings.lang` quando o usuário troca idioma na página About

### Por que tudo num objeto só

- Atomicidade: ou salva tudo ou não salva nada
- Fácil de migrar/inspecionar
- 1 chamada de `localStorage.setItem` em vez de N

---

## Service Worker e cache offline

### Estratégia: **stale-while-revalidate**

```js
// service-worker.js (simplificado)
caches.match(request)
    .then(cached => {
        const fetchPromise = fetch(request).then(resp => {
            caches.put(request, resp.clone());  // atualiza cache
            return resp;
        }).catch(() => cached);  // se offline, usa cache
        return cached || fetchPromise;
    });
```

**Significa:**
1. Se tá no cache, devolve do cache **imediatamente**
2. Em paralelo, tenta atualizar do servidor pra próxima visita
3. Se offline, devolve só o cache

### Pra usuário, isso quer dizer

- **Primeira visita (online):** baixa tudo, cacheia
- **Visitas seguintes:** carrega instantâneo do cache + atualiza em background
- **Offline:** funciona normal

### Atenção ao publicar update

Sempre que mudar arquivos do projeto, **bumpe a versão**:

```js
const CACHE = 'qna-pwa-v10';  // incrementa
```

Sem isso, o navegador continua servindo o cache antigo (que pode apontar pra arquivos que já mudaram).

Quando a versão muda, o SW novo:
1. É registrado em background
2. Espera todas as abas fecharem
3. Ativa, deleta o cache velho

Pra forçar update agressivo no celular: desinstala o app e reinstala.

---

## Padrões de código JavaScript

### Estilo

- **`const` por padrão**, `let` quando precisa reatribuir, `var` **nunca**
- **Arrow functions** pra callbacks: `arr.map(x => x * 2)`
- **`function` declarations** pra top-level: `function setTheme(id) { ... }`
- **Template literals** pra interpolação: `` `Olá, ${nome}` ``
- **Espaços** ao redor de operadores: `a = b + c` (não `a=b+c`)
- **Uma declaração por linha** (não `let a=1; let b=2;`)

### JSDoc no topo

Todo arquivo JS começa com um bloco JSDoc explicando:
- O que faz
- Quais arquivos importa/depende
- Convenções específicas, se houver

```js
/**
 * app.js — Lógica principal do app (entrypoint)
 *
 * Responsável por:
 *   - Estado global (idioma, tema, deck atual, fila de perguntas)
 *   - Persistência em localStorage
 *   ...
 *
 * Importa de:
 *   - i18n.js: função t()
 *   - config.js: lista de THEMES e FONT_SIZES
 *   - decks.js: banco de perguntas
 */
```

### Cache de elementos do DOM

Em vez de `document.getElementById()` espalhado pelo código, todos os elementos importantes ficam num objeto `els` no topo:

```js
const els = {
    landing: document.getElementById('landing'),
    card:    document.getElementById('card'),
    nextBtn: document.getElementById('nextBtn'),
    // ...
};

// Uso:
els.nextBtn.addEventListener('click', nextQuestion);
```

Isso:
- Documenta quais elementos a página precisa ter
- Evita re-queries
- Facilita refatoração (renomeia em 1 lugar)

### Estado centralizado

Todo o estado mutável da aplicação fica num único objeto `state`:

```js
let state = {
    lang: 'pt',
    theme: 'default',
    deckId: 'all',
    queue: [],
    map: new Map(),
    // ...
};
```

Modificações são feitas via funções dedicadas (`setTheme`, `setLang`, `nextQuestion`), nunca diretamente no objeto a partir de outro lugar.

### Try/catch em localStorage

Sempre. Modo privado de alguns navegadores bloqueia localStorage e lança exceção:

```js
function load() {
    try {
        const r = JSON.parse(localStorage.getItem('qna-settings'));
        if (r) { /* ... */ }
    } catch {
        // localStorage indisponível — usa defaults
    }
}
```

---

## Padrões de código CSS

### Convenção: `kebab-case`

Sempre. Pra nomes de classes, IDs (mínimo possível), e variáveis CSS.

```css
/* ✅ */
.action-btn { ... }
.font-size-row { ... }
--card-bg: #fff;
--neutral-dark-1: #5C4C33;

/* ❌ */
.actionBtn { ... }
.fontsize-row { ... }  /* sem hífen entre "font" e "size" */
--cardBg: #fff;
--neutralDark1: #5C4C33;
```

### Estrutura ITCSS (4 camadas)

Os 4 arquivos em `styles/` seguem uma ordem de especificidade crescente:

| Arquivo | Conteúdo | Especificidade |
|---|---|---|
| `01-base.css` | Variáveis, reset, tipografia, scrollbar | baixa |
| `02-layout.css` | Estrutura macro (header, footer, stage) | média |
| `03-components.css` | Componentes reutilizáveis (drawer, picker) | média |
| `04-mobile.css` | Responsividade (media queries) | alta (sobrescreve) |

A ordem importa: a última regra ganha em caso de conflito. **Não inverta a ordem dos `<link>` no HTML.**

### Indentação

**4 espaços, flat** (sem aninhamento visual de regras "filhas"):

```css
/* ✅ */
.parent {
    color: red;
}
.parent .child {
    color: blue;
}

/* ❌ não fazemos isso */
.parent {
    color: red;
}
    .parent .child {
        color: blue;
    }
```

### Uma propriedade por linha

```css
/* ✅ */
.card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
}

/* ❌ */
.card {
    display: flex; flex-direction: column; align-items: center; padding: 1rem;
}
```

### `!important` é último recurso

Hoje há ~20 ocorrências, todas em **utilities mobile** (`.mobile-only`, `.desktop-only`) e **prefers-reduced-motion**. Nesses casos é necessário pra vencer especificidade. Em código novo, evite. Quando for tentado a usar `!important`, primeiro pergunte: "posso usar uma classe em vez de um ID?".

### Evite seletores por `#id`

IDs têm especificidade 100x maior que classes — usar `#id` no CSS força você a usar `!important` em outros lugares pra sobrescrever. Use classes:

```css
/* ❌ */
#sairBtn { color: red; }

/* ✅ */
.sair-btn { color: red; }
```

(O HTML pode manter o `id` pra `getElementById` no JS — só não use o id como **seletor de estilo**.)

---

## Sistema de feedback

O app usa um Google Form único pra coletar feedback dos usuários (bug reports, sugestões, perguntas novas). Os links de "Feedback" no app abrem esse form externo.

### Por que Google Forms?

- **Acessível pra qualquer pessoa** (não precisa de conta GitHub)
- Respostas vão automaticamente pra uma planilha do Google Drive
- Zero infraestrutura pra manter
- Fácil de exportar / triar / responder

Pra dev/contribuidor, há também o caminho de [GitHub Issues](https://github.com/dmtamiya/fica-pro-cafe/issues).

### Auto-preenchimento técnico

A grande sacada: o app **pré-preenche dados técnicos** no form via query string. Quando o usuário clica "Feedback", ele já chega no Google Form com:

- Navegador (Chrome / Safari / Firefox / Edge / Opera / Outro)
- Sistema (iOS / Android / Windows / macOS / Linux)
- Idioma do app no momento (pt / en)
- Tema do app no momento (default / theme-noite-aconchegante)
- Versão do app
- Timestamp ISO 8601
- URL onde estava

O usuário só precisa preencher o **conteúdo** (descrição do bug, sugestão, etc). Os metadados vêm de graça.

### Arquivo: `js/feedback.js`

Esse módulo concentra toda a lógica de feedback. Exporta:

- `buildFeedbackUrl()` — monta a URL com query params
- `attachFeedbackHandler(elementId)` — anexa listener num link de feedback
- `FEEDBACK_FORM` — configuração (baseUrl + IDs dos campos)
- `VERSION` — versão atual do app

Compartilhado entre `app.js` (página principal) e `about.js` (página Sobre).

### Como configurar o form pela primeira vez

#### 1. Criar o Google Form

Estrutura recomendada (com ramificação por tipo):

**Seção 1 — Tipo de feedback** *
- Múltipla escolha
- Opções com ramificação:
  - 🐛 Reportei um bug → Seção 2
  - 💡 Tenho uma sugestão → Seção 3
  - ❓ Sugerir perguntas novas → Seção 4
  - 💬 Outro tipo de feedback → Seção 5

**Seção 2 — Bug** (campos que serão pré-preenchidos via query string marcados com 🤖)
- Categoria do bug * (lista suspensa, opções abaixo)
- O que aconteceu? *
- O que você esperava?
- Como reproduzir?
- Anexar print/vídeo (upload)
- Onde usou? (PWA / navegador)
- 🤖 Navegador
- 🤖 Sistema
- 🤖 Idioma do app
- 🤖 Tema do app
- 🤖 Versão do app
- 🤖 Data/hora do report
- 🤖 URL onde aconteceu

**Seção 3 — Sugestão**
- Categoria * (lista suspensa, opções abaixo)
- Qual sua sugestão? *
- Por que seria útil?

**Seção 4 — Perguntas novas**
- Em qual categoria? * (Profundas / Divertidas / Grupo / Não sei)
- A pergunta *
- Cenário de uso
- Quer crédito no CHANGELOG?

**Seção 5 — Outro**
- Manda aí *

**Seção final (todas convergem)**
- Quer que eu te responda? (email/contato opcional)

#### 2. Categorias prontas

**Categorias de bug** (cole na lista suspensa do campo "Categoria do bug"):

```
Visual / Layout
Funcional
Performance
Navegação
Texto / Tradução
Idioma
Tema
Mobile-específico
Desktop-específico
Offline
Instalação PWA
Compartilhamento / Copiar
Persistência
Outro
```

**Categorias de sugestão** (cole na lista suspensa do campo "Categoria da sugestão"):

```
Conteúdo
Visual / Tema
Acessibilidade
Funcionalidade
Internacionalização
Configurações
Compartilhamento
PWA / Instalação
Performance
Documentação
Privacidade
Outro
```

#### 3. Descobrir os IDs dos campos técnicos

Depois de criar o form, cada campo técnico ("Navegador", "Sistema", etc) tem um ID interno tipo `entry.123456789`. Pra descobrir:

1. Abre o form no Google Forms (modo edição)
2. Clica nos 3 pontos no canto superior direito → "**Get pre-filled link**"
3. Preenche TODOS os campos técnicos com valores tipo `TESTE_BROWSER`, `TESTE_TEMA`, etc
4. Clica "**Get link**" no fim
5. A URL gerada terá `entry.123456789=TESTE_BROWSER&entry.987654321=TESTE_TEMA...`
6. Anota cada número e cola em `js/feedback.js`:

```js
export const FEEDBACK_FORM = {
    baseUrl: 'https://docs.google.com/forms/d/e/SEU_FORM_ID/viewform',
    fields: {
        browser:   123456789,  // entry da pergunta "Navegador"
        system:    987654321,  // entry da pergunta "Sistema"
        lang:      111222333,  // entry da pergunta "Idioma do app"
        theme:     444555666,  // entry da pergunta "Tema do app"
        version:   777888999,  // entry da pergunta "Versão"
        timestamp: 121212121,  // entry da pergunta "Data/hora"
        pageUrl:   343434343,  // entry da pergunta "URL"
    },
};
```

Se algum entry estiver com valor `0`, o campo simplesmente não é pré-preenchido (silencioso). O form continua funcionando.

#### 4. Atualizar o `baseUrl`

Também em `js/feedback.js`:

```js
baseUrl: 'https://docs.google.com/forms/d/e/SEU_FORM_ID/viewform',
```

O `SEU_FORM_ID` é encontrado na URL pública do seu form (depois de "Send" → ícone de link).

### Como o link é montado em runtime

Cada link de feedback no HTML usa `attachFeedbackHandler(elementId)` no JS. No momento do **clique** (não no carregamento), gera a URL com os dados atuais.

Por que no clique? Porque o estado do app pode mudar depois do `initUI` — usuário troca tema, idioma. Se setasse `el.href` no init, ficaria desatualizado.

```js
// Em app.js / about.js
attachFeedbackHandler('feedbackLink');
attachFeedbackHandler('landingFeedback');
// etc
```

### Pra onde vão as respostas

Google Forms cria automaticamente uma planilha vinculada no Google Drive da conta que criou o form. Você pode:

- Ver respostas em tempo real
- Exportar pra CSV / Excel
- Configurar email de notificação a cada resposta nova

---

## Como adicionar features comuns

### Adicionar uma pergunta

`js/decks.js`:

```js
{
    id: 'profundas',
    nameKey: 'cat_profundas',
    questions: [
        // ... existentes ...
        { id: 'p98', text: 'Sua nova pergunta aqui?' },
    ]
}
```

ID precisa ser único dentro da categoria.

### Adicionar uma categoria nova

1. **`js/decks.js`**: adicione um novo objeto no array `PT_DECKS`:
   ```js
   {
       id: 'novo',
       nameKey: 'cat_novo',
       questions: [
           { id: 'n1', text: '...' },
       ]
   }
   ```
2. **`js/i18n.js`**: adicione a tradução:
   ```js
   cat_novo: 'Categoria Nova',  // PT
   cat_novo: 'New Category',    // EN
   ```

### Adicionar idioma novo (ex: japonês)

1. **`js/i18n.js`**: descomenta o bloco `jp` e completa as traduções
2. **`js/decks.js`**: adicione `jp: PT_DECKS` em `DECKS` (ou crie uma versão traduzida)
3. **`js/about-content.js`**: adicione `jp: { sobreApp: '...', ... }` em `C` e `R`
4. **HTML**: descomenta a opção `<option value="jp">Jpn</option>` no `<select>` do language picker
5. **CSS**: descomenta a regra `.language-picker__flag--jp::before` em `03-components.css`

### Adicionar tema novo

Veja a seção [Sistema de temas](#-sistema-de-temas) acima.

### SEO e Open Graph

Pra preview rico no WhatsApp/redes sociais quando você compartilha o link, adicione no `<head>` dos HTMLs:

```html
<meta name="description" content="...">
<meta property="og:title" content="Fica pro Café">
<meta property="og:description" content="...">
<meta property="og:image" content="https://SEU-DOMINIO/assets/og-image.png">
<meta property="og:url" content="https://SEU-DOMINIO/">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
```

A imagem `og:image` deve ser 1200×630px e **URL absoluta** (não relativa).

---

## Como testar

Não há suite de testes automatizados. Pra um app deste tamanho, é overkill. O que recomendamos:

### Smoke test manual antes de cada deploy

Cole essa checklist e marque cada item:

- [ ] Landing renderiza no primeiro acesso
- [ ] Click "Vamos conversar" tira a landing
- [ ] Pergunta aparece, clicar próxima troca
- [ ] Mobile: arrastar cartão troca pergunta
- [ ] Trocar deck via overlay de categoria
- [ ] Abrir Configurações: theme list aparece com paleta visual
- [ ] Trocar tema: cores mudam
- [ ] Trocar tamanho de fonte: pergunta aumenta/diminui
- [ ] Trocar idioma: tudo vira o idioma escolhido
- [ ] Página About: tabs funcionam, releases listam
- [ ] Refresh: estado preservado (tema, fonte, idioma, deck)
- [ ] Modo offline (DevTools → Network → Offline): app continua funcionando
- [ ] Mobile real: instalável como PWA

Tempo: ~5 minutos.

### Testes automatizados rodáveis

Se quiser ir além, há cobertura via Node + jsdom em desenvolvimento. Veja a seção de testes deste documento se for adicionar.

---

## Coisas que NÃO devem ser feitas

- **Não adicione bibliotecas** sem discutir antes. O projeto é vanilla por escolha.
- **Não use ferramentas de build** (Webpack, Vite, etc). Tudo deve abrir direto no navegador.
- **Não armazene dados pessoais** do usuário. Privacidade é central. localStorage é só pra preferências (tema, idioma).
- **Não adicione tracking/analytics**. O app não envia nada pra servidor nenhum.
- **Não use `var`**. Use `const` ou `let`.
- **Não use `!important`** sem discutir. Quase sempre é sintoma de problema de especificidade que pode ser resolvido melhor.
- **Não comente código velho — apague.** Git tem histórico, não precisa manter código zumbi.
- **Não use cores literais nos componentes**. Use sempre `var(--xxx)`.
- **Não use `#id` como seletor CSS**. Use `.classes`.

---

## Decisões de arquitetura registradas

### Por que vanilla JS, sem framework?

- App é pequeno (~1500 linhas JS, ~2000 linhas CSS)
- Performance excelente sem custo de runtime de framework
- Zero dependências = zero vulnerabilidades transitivas
- Funciona offline sem precisar bundle
- Curva de aprendizado mínima pra contribuidores

### Por que não usar build tool?

- Edita arquivo, salva, recarrega navegador. Loop de feedback instantâneo.
- Deploy é literalmente copiar arquivos pra servidor estático.
- Não precisa instalar Node, npm, configs. Anyone can `git clone` e abrir.
- Em troca, perdemos: minificação, CSS preprocessor, code splitting automático.
- Decisão consciente: simplicidade > otimização.

### Por que ES Modules em vez de IIFE/AMD/CommonJS?

- ES Modules são padrão da web. Funciona nativo no navegador moderno.
- Sintaxe limpa: `import { t } from './i18n.js'`.
- Tree-shaking automático (não-crítico aqui, mas é bônus).

### Por que 2 HTMLs em vez de SPA?

- Site estático tradicional é mais simples
- Cada página tem entrypoint próprio = menor JS no carregamento
- Funciona sem JS pra crawlers
- Zero "router" pra manter

### Por que localStorage e não IndexedDB?

- Dados são pequenos (~200 bytes por usuário)
- API síncrona é mais simples
- IndexedDB seria overkill

### Por que ITCSS em vez de BEM, OOCSS, etc?

- 4 camadas é o que faz sentido pra app pequeno
- Ordem de carregamento determina especificidade — sem complexidade extra
- Coexiste com convenção solta de nomes (kebab-case com BEM-like onde faz sentido, ex: `.language-picker__button`)

---

## Referências úteis

- [MDN — Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [MDN — Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [MDN — ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [ITCSS — Inverted Triangle CSS](https://itcss.io/)
- [Open Graph Protocol](https://ogp.me/)
- [PWA Builder](https://www.pwabuilder.com/) — pra validar PWA