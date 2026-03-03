import instance from './Axios';
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupExtraRequest,
} from '@/types/auth';

// 이메일로 인증코드 발송
export const sendEmailCode = async (userEmail: string): Promise<void> => {
  await instance.get('/auth/email', { params: { userEmail } });
};

// 인증코드 검증
export const verifyEmailCode = async (
  userEmail: string,
  inputCode: string,
): Promise<void> => {
  await instance.get('/auth/verify', { params: { userEmail, inputCode } });
};

// 일반 회원가입
export const signup = async (body: SignupRequest): Promise<void> => {
  await instance.post('/auth/signup', body);
};

// Google 소셜 회원가입 추가 정보 등록
export const signupExtra = async (body: SignupExtraRequest): Promise<void> => {
  await instance.post('/auth/signup/extra', body);
};

// 로그인
export const login = async (body: LoginRequest): Promise<LoginResponse> => {
  const response = await instance.post<LoginResponse>('/auth/login', body);
  return response.data;
};

// 로그아웃
export const logout = async (): Promise<void> => {
  await instance.post('/auth/logout');
};

// 토큰 갱신
export const refresh = async (): Promise<{ token: string }> => {
  const response = await instance.post<{ token: string }>('/auth/refresh');
  return response.data;
};
