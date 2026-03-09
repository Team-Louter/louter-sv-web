import { useState } from 'react';
import { createEvent, deleteEvent, editEvent, getEvent } from '@/api/Event';
import { getScheduleTarget } from '@/utils/FormatAssignee';
import { formatEvents } from '@/utils/formatEvent';
import type { EventInput } from '@fullcalendar/core';
import type { Member } from '@/types/member';
import type React from 'react';
import { toast } from '@/store/toastStore';

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
      toast.success('일정이 삭제되었습니다.');
      const data = await getEvent();
      setEvents(formatEvents(data));
      setIsModalOpen(false);
    } catch (err) {
      toast.error('일정 삭제가 실패하였습니다.')
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
        toast.success('일정이 추가되었습니다.');
      } else {
        if (!event?.scheduleId) return;
        await editEvent(event.scheduleId, payload);
        toast.success('일정이 수정되었습니다.');
      }
      const data = await getEvent();
      setEvents(formatEvents(data));
      setIsModalOpen(false);
    } catch (err) {
      toast.error(modalMode === '추가' ? '일정 추가가 실패하였습니다.' : '일정 수정이 실패하였습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, handleDelete, isSubmitting, isDeleting }; 
};