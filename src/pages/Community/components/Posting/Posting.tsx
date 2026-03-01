import { colors } from "@/styles/values/_foundation";
import * as S from "./Posting.styled";
import { MdRemoveRedEye } from "react-icons/md";
import { FaRegHeart, FaHeart, FaRegComment } from "react-icons/fa6";
import { useState } from "react";
import type { postProps } from "@/types/post";
import { formatDateTime } from "@/utils/FormatDate";
import { useNavigate } from "react-router-dom";
import { CATEGORY_REVERSED, CATEGORY_TAGS_REVERSED } from "@/constants/Community";

export default function Posting({ post, selectedCategory }: postProps) { 
    const [isLiked, setIsLiked] = useState<boolean>(post.isHearted || false); // 좋아요 누름 여부
    const navigate = useNavigate();

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
                                onClick={(e) => { e.stopPropagation(); setIsLiked(false); }}
                                style={{ cursor: "pointer" }} />
                            : <FaRegHeart color="#FF3535"
                                onClick={(e) => { e.stopPropagation(); setIsLiked(true); }}
                                style={{ cursor: "pointer" }} />
                        }
                        <S.LikeCount>{post.likeCount}</S.LikeCount>
                    </S.Div>
                    <S.Div>
                        <FaRegComment color={colors.fill.yellow} />
                        <S.CommentCount>{post.commentCount}</S.CommentCount>
                    </S.Div>
                </S.ForRow>
            </S.ForColumn>
            <S.Img />
        </S.Container>
    );
}