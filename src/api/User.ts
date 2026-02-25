import type { MyPost } from "@/types/post";
import instance from "./Axios";
import type { User } from "@/types/user"

// 사용자 정보 가져오기
export const getUser = async (): Promise<User> => {
    const response = await instance.get<User>("/me");
    return response.data;
}

// 사용자가 작성한 글 가져오기
export const getMyPost = async (): Promise<MyPost> => {
    const response = await instance.get<MyPost>("/me/posts");
    return response.data;
}