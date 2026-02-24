import { useState } from "react";
import type { CommentWriteProps } from "@/types/community";
import * as S from "./CommentWrite.styled";

export default function CommentWrite({ onClose, initialValue = "" }: CommentWriteProps) {
    const [content, setContent] = useState(initialValue);

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
                    <S.Div>
                        <S.CheckboxLabel>
                            <input type="checkbox" />
                        </S.CheckboxLabel>
                        <S.Label>익명으로 등록</S.Label>
                    </S.Div>
                </S.Div>
                <S.Div>
                    {onClose && <S.Cancel onClick={onClose}>취소</S.Cancel>}
                    <S.Confirm onClick={onClose}>등록</S.Confirm>
                </S.Div>
            </S.ForRow>
        </S.CommentWrite>
    );
}