import { useEffect, useState } from "react";
import type { Comment, commentProps } from "@/types/post";
import * as S from "./Comment.styled";
import { formatDateTime } from "@/utils/FormatDate";
import CommentWrite from "../CommentWrite/CommentWrite";
import KebabMenu from "../KebabMenu/KebabMenu";
import { useKebab } from "@/hooks/useKebab";
import { deleteComment, getReplies } from "@/api/Comment";
import { IoIosArrowBack } from "react-icons/io";

export default function Comment({ comment, postId }: commentProps) {
    const [showReplyWrite, setShowReplyWrite] = useState(false); // 답글 작성 여부
    const [showReplies, setShowReplies] = useState(false); // 답글 조회 여부
    const [isEditing, setIsEditing] = useState(false); // 댓글 수정 여부
    const { isKebabOpen, setIsKebabOpen, kebabRef } = useKebab(); // 케밥 메뉴 관련 훅
    const [replies, setReplies] = useState<Comment[]>([]); // 댓글들

    // 댓글 목록 정보 가져오기
    const getRepliesInfo = async () => {
        try {
            const data = await getReplies(postId, comment.commentId);
            setReplies(data);
        } catch (err) {
            console.error(err);
        }
    }

    // 댓글 삭제하기
    const deleteCommentInfo = async () => {
        try {
            await deleteComment(postId, comment.commentId);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        getRepliesInfo();
    }, [])

    // 케밥 메뉴 내용물
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
            onClick: () => {
                setIsKebabOpen(false);
                deleteCommentInfo();
            },
        },
    ];

    // 댓글 수정 시 댓글 작성 컴포넌트 렌더링
    if (isEditing) {
        return (
            <CommentWrite
                comment={comment}
                onClose={() => setIsEditing(false)}
                isEditing
                
            />
        );
    }

    return (
        <S.Container>
            <S.ForRow>
                <S.Div>
                    <S.ProfileImg src={comment.userProfileImageUrl}/>
                    <S.ForColumn>
                        <S.Name>{comment.userName}</S.Name>
                        <S.CommentContent>{comment.content}</S.CommentContent>
                        <S.Div>
                            <S.UploadTime>{formatDateTime(comment.createdAt)}</S.UploadTime>
                            <S.WriteButton onClick={() => setShowReplyWrite(true)}>
                                답글쓰기
                            </S.WriteButton>
                        </S.Div>
                        {comment.replyCount > 0
                        ? <S.ReplyButton onClick={() => setShowReplies(!showReplies)}>
                            {showReplies ? `답글 닫기` : `답글 ${comment.replyCount}개 보기`}
                            <S.ArrowIcon $isOpen={showReplies}><IoIosArrowBack /></S.ArrowIcon>
                        </S.ReplyButton> 
                        : <></> }
                    </S.ForColumn>
                </S.Div>
                <S.KebabWrapper ref={kebabRef}>
                    <S.KebabIcon onClick={() => setIsKebabOpen(prev => !prev)} />
                    {isKebabOpen && <KebabMenu items={kebabItems} />}
                </S.KebabWrapper>
            </S.ForRow>
            {showReplyWrite && (
                <div style={{ marginLeft: 40, marginTop: 8 }}>
                    <CommentWrite onClose={() => setShowReplyWrite(false)} parentId={comment.commentId}/>
                </div>
            )}
            {showReplies && replies.map((reply) => (
                <div style={{ marginLeft: 40, marginTop: 8 }} key={reply.commentId}>
                    <Comment comment={reply} postId={postId}/>
                </div>
            ))}
        </S.Container>
    );
}