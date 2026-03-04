import styled from 'styled-components';
import * as token from '@/styles/values/token';

export const Container = styled.div`
  ${token.flexColumn};
  gap: 24px;
`;

export const Header = styled.div`
  ${token.flexRow};
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.h1`
  ${token.typography('heading', 'sm', 'bold')};
  color: ${token.colors.text.strong};
`;

export const TabRow = styled.div`
  ${token.flexRow};
  gap: 8px;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  padding: 8px 18px;
  border-radius: ${token.shapes.xsmall};
  ${token.typography('body', 'sm', 'medium')};
  transition: all 0.15s;

  ${({ $active }) =>
    $active
      ? `
    background-color: ${token.colors.accent.primary};
    color: ${token.colors.text.strong};
    font-weight: 600;
  `
      : `
    background-color: ${token.colors.fill.normal};
    color: ${token.colors.text.neutral};
  `}
`;

export const ActionButton = styled.button`
  padding: 8px 16px;
  border-radius: ${token.shapes.xsmall};
  ${token.typography('body', 'sm', 'semibold')};
  background-color: ${token.colors.accent.primary};
  color: ${token.colors.text.strong};
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.85;
  }
`;

/* ── 개요 탭 ───────────────────────────── */

export const OverviewSection = styled.div`
  ${token.flexColumn};
  gap: 20px;
`;

export const ProgressCard = styled.div`
  background-color: ${token.colors.background.white};
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.medium};
  padding: 24px;
  ${token.flexColumn};
  gap: 12px;
`;

export const ProgressTitle = styled.span`
  ${token.typography('body', 'md', 'semibold')};
  color: ${token.colors.text.strong};
`;

export const ProgressBarRow = styled.div`
  ${token.flexRow};
  align-items: center;
  gap: 12px;
`;

export const ProgressTrack = styled.div`
  flex: 1;
  height: 12px;
  background-color: ${token.colors.fill.normal};
  border-radius: 6px;
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ $pct: number; $color?: string }>`
  width: ${({ $pct }) => $pct}%;
  height: 100%;
  background-color: ${({ $color }) => $color || token.colors.accent.primary};
  border-radius: 6px;
  transition: width 0.4s ease;
`;

export const ProgressPct = styled.span`
  ${token.typography('body', 'sm', 'bold')};
  color: ${token.colors.text.goldDark};
  min-width: 42px;
  text-align: right;
`;

export const EpicList = styled.div`
  ${token.flexColumn};
  gap: 12px;
`;

export const EpicRow = styled.div`
  ${token.flexColumn};
  gap: 6px;
  padding: 16px;
  background-color: ${token.colors.background.white};
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.xsmall};
`;

export const EpicHeader = styled.div`
  ${token.flexRow};
  align-items: center;
  justify-content: space-between;
`;

export const EpicTitle = styled.span`
  ${token.typography('body', 'sm', 'semibold')};
  color: ${token.colors.text.strong};
`;

export const EpicMeta = styled.span`
  ${token.typography('caption', 'md', 'medium')};
  color: ${token.colors.text.coolGray};
`;

export const DoneTag = styled.span`
  ${token.typography('caption', 'sm', 'semibold')};
  color: ${token.colors.state.success};
  margin-left: 8px;
`;

/* ── 간트 차트 ─────────────────────────── */

export const GanttWrapper = styled.div`
  overflow-x: auto;
  background-color: ${token.colors.background.white};
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.medium};
`;

export const GanttTable = styled.div`
  min-width: 800px;
`;

export const GanttHeaderRow = styled.div`
  ${token.flexRow};
  border-bottom: 1px solid ${token.colors.line.normal};
`;

export const GanttLabelCol = styled.div`
  width: 200px;
  min-width: 200px;
  padding: 10px 16px;
  ${token.typography('caption', 'lg', 'semibold')};
  color: ${token.colors.text.strong};
  background-color: ${token.colors.fill.normal};
  border-right: 1px solid ${token.colors.line.normal};
`;

export const GanttTimelineHeader = styled.div`
  flex: 1;
  ${token.flexRow};
`;

export const GanttDayCell = styled.div<{ $isWeekend?: boolean }>`
  flex: 1;
  min-width: 32px;
  padding: 6px 2px;
  text-align: center;
  ${token.typography('caption', 'sm', 'medium')};
  color: ${token.colors.text.coolGray};
  background-color: ${({ $isWeekend }) =>
    $isWeekend ? token.colors.fill.normal : 'transparent'};
  border-right: 1px solid ${token.colors.line.neutral};
`;

export const GanttRow = styled.div`
  ${token.flexRow};
  border-bottom: 1px solid ${token.colors.line.neutral};
  min-height: 36px;

  &:hover {
    background-color: ${token.colors.fill.normal};
  }
`;

export const GanttRowLabel = styled.div<{ $indent?: number }>`
  width: 200px;
  min-width: 200px;
  padding: 8px 16px 8px ${({ $indent }) => 16 + ($indent ?? 0) * 12}px;
  ${token.typography('caption', 'lg', 'regular')};
  color: ${token.colors.text.normal};
  border-right: 1px solid ${token.colors.line.normal};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const GanttTimeline = styled.div`
  flex: 1;
  position: relative;
  ${token.flexRow};
`;

export const GanttBar = styled.div<{
  $left: number;
  $width: number;
  $color: string;
  $done?: boolean;
}>`
  position: absolute;
  top: 6px;
  left: ${({ $left }) => $left}%;
  width: ${({ $width }) => $width}%;
  height: 22px;
  background-color: ${({ $color, $done }) => ($done ? token.colors.state.success : $color)};
  border-radius: 4px;
  opacity: ${({ $done }) => ($done ? 0.7 : 1)};
  min-width: 6px;
`;

export const GanttDayBg = styled.div<{ $isWeekend?: boolean }>`
  flex: 1;
  min-width: 32px;
  border-right: 1px solid ${token.colors.line.neutral};
  background-color: ${({ $isWeekend }) =>
    $isWeekend ? 'rgba(0,0,0,0.02)' : 'transparent'};
`;

/* ── 번다운 차트 ───────────────────────── */

export const ChartCard = styled.div`
  background-color: ${token.colors.background.white};
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.medium};
  padding: 24px;
  ${token.flexColumn};
  gap: 16px;
`;

export const ChartTitle = styled.span`
  ${token.typography('body', 'md', 'semibold')};
  color: ${token.colors.text.strong};
`;

export const ChartSvg = styled.svg`
  width: 100%;
  height: 260px;

  .ideal-line {
    stroke: ${token.colors.text.coolGray};
    stroke-dasharray: 6, 4;
    stroke-width: 1.5;
  }

  .actual-line {
    stroke: ${token.colors.accent.primary};
    stroke-width: 2;
  }

  .axis-label {
    ${token.typography('caption', 'sm', 'regular')};
    fill: ${token.colors.text.coolGray};
  }

  .grid-line {
    stroke: ${token.colors.line.neutral};
    stroke-width: 0.5;
  }
`;

/* ── 팀원별 기여도 ─────────────────────── */

export const StatsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${token.colors.background.white};
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.medium};
  overflow: hidden;

  th, td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid ${token.colors.line.neutral};
  }

  th {
    ${token.typography('caption', 'lg', 'semibold')};
    color: ${token.colors.text.coolGray};
    background-color: ${token.colors.fill.normal};
  }

  td {
    ${token.typography('body', 'sm', 'regular')};
    color: ${token.colors.text.normal};
  }
`;

export const SmallBar = styled.div`
  ${token.flexRow};
  align-items: center;
  gap: 8px;
`;

export const SmallTrack = styled.div`
  flex: 1;
  height: 6px;
  background-color: ${token.colors.fill.normal};
  border-radius: 3px;
  overflow: hidden;
`;

export const SmallFill = styled.div<{ $pct: number }>`
  width: ${({ $pct }) => $pct}%;
  height: 100%;
  background-color: ${token.colors.accent.primary};
  border-radius: 3px;
`;

export const SmallPct = styled.span`
  ${token.typography('caption', 'md', 'semibold')};
  color: ${token.colors.text.goldDark};
  min-width: 36px;
  text-align: right;
`;

/* ── 공통 ──────────────────────────────── */

export const EmptyState = styled.div`
  ${token.flexCenter};
  padding: 60px;
  color: ${token.colors.text.coolGray};
  ${token.typography('body', 'md', 'medium')};
`;

export const SectionTitle = styled.h2`
  ${token.typography('body', 'lg', 'semibold')};
  color: ${token.colors.text.strong};
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
  width: 440px;
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

export const ModalSelect = styled.select`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.xsmall};
  ${token.typography('body', 'sm', 'regular')};
  color: ${token.colors.text.normal};
  outline: none;
  background-color: ${token.colors.background.white};
`;

export const ModalActions = styled.div`
  ${token.flexRow};
  justify-content: flex-end;
  gap: 10px;
`;

export const CancelButton = styled.button`
  padding: 8px 16px;
  border-radius: ${token.shapes.xsmall};
  ${token.typography('body', 'sm', 'medium')};
  color: ${token.colors.text.neutral};
  background-color: ${token.colors.fill.normal};
`;

export const FieldLabel = styled.label`
  ${token.typography('caption', 'md', 'semibold')};
  color: ${token.colors.text.coolGray};
`;

export const FormField = styled.div`
  ${token.flexColumn};
  gap: 4px;
`;
