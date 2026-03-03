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
    await instance.post<void>(`/posts/${postId}/comments`, comment);
}

// 댓글 수정하기 
export const editComment = async (postId: number, commentId: number, newContent: string): Promise<void> => {
    await instance.put<void>(`/posts/${postId}/comments/${commentId}`, { content: newContent });
}

// 댓글 삭제하기
export const deleteComment = async (postId: number, commentId: number): Promise<void> => {
    await instance.delete<void>(`/posts/${postId}/comments/${commentId}`);
}