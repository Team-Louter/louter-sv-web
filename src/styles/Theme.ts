const colors = {
  main: {
    white: '#FFFFFF',
    black: '#000000',
    yellow: '#FFD600',
  },

  accent: {
    primary: '#FFD600',
    secondary1: '#FFDE33',
    secondary2: '#FFE666',
    secondary3: '#FFEF99',
    secondary4: '#FFF7CC',
  },

  text: {
    white: '#FFFFFF',
    lightGray: '#B8B8B8',
    coolGray: '#8A95A0',
    dark: '#333333',
    black: '#000000',
    goldDark: '#D3AB00',
    gold: '#FFBB00',
    goldLight: '#FFD600',
  },

  border: {
    light: '#EEEEEE',
    dark: '#333333',
    highlight: '#FFD600',
  },

  fill: {
    white: '#FFFFFF',
    f5: '#F5F5F5',
    f3: '#F3F4F6',
    a0: '#A0A0A0',
    darkOverlay: 'rgba(12, 16, 20, 0.7)', // #0C1014 (70%)
    slate: '#4E5968',
    charcoal: '#2A2B2B',
    almostBlack: '#191A1A',
    black: '#000000',
    yellow: '#FFD600',
  },

  background: {
    white: '#FFFFFF',
    f5: '#F5F5F5',
    almostBlack: '#191A1A',
    yellow: '#FFD600',
  },

  state: {
    error: '#E23737',
    info: '#4B88CE',
    success: '#5DBC86',
    warning: '#FFD600',
  },

  calendar: {
    red: '#FC675F',
    blue: '#2CA4FB',
    black: '#191A1A',
  },
} as const;

const baseWeights = {
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
} as const;

const typography = {
  family: {
    system: "'Pretendard'",
  },

  weight: baseWeights,

  heading: {
    XXL: { size: '2.25rem' }, // 36px
    XL: { size: '2rem' }, // 32px
    L: { size: '1.75rem' }, // 28px
    M: { size: '1.5rem' }, // 24px
    S: { size: '1.25rem' }, // 20px
  },

  body: {
    L: { size: '1.125rem' }, // 18px
    M: { size: '1rem' }, // 16px
    S: { size: '0.875rem' }, // 14px
  },

  caption: {
    L: { size: '0.8125rem' }, // 13px
    M: { size: '0.75rem' }, // 12px
    S: { size: '0.6875rem' }, // 11px
  },
} as const;

const shadow = {
  s: '0px 3px 10px 0px rgba(0, 0, 0, 0.02)',
  m: '0px 4px 12px 0px rgba(0, 0, 0, 0.04)',
  l: '0px 6px 18px 0px rgba(0, 0, 0, 0.06)',
} as const;

export const theme = {
  colors: colors,
  typography: typography,
  shadow: shadow,
} as const;

export type Theme = typeof theme;
