import styled from "styled-components";
import * as token from "@/styles/values/token";

interface Props {
  $isClicked: boolean;
}

export const container = styled.div<Props>`
  box-sizing: border-box;
  width: 26.69rem;
  height: 4.125rem;
  background-color: ${({ $isClicked }) => 
  $isClicked ? '#FEF9E0': '#ffffff'};
  border: solid 1px #FFD600;
  border-radius: 12px;
  padding: 0.6rem 1.25rem;
`

export const questionItem = styled.div`
  ${token.flexColumn}
`

export const questionHeader= styled.div`
  ${token.flexRow}
  gap: 10px;
`

export const questionTitle = styled.span`
  ${token.typography("body", "md", "semibold")};
  color: ${({ theme }) => theme.colors.text.black};
`

export const questionDate = styled.span`
  ${token.typography("body", "sm", "medium")};
  color: #CACACA;
`

export const status= styled.div`
  ${token.flexRow}
  align-items: center;
  gap: 5px;
`

export const statusText = styled.span`
  color: ${token.colors.text.neutral};
  ${token.typography("body", "sm", "regular")}
`

export const statusBadge = styled.span`
  ${token.typography("body", "md", "medium")}
  color: ${token.colors.state.success};
`