import type { HotPost } from "@/types/post";
import instance from "./Axios";

export const getHotPost = async (): Promise<HotPost[]> => {
    const response = await instance.get<HotPost[]>("/posts/hot");
    return response.data;
}