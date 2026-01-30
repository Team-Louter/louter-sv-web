/**
 * border-radius를 통일하기 위한 값들
 *
 * 예시:
 *   border-radius: ${shape.large};
 *   border-radius: ${shape.small};
 */

export const shapes = {
  xlarge: "20px",
  large: "16px",
  medium: "12px",
  small: "10px",
  xsmall: "8px",
} as const;

export type ShapeSize = keyof typeof shapes;