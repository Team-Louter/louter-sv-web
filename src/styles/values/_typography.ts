/**
 * size, weight를 한 번에 적용할 수 있는 믹스인
 *
 * 예시:
 *   ${typography("body", "md", "semibold")};
 *   ${typography("caption", "sm", "medium")};
 */

export const fontFamily = {
  system: '"Pretendard", "Inter", "Noto Sans KR", system-ui, sans-serif',
} as const;

export const fontSize = {
  heading: {
    xxl: "2.25rem",
    xl: "2rem",
    lg: "1.75rem",
    md: "1.5rem",
    sm: "1.25rem",
  },
  body: {
    lg: "1.125rem",
    md: "1rem",
    sm: "0.875rem",
  },
  caption: {
    lg: "0.8125rem",
    md: "0.75rem",
    sm: "0.6875rem",
  },
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;