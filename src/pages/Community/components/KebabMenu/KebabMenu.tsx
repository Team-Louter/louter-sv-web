import type { KebabMenuProps } from "@/types/community";
import * as S from "./KebabMenu.styled";

export default function KebabMenu({ items }: KebabMenuProps) {
    return (
        <S.Container>
            {items.map((item) => (
                <S.Label key={item.label} onClick={item.onClick}>{item.label}</S.Label>
            ))}
        </S.Container>
    );
}