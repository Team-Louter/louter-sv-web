import styled, { css } from 'styled-components';
import * as token from '@/styles/values/token';

/* ── 전체 컨테이너 ──────────────────────── */

export const Container = styled.div`
  ${token.flexColumn};
  gap: 20px;
  height: calc(100vh - 72px - 56px);
`;

export const Header = styled.div`
  ${token.flexRow};
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;

export const Title = styled.h1`
  ${token.typography('heading', 'sm', 'bold')};
  color: ${token.colors.text.strong};
`;

export const ToolRow = styled.div`
  ${token.flexRow};
  align-items: center;
  gap: 10px;
`;

export const ViewToggle = styled.button<{ $active: boolean }>`
  padding: 6px 14px;
  border-radius: ${token.shapes.xsmall};
  ${token.typography('caption', 'lg', 'medium')};
  color: ${token.colors.text.neutral};
  background-color: ${token.colors.fill.normal};
  transition: all 0.15s;

  ${({ $active }) =>
    $active &&
    css`
      background-color: ${token.colors.accent.primary};
      color: ${token.colors.text.strong};
      font-weight: 600;
    `}
`;

export const FilterSelect = styled.select`
  padding: 6px 12px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.xsmall};
  ${token.typography('caption', 'lg', 'medium')};
  color: ${token.colors.text.normal};
  outline: none;
  background-color: ${token.colors.background.white};
`;

export const AddButton = styled.button`
  padding: 8px 16px;
  border-radius: ${token.shapes.xsmall};
  ${token.typography('body', 'sm', 'semibold')};
  color: ${token.colors.text.strong};
  background-color: ${token.colors.accent.primary};
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.85;
  }
`;

/* ── 칸반 보드 ──────────────────────────── */

export const BoardWrapper = styled.div`
  ${token.flexRow};
  gap: 16px;
  flex: 1;
  overflow-x: auto;
  padding-bottom: 8px;
`;

export const Column = styled.div`
  min-width: 280px;
  width: 280px;
  ${token.flexColumn};
  gap: 10px;
  flex-shrink: 0;
`;

export const ColumnHeader = styled.div<{ $color: string }>`
  ${token.flexRow};
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: ${token.shapes.xsmall};
  background-color: ${token.colors.background.white};
  border: 1px solid ${token.colors.line.normal};
  border-top: 3px solid ${({ $color }) => $color};
`;

export const ColumnTitle = styled.span`
  ${token.typography('body', 'sm', 'semibold')};
  color: ${token.colors.text.strong};
`;

export const ColumnCount = styled.span`
  ${token.typography('caption', 'md', 'medium')};
  color: ${token.colors.text.coolGray};
  margin-left: auto;
`;

export const ColumnBody = styled.div`
  ${token.flexColumn};
  gap: 8px;
  flex: 1;
  overflow-y: auto;
  padding: 4px 2px;
  min-height: 100px;
  border-radius: ${token.shapes.xsmall};
  transition: background-color 0.15s;
`;

export const ColumnAddButton = styled.button`
  width: 100%;
  padding: 8px;
  border: 1px dashed ${token.colors.line.normal};
  border-radius: ${token.shapes.xsmall};
  ${token.typography('caption', 'lg', 'medium')};
  color: ${token.colors.text.coolGray};
  transition: all 0.15s;

  &:hover {
    border-color: ${token.colors.accent.primary};
    color: ${token.colors.text.goldDark};
  }
`;

/* ── TASK 카드 ──────────────────────────── */

export const TaskCard = styled.div<{ $dragging?: boolean }>`
  background-color: ${token.colors.background.white};
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.xsmall};
  padding: 14px;
  cursor: grab;
  transition: all 0.15s;
  ${token.flexColumn};
  gap: 8px;
  user-select: none;

  &:hover {
    ${token.elevation('black_2')};
  }

  ${({ $dragging }) =>
    $dragging &&
    css`
      opacity: 0.5;
      ${token.elevation('black_3')};
    `}
`;

export const TaskTitle = styled.span`
  ${token.typography('body', 'sm', 'medium')};
  color: ${token.colors.text.strong};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const TaskMeta = styled.div`
  ${token.flexRow};
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

export const PriorityBadge = styled.span<{ $priority: string }>`
  padding: 2px 8px;
  border-radius: 4px;
  ${token.typography('caption', 'sm', 'semibold')};

  ${({ $priority }) => {
    switch ($priority) {
      case 'CRITICAL':
        return css`
          background-color: #fde8e8;
          color: ${token.colors.state.error};
        `;
      case 'HIGH':
        return css`
          background-color: #fff3cd;
          color: #d49200;
        `;
      case 'MEDIUM':
        return css`
          background-color: #d1ecf1;
          color: #0c5460;
        `;
      default:
        return css`
          background-color: ${token.colors.fill.normal};
          color: ${token.colors.text.coolGray};
        `;
    }
  }}
`;

export const LabelTag = styled.span`
  padding: 2px 8px;
  border-radius: 4px;
  ${token.typography('caption', 'sm', 'medium')};
  background-color: ${token.colors.accent.secondary4};
  color: ${token.colors.text.goldDark};
`;

export const TaskFooter = styled.div`
  ${token.flexRow};
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
`;

export const AssigneeAvatars = styled.div`
  ${token.flexRow};
  align-items: center;

  img {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 1.5px solid ${token.colors.background.white};
    margin-left: -6px;
    object-fit: cover;
    background-color: ${token.colors.fill.normal};

    &:first-child {
      margin-left: 0;
    }
  }
`;

export const DueDate = styled.span<{ $overdue?: boolean }>`
  ${token.typography('caption', 'sm', 'medium')};
  color: ${({ $overdue }) => ($overdue ? token.colors.state.error : token.colors.text.coolGray)};
`;

/* ── 리스트 뷰 ──────────────────────────── */

export const ListView = styled.div`
  ${token.flexColumn};
  gap: 16px;
  flex: 1;
  overflow-y: auto;
`;

export const ListGroup = styled.div`
  ${token.flexColumn};
  gap: 8px;
`;

export const ListGroupTitle = styled.h3`
  ${token.typography('body', 'sm', 'semibold')};
  color: ${token.colors.text.strong};
  padding: 8px 0;
  border-bottom: 1px solid ${token.colors.line.normal};
`;

export const ListRow = styled.div`
  ${token.flexRow};
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background-color: ${token.colors.background.white};
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.xsmall};
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background-color: ${token.colors.fill.normal};
  }
`;

export const ListTitle = styled.span`
  ${token.typography('body', 'sm', 'medium')};
  color: ${token.colors.text.normal};
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ListStatus = styled.span`
  ${token.typography('caption', 'md', 'medium')};
  color: ${token.colors.text.coolGray};
  min-width: 90px;
  text-align: center;
`;

export const ListDue = styled.span`
  ${token.typography('caption', 'md', 'regular')};
  color: ${token.colors.text.coolGray};
  min-width: 80px;
  text-align: right;
`;

/* ── TASK 사이드 패널 ───────────────────── */

export const PanelOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 90;
`;

export const Panel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 480px;
  height: 100vh;
  background-color: ${token.colors.background.white};
  ${token.elevation('black_3')};
  z-index: 100;
  ${token.flexColumn};
  overflow-y: auto;
  animation: slideIn 0.2s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
`;

export const PanelHeader = styled.div`
  ${token.flexRow};
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${token.colors.line.normal};
  flex-shrink: 0;
`;

export const PanelTitle = styled.input`
  ${token.typography('body', 'lg', 'semibold')};
  color: ${token.colors.text.strong};
  border: none;
  outline: none;
  background: transparent;
  flex: 1;
  padding: 0;

  &::placeholder {
    color: ${token.colors.text.disabled};
  }
`;

export const PanelCloseButton = styled.button`
  ${token.flexCenter};
  width: 32px;
  height: 32px;
  border-radius: ${token.shapes.xsmall};
  color: ${token.colors.text.neutral};
  transition: background-color 0.15s;

  &:hover {
    background-color: ${token.colors.fill.normal};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const PanelBody = styled.div`
  padding: 20px 24px;
  ${token.flexColumn};
  gap: 20px;
  flex: 1;
  overflow-y: auto;
`;

export const PanelField = styled.div`
  ${token.flexColumn};
  gap: 6px;
`;

export const PanelFieldLabel = styled.label`
  ${token.typography('caption', 'md', 'semibold')};
  color: ${token.colors.text.coolGray};
  text-transform: uppercase;
`;

export const PanelSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.xsmall};
  ${token.typography('body', 'sm', 'regular')};
  color: ${token.colors.text.normal};
  outline: none;
  background-color: ${token.colors.background.white};
`;

export const PanelInput = styled.input`
  padding: 8px 12px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.xsmall};
  ${token.typography('body', 'sm', 'regular')};
  color: ${token.colors.text.normal};
  outline: none;

  &:focus {
    border-color: ${token.colors.accent.primary};
  }
`;

export const PanelTextarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.xsmall};
  ${token.typography('body', 'sm', 'regular')};
  color: ${token.colors.text.normal};
  outline: none;
  resize: vertical;
  min-height: 100px;

  &:focus {
    border-color: ${token.colors.accent.primary};
  }
`;

export const PanelFooter = styled.div`
  ${token.flexRow};
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid ${token.colors.line.normal};
  flex-shrink: 0;
`;

export const PanelDeleteButton = styled.button`
  padding: 8px 16px;
  border-radius: ${token.shapes.xsmall};
  ${token.typography('body', 'sm', 'medium')};
  color: ${token.colors.state.error};
  background-color: #fde8e8;
  margin-right: auto;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.85;
  }
`;

export const PanelSaveButton = styled.button`
  padding: 8px 16px;
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

export const PanelCancelButton = styled.button`
  padding: 8px 16px;
  border-radius: ${token.shapes.xsmall};
  ${token.typography('body', 'sm', 'medium')};
  color: ${token.colors.text.neutral};
  background-color: ${token.colors.fill.normal};
`;

export const SubTaskList = styled.div`
  ${token.flexColumn};
  gap: 6px;
`;

export const SubTaskItem = styled.label`
  ${token.flexRow};
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  cursor: pointer;

  input[type='checkbox'] {
    width: 16px;
    height: 16px;
    accent-color: ${token.colors.accent.primary};
  }

  span {
    ${token.typography('body', 'sm', 'regular')};
    color: ${token.colors.text.normal};
  }
`;

export const LabelsRow = styled.div`
  ${token.flexRow};
  gap: 6px;
  flex-wrap: wrap;
`;

export const LabelInput = styled.input`
  padding: 4px 8px;
  border: 1px dashed ${token.colors.line.normal};
  border-radius: 4px;
  ${token.typography('caption', 'sm', 'regular')};
  width: 100px;
  outline: none;

  &:focus {
    border-color: ${token.colors.accent.primary};
  }
`;

/* ── Empty ──────────────────────────────── */

export const EmptyState = styled.div`
  ${token.flexCenter};
  ${token.flexColumn};
  gap: 12px;
  padding: 60px 0;
  color: ${token.colors.text.coolGray};
  ${token.typography('body', 'md', 'medium')};
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
  padding: 32px;
  width: 480px;
  ${token.flexColumn};
  gap: 16px;
`;

export const ModalTitle = styled.h2`
  ${token.typography('heading', 'sm', 'bold')};
  color: ${token.colors.text.strong};
`;

export const ModalActions = styled.div`
  ${token.flexRow};
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
`;
