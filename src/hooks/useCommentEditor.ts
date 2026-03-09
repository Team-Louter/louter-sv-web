import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { createComment, editComment } from '@/api/Comment';
import { toast } from '@/store/toastStore';

interface UseCommentEditorParams {
    comment?: { commentId: number; content: string; isAnonymous: boolean };
    isEditing: boolean;
    content: string;
    isAnonymous: boolean;
    parentId: number | null;
    onSuccess?: () => void;
    onClose?: () => void;
    setContent: (content: string) => void;
}

export const useCommentEditor = ({
    comment,
    isEditing,
    content,
    isAnonymous,
    parentId,
    onSuccess,
    onClose,
    setContent
}: UseCommentEditorParams) => {
    const { postId } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false); 

    const handleSubmit = async () => {
        if (isSubmitting) return; 
        setIsSubmitting(true);    
        try {
            if (isEditing && comment?.commentId) {
                await editComment(Number(postId), comment?.commentId, content);
                toast.success('댓글이 수정되었습니다.');
            } else {
                await createComment(Number(postId), {
                    content,
                    isAnonymous,
                    parentId
                });
                setContent("");
                toast.success('댓글이 게시되었습니다.');
            }
            onSuccess?.();
            onClose?.();
        } catch (err) {
            toast.error(isEditing ? '댓글 수정이 실패하였습니다.' : '댓글 게시가 실패하였습니다.');
        } finally {
            setIsSubmitting(false); 
        }
    };

    return { handleSubmit, isSubmitting }; 
};