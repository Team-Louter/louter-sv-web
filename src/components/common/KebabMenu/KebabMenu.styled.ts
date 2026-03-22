import styled from "styled-components";
import * as token from "@/styles/values/token";

export const Wrapper = styled.div`
  position: relative;
`;

export const Trigger = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  height: fit-content;
  cursor: pointer;
`;

export const Container = styled.div`
  background-color: ${token.colors.background.white};
  ${token.elevation("black_3")};
  padding: 5px 10px;
  ${token.flexColumn};
  border-radius: ${token.shapes.large};
  position: absolute;
  top: 0;
  right: 100%;
  white-space: nowrap;
`;

export const Label = styled.span`
  ${token.typography("body", "md", "medium")}
  padding: 10px 15px;
  border-bottom: 1px solid ${token.colors.line.normal};
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }
`;
