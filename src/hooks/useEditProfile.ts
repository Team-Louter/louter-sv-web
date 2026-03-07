import { useState, useEffect, useRef } from 'react';
import { updateProfile, getUser } from '@/api/User';
import { toast } from '@/store/toastStore';
import type { User } from '@/types/user';

interface UseEditProfileOptionParams {
  user: User;
  profileImageUrl: string;
  onUpdated: (updated: User) => void;
  onClose: () => void;
}

interface UseEditProfileReturnParams {
  userName: string;
  setUserName: (v: string) => void;
  hakbun: string;
  setHakbun: (v: string) => void;
  majors: string[];
  setMajors: React.Dispatch<React.SetStateAction<string[]>>;
  githubId: string;
  setGithubId: (v: string) => void;
  linkedinId: string;
  setLinkedinId: (v: string) => void;
  showLinks: boolean;
  setShowLinks: (v: boolean) => void;
  showMajorMenu: boolean;
  setShowMajorMenu: React.Dispatch<React.SetStateAction<boolean>>;
  majorDropdownRef: React.RefObject<HTMLDivElement | null>;
  isValid: boolean;
  handleSave: () => Promise<void>;
}

export function useEditProfile({
  user,
  profileImageUrl,
  onUpdated,
  onClose,
}: UseEditProfileOptionParams): UseEditProfileReturnParams {
  const initialHakbun = `${user.grade}${user.classRoom}${String(user.number).padStart(2, '0')}`;

  const [userName, setUserName] = useState(user.userName);
  const [hakbun, setHakbun] = useState(initialHakbun);
  const [majors, setMajors] = useState<string[]>(user.majors ?? []);
  const [githubId, setGithubId] = useState<string>(() => {
    const url = user.githubUrl ?? '';
    const parts = url.split('github.com/').filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1].split('/')[0] : '';
  });
  const [linkedinId, setLinkedinId] = useState<string>(() => {
    const url = user.linkedinUrl ?? '';
    const parts = url.split(/linkedin\.com\/in\//i).filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1].split('/')[0] : '';
  });
  const [showLinks, setShowLinks] = useState(false);
  const [showMajorMenu, setShowMajorMenu] = useState(false);

  const majorDropdownRef = useRef<HTMLDivElement | null>(null);

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
      // updateProfile 응답으로 즉시 반영, 백그라운드에서 /me 재조회
      onUpdated({ ...updated, profileImageUrl });
      onClose();
      getUser()
        .then(onUpdated)
        .catch(() => {});
    } catch {
      toast.error('프로필 수정에 실패했습니다.');
    }
  };

  return {
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
  };
}
