import type { CommunitySidebarProps } from "@/types/community";
import * as S from "./CommunitySidebar.styled";
import { CATEGORIES } from "@/constants/Community";

export default function CommunitySidebar({ selectedCategory, onCategoryChange }: CommunitySidebarProps) {
    return (
        <S.Container>
            <S.Title>카테고리</S.Title>
            {CATEGORIES.map((category) => (
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