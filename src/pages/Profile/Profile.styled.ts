import styled from 'styled-components';
import * as token from '@/styles/values/token';

export const PageWrapper = styled.div`
  ${token.flexColumn}
  min-height: 100vh;
  background-color: ${token.colors.fill.white};
  padding: 40px 0 80px;
`;

export const Inner = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
  ${token.flexColumn}
  gap: 24px;
`;

export const PageTitle = styled.h1`
  ${token.typography('heading', 'lg', 'bold')}
  color: ${token.colors.text.strong};
  text-align: center;
  margin: 0 0 8px;
`;

/* ─── 단일 카드 ─── */
export const Card = styled.div`
  background-color: ${token.colors.main.white};
  border-radius: ${token.shapes.medium};
  border: 0.5px solid ${token.colors.line.light};
  ${token.elevation('black_1')}
  height: 100%;
  overflow: hidden;
`;

/* ─── 카드 상단: 프로필 + 통계 + 버튼 ─── */
export const CardTop = styled.div`
  ${token.flexRow}
  align-items: flex-start;
  padding: 36px 40px;
`;

export const ProfileGroup = styled.div`
  ${token.flexRow}
  align-items: flex-start;
  gap: 20px;
  flex-shrink: 0;
`;

export const ProfileImageWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  background-color: ${token.colors.fill.f3};
  border: 3px solid ${token.colors.main.yellow};
  flex-shrink: 0;
`;

export const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ProfileImageFallback = styled.div`
  width: 100%;
  height: 100%;
  ${token.flexCenter}
  background-color: ${token.colors.accent.secondary3};
  ${token.typography('heading', 'md', 'bold')}
  color: ${token.colors.text.dark};
`;

export const ProfileInfo = styled.div`
  ${token.flexColumn}
  gap: 6px;
  padding-top: 4px;
`;

export const ProfileName = styled.span`
  ${token.typography('heading', 'sm', 'bold')}
  color: ${token.colors.text.strong};
`;

export const ProfileSubInfo = styled.span`
  ${token.typography('body', 'sm', 'regular')}
  color: ${token.colors.text.neutral};
`;

export const EditButton = styled.button`
  margin-top: 4px;
  padding: 5px 14px;
  border-radius: ${token.shapes.xsmall};
  border: 1px solid ${token.colors.line.normal};
  background-color: ${token.colors.main.white};
  ${token.typography('body', 'sm', 'medium')}
  color: ${token.colors.text.neutral};
  cursor: pointer;
  white-space: nowrap;
  align-self: flex-start;
  transition: background-color 0.15s;

  &:hover {
    background-color: ${token.colors.fill.f3};
  }
`;

/* ─── 통계 ─── */
export const StatsGroup = styled.div`
  ${token.flexRow}
  gap: 40px;
  align-items: center;
  margin-left: 120px;
`;

export const StatItem = styled.div`
  ${token.flexColumn}
  align-items: center;
  gap: 4px;
`;

export const StatValue = styled.span`
  ${token.typography('heading', 'xl', 'bold')}
  color: ${token.colors.text.strong};
  line-height: 1;
`;

export const StatLabel = styled.span`
  ${token.typography('body', 'sm', 'regular')}
  color: ${token.colors.text.neutral};
  margin-top: 4px;
`;

/* ─── 우측 버튼 ─── */
export const ActionGroup = styled.div`
  ${token.flexRow}
  gap: 8px;
  flex-shrink: 0;
  margin-left: auto;
  align-self: flex-end;
  padding-bottom: 4px;
`;

export const ActionButton = styled.button<{ $danger?: boolean }>`
  padding: 7px 16px;
  border-radius: ${token.shapes.xsmall};
  border: 1px solid
    ${({ $danger }) => ($danger ? '#E53935' : token.colors.line.normal)};
  background-color: ${token.colors.main.white};
  ${token.typography('body', 'sm', 'medium')}
  color: ${({ $danger }) => ($danger ? '#E53935' : token.colors.text.neutral)};
  cursor: pointer;
  transition:
    background-color 0.15s,
    color 0.15s;

  &:hover {
    background-color: ${({ $danger }) =>
      $danger ? '#FFF0F0' : token.colors.fill.f3};
  }
`;

/* ─── 구분선 ─── */
export const Divider = styled.hr`
  margin: 0;
  border: none;
  border-top: 1px solid ${token.colors.line.normal};
`;

/* ─── 추가 정보 섹션 ─── */
export const InfoSection = styled.div`
  padding: 20px 36px;
  ${token.flexColumn}
  gap: 10px;
`;

export const InfoRow = styled.div`
  ${token.flexRow}
  align-items: center;
  gap: 0;
`;

export const InfoLabel = styled.span`
  ${token.typography('body', 'sm', 'regular')}
  color: ${token.colors.text.neutral};
  min-width: 130px;
`;

export const InfoValue = styled.span<{ $accent?: boolean }>`
  ${token.typography('body', 'sm', 'regular')}
  color: ${({ $accent }) =>
    $accent ? token.colors.text.gold : token.colors.text.dark};
  font-weight: ${({ $accent }) => ($accent ? 600 : 400)};
`;

/* ─── 탭 ─── */
export const TabBar = styled.div`
  ${token.flexRow}
  border-bottom: 1px solid ${token.colors.line.normal};
  padding: 0 16px;
`;

export const TabItem = styled.button<{ $active: boolean }>`
  padding: 14px 20px;
  border: none;
  border-bottom: 2px solid
    ${({ $active }) => ($active ? token.colors.main.yellow : 'transparent')};
  background: none;
  cursor: pointer;
  ${token.typography('body', 'md', 'medium')}
  color: ${({ $active }) =>
    $active ? token.colors.text.strong : token.colors.text.neutral};
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  transition:
    color 0.15s,
    border-color 0.15s;

  &:hover {
    color: ${token.colors.text.dark};
  }
`;

/* ─── 글 목록 ─── */
export const PostList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const PostItem = styled.li`
  ${token.flexRow}
  align-items: center;
  justify-content: space-between;
  padding: 15px 28px;
  border-bottom: 1px solid ${token.colors.line.normal};
  cursor: pointer;
  transition: background-color 0.15s;
  gap: 16px;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${token.colors.fill.f5};
  }
`;

export const PostLeft = styled.div`
  ${token.flexRow}
  align-items: center;
  gap: 10px;
  flex: 1;
  overflow: hidden;
`;

export const CategoryBadge = styled.span`
  ${token.typography('caption', 'md', 'medium')}
  color: ${token.colors.text.goldDark};
  background-color: ${token.colors.accent.assistive4};
  padding: 2px 10px;
  border-radius: 50px;
  white-space: nowrap;
  flex-shrink: 0;
`;

export const PostTitle = styled.span`
  ${token.typography('body', 'sm', 'regular')}
  color: ${token.colors.text.dark};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
`;

export const PostMeta = styled.div`
  ${token.flexRow}
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

export const MetaItem = styled.span<{ $red?: boolean }>`
  ${token.typography('caption', 'md', 'regular')}
  color: ${({ $red }) => ($red ? '#E53935' : token.colors.text.lightGray)};
  ${token.flexRow}
  align-items: center;
  gap: 3px;
`;

export const EmptyMessage = styled.div`
  ${token.flexCenter}
  padding: 60px 0;
  ${token.typography('body', 'md', 'regular')}
  color: ${token.colors.text.lightGray};
`;
