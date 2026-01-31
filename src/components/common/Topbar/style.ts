import styled from 'styled-components';

export const Container = styled.header`
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 5rem;
  background-color: ${({ theme }) => theme.colors.background.white};
  width: 100%;
  min-height: 60px;
`;

export const LogoWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export const Logo = styled.img`
  height: 36px;
  width: auto;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

export const LoginButton = styled.button`
  padding: 0.6rem 1rem;
  min-width: 84px;
  font-size: ${({ theme }) => theme.typography.fontSize.body.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.dark};
  background-color: ${({ theme }) => theme.colors.fill.white};
  border: 1px solid ${({ theme }) => theme.colors.line.light};
  border-radius: 4px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.fill.f5};
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const SignupButton = styled.button`
  padding: 0.6rem 1rem;
  min-width: 84px;
  font-size: ${({ theme }) => theme.typography.fontSize.body.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.dark};
  background-color: ${({ theme }) => theme.colors.accent.primary};
  border: none;
  border-radius: 4px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent.secondary1};
  }

  &:active {
    transform: scale(0.98);
  }
`;
