import { useLocation, useNavigate, useParams } from "react-router-dom";
import CommunitySidebar from "../components/CommunitySidebar/CommunitySidebar";
import * as S from "./CommunityDetail.styled";
import { IoIosArrowBack } from "react-icons/io";
import { colors } from "@/styles/values/_foundation";
import { MdRemoveRedEye } from "react-icons/md";
import { FaRegHeart, FaHeart, FaRegComment } from "react-icons/fa6";
import { useState } from "react";
import { dummyPosts } from "@/constants/dummy";
import { formatDateTime } from "@/utils/FormatDate";
import Comment from "../components/Comment/Comment";
import { dummyComments } from "@/constants/dummy";
import CommentWrite from "../components/CommentWrite/CommentWrite";
import KebabMenu from "../components/KebabMenu/KebabMenu";
import { useKebab } from "@/hooks/useKebab";
import { MdPushPin } from "react-icons/md";

export default function CommunityDetail() {
    const location = useLocation();
    const selectedCategory = location.state?.selectedCategory ?? "전체"; // 선택된 카테고리
    const navigate = useNavigate();
    const { postId } = useParams();

    const post = dummyPosts.find((p) => p.id === Number(postId)); // 게시글 더미에서 해당 게시글 정보만 가져오기
    const [isLiked, setIsLiked] = useState<boolean>(post?.isHearted ?? false); // 좋아요를 눌렀는지 여부
    const [isPinned, setIsPinned] = useState<boolean>(false); // 고정된 게시글인지 여부
    const { isKebabOpen, setIsKebabOpen, kebabRef } = useKebab(); // 케밥 메뉴 관련 커스텀 훅
    const postComment = dummyComments.filter((e) => e.postId === Number(postId)); // 해당 게시글에 달린 댓글만 가져오기

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
        {
            label: isPinned ? "고정 해제" : "고정하기",
            onClick: () => {
                setIsPinned(prev => !prev);
                setIsKebabOpen(false);
            },
        },
        {
            label: "수정하기",
            onClick: () => {
                navigate("/community/write", { state: { post } });
                setIsKebabOpen(false);
            },
        },
        {
            label: "삭제하기",
            onClick: () => setIsKebabOpen(false),
        },
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
                                <S.Category>{post.category}</S.Category>
                            </S.Div>
                        </S.ForRow>
                        <S.ForRow style={{ justifyContent: "space-between" }}>
                            <S.Div>
                                {isPinned && <MdPushPin size={30} color={colors.fill.yellow} />}
                                <S.Title>
                                    {post.tag && `[${post.tag}] `}
                                    {post.title}
                                </S.Title>
                                <S.Div>
                                    <MdRemoveRedEye size={22} color={colors.fill.yellow} />
                                    <S.ViewCount>{post.views}</S.ViewCount>
                                </S.Div>
                            </S.Div>
                            <S.KebabWrapper ref={kebabRef}>
                                <S.KebabIcon
                                    size={23}
                                    color={colors.fill.slate}
                                    onClick={() => setIsKebabOpen(prev => !prev)}
                                />
                                {isKebabOpen && <KebabMenu items={kebabItems} />}
                            </S.KebabWrapper>
                        </S.ForRow>
                        <S.ForRow>
                            <S.Div>
                                <S.ProfileImg />
                                <S.Name>{post.author}</S.Name>
                            </S.Div>
                            <S.UploadTime>{formatDateTime(post.createdAt)}</S.UploadTime>
                        </S.ForRow>
                    </S.TopContainer>
                    <S.Divider />
                    <S.ContentContainer>{post.content}</S.ContentContainer>
                    <S.ForRow>
                        <S.Div>
                            {isLiked
                                ? <FaHeart color="#FF3535"
                                    onClick={(e) => { e.stopPropagation(); setIsLiked(false); }}
                                    style={{ cursor: "pointer" }} />
                                : <FaRegHeart color="#FF3535"
                                    onClick={(e) => { e.stopPropagation(); setIsLiked(true); }}
                                    style={{ cursor: "pointer" }} />
                            }
                            <S.LikeCount>{post.likes}</S.LikeCount>
                        </S.Div>
                        <S.Div>
                            <FaRegComment color={colors.fill.yellow} />
                            <S.CommentCount>{post.comments}</S.CommentCount>
                        </S.Div>
                    </S.ForRow>
                    <S.Divider />
                    <S.CommentContainer>
                        <CommentWrite />
                        {postComment.length > 0
                            ? postComment.map((comment) => (
                                <Comment comment={comment} key={comment.id} />))
                            : <span style={{ alignSelf: 'center' }}>댓글이 없습니다.</span>
                        }
                    </S.CommentContainer>
                </S.PostContainer>
            </S.ForCenter>
        </S.Container>
    );
}