import { useNavigate } from 'react-router-dom';
import * as S from './style';
import LogoSvg from '@/assets/AuthImg/AuthLogo.svg';
import GoogleIcon from '@/assets/Google/Google.svg';

function Signin() {
  const navigate = useNavigate();

  const handleTest = () => {
    navigate('/');
  };

  const handleSignup = () => {
    navigate('/auth/signup/check');
  };

  return (
    <S.Container>
      <S.LoginContainer>
        <S.AuthMainImgContainer />
        <S.AuthContent>
          <S.LogoImg src={LogoSvg} alt="Logo" />

          <S.GoogleContent>
            <S.SocialTitle>소셜 로그인</S.SocialTitle>

            <S.GoogleButton onClick={handleTest}>
              <S.GoogleIcon src={GoogleIcon} alt="Google" />
              Google로 계속하기
            </S.GoogleButton>
          </S.GoogleContent>

          <S.Line />

          <S.LoginForm>
            <S.Input type="email" placeholder="이메일" required />
            <S.Input type="password" placeholder="비밀번호" required />
            <S.LoginButton type="button" onClick={handleTest}>
              로그인
            </S.LoginButton>
          </S.LoginForm>

          <S.FindAccountLink onClick={handleTest}>
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
      </S.LoginContainer>
    </S.Container>
  );
}

export default Signin;
