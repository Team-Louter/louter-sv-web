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
`

export const personItem = styled.div`
  ${token.flexRow}
  align-items: center;
  gap: 10px;
`

export const userImg = styled.img`
  width: 2.1875rem;
  height: 2.1875rem;
  object-fit: cover;
  border-radius: ${token.shapes.large};
`

export const userName = styled.span`
  ${token.typography("body", "md", "semibold")}
  color: ${token.colors.text.normal};
`