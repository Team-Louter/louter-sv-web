import styled, { css } from 'styled-components';
import * as token from '@/styles/values/token';

/* ═══════════════════════════════════════════════════════════
   Full-screen Diagram Editor Styles
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
  background: ${token.colors.line.normal};
  margin: 0 6px;
`;

export const TopBarTitle = styled.input`
  ${token.typography('body', 'md', 'semibold')};
  border: none;
  background: transparent;
  color: ${token.colors.text.strong};
  outline: none;
  min-width: 120px;
  max-width: 300px;
  padding: 4px 8px;
  border-radius: ${token.shapes.xsmall};
  &:hover { background: ${token.colors.fill.normal}; }
  &:focus { background: ${token.colors.fill.normal}; box-shadow: 0 0 0 2px ${token.colors.main.yellow}44; }
`;

export const TopBarSpacer = styled.div`
  flex: 1;
`;

export const SaveInfo = styled.span`
  ${token.typography('caption', 'lg', 'regular')};
  color: ${token.colors.text.coolGray};
  white-space: nowrap;
`;

/* ─── Toolbar Button ─────────────────────────────────────── */
export const TBtn = styled.button<{ $active?: boolean; $danger?: boolean }>`
  ${token.typography('caption', 'lg', 'semibold')};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 30px;
  min-width: 30px;
  padding: 0 8px;
  border-radius: ${token.shapes.xsmall};
  border: 1px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.12s;

  ${({ $active, $danger }) =>
    $danger
      ? css`
          background: ${token.colors.state.error};
          color: #fff;
          &:hover { opacity: 0.85; }
        `
      : $active
        ? css`
            background: ${token.colors.main.yellow};
            color: #fff;
            border-color: ${token.colors.main.yellow};
          `
        : css`
            background: transparent;
            color: ${token.colors.text.neutral};
            &:hover {
              background: ${token.colors.fill.normal};
              color: ${token.colors.text.strong};
            }
          `};

  &:disabled {
    opacity: 0.35;
    cursor: default;
    pointer-events: none;
  }
`;

export const PrimaryBtn = styled.button`
  ${token.typography('caption', 'lg', 'bold')};
  height: 30px;
  padding: 0 14px;
  border: none;
  border-radius: ${token.shapes.xsmall};
  background: ${token.colors.main.yellow};
  color: #fff;
  cursor: pointer;
  &:hover { opacity: 0.88; }
`;

/* ─── Main Body ──────────────────────────────────────────── */
export const Body = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

/* ─── Left Panel (Shape Palette) ─────────────────────────── */
export const LeftPanel = styled.aside<{ $collapsed: boolean }>`
  ${token.flexColumn};
  width: ${({ $collapsed }) => ($collapsed ? '40px' : '200px')};
  min-width: ${({ $collapsed }) => ($collapsed ? '40px' : '200px')};
  transition: width 0.2s, min-width 0.2s;
  border-right: 1px solid ${token.colors.line.normal};
  background: ${token.colors.background.white};
  overflow: hidden;
  z-index: 5;
`;

export const PanelToggle = styled.button`
  ${token.flexCenter};
  height: 36px;
  border: none;
  background: transparent;
  color: ${token.colors.text.coolGray};
  cursor: pointer;
  font-size: 14px;
  flex-shrink: 0;
  &:hover { background: ${token.colors.fill.normal}; }
`;

export const PanelTitle = styled.div`
  ${token.typography('caption', 'lg', 'bold')};
  color: ${token.colors.text.neutral};
  padding: 8px 12px 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const ShapeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 4px 8px;
  overflow-y: auto;
  flex: 1;
`;

export const ShapeItem = styled.button`
  ${token.flexColumnCenter};
  gap: 2px;
  padding: 8px 4px;
  border: 1px solid transparent;
  border-radius: ${token.shapes.xsmall};
  background: transparent;
  cursor: pointer;
  transition: all 0.12s;

  &:hover {
    background: ${token.colors.fill.normal};
    border-color: ${token.colors.line.normal};
  }
`;

export const ShapeIcon = styled.span`
  font-size: 22px;
  line-height: 1;
`;

export const ShapeLabel = styled.span`
  ${token.typography('caption', 'lg', 'regular')};
  color: ${token.colors.text.neutral};
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 72px;
`;

/* ─── Right Panel (Properties) ───────────────────────────── */
export const RightPanel = styled.aside<{ $collapsed: boolean }>`
  ${token.flexColumn};
  width: ${({ $collapsed }) => ($collapsed ? '40px' : '260px')};
  min-width: ${({ $collapsed }) => ($collapsed ? '40px' : '260px')};
  transition: width 0.2s, min-width 0.2s;
  border-left: 1px solid ${token.colors.line.normal};
  background: ${token.colors.background.white};
  overflow: hidden;
  z-index: 5;
`;

export const PropScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 12px 16px;
  ${token.flexColumn};
  gap: 10px;
`;

export const PropSection = styled.div`
  ${token.flexColumn};
  gap: 6px;
`;

export const PropLabel = styled.label`
  ${token.typography('caption', 'lg', 'semibold')};
  color: ${token.colors.text.coolGray};
`;

export const PropInput = styled.input`
  ${token.typography('body', 'sm', 'regular')};
  padding: 6px 8px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.xsmall};
  outline: none;
  width: 100%;
  &:focus { border-color: ${token.colors.main.yellow}; }
`;

export const PropSelect = styled.select`
  ${token.typography('body', 'sm', 'regular')};
  padding: 6px 8px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.xsmall};
  outline: none;
  width: 100%;
  background: #fff;
  &:focus { border-color: ${token.colors.main.yellow}; }
`;

export const PropRow = styled.div`
  ${token.flexRow};
  gap: 6px;
  align-items: center;
`;

export const PropColor = styled.input`
  width: 28px;
  height: 28px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.xsmall};
  cursor: pointer;
  padding: 0;
  &::-webkit-color-swatch-wrapper { padding: 2px; }
  &::-webkit-color-swatch { border: none; border-radius: 3px; }
`;

export const ColorPresets = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
`;

export const ColorDot = styled.button<{ $c: string; $active: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid ${({ $active }) => ($active ? token.colors.main.yellow : 'transparent')};
  background: ${({ $c }) => $c};
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.08);
  &:hover { transform: scale(1.2); }
`;

export const PropNumber = styled.input`
  ${token.typography('body', 'sm', 'regular')};
  padding: 4px 6px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.xsmall};
  outline: none;
  width: 60px;
  &:focus { border-color: ${token.colors.main.yellow}; }
`;

export const PropCheck = styled.label`
  ${token.flexRow};
  align-items: center;
  gap: 6px;
  ${token.typography('body', 'sm', 'regular')};
  color: ${token.colors.text.neutral};
  cursor: pointer;
  input { accent-color: ${token.colors.main.yellow}; }
`;

/* ─── Canvas ─────────────────────────────────────────────── */
export const CanvasWrap = styled.div`
  flex: 1;
  min-width: 0;
  position: relative;
  overflow: hidden;
  background: #f0f1f3;
`;

export const SvgCanvas = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
`;

/* ─── Minimap ────────────────────────────────────────────── */
export const MinimapWrap = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 180px;
  height: 120px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.xsmall};
  background: rgba(255,255,255,0.92);
  ${token.elevation('black_2')};
  overflow: hidden;
  z-index: 10;
  cursor: pointer;
`;

/* ─── Status Bar ─────────────────────────────────────────── */
export const StatusBar = styled.footer`
  ${token.flexRow};
  align-items: center;
  height: 26px;
  padding: 0 12px;
  border-top: 1px solid ${token.colors.line.normal};
  background: ${token.colors.background.white};
  gap: 12px;
  z-index: 20;
`;

export const StatusText = styled.span`
  ${token.typography('caption', 'lg', 'regular')};
  color: ${token.colors.text.coolGray};
  font-size: 11px;
`;

/* ─── Inline Label Editor ────────────────────────────────── */
export const InlineInput = styled.input`
  position: absolute;
  background: #fff;
  border: 2px solid ${token.colors.main.yellow};
  border-radius: 4px;
  padding: 2px 6px;
  text-align: center;
  outline: none;
  z-index: 30;
  ${token.typography('body', 'sm', 'regular')};
`;

/* ─── Selection Box (rubber band) ────────────────────────── */
export const SelectionBox = styled.div`
  position: absolute;
  border: 1px dashed ${token.colors.state.info};
  background: rgba(75, 136, 206, 0.08);
  pointer-events: none;
  z-index: 15;
`;

/* ─── Context Menu ───────────────────────────────────────── */
export const CtxMenu = styled.div`
  position: absolute;
  min-width: 160px;
  background: ${token.colors.background.white};
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.small};
  ${token.elevation('black_3')};
  z-index: 100;
  padding: 4px 0;
  ${token.flexColumn};
`;

export const CtxItem = styled.button<{ $danger?: boolean }>`
  ${token.typography('body', 'sm', 'regular')};
  padding: 8px 16px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  color: ${({ $danger }) => ($danger ? token.colors.state.error : token.colors.text.strong)};
  ${token.flexRow};
  gap: 8px;
  align-items: center;
  &:hover {
    background: ${token.colors.fill.normal};
  }
`;

export const CtxSep = styled.div`
  height: 1px;
  background: ${token.colors.line.normal};
  margin: 4px 0;
`;

export const CtxShortcut = styled.span`
  ${token.typography('caption', 'lg', 'regular')};
  color: ${token.colors.text.coolGray};
  margin-left: auto;
  font-size: 11px;
`;

/* ─── Zoom Controls (overlay) ────────────────────────────── */
export const ZoomControls = styled.div`
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  ${token.flexRow};
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: rgba(255,255,255,0.92);
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.small};
  ${token.elevation('black_1')};
  z-index: 10;
`;

export const ZoomText = styled.span`
  ${token.typography('caption', 'lg', 'semibold')};
  color: ${token.colors.text.neutral};
  min-width: 44px;
  text-align: center;
`;

/* ─── Tooltip ────────────────────────────────────────────── */
export const Tooltip = styled.div`
  position: fixed;
  padding: 4px 8px;
  background: ${token.colors.text.strong};
  color: #fff;
  border-radius: 4px;
  ${token.typography('caption', 'lg', 'regular')};
  font-size: 11px;
  pointer-events: none;
  z-index: 999;
  white-space: nowrap;
`;
