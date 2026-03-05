export interface MentoringQuestion {
  title: string;
  date: string;
  status: string;
}

export interface QuestionListProps {
  question: MentoringQuestion;
}

export interface QuestionListStyleProps {
  $isClicked: boolean;
}
