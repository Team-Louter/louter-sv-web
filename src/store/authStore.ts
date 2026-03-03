import { create } from 'zustand';
import type { LoginResponse } from '@/types/auth';

type AuthState = {
  isLoggedIn: boolean;
  user: Omit<LoginResponse, 'token'> | null;
  accessToken: string | null;

  setAuth: (data: LoginResponse) => void;
  setToken: (token: string) => void;
  setPendingToken: (token: string) => void;
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

  // OAuth 콜백 등 토큰만 있을 때 저장 (유저 정보는 추후 API로 취득)
  setToken: (token: string) => {
    localStorage.setItem('accessToken', token);
    set({ isLoggedIn: true, accessToken: token });
  },

  // 추가정보 입력 전 임시 토큰 저장 — API 호출은 가능하지만 로그인 상태는 아님
  setPendingToken: (token: string) => {
    localStorage.setItem('pendingToken', token);
    set({ isLoggedIn: false, accessToken: token });
  },

  // 로그아웃 시 유저 정보와 토큰 초기화
  clearAuth: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('pendingToken');
    set({ isLoggedIn: false, user: null, accessToken: null });
  },
}));
