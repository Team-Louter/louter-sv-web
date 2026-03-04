import styled from 'styled-components';
import * as token from '@/styles/values/token';

export const Container = styled.div`
  ${token.flexColumn};
  gap: 28px;
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

export const Actions = styled.div`
  ${token.flexRow};
  gap: 10px;
`;

export const ActionButton = styled.button`
  padding: 8px 16px;
  border-radius: ${token.shapes.xsmall};
  ${token.typography('caption', 'lg', 'medium')};
  color: ${token.colors.text.neutral};
  background-color: ${token.colors.fill.normal};
  transition: all 0.15s;

  &:hover {
    background-color: ${token.colors.fill.neutral};
  }
`;

export const DangerButton = styled(ActionButton)`
  color: ${token.colors.state.error};
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
`;

export const StatCard = styled.div`
  background-color: ${token.colors.background.white};
  border-radius: ${token.shapes.medium};
  border: 1px solid ${token.colors.line.normal};
  padding: 20px;
  ${token.flexColumn};
  gap: 4px;
`;

export const StatLabel = styled.span`
  ${token.typography('caption', 'md', 'medium')};
  color: ${token.colors.text.coolGray};
`;

export const StatValue = styled.span`
  ${token.typography('heading', 'md', 'bold')};
  color: ${token.colors.text.strong};
`;

export const Section = styled.section`
  ${token.flexColumn};
  gap: 16px;
`;

export const SectionTitle = styled.h2`
  ${token.typography('body', 'lg', 'semibold')};
  color: ${token.colors.text.strong};
`;

export const RecentList = styled.div`
  ${token.flexColumn};
  gap: 8px;
`;

export const RecentItem = styled.div`
  ${token.flexRow};
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: ${token.colors.background.white};
  border-radius: ${token.shapes.xsmall};
  border: 1px solid ${token.colors.line.normal};
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background-color: ${token.colors.fill.normal};
  }
`;

export const RecentIcon = styled.div`
  ${token.flexCenter};
  width: 32px;
  height: 32px;
  border-radius: ${token.shapes.xsmall};
  background-color: ${token.colors.accent.secondary4};
  color: ${token.colors.text.goldDark};
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const RecentInfo = styled.div`
  ${token.flexColumn};
  flex: 1;
  min-width: 0;
`;

export const RecentTitle = styled.span`
  ${token.typography('body', 'sm', 'medium')};
  color: ${token.colors.text.normal};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const RecentMeta = styled.span`
  ${token.typography('caption', 'sm', 'regular')};
  color: ${token.colors.text.coolGray};
`;

export const ProgressBarWrapper = styled.div`
  ${token.flexColumn};
  gap: 8px;
`;

export const ProgressLabel = styled.div`
  ${token.flexRow};
  justify-content: space-between;
  align-items: center;
`;

export const ProgressLabelText = styled.span`
  ${token.typography('body', 'sm', 'medium')};
  color: ${token.colors.text.normal};
`;

export const ProgressPct = styled.span`
  ${token.typography('body', 'sm', 'semibold')};
  color: ${token.colors.text.goldDark};
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${token.colors.fill.normal};
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ $pct: number }>`
  width: ${({ $pct }) => $pct}%;
  height: 100%;
  background-color: ${token.colors.accent.primary};
  border-radius: 4px;
  transition: width 0.4s ease;
`;

export const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

export const EmptyBox = styled.div`
  ${token.flexCenter};
  padding: 40px;
  color: ${token.colors.text.coolGray};
  ${token.typography('body', 'sm', 'medium')};
  background-color: ${token.colors.background.white};
  border-radius: ${token.shapes.xsmall};
  border: 1px solid ${token.colors.line.normal};
`;

/* 인라인 편집용 */
export const EditableTitle = styled.input`
  ${token.typography('heading', 'md', 'bold')};
  color: ${token.colors.text.strong};
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
  width: 100%;

  &:focus {
    border-bottom: 2px solid ${token.colors.accent.primary};
  }
`;

export const DescriptionArea = styled.textarea`
  width: 100%;
  padding: 16px;
  background-color: ${token.colors.background.white};
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.xsmall};
  ${token.typography('body', 'sm', 'regular')};
  color: ${token.colors.text.normal};
  resize: vertical;
  outline: none;
  min-height: 60px;

  &:focus {
    border-color: ${token.colors.accent.primary};
  }
`;

export const Description = styled.p`
  ${token.typography('body', 'sm', 'regular')};
  color: ${token.colors.text.neutral};
  background-color: ${token.colors.background.white};
  padding: 16px;
  border-radius: ${token.shapes.xsmall};
  border: 1px solid ${token.colors.line.normal};
  line-height: 1.6;
`;

export const MemberGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
`;

export const MemberCard = styled.div`
  ${token.flexRow};
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: ${token.colors.background.white};
  border-radius: ${token.shapes.xsmall};
  border: 1px solid ${token.colors.line.normal};
`;

export const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  background-color: ${token.colors.fill.normal};
`;

export const MemberInfo = styled.div`
  ${token.flexColumn};
`;

export const MemberName = styled.span`
  ${token.typography('body', 'sm', 'medium')};
  color: ${token.colors.text.normal};
`;

export const MemberRole = styled.span`
  ${token.typography('caption', 'sm', 'regular')};
  color: ${token.colors.text.coolGray};
`;
