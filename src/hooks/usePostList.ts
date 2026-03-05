import { useEffect, useState } from 'react';
import { getAllPost, getCategoryPost } from '@/api/Post';
import type { Post } from '@/types/post';
import { CATEGORIES } from '@/constants/Community';

export const usePostList = (selectedCategory: string, currentPage: number) => {
        const [posts, setPosts] = useState<Post[]|null>(null); // 게시글 목록 정보
        const [maxPage, setMaxPage] = useState<number>(0);
    
        useEffect(() => {
            const getPostsInfo = async () => {
                try {
                    const data = selectedCategory === '전체'
                        ? await getAllPost({
                            page: currentPage, 
                            size: 10, 
                            sort: ['pinned,desc', 'createdAt,desc']})
                        : await getCategoryPost(CATEGORIES[selectedCategory], {
                            page: currentPage, 
                            size: 10, 
                            sort: ['pinned,desc', 'createdAt,desc']
                        });
                    setPosts(data.content);
                    setMaxPage(data.totalPages);
                } catch(err) {
                    console.error(err);
                }
            };
            
            getPostsInfo();
        }, [selectedCategory, currentPage])
    
        // 고정된 게시글과 고정되지 않은 게시글 분리
        const pinnedPosts = posts?.filter((post) => post.pinned) ?? [];
        const normalPosts = posts?.filter((post) => !post.pinned) ?? [];
    
        return { pinnedPosts, normalPosts, maxPage };
}