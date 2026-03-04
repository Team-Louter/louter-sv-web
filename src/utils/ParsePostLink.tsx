import React from 'react';
import type { EventInput } from '@fullcalendar/core';
import PostLinkChip from '@/components/common/Calendar/PostLinkChip';

/**
 * 텍스트에서 #숫자 패턴을 찾아 게시글 칩 컴포넌트로 변환합니다.
 * 아이콘 + 제목 + 게시판이름(회색) 형태로 표시됩니다.
 */
export const parsePostLinks = (
  text: string,
  event?: EventInput | null
): React.ReactNode[] => {
  if (!text) return ['-'];

  const parts = text.split(/(#\d+)/g);

  return parts.map((part, index) => {
    const match = part.match(/^#(\d+)$/);
    if (match) {
      const postId = match[1];
      return <PostLinkChip key={index} postId={postId} event={event} />;
    }
    return <span key={index}>{part}</span>;
  });
};
