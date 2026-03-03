import instance from "./Axios";

export interface MentoringResponse {
  mentoringId: number;
  mentoringName: string;
  createdAt: string;
}

export interface MentoringRequest {
  mentoringName: string;
  memberIds: number[];
}

export interface MentoringMember {
  userId: number;
  name: string;
  role: "LEADER" | "MENTOR" | "MENTEE";
  profileImageUrl: string;
}

export interface QuestionResponse {
  questionId: number;
  mentoringId: number;
  title: string;
  content: string;
  status: "PAUSED" | "ACTIVE" | "DONE";
  createdAt: string;
}

export interface MessageResponse {
  messageId: number;
  questionId: number;
  userName: string;
  content: string;
  profileUrl: string;
  images: string[];
  createdAt: string;
}


export const mentoringApi = {
  // 멘토링 방 관련
  getMentorings: () => 
    instance.get<MentoringResponse[]>("/mentoring"),
    
  createMentoring: (data: MentoringRequest) => 
    instance.post<MentoringResponse>("/mentoring", data),
    
  deleteMentoring: (mentoringId: number) => 
    instance.delete(`/mentoring/${mentoringId}`),

  getMembers: (mentoringId: number, role: "LEADER" | "MENTOR" | "MENTEE") =>
    instance.get<MentoringMember[]>(`/mentoring/${mentoringId}/members`, { params: { role } }),

  // 질문 관련
  getQuestions: () => 
    instance.get<QuestionResponse[]>("/mentoring/questions"),

  createQuestion: (mentoringId: number, title: string, content: string, files?: File[]) => {
    const formData = new FormData();
    const requestBlob = new Blob([JSON.stringify({ mentoringId, title, content })], { type: 'application/json' });
    formData.append("request", requestBlob);
    if (files) {
      files.forEach(file => formData.append("files", file));
    }
    return instance.post<QuestionResponse>("/mentoring/questions", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },

  updateStatus: (questionId: number, status: "PAUSED" | "ACTIVE" | "DONE") =>
    instance.patch(`/mentoring/questions/${questionId}/status`, null, { params: { status } }),

  // 메시지(답변) 관련
  getMessages: () =>
    instance.get<MessageResponse[]>("/mentoring/messages"),

  createMessage: (questionId: number, content: string, files?: File[]) => {
    const formData = new FormData();
    const requestBlob = new Blob([JSON.stringify({ questionId, content })], { type: 'application/json' });
    formData.append("request", requestBlob);
    if (files) {
      files.forEach(file => formData.append("files", file));
    }
    return instance.post<MessageResponse>("/mentoring/messages", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
};
