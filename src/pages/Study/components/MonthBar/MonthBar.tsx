import { useState } from "react";
import * as S from "./MonthBar.styled";
import WeekItem from "./WeekItem";
import StudyModal from "../StudyModal/StudyModal";
import type { WeekContent } from "../../../../api/Study";

interface MonthBarProps {
  month: number;
  weeks: WeekContent[];
  studyId: number;
  currentWeek?: number;
}

export default function MonthBar({ month, weeks, studyId, currentWeek }: MonthBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  const handleOpen = (weekNumber: number) => {
    setSelectedWeek(weekNumber);
    setIsModalOpen(true);
  };

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
                isCurrentWeek={week.weekNumber === currentWeek}
                onAdd={() => handleOpen(week.weekNumber)}
                onDetail={() => handleOpen(week.weekNumber)}
              />
              {index < weeks.length - 1 && <S.Divider />}
            </>
          ))}
        </S.SortContainer>
      </S.container>

      {isModalOpen && selectedWeek !== null && (
        <StudyModal
          month={month}
          weekNumber={selectedWeek}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}