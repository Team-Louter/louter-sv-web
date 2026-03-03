import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateSelectArg, EventClickArg, EventContentArg, EventInput } from '@fullcalendar/core';
import { FaFlag } from "react-icons/fa6";
import * as S from './Calendar.styled';
import type { CalendarProps } from '@/types/fullCalendar';
import EventDetailCard from './EventDetailCard';
import EventEditModal from '@/pages/Calendar/components/EventEditModal/EventEditModal';
import { getEvent } from '@/api/Event';
import { formatApiEvents, formatEvents } from '@/utils/formatEvent';

const Calendar: React.FC<CalendarProps> = ({readOnly = false}) => {
  const [selectedEvent, setSelectedEvent] = useState<EventInput | null>(null); // 선택된 일정
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 }); // 메인에서 일정 클릭 시 나오는 카드 위치
  const [isModalOpen, setIsModalOpen] = useState(false); // 일정 추가/편집 모달 출력 여부
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // 선택한 날짜칸 시작일
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null); // 선택한 날짜칸 종료일
  const [modalMode, setModalMode] = useState<string>(''); // 일정 추가 or 편집
  const [eventsInfo, setEventsInfo] = useState<EventInput[]>([]);
  const blockPopover = useRef(false); // 팝오버 차단 여부

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

  useEffect(() => {
    // 팝오버가 DOM에 추가될 때 차단 중이면 즉시 제거
    const observer = new MutationObserver(() => {
      if (blockPopover.current) {
        const popover = document.querySelector('.fc-popover');
        if (popover) {
          popover.remove();
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // 화면 크기 변경 시 팝오버 차단 시작
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

  // 날짜칸 선택 시
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    if (readOnly) return;

    // end는 exclusive이므로 하루 빼기
    const endDate = new Date(selectInfo.end);
    endDate.setDate(endDate.getDate() - 1);

    setSelectedDate(selectInfo.start);
    setSelectedEndDate(endDate);
    setSelectedEvent(null);
    setIsModalOpen(true);
    setModalMode('추가');
  };

  // 일정 선택 시
  const handleEventClick = (clickInfo: EventClickArg) => {
    // 팝오버 열려있으면 차단 후 닫기
    clickInfo.jsEvent.stopPropagation();
    blockPopover.current = true;

    setTimeout(() => {
      const popover = document.querySelector('.fc-popover');
      if (popover) {
        popover.remove();
      }
    }, 0);

    if (readOnly) {
      const rect = clickInfo.el.getBoundingClientRect();
      setCardPosition({
        x: rect.right + 10,
        y: rect.top
      });
      setSelectedEvent(formatApiEvents(clickInfo.event));
      return;
    }

    setSelectedDate(null);   
    setSelectedEndDate(null);
    setSelectedEvent(formatApiEvents(clickInfo.event));
    setIsModalOpen(true);
    setModalMode('편집');
  };

  // 일정 제목 앞에 아이콘 삽입
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
            // more 클릭 시 차단 해제 후 팝오버 열기
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