import { useRef } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import * as S from './EditProfileModal.styled';
import CropModal from './CropModal';
import { useCropImage } from '@/hooks/useCropImage';
import { useEditProfile } from '@/hooks/useEditProfile';
import { MAJOR_OPTIONS } from '@/constants/Member';
import type { User } from '@/types/user';
import GithubImg from '@/assets/Mypage/github.svg';
import LinkedinImg from '@/assets/Mypage/linkedin.svg';

type EditProfileModalProps = {
  user: User;
  onClose: () => void;
  onUpdated: (updated: User) => void;
};

function EditProfileModal({ user, onClose, onUpdated }: EditProfileModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    cropSrc,
    crop,
    zoom,
    uploading,
    profileImageUrl,
    imageFileName,
    setCrop,
    setZoom,
    onCropComplete,
    handleFileChange,
    handleCropConfirm,
    handleCropCancel,
  } = useCropImage(user.profileImageUrl ?? '');

  const {
    userName,
    setUserName,
    hakbun,
    setHakbun,
    majors,
    setMajors,
    githubId,
    setGithubId,
    linkedinId,
    setLinkedinId,
    showLinks,
    setShowLinks,
    showMajorMenu,
    setShowMajorMenu,
    majorDropdownRef,
    isValid,
    handleSave,
  } = useEditProfile({ user, profileImageUrl, onUpdated, onClose });

  const initialHakbun = `${user.grade}${user.classRoom}${String(user.number).padStart(2, '0')}`;

  return (
    <>
      {/* ─── 크롭 모달 ─── */}
      {cropSrc && (
        <CropModal
          cropSrc={cropSrc}
          crop={crop}
          zoom={zoom}
          uploading={uploading}
          setCrop={setCrop}
          setZoom={setZoom}
          onCropComplete={onCropComplete}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
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
