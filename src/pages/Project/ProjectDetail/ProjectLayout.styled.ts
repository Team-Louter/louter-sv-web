import styled, { css } from 'styled-components';
import * as token from '@/styles/values/token';

export const Wrapper = styled.div`
  ${token.flexRow};
  width: 100%;
  height: calc(100vh - 72px);
  background-color: ${token.colors.background.lightGray};
  overflow: hidden;
`;

export const Sidebar = styled.aside`
  width: 240px;
  min-width: 240px;
  height: 100%;
  background-color: ${token.colors.background.white};
  border-right: 1px solid ${token.colors.line.normal};
  ${token.flexColumn};
  padding: 24px 0;
  overflow-y: auto;
`;

export const ProjectTitle = styled.h2`
  ${token.typography('body', 'md', 'bold')};
  color: ${token.colors.text.strong};
  padding: 0 20px 20px;
  border-bottom: 1px solid ${token.colors.line.neutral};
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const NavList = styled.nav`
  ${token.flexColumn};
  gap: 2px;
  padding: 0 8px;
`;

export const NavItem = styled.button<{ $active: boolean }>`
  ${token.flexRow};
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: ${token.shapes.xsmall};
  ${token.typography('body', 'sm', 'medium')};
  color: ${token.colors.text.neutral};
  transition: all 0.15s ease;
  text-align: left;

  &:hover {
    background-color: ${token.colors.fill.normal};
    color: ${token.colors.text.normal};
  }

  ${({ $active }) =>
    $active &&
    css`
      background-color: ${token.colors.accent.secondary4};
      color: ${token.colors.text.strong};
      font-weight: 600;
    `}

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
`;

export const Content = styled.main`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 28px 32px;
`;

export const MemberSection = styled.div`
  margin-top: auto;
  padding: 16px 20px 0;
  border-top: 1px solid ${token.colors.line.neutral};
`;

export const MemberLabel = styled.p`
  ${token.typography('caption', 'md', 'medium')};
  color: ${token.colors.text.neutral};
  margin-bottom: 10px;
`;

export const MemberList = styled.div`
  ${token.flexColumn};
  gap: 6px;
`;

export const MemberItem = styled.div`
  ${token.flexRow};
  align-items: center;
  gap: 8px;
  padding: 4px 0;
`;

export const MemberAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  background-color: ${token.colors.fill.normal};
`;

export const MemberName = styled.span`
  ${token.typography('caption', 'md', 'medium')};
  color: ${token.colors.text.normal};
`;

export const RoleBadge = styled.span`
  ${token.typography('caption', 'sm', 'medium')};
  color: ${token.colors.text.coolGray};
  margin-left: auto;
`;
