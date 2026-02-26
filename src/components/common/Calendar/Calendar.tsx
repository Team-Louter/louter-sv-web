import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateSelectArg, EventClickArg, EventApi, EventContentArg, EventInput } from '@fullcalendar/core';
import { FaFlag } from "react-icons/fa6";
import * as S from './Calendar.styled';
import type { CalendarProps } from '@/types/fullCalendar';
import EventDetailCard from './EventDetailCard';
import EventEditModal from '@/pages/Calendar/components/EventEditModal/EventEditModal';
import { getEvent } from '@/api/Event';
import { formatEvents } from '@/utils/FormatDate';

const Calendar: React.FC<CalendarProps> = ({readOnly = false}) => {
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null); // 선택된 일정
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 }); // 메인에서 일정 클릭 시 나오는 카드 위치
  const [isModalOpen, setIsModalOpen] = useState(false); // 일정 추가/편집 모달 출력 여부
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // 선택한 날짜칸
  const [modalMode, setModalMode] = useState<string>(''); // 일정 추가 or 편집
  const [eventsInfo, setEventsInfo] = useState<EventInput[]>([]);

  const getEventInfo = async () => {
    try {
      const data = await getEvent();
      setEventsInfo(formatEvents(data));
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // 모달 출력 시 뒷배경 스크롤 잠금
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
    getEventInfo();
  }, []);

  // 날짜칸 선택 시
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    if (readOnly) return;
    setSelectedDate(selectInfo.start);
    setSelectedEvent(null);
    setIsModalOpen(true);
    setModalMode('추가');
  };

  // 일정 선택 시
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

    setSelectedEvent(clickInfo.event);
    setIsModalOpen(true);
    setModalMode('편집');
  };

  // 일정 제목 앞에 아이콘 삽입
  const renderEventContent = (eventInfo: EventContentArg) => {
    return (
      <S.EventContentWrapper>
        <FaFlag size={12} />
        <span>{eventInfo.event.title}</span>
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
          moreLinkClick="popover"
          weekends={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          locale="ko"
          height="100%"
          fixedWeekCount={true}
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
          setIsModalOpen={setIsModalOpen}
          modalMode={modalMode}
          event={selectedEvent}
        />
      )}
    </>
  );
};

export default Calendar;