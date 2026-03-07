import { useState } from 'react';
import * as S from '../WithdrawModal/WithdrawModal.styled';
import { kickMember } from '@/api/Member';
import { toast } from '@/store/toastStore';
import type { Member } from '@/types/member';

type KickConfirmModalProps = {
  member: Member;
  onClose: () => void;
  onKicked: (userId: number) => void;
};

function KickConfirmModal({
  member,
  onClose,
  onKicked,
}: KickConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleKick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await kickMember(member.userId);
      toast.success(`${member.userName}님이 퇴출되었습니다.`);
      onKicked(member.userId);
      onClose();
    } catch {
      toast.error('퇴출에 실패했습니다.');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <S.Overlay onClick={onClose}>
      <S.Modal onClick={(e) => e.stopPropagation()}>
        <S.Title>제명 확인</S.Title>
        <S.Description>
          <strong>{member.userName}</strong>님을
          <br />
          동아리에서 퇴출하시겠습니까?
          <br />
          <br />
          <S.SmallNote>이 작업은 되돌릴 수 없습니다.</S.SmallNote>
        </S.Description>
        <S.ButtonRow>
          <S.CancelButton type="button" onClick={onClose} disabled={isLoading}>
            취소
          </S.CancelButton>
          <S.ConfirmButton
            type="button"
            $active={!isLoading}
            disabled={isLoading}
            onClick={handleKick}
          >
            퇴출합니다.
          </S.ConfirmButton>
        </S.ButtonRow>
      </S.Modal>
    </S.Overlay>
  );
}

export default KickConfirmModal;
