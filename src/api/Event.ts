import type { Event } from "@/types/fullCalendar";
import instance from "./Axios";

// 일정 가져오기
export const getEvent = async (): Promise<Event[]> => {
    const response = await instance.get<Event[]>("/schedules");
    return response.data;
}