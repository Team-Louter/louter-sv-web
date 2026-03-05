import { useEffect, useState } from 'react';
import { getComments, getReplies } from '@/api/Comment';
import type { Comment } from '@/types/post';

export const useComments = (postId: number, parentId?: number) => {
    const [comments, setComments] = useState<Comment[]>([]); // 댓글 정보

    const getCommentsInfo = async () => {
        try {
            const data = parentId
                ? await getReplies(postId, parentId)
                : await getComments(postId)
            setComments(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getCommentsInfo();
    }, [postId]);

    return { comments, getCommentsInfo }
}