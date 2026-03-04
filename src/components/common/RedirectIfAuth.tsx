import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

// 이미 로그인된 상태면 메인으로 보내버림
// 로그인/회원가입/탈퇴완료 페이지 등에 사용
function RedirectIfAuth() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RedirectIfAuth;
