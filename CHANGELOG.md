# Changelog

Todas as mudanças notáveis nesse projeto são documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), e o projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## Sobre o formato

Cada versão é dividida em seções:

- **Adicionado** — features novas
- **Modificado** — mudanças em features existentes
- **Removido** — features que foram removidas
- **Corrigido** — bugs corrigidos
- **Segurança** — correções de vulnerabilidade

Versões seguem o padrão **MAJOR.MINOR.PATCH**:
- **MAJOR** muda quando há mudança incompatível (ex: remover funcionalidade)
- **MINOR** muda quando adiciona features mantendo compatibilidade
- **PATCH** muda quando corrige bugs sem novas features

---

## [Não-publicado]

Mudanças que ainda não foram publicadas em uma versão oficial.

---

## [1.0.1] — 2026-04-26

### Corrigido
- Ícone PWA agora preenche todo o espaço na tela inicial em vez de aparecer como círculo dentro do quadrado arredondado
- 404 ao abrir o app instalado pela tela inicial (caminhos absolutos no manifest eram incompatíveis com GitHub Pages)
- Status bar do iPhone agora acompanha a cor do tema atual e a cor do menu de configurações quando aberto
- Bug em que a status bar mantinha a cor do tema anterior por alguns segundos ao trocar de tema
- Scroll vertical indevido na página principal no mobile, que conflitava com o gesto de arrastar pra trocar pergunta

### Modificado
- Texto compartilhado mais limpo: pergunta entre aspas tipográficas com quebras de linha pra dar destaque visual
- Removido texto "Dica: arraste o cartão..." no mobile (redundante com o balão "Psiu!")

---

## [1.0.0] — 2026-04-26

### Adicionado
- Lançamento inicial 🎉
- 273 perguntas em 3 categorias (Profundas, Divertidas, Grupo) + deck "Todas"
- Suporte a 2 idiomas: português brasileiro (pt-BR), inglês (en-US)
- 2 temas visuais: Casinha (padrão) e Noite Aconchegante
- 3 tamanhos de fonte ajustáveis
- Gesto de swipe no mobile pra trocar de pergunta
- PWA instalável (Android e iOS)
- Funcionamento offline via Service Worker
- Sistema de feedback via Google Forms com auto-preenchimento de dados técnicos
- Sem login, sem servidor, sem analytics — tudo roda no dispositivo

---

[Não-publicado]: https://github.com/dmtamiya/fica-pro-cafe/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/dmtamiya/fica-pro-cafe/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/dmtamiya/fica-pro-cafe/releases/tag/v1.0.0