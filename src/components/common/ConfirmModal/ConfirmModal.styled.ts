import styled from "styled-components";
import * as token from "@/styles/values/token";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const Modal = styled.div`
  background: ${token.colors.background.white};
  border-radius: ${token.shapes.medium};
  padding: 40px 30px;
  text-align: center;
  ${token.elevation("black_3")};
  min-width: 330px;
  ${token.flexColumnCenter}
`;

export const Message = styled.p`
  ${token.typography("body", "md", "semibold")}
  margin-bottom: 28px;
  white-space: pre-line;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 15px;
`;

export const CancelButton = styled.button`
  padding: 10px 45px;
  border-radius: ${token.shapes.xsmall};
  border: 1px solid ${token.colors.line.normal};
  background: ${token.colors.background.white};
  color: ${token.colors.text.normal};
  ${token.typography("body", "md", "semibold")};
  cursor: pointer;
`;

export const ConfirmButton = styled.button<{
  $color?: string;
  $labelColor?: string;
}>`
  padding: 10px 45px;
  border-radius: ${token.shapes.xsmall};
  border: 1px solid ${({ $color }) => $color ?? token.colors.line.highlight};
  background: ${({ $color }) => $color ?? token.colors.background.yellow};
  color: ${({ $labelColor }) => $labelColor ?? token.colors.text.normal};
  ${token.typography("body", "md", "semibold")};
  cursor: pointer;
`;

export const ErrorMessage = styled.p`
  margin-top: 12px;
  font-size: 12px;
  color: #e05c5c;
`;
