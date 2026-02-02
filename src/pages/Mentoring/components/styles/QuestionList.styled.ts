import styled from "styled-components";
import * as token from "@/styles/values/token";
import type { StatusType } from '../QuestionList.types';

interface Props {
  $isClicked: boolean;
}

interface statusProps {
  $status: StatusType;
}

export const container = styled.div<Props>`
  box-sizing: border-box;
  width: 26.69rem;
  height: 4.125rem;
  background-color: ${({ $isClicked }) => 
  $isClicked ? token.colors.accent.assistive4: token.colors.main.white};
  border: solid 1px ${token.colors.main.yellow};
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
  color: ${token.colors.text.disabled};
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

const statusColor = {
  '답변 중' : token.colors.state.successSoft,
  '답변 대기' : token.colors.state.warningSoft,
  '답변 완료' : token.colors.state.infoSoft,
} as const

export const statusBadge = styled.span<statusProps>`
  ${token.typography("body", "md", "medium")}
  color: ${({$status}) => statusColor[$status] || token.colors.text.disabled}
`