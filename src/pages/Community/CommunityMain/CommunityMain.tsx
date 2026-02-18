import { useState } from "react";
import CommunitySidebar from "../components/CommunitySidebar/CommunitySidebar";
import Posting from "../components/Posting/Posting";
import * as S from "./CommunityMain.styled";
import { dummyPosts } from "@/constants/dummy";

export default function Community() {
    const [selectedCategory, setSelectedCategory] = useState("전체");

    const filteredPosts = selectedCategory === "전체"
        ? dummyPosts
        : dummyPosts.filter((post) => post.category === selectedCategory);

    return (
        <S.Container>
            <S.ForCenter>
                <CommunitySidebar
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                />
                <S.PostContainer>
                    {filteredPosts.map((post) => (
                        <Posting key={post.id} post={post} />
                    ))}
                </S.PostContainer>
            </S.ForCenter>
            <S.WriteButton>게시글 작성</S.WriteButton>
        </S.Container>
    );
}