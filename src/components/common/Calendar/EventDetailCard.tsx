import { CardContainer, DetailRow, DetailLabel, DetailValue } from './EventDetailCard.styled';
import { getDateRange } from '@/utils/FormatDate';
import { formatAssignees } from '@/utils/FormatAssignee';
import type { EventInput } from '@fullcalendar/core';
import { useState, useRef, useEffect } from 'react';

interface EventDetailCardProps {
  event: EventInput | null;
  position: { x: number; y: number };
  onClose: () => void;
}

const EventDetailCard: React.FC<EventDetailCardProps> = ({ event, position, onClose }) => {
  const [pos, setPos] = useState({ x: position.x, y: position.y });
  const cardRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setPos({ x: position.x, y: position.y });
  }, [position]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isDragging.current) return;
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragOffset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };

    const handleMouseMove = (e: MouseEvent) => {
      setPos({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  if (!event) return null;

  return (
    <CardContainer
      ref={cardRef}
      style={{
        top: `${pos.y}px`,
        left: `${pos.x}px`,
        cursor: 'grab',
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
    >
      <DetailRow>
        <DetailLabel>제목</DetailLabel>
        <DetailValue>{event.title}</DetailValue>
      </DetailRow>

      <DetailRow>
        <DetailLabel>날짜</DetailLabel>
        <DetailValue>
          {getDateRange(event.start ?? null, event.end ?? null)}
        </DetailValue>
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