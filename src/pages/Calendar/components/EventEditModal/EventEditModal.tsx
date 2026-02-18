import { useState, useEffect } from "react";
import * as S from "./EventEditModal.styled";
import type { EventEditModalProps } from "@/types/fullCalendar";
import { getLocalDateString } from "@/utils/FormatDate";
import DateInputField from "./DateInputField";
import { TextAreaField, TextInputField } from "./TextInputField";
import { calendarHighlight } from "@/constants/CalendarHighlight";
import MemberDropdown from "./MemberDropdown";

export default function EventEditModal({ selectedDate, setIsModalOpen, modalMode, event }: EventEditModalProps) {
    const getInitialStartDate = () => {
        if (event?.start) return getLocalDateString(event.start);
        return selectedDate ? getLocalDateString(selectedDate) : getLocalDateString(new Date());
    };

    const getInitialEndDate = () => {
        if (event?.end) {
            const eventEndDate = new Date(event.end);
            eventEndDate.setDate(eventEndDate.getDate() - 1);
            return getLocalDateString(eventEndDate);
        }
        return selectedDate ? getLocalDateString(selectedDate) : getLocalDateString(new Date());
    };

    const [title, setTitle] = useState<string>(event?.title || '');
    const [content, setContent] = useState<string>(event?.extendedProps?.description || '');
    const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>(
        event?.extendedProps?.assignees?.map((a: { id: number }) => a.id) || []
    );
    const [startDate, setStartDate] = useState<string>(getInitialStartDate());
    const [endDate, setEndDate] = useState<string>(getInitialEndDate());
    const [dateError, setDateError] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>(
        event?.backgroundColor || calendarHighlight[2]
    );

    useEffect(() => {
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
                    {modalMode === '편집' ? <S.DeleteButton>삭제</S.DeleteButton> : <></>}
                    <S.CancelButton onClick={() => setIsModalOpen(false)}>취소</S.CancelButton>
                    <S.ConfirmButton $isValid={isFormValid} disabled={!isFormValid}>
                        저장
                    </S.ConfirmButton>
                </S.Buttons>
            </S.Container>
        </S.Background>
    );
}