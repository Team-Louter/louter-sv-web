import styled from "styled-components";
import * as token from "@/styles/values/token";

export const container = styled.div`
  position: relative;
  width: 90%;
  height: 180px;
  background-color: ${token.colors.background.white};
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.xlarge};
  ${token.flexColumnCenter}
  background-color: ${token.colors.background.white};
`


export const SortContainer = styled.div`
  width: 100%;
  height: 100%;
  ${token.flexRow}
  align-items: center;
`

export const Divider = styled.div`
  width: 1px;
  height: 70%;
  background-color: ${token.colors.line.normal};
`

export const MonthTitle = styled.span<{ $isFuture?: boolean }>`
  ${token.typography("heading", "md", "semibold")}
  color: ${({ $isFuture }) =>
    $isFuture ? token.colors.text.disabled : token.colors.main.alternative};
  position: absolute;
  transform: translateY(-215%);
  z-index: 1;
`
