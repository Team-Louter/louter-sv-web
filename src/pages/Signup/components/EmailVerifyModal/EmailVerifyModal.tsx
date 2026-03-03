import { useRef, useState, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './EmailVerifyModal.styled';
import arrowSvg from '@/assets/AuthImg/arrow.svg';
import { verifyEmailCode, sendEmailCode, signup } from '@/api/Auth';
import { toast } from '@/store/toastStore';
import type { SignupRequest } from '@/types/auth';

type Props = {
  email: string;
  signupData: SignupRequest;
  onClose: () => void;
};

// 회원가입 이메일 인증 모달 — 마운트 시 자동으로 인증코드 발송
function EmailVerifyModal({ email, signupData, onClose }: Props) {
  const navigate = useNavigate();
  const [codes, setCodes] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(true);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const hasSent = useRef(false); // StrictMode 이중 호출 방지

  const inputCode = codes.join('');
  const isComplete = inputCode.length === 6;

  // 모달 오픈 시 이메일 인증코드 발송
  useEffect(() => {
    if (hasSent.current) return;
    hasSent.current = true;
    sendEmailCode(email)
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false)); // 실패해도 코드 입력 UI는 표시
  }, []);

  // 각 칸 입력 시 다음 칸으로 자동 포커스
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...codes];
    next[index] = value.slice(-1);
    setCodes(next);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // 백스페이스 입력 시 이전 칸으로 포커스 이동
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // 인증코드 재전송 — 재전송 중에도 스피너 표시
  const handleResend = async () => {
    setIsLoading(true);
    try {
      await sendEmailCode(email);
      setCodes(['', '', '', '', '', '']);
      toast.success('인증 코드를 재전송했습니다.');
    } catch {
      toast.error('재전송에 실패했습니다. 다시 시도해 주세요.');
      onClose();
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 0);
    }
  };

  // 인증코드 확인 후 회원가입 완료
  const handleSubmit = async () => {
    if (!isComplete || isLoading) return;
    setIsLoading(true);
    try {
      await verifyEmailCode(email, inputCode);
      await signup(signupData);
      toast.success('회원가입이 완료되었습니다.');
      navigate('/auth/signin');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? '인증에 실패했습니다. 다시 시도해 주세요.';
      toast.error(msg);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <S.Overlay onClick={onClose}>
      <S.Modal onClick={(e) => e.stopPropagation()}>
        {isLoading ? (
          <S.Spinner />
        ) : (
          <>
            <S.Title>코드를 입력하세요</S.Title>
            <S.Subtitle>
              아래에 이메일로 전송된 6자리 코드를 입력하세요.
            </S.Subtitle>

            <S.CodeInputRow>
              {codes.map((val, i) => (
                <S.CodeBox
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={val}
                  $filled={val !== ''}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  autoFocus={i === 0}
                />
              ))}
            </S.CodeInputRow>

            <S.ResendButton type="button" onClick={handleResend}>
              인증 코드 재전송
            </S.ResendButton>

            <S.SubmitButton
              type="button"
              onClick={handleSubmit}
              disabled={!isComplete || isLoading}
              $active={isComplete}
            >
              <img src={arrowSvg} width={40} height={40} alt="" />
            </S.SubmitButton>
          </>
        )}
      </S.Modal>
    </S.Overlay>
  );
}

export default EmailVerifyModal;
