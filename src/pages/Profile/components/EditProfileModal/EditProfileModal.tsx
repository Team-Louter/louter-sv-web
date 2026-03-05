import { useState, useRef, useEffect, useCallback } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import * as S from './EditProfileModal.styled';
import { updateProfile } from '@/api/User';
import { uploadFile } from '@/api/Post';
import { toast } from '@/store/toastStore';
import type { User } from '@/types/user';
import GithubImg from '@/assets/Mypage/github.svg';
import LinkedinImg from '@/assets/Mypage/linkedin.svg';

/* ─── 전공 목록 ─── */
const MAJOR_OPTIONS = [
  'BACKEND',
  'FRONTEND',
  'DESIGN',
  'IOS',
  'ANDROID',
  'SECURITY',
  'GAME',
  'AI',
  'EMBEDDED',
] as const;

/* ─── 픽셀 크롭 헬퍼 ─── */
async function getCroppedBlob(
  imageSrc: string,
  pixelCrop: Area,
): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });
  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('canvas toBlob failed'));
      },
      'image/jpeg',
      0.95,
    );
  });
}

type Props = {
  user: User;
  onClose: () => void;
  onUpdated: (updated: User) => void;
};

function EditProfileModal({ user, onClose, onUpdated }: Props) {
  const initialHakbun = `${user.grade}${user.classRoom}${String(user.number).padStart(2, '0')}`;
  const [userName, setUserName] = useState(user.userName);
  const [hakbun, setHakbun] = useState(initialHakbun);
  const [majors, setMajors] = useState<string[]>(user.majors ?? []);
  const [profileImageUrl, setProfileImageUrl] = useState(
    user.profileImageUrl ?? '',
  );
  const [imageFileName, setImageFileName] = useState<string>(() => {
    if (user.profileImageUrl) {
      const parts = user.profileImageUrl.split('/');
      return parts[parts.length - 1] || '';
    }
    return '';
  });
  const [githubId, setGithubId] = useState<string>(() => {
    const url = user.githubUrl ?? '';
    // 중복 prefix 대응: github.com/ 기준으로 분리 후 마지막 세그먼트 사용
    const parts = url.split('github.com/').filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1].split('/')[0] : '';
  });
  const [linkedinId, setLinkedinId] = useState<string>(() => {
    const url = user.linkedinUrl ?? '';
    // 중복 prefix 대응: linkedin.com/in/ 기준으로 분리 후 마지막 세그먼트 사용
    const parts = url.split(/linkedin\.com\/in\//i).filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1].split('/')[0] : '';
  });
  const [showLinks, setShowLinks] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showMajorMenu, setShowMajorMenu] = useState(false);

  /* ─── 크롭 ─── */
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const majorDropdownRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
    // input 초기화 (동일 파일 다시 선택 가능)
    e.target.value = '';
  };

  const handleCropConfirm = async () => {
    if (!cropSrc || !croppedAreaPixels) return;
    setUploading(true);
    try {
      const blob = await getCroppedBlob(cropSrc, croppedAreaPixels);
      const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
      const { url } = await uploadFile(file);
      setProfileImageUrl(url);
      setImageFileName('profile.jpg');
      setCropSrc(null);
      toast.success('이미지가 업로드되었습니다.');
    } catch {
      toast.error('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleCropCancel = () => {
    setCropSrc(null);
  };

  const isValid = userName.trim() !== '' && hakbun.trim() !== '';

  const handleSave = async () => {
    if (!isValid) {
      toast.error('이름과 학번은 필수 입력 항목입니다.');
      return;
    }
    try {
      const updated = await updateProfile({
        profileImageUrl,
        userName,
        hakbun: Number(hakbun),
        majors,
        githubId: githubId ? `https://github.com/${githubId}` : '',
        linkedinId: linkedinId
          ? `https://www.linkedin.com/in/${linkedinId}`
          : '',
      });
      toast.success('프로필이 수정되었습니다.');
      onUpdated(updated);
      onClose();
    } catch {
      toast.error('프로필 수정에 실패했습니다.');
    }
  };

  /* 전공 드롭다운 외부 클릭 시 닫기 */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        majorDropdownRef.current &&
        !majorDropdownRef.current.contains(e.target as Node)
      ) {
        setShowMajorMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ESC 로 닫기 */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <>
      {/* ─── 크롭 모달 ─── */}
      {cropSrc && (
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
              <S.CancelButton type="button" onClick={handleCropCancel}>
                취소
              </S.CancelButton>
              <S.SaveButton
                type="button"
                onClick={handleCropConfirm}
                disabled={uploading}
              >
                {uploading ? '업로드 중...' : '적용'}
              </S.SaveButton>
            </S.CropButtonRow>
          </S.CropModal>
        </S.CropOverlay>
      )}

      <S.Overlay onClick={onClose}>
        <S.Modal onClick={(e) => e.stopPropagation()}>
          <S.Title>프로필 수정하기</S.Title>

          {/* 이름 */}
          <S.Row>
            <S.Label>이름</S.Label>
            <S.InputWrapper>
              <S.Input
                type="text"
                value={userName}
                maxLength={50}
                placeholder={user.userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <S.CharCount>{userName.length}/50</S.CharCount>
            </S.InputWrapper>
          </S.Row>

          {/* 학번 */}
          <S.Row>
            <S.Label>학번</S.Label>
            <S.Input
              type="text"
              value={hakbun}
              placeholder={initialHakbun}
              maxLength={4}
              style={{ flex: 1 }}
              onChange={(e) => setHakbun(e.target.value.replace(/\D/g, ''))}
            />
          </S.Row>

          {/* 전공 */}
          <S.Row>
            <S.Label>전공</S.Label>
            <S.MajorContainer ref={majorDropdownRef}>
              <S.MajorDropdownButton
                type="button"
                $isOpen={showMajorMenu}
                $hasSelection={majors.length > 0}
                onClick={() => setShowMajorMenu((v) => !v)}
              >
                <span>
                  {majors.length === 0
                    ? '전공 선택'
                    : majors.length <= 2
                      ? majors.join(', ')
                      : `${majors.slice(0, 2).join(', ')} 외 ${majors.length - 2}개`}
                </span>
                <S.MajorArrow $isOpen={showMajorMenu}>
                  <IoIosArrowBack />
                </S.MajorArrow>
              </S.MajorDropdownButton>

              {showMajorMenu && (
                <S.MajorDropdownMenu>
                  {MAJOR_OPTIONS.map((m) => {
                    const selected = majors.includes(m);
                    return (
                      <S.MajorItem
                        key={m}
                        $selected={selected}
                        onClick={() =>
                          setMajors((prev) =>
                            selected
                              ? prev.filter((x) => x !== m)
                              : [...prev, m],
                          )
                        }
                      >
                        <S.MajorItemLabel $selected={selected}>
                          {m}
                        </S.MajorItemLabel>
                      </S.MajorItem>
                    );
                  })}
                </S.MajorDropdownMenu>
              )}
            </S.MajorContainer>
          </S.Row>

          {/* 현재 프로필 이미지 */}
          {imageFileName && (
            <S.Row>
              <S.Label>프로필</S.Label>
              <S.ProfileFileName>{imageFileName}</S.ProfileFileName>
            </S.Row>
          )}

          {/* 이미지 업로드 */}
          <S.Row>
            <S.Label>프로필 변경</S.Label>
            <S.UploadButton>
              {uploading ? '업로드 중...' : '이미지 업로드하기'}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </S.UploadButton>
          </S.Row>

          {/* 링크 추가 토글 */}
          {!showLinks && (
            <S.LinkToggle type="button" onClick={() => setShowLinks(true)}>
              <S.LinkToggleIcon>⊕</S.LinkToggleIcon>
              링크 추가하기
            </S.LinkToggle>
          )}

          {/* 링크 입력 섹션 */}
          {showLinks && (
            <S.LinkSection>
              <S.LinkRow>
                <S.LinkIconWrapper>
                  <img src={GithubImg} alt="GitHub" width={18} height={18} />
                  GitHub
                </S.LinkIconWrapper>
                <S.LinkInputWrapper>
                  <S.LinkPrefix>https://github.com/</S.LinkPrefix>
                  <S.LinkInput
                    type="text"
                    placeholder="username"
                    value={githubId}
                    onChange={(e) => setGithubId(e.target.value)}
                  />
                </S.LinkInputWrapper>
              </S.LinkRow>
              <S.LinkRow>
                <S.LinkIconWrapper>
                  <img
                    src={LinkedinImg}
                    alt="LinkedIn"
                    width={18}
                    height={18}
                  />
                  LinkedIn
                </S.LinkIconWrapper>
                <S.LinkInputWrapper>
                  <S.LinkPrefix>https://www.linkedin.com/in/</S.LinkPrefix>
                  <S.LinkInput
                    type="text"
                    placeholder="username"
                    value={linkedinId}
                    onChange={(e) => setLinkedinId(e.target.value)}
                  />
                </S.LinkInputWrapper>
              </S.LinkRow>
            </S.LinkSection>
          )}

          <S.Divider />

          {/* 버튼 */}
          <S.ButtonRow>
            <S.CancelButton type="button" onClick={onClose}>
              취소
            </S.CancelButton>
            <S.SaveButton
              type="button"
              onClick={handleSave}
              disabled={uploading || !isValid}
            >
              저장
            </S.SaveButton>
          </S.ButtonRow>
        </S.Modal>
      </S.Overlay>
    </>
  );
}

export default EditProfileModal;
