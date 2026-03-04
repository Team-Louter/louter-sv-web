import { useState } from "react";
import * as S from "./StudyModal.styled";
import cancelImg from "../../../../assets/cancel.png";

interface StudyModalProps {
  month: number;
  weekNumber: number;
  onClose: () => void;
}

export default function StudyModal({ month, weekNumber, onClose }: StudyModalProps) {
  const [text, setText] = useState("");
  const MAX_LENGTH = 1000;

  return (
    <>
      <S.Container>
        <S.TitleCancelContainer>
          <S.Wrapper />
          <S.Title>{month}월 {weekNumber}주차 학습 일지 기록</S.Title>
          <S.Cancel src={cancelImg} onClick={onClose} />
        </S.TitleCancelContainer>

        {/* 제목 */}
        <S.StudyInputContainer>
          <S.StudyTitleInput placeholder="제목을 입력해 주세요." />
          <S.StudyInputdivider />
        </S.StudyInputContainer>

        {/* 내용 */}
        <S.InputContainer
          maxLength={MAX_LENGTH}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="내용을 입력해 주세요."
        />
        <S.CharCount>{text.length}/{MAX_LENGTH}</S.CharCount>
        <S.Button>완료</S.Button>
      </S.Container>
    </>
  );
}