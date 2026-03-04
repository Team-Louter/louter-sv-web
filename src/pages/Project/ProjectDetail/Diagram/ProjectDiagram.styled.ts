import styled, { css } from 'styled-components';
import * as token from '@/styles/values/token';

/* ─── 공통 ─────────────────────────────── */
export const Container = styled.div`
  ${token.flexColumn};
  gap: 24px;
  padding: 24px;
  height: 100%;
  overflow-y: auto;
`;

export const Header = styled.div`
  ${token.flexRow};
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;

export const Title = styled.h2`
  ${token.typography('heading', 'md', 'bold')};
  color: ${token.colors.text.strong};
`;

export const ActionButton = styled.button`
  ${token.typography('body', 'sm', 'semibold')};
  padding: 8px 16px;
  border: none;
  border-radius: ${token.shapes.small};
  background: ${token.colors.main.yellow};
  color: #fff;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

export const EmptyState = styled.p`
  ${token.typography('body', 'md', 'regular')};
  color: ${token.colors.text.neutral};
  text-align: center;
  padding: 80px 0;
`;

/* ─── 다이어그램 카드 그리드 ──────────── */
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

export const Card = styled.div`
  ${token.flexColumn};
  gap: 12px;
  padding: 20px;
  border-radius: ${token.shapes.medium};
  border: 1px solid ${token.colors.line.normal};
  background: ${token.colors.background.white};
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
  &:hover {
    border-color: ${token.colors.main.yellow};
    ${token.elevation('black_1')};
  }
`;

export const CardTitle = styled.h3`
  ${token.typography('body', 'lg', 'semibold')};
  color: ${token.colors.text.strong};
`;

export const CardDesc = styled.p`
  ${token.typography('body', 'sm', 'regular')};
  color: ${token.colors.text.neutral};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const CardMeta = styled.div`
  ${token.flexRow};
  gap: 8px;
  align-items: center;
`;

export const TypeBadge = styled.span<{ $type: string }>`
  ${token.typography('caption', 'lg', 'semibold')};
  padding: 2px 8px;
  border-radius: 999px;
  ${({ $type }) => {
    switch ($type) {
      case 'FLOWCHART':
        return css`background: #E8F0FE; color: #1A73E8;`;
      case 'ERD':
        return css`background: #E6F4EA; color: #137333;`;
      case 'SEQUENCE':
        return css`background: #FEF7E0; color: #B06D00;`;
      case 'MINDMAP':
        return css`background: #F3E8FD; color: #7627BB;`;
      default:
        return css`background: ${token.colors.fill.neutral}; color: ${token.colors.text.neutral};`;
    }
  }}
`;

export const DateText = styled.span`
  ${token.typography('caption', 'lg', 'regular')};
  color: ${token.colors.text.coolGray};
  margin-left: auto;
`;

/* ─── 모달 ─────────────────────────────── */
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
  ${token.flexCenter};
`;

export const ModalBox = styled.div`
  ${token.flexColumn};
  gap: 16px;
  width: 420px;
  max-width: 90vw;
  padding: 24px;
  background: ${token.colors.background.white};
  border-radius: ${token.shapes.medium};
  ${token.elevation('black_3')};
`;

export const ModalTitle = styled.h3`
  ${token.typography('body', 'lg', 'bold')};
  color: ${token.colors.text.strong};
`;

export const ModalInput = styled.input`
  ${token.typography('body', 'md', 'regular')};
  padding: 10px 12px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.small};
  outline: none;
  &:focus {
    border-color: ${token.colors.main.yellow};
  }
`;

export const ModalTextarea = styled.textarea`
  ${token.typography('body', 'md', 'regular')};
  padding: 10px 12px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.small};
  resize: vertical;
  min-height: 70px;
  outline: none;
  &:focus {
    border-color: ${token.colors.main.yellow};
  }
`;

export const ModalSelect = styled.select`
  ${token.typography('body', 'md', 'regular')};
  padding: 10px 12px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.small};
  outline: none;
  &:focus {
    border-color: ${token.colors.main.yellow};
  }
`;

export const ModalActions = styled.div`
  ${token.flexRow};
  justify-content: flex-end;
  gap: 8px;
`;

export const CancelButton = styled.button`
  ${token.typography('body', 'sm', 'semibold')};
  padding: 8px 16px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.small};
  background: transparent;
  color: ${token.colors.text.neutral};
  cursor: pointer;
  &:hover {
    background: ${token.colors.fill.neutral};
  }
`;

/* ─── 다이어그램 에디터 ─────────────── */
export const EditorContainer = styled.div`
  ${token.flexColumn};
  gap: 0;
  height: 100%;
  min-height: 0;
  overflow: hidden;
`;

export const EditorTopBar = styled.div`
  ${token.flexRow};
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid ${token.colors.line.normal};
  background: ${token.colors.background.white};
  gap: 12px;
  flex-shrink: 0;
`;

export const BackButton = styled.button`
  ${token.typography('body', 'sm', 'semibold')};
  padding: 6px 12px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.small};
  background: transparent;
  cursor: pointer;
  color: ${token.colors.text.neutral};
  &:hover {
    background: ${token.colors.fill.neutral};
  }
`;

export const EditorTitle = styled.h3`
  ${token.typography('body', 'lg', 'semibold')};
  color: ${token.colors.text.strong};
  flex: 1;
`;

export const CanvasArea = styled.div`
  flex: 1;
  min-height: 0;
  position: relative;
  background: ${token.colors.background.f5};
`;

export const ToolPanel = styled.div`
  ${token.flexRow};
  gap: 8px;
  padding: 8px 16px;
  border-bottom: 1px solid ${token.colors.line.normal};
  background: ${token.colors.background.white};
  flex-wrap: wrap;
  flex-shrink: 0;
`;

export const ToolButton = styled.button<{ $active?: boolean }>`
  ${token.typography('caption', 'lg', 'semibold')};
  padding: 6px 12px;
  border: 1px solid ${({ $active }) => ($active ? token.colors.main.yellow : token.colors.line.normal)};
  border-radius: ${token.shapes.small};
  background: ${({ $active }) => ($active ? token.colors.main.yellow : 'transparent')};
  color: ${({ $active }) => ($active ? '#fff' : token.colors.text.neutral)};
  cursor: pointer;
  &:hover {
    opacity: 0.85;
  }
`;

/* ─── Mermaid 코드 에디터 ──────────── */
export const MermaidWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  flex: 1;
  min-height: 0;
`;

export const MermaidEditor = styled.textarea`
  ${token.typography('body', 'sm', 'regular')};
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  padding: 16px;
  border: none;
  border-right: 1px solid ${token.colors.line.normal};
  background: ${token.colors.background.white};
  resize: none;
  outline: none;
  &:focus {
    box-shadow: inset 2px 0 0 ${token.colors.main.yellow};
  }
`;

export const MermaidPreview = styled.div`
  padding: 16px;
  overflow: auto;
  background: #fff;

  svg {
    max-width: 100%;
  }
`;

/* ─── ReactFlow 스타일 ────────────── */
export const FlowWrapper = styled.div`
  flex: 1;
  min-height: 0;

  .react-flow__node {
    border-radius: ${token.shapes.small};
    border: 2px solid ${token.colors.line.normal};
    background: ${token.colors.background.white};
    padding: 10px 14px;
    ${token.typography('body', 'sm', 'regular')};
    cursor: grab;
  }

  .react-flow__node.selected {
    border-color: ${token.colors.main.yellow};
    box-shadow: 0 0 0 2px ${token.colors.main.yellow}33;
  }

  .react-flow__edge-path {
    stroke: ${token.colors.text.coolGray};
    stroke-width: 2;
  }

  .react-flow__controls {
    ${token.elevation('black_1')};
  }
`;

/* ─── 노드 편집 패널 ─────────────── */
export const NodePanel = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 280px;
  height: 100%;
  background: ${token.colors.background.white};
  border-left: 1px solid ${token.colors.line.normal};
  ${token.elevation('black_2')};
  ${token.flexColumn};
  padding: 16px;
  gap: 12px;
  z-index: 10;
  overflow-y: auto;
`;

export const NodePanelTitle = styled.h4`
  ${token.typography('body', 'md', 'bold')};
  color: ${token.colors.text.strong};
`;

export const FieldLabel = styled.label`
  ${token.typography('caption', 'lg', 'semibold')};
  color: ${token.colors.text.neutral};
`;

export const DangerButton = styled.button`
  ${token.typography('body', 'sm', 'semibold')};
  padding: 8px 16px;
  border: none;
  border-radius: ${token.shapes.small};
  background: ${token.colors.state.error};
  color: #fff;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

export const TabRow = styled.div`
  ${token.flexRow};
  gap: 4px;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  ${token.typography('body', 'sm', 'semibold')};
  padding: 8px 16px;
  border: none;
  border-radius: ${token.shapes.small};
  background: ${({ $active }) => ($active ? token.colors.main.yellow : 'transparent')};
  color: ${({ $active }) => ($active ? '#fff' : token.colors.text.neutral)};
  cursor: pointer;
  &:hover {
    background: ${({ $active }) => ($active ? token.colors.main.yellow : token.colors.fill.neutral)};
  }
`;
