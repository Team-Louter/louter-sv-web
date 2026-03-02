import { create } from 'zustand';

type ToastType = 'error' | 'success' | 'warning';

type ToastState = {
  id: number;
  visible: boolean;
  message: string;
  type: ToastType;
  show: (message: string, type?: ToastType) => void;
  hide: () => void;
};

export const useToastStore = create<ToastState>((set) => ({
  id: 0,
  visible: false,
  message: '',
  type: 'error',

  // 토스트 표시 — id를 새로 발급해 같은 메시지도 재트리거 가능
  show: (message, type = 'error') => {
    set({ id: Date.now(), visible: true, message, type });
  },

  // 토스트 숨김
  hide: () => {
    set({ visible: false });
  },
}));

// 컴포넌트 밖(store, api 등)에서도 바로 호출할 수 있는 헬퍼
export const toast = {
  error: (message: string) => useToastStore.getState().show(message, 'error'),
  success: (message: string) =>
    useToastStore.getState().show(message, 'success'),
  warning: (message: string) =>
    useToastStore.getState().show(message, 'warning'),
};
