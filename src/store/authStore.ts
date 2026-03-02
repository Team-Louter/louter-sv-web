import { create } from 'zustand';
import type { LoginResponse } from '@/types/auth';

type AuthState = {
  isLoggedIn: boolean;
  user: Omit<LoginResponse, 'token'> | null;
  accessToken: string | null;

  setAuth: (data: LoginResponse) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: !!localStorage.getItem('accessToken'),
  user: null,
  accessToken: localStorage.getItem('accessToken'),

  // 로그인 성공 시 유저 정보와 토큰 저장
  setAuth: (data: LoginResponse) => {
    const { token, ...user } = data;
    localStorage.setItem('accessToken', token);
    set({ isLoggedIn: true, user, accessToken: token });
  },

  // 로그아웃 시 유저 정보와 토큰 초기화
  clearAuth: () => {
    localStorage.removeItem('accessToken');
    set({ isLoggedIn: false, user: null, accessToken: null });
  },
}));
