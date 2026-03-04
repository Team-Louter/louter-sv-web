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
  &:hover { opacity: 0.9; }
`;

export const EmptyState = styled.p`
  ${token.typography('body', 'md', 'regular')};
  color: ${token.colors.text.neutral};
  text-align: center;
  padding: 80px 0;
`;

/* ─── 스키마 카드 그리드 ──────────────── */
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
`;

export const CardMeta = styled.div`
  ${token.flexRow};
  gap: 8px;
  align-items: center;
`;

export const DialectBadge = styled.span<{ $dialect: string }>`
  ${token.typography('caption', 'lg', 'semibold')};
  padding: 2px 8px;
  border-radius: 999px;
  ${({ $dialect }) => {
    switch ($dialect) {
      case 'MYSQL':
        return css`background: #E8F0FE; color: #1967D2;`;
      case 'POSTGRESQL':
        return css`background: #E6F4EA; color: #137333;`;
      case 'MSSQL':
        return css`background: #FEF7E0; color: #B06D00;`;
      default:
        return css`background: ${token.colors.fill.neutral}; color: ${token.colors.text.neutral};`;
    }
  }};
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
  width: 440px;
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
  &:focus { border-color: ${token.colors.main.yellow}; }
`;

export const ModalTextarea = styled.textarea`
  ${token.typography('body', 'md', 'regular')};
  padding: 10px 12px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.small};
  resize: vertical;
  min-height: 70px;
  outline: none;
  &:focus { border-color: ${token.colors.main.yellow}; }
`;

export const ModalSelect = styled.select`
  ${token.typography('body', 'md', 'regular')};
  padding: 10px 12px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.small};
  outline: none;
  &:focus { border-color: ${token.colors.main.yellow}; }
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
  &:hover { background: ${token.colors.fill.neutral}; }
`;

export const DangerButton = styled.button`
  ${token.typography('body', 'sm', 'semibold')};
  padding: 8px 16px;
  border: none;
  border-radius: ${token.shapes.small};
  background: ${token.colors.state.error};
  color: #fff;
  cursor: pointer;
  &:hover { opacity: 0.9; }
`;

/* ─── ERD 에디터 ─────────────────────── */
export const EditorContainer = styled.div`
  ${token.flexColumn};
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
  &:hover { background: ${token.colors.fill.neutral}; }
`;

export const EditorTitle = styled.h3`
  ${token.typography('body', 'lg', 'semibold')};
  color: ${token.colors.text.strong};
  flex: 1;
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
  &:hover { opacity: 0.85; }
`;

export const CanvasArea = styled.div`
  flex: 1;
  min-height: 0;
  position: relative;
  background: ${token.colors.background.f5};
  overflow: hidden;
`;

/* ─── 테이블 노드 (SVG 내) ──────────── */
export const TableNodeGroup = styled.g`
  cursor: grab;
  &:active { cursor: grabbing; }
`;

/* ─── 테이블 편집 패널 ─────────────── */
export const TablePanel = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 340px;
  height: 100%;
  background: ${token.colors.background.white};
  border-left: 1px solid ${token.colors.line.normal};
  ${token.elevation('black_2')};
  ${token.flexColumn};
  gap: 0;
  z-index: 10;
  overflow-y: auto;
`;

export const PanelHeader = styled.div`
  ${token.flexRow};
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid ${token.colors.line.normal};
`;

export const PanelTitle = styled.h4`
  ${token.typography('body', 'md', 'bold')};
  color: ${token.colors.text.strong};
`;

export const PanelBody = styled.div`
  ${token.flexColumn};
  gap: 12px;
  padding: 16px;
`;

export const FieldLabel = styled.label`
  ${token.typography('caption', 'lg', 'semibold')};
  color: ${token.colors.text.neutral};
`;

export const ColumnRow = styled.div`
  ${token.flexRow};
  gap: 6px;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid ${token.colors.line.neutral};
`;

export const ColumnInput = styled.input`
  ${token.typography('caption', 'lg', 'regular')};
  padding: 4px 6px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: 4px;
  outline: none;
  width: 100%;
  &:focus { border-color: ${token.colors.main.yellow}; }
`;

export const ColumnSelect = styled.select`
  ${token.typography('caption', 'lg', 'regular')};
  padding: 4px 4px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: 4px;
  outline: none;
  min-width: 80px;
  &:focus { border-color: ${token.colors.main.yellow}; }
`;

export const SmallIconButton = styled.button`
  padding: 2px 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${token.colors.text.coolGray};
  font-size: 14px;
  &:hover { color: ${token.colors.state.error}; }
`;

/* ─── DDL 내보내기 모달 ──────────────── */
export const DDLBlock = styled.pre`
  ${token.typography('body', 'sm', 'regular')};
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  padding: 16px;
  background: ${token.colors.fill.normal};
  border-radius: ${token.shapes.small};
  overflow-x: auto;
  max-height: 400px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
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
