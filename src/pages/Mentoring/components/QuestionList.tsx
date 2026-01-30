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
        <S.questionHeader>
          <S.questionTitle>{question.title}</S.questionTitle>
          <S.questionDate>{question.date}</S.questionDate>
        </S.questionHeader>

        
      </S.container>
      <div className="container">
        <div className="questionHeader">
          <span className="questionTitle">{question.title}</span>
          <span className="questionDate">{question.date}</span>
        </div>

        <div className="status">
          <span className="statusText">상태</span>
          <span className="statusBadge">{question.status}</span>
        </div>
      </div>
    </>
  );
}