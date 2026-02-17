import { useState, useEffect } from "react";
import * as S from "./EventEditModal.styled";
import type { EventEditModalProps } from "@/types/fullCalendar";
import { getLocalDateString } from "@/utils/FormatDate";
import DateInputField from "./DateInputField";
import { TextAreaField, TextInputField } from "./TextInputField";
import { calendarHighlight } from "@/constants/CalendarHighlight";
import MemberDropdown from "./MemberDropdown";

export default function EventEditModal({ selectedDate, setIsModalOpen, modalMode, event }: EventEditModalProps) {
    // 초기값 계산 함수
    const getInitialStartDate = () => {
        if (event?.start) {
            return getLocalDateString(event.start);
        }
        return selectedDate ? getLocalDateString(selectedDate) : getLocalDateString(new Date());
    };

    const getInitialEndDate = () => {
        if (event?.end) {
            // FullCalendar의 end는 지정 시간 +1 이 되어있으므로 -1 처리
            const eventEndDate = new Date(event.end);
            eventEndDate.setDate(eventEndDate.getDate() - 1);
            return getLocalDateString(eventEndDate);
        }
        return selectedDate ? getLocalDateString(selectedDate) : getLocalDateString(new Date());
    };

    const [title, setTitle] = useState<string>(event?.title || ''); // 일정 제목
    const [content, setContent] = useState<string>(event?.extendedProps?.description || ''); // 일정 내용
    const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>(
        event?.extendedProps?.managerIds || []
    ); // 담당자 ID 배열
    const [startDate, setStartDate] = useState<string>(getInitialStartDate()); // 일정 시작 날짜
    const [endDate, setEndDate] = useState<string>(getInitialEndDate()); // 일정 종료 날짜
    const [dateError, setDateError] = useState<string>(''); // 종료 날짜가 시작 날짜보다 빠를 시 오류 메세지
    const [selectedColor, setSelectedColor] = useState<string>(
        event?.backgroundColor || calendarHighlight[2]
    ); // 선택된 색

    useEffect(() => {
        // 종료 날짜가 시작 날짜보다 빠른지 확인
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            if (end < start) {
                setDateError('종료 날짜는 시작 날짜보다 빠를 수 없습니다');
            } else {
                setDateError('');
            }
        }
    }, [startDate, endDate]);

    return (
        <S.Background>
            <S.Container>
                <S.ModalTitle>동아리 일정 {modalMode}하기</S.ModalTitle>
                
                <TextInputField
                    label="제목"
                    value={title}
                    onChange={setTitle}
                    placeholder="제목을 입력하세요."
                    showLetterCount={50}
                />

                <S.ForRow>
                    <S.Name>담당자 선택</S.Name>
                    <S.ForColumn>
                        <MemberDropdown
                            selectedMemberIds={selectedMemberIds}
                            onSelectChange={setSelectedMemberIds}
                        />
                    </S.ForColumn>
                </S.ForRow>

                <DateInputField
                    label="시작 날짜"
                    value={startDate}
                    onChange={setStartDate}
                />

                <DateInputField
                    label="종료 날짜"
                    value={endDate}
                    onChange={setEndDate}
                    error={dateError}
                />

                <S.ForRow>
                    <S.Name>색상</S.Name>
                    <S.ColorContainer>
                        {calendarHighlight.map(color => (
                            <S.Color 
                                key={color} 
                                style={{
                                    backgroundColor: color,
                                    border: selectedColor === color ? '1px solid #333' : 'none',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setSelectedColor(color)}
                            />
                        ))}
                    </S.ColorContainer>
                </S.ForRow>

                <TextAreaField
                    label="내용"
                    value={content}
                    onChange={setContent}
                    placeholder="내용을 입력하세요."
                    showLetterCount={250}
                />

                <S.Buttons>
                    {modalMode === '편집'
                    ? <S.DeleteButton>삭제</S.DeleteButton> : <></> }
                    <S.CancelButton onClick={() => setIsModalOpen(false)}>취소</S.CancelButton>
                    <S.ConfirmButton>저장</S.ConfirmButton>
                </S.Buttons>
            </S.Container>
        </S.Background>
    );
}