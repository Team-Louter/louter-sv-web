import styled, { css } from 'styled-components';
import * as token from '@/styles/values/token';

export const Container = styled.div`
  ${token.flexRow};
  gap: 0;
  height: calc(100vh - 72px - 56px);
  background-color: ${token.colors.background.white};
  border-radius: ${token.shapes.medium};
  border: 1px solid ${token.colors.line.normal};
  overflow: hidden;
`;

/* ── 사이드바 (파일 트리) ─────────────── */

export const TreeSidebar = styled.div`
  width: 260px;
  min-width: 260px;
  border-right: 1px solid ${token.colors.line.normal};
  ${token.flexColumn};
  background-color: ${token.colors.background.lightGray};
`;

export const TreeHeader = styled.div`
  ${token.flexRow};
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid ${token.colors.line.normal};
`;

export const TreeTitle = styled.span`
  ${token.typography('body', 'sm', 'semibold')};
  color: ${token.colors.text.strong};
`;

export const TreeActions = styled.div`
  ${token.flexRow};
  gap: 4px;
`;

export const TreeButton = styled.button`
  ${token.flexCenter};
  width: 28px;
  height: 28px;
  border-radius: 4px;
  color: ${token.colors.text.neutral};
  transition: all 0.15s;

  &:hover {
    background-color: ${token.colors.fill.normal};
    color: ${token.colors.text.normal};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const TreeSearch = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-bottom: 1px solid ${token.colors.line.normal};
  ${token.typography('caption', 'lg', 'regular')};
  color: ${token.colors.text.normal};
  background-color: transparent;
  outline: none;

  &::placeholder {
    color: ${token.colors.text.disabled};
  }
`;

export const TreeBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
`;

export const TreeItem = styled.div<{ $depth: number; $active?: boolean }>`
  ${token.flexRow};
  align-items: center;
  gap: 6px;
  padding: 6px 12px 6px ${({ $depth }) => 12 + $depth * 16}px;
  cursor: pointer;
  transition: background-color 0.1s;
  ${token.typography('caption', 'lg', 'regular')};
  color: ${token.colors.text.normal};

  &:hover {
    background-color: ${token.colors.fill.normal};
  }

  ${({ $active }) =>
    $active &&
    css`
      background-color: ${token.colors.accent.secondary4};
      color: ${token.colors.text.strong};
      font-weight: 500;
    `}

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    color: ${token.colors.text.coolGray};
  }
`;

export const TreeItemName = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TreeItemInput = styled.input`
  flex: 1;
  padding: 2px 4px;
  border: 1px solid ${token.colors.accent.primary};
  border-radius: 2px;
  ${token.typography('caption', 'lg', 'regular')};
  color: ${token.colors.text.normal};
  outline: none;
`;

/* ── 메인 컨텐츠 영역 ─────────────────── */

export const ContentArea = styled.div`
  flex: 1;
  ${token.flexColumn};
  overflow: hidden;
`;

export const ContentHeader = styled.div`
  ${token.flexRow};
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid ${token.colors.line.normal};
  flex-shrink: 0;
`;

export const DocTitle = styled.h2`
  ${token.typography('body', 'lg', 'semibold')};
  color: ${token.colors.text.strong};
`;

export const ContentActions = styled.div`
  ${token.flexRow};
  gap: 8px;
`;

export const ActionButton = styled.button`
  padding: 6px 14px;
  border-radius: ${token.shapes.xsmall};
  ${token.typography('caption', 'lg', 'medium')};
  color: ${token.colors.text.neutral};
  background-color: ${token.colors.fill.normal};
  transition: all 0.15s;

  &:hover {
    background-color: ${token.colors.fill.neutral};
  }
`;

export const PrimaryButton = styled(ActionButton)`
  background-color: ${token.colors.accent.primary};
  color: ${token.colors.text.strong};
  font-weight: 600;

  &:hover {
    opacity: 0.85;
  }
`;

export const DangerButton = styled(ActionButton)`
  color: ${token.colors.state.error};
`;

export const TabRow = styled.div`
  ${token.flexRow};
  border-bottom: 1px solid ${token.colors.line.normal};
  flex-shrink: 0;
`;

export const Tab = styled.button<{ $active: boolean }>`
  padding: 10px 20px;
  ${token.typography('body', 'sm', 'medium')};
  color: ${token.colors.text.neutral};
  border-bottom: 2px solid transparent;
  transition: all 0.15s;

  ${({ $active }) =>
    $active &&
    css`
      color: ${token.colors.text.strong};
      border-bottom-color: ${token.colors.accent.primary};
      font-weight: 600;
    `}
`;

export const EditorArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

export const MarkdownEditor = styled.textarea`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  ${token.typography('body', 'sm', 'regular')};
  color: ${token.colors.text.normal};
  line-height: 1.8;
  resize: none;
  font-family: 'Consolas', 'Monaco', 'Menlo', monospace;
  background-color: transparent;
`;

export const MarkdownPreview = styled.div`
  ${token.typography('body', 'sm', 'regular')};
  color: ${token.colors.text.normal};
  line-height: 1.8;

  h1 {
    ${token.typography('heading', 'lg', 'bold')};
    margin: 20px 0 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid ${token.colors.line.normal};
  }

  h2 {
    ${token.typography('heading', 'md', 'bold')};
    margin: 16px 0 10px;
  }

  h3 {
    ${token.typography('heading', 'sm', 'semibold')};
    margin: 12px 0 8px;
  }

  p {
    margin: 8px 0;
  }

  ul, ol {
    padding-left: 24px;
    margin: 8px 0;

    li {
      margin: 4px 0;
    }
  }

  ol {
    list-style: decimal;
  }

  ul {
    list-style: disc;
  }

  code {
    background-color: ${token.colors.fill.normal};
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 0.85em;
  }

  pre {
    background-color: ${token.colors.fill.f3};
    padding: 16px;
    border-radius: ${token.shapes.xsmall};
    overflow-x: auto;
    margin: 12px 0;

    code {
      background: none;
      padding: 0;
    }
  }

  blockquote {
    border-left: 4px solid ${token.colors.accent.primary};
    padding-left: 16px;
    margin: 12px 0;
    color: ${token.colors.text.neutral};
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;

    th, td {
      border: 1px solid ${token.colors.line.normal};
      padding: 8px 12px;
      text-align: left;
    }

    th {
      background-color: ${token.colors.fill.normal};
      font-weight: 600;
    }
  }

  a {
    color: ${token.colors.state.info};
    text-decoration: underline;
  }

  img {
    max-width: 100%;
    border-radius: ${token.shapes.xsmall};
  }

  hr {
    border: none;
    border-top: 1px solid ${token.colors.line.normal};
    margin: 16px 0;
  }
`;

export const EmptyState = styled.div`
  ${token.flexCenter};
  ${token.flexColumn};
  gap: 12px;
  flex: 1;
  color: ${token.colors.text.coolGray};
  ${token.typography('body', 'md', 'medium')};
`;

export const MetaInfo = styled.div`
  ${token.flexRow};
  gap: 16px;
  padding: 8px 20px;
  border-top: 1px solid ${token.colors.line.normal};
  flex-shrink: 0;
`;

export const MetaText = styled.span`
  ${token.typography('caption', 'md', 'regular')};
  color: ${token.colors.text.coolGray};
`;

/* ── 버전 히스토리 ─────────────────────── */

export const VersionPanel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 360px;
  height: 100vh;
  background-color: ${token.colors.background.white};
  ${token.elevation('black_3')};
  z-index: 90;
  ${token.flexColumn};
  animation: slideIn 0.2s ease-out;

  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
`;

export const VersionHeader = styled.div`
  ${token.flexRow};
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid ${token.colors.line.normal};
`;

export const VersionTitle = styled.span`
  ${token.typography('body', 'md', 'semibold')};
  color: ${token.colors.text.strong};
`;

export const VersionList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
`;

export const VersionItem = styled.div`
  padding: 12px 20px;
  cursor: pointer;
  ${token.flexColumn};
  gap: 4px;
  border-bottom: 1px solid ${token.colors.line.neutral};
  transition: background-color 0.15s;

  &:hover {
    background-color: ${token.colors.fill.normal};
  }
`;

export const VersionDate = styled.span`
  ${token.typography('body', 'sm', 'medium')};
  color: ${token.colors.text.normal};
`;

export const VersionBy = styled.span`
  ${token.typography('caption', 'md', 'regular')};
  color: ${token.colors.text.coolGray};
`;

/* ── Modal ──────────────────────────────── */
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
  padding: 28px;
  width: 400px;
  ${token.flexColumn};
  gap: 16px;
`;

export const ModalTitle = styled.h2`
  ${token.typography('heading', 'sm', 'bold')};
  color: ${token.colors.text.strong};
`;

export const ModalInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.xsmall};
  ${token.typography('body', 'sm', 'regular')};
  color: ${token.colors.text.normal};
  outline: none;

  &:focus {
    border-color: ${token.colors.accent.primary};
  }
`;

export const ModalActions = styled.div`
  ${token.flexRow};
  justify-content: flex-end;
  gap: 10px;
`;

export const CloseButton = styled.button`
  ${token.flexCenter};
  width: 28px;
  height: 28px;
  border-radius: 4px;
  color: ${token.colors.text.neutral};

  &:hover {
    background-color: ${token.colors.fill.normal};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;
