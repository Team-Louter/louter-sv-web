export type User = {
  userId: number;
  userName: string;
  userEmail: string;
  role: string;
  grade: number;
  classRoom: number;
  number: number;
  profileImageUrl: string;
  majors: string[];
  githubUrl: string;
  linkedinUrl: string;
  postCount: number;
  commentCount: number;
  likedPostCount: number;
  receivedLikeCount: number;
};

export type UpdateProfileRequest = {
  profileImageUrl: string;
  userName: string;
  hakbun: number;
  majors: string[];
  githubId: string;
  linkedinId: string;
};
