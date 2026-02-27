import type { Event } from "@/types/fullCalendar";
import instance from "./Axios";

// 일정 가져오기
export const getEvent = async (): Promise<Event[]> => {
    const response = await instance.get<Event[]>("/schedules");
    return response.data;
}

// 일정 삭제하기
export const deleteEvent = async (scheduleId: number): Promise<void> => {
    await instance.delete<void>(`/schedules/${scheduleId}`);
}