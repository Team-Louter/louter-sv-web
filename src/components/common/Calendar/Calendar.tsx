import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateSelectArg, EventClickArg, EventContentArg, EventInput } from '@fullcalendar/core';
import { FaFlag } from "react-icons/fa6";
import * as S from './Calendar.styled';
import EventDetailCard from './EventDetailCard';
import EventEditModal from '@/pages/Calendar/components/EventEditModal/EventEditModal';
import { formatApiEvents } from '@/utils/formatEvent';
import { useEvent } from '@/hooks/useEvent';

type CalendarProps = {
  readOnly?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({readOnly = false}) => {
  const [selectedEvent, setSelectedEvent] = useState<EventInput | null>(null);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [modalMode, setModalMode] = useState<string>('');
  const blockPopover = useRef(false);

  const { eventsInfo, setEventsInfo } = useEvent();

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (blockPopover.current) {
        const popover = document.querySelector('.fc-popover');
        if (popover) popover.remove();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const popover = document.querySelector('.fc-popover');
      if (popover) {
        blockPopover.current = true;
        popover.remove();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    if (readOnly) return;

    const endDate = new Date(selectInfo.end);
    endDate.setDate(endDate.getDate() - 1);

    setSelectedDate(selectInfo.start);
    setSelectedEndDate(endDate);
    setSelectedEvent(null);
    setIsModalOpen(true);
    setModalMode('추가');
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    clickInfo.jsEvent.stopPropagation();
    blockPopover.current = true;

    setTimeout(() => {
      const popover = document.querySelector('.fc-popover');
      if (popover) popover.remove();
    }, 0);

    if (readOnly) {
      const rect = clickInfo.el.getBoundingClientRect();
      setCardPosition({ x: rect.right + 10, y: rect.top });
      setSelectedEvent(formatApiEvents(clickInfo.event));
      return;
    }

    setSelectedDate(null);
    setSelectedEndDate(null);
    setSelectedEvent(formatApiEvents(clickInfo.event));
    setIsModalOpen(true);
    setModalMode('편집');
  };

  const renderEventContent = (eventInfo: EventContentArg) => {
    return (
      <S.EventContentWrapper>
        <FaFlag size={12} style={{flexShrink: 0}}/>
        <S.EventLabel>{eventInfo.event.title}</S.EventLabel>
      </S.EventContentWrapper>
    );
  };

  return (
    <>
      <S.CalendarWrapper>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev',
            center: 'title',
            right: 'next'
          }}
          events={eventsInfo}
          editable={!readOnly}
          selectable={!readOnly}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          locale="ko"
          height="100%"
          fixedWeekCount={true}
          moreLinkClick={() => {
            blockPopover.current = false;
            return 'popover';
          }}
          eventDidMount={(info) => {
            info.el.style.backgroundColor = info.event.backgroundColor || '';
            info.el.style.border = 'none';
          }}
        />
      </S.CalendarWrapper>

      {readOnly && selectedEvent && (
        <EventDetailCard
          event={selectedEvent}
          position={cardPosition}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {isModalOpen && (
        <EventEditModal
          selectedDate={selectedDate}
          selectedEndDate={selectedEndDate}
          setIsModalOpen={setIsModalOpen}
          modalMode={modalMode}
          event={selectedEvent}
          setEvents={setEventsInfo}
        />
      )}
    </>
  );
};

export default Calendar;