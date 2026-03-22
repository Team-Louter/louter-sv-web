import * as S from "./ConfirmModal.styled";

interface ConfirmModalProps {
  open: boolean;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
  confirmColor?: string;
  confirmLabelColor?: string;
  errorMessage?: string;
}

export default function ConfirmModal({
  open,
  message = "글을 게시하시겠어요?",
  onCancel,
  onConfirm,
  cancelLabel = "이전",
  confirmLabel = "게시",
  confirmColor,
  confirmLabelColor,
  errorMessage,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <S.Overlay onClick={onCancel}>
      <S.Modal onClick={(e) => e.stopPropagation()}>
        <S.Message>{message}</S.Message>
        <S.ButtonRow>
          <S.CancelButton onClick={onCancel}>{cancelLabel}</S.CancelButton>
          <S.ConfirmButton
            $color={confirmColor}
            $labelColor={confirmLabelColor}
            onClick={onConfirm}
          >
            {confirmLabel}
          </S.ConfirmButton>
        </S.ButtonRow>
        {errorMessage && <S.ErrorMessage>{errorMessage}</S.ErrorMessage>}
      </S.Modal>
    </S.Overlay>
  );
}
