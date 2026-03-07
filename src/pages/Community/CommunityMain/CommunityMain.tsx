import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CommunitySidebar from "../components/CommunitySidebar/CommunitySidebar";
import Posting from "../components/Posting/Posting";
import * as S from "./CommunityMain.styled";
import { MdPushPin } from "react-icons/md";
import { colors } from "@/styles/values/_foundation";
import { usePostList } from "@/hooks/usePostList";
import type { Post } from "@/types/post";

export default function Community() {
    const location = useLocation();
    const [selectedCategory, setSelectedCategory] = useState(
        location.state?.selectedCategory ?? "전체"
    );
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState<number>(0);
    const { pinnedPosts, normalPosts, maxPage, isLoading } = usePostList(selectedCategory, currentPage);

    const skeletonPost = {} as Post;
    const displayNormalPosts = isLoading ? Array(10).fill(skeletonPost) : normalPosts;

    return (
        <S.Container>
            <S.ForCenter>
                <CommunitySidebar
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                />
                <S.ForColumn>
                    <S.PostContainer>
                        {!isLoading && pinnedPosts.length > 0 && (
                            <>
                                <S.PinnedSection>
                                    <S.PinnedLabel>
                                        <MdPushPin size={25} color={colors.fill.yellow} /> 고정된 게시물
                                    </S.PinnedLabel>
                                    {pinnedPosts.map((post) => (
                                        <Posting key={post.postId} post={post} selectedCategory={selectedCategory} />
                                    ))}
                                </S.PinnedSection>
                                <S.Divider />
                            </>
                        )}
                        {displayNormalPosts.map((post, i) => (
                            <Posting
                                key={isLoading ? i : post.postId}
                                post={post}
                                selectedCategory={selectedCategory}
                                isLoading={isLoading}
                            />
                        ))}
                    </S.PostContainer>
                    <S.PageBtnContainer>
                        {!isLoading && [...Array(maxPage)].map((_, i) => (
                            <S.PageBtn key={i} $isActive={currentPage === i} onClick={() => setCurrentPage(i)}>
                                {i + 1}
                            </S.PageBtn>
                        ))}
                    </S.PageBtnContainer>
                </S.ForColumn>
            </S.ForCenter>
            <S.WriteButton onClick={() => navigate('/community/write')}>게시글 작성</S.WriteButton>
        </S.Container>
    );
}