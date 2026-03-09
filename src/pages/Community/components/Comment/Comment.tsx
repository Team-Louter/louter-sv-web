import { useState } from "react";
import type { Comment } from "@/types/post";
import * as S from "./Comment.styled";
import { formatDateTime } from "@/utils/FormatDate";
import CommentWrite from "../CommentWrite/CommentWrite";
import KebabMenu from "../KebabMenu/KebabMenu";
import { useKebab } from "@/hooks/useKebab";
import { deleteComment } from "@/api/Comment";
import { IoIosArrowBack } from "react-icons/io";
import { useAuthStore } from "@/store/authStore";
import { useComments } from "@/hooks/useComments";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from "@/store/toastStore";

export interface commentProps {
    comment?: Comment;
    postId?: number;
    onSuccess?: () => void;
}

export default function Comment({ comment, postId, onSuccess }: commentProps) {
    const [showReplyWrite, setShowReplyWrite] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { isKebabOpen, setIsKebabOpen, kebabRef } = useKebab();
    const userInfo = useAuthStore((state) => state.user);
    const { comments: replies, getCommentsInfo } = useComments(postId!, comment?.commentId!);

    const deleteCommentInfo = async () => {
        try {
            await deleteComment(postId!, comment?.commentId!);
            toast.success('댓글이 삭제되었습니다.');
            onSuccess?.();
        } catch (err) {
            toast.error('댓글 삭제가 실패하였습니다.');
        }
    }

    const kebabItems = [
        ...(comment?.userId === userInfo?.userId ? [{
            label: "수정하기",
            onClick: () => {
                setIsEditing(true);
                setIsKebabOpen(false);
            },
        }] : []),
        ...(comment?.userId === userInfo?.userId || userInfo?.role === 'MENTOR' || userInfo?.role === 'LEADER' ? [{
            label: "삭제하기",
            onClick: () => {
                setIsKebabOpen(false);
                deleteCommentInfo();
            },
        }] : []),
    ];

    if (isEditing && comment) {
        return (
            <CommentWrite
                comment={comment}
                onClose={() => setIsEditing(false)}
                isEditing
                onSuccess={onSuccess}
            />
        );
    }

    return (
        <S.Container>
            <S.ForRow>
                <S.Div>
                    {comment
                        ? <S.ProfileImg src={comment.userProfileImageUrl} />
                        : <div style={{ alignSelf: 'flex-start' }}>
                            <Skeleton circle height={35} width={35} />
                        </div>
                    }
                    <S.ForColumn>
                        {comment
                            ? <S.Name>{comment.userName}</S.Name>
                            : <Skeleton width={50} height={20}/>
                        }
                        {comment
                            ? <S.CommentContent>{comment.content}</S.CommentContent>
                            : <Skeleton width={200} height={20}/>
                        }
                        <S.Div>
                            {comment
                                ? <S.UploadTime>{formatDateTime(comment.createdAt)}</S.UploadTime>
                                : <Skeleton width={88} height={20} />
                            }
                            {comment &&
                                <S.WriteButton onClick={() => setShowReplyWrite(true)}>
                                    답글쓰기
                                </S.WriteButton>
                            }
                        </S.Div>
                        {comment && comment.replyCount > 0 &&
                            <S.ReplyButton onClick={() => setShowReplies(!showReplies)}>
                                {showReplies ? `답글 닫기` : `답글 ${comment.replyCount}개 보기`}
                                <S.ArrowIcon $isOpen={showReplies}><IoIosArrowBack /></S.ArrowIcon>
                            </S.ReplyButton>
                        }
                    </S.ForColumn>
                </S.Div>
                {comment && kebabItems.length > 0 &&
                    <S.KebabWrapper ref={kebabRef}>
                        <S.KebabIcon onClick={() => setIsKebabOpen(prev => !prev)} />
                        {isKebabOpen && <KebabMenu items={kebabItems} />}
                    </S.KebabWrapper>
                }
            </S.ForRow>
            {showReplyWrite && comment && (
                <div style={{ marginLeft: 40, marginTop: 8 }}>
                    <CommentWrite
                        onClose={() => setShowReplyWrite(false)}
                        parentId={comment.commentId}
                        onSuccess={() => { getCommentsInfo(); onSuccess?.(); }}
                    />
                </div>
            )}
            {showReplies && replies.map((reply) => (
                <div style={{ marginLeft: 40, marginTop: 8 }} key={reply.commentId}>
                    <Comment
                        comment={reply}
                        postId={postId}
                        onSuccess={() => { getCommentsInfo(); onSuccess?.(); }}
                    />
                </div>
            ))}
        </S.Container>
    );
}