import { useLocation, useNavigate } from "react-router-dom";
import CommunitySidebar from "../components/CommunitySidebar/CommunitySidebar";
import * as S from "./CommunityDetail.styled";

export default function CommunityDetail() {
    const location = useLocation();
    const selectedCategory = location.state?.selectedCategory ?? "전체";
    const navigate = useNavigate();

    const handleCategoryChange = (category: string) => {
        navigate("/community", { state: { selectedCategory: category } });
    };

    return (
        <S.Container>
            <S.ForCenter>
                <CommunitySidebar
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                />
                <S.PostContainer>
                </S.PostContainer>
            </S.ForCenter>
        </S.Container>
    );
}