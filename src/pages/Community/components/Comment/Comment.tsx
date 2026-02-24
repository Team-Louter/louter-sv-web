import { useState } from "react";
import type { commentProps } from "@/types/post";
import * as S from "./Comment.styled";
import { formatDateTime } from "@/utils/FormatDate";
import CommentWrite from "../CommentWrite/CommentWrite";
import KebabMenu from "../KebabMenu/KebabMenu";
import { useKebab } from "@/hooks/useKebab";

export default function Comment({ comment }: commentProps) {
    const [showReply, setShowReply] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { isKebabOpen, setIsKebabOpen, kebabRef } = useKebab();

    const kebabItems = [
        {
            label: "수정하기",
            onClick: () => {
                setIsEditing(true);
                setIsKebabOpen(false);
            },
        },
        {
            label: "삭제하기",
            onClick: () => setIsKebabOpen(false),
        },
    ];

    if (isEditing) {
        return (
            <CommentWrite
                initialValue={comment.content}
                onClose={() => setIsEditing(false)}
            />
        );
    }

    return (
        <S.Container>
            <S.ForRow>
                <S.Div>
                    <S.ProfileImg />
                    <S.ForColumn>
                        <S.Name>{comment.author}</S.Name>
                        <S.CommentContent>{comment.content}</S.CommentContent>
                        <S.Div>
                            <S.UploadTime>{formatDateTime(comment.createdAt)}</S.UploadTime>
                            <S.WriteButton onClick={() => setShowReply(true)}>
                                답글쓰기
                            </S.WriteButton>
                        </S.Div>
                    </S.ForColumn>
                </S.Div>
                <S.KebabWrapper ref={kebabRef}>
                    <S.KebabIcon onClick={() => setIsKebabOpen(prev => !prev)} />
                    {isKebabOpen && <KebabMenu items={kebabItems} />}
                </S.KebabWrapper>
            </S.ForRow>
            {showReply && (
                <div style={{ marginLeft: 40, marginTop: 8 }}>
                    <CommentWrite onClose={() => setShowReply(false)} />
                </div>
            )}
        </S.Container>
    );
}