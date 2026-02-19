import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CommunitySidebar from "../components/CommunitySidebar/CommunitySidebar";
import Posting from "../components/Posting/Posting";
import * as S from "./CommunityMain.styled";
import { dummyPosts } from "@/constants/dummy";
import { MdPushPin } from "react-icons/md";
import { colors } from "@/styles/values/_foundation";

export default function Community() {
    const location = useLocation();
    const [selectedCategory, setSelectedCategory] = useState(
        location.state?.selectedCategory ?? "전체"
    );
    const navigate = useNavigate();

    const filteredPosts = selectedCategory === "전체"
        ? dummyPosts
        : dummyPosts.filter((post) => post.category === selectedCategory);

    const pinnedPosts = filteredPosts.filter((post) => post.isPinned);
    const normalPosts = filteredPosts.filter((post) => !post.isPinned);

    return (
        <S.Container>
            <S.ForCenter>
                <CommunitySidebar
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                />
                <S.PostContainer>
                    {pinnedPosts.length > 0 && (
                        <>
                            <S.PinnedSection>
                                <S.PinnedLabel>
                                    <MdPushPin size={25} color={colors.fill.yellow} /> 고정된 게시물
                                </S.PinnedLabel>
                                {pinnedPosts.map((post) => (
                                    <Posting key={post.id} post={post} selectedCategory={selectedCategory} />
                                ))}
                            </S.PinnedSection>
                            <S.Divider />
                        </>
                    )}
                    {normalPosts.map((post) => (
                        <Posting key={post.id} post={post} selectedCategory={selectedCategory} />
                    ))}
                </S.PostContainer>
            </S.ForCenter>
            <S.WriteButton onClick={() => navigate('/community/write')}>게시글 작성</S.WriteButton>
        </S.Container>
    );
}