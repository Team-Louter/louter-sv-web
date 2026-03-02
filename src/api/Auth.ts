import instance from './Axios';
import type { LoginRequest, LoginResponse } from '@/types/auth';

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
