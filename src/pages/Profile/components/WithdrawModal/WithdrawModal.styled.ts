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
  padding: 2.5rem 3.5rem;
  width: 460px;
  ${token.flexColumnCenter}
  gap: 0;
  ${token.elevation('black_3')}
`;

export const Title = styled.h2`
  ${token.typography('heading', 'lg', 'bold')}
  color: ${token.colors.text.dark};
  margin: 0 0 2rem;
`;

export const Description = styled.p`
  ${token.typography('body', 'md', 'medium')}
  color: ${token.colors.text.dark};
  text-align: center;
  margin: 0 0 2rem;
`;

export const ConfirmInput = styled.input`
  width: 100%;
  padding: 0.5rem 1.5rem;
  border: 1px solid ${token.colors.line.light};
  border-radius: 4px;
  background-color: ${token.colors.fill.white};
  ${token.typography('body', 'sm', 'medium')}
  color: ${token.colors.text.dark};
  outline: none;
  text-align: center;
  box-sizing: border-box;
  margin-bottom: 2.5rem;

  &::placeholder {
    color: ${token.colors.text.lightGray};
  }

  &:focus {
    border-color: ${token.colors.line.dark};
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 1.25rem;
  justify-content: center;
`;

export const CancelButton = styled.button`
  padding: 10px 0px;
  width: 100px;
  border: 1px solid ${token.colors.line.light};
  border-radius: 4px;
  background-color: ${token.colors.fill.white};
  ${token.typography('body', 'sm', 'bold')}
  color: ${token.colors.text.dark};
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background-color: ${token.colors.fill.neutral};
  }
`;

export const ConfirmButton = styled.button<{ $active: boolean }>`
  padding: 10px 0px;
  width: 100px;
  border: none;
  border-radius: 4px;
  background-color: ${token.colors.accent.primary};
  ${token.typography('body', 'sm', 'bold')}
  color: ${token.colors.text.dark};
  cursor: ${({ $active }) => ($active ? 'pointer' : 'not-allowed')};
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
  transition:
    background-color 0.15s,
    border-color 0.15s,
    color 0.15s,
    opacity 0.15s;

  &:hover {
    background-color: ${({ $active }) =>
      $active ? token.colors.accent.secondary1 : token.colors.fill.neutral};
  }
`;
