import styled from "styled-components";
import * as token from "@/styles/values/token";

export const Container = styled.div`
  display: flex;
  gap: 8px;
  ${token.flexRow}
  padding: 10px;
  background-color: ${token.colors.fill.normal};
  border-radius: ${token.shapes.xlarge};
`;

export const Item = styled.div<{ $active: boolean }>`
  width: 250px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  ${token.typography("body", "md", "semibold")}
  border: 1px solid ${token.colors.line.normal};

  background-color: ${({ $active }) =>
    $active ? token.colors.main.yellow : token.colors.fill.assistive};

  color: ${({ $active }) =>
    $active ? token.colors.fill.assistive: token.colors.text.neutral};

  border-radius: ${token.shapes.large};
`;
