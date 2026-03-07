export const PROFILE_TABS = [
  '내가 쓴 글',
  '댓글 단 글',
  '좋아요한 글',
] as const;

export type ProfileTab = (typeof PROFILE_TABS)[number];

export const PROFILE_PAGE_SIZE = 5;

export const TAB_EMPTY_MESSAGES: Record<number, string> = {
  0: '작성한 게시글이 없습니다',
  1: '작성한 댓글이 없습니다',
  2: '좋아요한 게시글이 없습니다',
};
