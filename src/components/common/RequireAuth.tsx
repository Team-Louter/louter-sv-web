import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

// 로그인이 필요한 페이지를 감싸는 가드같은 역할
// 비로그인 상태면 로그인 페이지로 보내버림
function RequireAuth() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/auth/signin" replace />;
  }

  return <Outlet />;
}

export default RequireAuth;
