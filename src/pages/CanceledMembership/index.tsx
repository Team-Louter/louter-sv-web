import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import * as S from './CanceledMembership.styled';
import LogoSvg from '@/assets/AuthImg/AuthLogo.svg';
import { useAuthStore } from '@/store/authStore';

export default function CanceledMembership() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearAuth } = useAuthStore();

  useEffect(() => {
    clearAuth();
  }, []);

  if (!(location.state as { fromWithdraw?: boolean })?.fromWithdraw) {
    return <Navigate to="/auth/signin" replace />;
  }

  return (
    <S.Container>
      <S.Logo src={LogoSvg} alt="Louter" />
      <S.Title>
        <strong>회원 탈퇴</strong>
        <span>가 </span>
        <strong>완료</strong>
        <span>되었습니다</span>
      </S.Title>
      <S.Description>그동안 함께해 주셔서 감사합니다</S.Description>
      <S.ButtonRow>
        <S.SigninButton onClick={() => navigate('/auth/signin')}>
          로그인
        </S.SigninButton>
        <S.SignupButton onClick={() => navigate('/auth/signup/check')}>
          회원가입
        </S.SignupButton>
      </S.ButtonRow>
      <S.Footer>
        <S.FooterLouter>
          Louter(라우터)&nbsp;&nbsp;&nbsp;대구소프트웨어마이스터고등학교
        </S.FooterLouter>
        <S.FooterGithub
          href="https://github.com/Team-Louter"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </S.FooterGithub>
      </S.Footer>
    </S.Container>
  );
}
