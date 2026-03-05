import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CommunitySidebar from "../components/CommunitySidebar/CommunitySidebar";
import Posting from "../components/Posting/Posting";
import * as S from "./CommunityMain.styled";
import { MdPushPin } from "react-icons/md";
import { colors } from "@/styles/values/_foundation";
import { getAllPost, getCategoryPost } from "@/api/Post";
import type { Post } from "@/types/post";
import { CATEGORIES } from "@/constants/Community";

export default function Community() {
    const location = useLocation(); // 게시글 세부 페이지에서 선텍한 카테고리 받아오기 (사이드바로 넘겨주기 위함)
    const [selectedCategory, setSelectedCategory] = useState( // 선택한 카테고리
        location.state?.selectedCategory ?? "전체"
    );
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]|null>(null); // 게시글 목록 정보
    const [maxPage, setMaxPage] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);

    // 전체 게시글 정보 가져오기
    const getAllPostInfo = async () => {
        try {
            const data = await getAllPost({
                page: currentPage,
                size: 10,
                sort: [
                    "pinned,desc",
                    "createdAt,desc"
                ]
            });
            setPosts(data.content);
            setMaxPage(data.totalPages);

        } catch (err) {
            console.error(err);
        }
    };

    // 카테고리별 게시글 정보 가져오기
    const getCategoryPostInfo = async (category: string) => {
        try {
            const data = await getCategoryPost(category, {
                page: currentPage,
                size: 10,
                sort: [
                    "pinned,desc",
                    "createdAt,desc"
                ]
            });
            setPosts(data.content);
            setMaxPage(data.totalPages);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (selectedCategory === '전체') {
            getAllPostInfo();
        } else {
            getCategoryPostInfo(CATEGORIES[selectedCategory]);
        }
    }, [selectedCategory, currentPage])

    // 고정된 게시글과 고정되지 않은 게시글 분리
    const pinnedPosts = posts?.filter((post) => post.pinned) ?? [];
    const normalPosts = posts?.filter((post) => !post.pinned) ?? [];

    return (
        <S.Container>
            <S.ForCenter>
                <CommunitySidebar
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                />
                <S.ForColumn>
                    <S.PostContainer>
                        {pinnedPosts.length > 0 && (
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
                        {normalPosts.map((post) => (
                            <Posting key={post.postId} post={post} selectedCategory={selectedCategory} />
                        ))}
                    </S.PostContainer>
                    <S.PageBtnContainer>
                        {[...Array(maxPage)].map((_, i) => (
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