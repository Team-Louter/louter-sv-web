import type { Comment, ServerComment } from "@/types/post";
import instance from "./Axios";

// 댓글 가져오기
export const getComments = async (postId: number): Promise<Comment[]> => {
    const response = await instance.get<Comment[]>(`/posts/${postId}/comments`);
    return response.data;
}

// 답글 가져오기
export const getReplies = async (postId: number, commentId: number): Promise<Comment[]> => {
    const response = await instance.get<Comment[]>(`/posts/${postId}/comments/${commentId}/replies`);
    return response.data;
}

// 댓글 생성하기
export const createComment = async (postId: number, comment: ServerComment): Promise<void> => {
    console.log(comment)
    await instance.post<void>(`/posts/${postId}/comments`, comment);
}

