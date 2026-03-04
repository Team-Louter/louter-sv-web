import React from 'react';
import { Link } from 'react-router-dom';
import type { EventInput } from '@fullcalendar/core';

/**
 * 텍스트에서 #숫자 패턴을 찾아 커뮤니티 게시글 링크로 변환합니다.
 * 예: "관련 게시글 #42 참고" → "관련 게시글 <Link to="/community/42">#42</Link> 참고"
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
      return (
        <Link
          key={index}
          to={`/community/${postId}`}
          state={event ? { linkedEvent: {
            title: event.title,
            start: event.start,
            end: event.end,
            color: event.color,
            scheduleId: event.scheduleId,
            description: event.extendedProps?.description,
            assignees: event.extendedProps?.assignees,
          }} : undefined}
          style={{
            color: '#FFBB00',
            textDecoration: 'none',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          #{postId}
        </Link>
      );
    }
    return <span key={index}>{part}</span>;
  });
};
