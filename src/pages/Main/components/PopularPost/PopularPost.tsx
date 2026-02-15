import { dummyPopularPosts } from "@/constants/dummy";
import MainPost from "../MainPost/MainPost";
import * as S from "./PopularPost.styled";

export default function PopularPost () {
    return (
        <S.PopularContainer>
            <S.PopularTitle>실시간 인기글</S.PopularTitle>
            {dummyPopularPosts.map(post => (
                <MainPost title={post.title} viewCount={post.viewCount} key={post.id}/>
            ))}
        </S.PopularContainer>
    )
}