import instance from "./Axios";
import type {
  MentoringRequest,
  MentoringResponse,
  MentoringMember,
  MentoringRole,
  QuestionResponse,
  UpdateQuestionRequest,
  QuestionStatus,
  MessageResponse,
  UpdateMessageRequest,
  MentoringFileRequest,
} from "../types/mentoring";
import type { Member } from "@/types/member";

// Mentoring

export const getMentorings = async (): Promise<MentoringResponse[]> => {
  const response = await instance.get<MentoringResponse[]>("/mentoring");
  return response.data;
};

export const createMentoring = async (
  body: MentoringRequest,
): Promise<MentoringResponse> => {
  const response = await instance.post<MentoringResponse>("/mentoring", body);
  return response.data;
};

export const updateMentoring = async (
  mentoringId: number,
  body: MentoringRequest,
): Promise<MentoringResponse> => {
  const response = await instance.put<MentoringResponse>(
    `/mentoring/${mentoringId}`,
    body,
  );
  return response.data;
};

export const deleteMentoring = async (mentoringId: number): Promise<void> => {
  await instance.delete(`/mentoring/${mentoringId}`);
};

export const getMembers = async (
  mentoringId: number,
  role: MentoringRole,
): Promise<MentoringMember[]> => {
  const response = await instance.get<MentoringMember[]>(
    `/mentoring/${mentoringId}/members`,
    {
      params: { role },
    },
  );
  return response.data;
};

// RoomModal/모든 멤버 조회
export const getAllMembers = async (): Promise<Member[]> => {
  const response = await instance.get<Member[]>("/members");
  return response.data;
};

// Questions

export const getQuestions = async (): Promise<QuestionResponse[]> => {
  const response = await instance.get<QuestionResponse[]>(
    "/mentoring/questions",
  );
  return response.data;
};

export const createQuestion = async (
  mentoringId: number,
  title: string,
  content: string,
  files: MentoringFileRequest[] = [],
): Promise<QuestionResponse> => {
  const body: any = { mentoringId, title, content };
  if (files.length > 0) {
    body.files = files.map((f) => ({ ...f, targetType: "QUESTION" }));
  }
  const response = await instance.post<QuestionResponse>(
    "/mentoring/questions",
    body,
  );
  return response.data;
};

export const getQuestion = async (
  questionId: number,
): Promise<QuestionResponse> => {
  const response = await instance.get<QuestionResponse>(
    `/mentoring/questions/${questionId}`,
  );
  return response.data;
};

export const updateQuestion = async (
  questionId: number,
  body: UpdateQuestionRequest,
): Promise<QuestionResponse> => {
  const response = await instance.put<QuestionResponse>(
    `/mentoring/questions/${questionId}`,
    body,
  );
  return response.data;
};

export const deleteQuestion = async (questionId: number): Promise<void> => {
  await instance.delete(`/mentoring/questions/${questionId}`);
};

export const updateStatus = async (
  questionId: number,
  status: QuestionStatus,
): Promise<void> => {
  await instance.patch(`/mentoring/questions/${questionId}/status`, null, {
    params: { status },
  });
};

export const getQuestionsByMentee = async (
  mentoringId: number,
  userId: number,
): Promise<QuestionResponse[]> => {
  const response = await instance.get<QuestionResponse[]>(
    `/mentoring/questions/${mentoringId}/mentees/${userId}/questions`,
  );
  return response.data;
};

// Messages

export const getMessages = async (): Promise<MessageResponse[]> => {
  const response = await instance.get<MessageResponse[]>("/mentoring/messages");
  return response.data;
};

export const createMessage = async (
  questionId: number,
  content: string,
  files: MentoringFileRequest[] = [],
): Promise<MessageResponse> => {
  const body: any = { questionId, content };
  if (files.length > 0) {
    body.files = files.map((f) => ({
      ...f,
      targetType: "MESSAGE",
    }));
  }
  const response = await instance.post<MessageResponse>(
    `/mentoring/messages`,
    body,
  );
  return response.data;
};

export const getMessage = async (
  messageId: number,
): Promise<MessageResponse> => {
  const response = await instance.get<MessageResponse>(
    `/mentoring/messages/${messageId}`,
  );
  return response.data;
};

export const updateMessage = async (
  messageId: number,
  body: UpdateMessageRequest,
): Promise<MessageResponse> => {
  const response = await instance.put<MessageResponse>(
    `/mentoring/messages/${messageId}`,
    body,
  );
  return response.data;
};

export const deleteMessage = async (messageId: number): Promise<void> => {
  await instance.delete(`/mentoring/messages/${messageId}`);
};

// 파일 업로드
export const uploadFile = async (
  file: File,
): Promise<{
  data: any;
  url: string;
}> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await instance.post("/files/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const mentoringApi = {
  getMentorings,
  createMentoring,
  updateMentoring,
  deleteMentoring,
  getMembers,
  getAllMembers,
  getQuestions,
  createQuestion,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  updateStatus,
  getQuestionsByMentee,
  getMessages,
  createMessage,
  getMessage,
  updateMessage,
  deleteMessage,
  uploadFile,
};
