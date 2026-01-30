import * as S from './styles'; 
import { useState } from 'react';

interface QuestionListProps {
  question: {
    title: string;
    date: string;
    status: string;
  };
}

export default function QuestionList({question}: QuestionListProps) {
  const [isClicked, setIsClicked] = useState(false);

  return(
    <>
      <S.container $isClicked={isClicked} onClick={() => setIsClicked(!isClicked)}>
        <S.questionItem>
          <S.questionHeader>
            <S.questionTitle>{question.title}</S.questionTitle>
            <S.questionDate>{question.date}</S.questionDate>
          </S.questionHeader>

          <S.status>
            <S.statusText>상태</S.statusText>
            <S.statusBadge>{question.status}</S.statusBadge>
          </S.status>
        </S.questionItem>
      </S.container>
    </>
  );
}