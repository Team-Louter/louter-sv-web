import { useNavigate } from 'react-router-dom';
import * as S from './style';
import LogoSvg from '@/assets/AuthImg/AuthLogo.svg';

function SignupGoogle() {
  const navigate = useNavigate();

  const handleTest = () => {
    navigate('/');
  };

  const handleSignin = () => {
    navigate('/auth/signin');
  };

  return (
    <S.Container>
      <S.SignupContainer>
        <S.AuthMainImgContainer />
        <S.AuthContent>
          <S.LogoImg src={LogoSvg} alt="Logo" />

          <S.GoogleContent>
            <S.SocialTitle>학생 개인정보 입력</S.SocialTitle>
          </S.GoogleContent>

          <S.Line />

          <S.SignupForm>
            <S.Input type="text" placeholder="학번" required />
            <S.Input type="text" placeholder="이름" required />
            <S.Input type="text" placeholder="동아리 코드" required />
            <S.Inputgap />
            <S.SignupButton type="button" onClick={handleTest}>
              회원가입
            </S.SignupButton>
          </S.SignupForm>

          <S.SignupText>
            이미 계정이 있으신가요?{' '}
            <S.SignupLink onClick={handleSignin}>로그인</S.SignupLink>
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
      </S.SignupContainer>
    </S.Container>
  );
}

export default SignupGoogle;
