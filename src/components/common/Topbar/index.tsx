import { useNavigate, useLocation } from 'react-router-dom';
import * as S from './style';
import LogoSvg from '@/assets/Logo/Logo.svg';
import { useAuthStore } from '@/store/authStore';
import { logout } from '@/api/Auth';
import { toast } from '@/store/toastStore';

const NAV_ITEMS = [
  { label: '커뮤니티', path: '/community' },
  { label: '캘린더', path: '/calendar' },
  { label: '학습 관리', path: '/study' },
  { label: '멘토링', path: '/mentoring' },
  { label: '마이페이지', path: '/me' },
];

function Topbar({ hidden }: { hidden: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, clearAuth } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // 서버 오류 여부와 관계없이 로컬 상태 초기화
    } finally {
      clearAuth();
      toast.success('로그아웃 되었습니다.');
      navigate('/auth/signin');
    }
  };

  return (
    <S.Container $hidden={hidden}>
      <S.LogoWrapper onClick={() => navigate('/')}>
        <S.Logo src={LogoSvg} alt="Louter Logo" />
      </S.LogoWrapper>

      {isLoggedIn ? (
        <>
          <S.Nav>
            {NAV_ITEMS.map(({ label, path }) => (
              <S.NavItem
                key={path}
                $active={
                  location.pathname === path ||
                  location.pathname.startsWith(path + '/')
                }
                onClick={() => navigate(path)}
              >
                {label}
              </S.NavItem>
            ))}
          </S.Nav>

          <S.RightGroup>
            {/* 검색 */}
            <S.IconButton aria-label="검색">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </S.IconButton>

            {/* 다크모드 */}
            <S.IconButton aria-label="다크모드">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </S.IconButton>

            <S.LogoutButton onClick={handleLogout}>로그아웃</S.LogoutButton>
          </S.RightGroup>
        </>
      ) : (
        <S.ButtonGroup>
          <S.LoginButton onClick={() => navigate('/auth/signin')}>
            로그인
          </S.LoginButton>
          <S.SignupButton onClick={() => navigate('/auth/signup/check')}>
            회원가입
          </S.SignupButton>
        </S.ButtonGroup>
      )}
    </S.Container>
  );
}

export default Topbar;
