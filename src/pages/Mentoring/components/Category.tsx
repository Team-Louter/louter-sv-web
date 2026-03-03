import * as S from "./styles/Category.styled";

type Props = {
  selected: "mentor" | "mentee";
  onSelect: (role: "mentor" | "mentee") => void;
};

export default function Category({ selected, onSelect }: Props) {
  return (
    <S.Container>
      <S.Item
        $active={selected === "mentor"}
        onClick={() => onSelect("mentor")}
      >
        멘토
      </S.Item>

      <S.Item
        $active={selected === "mentee"}
        onClick={() => onSelect("mentee")}
      >
        멘티
      </S.Item>
    </S.Container>
  );
}