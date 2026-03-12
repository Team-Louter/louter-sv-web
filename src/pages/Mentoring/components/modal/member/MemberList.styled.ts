import styled from "styled-components";
import * as token from "@/styles/values/token";

export const Container = styled.div`
  width: 100%;
  flex: 1;
  min-height: 0;
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.medium};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
`;

export const ListArea = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
`;

export const GradeSection = styled.div`
  border-bottom: 1px solid ${token.colors.line.normal};
`;

export const GradeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  cursor: pointer;
  background-color: ${token.colors.background.white};
`;

export const GradeTitle = styled.span`
  ${token.typography("body", "md", "semibold")}
`;

export const GradeRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ChevronIcon = styled.img<{ isOpen: boolean }>`
  width: 16px;
  height: 16px;
  transform: ${({ isOpen }) => isOpen ? "rotate(180deg)" : "rotate(0deg)"};
  transition: transform 0.2s ease;
  flex-shrink: 0;
`;

export const MemberRow = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 12px;
  border-top: 1px solid ${token.colors.line.normal};
  background-color: ${token.colors.background.white};
`;

export const ProfileImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

export const MemberInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const MemberName = styled.span`
  ${token.typography("body", "sm", "semibold")}
`;

export const MemberSub = styled.span`
  ${token.typography("caption", "sm", "regular")}
  color: ${token.colors.text.normal};
`;

export const RoleText = styled.span`
  ${token.typography("caption", "md", "regular")}
  color: ${token.colors.text.normal};
  flex-shrink: 0;
`;

export const Checkbox = styled.div<{ checked: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 4px;
  border: 1.5px solid ${({ checked }) => checked ? token.colors.accent.primary : token.colors.line.normal};
  background-color: ${({ checked }) => checked ? token.colors.accent.primary : "transparent"};
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CheckIcon = styled.img`
  width: 13px;
  height: 13px;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background-color: ${token.colors.fill.f3};
  border-top: 1px solid ${token.colors.line.normal};
`;

export const SelectedCount = styled.span`
  ${token.typography("caption", "md", "regular")}
  color: ${token.colors.text.normal};
`;

export const ClearAll = styled.span`
  ${token.typography("caption", "md", "regular")}
  color: ${token.colors.text.normal};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export const SearchWrapper = styled.div`
  padding: 0 16px;
  border-bottom: 1px solid ${token.colors.line.normal};
`;

export const EmptyText = styled.div`
  padding: 24px 16px;
  text-align: center;
  ${token.typography("body", "sm", "regular")}
  color: ${token.colors.text.normal};
`;