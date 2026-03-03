import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './style';
import LogoSvg from '@/assets/AuthImg/AuthLogo.svg';
import GoogleIcon from '@/assets/Google/Google.svg';
import { toast } from '@/store/toastStore';
import EmailVerifyModal from './components/EmailVerifyModal/EmailVerifyModal';
import type { SignupRequest } from '@/types/auth';

function Signup() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [clubCode, setClubCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [signupData, setSignupData] = useState<SignupRequest | null>(null);
  const isDisabled =
    !studentId.trim() ||
    !name.trim() ||
    !password.trim() ||
    !passwordConfirm.trim() ||
    !email.trim() ||
    !clubCode.trim();

  // 회원가입 버튼
  const handleSignup = () => {
    if (password !== passwordConfirm) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }
    setSignupData({
      hakbun: Number(studentId),
      userName: name,
      userEmail: email,
      userPassword: password,
      confirmPassword: passwordConfirm,
      userProvider: 'SELF',
      clubCode,
    });
    setShowModal(true);
  };

  // Google 소셜 회원가입 — OAuth 인증 시작
  const handleSignupGoogle = () => {
    window.location.href = `${import.meta.env.VITE_BASE_URL}/oauth2/authorization/google`;
  };

  // 로그인 페이지로 이동하는 핸들러
  const handleSignin = () => {
    navigate('/auth/signin');
  };

  return (
    <S.Container>
      {showModal && signupData && (
        <EmailVerifyModal
          email={email}
          signupData={signupData}
          onClose={() => setShowModal(false)}
        />
      )}
      <S.LoginContainer>
        <S.AuthMainImgContainer />
        <S.AuthContent>
          <S.LogoImg src={LogoSvg} alt="Logo" />

          <S.GoogleContent>
            <S.SocialTitle>학생 계정으로 회원가입</S.SocialTitle>

            <S.GoogleButton onClick={handleSignupGoogle}>
              <S.GoogleIcon src={GoogleIcon} alt="Google" />
              Google로 시작하기
            </S.GoogleButton>
          </S.GoogleContent>

          <S.Line />

          <S.LoginForm
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isDisabled) handleSignup();
            }}
          >
            <S.Input
              type="text"
              placeholder="학번"
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
            <S.Input
              type="text"
              placeholder="이름"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <S.Input
              type="password"
              placeholder="비밀번호"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <S.Input
              type="password"
              placeholder="비밀번호 확인"
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
            <S.Input
              type="email"
              placeholder="이메일"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <S.Input
              type="text"
              placeholder="동아리 코드"
              required
              value={clubCode}
              onChange={(e) => setClubCode(e.target.value)}
            />
            <S.Inputgap />
            <S.LoginButton
              type="button"
              onClick={handleSignup}
              disabled={isDisabled}
            >
              회원가입
            </S.LoginButton>
          </S.LoginForm>

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
      </S.LoginContainer>
    </S.Container>
  );
}

export default Signup;
