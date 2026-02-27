import { useState, useEffect } from "react";
import * as S from "./EventEditModal.styled";
import type { EventEditModalProps } from "@/types/fullCalendar";
import { getLocalDateString } from "@/utils/FormatDate";
import DateInputField from "./DateInputField";
import { TextAreaField, TextInputField } from "./TextInputField";
import { calendarHighlight } from "@/constants/CalendarHighlight";
import MemberDropdown from "./MemberDropdown";
import { deleteEvent, getEvent } from "@/api/Event";
import { formatEvents } from "@/utils/formatEvent";

export default function EventEditModal({ selectedDate, selectedEndDate, setIsModalOpen, modalMode, event, setEvents }: EventEditModalProps) {
    // 시작 날짜 기본값 설정
    const getInitialStartDate = () => {
        if (event?.start) return getLocalDateString(event.start);
        return selectedDate ? getLocalDateString(selectedDate) : getLocalDateString(new Date());
    };

    // 종료 날짜 기본값 설정
    const getInitialEndDate = () => {
        if (event?.end) {
            const eventEndDate = new Date(event.end);
            eventEndDate.setDate(eventEndDate.getDate());
            return getLocalDateString(eventEndDate);
        }
        // selectedEndDate가 있으면 사용, 없으면 selectedDate fallback
        if (selectedEndDate) return getLocalDateString(selectedEndDate);
        return selectedDate ? getLocalDateString(selectedDate) : getLocalDateString(new Date());
    };

    const [title, setTitle] = useState<string>(event?.title || ''); // 일정 제목
    const [content, setContent] = useState<string>(event?.extendedProps?.description || ''); // 일정 내용
    const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>(
        event?.extendedProps?.assignees?.map((a: { userId: number }) => a.userId) || []
    ); // 일정 담당자
    const [startDate, setStartDate] = useState<string>(getInitialStartDate()); // 시작 날짜
    const [endDate, setEndDate] = useState<string>(getInitialEndDate()); // 종료 날짜
    const [dateError, setDateError] = useState<string>(''); // 종료 날짜가 시작 날짜보다 빠른 경우 에러 메세지
    const [selectedColor, setSelectedColor] = useState<string>(
        event?.backgroundColor || calendarHighlight[2]
    ); // 일정 색상

    const delEvent = async (scheduleId: number) => {
        try {
            await deleteEvent(scheduleId);
            console.log('삭제 성공');

            setIsModalOpen(false);

            const data = await getEvent(); 
            setEvents(formatEvents(data)); 
        } catch (err) {
            console.error('삭제 실패', err);
        }
    }

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

    // 모든 폼이 설정되었는지 확인
    const isFormValid =
        title.trim() !== '' &&
        selectedMemberIds.length > 0 &&
        startDate !== '' &&
        endDate !== '' &&
        dateError === '' &&
        content.trim() !== '';

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
                    <S.Name style={{paddingTop: 0}}>색상</S.Name>
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
                    {modalMode === '편집' ? <S.DeleteButton onClick={() => delEvent(event.scheduleId)}>삭제</S.DeleteButton> : <></>}
                    <S.CancelButton onClick={() => setIsModalOpen(false)}>취소</S.CancelButton>
                    <S.ConfirmButton $isValid={isFormValid} disabled={!isFormValid}>
                        저장
                    </S.ConfirmButton>
                </S.Buttons>
            </S.Container>
        </S.Background>
    );
}