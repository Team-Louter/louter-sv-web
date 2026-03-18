import styled from "styled-components";
import * as token from "@/styles/values/token";

export const container = styled.div`
  width: min(100%, 37.5rem);
  height: min(90dvh, 46.875rem);
  min-height: min(32rem, 90dvh);
  background-color: ${token.colors.background.white};
  padding: clamp(1rem, 3vw, 1.875rem);
  border-radius: ${token.shapes.xlarge};
  ${token.flexColumn}
  gap: clamp(1rem, 2vw, 1.25rem);
  overflow: hidden;

  @media (max-width: 40rem) {
    width: calc(100% - 1.5rem);
    height: calc(100dvh - 1.5rem);
    min-height: 0;
  }
`;

export const TitleCancelContainer = styled.div`
  ${token.flexRow}
  justify-content: space-between;
`;

export const Title = styled.span`
  ${token.typography("body", "lg", "semibold")}
`;

export const Cancel = styled.img`
  width: 1.1875rem;
  height: 1.1875rem;
  cursor: pointer;
`;

export const Wrapper = styled.div`
  width: 1.1875rem;
  height: 1.1875rem;
`;

export const RoomName = styled.input`
  padding: 0.875rem 1.25rem;
  border-radius: ${token.shapes.medium};
  border: 1px solid ${token.colors.line.normal};
  ${token.typography("body", "sm", "regular")}
  &:focus {
    outline: none;
  }
`;

export const AddMemberContainer = styled.div`
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  z-index: 1000;
`;

export const DoneButton = styled.button`
  width: 100%;
  padding: 0.625rem 1.25rem;
  ${token.typography("body", "sm", "semibold")}
  color: ${token.colors.fill.assistive};
  background-color: ${token.colors.main.alternative};
  border-radius: ${token.shapes.medium};
`;
