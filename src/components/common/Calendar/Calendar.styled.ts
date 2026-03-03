import * as token from '@/styles/values/token';
import styled from 'styled-components';

export const CalendarWrapper = styled.div`
  width: 100%;
  height: 100%;
  ${token.flexColumn}
  
  .fc {
    font-family: ${token.fontFamily.system};
    border: 1px solid ${token.colors.line.light};
    border-radius: ${token.shapes.xsmall};
    ${token.elevation('black_2')}
    background: ${token.colors.fill.white};
    height: 100%;
    ${token.flexColumn}
  }

  /* 헤더 레이아웃 */
  .fc-header-toolbar.fc-toolbar {
    ${token.flexCenter}
    padding: 20px;
    flex-shrink: 0;
    margin: 0;
  }

  .fc-header-toolbar .fc-toolbar-chunk {
    display: flex;
    align-items: center;
  }

  .fc-header-toolbar .fc-toolbar-chunk:first-child,
  .fc-header-toolbar .fc-toolbar-chunk:last-child {
    flex-grow: 0;
  }

  .fc-header-toolbar .fc-toolbar-chunk:nth-child(2) {
    flex-grow: 0;
    display: flex;
    align-items: center;
  }

  .fc-header-toolbar .fc-prev-button {
    margin-right: 15px;
  }

  .fc-header-toolbar .fc-next-button {
    margin-left: 15px;
  }

  .fc-header-toolbar .fc-toolbar-title {
    ${token.typography("heading", "sm", "medium")}
    color: ${token.colors.text.normal};
    margin: 0;
    padding: 0;
  }

  .fc .fc-button {
    background: none;
    border: none;
    color: ${token.colors.fill.a0};
    font-size: ${token.fontSize.heading.sm};
    padding: 0.4em 0.5em;
    box-shadow: none;
  }

  .fc .fc-button:hover {
    background: none;
    color: ${token.colors.text.normal};
  }

  .fc .fc-button:focus {
    box-shadow: none;
  }

  /* 뷰 컨테이너 */
  .fc-view-harness {
    flex: 1;
    ${token.flexCenter}
  }

  /* 요일 헤더 */
  .fc .fc-col-header-cell {
    padding: 10px 0 10px 10px;
    ${token.typography("caption", "md", "semibold")};
    color: ${token.colors.text.lightGray};
    background: ${token.colors.background.white};
    border: none;
    border-radius: ${token.shapes.xsmall};
    text-align: left;
  }
  
  .fc .fc-col-header-cell-cushion {
    text-align: left;
  }

  /* 그리드 */
  .fc .fc-scrollgrid {
    border: 1px solid ${token.colors.line.light};
    border-radius: ${token.shapes.xsmall};
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
    height: 90%;
  }

  .fc .fc-scrollgrid-section-body > td {
    border: none;
    height: 100%;
  }

  /* 날짜 셀 */
  .fc .fc-daygrid-day {
    background: ${token.colors.background.white};
    border: 1px solid ${token.colors.line.light};
  }

  .fc .fc-daygrid-day-frame {
    height: 100%;
    position: relative;
  }

  .fc .fc-daygrid-day-top {
    justify-content: flex-start;
    padding: 5px;
  }

  .fc .fc-daygrid-day-number {
    ${token.typography("caption", "sm", "regular")};
    padding: 8px;
    color: ${token.colors.calendar.black};
    position: absolute;
    top: 0;
    left: 0;
  }

  /* 일요일/토요일 */
  .fc .fc-day-sun .fc-daygrid-day-number {
    color: ${token.colors.calendar.red};
  }

  .fc .fc-day-sat .fc-daygrid-day-number {
    color: ${token.colors.calendar.blue};
  }

  /* 이벤트 */
  .fc .fc-daygrid-day-events {
    margin-top: 20px;
  }

  .fc .fc-event {
    ${token.typography("caption", "md", "semibold")};
    border: none;
    border-radius: 4px;
    padding: 2px 6px;
    margin: 2px 4px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .fc .fc-event:hover {
    background-color: rgb(252, 222, 25);
  }

  .fc .fc-event-main {
    color: ${token.colors.calendar.black};
  }

  /* 오늘 날짜 */
  .fc .fc-day-today {
    background-color: rgba(66, 153, 225, 0.05);
  }

  /* 날짜 셀 선택/드래그 하이라이트 */
  .fc .fc-highlight {
    background-color: rgba(66, 153, 225, 0.05);
  }

  /* 5개 행으로 고정 */
  .fc .fc-daygrid-body tr:nth-child(6) {
    display: none;
  }

  .fc .fc-daygrid-body tr {
    height: 20%;
  }

  /* +more 클릭 시 나오는 팝오버 */
  .fc .fc-popover {
    background: ${token.colors.fill.white} !important;
    border: 1px solid ${token.colors.line.light};
    border-radius: ${token.shapes.xsmall};
    ${token.elevation('black_2')}
  }

  .fc .fc-popover-body {
    background: ${token.colors.fill.white} !important;
  }
`;

export const EventContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
`;

export const EventLabel = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`