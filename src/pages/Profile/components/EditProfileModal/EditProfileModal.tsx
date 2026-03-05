import { useState, useRef, useEffect } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import * as S from './EditProfileModal.styled';
import { updateProfile } from '@/api/User';
import { uploadFile } from '@/api/Post';
import { toast } from '@/store/toastStore';
import type { User } from '@/types/user';

/* ─── GitHub/LinkedIn SVG 아이콘 ─── */
const GithubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="#0A66C2"
    aria-hidden="true"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

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

type Props = {
  user: User;
  onClose: () => void;
  onUpdated: () => void;
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
    const m = url.match(/github\.com\/([^/]+)/);
    return m ? m[1] : url;
  });
  const [linkedinId, setLinkedinId] = useState<string>(() => {
    const url = user.linkedinUrl ?? '';
    const m = url.match(/linkedin\.com\/in\/([^/]+)/i);
    return m ? m[1] : url;
  });
  const [showLinks, setShowLinks] = useState(
    !!(user.githubUrl || user.linkedinUrl),
  );
  const [uploading, setUploading] = useState(false);
  const [showMajorMenu, setShowMajorMenu] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const majorDropdownRef = useRef<HTMLDivElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadFile(file);
      setProfileImageUrl(url);
      setImageFileName(file.name);
      toast.success('이미지가 업로드되었습니다.');
    } catch {
      toast.error('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const isValid = userName.trim() !== '' && hakbun.trim() !== '';

  const handleSave = async () => {
    if (!isValid) {
      toast.error('이름과 학번은 필수 입력 항목입니다.');
      return;
    }
    try {
      await updateProfile({
        profileImageUrl,
        userName,
        hakbun: Number(hakbun),
        majors,
        githubId,
        linkedinId,
      });
      toast.success('프로필이 수정되었습니다.');
      onUpdated();
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
              <span>{majors.length > 0 ? majors.join(', ') : '전공 선택'}</span>
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
                          selected ? prev.filter((x) => x !== m) : [...prev, m],
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
        <S.LinkToggle type="button" onClick={() => setShowLinks((v) => !v)}>
          <S.LinkToggleIcon>{showLinks ? '−' : '⊕'}</S.LinkToggleIcon>
          {showLinks ? '링크 닫기' : '링크 추가하기'}
        </S.LinkToggle>

        {/* 링크 입력 섹션 */}
        {showLinks && (
          <S.LinkSection>
            <S.LinkRow>
              <S.LinkIconWrapper>
                <GithubIcon />
                GitHub
              </S.LinkIconWrapper>
              <S.LinkInput
                type="text"
                placeholder="GitHub 아이디 입력"
                value={githubId}
                onChange={(e) => setGithubId(e.target.value)}
              />
            </S.LinkRow>
            <S.LinkRow>
              <S.LinkIconWrapper>
                <LinkedinIcon />
                LinkedIn
              </S.LinkIconWrapper>
              <S.LinkInput
                type="text"
                placeholder="LinkedIn 아이디 입력"
                value={linkedinId}
                onChange={(e) => setLinkedinId(e.target.value)}
              />
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
  );
}

export default EditProfileModal;
