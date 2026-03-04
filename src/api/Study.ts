import instance from "./Axios";

export interface WeekContent {
  weekNumber: number;
  content: string;
}

export interface StudyResponse {
  studyId: number;
  title: string;
  month: number;
  weeks: WeekContent[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateStudyRequest {
  title?: string;
  month?: number;
  weeks?: WeekContent[];
}

// 스터디 단건 조회
export const getStudy = async (studyId: number): Promise<StudyResponse> => {
  const response = await instance.get<StudyResponse>(`/studies/${studyId}`);
  return response.data;
};

// 스터디 수정
export const updateStudy = async (
  studyId: number,
  body: UpdateStudyRequest
): Promise<StudyResponse> => {
  const response = await instance.put<StudyResponse>(`/studies/${studyId}`, body);
  return response.data;
};

// 스터디 삭제
export const deleteStudy = async (studyId: number): Promise<void> => {
  await instance.delete<void>(`/studies/${studyId}`);
};