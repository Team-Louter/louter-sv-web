import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './style';
import LogoSvg from '@/assets/AuthImg/AuthLogo.svg';
import GoogleIcon from '@/assets/Google/Google.svg';
import { toast } from '@/store/toastStore';
import { login } from '@/api/Auth';
import { useAuthStore } from '@/store/authStore';

function Signin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isDisabled = !email.trim() || !password.trim() || isLoading;

  // 로그인 API 호출 후 성공 시 메인으로 이동
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const data = await login({
        userEmail: email,
        userPassword: password,
        userProvider: 'SELF',
      });
      setAuth(data);
      navigate('/');
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response
        ?.status;
      const msg =
        status === 404
          ? '이메일 또는 비밀번호가 올바르지 않습니다.'
          : ((err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? '로그인에 실패했습니다. 다시 시도해 주세요.');
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // 회원가입 페이지(약관 동의)로 이동하는 핸들러
  const handleSignup = () => {
    navigate('/auth/signup/check');
  };

  return (
    <S.Container>
      <S.SigninContainer>
        <S.AuthMainImgContainer />
        <S.AuthContent>
          <S.LogoImg src={LogoSvg} alt="Logo" />

          <S.GoogleContent>
            <S.SocialTitle>소셜 로그인</S.SocialTitle>

            <S.GoogleButton
              onClick={() => {
                window.location.href = `${import.meta.env.VITE_BASE_URL}/oauth2/authorization/google`;
              }}
            >
              <S.GoogleIcon src={GoogleIcon} alt="Google" />
              Google로 계속하기
            </S.GoogleButton>
          </S.GoogleContent>

          <S.Line />

          <S.SigninForm
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isDisabled) handleLogin();
            }}
          >
            <S.Input
              type="email"
              placeholder="이메일"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <S.Input
              type="password"
              placeholder="비밀번호"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <S.Inputgap />
            <S.SigninButton
              type="button"
              onClick={handleLogin}
              disabled={isDisabled}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </S.SigninButton>
          </S.SigninForm>

          <S.FindAccountLink onClick={() => {}}>
            아이디/비밀번호 찾기
          </S.FindAccountLink>

          <S.SignupText>
            계정이 없으신가요?{' '}
            <S.SignupLink onClick={handleSignup}>회원가입</S.SignupLink>
          </S.SignupText>

          <S.Line />

          <S.PolicyText>
            The Google{' '}
            <S.PolicyLink
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </S.PolicyLink>{' '}
            and{' '}
            <S.PolicyLink
              href="https://policies.google.com/terms"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </S.PolicyLink>{' '}
            apply.
          </S.PolicyText>
        </S.AuthContent>
      </S.SigninContainer>
    </S.Container>
  );
}

export default Signin;
