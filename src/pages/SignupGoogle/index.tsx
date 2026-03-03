import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as S from './style';
import LogoSvg from '@/assets/AuthImg/AuthLogo.svg';
import { signupExtra } from '@/api/Auth';
import { toast } from '@/store/toastStore';
import { useAuthStore } from '@/store/authStore';

function SignupGoogle() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setToken = useAuthStore((s) => s.setToken);
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [clubCode, setClubCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isDisabled = !studentId.trim() || !name.trim() || !clubCode.trim();

  // URL의 token을 localStorage에 저장 (API 요청 시 Bearer로 사용됨)
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setToken(token);
    } else {
      toast.error('구글 인증 정보가 없습니다. 다시 시도해 주세요.');
      navigate('/auth/signin', { replace: true });
    }
  }, []);

  // Google 소셜 회원가입 추가 정보 등록 핸들러
  const handleSignupExtra = async () => {
    setIsLoading(true);
    try {
      await signupExtra({
        userName: name,
        hakbun: Number(studentId),
        clubCode,
      });
      toast.success('회원가입이 완료되었습니다.');
      navigate('/auth/signin');
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response
        ?.status;
      const msg =
        status === 401
          ? '구글 인증 세션이 만료되었습니다. 다시 로그인해 주세요.'
          : ((err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ??
            '회원가입에 실패했습니다. 다시 시도해 주세요.');
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인 페이지로 이동하는 핸들러
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

          <S.SignupForm
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isDisabled && !isLoading)
                handleSignupExtra();
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
              type="text"
              placeholder="동아리 코드"
              required
              value={clubCode}
              onChange={(e) => setClubCode(e.target.value)}
            />
            <S.Inputgap />
            <S.SignupButton
              type="button"
              onClick={handleSignupExtra}
              disabled={isDisabled || isLoading}
            >
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
