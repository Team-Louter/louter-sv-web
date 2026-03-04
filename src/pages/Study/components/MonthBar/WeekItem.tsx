import { useState } from "react";
import * as S from "./WeekItem.styled";
import { updateStudy, deleteStudy, type WeekContent } from "../../../../api/Study";

interface WeekItemProps {
  weekNumber: number;
  content: string;
  studyId: number;
  allWeeks: WeekContent[];
}

export default function WeekItem({
  weekNumber,
  content,
  studyId,
  allWeeks,
}: WeekItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);
  const [currentContent, setCurrentContent] = useState(content);
  const [isLoading, setIsLoading] = useState(false);

  // 수정 완료
  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const updatedWeeks = allWeeks.map((week) =>
        week.weekNumber === weekNumber
          ? { ...week, content: editValue }
          : week
      );
      await updateStudy(studyId, { weeks: updatedWeeks });
      setCurrentContent(editValue);
      setIsEditing(false);
    } catch (e) {
      alert("수정에 실패했어요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 수정 취소
  const handleCancel = () => {
    setEditValue(currentContent);
    setIsEditing(false);
  };

  // 삭제
  const handleDelete = async () => {
    if (!confirm(`${weekNumber}주차를 삭제할까요?`)) return;
    setIsLoading(true);
    try {
      await deleteStudy(studyId);
    } catch (e) {
      alert("삭제에 실패했어요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <S.Container>
        {weekNumber}주차
        <S.ContentContainer>
          {isEditing ? (
            <>
              <input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                disabled={isLoading}
              />
              <button onClick={handleUpdate} disabled={isLoading}>
                완료
              </button>
              <button onClick={handleCancel} disabled={isLoading}>
                취소
              </button>
            </>
          ) : (
            <>
              <S.DetailButton onClick={() => setIsEditing(true)}>
                {currentContent}
              </S.DetailButton>
              <button onClick={handleDelete} disabled={isLoading}>
                삭제
              </button>
            </>
          )}
        </S.ContentContainer>
      </S.Container>
    </>
  );
}