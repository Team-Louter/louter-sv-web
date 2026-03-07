import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { createComment, editComment } from '@/api/Comment';

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
            } else {
                await createComment(Number(postId), {
                    content,
                    isAnonymous,
                    parentId
                });
                setContent("");
            }
            onSuccess?.();
            onClose?.();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false); 
        }
    };

    return { handleSubmit, isSubmitting }; 
};