import { useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    const fetchStudies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getMyStudies();
        setStudies(data);
      } catch (e) {
        setError("스터디 정보를 불러오지 못했어요.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudies();
  }, []);

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
          // 해당 월 데이터만 필터링해서 전달
          studies={studies.filter((s) => s.month === month)}
          currentMonth={currentMonth}
          currentWeek={currentWeek}
        />
      ))}
    </S.container>
  );
}