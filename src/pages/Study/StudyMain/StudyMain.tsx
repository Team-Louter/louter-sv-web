import { useEffect, useState } from "react";
import * as S from "./StudyMain.styled";
import MonthBar from "../components/MonthBar/MonthBar";
// import StudyModal from "../components/StudyModal/StudyModal";
import { getStudy, type StudyResponse } from "../../../api/Study";

// TODO: 백엔드 API 완성 후 제거
const MOCK_DATA: StudyResponse = {
  studyId: 1,
  title: "프론트엔드 스터디",
  month: 3,
  weeks: [
    { weekNumber: 1, content: "html, css, js 공부했어요" },
    { weekNumber: 2, content: "React 기초 공부했어요" },
    { weekNumber: 3, content: "TypeScript 공부했어요" },
    { weekNumber: 4, content: "프로젝트 적용했어요" },
  ],
  createdAt: "",
  updatedAt: "",
};

const IS_MOCK = true; // 백엔드 준비되면 false로 변경

export default function StudyMain() {
  const [studyData, setStudyData] = useState<StudyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: useParams() 등으로 교체
  const studyId = 1;

  useEffect(() => {
    const fetchStudy = async () => {
      if (IS_MOCK) {
        setStudyData(MOCK_DATA);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const data = await getStudy(studyId);
        setStudyData(data);
      } catch (e) {
        setError("스터디 정보를 불러오지 못했어요.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudy();
  }, [studyId]);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!studyData) return null;

  return (
    <>
      <S.container>
        <MonthBar
          month={studyData.month}
          weeks={studyData.weeks}
          studyId={studyData.studyId}
        />
      </S.container>
    </>
  );
}