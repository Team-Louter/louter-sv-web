import styled from 'styled-components';
import * as token from '@/styles/values/token';

export const Container = styled.header<{ $hidden?: boolean }>`
  ${token.flexBetween}
  align-items: center;
  position: fixed;
  top: 0;
  padding: 1rem 5rem;
  background-color: ${token.colors.background.white};
  width: 100%;
  min-height: 60px;
  transform: translateY(${({ $hidden }) => ($hidden ? '-100%' : '0')});
  transition: transform 0.3s ease;
  z-index: 100;
`;

export const LogoWrapper = styled.div`
  ${token.flexLeft}
  flex: 1;
  cursor: pointer;
`;

export const Logo = styled.img`
  height: 36px;
  width: auto;
`;

export const ButtonGroup = styled.div`
  ${token.flexLeft}
  gap: 1rem;
`;

export const LoginButton = styled.button`
  padding: 0.6rem 1rem;
  min-width: 84px;
  ${token.typography('body', 'sm', 'bold')}
  color: ${token.colors.text.dark};
  background-color: ${token.colors.fill.white};
  border: 1px solid ${token.colors.line.normal};
  border-radius: 4px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: ${token.colors.fill.f5};
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const SignupButton = styled.button`
  padding: 0.6rem 1rem;
  min-width: 84px;
  ${token.typography('body', 'sm', 'bold')}
  color: ${token.colors.text.dark};
  background-color: ${token.colors.accent.primary};
  border: none;
  border-radius: 4px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: ${token.colors.accent.secondary1};
  }

  &:active {
    transform: scale(0.98);
  }
`;

/* ── 로그인 상태 — 중앙 네비게이션 ── */

export const Nav = styled.nav`
  ${token.flexLeft}
  gap: 5rem;
`;

export const NavItem = styled.button<{ $active?: boolean }>`
  ${token.typography('body', 'md', 'medium')}
  color: ${({ $active }) =>
    $active ? token.colors.text.gold : token.colors.text.normal};
  font-weight: ${({ $active }) =>
    $active ? token.fontWeight.bold : token.fontWeight.medium};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;

  &:hover {
    color: ${token.colors.text.gold};
    font-weight: ${token.fontWeight.bold};
  }
`;

/* ── 로그인 상태 — 오른쪽 아이콘/버튼 그룹 ── */

export const RightGroup = styled.div`
  ${token.flexRight}
  flex: 1;
  gap: 0.5rem;
`;

export const IconButton = styled.button`
  ${token.flexCenter}
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  border-radius: 6px;
  color: ${token.colors.text.neutral};
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    background-color: ${token.colors.fill.normal};
    color: ${token.colors.text.strong};
  }
`;

export const LogoutButton = styled.button`
  padding: 0.6rem 1rem;
  min-width: 84px;
  ${token.typography('body', 'sm', 'bold')}
  color: ${token.colors.text.dark};
  background-color: ${token.colors.fill.white};
  border: 1px solid ${token.colors.line.normal};
  border-radius: 4px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: ${token.colors.fill.f5};
  }

  &:active {
    transform: scale(0.98);
  }
`;
