import instance from "./Axios";

export interface StudyResponse {
  studyId: number;
  study_id?: number;
  authorName: string;
  author_name?: string;
  title: string;
  content: string;
  summary: string;
  month: number;
  month_number?: number;
  weekNumber: number;
  week_number?: number;
  createdAt: string;
}

export interface CreateStudyRequest {
  title: string;
  content: string;
  month: number;
  weekNumber: number;
}

export interface UpdateStudyRequest {
  title: string;
  content: string;
  month: number;
  weekNumber: number;
}


// 전체 목록 조회
export const getStudies = async (): Promise<StudyResponse[]> => {
  const response = await instance.get<StudyResponse[]>("/studies");
  return response.data;
};

// 단건 조회
export const getStudy = async (studyId: number): Promise<StudyResponse> => {
  const response = await instance.get<StudyResponse>(`/studies/${studyId}`);
  return response.data;
};

// 내 학습일지 목록 조회
export const getMyStudies = async (): Promise<StudyResponse[]> => {
  const response = await instance.get<StudyResponse[]>("/studies/me");
  return response.data;
};

// 생성
export const createStudy = async (body: CreateStudyRequest): Promise<StudyResponse> => {
  const response = await instance.post<StudyResponse>("/studies", body);
  return response.data;
};

// 수정
export const updateStudy = async (studyId: number, body: UpdateStudyRequest): Promise<StudyResponse> => {
  const response = await instance.put<StudyResponse>(`/studies/${studyId}`, body);
  return response.data;
};

// 삭제
export const deleteStudy = async (studyId: number): Promise<void> => {
  await instance.delete<void>(`/studies/${studyId}`);
};
