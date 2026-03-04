import * as S from "./WeekItem.styled";
import { type WeekContent } from "../../../../api/Study";

interface WeekItemProps {
  weekNumber: number;
  content?: string;
  studyId: number;
  allWeeks: WeekContent[];
  isCurrentWeek?: boolean;
  onAdd?: () => void;
  onDetail?: () => void;
}

export default function WeekItem({
  weekNumber,
  content,
  isCurrentWeek = false,
  onAdd,
  onDetail,
}: WeekItemProps) {

  // 현재 주차 - 더하기 버튼
  if (isCurrentWeek) {
    return (
      <S.Container>
        {weekNumber}주차
        <S.ContentContainer>
          <S.AddButton onClick={onAdd}>+</S.AddButton>
        </S.ContentContainer>
      </S.Container>
    );
  }

  // 내용 없음 - 빈 상태
  if (!content) {
    return (
      <S.Container>
        {weekNumber}주차
        <S.ContentContainer>
          <S.EmptyText>기록 없음</S.EmptyText>
        </S.ContentContainer>
      </S.Container>
    );
  }

  // 내용 있음 - 기본
  return (
    <S.Container>
      {weekNumber}주차
      <S.ContentContainer>
        <S.DetailButton onClick={onDetail}>{content}</S.DetailButton>
      </S.ContentContainer>
    </S.Container>
  );
}