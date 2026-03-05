import { CardContainer, DetailRow, DetailLabel, DetailValue } from './EventDetailCard.styled';
import { getDateRange } from '@/utils/FormatDate';
import { formatAssignees } from '@/utils/FormatAssignee';
import type { EventInput } from '@fullcalendar/core';
import { useClickOutside } from '@/hooks/useClickOutside';

interface EventDetailCardProps {
  event: EventInput | null;
  position: { x: number; y: number };
  onClose: () => void;
}

const EventDetailCard: React.FC<EventDetailCardProps> = ({ event, position, onClose }) => {
  const cardRef = useClickOutside(onClose);

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