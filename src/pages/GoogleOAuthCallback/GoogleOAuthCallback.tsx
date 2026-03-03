import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/toastStore';

// 구글 로그인 성공 후 기존 유저 콜백 — /main?token={accessToken}
function GoogleOAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setToken = useAuthStore((s) => s.setToken);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setToken(token);
      navigate('/', { replace: true });
    } else {
      toast.error('구글 로그인에 실패했습니다. 다시 시도해 주세요.');
      navigate('/auth/signin', { replace: true });
    }
  }, []);

  return null;
}

export default GoogleOAuthCallback;
