import { colors } from "@/styles/values/_foundation";
import * as S from "./Posting.styled";
import { MdRemoveRedEye } from "react-icons/md";
import { FaRegHeart, FaHeart, FaRegComment } from "react-icons/fa6";
import { useState } from "react";
import type { Post } from "@/types/post";
import { formatDateTime } from "@/utils/FormatDate";
import { useNavigate } from "react-router-dom";
import { CATEGORY_REVERSED, CATEGORY_TAGS_REVERSED } from "@/constants/Community";
import { toggleLike } from "@/api/Post";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export type postProps = {
  post: Post;
  selectedCategory: string;
  isLoading?: boolean;
};

const stripMarkdown = (text: string): string => {
  return text
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/~~(.+?)~~/g, '$1')
    .replace(/`{3}[\s\S]*?`{3}/g, '')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/!\[.*?\]\(.+?\)/g, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/^\s*>\s+/gm, '')
    .replace(/---+|===+/g, '')
    .replace(/\n+/g, ' ')
    .trim();
};

export default function Posting({ post, selectedCategory, isLoading }: postProps) {
    const [isLiked, setIsLiked] = useState<boolean>(post.isHearted || false);
    const [likeCount, setLikeCount] = useState<number>(post.likeCount ?? 0);
    const navigate = useNavigate();

    const imageFiles = post.files?.filter(file =>
        file.fileUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)
    ) ?? [];

    const toggleLikePost = async () => {
        const prevIsLiked = isLiked;
        const prevLikeCount = likeCount;

        const nextLiked = !isLiked;
        setIsLiked(nextLiked);
        setLikeCount(prev => nextLiked ? prev + 1 : prev - 1);

        try {
            await toggleLike(post.postId);
        } catch (err) {
            setIsLiked(prevIsLiked);
            setLikeCount(prevLikeCount);
        }
    }

    const handleLikeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isLoading) toggleLikePost();
    }

    return (
        <S.Container
            $isPinned={post.pinned}
            onClick={() => { if (!isLoading) navigate(`/community/${post.postId}`, { state: { selectedCategory } }) }}
        >
            <S.ForColumn>
                <S.ForRow style={{flex: 1}}>
                    {isLoading
                        ? <Skeleton height={25} borderRadius={100} width={70}/>
                        : <S.Category>{CATEGORY_REVERSED[post.category]}</S.Category>
                    }
                    {isLoading
                        ? <S.TitleSkeleton/>
                        : <S.TitleWithView>
                            <S.Title>
                                {post.tag && <span>[{CATEGORY_TAGS_REVERSED[post.category][post.tag]}] </span>}
                                {post.postTitle}
                            </S.Title>
                            <S.ViewDiv>
                                <MdRemoveRedEye size={22} color={colors.fill.yellow} />
                                <S.ViewCount>{post.viewers}</S.ViewCount>
                            </S.ViewDiv>
                          </S.TitleWithView>
                    }
                </S.ForRow>

                <S.ForRow>
                    {isLoading
                        ? <div style={{ width: '100%' }}><Skeleton height={20} /></div>
                        : <S.Content>{stripMarkdown(post.postContent)}</S.Content>
                    }
                </S.ForRow>

                <S.ForRow>
                    <S.Div>
                        {isLoading
                            ? <Skeleton circle height={25} width={25}/>
                            : <S.ProfileImg src={post.userProfileImageUrl}/>
                        }
                        {isLoading ? <Skeleton width={40} height={20}/> : <S.Name>{post.userName}</S.Name>}
                    </S.Div>

                    {isLoading
                        ? <Skeleton width={100} height={20}/>
                        : <S.UploadTime>{formatDateTime(post.createdAt)}</S.UploadTime>
                    }

                    <S.HideOnMobile>
                        {isLiked
                            ? <FaHeart
                                color={isLoading ? '#e0e0e0' : '#FF3535'}
                                onClick={handleLikeClick}
                                style={{ cursor: isLoading ? "default" : "pointer" }} />
                            : <FaRegHeart
                                color={isLoading ? '#e0e0e0' : '#FF3535'}
                                onClick={handleLikeClick}
                                style={{ cursor: isLoading ? "default" : "pointer" }} />
                        }
                        {isLoading ? <Skeleton width={40} height={20}/> : <S.LikeCount>{likeCount}</S.LikeCount>}
                    </S.HideOnMobile>

                    <S.HideOnMobile>
                        <FaRegComment color={isLoading ? '#e0e0e0' : colors.fill.yellow} />
                        {isLoading ? <Skeleton width={40} height={20}/> : <S.CommentCount>{post.commentCount}</S.CommentCount>}
                    </S.HideOnMobile>
                </S.ForRow>
            </S.ForColumn>

            {isLoading && <S.SkeletonImg/>}
            {!isLoading && imageFiles.length > 0 &&
                <S.ImgContainer>
                    {imageFiles.length > 1 && <S.ImgOverlay>+{imageFiles.length - 1}</S.ImgOverlay>}
                    <S.Img src={imageFiles[0].fileUrl}/>
                </S.ImgContainer>
            }
        </S.Container>
    );
}