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

export const ROLE_LABEL: Record<string, string> = {
  LEADER: '부장 (Leader)',
  MENTOR: '멘토 (Mentor)',
  MENTEE: '멘티 (Mentee)',
};
