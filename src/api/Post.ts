import type { HotPost, Post, PostList, ServerPost } from "@/types/post";
import instance from "./Axios";

// 인기글 가져오기
export const getHotPost = async (): Promise<HotPost[]> => {
    const response = await instance.get<HotPost[]>("/posts/hot");
    return response.data;
}

// 전체 게시글 가져오기
export const getAllPost = async (): Promise<PostList> => {
    const response = await instance.get<PostList>("/posts");
    return response.data;
}

// 카테고리별 게시글 가져오기
export const getCategoryPost = async (category: string): Promise<PostList> => {
    const response = await instance.get<PostList>(`/posts/category/${category}`);
    return response.data;
}

// 게시글 세부 정보 가져오기
export const getPostDetail = async (postId: number): Promise<Post> => {
    const response = await instance.get<Post>(`/posts/${postId}`);
    return response.data;
}

// 게시글 생성하기
export const createPostInfo = async (event: ServerPost): Promise<void> => {
    console.log(event);
    await instance.post<void>("/posts", event);
}

// 파일 -> 링크 변환
export const uploadFile = async (file:File): Promise<{url: string}> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await instance.post("/files/upload", formData, {
        headers: {'Content-Type': "multipart/form-data"},
    });
    console.log(response.data);
    return response.data;
}


// 게시글 수정하기
export const editPostInfo = async (postId: number|null, event: ServerPost): Promise<void> => {
    await instance.put<void>(`/posts/${postId}`, event);
}

// 게시글 삭제하기
export const deletePost = async (postId: number): Promise<void> => {
    await instance.delete<void>(`/posts/${postId}`);
}

// 게시글 고정/해제하기
export const togglePin = async (postId: number, pinned: boolean): Promise<void> => {
    await instance.put<void>(`/posts/${postId}/pin`, null, {
        params: {
            pinned: pinned
        }
    });
}

// 게시글 좋아요/해제하기
export const toggleLike = async (postId: number): Promise<void> => {
    await instance.post<void>(`/posts/${postId}/heart`);
}