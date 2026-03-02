import { useEffect, useState } from 'react';
import * as S from './Toast.styled';
import { useToastStore } from '@/store/toastStore';

const ICONS = {
  error: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#e53e3e">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  ),
  success: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFD600">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
  ),
  warning: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#f6a623">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  ),
};

const AUTO_CLOSE = 1000; // 토스트가 자동으로 닫히는 시간 (ms)
const EXIT_DURATION = 300; // exit 애니메이션 지속 시간 (ms)

// 전역 토스트 알림 컴포넌트 — App.tsx에 한 번만 렌더링
function Toast() {
  const { id, message, type, hide } = useToastStore();
  // 실제 DOM 마운트 여부 (exit 애니메이션 끝난 후 언마운트)
  const [mounted, setMounted] = useState(false);
  // 애니메이션 방향 제어
  const [animating, setAnimating] = useState(false);

  // id가 바뀔 때마다 실행 — 토스트 표시 → 자동 닫기
  useEffect(() => {
    if (!id) return;

    setMounted(true);
    setAnimating(true);

    // autoClose 후 exit 애니메이션 시작
    const exitTimer = setTimeout(() => {
      setAnimating(false); // slide-up 시작
    }, AUTO_CLOSE);

    // exit 애니메이션 끝나면 언마운트
    const unmountTimer = setTimeout(() => {
      setMounted(false);
      hide();
    }, AUTO_CLOSE + EXIT_DURATION);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, [id]); // id가 바뀔 때마다 항상 재실행

  if (!mounted) return null;

  return (
    <S.Wrapper $visible={animating} $exitDuration={EXIT_DURATION}>
      <S.ToastBox>
        <S.IconCircle $type={type}>{ICONS[type]}</S.IconCircle>
        <S.Message>{message}</S.Message>
      </S.ToastBox>
    </S.Wrapper>
  );
}

export default Toast;
