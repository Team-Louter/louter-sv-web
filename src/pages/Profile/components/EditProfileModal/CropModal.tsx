import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import * as S from './EditProfileModal.styled';

interface CropModalProps {
  cropSrc: string;
  crop: { x: number; y: number };
  zoom: number;
  uploading: boolean;
  setCrop: (crop: { x: number; y: number }) => void;
  setZoom: (zoom: number) => void;
  onCropComplete: (_: Area, areaPixels: Area) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

function CropModal({
  cropSrc,
  crop,
  zoom,
  uploading,
  setCrop,
  setZoom,
  onCropComplete,
  onConfirm,
  onCancel,
}: CropModalProps) {
  return (
    <S.CropOverlay>
      <S.CropModal onClick={(e) => e.stopPropagation()}>
        <S.CropTitle>이미지 자르기</S.CropTitle>
        <S.CropArea>
          <Cropper
            image={cropSrc}
            crop={crop}
            zoom={zoom}
            aspect={3 / 2}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </S.CropArea>
        <S.CropZoomRow>
          <S.CropZoomLabel>확대</S.CropZoomLabel>
          <S.CropZoomSlider
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </S.CropZoomRow>
        <S.CropButtonRow>
          <S.CancelButton type="button" onClick={onCancel}>
            취소
          </S.CancelButton>
          <S.SaveButton type="button" onClick={onConfirm} disabled={uploading}>
            {uploading ? '업로드 중...' : '적용'}
          </S.SaveButton>
        </S.CropButtonRow>
      </S.CropModal>
    </S.CropOverlay>
  );
}

export default CropModal;
