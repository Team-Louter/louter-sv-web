import { useLocation, useNavigate, useParams } from "react-router-dom";
import CommunitySidebar from "../components/CommunitySidebar/CommunitySidebar";
import * as S from "./CommunityDetail.styled";
import { IoIosArrowBack } from "react-icons/io";
import { colors } from "@/styles/values/_foundation";
import { MdRemoveRedEye } from "react-icons/md";
import { FaRegHeart, FaHeart, FaRegComment } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { formatDateTime } from "@/utils/FormatDate";
import Comment from "../components/Comment/Comment";
import CommentWrite from "../components/CommentWrite/CommentWrite";
import KebabMenu from "../components/KebabMenu/KebabMenu";
import { useKebab } from "@/hooks/useKebab";
import { MdPushPin } from "react-icons/md";
import { deletePost, getPostDetail, toggleLike, togglePin } from "@/api/Post";
import type { Comment as CommentType, Post } from "@/types/post";
import { CATEGORY_REVERSED, CATEGORY_TAGS_REVERSED } from "@/constants/Community";
import { renderMarkdown } from "@/utils/Markdown/MarkdownConfig";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";
import { getComments } from "@/api/Comment";
import type { User } from "@/types/user";
import { getUser } from "@/api/User";

export default function CommunityDetail() {
    const location = useLocation();
    const selectedCategory = location.state?.selectedCategory ?? "전체"; // 선택된 카테고리
    const navigate = useNavigate();
    const { postId } = useParams();
    const [post, setPost] = useState<Post|null>(null); // 게시글 세부 정보
    const [comments, setComments] = useState<CommentType[]>([]); // 댓글 정보
    const [userInfo, setUserInfo] = useState<User | null>(null); // 사용자 정보

    // 게시글 세부 정보 가져오기
    const getPostDetailInfo = async (postId: number) => {
        try {
            const data = await getPostDetail(postId);
            setPost(data);
        } catch (err) {
            console.error(err);
        }
    }

    // 댓글 정보 가져오기
    const getCommentsInfo = async (postId: number) => {
        try {
            const data = await getComments(postId);
            setComments(data);
        } catch (err) {
            console.error(err);
        }
    }

    const getUserInfo = async () => {
            try{
                const data = await getUser();
                setUserInfo(data);
            } catch(err) {
                console.error(err);
            }
        };

    useEffect(() => {
        getPostDetailInfo(Number(postId));
        getCommentsInfo(Number(postId));
        getUserInfo();
    }, [])

    // 좋아요 눌림 여부 가져오기
    useEffect(() => {
        if (post) {
            setIsLiked(post.isHearted ?? false);
            setIsPinned(post.pinned ?? false);
        }
    }, [post]);

    const [isLiked, setIsLiked] = useState<boolean>(post?.isHearted ?? false); // 좋아요를 눌렀는지 여부
    const [isPinned, setIsPinned] = useState<boolean>(post?.pinned ?? false); // 고정된 게시글인지 여부
    const { isKebabOpen, setIsKebabOpen, kebabRef } = useKebab(); // 케밥 메뉴 관련 커스텀 훅
    const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false); // 게시글 삭제 확인 모달 열림 여부

    // 게시글이 없을 때
    if (!post) {
        return <S.Error>게시글을 찾을 수 없습니다.</S.Error>;
    }

    // 게시글 세부 페이지에서 사이드바의 카테고리 클릭 시 이동
    const handleCategoryChange = (category: string) => {
        navigate("/community", { state: { selectedCategory: category } });
    };

    // 게시글 삭제하기
    const deletePostInfo = async () => {
        try {
            await deletePost(post.postId);
        } catch (err) {
            console.error(err);
        }
    }

    // 고정 여부 토글
    const togglePinPost = async (newPinned: boolean) => {
        try {
            await togglePin(post.postId, newPinned);

            const data = await getPostDetail(post.postId);
            setPost(data);
        } catch (err) {
            console.error(err);
        }
    }

    // 좋아요 눌림 여부 토글
    const toggleLikePost = async () => {
        try {
            await toggleLike(post.postId);
            setIsLiked(prev => !prev);

            const data = await getPostDetail(post.postId);
            setPost(data);
        } catch (err) {
            console.error(err);
        }
    }

    // 케밥 아이콘 내용물
    const kebabItems = [
        ...(userInfo?.role === 'MENTOR' || userInfo?.role === 'LEADER' ? [{
            label: isPinned ? "고정 해제" : "고정하기",
            onClick: () => {
                const newPinned = !isPinned;
                setIsPinned(newPinned);
                togglePinPost(newPinned); 
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
                                    onClick={(e) => { e.stopPropagation(); toggleLikePost(); }}
                                    style={{ cursor: "pointer" }} />
                                : <FaRegHeart color="#FF3535"
                                    onClick={(e) => { e.stopPropagation(); toggleLikePost(); }}
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
                        <CommentWrite onSuccess={() => getCommentsInfo(Number(postId))}/>
                        {comments.length > 0
                            ? comments.map((comment) => (
                                <Comment comment={comment} key={comment.commentId} postId={Number(postId)} onSuccess={() => getCommentsInfo(Number(postId))}/>))
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
                    deletePostInfo();
                    navigate("/community");
                }}
                confirmLabel="삭제"
                confirmColor="#e05c5c"
                confirmLabelColor='white'
            />
        </S.Container>
    );
}