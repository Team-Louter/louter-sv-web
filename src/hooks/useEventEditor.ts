import { useState } from 'react';
import { createEvent, deleteEvent, editEvent, getEvent } from '@/api/Event';
import { getScheduleTarget } from '@/utils/FormatAssignee';
import { formatEvents } from '@/utils/formatEvent';
import type { EventInput } from '@fullcalendar/core';
import type { Member } from '@/types/member';
import type React from 'react';

interface UseEventEditorParams {
  modalMode: string;
  event: EventInput | null;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  selectedColor: string;
  selectedMemberIds: number[];
  allMembers: Member[];
  setEvents: React.Dispatch<React.SetStateAction<EventInput[]>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useEventEditor = ({
  modalMode, event, title, content, startDate, endDate,
  selectedColor, selectedMemberIds, allMembers, setEvents, setIsModalOpen,
}: UseEventEditorParams) => {
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [isDeleting, setIsDeleting] = useState(false);     

  const handleDelete = async (scheduleId: number) => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteEvent(scheduleId);
      const data = await getEvent();
      setEvents(formatEvents(data));
      setIsModalOpen(false);
    } catch (err) {
      console.error('삭제 실패', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const { scheduleTarget, generations, userIds } = getScheduleTarget(selectedMemberIds, allMembers);
    const payload = {
      title, content,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      color: selectedColor,
      scheduleTarget, generations, userIds,
    };

    try {
      if (modalMode === '추가') {
        await createEvent(payload);
      } else {
        if (!event?.scheduleId) return;
        await editEvent(event.scheduleId, payload);
      }
      const data = await getEvent();
      setEvents(formatEvents(data));
      setIsModalOpen(false);
    } catch (err) {
      console.error(modalMode === '추가' ? '생성 실패' : '수정 실패', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, handleDelete, isSubmitting, isDeleting }; 
};