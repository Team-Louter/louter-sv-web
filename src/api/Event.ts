import type { Event, ServerEvent } from "@/types/fullCalendar";
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

// 일정 생성하기
export const createEvent = async (event: ServerEvent): Promise<void> => {
    await instance.post<void>("/schedules", event);
}

// 일정 수정하기
export const editEvent = async (scheduleId: number, event: ServerEvent): Promise<void> => {
    await instance.put<void>(`/schedules/${scheduleId}`, event);
}