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

  updateMentoring: (mentoringId: number, data: MentoringRequest) =>
    instance.put<MentoringResponse>(`/mentoring/${mentoringId}`, data),
    
  deleteMentoring: (mentoringId: number) => 
    instance.delete(`/mentoring/${mentoringId}`),

  getMembers: (mentoringId: number, role: "LEADER" | "MENTOR" | "MENTEE") =>
    instance.get<MentoringMember[]>(`/mentoring/${mentoringId}/members`, { params: { role } }),

  // 질문 관련
  getQuestions: () => 
    instance.get<QuestionResponse[]>("/mentoring/questions"),

  createQuestion: (mentoringId: number, title: string, content: string, files?: File[]) => {
    const formData = new FormData();
    const requestData = { mentoringId, title, content };
    formData.append("request", new Blob([JSON.stringify(requestData)], { type: 'application/json' }));
    if (files && files.length > 0) {
      files.forEach(file => formData.append("files", file));
    }
    return instance.post<QuestionResponse>("/mentoring/questions", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },

  updateStatus: (questionId: number, status: "PAUSED" | "ACTIVE" | "DONE") =>
    instance.patch(`/mentoring/questions/${questionId}/status`, null, { params: { status } }),

  deleteQuestion: (questionId: number) =>
    instance.delete(`/mentoring/questions/${questionId}`),

  // 메시지(답변) 관련
  getMessages: () =>
    instance.get<MessageResponse[]>("/mentoring/messages"),

  createMessage: (questionId: number, content: string, files?: File[]) => {
    const formData = new FormData();
    const requestData = { questionId, content };
    formData.append("request", new Blob([JSON.stringify(requestData)], { type: 'application/json' }));
    if (files && files.length > 0) {
      files.forEach(file => formData.append("files", file));
    }
    return instance.post<MessageResponse>("/mentoring/messages", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },

  deleteMessage: (messageId: number) =>
    instance.delete(`/mentoring/messages/${messageId}`)
};
