import styled from 'styled-components';
import * as token from '@/styles/values/token';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  ${token.flexCenter}
  z-index: 1000;
`;

export const Modal = styled.div`
  background-color: ${token.colors.main.white};
  border-radius: ${token.shapes.large};
  width: 680px;
  max-height: 80vh;
  ${token.flexColumn}
  ${token.elevation('black_3')}
`;

/* ─── 검색 헤더 ─── */
export const SearchHeader = styled.div`
  ${token.flexRow}
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-bottom: 1px solid ${token.colors.line.light};
  flex-shrink: 0;
`;

export const SearchIcon = styled.span`
  color: ${token.colors.text.lightGray};
  ${token.flexCenter}
  flex-shrink: 0;
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  ${token.typography('body', 'md', 'regular')}
  color: ${token.colors.text.coolGray};
  background: transparent;

  &::placeholder {
    color: ${token.colors.text.lightGray};
  }
`;

export const CloseIconButton = styled.button`
  ${token.flexCenter}
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${token.colors.text.lightGray};
  border-radius: 50%;
  transition: background-color 0.15s;
  flex-shrink: 0;

  &:hover {
    background-color: ${token.colors.fill.f3};
    color: ${token.colors.text.dark};
  }
`;

/* ─── 멤버 목록 ─── */
export const MemberList = styled.div`
  max-height: 288px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${token.colors.line.light};
    border-radius: 2px;
  }
`;

export const MemberRow = styled.div`
  ${token.flexRow}
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid ${token.colors.line.light};
  transition: background-color 0.15s;

  &:last-child {
    border-bottom: none;
  }
`;

export const LeftSection = styled.div`
  flex: 1;
  ${token.flexRow}
  align-items: center;
  gap: 14px;
  min-width: 0;
`;

export const RightSection = styled.div`
  flex: 1;
  ${token.flexRow}
  justify-content: flex-end;
  align-items: center;
`;

export const Avatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background-color: ${token.colors.fill.f3};
  ${token.flexCenter}
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const AvatarFallback = styled.div`
  ${token.typography('body', 'sm', 'bold')}
  color: ${token.colors.text.dark};
`;

export const MemberInfo = styled.div`
  ${token.flexColumn}
  gap: 1px;
  min-width: 0;
`;

export const MemberName = styled.span`
  ${token.typography('caption', 'lg', 'semibold')}
  color: ${token.colors.text.dark};
`;

export const MemberSub = styled.span`
  ${token.typography('caption', 'md', 'medium')}
  color: ${token.colors.text.lightGray};
`;

export const RoleLabel = styled.span`
  ${token.typography('caption', 'md', 'medium')}
  color: ${token.colors.text.lightGray};
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
`;

export const KebabWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const KebabButton = styled.button`
  ${token.flexCenter}
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 6px;
  color: ${token.colors.fill.a0};
  transition: background-color 0.15s;

  &:hover {
    background-color: ${token.colors.fill.f3};
    color: ${token.colors.text.dark};
  }
`;

export const DropdownMenu = styled.div`
  position: fixed;
  background-color: ${token.colors.main.white};
  border: 1px solid ${token.colors.line.light};
  border-radius: ${token.shapes.medium};
  ${token.elevation('black_2')}
  min-width: 160px;
  z-index: 1001;
  overflow: hidden;
  ${token.flexColumn}
`;

export const DropdownItem = styled.button<{ $danger?: boolean }>`
  padding: 10px 16px;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  ${token.typography('body', 'sm', 'medium')}
  color: ${({ $danger }) =>
    $danger ? token.colors.calendar.red : token.colors.text.dark};
  transition: background-color 0.15s;
  white-space: nowrap;

  &:hover {
    background-color: ${({ $danger }) =>
      $danger ? '#FFF0F0' : token.colors.fill.f5};
  }
`;

export const DropdownDivider = styled.div`
  height: 1px;
  background-color: ${token.colors.line.light};
  margin: 2px 0;
`;

export const EmptyMessage = styled.div`
  ${token.flexCenter}
  padding: 60px 0;
  ${token.typography('body', 'md', 'medium')}
  color: ${token.colors.text.lightGray};
`;

/* ─── 하단 바 ─── */
export const Footer = styled.div`
  ${token.flexBetween}
  align-items: center;
  padding: 14px 24px;
  background-color: ${token.colors.fill.f3};
  border-top: 1px solid ${token.colors.fill.f3};
  border-radius: 0 0 ${token.shapes.large} ${token.shapes.large};
  flex-shrink: 0;
`;

export const FooterCount = styled.span`
  ${token.typography('caption', 'md', 'medium')}
  color: ${token.colors.text.coolGray};
`;

export const ShortcutHint = styled.div`
  ${token.flexRow}
  align-items: center;
  gap: 6px;
  ${token.typography('caption', 'sm', 'medium')}
  color: ${token.colors.text.coolGray};
`;

export const KeyBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 7px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: 4px;
  background-color: ${token.colors.main.white};
  ${token.typography('caption', 'sm', 'medium')}
  color: ${token.colors.text.coolGray};
  letter-spacing: 0.5px;
`;
