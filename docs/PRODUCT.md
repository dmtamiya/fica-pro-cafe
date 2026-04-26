# Documentação de Produto — Fica pro Café

> Visão de produto, princípios, decisões tomadas e direcionamento futuro.

Este documento é pra quem vai pensar **o que** o produto deve ser. Cobre **propósito**, **princípios**, **público**, **features atuais** e **decisões deliberadas** (o que escolhemos NÃO fazer e por quê).

---

## Visão

> *Um deck de perguntas que ajude pessoas a terem conversas melhores umas com as outras, sem fricção e sem mediação.*

O Fica pro Café existe pra resolver um problema banal mas universal: **a hora em que a conversa morre**.

A inspiração veio das perguntas estilo ask.fm que circulavam entre amigos uns anos atrás. Eram bobas, eram profundas, eram divertidas. E principalmente: faziam as pessoas **pararem pra responder** e descobrirem coisas umas das outras.

A versão produto pega essa essência e empacota num formato:
- Sempre acessível (PWA na tela inicial)
- Confiável (funciona offline, sem login, sem servidor caindo)
- Privado (nada sai do dispositivo)
- Rápido (zero peso cognitivo: abre, lê pergunta, conversa)

---

## Para quem é

### Público-alvo principal

Pessoas que valorizam **conversas que vão além de small talk**:

- **Casais** em jantares
- **Amigos** em mesa de bar ou em viagens
- **Famílias** em almoços de domingo, jantares de Natal
- **Encontros novos** (Tinder, primeiro date) procurando ir além de "como foi seu dia?"
- **Grupos de RPG, board games, livros** querendo se conhecerem melhor entre rodadas
- **Anfitriões** querendo ter "uma carta na manga" pra animar conversa

### Não é pra

- Profissional/corporativo (não é um deck de team building)
- Crianças (algumas perguntas são pra adultos)
- Terapia (não é ferramenta clínica)

---

## Princípios de produto

Estes princípios guiam decisões. Quando há conflito, eles têm peso de "tiebreaker".

### 1. **Privacidade absoluta**

Nada sai do dispositivo do usuário. Sem login, sem analytics, sem cookies de tracking, sem servidor próprio. localStorage só pra preferências (tema, idioma, deck atual). 

Isso não é só princípio técnico — é **proposta de valor**. Em 2026, ter uma ferramenta que não te observa é cada vez mais raro e valioso.

### 2. **Zero fricção**

Da tela inicial até a primeira pergunta: **2 cliques**. Sem cadastro, sem onboarding longo, sem tutorial. Abre, "Vamos conversar", aparece pergunta.

Cada passo a mais é uma chance do usuário desistir. Cada campo a preencher é uma fricção. Resistir à tentação de "melhorar" o onboarding adicionando steps.

### 3. **Funciona offline**

PWA com Service Worker. Depois da primeira visita online, funciona sem internet pra sempre. Casas de praia sem sinal, metrô subterrâneo, voo, festa em sítio — tudo funciona.

### 4. **Mobile-first, mas não mobile-only**

A maioria dos usos é em celular (mesa de bar, Uber, sofá). Mas desktop tem que funcionar bem também (almoço de família onde o anfitrião abre no notebook).

A interação core é **gesto** no mobile (swipe pra trocar pergunta) e **clique** no desktop (seta lateral).

### 5. **Estética importa**

Não é app de produtividade. É algo que cria momentos. A interface tem que ter personalidade — fontes serifadas pro título, paleta quente, pequenas surpresas (balão "Psiu!" na primeira visita).

Visual genérico = produto esquecível.

### 6. **Open source, sempre**

MIT License. O código todo é aberto. Qualquer pessoa pode forkar, adaptar, criar versão própria. O valor não é o código — é a curadoria das perguntas e a experiência.

### 7. **Respeitar o tempo do usuário**

Sem notificações. Sem gamificação. Sem "streak" de uso diário. Sem features pra gerar engajamento artificial.

O app é uma **ferramenta** pra usar quando você quer, não algo que te puxa de volta.

### 8. **Internacionalizar é bom, traduzir é melhor**

Suporte a múltiplos idiomas é desejável (acessibilidade, alcance). Mas tradução literal de pergunta cultural não funciona — uma pergunta sobre "almoço de domingo na vó" tem ressonância diferente em cada cultura.

Por isso o EN é uma **adaptação cultural** das mesmas perguntas, não tradução literal. Quando vier um terceiro idioma (ex: japonês), seguir a mesma filosofia.

---

## Features atuais

### Core

- **Diversas perguntas** em 3 categorias temáticas (Profundas, Divertidas, Grupo)
- **Deck "Todas"** que mistura aleatoriamente
- **Sem repetição** dentro de uma sessão (até esgotar o deck, depois embaralha de novo)
- **Contador de pergunta** (pílula com número da posição)

### Personalização

- **Idiomas** — troca sem reload (atualmente apenas em português brasileiro e inglês)
- **Temas visuais** (atualmente apenas dois temas: Casinha, Noite Aconchegante)
- **3 tamanhos de fonte** (Pequeno, Médio, Grande)

### Compartilhamento

- **Mobile**: botão de compartilhar usa Web Share API (nativo do sistema)
- **Desktop**: botão copia pergunta + link
- Texto formatado: `"Veja essa pergunta que vi em [link]! [pergunta]"`

### PWA

- **Instalável na tela inicial** (Android e iOS)
- **Funciona offline** após primeira visita
- **Ícone próprio** (xícara de café)
- **Tela cheia** quando instalado

### Página About

- **Sobre o app** — explicação da proposta
- **Atualizações** — release notes (visíveis pro usuário)
- **Licença** — MIT explicado
- **Feedback** — link pra Google Forms

---

## Identidade visual

### Personalidade

Acolhedor, caseiro, vagamente vintage. **Não é tech**. Não é "ferramenta de produtividade".

### Paleta

**Tema padrão (Casinha):**
- Marrom-tijolo `#974315` — accent quente
- Bege oliva `#8D957E` — card
- Areia clara `#e3d6c4` — fundo
- Creme `#F0EDE4` — header
- Marrom-café `#5C4C33` — texto

**Tema noite (Noite Aconchegante):**
- Azul-noite profundo `#061021` — fundo
- Azul-noite médio `#1B2E4D` — cards/painéis
- Bordô escuro `#561B1F` — landing
- Dourado-mostarda `#9C6A1B` — accent
- Areia clara `#CEB190` — texto

### Tipografia

- **Capriola** — títulos e ênfases (serifa amigável, vintage)
- **Open Sans** — corpo de texto

### Ícones

- **Coração** no favicon (browser tab)
- **Xícara de café estilizada** no ícone do PWA instalado

A separação é proposital: no navegador você está só dando uma olhada (coração = afeto). Quando instala, vira parte do dia a dia (xícara = ritual).

---

## Decisões deliberadas — o que NÃO fazemos

Esta seção é tão importante quanto as features. Documenta o que **escolhemos não fazer** e por quê.

### Não temos login

**Por quê:** privacidade. Login = email = identidade. Não queremos saber quem usa o app.

**Trade-off:** preferências não sincronizam entre dispositivos. Aceitável: app é pra "uso momentâneo", não tem dado de longo prazo a sincronizar.

### Não temos histórico de perguntas vistas

**Por quê:** seria pseudo-tracking. Além disso, releitura de pergunta é OK no contexto (várias rodadas com pessoas diferentes).

**Trade-off:** usuário não tem como "favoritar" uma pergunta. Se virar pedido recorrente, repensar.

### Não temos analytics

**Por quê:** privacidade. Não há provider de analytics que seja 100% privado. Mesmo "anônimos" coletam fingerprint.

**Trade-off:** não sabemos quantas pessoas usam, qual deck é mais popular, etc. Aceitável: feedback qualitativo via Google Forms é suficiente.

### Não temos sistema de criação/contribuição de perguntas

**Por quê:** abre porta pra spam, conteúdo inadequado, moderação. Curadoria é parte do valor.

**Trade-off:** banco de perguntas cresce devagar. Aceitável: melhor 100 perguntas curadas que 10000 mediocres.

### Não temos categorização avançada / tags / filtros

**Por quê:** complexidade visual + cognitiva. 3-4 categorias é o máximo que faz sentido cognitivamente.

**Trade-off:** não dá pra "perguntas sobre amor que sejam profundas". Aceitável: a serendipidade é parte da graça.

### Não temos modo "casal" / "primeiro date" / "para grupos" pré-definido

**Por quê:** soa algorítmico, mecânico. A graça é o usuário escolher o deck baseado na vibe atual.

**Trade-off:** anfitrião novo pode não saber por onde começar. Mitigado pelo deck "Todas" como default.

### Não temos timer / "pergunta da semana" / push notifications

**Por quê:** ferramenta, não engine de engagement. Princípio #7.

### Não temos versão paga / monetização

**Por quê:** projeto pessoal de paixão. Custos são zero (PWA estática num GitHub Pages). Sem propósito comercial muda tudo.

**Trade-off:** sem renda, sem incentivo financeiro pra continuar. Aceitável: motivação é diferente.

### Não temos build tool / framework

**Detalhe técnico que tem implicação de produto:** o projeto é simples o suficiente pra qualquer pessoa abrir e contribuir sem instalar nada. Veja [TECHNICAL.md](TECHNICAL.md) pra detalhes.

---

## Possíveis features futuras

Lista do que **pode** entrar, não compromisso. Ordenada por percepção atual de valor / esforço.

### Curto prazo (próximas releases)

1. **Open Graph tags** — quando publicar no GitHub Pages, ativar metadata pra preview rico no WhatsApp/redes. (Já tem og-image.png pronto.)
2. **Acessibilidade (a11y)** — `:focus-visible`, skip link, ARIA tabs no About, focus management nos drawers, atualizar `lang` dinâmico. Impacto alto pra usuários com deficiência visual/motora.
3. **Feedback button** — caminho mais visível e simples (talvez modal in-app em vez de redirect pra Forms).
4. **Mais perguntas** — sempre cabe. O banco cresceu de 127 pra 273 na v1.1.0, mas curadoria contínua é parte do produto.

### Médio prazo

5. **Mais temas visuais** — sugestões de paleta:
    - Floresta (verdes profundos + dourado)
    - Pôr do sol (laranjas + magenta)
    - Manhã (pastéis claros)
6. **Botão "compartilhar app"** separado do "compartilhar pergunta" — pra quando o usuário quer recomendar o app.
7. **Mais idiomas** — japonês já está parcialmente preparado no código (i18n e bandeira), só falta deck traduzido culturalmente.

### Longo prazo / experimental

8. **Modo "ler em voz alta"** — Speech Synthesis API pra acessibilidade.
9. **Importação de deck personalizado via JSON** — pra grupos que querem suas próprias perguntas. Sem sistema de upload, só drag-and-drop local.

### Coisas que **não** vão entrar

- Sistema de conta/login
- Notificações push
- Gamificação (streak, achievements)
- Analytics
- Versão paga
- App nativo (iOS/Android binário) — PWA é o suficiente
- Backend próprio
- Versão multiplayer (todo mundo no mesmo dispositivo)

---

## Métricas de sucesso

Não temos analytics. Como medimos sucesso?

### Indicadores qualitativos (preferenciais)

- Pessoas mandando feedback orgânico via Google Forms
- Pessoas mostrando o app pra amigos (tipo de "viralização" sem métrica)
- Estrelinhas no GitHub se virar repo público
- Issues / PRs no GitHub
- Casos de uso descritos pelas próprias pessoas ("usei numa primeira data e foi muito bom")

### Indicadores diretos da própria experiência

- A criadora usa? Recomenda?
- Amigos próximos usam? Voltam?
- O app é desinstalado depois de 1 uso ou fica na tela inicial?

### Indicadores que **não** vamos medir

- DAU / MAU
- Tempo médio de sessão
- Número de perguntas vistas por sessão
- Conversão landing → primeira pergunta
- Retenção D1 / D7 / D30

Não porque não importam. Mas porque medi-los exigiria comprometer privacidade. E privacidade é mais importante (princípio #1).

---

## Histórias de uso

Cenários reais imaginados pra testar decisões.

### Ana e Bia, primeiro date

> Ana e Bia se conheceram no Tinder e marcaram um café. A conversa fluiu nos primeiros 30 minutos mas começa a esfriar. Ana puxa o celular, abre o Fica pro Café (tem na tela inicial), clica deck "Profundas". Mostra a pergunta pra Bia: *"O que você precisa pra recarregar as energias de verdade?"*. Bia ri, responde com sinceridade. Conversa flui de novo por mais uma hora.

**Validações:** zero fricção (1 toque do ícone, 1 toque pra escolher deck, pergunta apareceu), funciona em local com Wi-Fi do café que pode ser ruim (offline), não força login (não teve que parar pra cadastrar).

### Família no almoço de domingo

> Roberto (50), pai, almoçando com filhos adultos. Conversa é cordial mas superficial. Roberto descobriu o app pelo neto, instalou no iPad. Abre na tela, deixa no centro da mesa. Cada um pega e responde uma. Tirou de "pessoas falando do trabalho" pra "filha contando uma memória de infância que o pai não sabia".

**Validações:** desktop/tablet funciona bem (não é mobile-only), interface visualmente convidativa (estética importa), passar o dispositivo não vaza dados pessoais.

### Carla, na viagem de carro

> Carla está numa viagem de 6h de carro com 3 amigas. Música cansou, conversa secou. Liga 4G, abre o app, deck "Divertidas". *"Se você fosse um prato de comida, qual seria?"*. Próximas 2 horas viraram brincadeira/discussão. Aí entra num túnel: 4G cai. App continua funcionando perfeitamente.

**Validações:** offline real funcionando, perguntas-isca pra grupo dinâmico (categoria divertidas existe pra isso).

### Fernanda, instalando como PWA pela primeira vez

> Fernanda recebe link no WhatsApp de uma amiga. Abre no Safari iPhone. Lê a página, vê uma pergunta, achou legal. No final tem instrução "salvar como web app". Segue. Fica com ícone de xícara na tela inicial. Próximas vezes abre direto, full screen, sem barra do Safari.

**Validações:** PWA install funciona em iOS (Safari adicionar à tela inicial), instrução de instalação visível mas não intrusiva, ícone se distingue de outros apps.

---

## Perguntas em aberto

Coisas que ainda não decidimos.

- Devemos criar conta/login opcional pra sincronizar preferências entre dispositivos?
- Faz sentido ter "deck do dia" (sazonal, datas comemorativas)?
- Vale criar versão "extended" com mais perguntas profundas/intensas (com aviso etário)?
- Como crescer a curadoria de perguntas sem abrir pra contribuição aberta (que vira spam)?
- Deveria haver um modo "lerdo" / "cinzento" pra leitura em ônibus/transporte com luz solar forte?