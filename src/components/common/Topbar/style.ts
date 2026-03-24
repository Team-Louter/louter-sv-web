import styled from 'styled-components';
import * as token from '@/styles/values/token';

export const Container = styled.header<{
  $hidden?: boolean;
  $isLoggedIn?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  padding: 1rem 5rem;
  background-color: ${token.colors.background.white};
  width: 100%;
  min-height: 60px;
  transform: translateY(${({ $hidden }) => ($hidden ? '-100%' : '0')});
  transition: transform 0.3s ease;
  z-index: 100;

  @media screen and (min-width: 769px) {
    display: ${({ $isLoggedIn }) => ($isLoggedIn ? 'grid' : 'flex')};
    grid-template-columns: ${({ $isLoggedIn }) =>
      $isLoggedIn ? '1fr auto 1fr' : 'none'};
  }

  @media screen and (max-width: 1200px) {
    padding: 1rem 3rem;
  }

  @media screen and (max-width: 1024px) {
    padding: 1rem 2rem;
  }

  @media screen and (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    padding: 1rem 1.5rem;
  }
`;

export const LogoWrapper = styled.div`
  ${token.flexLeft}
  cursor: pointer;
  /* grid에서 이 요소의 위치를 좌측 정렬 */
  justify-content: flex-start;
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
  ${token.flexCenter}
  gap: 5rem;
  justify-content: center;

  @media screen and (max-width: 1200px) {
    gap: 4rem;
  }

  @media screen and (max-width: 1024px) {
    gap: 2.5rem;
  }

  @media screen and (max-width: 768px) {
    display: none;
  }
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
  gap: 0.5rem;
  /* grid에서 이 요소의 위치를 우측 정렬 */
  justify-content: flex-end;

  @media screen and (max-width: 768px) {
    display: none;
  }
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

/* ── 모바일 메뉴 관련 ── */

export const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${token.colors.text.normal};
  cursor: pointer;
  padding: 0.5rem;
  z-index: 101;

  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const MobileNavContainer = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: ${token.colors.background.white};
  border-bottom: 1px solid ${token.colors.line.light};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: ${({ $isOpen }) => ($isOpen ? '500px' : '0')};
  transition: max-height 0.3s ease-in-out;

  @media screen and (min-width: 769px) {
    display: none;
  }
`;

export const MobileNavItem = styled.button<{ $active?: boolean }>`
  width: 100%;
  padding: 1rem 1.5rem;
  text-align: left;
  background: none;
  border: none;
  ${token.typography('body', 'md', 'medium')}
  color: ${({ $active }) =>
    $active ? token.colors.text.gold : token.colors.text.normal};
  font-weight: ${({ $active }) =>
    $active ? token.fontWeight.bold : token.fontWeight.medium};
  cursor: pointer;

  &:hover {
    background-color: ${token.colors.fill.f5};
  }
`;

export const MobileNavDivider = styled.div`
  height: 1px;
  background-color: ${token.colors.line.light};
  margin: 0.5rem 1.5rem;
`;
