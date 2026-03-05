import * as S from "./StudyPost.styled";
import type { StudyResponse } from "@/api/Study";

interface StudyPostProps {
  study: StudyResponse;
  onDetail: (study: StudyResponse) => void;
}

export default function StudyPost({ study, onDetail }: StudyPostProps) {
  const author = study.authorName || (study as any).author_name || "익명";
  const title = study.title || "(제목 없음)";
  const content = study.content || "내용이 없습니다.";

  return(
    <>
      <S.Container>
        <S.Title>{author}</S.Title>
        <S.ContentContainer>
          <S.ContentTitle>{title}</S.ContentTitle>
          <S.Content>{content}</S.Content>
          <S.DetailButton onClick={() => onDetail(study)}>상세 보기</S.DetailButton>
        </S.ContentContainer>
      </S.Container>
    </>
  );
}