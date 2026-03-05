import { useState } from "react";
import * as S from "./StudyModal.styled";
import cancelImg from "../../../../assets/cancel.png";
import { createStudy, updateStudy, deleteStudy, type StudyResponse } from "../../../../api/Study";

interface StudyModalProps {
  month: number;
  weekNumber: number;
  study?: StudyResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StudyModal({ month, weekNumber, study, onClose, onSuccess }: StudyModalProps) {
  const [title, setTitle] = useState(study?.title ?? "");
  const [text, setText] = useState(study?.content ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const MAX_LENGTH = 1000;

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (study) {
        const id = study.studyId ?? (study as any).study_id;
        await updateStudy(id, { title, content: text });
      } else {
        await createStudy({ title, content: text, month, weekNumber });
      }
      onSuccess();
    } catch (e) {
      alert("저장에 실패했어요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!study) return;

    setIsLoading(true);
    try {
      const id = study.studyId ?? (study as any).study_id;
      await deleteStudy(id);
      onSuccess();
    } catch (e) {
      alert("삭제에 실패했어요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <S.Overlay>
      <S.Container onClick={(e) => e.stopPropagation()}>
        <S.TitleCancelContainer>
          <S.Wrapper />
          <S.Title>
            {month}월 {weekNumber}주차 학습 일지 {study ? "수정" : "기록"}
          </S.Title>
          <S.Cancel src={cancelImg} onClick={onClose} />
        </S.TitleCancelContainer>

        <S.StudyInputContainer>
          <S.StudyTitleInput
            placeholder="제목을 입력해 주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <S.StudyInputdivider />
        </S.StudyInputContainer>

        <S.InputContainer
          maxLength={MAX_LENGTH}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="내용을 입력해 주세요."
        />
        <S.CharCount>{text.length}/{MAX_LENGTH}</S.CharCount>
        
        <S.Button onClick={handleSubmit} disabled={isLoading}>
          {study ? "수정 완료" : "기록 완료"}
        </S.Button>
        {study && (
          <S.DeleteButton onClick={handleDelete} disabled={isLoading}>
            삭제하기
          </S.DeleteButton>
        )}
      </S.Container>
    </S.Overlay>
  );
}