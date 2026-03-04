import { useState } from 'react';
import * as S from './WithdrawModal.styled';
import WithdrawVerifyModal from './WithdrawVerifyModal';

type Props = {
  onClose: () => void;
};

const CONFIRM_TEXT = '확인했습니다';

function WithdrawModal({ onClose }: Props) {
  const [input, setInput] = useState('');
  const [showVerify, setShowVerify] = useState(false);

  const isActive = input === CONFIRM_TEXT;

  const handleConfirm = () => {
    if (!isActive) return;
    setShowVerify(true);
  };

  if (showVerify) {
    return <WithdrawVerifyModal onClose={onClose} />;
  }

  return (
    <S.Overlay onClick={onClose}>
      <S.Modal onClick={(e) => e.stopPropagation()}>
        <S.Title>회원 탈퇴</S.Title>
        <S.Description>회원 탈퇴를 위한 이메일 인증을 진행합니다</S.Description>
        <S.ConfirmInput
          type="text"
          placeholder={CONFIRM_TEXT}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <S.ButtonRow>
          <S.CancelButton type="button" onClick={onClose}>
            이전
          </S.CancelButton>
          <S.ConfirmButton
            type="button"
            $active={isActive}
            disabled={!isActive}
            onClick={handleConfirm}
          >
            인증하기
          </S.ConfirmButton>
        </S.ButtonRow>
      </S.Modal>
    </S.Overlay>
  );
}

export default WithdrawModal;
