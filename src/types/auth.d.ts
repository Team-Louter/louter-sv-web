export type SignupRequest = {
  hakbun: number;
  userName: string;
  userEmail: string;
  userPassword: string;
  confirmPassword: string;
  userProvider: 'SELF';
  clubCode: string;
};

// Google 소셜 회원가입 시 추가 정보 입력
export type SignupExtraRequest = {
  userName: string;
  hakbun: number;
  clubCode: string;
};

export type LoginRequest = {
  userEmail: string;
  userPassword: string;
  userProvider: 'SELF';
};

export type LoginResponse = {
  token: string;
  hakbun: number;
  generation: number;
  grade: number;
  classRoom: number;
  number: number;
  userName: string;
  userId: number;
  userEmail: string;
  userProvider: 'SELF' | 'GOOGLE';
};
