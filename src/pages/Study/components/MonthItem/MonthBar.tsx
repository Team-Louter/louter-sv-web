import { useState } from "react";
import * as S from "./MonthBar.styled";
import WeekItem from "./WeekItem";
import StudyModal from "../StudyModal/StudyModal";
import type { StudyResponse } from "../../../../api/Study";

interface MonthBarProps {
  month: number;
  studies: StudyResponse[];
  currentMonth: number;
  currentWeek: number;
  onStudyChange: () => void;
}

export default function MonthBar({ month, studies, currentMonth, currentWeek, onStudyChange }: MonthBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [selectedStudy, setSelectedStudy] = useState<StudyResponse | null>(null);

  const isFutureMonth = month > currentMonth;

  const handleOpen = (weekNumber: number, study?: StudyResponse) => {
    setSelectedWeek(weekNumber);
    setSelectedStudy(study ?? null);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <S.container>
        <S.MonthTitle isFuture={isFutureMonth}>{month}월</S.MonthTitle>
        <S.SortContainer>
          {[1, 2, 3, 4].map((weekNumber) => {
            // 해당 주차의 일지 중 가장 최근 것(id가 큰 것)을 찾음
            const study = studies
              .filter((s: any) => {
                let sWeek = s.weekNumber ?? s.week_number ?? s.week;
                // 만약 week 정보가 아예 없다면 createdAt 날짜로 계산 (최후의 수단)
                if (sWeek === undefined && s.createdAt) {
                  const date = new Date(s.createdAt);
                  sWeek = Math.ceil(date.getDate() / 7);
                }
                return Number(sWeek) === Number(weekNumber);
              })
              .sort((a: any, b: any) => {
                const aId = a.studyId ?? a.study_id ?? 0;
                const bId = b.studyId ?? b.study_id ?? 0;
                return Number(bId) - Number(aId);
              })[0];

            const isCurrentWeek = Number(month) === Number(currentMonth) && Number(weekNumber) === Number(currentWeek);
            const isPast =
              Number(month) < Number(currentMonth) ||
              (Number(month) === Number(currentMonth) && Number(weekNumber) < Number(currentWeek));

            return (
              <WeekItem
                key={weekNumber}
                weekNumber={weekNumber}
                title={study?.title} 
                content={study?.content}
                isCurrentWeek={isCurrentWeek}
                isPast={isPast}
                onAdd={() => handleOpen(weekNumber)}
                onDetail={() => handleOpen(weekNumber, study)}
              />
            );
          })}
        </S.SortContainer>
      </S.container>

      {isModalOpen && selectedWeek !== null && (
        <StudyModal
          month={month}
          weekNumber={selectedWeek}
          study={selectedStudy}
          isReadOnly={true}
          onClose={handleClose}
          onSuccess={() => {
            handleClose();
            onStudyChange();
          }}
        />
      )}
    </>
  );
}