import * as S from "./MonthBar.styled";
import WeekItem from "./WeekItem";
import type { WeekContent } from "../../../../api/Study";

interface MonthBarProps {
  month: number;
  weeks: WeekContent[];
  studyId: number;
}

export default function MonthBar({ month, weeks, studyId }: MonthBarProps) {
  return (
    <>
      <S.container>
        <S.MonthTitle>{month}월</S.MonthTitle>
        <S.SortContainer>
          {weeks.map((week, index) => (
            <>
              <WeekItem
                key={week.weekNumber}
                weekNumber={week.weekNumber}
                content={week.content}
                studyId={studyId}
                allWeeks={weeks}
              />
              {index < weeks.length - 1 && <S.Divider />}
            </>
          ))}
        </S.SortContainer>
      </S.container>
    </>
  );
}