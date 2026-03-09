import { useEffect, useState } from 'react';
import { getPostDetail, toggleLike, togglePin, deletePost } from '@/api/Post';
import type { Post } from '@/types/post';
import { toast } from '@/store/toastStore';

export const usePostDetail = (postId: number) => {
    const [post, setPost] = useState<Post|null>(null); // 게시글 세부 정보
    const [isLiked, setIsLiked] = useState<boolean>(false); // 좋아요를 눌렀는지 여부
    const [isPinned, setIsPinned] = useState<boolean>(false); // 고정된 게시글인지 여부
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const getPostInfo = async () => {
            setIsLoading(true);
            try {
                const data = await getPostDetail(postId);
                setPost(data)
            } catch (err) {
            } finally {
                setIsLoading(false);
            }
        };

        getPostInfo();
    }, [postId])

    useEffect(() => {
        if (post) {
            setIsLiked(post.isHearted);
            setIsPinned(post.pinned);
        }
    }, [post]);

    const handleToggleLike = async () => {
        // 롤백용 상태 저장
        const prevIsLiked = isLiked;
        const prevPost = post;
    
        // 상태 변경 
        const nextLiked = !isLiked;
        setIsLiked(nextLiked);
        setPost((prev) => prev ? {
            ...prev,
            isHearted: nextLiked, 
            likeCount: nextLiked ? prev.likeCount + 1 : prev.likeCount - 1
        } : prev);
    
        // 서버 호출
        try {
            // 성공하면 유지
            await toggleLike(postId);
        } catch (err) {
            // 실패 시 롤백
            setIsLiked(prevIsLiked);
            setPost(prevPost);
            toast.error('좋아요 처리에 실패했습니다.');
        }
    };

    const handleTogglePin = async (newPinned: boolean) => {
        try {
            await togglePin(postId, newPinned);
            const data = await getPostDetail(postId);
            setPost(data);
        } catch (err) {
        }
    }

    const handleDelete = async () => {
        try {
            await deletePost(postId);
            toast.success('게시글이 삭제되었습니다.');
        } catch (err) {
            toast.error('게시글 삭제가 실패하였습니다.');
        }
    };

    return { post, isLiked, isPinned, setIsPinned, handleDelete, handleToggleLike, handleTogglePin, isPostLoading: isLoading }
}