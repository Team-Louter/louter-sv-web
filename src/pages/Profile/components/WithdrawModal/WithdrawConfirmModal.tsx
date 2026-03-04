import * as S from './WithdrawModal.styled';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/store/toastStore';
import { verifyWithdrawalEmailCode } from '@/api/Auth';
import { useState } from 'react';

type Props = {
  inputCode: string;
  onBack: () => void;
  onClose: () => void;
};

function WithdrawConfirmModal({ inputCode, onBack, onClose }: Props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleWithdraw = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await verifyWithdrawalEmailCode(inputCode);
      toast.success('회원 탈퇴가 완료되었습니다.');
      navigate('/canceled', { state: { fromWithdraw: true } });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? '탈퇴 처리에 실패했습니다. 다시 시도해 주세요.';
      toast.error(msg);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <S.Overlay onClick={onClose}>
      <S.Modal onClick={(e) => e.stopPropagation()}>
        <S.Title>회원 탈퇴</S.Title>
        <S.Description>
          이메일 인증이 완료되었습니다.
          <br />
          <br />
          정말 탈퇴하시겠습니까?
        </S.Description>
        <S.ButtonRow>
          <S.CancelButton type="button" onClick={onBack} disabled={isLoading}>
            이전
          </S.CancelButton>
          <S.ConfirmButton
            type="button"
            $active={!isLoading}
            disabled={isLoading}
            onClick={handleWithdraw}
          >
            탈퇴합니다.
          </S.ConfirmButton>
        </S.ButtonRow>
      </S.Modal>
    </S.Overlay>
  );
}

export default WithdrawConfirmModal;
