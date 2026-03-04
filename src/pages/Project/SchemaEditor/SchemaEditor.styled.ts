import styled, { css } from 'styled-components';
import * as token from '@/styles/values/token';

/* ═══════════════════════════════════════════════════════════
   Full-screen Schema (ERD) Editor Styles
   ═══════════════════════════════════════════════════════════ */

/* ─── Root ───────────────────────────────────────────────── */
export const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: ${token.colors.background.white};
  font-family: 'Pretendard', sans-serif;
`;

/* ─── Top Bar ────────────────────────────────────────────── */
export const TopBar = styled.header`
  ${token.flexRow};
  align-items: center;
  height: 48px;
  min-height: 48px;
  padding: 0 12px;
  border-bottom: 1px solid ${token.colors.line.normal};
  background: ${token.colors.background.white};
  gap: 6px;
  z-index: 20;
`;

export const TopBarSection = styled.div`
  ${token.flexRow};
  align-items: center;
  gap: 4px;
`;

export const TopBarSep = styled.div`
  width: 1px;
  height: 24px;
  background: ${token.colors.line.neutral};
  margin: 0 4px;
`;

export const TBtn = styled.button<{ $active?: boolean; $danger?: boolean }>`
  ${token.flexRow};
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  ${token.typography('caption', 'lg', 'semibold')};
  color: ${token.colors.text.neutral};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.12s;
  &:hover:not(:disabled) {
    background: ${token.colors.fill.neutral};
  }
  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
  ${({ $active }) =>
    $active &&
    css`
      background: ${token.colors.main.yellow};
      color: #fff;
      &:hover { background: ${token.colors.main.yellow}; opacity: 0.9; }
    `};
  ${({ $danger }) =>
    $danger &&
    css`
      color: ${token.colors.state.error};
      &:hover { background: #fce4e4; }
    `};
`;

export const PrimaryBtn = styled(TBtn)`
  background: ${token.colors.main.yellow};
  color: #fff;
  &:hover:not(:disabled) {
    background: ${token.colors.main.yellow};
    opacity: 0.9;
  }
`;

export const EditorTitle = styled.div`
  ${token.typography('body', 'md', 'bold')};
  color: ${token.colors.text.strong};
  margin: 0 8px;
  flex-shrink: 0;
`;

export const DialectBadge = styled.span<{ $color?: string }>`
  ${token.typography('caption', 'lg', 'semibold')};
  padding: 2px 8px;
  border-radius: 999px;
  background: ${({ $color }) => ($color ? `${$color}18` : token.colors.fill.neutral)};
  color: ${({ $color }) => $color || token.colors.text.neutral};
`;

/* ─── Body Layout ────────────────────────────────────────── */
export const Body = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

export const LeftPanel = styled.aside<{ $collapsed?: boolean }>`
  ${token.flexColumn};
  width: ${({ $collapsed }) => ($collapsed ? '36px' : '260px')};
  min-width: ${({ $collapsed }) => ($collapsed ? '36px' : '260px')};
  border-right: 1px solid ${token.colors.line.normal};
  background: ${token.colors.background.white};
  transition: width 0.2s, min-width 0.2s;
  overflow: hidden;
  z-index: 10;
`;

export const RightPanel = styled.aside<{ $collapsed?: boolean }>`
  ${token.flexColumn};
  width: ${({ $collapsed }) => ($collapsed ? '36px' : '320px')};
  min-width: ${({ $collapsed }) => ($collapsed ? '36px' : '320px')};
  border-left: 1px solid ${token.colors.line.normal};
  background: ${token.colors.background.white};
  transition: width 0.2s, min-width 0.2s;
  overflow: hidden;
  z-index: 10;
`;

export const PanelToggle = styled.button`
  ${token.flexRow};
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 36px;
  border: none;
  border-bottom: 1px solid ${token.colors.line.normal};
  background: ${token.colors.background.f5};
  ${token.typography('caption', 'lg', 'semibold')};
  color: ${token.colors.text.neutral};
  cursor: pointer;
  flex-shrink: 0;
  &:hover {
    background: ${token.colors.fill.neutral};
  }
`;

export const PanelContent = styled.div`
  ${token.flexColumn};
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  gap: 8px;
`;

export const PanelSection = styled.div`
  ${token.flexColumn};
  gap: 8px;
`;

export const PanelSectionTitle = styled.div`
  ${token.typography('caption', 'lg', 'bold')};
  color: ${token.colors.text.neutral};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const SearchInput = styled.input`
  ${token.typography('caption', 'lg', 'regular')};
  padding: 6px 8px 6px 28px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.small};
  outline: none;
  width: 100%;
  &:focus {
    border-color: ${token.colors.main.yellow};
  }
`;

export const SearchWrap = styled.div`
  position: relative;
  svg {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    color: ${token.colors.text.coolGray};
  }
`;

/* ─── Table List (Left Panel) ────────────────────────────── */
export const TableListItem = styled.div<{ $active?: boolean; $color?: string }>`
  ${token.flexRow};
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: ${token.shapes.small};
  cursor: pointer;
  transition: background 0.1s;
  border-left: 3px solid ${({ $color }) => $color || 'transparent'};
  ${({ $active }) =>
    $active
      ? css`
          background: ${token.colors.fill.normal};
        `
      : css`
          &:hover {
            background: ${token.colors.fill.neutral};
          }
        `};
`;

export const TableListName = styled.span`
  ${token.typography('body', 'sm', 'semibold')};
  color: ${token.colors.text.strong};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const TableListMeta = styled.span`
  ${token.typography('caption', 'lg', 'regular')};
  color: ${token.colors.text.coolGray};
`;

/* ─── Canvas ─────────────────────────────────────────────── */
export const CanvasWrap = styled.div`
  flex: 1;
  min-width: 0;
  position: relative;
  overflow: hidden;
  background: ${token.colors.background.f5};
`;

export const SvgCanvas = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
`;

/* ─── Zoom Controls ──────────────────────────────────────── */
export const ZoomControls = styled.div`
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  ${token.flexRow};
  align-items: center;
  gap: 4px;
  background: ${token.colors.background.white};
  border: 1px solid ${token.colors.line.normal};
  border-radius: 999px;
  padding: 4px 8px;
  ${token.elevation('black_1')};
  z-index: 10;
`;

export const ZoomText = styled.span`
  ${token.typography('caption', 'lg', 'semibold')};
  color: ${token.colors.text.neutral};
  min-width: 44px;
  text-align: center;
`;

/* ─── Minimap ────────────────────────────────────────────── */
export const MinimapWrap = styled.div`
  position: absolute;
  bottom: 52px;
  right: 12px;
  width: 180px;
  height: 120px;
  background: ${token.colors.background.white};
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.small};
  ${token.elevation('black_1')};
  overflow: hidden;
  z-index: 10;
`;

/* ─── Status Bar ─────────────────────────────────────────── */
export const StatusBar = styled.footer`
  ${token.flexRow};
  align-items: center;
  height: 28px;
  padding: 0 12px;
  border-top: 1px solid ${token.colors.line.normal};
  background: ${token.colors.background.white};
  gap: 16px;
  z-index: 20;
`;

export const StatusText = styled.span`
  ${token.flexRow};
  align-items: center;
  gap: 4px;
  ${token.typography('caption', 'lg', 'regular')};
  color: ${token.colors.text.coolGray};
`;

/* ─── Context Menu ───────────────────────────────────────── */
export const CtxMenu = styled.div<{ $x: number; $y: number }>`
  position: fixed;
  left: ${({ $x }) => $x}px;
  top: ${({ $y }) => $y}px;
  ${token.flexColumn};
  min-width: 180px;
  background: ${token.colors.background.white};
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.small};
  ${token.elevation('black_3')};
  padding: 4px 0;
  z-index: 999;
`;

export const CtxItem = styled.button<{ $danger?: boolean }>`
  ${token.flexRow};
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: none;
  background: transparent;
  ${token.typography('body', 'sm', 'regular')};
  color: ${({ $danger }) => ($danger ? token.colors.state.error : token.colors.text.strong)};
  cursor: pointer;
  text-align: left;
  &:hover {
    background: ${token.colors.fill.neutral};
  }
`;

export const CtxSep = styled.div`
  height: 1px;
  background: ${token.colors.line.neutral};
  margin: 4px 0;
`;

export const CtxShortcut = styled.span`
  ${token.typography('caption', 'lg', 'regular')};
  color: ${token.colors.text.coolGray};
  margin-left: auto;
`;

/* ─── Right Panel — Property Editor ──────────────────────── */
export const PropGroup = styled.div`
  ${token.flexColumn};
  gap: 6px;
  padding: 12px 0;
  border-bottom: 1px solid ${token.colors.line.neutral};
  &:last-child { border-bottom: none; }
`;

export const PropLabel = styled.label`
  ${token.typography('caption', 'lg', 'semibold')};
  color: ${token.colors.text.neutral};
`;

export const PropInput = styled.input`
  ${token.typography('body', 'sm', 'regular')};
  padding: 6px 8px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: 4px;
  outline: none;
  width: 100%;
  &:focus { border-color: ${token.colors.main.yellow}; }
`;

export const PropTextarea = styled.textarea`
  ${token.typography('body', 'sm', 'regular')};
  padding: 6px 8px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: 4px;
  outline: none;
  width: 100%;
  resize: vertical;
  min-height: 50px;
  &:focus { border-color: ${token.colors.main.yellow}; }
`;

export const PropSelect = styled.select`
  ${token.typography('body', 'sm', 'regular')};
  padding: 6px 8px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: 4px;
  outline: none;
  width: 100%;
  &:focus { border-color: ${token.colors.main.yellow}; }
`;

export const PropRow = styled.div`
  ${token.flexRow};
  gap: 6px;
  align-items: center;
`;

export const ColorDot = styled.button<{ $color: string; $active?: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${({ $active }) => ($active ? '#333' : 'transparent')};
  background: ${({ $color }) => $color};
  cursor: pointer;
  flex-shrink: 0;
  &:hover { border-color: #666; }
`;

export const ColorGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

/* ─── Column Editor Row ──────────────────────────────────── */
export const ColumnEditorRow = styled.div<{ $dragging?: boolean }>`
  ${token.flexRow};
  align-items: center;
  gap: 4px;
  padding: 4px 0;
  border-bottom: 1px solid ${token.colors.line.neutral};
  ${({ $dragging }) => $dragging && css`opacity: 0.5;`};
`;

export const ColInput = styled.input`
  ${token.typography('caption', 'lg', 'regular')};
  padding: 4px 6px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: 4px;
  outline: none;
  &:focus { border-color: ${token.colors.main.yellow}; }
`;

export const ColSelect = styled.select`
  ${token.typography('caption', 'lg', 'regular')};
  padding: 4px 4px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: 4px;
  outline: none;
  min-width: 75px;
  &:focus { border-color: ${token.colors.main.yellow}; }
`;

export const ColBadge = styled.button<{ $active?: boolean; $color?: string }>`
  ${token.typography('caption', 'md', 'bold')};
  padding: 2px 4px;
  border: 1px solid ${({ $active, $color }) => ($active ? ($color || token.colors.main.yellow) : token.colors.line.normal)};
  border-radius: 3px;
  background: ${({ $active, $color }) => ($active ? ($color ? `${$color}20` : `${token.colors.main.yellow}20`) : 'transparent')};
  color: ${({ $active, $color }) => ($active ? ($color || token.colors.main.yellow) : token.colors.text.coolGray)};
  cursor: pointer;
  font-size: 10px;
  line-height: 1;
  &:hover { opacity: 0.8; }
`;

export const DragHandle = styled.span`
  cursor: grab;
  color: ${token.colors.text.coolGray};
  font-size: 12px;
  user-select: none;
  &:active { cursor: grabbing; }
`;

export const SmallIconBtn = styled.button`
  padding: 2px 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${token.colors.text.coolGray};
  display: flex;
  align-items: center;
  &:hover { color: ${token.colors.state.error}; }
`;

/* ─── Relation Editor ─────────────────────────────────────── */
export const RelRow = styled.div`
  ${token.flexRow};
  align-items: center;
  gap: 6px;
  padding: 6px 0;
  border-bottom: 1px solid ${token.colors.line.neutral};
  ${token.typography('caption', 'lg', 'regular')};
  color: ${token.colors.text.strong};
`;

export const RelBadge = styled.span<{ $type?: string }>`
  ${token.typography('caption', 'md', 'bold')};
  padding: 2px 6px;
  border-radius: 3px;
  background: ${token.colors.fill.normal};
  color: ${token.colors.text.neutral};
`;

/* ─── DDL Modal ──────────────────────────────────────────── */
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
  width: 700px;
  max-width: 90vw;
  max-height: 85vh;
  padding: 24px;
  background: ${token.colors.background.white};
  border-radius: ${token.shapes.medium};
  ${token.elevation('black_3')};
`;

export const ModalTitle = styled.h3`
  ${token.typography('body', 'lg', 'bold')};
  color: ${token.colors.text.strong};
`;

export const ModalActions = styled.div`
  ${token.flexRow};
  justify-content: flex-end;
  gap: 8px;
`;

export const DDLBlock = styled.pre`
  ${token.typography('body', 'sm', 'regular')};
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  padding: 16px;
  background: #1e1e2e;
  color: #cdd6f4;
  border-radius: ${token.shapes.small};
  overflow: auto;
  max-height: 50vh;
  white-space: pre;
  tab-size: 2;
  line-height: 1.6;
`;

export const DDLTabs = styled.div`
  ${token.flexRow};
  gap: 4px;
`;

export const DDLTab = styled.button<{ $active?: boolean }>`
  ${token.typography('caption', 'lg', 'semibold')};
  padding: 6px 14px;
  border: 1px solid ${({ $active }) => ($active ? token.colors.main.yellow : token.colors.line.normal)};
  border-radius: ${token.shapes.small};
  background: ${({ $active }) => ($active ? token.colors.main.yellow : 'transparent')};
  color: ${({ $active }) => ($active ? '#fff' : token.colors.text.neutral)};
  cursor: pointer;
  &:hover { opacity: 0.85; }
`;

/* ─── Inline Edit ────────────────────────────────────────── */
export const InlineInput = styled.input`
  position: absolute;
  border: 2px solid ${token.colors.main.yellow};
  border-radius: 3px;
  ${token.typography('body', 'sm', 'regular')};
  padding: 2px 4px;
  outline: none;
  z-index: 50;
  background: #fff;
`;

/* ─── Selection Box ──────────────────────────────────────── */
export const SelectionBox = styled.div`
  position: absolute;
  border: 1px dashed ${token.colors.main.yellow};
  background: rgba(255, 196, 0, 0.08);
  pointer-events: none;
  z-index: 15;
`;

/* ─── Tabs in panel ──────────────────────────────────────── */
export const TabRow = styled.div`
  ${token.flexRow};
  gap: 0;
  border-bottom: 1px solid ${token.colors.line.normal};
  flex-shrink: 0;
`;

export const Tab = styled.button<{ $active?: boolean }>`
  ${token.typography('caption', 'lg', 'semibold')};
  padding: 8px 14px;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? token.colors.main.yellow : 'transparent')};
  background: transparent;
  color: ${({ $active }) => ($active ? token.colors.text.strong : token.colors.text.coolGray)};
  cursor: pointer;
  &:hover { color: ${token.colors.text.strong}; }
`;
