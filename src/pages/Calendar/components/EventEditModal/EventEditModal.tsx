import { useState, useEffect } from "react";
import * as S from "./EventEditModal.styled";
import type { EventEditModalProps } from "@/types/fullCalendar";
import type { Member } from "@/types/member";
import { getInitialStartDate, getInitialEndDate } from "@/utils/FormatDate";
import { getScheduleTarget } from "@/utils/FormatAssignee";
import DateInputField from "./DateInputField";
import { TextAreaField, TextInputField } from "./TextInputField";
import { calendarHighlight } from "@/constants/CalendarHighlight";
import MemberDropdown from "./MemberDropdown";
import { createEvent, deleteEvent, editEvent, getEvent } from "@/api/Event";
import { formatEvents } from "@/utils/formatEvent";

export default function EventEditModal({ selectedDate, selectedEndDate, setIsModalOpen, modalMode, event, setEvents }: EventEditModalProps) {
    const [title, setTitle] = useState<string>(event?.title || ''); // 일정 제목
    const [content, setContent] = useState<string>(event?.extendedProps?.description || ''); // 일정 내용
    const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>(
        event?.extendedProps?.assignees?.map((a: { userId: number }) => a.userId) || []
    ); // 일정 담당자
    const [startDate, setStartDate] = useState<string>(getInitialStartDate(event, selectedDate ?? null)); // 시작 날짜
    const [endDate, setEndDate] = useState<string>(getInitialEndDate(event, selectedDate ?? null, selectedEndDate ?? null)); // 종료 날짜
    const [dateError, setDateError] = useState<string>(''); // 종료 날짜가 시작 날짜보다 빠른 경우 에러 메세지
    const [selectedColor, setSelectedColor] = useState<string>(
        event?.color || calendarHighlight[2]
    ); // 일정 색상
    const [allMembers, setAllMembers] = useState<Member[]>([]); // 전체 멤버 목록 (scheduleTarget 판단용)

    const handleDelete = async (scheduleId: number) => {
        try {
            await deleteEvent(scheduleId);
            console.log('삭제 성공');

            const data = await getEvent();
            setEvents(formatEvents(data));
            setIsModalOpen(false);
        } catch (err) {
            console.error('삭제 실패', err);
        }
    }

    const handleSubmit = async () => {
        if (modalMode === '추가') {
            try {
                const { scheduleTarget, generations, userIds } = getScheduleTarget(selectedMemberIds, allMembers);
                await createEvent({
                    title,
                    content,
                    startDate: new Date(startDate).toISOString(),
                    endDate: new Date(endDate).toISOString(),
                    color: selectedColor,
                    scheduleTarget,
                    generations,
                    userIds,
                });
                const data = await getEvent();
                setEvents(formatEvents(data));
                setIsModalOpen(false);
            } catch (err) {
                console.error('생성 실패', err);
            }
        } else {
            if (!event?.scheduleId) return; 
            try {
                const { scheduleTarget, generations, userIds } = getScheduleTarget(selectedMemberIds, allMembers);
                await editEvent(event.scheduleId, { 
                    title,
                    content,
                    startDate: new Date(startDate).toISOString(),
                    endDate: new Date(endDate).toISOString(),
                    color: selectedColor,
                    scheduleTarget,
                    generations,
                    userIds,
                });
                const data = await getEvent();
                setEvents(formatEvents(data));
                setIsModalOpen(false);
            } catch (err) {
                console.error('수정 실패', err);
            }
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
                            onMembersLoad={setAllMembers} // 전체 멤버 목록 받아오기
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
                    {modalMode === '편집' ? <S.DeleteButton onClick={() => handleDelete(event.scheduleId)}>삭제</S.DeleteButton> : <></>}
                    <S.CancelButton onClick={() => setIsModalOpen(false)}>취소</S.CancelButton>
                    <S.ConfirmButton $isValid={isFormValid} disabled={!isFormValid} onClick={handleSubmit}>
                        저장
                    </S.ConfirmButton>
                </S.Buttons>
            </S.Container>
        </S.Background>
    );
}