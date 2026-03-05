export const MAJOR_OPTIONS = [
  'BACKEND',
  'FRONTEND',
  'DESIGN',
  'IOS',
  'ANDROID',
  'SECURITY',
  'GAME',
  'AI',
  'EMBEDDED',
] as const;

export type Major = (typeof MAJOR_OPTIONS)[number];
