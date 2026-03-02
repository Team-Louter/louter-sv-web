import styled from "styled-components";
import * as token from "@/styles/values/token";


interface Props {
  $isClicked: boolean;
}

export const container = styled.div<Props>`
  width: 26.6875rem;
  height: 4.0625rem;
  padding: 15px 20px;
  background-color: ${({ $isClicked }) =>
    $isClicked ? token.colors.accent.assistive4 : token.colors.main.white};
  border: solid 1px ${token.colors.main.yellow};
  border-radius: ${token.shapes.medium};
  ${token.flexRow}
  align-items: center;
  justify-content: space-between;
  
`;

export const avatarArea = styled.div`
  position: relative;
  width: 2.1875rem;
  height: 2.1875rem;
`;

export const avatarGroup = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const userName = styled.span`
  ${token.typography("body", "md", "semibold")}
  color: ${token.colors.text.normal};
`;


export const userImg = styled.img<{ $isGroup?: boolean }>`
  width: ${({ $isGroup }) => ($isGroup ? "1.1rem" : "2.1875rem")};
  height: ${({ $isGroup }) => ($isGroup ? "1.1rem" : "2.1875rem")};
  object-fit: cover;
  border-radius: ${token.shapes.large};
  border: 1px solid ${token.colors.line.normal};
  
  ${({ $isGroup }) =>
    $isGroup &&
    `
    position: absolute;
    &:nth-child(1) { top: 0; left: 0; }
    &:nth-child(2) { top: 0; right: 0; }
    &:nth-child(3) { bottom: 0; left: 0; }
    &:nth-child(4) { bottom: 0; right: 0; }
  `}
`;

export const Kebab = styled.img`
  width: 3px;
  height: 15px;
`

export const profile = styled.div`
  ${token.flexRow}
  align-items: center;
  gap: 10px;
`