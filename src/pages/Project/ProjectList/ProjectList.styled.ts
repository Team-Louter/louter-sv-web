import styled from 'styled-components';
import * as token from '@/styles/values/token';

export const Container = styled.div`
  background-color: ${token.colors.background.lightGray};
  width: 100%;
  min-height: calc(100vh - 72px);
  ${token.flexCenter};
  align-items: flex-start;
  overflow-y: auto;
`;

export const Inner = styled.div`
  width: 90%;
  max-width: 1200px;
  ${token.flexColumn};
  gap: 24px;
  padding: 40px 0;
`;

export const Header = styled.div`
  ${token.flexRow};
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.h1`
  ${token.typography('heading', 'md', 'bold')};
  color: ${token.colors.text.strong};
`;

export const CreateButton = styled.button`
  padding: 10px 20px;
  background-color: ${token.colors.accent.primary};
  border-radius: ${token.shapes.small};
  ${token.typography('body', 'sm', 'semibold')};
  color: ${token.colors.text.strong};
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.85;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

export const Card = styled.div`
  background-color: ${token.colors.background.white};
  border-radius: ${token.shapes.large};
  border: 1px solid ${token.colors.line.normal};
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  ${token.flexColumn};
  gap: 12px;

  &:hover {
    ${token.elevation('black_2')};
    transform: translateY(-2px);
  }
`;

export const CardTitle = styled.h3`
  ${token.typography('body', 'md', 'semibold')};
  color: ${token.colors.text.strong};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CardDescription = styled.p`
  ${token.typography('body', 'sm', 'regular')};
  color: ${token.colors.text.neutral};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 42px;
`;

export const CardFooter = styled.div`
  ${token.flexRow};
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`;

export const MemberAvatars = styled.div`
  ${token.flexRow};
  align-items: center;

  img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid ${token.colors.background.white};
    margin-left: -8px;
    object-fit: cover;
    background-color: ${token.colors.fill.normal};

    &:first-child {
      margin-left: 0;
    }
  }
`;

export const DateText = styled.span`
  ${token.typography('caption', 'md', 'regular')};
  color: ${token.colors.text.coolGray};
`;

export const EmptyState = styled.div`
  ${token.flexCenter};
  ${token.flexColumn};
  gap: 12px;
  padding: 80px 0;
  color: ${token.colors.text.coolGray};
  ${token.typography('body', 'md', 'medium')};
`;

/* ── Modal ─────────────────────────────── */

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: ${token.colors.fill.darkOverlay};
  ${token.flexCenter};
  z-index: 100;
`;

export const ModalBox = styled.div`
  background-color: ${token.colors.background.white};
  border-radius: ${token.shapes.large};
  padding: 32px;
  width: 440px;
  ${token.flexColumn};
  gap: 20px;
`;

export const ModalTitle = styled.h2`
  ${token.typography('heading', 'sm', 'bold')};
  color: ${token.colors.text.strong};
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.xsmall};
  ${token.typography('body', 'sm', 'regular')};
  color: ${token.colors.text.normal};
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: ${token.colors.accent.primary};
  }

  &::placeholder {
    color: ${token.colors.text.disabled};
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.xsmall};
  ${token.typography('body', 'sm', 'regular')};
  color: ${token.colors.text.normal};
  outline: none;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.15s;

  &:focus {
    border-color: ${token.colors.accent.primary};
  }

  &::placeholder {
    color: ${token.colors.text.disabled};
  }
`;

export const ModalActions = styled.div`
  ${token.flexRow};
  justify-content: flex-end;
  gap: 10px;
`;

export const CancelButton = styled.button`
  padding: 10px 18px;
  border-radius: ${token.shapes.xsmall};
  ${token.typography('body', 'sm', 'medium')};
  color: ${token.colors.text.neutral};
  background-color: ${token.colors.fill.normal};
  transition: background-color 0.15s;

  &:hover {
    background-color: ${token.colors.fill.neutral};
  }
`;

export const SubmitButton = styled.button`
  padding: 10px 18px;
  border-radius: ${token.shapes.xsmall};
  ${token.typography('body', 'sm', 'semibold')};
  color: ${token.colors.text.strong};
  background-color: ${token.colors.accent.primary};
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* ── Skeleton ──────────────────────────── */

export const SkeletonCard = styled.div`
  background-color: ${token.colors.background.white};
  border-radius: ${token.shapes.large};
  border: 1px solid ${token.colors.line.normal};
  padding: 24px;
  ${token.flexColumn};
  gap: 12px;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

export const SkeletonLine = styled.div<{ $width?: string; $height?: string }>`
  width: ${({ $width }) => $width ?? '100%'};
  height: ${({ $height }) => $height ?? '16px'};
  background-color: ${token.colors.fill.normal};
  border-radius: 4px;
`;
