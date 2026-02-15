import React, { useEffect, useRef } from 'react';
import type { EventApi } from '@fullcalendar/core';
import { CardContainer, DetailRow, DetailLabel, DetailValue } from './EventDetailCard.styled';

interface EventDetailCardProps {
  event: EventApi | null;
  position: { x: number; y: number };
  onClose: () => void;
}

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

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\. /g, '-').replace(/\.$/, '');
  };

  const getDateRange = () => {
    const startDate = formatDate(event.start);
    const endDate = event.end ? formatDate(new Date(event.end.getTime() - 1)) : startDate;
    
    return `${startDate} ~ ${endDate}`;
  };

  const formatAssignees = (assignees?: string[]) => {
    if (!assignees || assignees.length === 0) return '-';
    if (assignees.length === 1) return assignees[0];
    return `${assignees[0]} 외 ${assignees.length - 1}명`;
  };

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
        <DetailValue>{getDateRange()}</DetailValue>
      </DetailRow>

      <DetailRow>
        <DetailLabel>담당자</DetailLabel>
        <DetailValue>{formatAssignees(event.extendedProps?.assignees)}</DetailValue>
      </DetailRow>

      <DetailRow>
        <DetailLabel>설명</DetailLabel>
        <DetailValue>{event.extendedProps?.description || '-'}</DetailValue>
      </DetailRow>
    </CardContainer>
  );
};

export default EventDetailCard;