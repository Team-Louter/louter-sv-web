import { useRef, useState, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import * as S from './WithdrawVerifyModal.styled';
import arrowSvg from '@/assets/AuthImg/arrow.svg';
import { sendWithdrawalEmailCode } from '@/api/Auth';
import { toast } from '@/store/toastStore';
import WithdrawConfirmModal from './WithdrawConfirmModal';

type Props = {
  onClose: () => void;
};

// 회원탈퇴 이메일 인증 모달 — 마운트 시 자동으로 인증코드 발송
function WithdrawVerifyModal({ onClose }: Props) {
  const [codes, setCodes] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const hasSent = useRef(false); // StrictMode 이중 호출 방지

  const inputCode = codes.join('');
  const isComplete = inputCode.length === 6;

  // 모달 오픈 시 탈퇴 인증코드 발송
  useEffect(() => {
    if (hasSent.current) return;
    hasSent.current = true;
    sendWithdrawalEmailCode()
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));
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

  // 인증코드 재전송
  const handleResend = async () => {
    setIsLoading(true);
    hasSent.current = false;
    try {
      await sendWithdrawalEmailCode();
      hasSent.current = true;
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

  // 인증코드 입력 완료 시 최종 확인 모달로 전환 (API는 확인 모달에서 호출)
  const handleSubmit = () => {
    if (!isComplete || isLoading) return;
    setVerified(true);
  };

  if (verified) {
    return (
      <WithdrawConfirmModal
        inputCode={inputCode}
        onBack={() => setVerified(false)}
        onClose={onClose}
      />
    );
  }

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

export default WithdrawVerifyModal;
