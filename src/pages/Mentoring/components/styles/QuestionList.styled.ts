import styled from "styled-components";
import * as token from "@/styles/values/token";
import type { StatusType } from "../types/QuestionList.type";

interface Props {
  $isClicked: boolean;
}

interface statusProps {
  $status: StatusType;
}

export const container = styled.div<Props>`
  box-sizing: border-box;
  width: 26.69rem;
  background-color: ${({ $isClicked }) =>
    $isClicked ? token.colors.accent.assistive4 : token.colors.main.white};
  border: solid 1px ${token.colors.main.yellow};
  border-radius: ${token.shapes.medium};
  padding: 0.6rem 1.25rem;
  ${token.flexRow}
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

export const KebabWrapper = styled.div`
  position: relative;
`;

export const KebabIcon = styled.img`
  width: 3px;
  height: 15px;
  cursor: pointer;
`;

export const questionItem = styled.div`
  ${token.flexColumn}
  flex: 1;
`;

export const questionHeader = styled.div`
  ${token.flexRow}
  gap: 10px;
`;

export const questionTitle = styled.span`
  ${token.typography("body", "sm", "semibold")};
  color: ${({ theme }) => theme.colors.text.black};
`;

export const questionDate = styled.span`
  ${token.typography("caption", "lg", "medium")};
  color: ${token.colors.text.disabled};
`;

export const status = styled.div`
  ${token.flexRow}
  align-items: center;
  gap: 5px;
`;

export const statusText = styled.span`
  color: ${token.colors.text.neutral};
  ${token.typography("caption", "lg", "medium")};
`;

const statusColor = {
  "답변 중": token.colors.state.successSoft,
  "답변 대기": token.colors.state.warningSoft,
  "답변 완료": token.colors.state.infoSoft,
} as const;

export const statusBadge = styled.span<statusProps>`
  ${token.typography("body", "sm", "medium")}
  color: ${({ $status }) => statusColor[$status] || token.colors.text.disabled}
`;

export const ListWrapper = styled.div`
  ${token.flexColumn}
  gap: 10px;
`;
