import * as S from "./CommunitySidebar.styled";
import { CATEGORIES } from "@/constants/Community";

interface CommunitySidebarProps {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

export default function CommunitySidebar({ selectedCategory, onCategoryChange }: CommunitySidebarProps) {
    return (
        <S.Container>
            <S.Title>카테고리</S.Title>
            {Object.keys(CATEGORIES).map((category) => (
                <S.Category
                    key={category}
                    $isSelected={selectedCategory === category}
                    onClick={() => onCategoryChange(category)}
                >
                    {category}
                </S.Category>
            ))}
        </S.Container>
    );
}