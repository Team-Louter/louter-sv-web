import styled, { keyframes, css } from 'styled-components';
import * as token from '@/styles/values/token';

const slideDown = keyframes`
  from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
  to   { transform: translateX(-50%) translateY(0);     opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateX(-50%) translateY(0);     opacity: 1; }
  to   { transform: translateX(-50%) translateY(-20px); opacity: 0; }
`;

export const Wrapper = styled.div<{ $visible: boolean; $exitDuration: number }>`
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  pointer-events: none;

  ${({ $visible, $exitDuration }) =>
    $visible
      ? css`
          animation: ${slideDown} 0.22s ease forwards;
        `
      : css`
          animation: ${slideUp} ${$exitDuration}ms ease forwards;
        `}
`;

export const ToastBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px 12px 12px;
  border-radius: 999px;
  background-color: ${token.colors.main.white};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  white-space: nowrap;
`;

export const IconCircle = styled.div<{
  $type: 'error' | 'success' | 'warning';
}>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  background-color: ${({ $type }) =>
    $type === 'error'
      ? '#ffe5e5'
      : $type === 'success'
        ? '#fff8cc'
        : '#fff0d6'};
`;

export const Message = styled.span`
  ${token.typography('body', 'sm', 'semibold')}
  color: ${token.colors.text.dark};
`;
