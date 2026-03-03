import { colors } from "@/styles/values/_foundation";
import * as S from "./Posting.styled";
import { MdRemoveRedEye } from "react-icons/md";
import { FaRegHeart, FaHeart, FaRegComment } from "react-icons/fa6";
import { useState } from "react";
import type { postProps } from "@/types/post";
import { formatDateTime } from "@/utils/FormatDate";
import { useNavigate } from "react-router-dom";
import { CATEGORY_REVERSED, CATEGORY_TAGS_REVERSED } from "@/constants/Community";
import { toggleLike } from "@/api/Post";

export default function Posting({ post, selectedCategory }: postProps) { 
    const [isLiked, setIsLiked] = useState<boolean>(post.isHearted || false); // 좋아요 누름 여부
    const [likeCount, setLikeCount] = useState<number>(post.likeCount ?? 0);
    const navigate = useNavigate();

    // 좋아요 눌림 여부 토글
    const toggleLikePost = async () => {
        try {
            await toggleLike(post.postId);
            setIsLiked(prev => !prev);
            setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <S.Container
            $isPinned={post.pinned}
            onClick={() => navigate(`/community/${post.postId}`, { state: { selectedCategory } })}
        >
            <S.ForColumn>
                <S.ForRow>
                    <S.Category>{CATEGORY_REVERSED[post.category]}</S.Category>
                    <S.Title>
                        {post.tag && <span>[{CATEGORY_TAGS_REVERSED[post.category][post.tag]}] </span>}
                        {post.postTitle}
                    </S.Title>
                    <S.Div>
                        <MdRemoveRedEye size={22} color={colors.fill.yellow} />
                        <S.ViewCount>{post.viewers}</S.ViewCount>
                    </S.Div>
                </S.ForRow>
                <S.ForRow>
                    <S.Content>{post.postContent}</S.Content>
                </S.ForRow>
                <S.ForRow>
                    <S.Div>
                        <S.ProfileImg src={post.userProfileImageUrl}/>
                        <S.Name>{post.userName}</S.Name>
                    </S.Div>
                    <S.UploadTime>{formatDateTime(post.createdAt)}</S.UploadTime>
                    <S.Div>
                        {isLiked
                            ? <FaHeart color="#FF3535"
                                onClick={(e) => { e.stopPropagation(); toggleLikePost(); }}
                                style={{ cursor: "pointer" }} />
                            : <FaRegHeart color="#FF3535"
                                onClick={(e) => { e.stopPropagation(); toggleLikePost(); }}
                                style={{ cursor: "pointer" }} />
                        }
                        <S.LikeCount>{likeCount}</S.LikeCount>
                    </S.Div>
                    <S.Div>
                        <FaRegComment color={colors.fill.yellow} />
                        <S.CommentCount>{post.commentCount}</S.CommentCount>
                    </S.Div>
                </S.ForRow>
            </S.ForColumn>
            {post.files.length > 0
                ? <S.ImgContainer>
                    {post.files.length > 1 && <S.ImgOverlay>+{post.files.length -1}</S.ImgOverlay>}
                    <S.Img src={post.files[0].fileUrl}/>
                </S.ImgContainer> 
                : <></>
            }
        </S.Container>
    );
}