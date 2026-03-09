import { useState } from "react";
import * as S from "./CommentWrite.styled";
import { useAuthStore } from "@/store/authStore";
import { useCommentEditor } from "@/hooks/useCommentEditor";
import type { Comment } from "@/types/post";
import anonymousProfile from "@/assets/anonymousProfile.png";

interface CommentWriteProps {
    comment?: Comment;
    onClose?: () => void;
    isEditing?: boolean;
    parentId?: number | null;
    onSuccess?: () => void;
}

export default function CommentWrite({ comment, onClose, isEditing = false, parentId = null, onSuccess }: CommentWriteProps) {
    const [content, setContent] = useState(comment?.content || ""); // 댓글 내용
    const [isAnonymous, setIsAnonymous] = useState<boolean>(comment?.isAnonymous || false); // 댓글 익명 게시 여부
    const userInfo = useAuthStore((state) => state.user);
    const isValid = content.trim().length > 0; // 내용이 한 글자라도 입력됐는지 확인

    const { handleSubmit, isSubmitting } = useCommentEditor({
        comment, isEditing, content, isAnonymous, parentId, onSuccess, onClose, setContent
    })

    return (
        <S.CommentWrite>
            <S.CommentContent
                placeholder="댓글을 남겨보세요."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <S.ForRow>
                <S.Div style={{ gap: 10 }}>
                    <S.Div style={{ marginLeft: 10 }}>
                        <>
                            <S.ProfileImg
                                src={anonymousProfile}
                                style={{ display: isAnonymous ? 'block' : 'none' }}
                            />
                            <S.ProfileImg
                                src={userInfo?.profileImageUrl}
                                style={{ display: isAnonymous ? 'none' : 'block' }}
                            />
                        </>
                        <S.Name style={{width: 40}}>{isAnonymous ? '익명' : userInfo?.userName}</S.Name>
                    </S.Div>
                    {!isEditing && (
                        <S.Div>
                            <S.CheckboxLabel>
                                <input
                                    type="checkbox"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                />
                            </S.CheckboxLabel>
                            <S.Label>익명으로 게시</S.Label>
                        </S.Div>
                    )}
                </S.Div>
                <S.Div>
                    {onClose && <S.Cancel onClick={onClose}>취소</S.Cancel>}
                    <S.Confirm 
                        onClick={handleSubmit} 
                        disabled={!isValid || isSubmitting}  
                    >
                        {isSubmitting ? '게시 중...' : '게시'}  
                    </S.Confirm>
                </S.Div>
            </S.ForRow>
        </S.CommentWrite>
    );
}
