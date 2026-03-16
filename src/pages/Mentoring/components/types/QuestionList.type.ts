export type StatusType = '답변 중' | '답변 대기' | '답변 완료';

export interface Question {
  id: number;
  roomId: number;
  title: string;
  date: string;
  status: StatusType;
}
