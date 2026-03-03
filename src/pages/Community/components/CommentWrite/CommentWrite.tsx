import { useEffect, useState } from "react";
import type { CommentWriteProps } from "@/types/community";
import * as S from "./CommentWrite.styled";
import { createComment, editComment } from "@/api/Comment";
import { useParams } from "react-router-dom";
import { getUser } from "@/api/User";
import type { User } from "@/types/user";

export default function CommentWrite({ comment, onClose, isEditing = false, parentId = null }: CommentWriteProps) {
    const [content, setContent] = useState(comment?.content || ""); // 댓글 내용
    const [isAnonymous, setIsAnonymous] = useState<boolean>(comment?.isAnonymous || false); // 댓글 익명 게시 여부
    const { postId } = useParams();
    const [userInfo, setUserInfo] = useState<User | null>(null); // 사용자 여부

    const isValid = content.trim().length > 0; // 내용이 한 글자라도 입력됐는지 확인

    // 유저 정보 가져오기
    const getUserInfo = async () => {
            try{
                const data = await getUser();
                setUserInfo(data);
            } catch(err) {
                console.error(err);
            }
        };

    // 댓글 게시 버튼 클릭 시 
    const handleSubmit = async () => {
        if (isEditing && comment?.commentId) { // 수정
            try {
                await editComment(Number(postId), comment?.commentId, content);
                onClose?.();
            } catch (err) {
                console.error(err);
            }
        } else { // 생성
            try {
                await createComment(Number(postId), {
                    content: content,
                    isAnonymous: isAnonymous,
                    parentId: parentId
                });
                setContent("");
                onClose?.();
            } catch (err) {
                console.error(err);
            }
        }
    }

    useEffect(() => {
        getUserInfo();
    }, [])

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
                        <S.ProfileImg src={userInfo?.profileImageUrl}/>
                        <S.Name>{userInfo?.userName}</S.Name>
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
                        disabled={!isValid}   
                    >
                        등록
                    </S.Confirm>
                </S.Div>
            </S.ForRow>
        </S.CommentWrite>
    );
}
