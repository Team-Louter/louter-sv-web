import { useEffect, useState } from 'react';
import { getPostDetail, toggleLike, togglePin, deletePost } from '@/api/Post';
import type { Post } from '@/types/post';

export const usePostDetail = (postId: number) => {
    const [post, setPost] = useState<Post|null>(null); // 게시글 세부 정보
    const [isLiked, setIsLiked] = useState<boolean>(false); // 좋아요를 눌렀는지 여부
    const [isPinned, setIsPinned] = useState<boolean>(false); // 고정된 게시글인지 여부

    useEffect(() => {
        const getPostInfo = async () => {
            try {
                const data = await getPostDetail(postId);
                setPost(data)
            } catch (err) {
                console.log(err);
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
        try {
            await toggleLike(postId);
            setIsLiked((prev) => !prev);
            const data = await getPostDetail(postId);
            setPost(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleTogglePin = async (newPinned: boolean) => {
        try {
            await togglePin(postId, newPinned);
            const data = await getPostDetail(postId);
            setPost(data);
        } catch (err) {
            console.error(err);
        }
    }

    const handleDelete = async () => {
        try {
            await deletePost(postId);
        } catch (err) {
            console.error(err);
        }
    };

    return { post, isLiked, isPinned, setIsPinned, handleDelete, handleToggleLike, handleTogglePin }
}