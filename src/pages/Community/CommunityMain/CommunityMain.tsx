import CommunitySidebar from "../components/CommunitySidebar/CommunitySidebar";
import Posting from "../components/Posting/Posting";
import * as S from "./CommunityMain.styled";
import { dummyPosts } from "@/constants/dummy";

export default function Community() {
    return (
        <S.Container>
            <S.ForCenter>
                <CommunitySidebar/>
                <S.PostContainer>
                    {dummyPosts.map((post) => (
                        <Posting post={post}/>
                    ))}
                </S.PostContainer>
            </S.ForCenter>
        </S.Container>
    )
}