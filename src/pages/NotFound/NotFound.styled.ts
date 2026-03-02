import styled from 'styled-components';
import * as token from '@/styles/values/token';

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  ${token.flexColumnCenter}
  gap: 2rem;
  background-color: ${token.colors.background.white};
`;

export const Image = styled.img`
  width: 320px;
  max-width: 80vw;
`;

export const Message = styled.p`
  ${token.typography('heading', 'sm', 'semibold')}
  color: ${token.colors.text.coolGray};
`;

export const BackButton = styled.button`
  ${token.typography('body', 'md', 'semibold')}
  color: ${token.colors.text.dark};
  background-color: ${token.colors.accent.primary};
  border: none;
  border-radius: 12px;
  padding: 0.75rem 2rem;
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background-color: ${token.colors.accent.secondary1};
  }
`;
