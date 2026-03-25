export type MentoringRole = 'LEADER' | 'MENTOR' | 'MENTEE';
export type QuestionStatus = 'PAUSED' | 'ACTIVE' | 'DONE';
export type PersonType = "single" | "batch";
export type RoleType = "LEADER" | "MENTOR" | "MENTEE";
export type StatusType = "답변 중" | "답변 대기" | "답변 완료";

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

export interface BaseAvatarItem {
  id: number;
  roomId: number;
  type: PersonType;
  name: string;
  users: { id: number; img: string; name: string }[];
  myRole?: RoleType;
}

export interface SingleAvatarItem extends BaseAvatarItem {
  type: "single";
  userImg: string;
}

export interface BatchAvatarItem extends BaseAvatarItem {
  type: "batch";
}

export type AvatarItem = SingleAvatarItem | BatchAvatarItem;

export interface Question {
  id: number;
  roomId: number;
  title: string;
  date: string;
  createdAt: string;
  status: StatusType;
}

export interface Comment {
  id: number;
  userName: string;
  content: string;
  time: string;
  createdAt: string;
  profileUrl: string;
  images?: string[];
  replies: Comment[];
}

export interface AttachedImage {
  name: string;
  url: string;
  file?: File;
}

export interface Member {
  id: number;
  name: string;
  grade: number;
  class: number;
  number: number;
  role: string;
  profileImg?: string;
  checked: boolean;
}

export interface GradeGroup {
  grade: number;
  members: Member[];
}

export interface QuestionWithComments extends Question {
  authorId: number;
  comments: Comment[];
}
