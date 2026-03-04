import React, { useEffect, useRef } from 'react';
import { CardContainer, DetailRow, DetailLabel, DetailValue } from './EventDetailCard.styled';
import type { EventDetailCardProps } from '@/types/fullCalendar';
import { getDateRange } from '@/utils/FormatDate';
import { formatAssignees } from '@/utils/FormatAssignee';
import { parsePostLinks } from '@/utils/ParsePostLink';

const EventDetailCard: React.FC<EventDetailCardProps> = ({ event, position, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!event) return null;

  return (
    <CardContainer 
      ref={cardRef}
      style={{ 
        top: `${position.y}px`, 
        left: `${position.x}px` 
      }}
    >
      <DetailRow>
        <DetailLabel>제목</DetailLabel>
        <DetailValue>{event.title}</DetailValue>
      </DetailRow>

      <DetailRow>
        <DetailLabel>날짜</DetailLabel>
        <DetailValue>{getDateRange(event.start, event.end)}</DetailValue>
      </DetailRow>

      <DetailRow>
        <DetailLabel>담당자</DetailLabel>
        <DetailValue>{formatAssignees(event.extendedProps?.assignees)}</DetailValue>
      </DetailRow>

      <DetailRow>
        <DetailLabel>설명</DetailLabel>
        <DetailValue>
          {parsePostLinks(event.extendedProps?.description || '')}
        </DetailValue>
      </DetailRow>
    </CardContainer>
  );
};

export default EventDetailCard;