import { useCallback, useEffect, useState } from "react";
import Post from "../components/StudyPost/StudyPost";
import * as S from "./StudyMentor.styled";
import { getStudies, type StudyResponse } from "@/api/Study";
import LeftArrow from "../../../assets/study/Arrow.png";
import StudyModal from "../components/StudyModal/StudyModal";

export default function StudyMentor() {
  const [studies, setStudies] = useState<StudyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState<StudyResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 현재 날짜 기준 초기 값 설정
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1);
  const [viewWeek, setViewWeek] = useState(Math.ceil(today.getDate() / 7));

  const fetchAllStudies = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getStudies();
      const studyList = Array.isArray(data) ? data : (data as any).content || [];
      setStudies(studyList);
    } catch (error) {
      console.error("학습일지를 불러오는데 실패했습니다.", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllStudies();
  }, [fetchAllStudies]);

  // 주차 이동
  const handlePrevWeek = () => {
    if (viewWeek > 1) {
      setViewWeek(viewWeek - 1);
    } else {
      if (viewMonth > 1) {
        setViewMonth(viewMonth - 1);
        setViewWeek(4); // 이전 달의 마지막 주로 이동
      }
    }
  };

  const handleNextWeek = () => {
    if (viewWeek < 4) {
      setViewWeek(viewWeek + 1);
    } else {
      if (viewMonth < 12) {
        setViewMonth(viewMonth + 1);
        setViewWeek(1);
      }
    }
  };

  const handleOpenDetail = (study: StudyResponse) => {
    setSelectedStudy(study);
    setIsModalOpen(true);
  };

  // 현재 선택된 월/주차에 해당하는 데이터 필터링
  const filteredStudies = studies.filter((s: any) => {
    const sMonth = s.month ?? s.month_number ?? s.monthNumber;
    const sWeek = s.weekNumber ?? s.week_number ?? s.week;
    
    // 필드 정보가 없을 경우
    let finalMonth = sMonth;
    let finalWeek = sWeek;
    
    if (finalMonth === undefined && s.createdAt) {
      finalMonth = new Date(s.createdAt).getMonth() + 1;
    }
    if (finalWeek === undefined && s.createdAt) {
      finalWeek = Math.ceil(new Date(s.createdAt).getDate() / 7);
    }

    return Number(finalMonth) === Number(viewMonth) && Number(finalWeek) === Number(viewWeek);
  });

  return (
    <S.Container>
      <S.NavHeader>
        <S.NavButton onClick={handlePrevWeek}>
          <img src={LeftArrow} alt="이전" style={{ transform: "rotate(0deg)" }} />
        </S.NavButton>
        <S.NavTitle>{viewMonth}월 {viewWeek}주차</S.NavTitle>
        <S.NavButton onClick={handleNextWeek}>
          <img src={LeftArrow} alt="다음" style={{ transform: "rotate(180deg)" }} />
        </S.NavButton>
      </S.NavHeader>

      {isLoading ? (
        <S.EmptyState>로딩 중...</S.EmptyState>
      ) : filteredStudies.length > 0 ? (
        <S.PostGrid>
          {filteredStudies.map((study) => (
            <Post 
              key={study.studyId || (study as any).study_id} 
              study={study} 
              onDetail={handleOpenDetail}
            />
          ))}
        </S.PostGrid>
      ) : (
        <S.EmptyState>학습 일지가 없어요.</S.EmptyState>
      )}

      {isModalOpen && selectedStudy && (
        <StudyModal
          month={viewMonth}
          weekNumber={viewWeek}
          study={selectedStudy}
          isReadOnly={true}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchAllStudies();
          }}
        />
      )}
    </S.Container>
  );
}