export type MentoringRole = 'LEADER' | 'MENTOR' | 'MENTEE';
export type QuestionStatus = 'PAUSED' | 'ACTIVE' | 'DONE';

export interface MentoringRequest {
  mentoringName: string;
  memberIds?: number[];
}

export interface MentoringResponse {
  mentoringId: number;
  mentoringName: string;
  createdAt: string;
}

export interface Mentoring {
  mentoringId: number;
  mentoringName: string;
  createdAt: string;
  updatedAt: string;
}

export interface MentoringMember {
  memberId: number;
  mentoringId: number;
  userId: number;
  role: MentoringRole;
}

export interface MentoringFileRequest {
  targetType?: 'QUESTION' | 'MESSAGE';
  targetId?: number;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
}

export interface MentoringFileResponse {
  fileId: number;
  targetType: 'QUESTION' | 'MESSAGE';
  targetId: number;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

export interface CreateQuestionRequest {
  mentoringId: number;
  title: string;
  content: string;
  files?: MentoringFileRequest[];
}

export interface QuestionResponse {
  questionId: number;
  mentoringId: number;
  userId: number;
  status: QuestionStatus;
  title: string;
  content: string;
  files: MentoringFileResponse[];
  createdAt: string;
}

export interface UpdateQuestionRequest {
  title: string;
  content: string;
}

export interface CreateMessageRequest {
  questionId: number;
  content: string;
  files?: MentoringFileRequest[];
}

export interface MessageResponse {
  messageId: number;
  questionId: number;
  userId: number;
  content: string;
  files: MentoringFileResponse[];
  createdAt: string;
}

export interface UpdateMessageRequest {
  content: string;
}
