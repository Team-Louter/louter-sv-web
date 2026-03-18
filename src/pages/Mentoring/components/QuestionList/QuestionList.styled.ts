import styled from "styled-components";
import * as token from "@/styles/values/token";
import type { StatusType } from "@/types/mentoring";

export const container = styled.div<{
  $isClicked: boolean;
  $status: StatusType;
}>`
  box-sizing: border-box;
  width: 100%;
  max-width: 26.6875rem;
  background-color: ${({ $isClicked }) =>
    $isClicked ? token.colors.accent.assistive4 : token.colors.main.white};
  border: solid 1px
    ${({ $status }) =>
      $status === "답변 완료"
        ? token.colors.line.normal
        : token.colors.main.yellow};
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
  gap: 0.625rem;
  min-width: 0;
`;

export const questionTitle = styled.span`
  ${token.typography("body", "sm", "semibold")};
  color: ${({ theme }) => theme.colors.text.black};
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const questionDate = styled.span`
  ${token.typography("caption", "lg", "medium")};
  color: ${token.colors.text.disabled};
  flex-shrink: 0;
`;

export const status = styled.div`
  ${token.flexRow}
  align-items: center;
  gap: 0.3125rem;
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

export const statusBadge = styled.span<{ $status: StatusType }>`
  ${token.typography("body", "sm", "medium")}
  color: ${({ $status }) => statusColor[$status] || token.colors.text.disabled}
`;

export const ListWrapper = styled.div`
  ${token.flexColumn}
  gap: 0.625rem;
`;
