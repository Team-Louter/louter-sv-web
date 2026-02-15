import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import { CalendarWrapper } from './Calendar.styled';
import { dummyEvents } from '../../../constants/dummy';
import type { CalendarProps } from '@/types/fullCalendar';
import EventDetailCard from './EventDetailCard';

const Calendar: React.FC<CalendarProps> = ({readOnly = false}) => {
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    if (readOnly) return;

    const title = prompt('이벤트 제목을 입력하세요:');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (readOnly) {
      const rect = clickInfo.el.getBoundingClientRect();
      setCardPosition({
        x: rect.right + 10,
        y: rect.top
      });
      setSelectedEvent(clickInfo.event);
      return;
    }

    if (confirm(`'${clickInfo.event.title}' 이벤트를 삭제하시겠습니까?`)) {
      clickInfo.event.remove();
    }
  };

  return (
    <>
      <CalendarWrapper>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev',
            center: 'title',
            right: 'next'
          }}
          events={dummyEvents}
          editable={!readOnly}
          selectable={!readOnly}
          selectMirror={true}
          dayMaxEvents={true}
          moreLinkClick="popover"
          weekends={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          locale="ko"
          height="100%"
          fixedWeekCount={true}
        />
      </CalendarWrapper>

      {readOnly && selectedEvent && (
        <EventDetailCard 
          event={selectedEvent}
          position={cardPosition}
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </>
  );
};

export default Calendar;