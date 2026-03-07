import { useEffect, useState } from 'react';
import { getComments, getReplies } from '@/api/Comment';
import type { Comment } from '@/types/post';

export const useComments = (postId?: number, parentId?: number) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getCommentsInfo = async () => {
        if (!postId) return; 
        setIsLoading(true);
        try {
            const data = parentId
                ? await getReplies(postId, parentId)
                : await getComments(postId)
            setComments(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCommentsInfo();
    }, [postId]);

    return { comments, getCommentsInfo, isCommentLoading: isLoading }
}