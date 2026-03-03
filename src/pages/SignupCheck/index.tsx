import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './style';
import LogoSvg from '@/assets/AuthImg/AuthLogo.svg';
import { PRIVACY_POLICY } from '@/constants/policy';

function SignupCheck() {
  const navigate = useNavigate();
  const [allChecked, setAllChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);

  // 전체 동의 체크박스 토글 핸들러 - 모든 항목을 일괄 체크/해제
  const handleAll = () => {
    const next = !allChecked;
    setAllChecked(next);
    setPrivacyChecked(next);
  };

  // 개인정보 수집 동의 체크박스 토글 핸들러
  const handlePrivacy = () => {
    const next = !privacyChecked;
    setPrivacyChecked(next);
    setAllChecked(next);
  };

  // 로그인 페이지로 이동하는 핸들러
  const handleSignin = () => {
    navigate('/auth/signin');
  };

  // 약관 동의 후 회원가입 페이지로 이동하는 핸들러 (필수 항목 미동의 시 이동 불가)
  const handleAgree = () => {
    if (privacyChecked) navigate('/auth/signup');
  };

  return (
    <S.Container>
      <S.SigninContainer>
        <S.AuthMainImgContainer />
        <S.AuthContent>
          <S.LogoImg src={LogoSvg} alt="Logo" />

          <S.SocialTitle>약관 동의서</S.SocialTitle>

          <S.AgreementList>
            <S.AgreementItem onClick={handleAll}>
              <S.Checkbox checked={allChecked} readOnly />
              <S.AgreementLabel>전체 동의</S.AgreementLabel>
            </S.AgreementItem>

            <S.AgreementItem onClick={handlePrivacy}>
              <S.Checkbox checked={privacyChecked} readOnly />
              <S.AgreementLabel>
                개인정보 수집 및 이용 동의&nbsp;<S.Required>(필수)</S.Required>
              </S.AgreementLabel>
            </S.AgreementItem>
          </S.AgreementList>

          <S.PolicyBox>
            <S.PolicyBoxTitle>{PRIVACY_POLICY.title}</S.PolicyBoxTitle>
            <S.PolicyBoxText>{PRIVACY_POLICY.text}</S.PolicyBoxText>
          </S.PolicyBox>

          <S.SigninButton
            type="button"
            onClick={handleAgree}
            disabled={!privacyChecked}
          >
            동의합니다
          </S.SigninButton>

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
      </S.SigninContainer>
    </S.Container>
  );
}

export default SignupCheck;
