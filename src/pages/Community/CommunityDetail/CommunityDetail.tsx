import { useLocation, useNavigate, useParams } from "react-router-dom";
import CommunitySidebar from "../components/CommunitySidebar/CommunitySidebar";
import * as S from "./CommunityDetail.styled";
import { IoIosArrowBack } from "react-icons/io";
import { colors } from "@/styles/values/_foundation";
import { MdRemoveRedEye } from "react-icons/md";
import { FaRegHeart, FaHeart, FaRegComment } from "react-icons/fa6";
import { useState } from "react";
import { formatDateTime } from "@/utils/FormatDate";
import Comment from "../components/Comment/Comment";
import CommentWrite from "../components/CommentWrite/CommentWrite";
import KebabMenu from "../components/KebabMenu/KebabMenu";
import { useKebab } from "@/hooks/useKebab";
import { MdPushPin } from "react-icons/md";
import { CATEGORY_REVERSED, CATEGORY_TAGS_REVERSED } from "@/constants/Community";
import { renderMarkdown } from "@/utils/Markdown/MarkdownConfig";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";
import { useAuthStore } from "@/store/authStore";
import { usePostDetail } from "@/hooks/usePostDetail";
import { useComments } from "@/hooks/useComments";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function CommunityDetail() {
    const location = useLocation();
    const selectedCategory = location.state?.selectedCategory ?? "전체"; // 선택된 카테고리
    const navigate = useNavigate();
    const { postId } = useParams();
    const userInfo = useAuthStore((state) => state.user);
    const { isKebabOpen, setIsKebabOpen, kebabRef } = useKebab(); // 케밥 메뉴 관련 커스텀 훅
    const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false); // 게시글 삭제 확인 모달 열림 여부
    const { post, isLiked, isPinned, setIsPinned, handleToggleLike, handleTogglePin, handleDelete, isPostLoading } = usePostDetail(Number(postId));
    const { comments, getCommentsInfo, isCommentLoading } = useComments(Number(postId));

    // 게시글 세부 페이지에서 사이드바의 카테고리 클릭 시 이동
    const handleCategoryChange = (category: string) => {
        navigate("/community", { state: { selectedCategory: category } });
    };

    // 케밥 아이콘 내용물
    const kebabItems = [
        ...(userInfo?.role === 'MENTOR' || userInfo?.role === 'LEADER' ? [{
            label: isPinned ? "고정 해제" : "고정하기",
            onClick: () => {
                const newPinned = !isPinned;
                setIsPinned(newPinned);
                handleTogglePin(newPinned);
                setIsKebabOpen(false);
            },
        }] : []),
        ...(post?.userId === userInfo?.userId ? [{
            label: "수정하기",
            onClick: () => {
                navigate("/community/write", { state: { post } });
                setIsKebabOpen(false);
            },
        }] : []),
        ...(post?.userId === userInfo?.userId || userInfo?.role === 'MENTOR' || userInfo?.role === 'LEADER' ? [{
            label: "삭제하기",
            onClick: () => {
                setIsCancelModalOpen(true);
                setIsKebabOpen(false);
            },
        }] : []),
    ];

    return (
        <S.Container>
            <S.ForCenter>
                <CommunitySidebar
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                />
                <S.PostContainer>
                    <S.TopContainer>
                        <S.ForRow>
                            <S.Div style={{ cursor: "pointer" }} onClick={() => navigate("/community", { state: { selectedCategory }, replace: true })}>
                                <IoIosArrowBack size={30} color={isPostLoading ? '#e0e0e0' : colors.fill.yellow} />
                                {isPostLoading
                                    ? <Skeleton width={70} height={30} />
                                    : <S.Category>{CATEGORY_REVERSED[post?.category ?? '']}</S.Category>
                                }
                            </S.Div>
                        </S.ForRow>
                        <S.ForRow style={{ justifyContent: "space-between" }}>
                            <S.Div>
                                {post?.pinned && <MdPushPin size={30} color={colors.fill.yellow} />}
                                {isPostLoading
                                    ? <Skeleton height={45} width={400} />
                                    : <S.Title>
                                        {post?.tag && post?.category && `[${CATEGORY_TAGS_REVERSED[post.category][post.tag]}] `}
                                        {post?.postTitle}
                                    </S.Title>
                                }
                                <S.Div>
                                    <MdRemoveRedEye size={22} color={isPostLoading ? '#e0e0e0' : colors.fill.yellow} />
                                    {isPostLoading
                                        ? <Skeleton height={20} width={40} />
                                        : <S.ViewCount>{post?.viewers}</S.ViewCount>
                                    }
                                </S.Div>
                            </S.Div>
                            {kebabItems.length > 0 &&
                                <S.KebabWrapper ref={kebabRef}>
                                    <S.KebabIcon
                                        size={23}
                                        color={colors.fill.slate}
                                        onClick={() => setIsKebabOpen(prev => !prev)}
                                    />
                                    {isKebabOpen && <KebabMenu items={kebabItems} />}
                                </S.KebabWrapper>
                            }
                        </S.ForRow>
                        <S.ForRow>
                            <S.Div>
                                {isPostLoading
                                    ? <Skeleton circle width={25} height={25} />
                                    : <S.ProfileImg src={post?.userProfileImageUrl} />
                                }
                                {isPostLoading
                                    ? <Skeleton width={40} height={20} />
                                    : <S.Name>{post?.userName}</S.Name>
                                }
                            </S.Div>
                            {isPostLoading
                                ? <Skeleton width={100} height={20} />
                                : <S.UploadTime>{formatDateTime(post?.createdAt ?? '')}</S.UploadTime>
                            }
                        </S.ForRow>
                    </S.TopContainer>
                    <S.Divider />
                    {isPostLoading
                        ? <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <Skeleton height={20} width="70%"/>
                            <Skeleton height={20} width="50%" />
                        </div>
                        : <S.ContentContainer dangerouslySetInnerHTML={{ __html: renderMarkdown(post?.postContent ?? '') }} />
                    }
                    <S.ForRow>
                        <S.Div>
                            {isLiked
                                ? <FaHeart
                                    color={isPostLoading ? '#e0e0e0' : '#FF3535'}
                                    onClick={(e) => { e.stopPropagation(); if (!isPostLoading) handleToggleLike(); }}
                                    style={{ cursor: isPostLoading ? 'default' : 'pointer' }} />
                                : <FaRegHeart
                                    color={isPostLoading ? '#e0e0e0' : '#FF3535'}
                                    onClick={(e) => { e.stopPropagation(); if (!isPostLoading) handleToggleLike(); }}
                                    style={{ cursor: isPostLoading ? 'default' : 'pointer' }} />
                            }
                            {isPostLoading
                                ? <Skeleton width={40} height={20} />
                                : <S.LikeCount>{post?.likeCount}</S.LikeCount>
                            }
                        </S.Div>
                        <S.Div>
                            <FaRegComment color={isPostLoading ? '#e0e0e0' : colors.fill.yellow} />
                            {isPostLoading
                                ? <Skeleton width={40} height={20} />
                                : <S.CommentCount>{post?.commentCount}</S.CommentCount>
                            }
                        </S.Div>
                    </S.ForRow>
                    <S.Divider />
                    <S.CommentContainer>
                        <CommentWrite onSuccess={getCommentsInfo} />
                        {isCommentLoading
                            ? <Comment /> 
                            : comments.length > 0
                                ? comments.map((comment) => (
                                    <Comment comment={comment} key={comment.commentId} postId={Number(postId)} onSuccess={getCommentsInfo} />
                                ))
                                : <span style={{ alignSelf: 'center' }}>댓글이 없습니다.</span>
                        }
                    </S.CommentContainer>
                </S.PostContainer>
            </S.ForCenter>

            <ConfirmModal
                open={isCancelModalOpen}
                message={"게시글을 삭제하시겠어요?"}
                onCancel={() => setIsCancelModalOpen(false)}
                onConfirm={() => {
                    handleDelete();
                    navigate("/community");
                }}
                confirmLabel="삭제"
                confirmColor="#e05c5c"
                confirmLabelColor='white'
            />
        </S.Container>
    );
}