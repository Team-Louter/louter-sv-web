import * as S from "./KebabMenu.styled";

interface KebabMenuProps {
    items: string[];
}

export default function KebabMenu({ items }: KebabMenuProps) {
    return (
        <S.Container>
            {items.map((item) => (
                <S.Label key={item}>{item}</S.Label>
            ))}
        </S.Container>
    )
}