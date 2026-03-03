import type { EventInput } from "@fullcalendar/core";

export const getLocalDateString = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\. /g, '-').replace(/\.$/, '');
};

export const getDateRange = (start: Date | string | null, end: Date | string | null): string => {
  const startDate = formatDate(start);
  
  if (!end) return `${startDate} ~ ${startDate}`;
  
  const endObj = typeof end === 'string' ? new Date(end) : new Date(end.getTime());

  endObj.setDate(endObj.getDate() - 1);
  
  const endDate = formatDate(endObj);
  
  return `${startDate} ~ ${endDate}`;
};

export const formatDateTime = (uploadTime: string): string => {
  if (!uploadTime) return '';
  const date = new Date(uploadTime);
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const yy  = String(kstDate.getUTCFullYear()).slice(2);
  const mm  = String(kstDate.getUTCMonth() + 1).padStart(2, '0');
  const dd  = String(kstDate.getUTCDate()).padStart(2, '0');
  const hh  = String(kstDate.getUTCHours()).padStart(2, '0');
  const min = String(kstDate.getUTCMinutes()).padStart(2, '0');
  return `${yy}.${mm}.${dd}. ${hh}:${min}`;
};

// 일정 시작 날짜 초기값 설정
export const getInitialStartDate = (event: EventInput | null, selectedDate: Date | null): string => {
  if (event?.start) return getLocalDateString(event.start);
  return selectedDate ? getLocalDateString(selectedDate) : getLocalDateString(new Date());
};

// 일정 종료 날짜 초기값 설정
export const getInitialEndDate = (event: EventInput | null, selectedDate: Date | null, selectedEndDate: Date | null): string => {
  if (event?.end) {
      const eventEndDate = new Date(event.end);
      eventEndDate.setDate(eventEndDate.getDate() - 1); 
      return getLocalDateString(eventEndDate);
  }
  if (selectedEndDate) return getLocalDateString(selectedEndDate);
  return selectedDate ? getLocalDateString(selectedDate) : getLocalDateString(new Date());
};