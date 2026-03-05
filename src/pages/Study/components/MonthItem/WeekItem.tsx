import * as S from "./WeekItem.styled";
import StudyAddButton from "../../../../assets/study/studyAdd.png";

interface WeekItemProps {
  weekNumber: number;
  title?: string;
  content?: string;
  isCurrentWeek?: boolean;
  isPast?: boolean;
  onAdd?: () => void;
  onDetail?: () => void;
}

export default function WeekItem({
  weekNumber,
  title, 
  isCurrentWeek = false,
  isPast = false,
  onAdd,
  onDetail,
}: WeekItemProps) {

  // 이미 작성한 경우
  if (typeof title === 'string') {
    return (
      <S.Container>
        {weekNumber}주차
        <S.ContentContainer>
          <S.DetailButton onClick={onDetail}>
            {title.trim() === "" ? "(제목 없음)" : title}
          </S.DetailButton>
        </S.ContentContainer>
      </S.Container>
    );
  }
  
  // 현재 주차인데 아직 미작성
  if (isCurrentWeek) {
    return (
      <S.Container>
        {weekNumber}주차
        <S.ContentContainer>
          <S.AddButton src={StudyAddButton} onClick={onAdd} />
          <S.AddText>이번 주 학습을 돌아보며 기록해 볼까요?</S.AddText>
        </S.ContentContainer>
      </S.Container>
    );
  }

  // 지나간 주차
  if (isPast) {
    return (
      <S.Container>
        {weekNumber}주차
        <S.ContentContainer>
          <S.EmptyText>학습 일지가 없어요.</S.EmptyText>
        </S.ContentContainer>
      </S.Container>
    );
  }

  // 아직 오지 않은 주차
  return (
    <S.Container>
      {weekNumber}주차
      <S.ContentContainer>
        <S.EmptyText>기록 기간이 아니에요.</S.EmptyText>
      </S.ContentContainer>
    </S.Container>
  );
}