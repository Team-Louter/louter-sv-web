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
  padding: 0.875rem 1rem;
  cursor: pointer;
  background-color: ${token.colors.background.white};
`;

export const GradeTitle = styled.span`
  ${token.typography("body", "md", "semibold")}
`;

export const GradeRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const ChevronIcon = styled.img<{ isOpen: boolean }>`
  width: 1rem;
  height: 1rem;
  transform: ${({ isOpen }) => isOpen ? "rotate(180deg)" : "rotate(0deg)"};
  transition: transform 0.2s ease;
  flex-shrink: 0;
`;

export const MemberRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  gap: 0.75rem;
  border-top: 1px solid ${token.colors.line.normal};
  background-color: ${token.colors.background.white};

  @media (max-width: 36rem) {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
  }
`;

export const ProfileImg = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

export const MemberInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

export const MemberName = styled.span`
  ${token.typography("body", "sm", "semibold")}
`;

export const MemberSub = styled.span`
  ${token.typography("caption", "sm", "regular")}
  color: ${token.colors.text.normal};
  overflow-wrap: anywhere;
`;

export const RoleText = styled.span`
  ${token.typography("caption", "md", "regular")}
  color: ${token.colors.text.normal};
  flex-shrink: 0;

  @media (max-width: 36rem) {
    display: none;
  }
`;

export const Checkbox = styled.div<{ checked: boolean }>`
  width: 1.375rem;
  height: 1.375rem;
  border-radius: 0.25rem;
  border: 1.5px solid ${({ checked }) => checked ? token.colors.accent.primary : token.colors.line.normal};
  background-color: ${({ checked }) => checked ? token.colors.accent.primary : "transparent"};
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CheckIcon = styled.img`
  width: 0.8125rem;
  height: 0.8125rem;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem 1rem;
  background-color: ${token.colors.fill.f3};
  border-top: 1px solid ${token.colors.line.normal};

  @media (max-width: 36rem) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
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
  padding: 0 1rem;
  border-bottom: 1px solid ${token.colors.line.normal};
`;

export const EmptyText = styled.div`
  padding: 1.5rem 1rem;
  text-align: center;
  ${token.typography("body", "sm", "regular")}
  color: ${token.colors.text.normal};
`;
