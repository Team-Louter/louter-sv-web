import { colors } from "@/styles/values/_foundation";
import * as S from "./Posting.styled";
import { MdRemoveRedEye } from "react-icons/md";
import { FaRegHeart, FaHeart, FaRegComment } from "react-icons/fa6";
import { useState } from "react";
import type { postProps } from "@/types/post";
import { formatDateTime } from "@/utils/FormatDate";
import { useNavigate } from "react-router-dom";

export default function Posting({ post, selectedCategory }: postProps) {
    const [isLiked, setIsLiked] = useState<boolean>(post.isHearted || false);
    const navigate = useNavigate();

    return (
        <S.Container
            $isPinned={post.isPinned}
            onClick={() => navigate(`/community/${post.id}`, { state: { selectedCategory } })}
        >
            <S.ForColumn>
                <S.ForRow>
                    <S.Category>{post.category}</S.Category>
                    <S.Title>
                        {post.tag && <span>[{post.tag}] </span>}
                        {post.title}
                    </S.Title>
                    <S.Div>
                        <MdRemoveRedEye size={22} color={colors.fill.yellow} />
                        <S.ViewCount>{post.views}</S.ViewCount>
                    </S.Div>
                </S.ForRow>
                <S.ForRow>
                    <S.Content>{post.content}</S.Content>
                </S.ForRow>
                <S.ForRow>
                    <S.Div>
                        <S.ProfileImg />
                        <S.Name>{post.author}</S.Name>
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
                        <S.LikeCount>{post.likes}</S.LikeCount>
                    </S.Div>
                    <S.Div>
                        <FaRegComment color={colors.fill.yellow} />
                        <S.CommentCount>{post.comments}</S.CommentCount>
                    </S.Div>
                </S.ForRow>
            </S.ForColumn>
            <S.Img />
        </S.Container>
    );
}