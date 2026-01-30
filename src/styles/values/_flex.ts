import { css } from "styled-components";

/**
 *
 * 예시:
 *   ${flexRow}
 *   ${flexCenter}
 */

// 수평 flex 컨테이너
export const flexRow = css`
  display: flex;
  flex-direction: row;
`;

// 수직 flex 컨테이너
export const flexColumn = css`
  display: flex;
  flex-direction: column;
`;

// 가운데 정렬
export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 왼쪽 정렬
export const flexLeft = css`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

// 오른쪽 정렬
export const flexRight = css`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

// 양쪽 정렬
export const flexBetween = css`
  display: flex;
  justify-content: space-between;
`;

// 컬럼, 가운데 정렬
export const flexColumnCenter = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

// 컬럼, 왼쪽 위 정렬
export const flexColumnStart = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;
