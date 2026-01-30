import { css } from "styled-components";

// 깊이 단계별 그림자
const elevations = {
  black_1: "0 1px 2px rgba(0, 0, 0, 0.05)",
  black_2: "0 2px 6px rgba(0, 0, 0, 0.08)",
  black_3: "0 4px 12px rgba(0, 0, 0, 0.12)",
};

/**
 * 그림자 단계별로 쉽게 적용할 수 있는 믹스인
 *
 * @param level "black_1" | "black_2" | "black_3"
 *
 * 예시:
 *   ${elevation("black_1")}
 *   ${elevation("black_3")}
 */

export const elevation = (level: keyof typeof elevations) => {
  const shadow = elevations[level];

  if (!shadow) {
    console.warn(`Unknown elevation level: ${level}`);
    return css``;
  }

  return css`
    box-shadow: ${shadow};
  `;
};