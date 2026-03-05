import styled from 'styled-components';
import * as token from '@/styles/values/token';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 80rem;
  background-color: ${token.colors.main.white};
  overflow-y: auto;
`;

export const PageWrapper = styled.div`
  ${token.flexColumn}
  /* min-height: 100vh; */
  background-color: ${token.colors.fill.white};
  padding: 60px 0 80px;
`;

export const Inner = styled.div`
  width: 100%;
  max-width: 1300px;
  /* height: 100%; */
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
  ${token.elevation('black_2')}
  height: 100%;
  padding: 16px 0;
  overflow: hidden;
  zoom: 0.9;
`;

/* ─── 카드 상단: 프로필 + 통계 + 버튼 ─── */
export const CardTop = styled.div`
  ${token.flexRow}
  align-items: center;
  padding: 48px 64px 32px;
`;

export const ProfileGroup = styled.div`
  ${token.flexRow}
  align-items: center;
  gap: 24px;
  flex-shrink: 0;
`;

export const ProfileImageWrapper = styled.div`
  width: 116px;
  height: 116px;
  border-radius: 50%;
  overflow: hidden;
  background-color: ${token.colors.fill.white};
  border: 4px solid ${token.colors.fill.white};
  ${token.elevation('black_2')}
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
  background-color: ${token.colors.fill.white};
  ${token.typography('heading', 'md', 'bold')}
  color: ${token.colors.text.dark};
`;

export const ProfileInfo = styled.div`
  ${token.flexColumn}
  gap: 8px;
`;

export const ProfileName = styled.span`
  ${token.typography('heading', 'lg', 'bold')}
  color: ${token.colors.text.dark};
  line-height: 1;
`;

export const ProfileSubInfo = styled.span`
  ${token.typography('body', 'sm', 'medium')}
  color: ${token.colors.text.dark};
`;

export const EditButton = styled.button`
  padding: 5px 14px;
  border-radius: 4px;
  border: 1px solid ${token.colors.text.lightGray};
  background-color: ${token.colors.main.white};
  ${token.typography('body', 'sm', 'bold')}
  color: ${token.colors.text.dark};
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
  margin-left: 112px;
`;

export const StatItem = styled.div`
  ${token.flexColumn}
  align-items: left;
  gap: 4px;
`;

export const StatValue = styled.span`
  ${token.typography('heading', 'md', 'bold')}
  color: ${token.colors.text.dark};
  line-height: 1;
`;

export const StatLabel = styled.span`
  ${token.typography('body', 'sm', 'medium')}
  color: ${token.colors.text.dark};
  margin-top: 8px;
  min-width: 80px;
`;

/* ─── 우측 버튼 ─── */
export const ActionGroup = styled.div`
  ${token.flexColumn}
  gap: 12px;
  flex-shrink: 0;
  margin-left: auto;
  align-self: flex-end;
  padding-bottom: 4px;
  align-items: flex-end;
`;

export const SocialRow = styled.div`
  ${token.flexRow}
  gap: 12px;
  align-items: center;
`;

export const SocialLink = styled.a`
  ${token.flexRow}
  align-items: center;
  gap: 4px;
  ${token.typography('body', 'sm', 'semibold')}
  color: ${token.colors.fill.slate};
  text-decoration: none;
  transition: color 0.15s;

  &:hover {
    color: ${token.colors.text.dark};
  }
`;

export const ButtonRow = styled.div`
  ${token.flexRow}
  gap: 8px;
`;

export const ActionButton = styled.button<{
  $danger?: boolean;
  $variant?: 'admin' | 'mentor';
}>`
  padding: 6px 18px;
  border-radius: 4px;
  border: ${({ $variant }) =>
    $variant === 'admin'
      ? 'none'
      : $variant === 'mentor'
        ? 'none'
        : `1px solid ${token.colors.line.normal}`};
  background-color: ${({ $variant }) =>
    $variant === 'admin'
      ? '#2D2D2D'
      : $variant === 'mentor'
        ? token.colors.main.yellow
        : token.colors.main.white};
  ${token.typography('body', 'sm', 'bold')}
  color: ${({ $danger, $variant }) =>
    $variant === 'admin'
      ? token.colors.main.yellow
      : $variant === 'mentor'
        ? token.colors.text.dark
        : $danger
          ? token.colors.calendar.red
          : token.colors.text.neutral};
  cursor: pointer;
  transition:
    background-color 0.15s,
    color 0.15s;

  &:hover {
    background-color: ${({ $danger, $variant }) =>
      $variant === 'admin'
        ? '#1a1a1a'
        : $variant === 'mentor'
          ? token.colors.accent.secondary1
          : $danger
            ? '#FFF0F0'
            : token.colors.fill.f3};
  }
`;

/* ─── 구분선 ─── */
export const Divider = styled.hr`
  margin: 0;
  border: none;
  border: 1px solid ${token.colors.line.light};
  margin: 0 32px;
`;

/* ─── 추가 정보 섹션 ─── */
export const InfoSection = styled.div`
  padding: 32px 48px 64px;
  ${token.flexColumn}
  gap: 24px;
`;

export const InfoRow = styled.div`
  ${token.flexRow}
  align-items: center;
  gap: 0;
`;

export const InfoLabel = styled.span`
  ${token.typography('body', 'lg', 'medium')}
  color: ${token.colors.text.dark};
  margin-right: 16px;
`;

export const InfoValue = styled.span<{ $accent?: boolean }>`
  ${token.typography('heading', 'sm', 'medium')}
  color: ${({ $accent }) =>
    $accent ? token.colors.text.gold : token.colors.text.coolGray};
  font-weight: ${({ $accent }) => ($accent ? 600 : 400)};
`;

export const InfoLink = styled.a`
  ${token.flexRow}
  align-items: center;
  gap: 8px;
  ${token.typography('body', 'lg', 'medium')}
  color: ${token.colors.text.coolGray};
  text-decoration: none;
  transition: color 0.15s;

  &:hover {
    color: ${token.colors.text.dark};
  }
`;

/* ─── 탭 ─── */
export const TabBar = styled.div`
  ${token.flexRow}
  border-bottom: 3px solid ${token.colors.line.light};
  margin: 0 32px;
`;

export const TabItem = styled.button<{ $active: boolean }>`
  position: relative;
  padding: 16px 32px;
  border: none;
  border-bottom: none;
  background: none;
  cursor: pointer;
  ${token.typography('body', 'md', 'medium')}
  color: ${({ $active }) =>
    $active ? token.colors.text.strong : token.colors.text.neutral};
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  transition: color 0.15s;

  &:hover {
    color: ${token.colors.text.dark};
  }
`;

export const TabIndicator = styled.div<{ $active: boolean }>`
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: ${({ $active }) =>
    $active ? token.colors.main.yellow : 'transparent'};
  border-radius: 2px 2px 0 0;
  transition: background-color 0.15s;
`;

/* ─── 글 목록 ─── */
export const TabContent = styled.div`
  height: 300px;
  padding: 8px 32px 32px;
  ${token.flexColumn}
  justify-content: flex-start;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

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
  gap: 20px;
  flex-shrink: 0;
`;

export const MetaItem = styled.span<{ $red?: boolean; $yellow?: boolean }>`
  ${token.typography('caption', 'lg', 'medium')}
  color: ${({ $red, $yellow }) =>
    $red
      ? '#E53935'
      : $yellow
        ? token.colors.main.yellow
        : token.colors.text.lightGray};
  ${token.flexRow}
  align-items: center;
  gap: 3px;
`;

export const CommentContent = styled.p`
  ${token.typography('caption', 'md', 'regular')}
  color: ${token.colors.text.coolGray};
  margin: 4px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const EmptyMessage = styled.div`
  flex: 1;
  ${token.flexCenter}
  padding: 60px 0;
  ${token.typography('body', 'md', 'medium')}
  color: ${token.colors.text.coolGray};
`;
