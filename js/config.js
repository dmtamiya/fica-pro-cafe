/**
 * config.js — Configurações do app
 *
 * Lista de temas visuais e tamanhos de fonte disponíveis para o usuário.
 * Estes NÃO são strings traduzíveis (vide labels via labelKey/nameKey, que
 * apontam pra chaves do UI_STRINGS em i18n.js).
 *
 * Pra adicionar um tema novo:
 *   1. Adicione um objeto aqui com { id, nameKey, previewColors }
 *      - previewColors: array de 5 cores hex, mostradas como bolinhas no painel
 *   2. Adicione a tradução de nameKey em i18n.js (PT e EN)
 *   3. Adicione a classe CSS correspondente em styles.css
 *   4. Adicione a cor da barra do navegador em THEME_BAR_COLORS no app.js
 */

export const THEMES = [
  {
    id: 'default',
    nameKey: 'theme_default',
    previewColors: ['#974315', '#8D957E', '#788990', '#5C4C33', '#E3D6C5'],
  },
  {
    id: 'theme-noite-aconchegante',
    nameKey: 'theme_noite_aconchegante',
    previewColors: ['#1B2E4D', '#9C6A1B', '#561B1F', '#6C4A37', '#061021'],
  },
];

export const FONT_SIZES = [
  { id: 'small',  scale: 0.85, labelKey: 'fontSmall',  preview: 'AaBb', previewSize: '0.85rem' },
  { id: 'medium', scale: 1,    labelKey: 'fontMedium', preview: 'AaBb', previewSize: '1rem'    },
  { id: 'large',  scale: 1.2,  labelKey: 'fontLarge',  preview: 'AaBb', previewSize: '1.35rem' },
];
