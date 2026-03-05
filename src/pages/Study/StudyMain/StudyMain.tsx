import { useCallback, useEffect, useRef, useState } from "react";
import * as S from "./StudyMain.styled";
import MonthBar from "../components/MonthItem/MonthBar";
import { getMyStudies, type StudyResponse } from "../../../api/Study";

const MONTHS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const today = new Date();
const currentMonth = today.getMonth() + 1;
const currentWeek = Math.ceil(today.getDate() / 7);

export default function StudyMain() {
  const [studies, setStudies] = useState<StudyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const scrollTop = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startY.current = e.clientY;
    scrollTop.current = scrollRef.current.scrollTop;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const walk = e.clientY - startY.current;
    scrollRef.current.scrollTop = scrollTop.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const fetchStudies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getMyStudies();
      let studyList: StudyResponse[] = [];
      if (Array.isArray(response)) {
        studyList = response;
      } else if (response && typeof response === 'object') {
        const anyResponse = response as any;
        studyList = anyResponse.data || anyResponse.content || anyResponse.studies || [];
      }
      
      setStudies(studyList);
    } catch (e) {
      setError("스터디 정보를 불러오지 못했어요.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudies();
  }, [fetchStudies]);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <S.container
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {MONTHS.map((month) => (
        <MonthBar
          key={month}
          month={month}
          studies={studies.filter((s: any) => {
            // month 필드가 있으면 우선 사용, 없으면 createdAt에서 추출 (최후의 수단)
            let sMonth = s.month ?? s.month_number ?? s.monthNumber;
            if (sMonth === undefined && s.createdAt) {
              sMonth = new Date(s.createdAt).getMonth() + 1;
            }
            return Number(sMonth) === Number(month);
          })}
          currentMonth={currentMonth}
          currentWeek={currentWeek}
          onStudyChange={fetchStudies}
        />
      ))}
    </S.container>
  );
}