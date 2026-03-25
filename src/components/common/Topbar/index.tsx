import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as S from './Topbar.styled.ts';
import LogoSvg from '@/assets/Logo/SwitchLogo.svg';
import SearchIcon from '@/assets/Topbar/search.svg';
import DarkModeIcon from '@/assets/Topbar/darkmode.svg';
import { useAuthStore } from '@/store/authStore';
import { logout } from '@/api/Auth';
import { toast } from '@/store/toastStore';
import { FiMenu, FiX } from 'react-icons/fi';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <S.Container $hidden={hidden} $isLoggedIn={isLoggedIn}>
      <S.LogoWrapper>
        <S.Logo src={LogoSvg} alt="Switch Logo" onClick={() => navigate('/')} />
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
            <S.IconButton
              aria-label="검색"
              onClick={() => toast.warning('개발 중인 기능입니다.')}
            >
              <img src={SearchIcon} alt="검색" />
            </S.IconButton>

            {/* 다크모드 */}
            <S.IconButton
              aria-label="다크모드"
              onClick={() => toast.warning('개발 중인 기능입니다.')}
            >
              <img src={DarkModeIcon} alt="다크모드" />
            </S.IconButton>

            <S.LogoutButton onClick={handleLogout}>로그아웃</S.LogoutButton>
          </S.RightGroup>

          {/* 모바일 햄버거 버튼 */}
          <S.MobileMenuButton
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="메뉴"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </S.MobileMenuButton>

          {/* 모바일 네비게이션 메뉴 */}
          <S.MobileNavContainer $isOpen={isMobileMenuOpen}>
            {NAV_ITEMS.map(({ label, path }) => (
              <S.MobileNavItem
                key={path}
                $active={
                  location.pathname === path ||
                  location.pathname.startsWith(path + '/')
                }
                onClick={() => handleNavClick(path)}
              >
                {label}
              </S.MobileNavItem>
            ))}
            <S.MobileNavDivider />
            <S.MobileNavItem onClick={handleLogout}>로그아웃</S.MobileNavItem>
          </S.MobileNavContainer>
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
