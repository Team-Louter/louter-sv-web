import { useState, useEffect } from "react";
import * as S from "./EventEditModal.styled";
import type { Member } from "@/types/member";
import { getInitialStartDate, getInitialEndDate } from "@/utils/FormatDate";
import DateInputField from "./DateInputField";
import { TextAreaField, TextInputField } from "./TextInputField";
import { calendarHighlight } from "@/constants/CalendarHighlight";
import MemberDropdown from "./MemberDropdown";
import type { EventInput } from "@fullcalendar/core";
import { useEventEditor } from "@/hooks/useEventEditor";

export interface EventEditModalProps {
    selectedDate?: Date | null;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedEndDate?: Date | null;
    modalMode: string;
    event: EventInput | null;
    setEvents: React.Dispatch<React.SetStateAction<EventInput[]>>;
}

export default function EventEditModal({ selectedDate, selectedEndDate, setIsModalOpen, modalMode, event, setEvents }: EventEditModalProps) {
    const [title, setTitle] = useState<string>(event?.title || '');
    const [content, setContent] = useState<string>(event?.extendedProps?.description || '');
    const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>(
        event?.extendedProps?.assignees?.map((a: { userId: number }) => a.userId) || []
    );
    const [startDate, setStartDate] = useState<string>(getInitialStartDate(event, selectedDate ?? null));
    const [endDate, setEndDate] = useState<string>(getInitialEndDate(event, selectedDate ?? null, selectedEndDate ?? null));
    const [dateError, setDateError] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>(event?.color || calendarHighlight[2]);
    const [allMembers, setAllMembers] = useState<Member[]>([]);

    const { handleSubmit, handleDelete, isSubmitting, isDeleting } = useEventEditor({
        modalMode, event, title, content, startDate, endDate,
        selectedColor, selectedMemberIds, allMembers, setEvents, setIsModalOpen,
    });

    const isActionPending = isSubmitting || isDeleting;

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
                            onMembersLoad={setAllMembers}
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
                    {modalMode === '편집' && event && (
                        <S.DeleteButton
                            onClick={() => handleDelete(event.scheduleId)}
                            disabled={isActionPending}
                            style={{ opacity: isDeleting ? 0.6 : 1, cursor: isDeleting ? 'not-allowed' : 'pointer' }}
                        >
                            {isDeleting ? '삭제 중...' : '삭제'}
                        </S.DeleteButton>
                    )}
                    <S.CancelButton
                        onClick={() => setIsModalOpen(false)}
                        disabled={isActionPending}
                        style={{ opacity: isActionPending ? 0.6 : 1, cursor: isActionPending ? 'not-allowed' : 'pointer' }}
                    >
                        취소
                    </S.CancelButton>
                    <S.ConfirmButton
                        $isValid={isFormValid && !isActionPending}
                        disabled={!isFormValid || isActionPending}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? '저장 중...' : '저장'}
                    </S.ConfirmButton>
                </S.Buttons>
            </S.Container>
        </S.Background>
    );
}