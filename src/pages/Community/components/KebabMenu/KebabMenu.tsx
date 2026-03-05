import * as S from "./KebabMenu.styled";

type KebabMenuProps = {
    items: { label: string; onClick: () => void }[];
};

export default function KebabMenu({ items }: KebabMenuProps) {
    return (
        <S.Container>
            {items.map((item) => (
                <S.Label key={item.label} onClick={item.onClick}>{item.label}</S.Label>
            ))}
        </S.Container>
    );
}