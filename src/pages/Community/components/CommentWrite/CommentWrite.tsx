import { useState } from "react";
import type { CommentWriteProps } from "@/types/community";
import * as S from "./CommentWrite.styled";

export default function CommentWrite({ onClose, initialValue = "", isEditing = false }: CommentWriteProps) {
    const [content, setContent] = useState(initialValue); // 댓글 내용

    const isValid = content.trim().length > 0; // 한 글자라도 입력됐는지 확인

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
                        <S.ProfileImg />
                        <S.Name>이도연</S.Name>
                    </S.Div>
                    {!isEditing && (
                        <S.Div>
                            <S.CheckboxLabel>
                                <input type="checkbox" />
                            </S.CheckboxLabel>
                            <S.Label>익명으로 게시</S.Label>
                        </S.Div>
                    )}
                </S.Div>
                <S.Div>
                    {onClose && <S.Cancel onClick={onClose}>취소</S.Cancel>}
                    <S.Confirm 
                        onClick={onClose} 
                        disabled={!isValid}   // 유효하지 않으면 비활성화
                    >
                        등록
                    </S.Confirm>
                </S.Div>
            </S.ForRow>
        </S.CommentWrite>
    );
}
