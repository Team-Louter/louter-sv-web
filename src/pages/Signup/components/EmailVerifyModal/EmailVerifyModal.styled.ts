import styled, { keyframes } from 'styled-components';
import * as token from '@/styles/values/token';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

export const Spinner = styled.div`
  width: 44px;
  height: 44px;
  border: 4px solid ${token.colors.fill.neutral};
  border-top-color: ${token.colors.accent.primary};
  border-radius: 50%;
  animation: ${spin} 0.75s linear infinite;
  margin: 2.5rem auto;
`;

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
  padding: 4rem 2rem;
  width: 460px;
  min-height: 480px;
  ${token.flexColumnCenter}
  ${token.elevation('black_3')}
`;

export const Title = styled.h2`
  ${token.typography('heading', 'lg', 'bold')}
  color: ${token.colors.text.dark};
  margin: 0 0 1rem;
`;

export const Subtitle = styled.p`
  ${token.typography('heading', 'sm', 'semibold')}
  color: ${token.colors.text.coolGray};
  text-align: center;
  margin: 0;
`;

export const CodeInputRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 2.5rem;
`;

export const CodeBox = styled.input<{ $filled: boolean }>`
  width: 50px;
  height: 60px;
  border: 1.5px solid transparent;
  border-radius: 4px;
  text-align: center;
  ${token.typography('heading', 'lg', 'bold')}
  color: #333333;
  outline: none;
  background-color: ${({ $filled }) => ($filled ? '#FFFFFF' : '#F5F5F5')};
  transition:
    background-color 0.1s,
    border-color 0.1s;
  caret-color: ${token.colors.line.dark};

  &:focus {
    border-color: #333333;
    background-color: #ffffff;
    box-shadow: none;
  }
`;

export const ResendButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  ${token.typography('body', 'sm', 'semibold')}
  color: ${token.colors.text.dark};
  padding: 0;
  margin-top: 2.5rem;

  &:hover {
    color: ${token.colors.text.dark};
  }
`;

export const SubmitButton = styled.button<{ $active: boolean }>`
  width: 80px;
  height: 80px;
  border: ${({ $active }) =>
    $active
      ? `1px solid ${token.colors.accent.primary}`
      : `1px solid ${token.colors.text.lightGray}`};
  border-radius: 20px;
  background-color: ${({ $active }) =>
    $active ? token.colors.accent.primary : token.colors.fill.white};
  ${token.flexCenter}
  cursor: ${({ $active }) => ($active ? 'pointer' : 'not-allowed')};
  transition: background-color 0.15s;
  margin-top: 2.5rem;

  img {
    filter: ${({ $active }) => ($active ? 'brightness(0) invert(1)' : 'none')};
    transition: filter 0.15s;
  }

  &:hover {
    background-color: ${({ $active }) =>
      $active ? token.colors.accent.secondary1 : token.colors.fill.neutral};
  }
`;
