import { useEffect, useState } from "react";
import MainPost from "../MainPost/MainPost";
import * as S from "./PopularPost.styled";
import { getHotPost } from "@/api/Post";
import type { HotPost } from "@/types/post";

export default function PopularPost () {
    const [hotPosts, setHotPosts] = useState<HotPost[]|null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getHotPostInfo = async () => {
        setIsLoading(true);
        try{
            const data = await getHotPost();
            setHotPosts(data);
        } catch(err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getHotPostInfo();
    }, [])

    return (
        <S.PopularContainer>
            <S.PopularTitle>실시간 인기글</S.PopularTitle>
            {isLoading
                ? [...Array(3)].map((_, i) => <S.PostSkeleton key={i} />)
                : (hotPosts?.length ?? 0) > 0
                    ? hotPosts?.map(post => (
                        <MainPost title={post.postTitle} viewCount={post.viewers} key={post.postId} id={post.postId} />
                    ))
                    : <span style={{ alignSelf: 'center', marginTop: 100 }}>인기글이 없습니다.</span>
            }
        </S.PopularContainer>
    )
}