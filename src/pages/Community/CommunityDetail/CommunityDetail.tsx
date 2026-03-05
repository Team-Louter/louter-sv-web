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

export default function CommunityDetail() {
    const location = useLocation();
    const selectedCategory = location.state?.selectedCategory ?? "전체"; // 선택된 카테고리
    const navigate = useNavigate();
    const { postId } = useParams();
    const userInfo = useAuthStore((state) => state.user);
    const { isKebabOpen, setIsKebabOpen, kebabRef } = useKebab(); // 케밥 메뉴 관련 커스텀 훅
    const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false); // 게시글 삭제 확인 모달 열림 여부
    const { post, isLiked, isPinned, setIsPinned, handleToggleLike, handleTogglePin, handleDelete } = usePostDetail(Number(postId));
    const { comments, getCommentsInfo } = useComments(Number(postId));

    // 게시글이 없을 때
    if (!post) {
        return <S.Error>게시글을 찾을 수 없습니다.</S.Error>;
    }

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
        ...(post.userId === userInfo?.userId ? [{
            label: "수정하기",
            onClick: () => {
                navigate("/community/write", { state: { post } });
                setIsKebabOpen(false);
            },
        }] : []),
        ...(post.userId === userInfo?.userId || userInfo?.role === 'MENTOR' || userInfo?.role === 'LEADER' ? [{
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
                                <IoIosArrowBack size={30} color={colors.fill.yellow} />
                                <S.Category>{CATEGORY_REVERSED[post.category]}</S.Category>
                            </S.Div>
                        </S.ForRow>
                        <S.ForRow style={{ justifyContent: "space-between" }}>
                            <S.Div>
                                {post.pinned && <MdPushPin size={30} color={colors.fill.yellow} />}
                                <S.Title>
                                    {post.tag && `[${CATEGORY_TAGS_REVERSED[post.category][post.tag]}] `}
                                    {post.postTitle}
                                </S.Title>
                                <S.Div>
                                    <MdRemoveRedEye size={22} color={colors.fill.yellow} />
                                    <S.ViewCount>{post.viewers}</S.ViewCount>
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
                                <S.ProfileImg src={post.userProfileImageUrl}/>
                                <S.Name>{post.userName}</S.Name>
                            </S.Div>
                            <S.UploadTime>{formatDateTime(post.createdAt)}</S.UploadTime>
                        </S.ForRow>
                    </S.TopContainer>
                    <S.Divider />
                    <S.ContentContainer dangerouslySetInnerHTML={{ __html: renderMarkdown(post.postContent) }} />
                    <S.ForRow>
                        <S.Div>
                            {isLiked
                                ? <FaHeart color="#FF3535"
                                    onClick={(e) => { e.stopPropagation(); handleToggleLike(); }}
                                    style={{ cursor: "pointer" }} />
                                : <FaRegHeart color="#FF3535"
                                    onClick={(e) => { e.stopPropagation(); handleToggleLike(); }}
                                    style={{ cursor: "pointer" }} />
                            }
                            <S.LikeCount>{post.likeCount}</S.LikeCount>
                        </S.Div>
                        <S.Div>
                            <FaRegComment color={colors.fill.yellow} />
                            <S.CommentCount>{post.commentCount}</S.CommentCount>
                        </S.Div>
                    </S.ForRow>
                    <S.Divider />
                    <S.CommentContainer>
                        <CommentWrite onSuccess={getCommentsInfo}/>
                        {comments.length > 0
                            ? comments.map((comment) => (
                                <Comment comment={comment} key={comment.commentId} postId={Number(postId)} onSuccess={getCommentsInfo}/>))
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