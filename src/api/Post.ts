import type { HotPost, Post, PostList } from "@/types/post";
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