import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { GoSearch, GoX } from 'react-icons/go';
import { BsThreeDotsVertical } from 'react-icons/bs';
import CrownIcon from '@/assets/Mypage/crown.svg';
import * as S from './MemberManageModal.styled';
import KickConfirmModal from './KickConfirmModal';
import { getMember, updateMemberRole, getMemberEmail } from '@/api/Member';
import { ROLE_LABEL } from '@/constants/Member';
import { toast } from '@/store/toastStore';
import type { Member } from '@/types/member';

type MemberManageModalProps = {
  onClose: () => void;
};

function getRoleLabel(role: string) {
  return ROLE_LABEL[role] ?? '멘티 (Mentee)';
}

function MemberManageModal({ onClose }: MemberManageModalProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [openKebabId, setOpenKebabId] = useState<number | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{
    top: number;
    right: number;
  } | null>(null);
  const [kickTarget, setKickTarget] = useState<Member | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    getMember('전체', null)
      .then(setMembers)
      .catch(() => toast.error('멤버 정보를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (openKebabId !== null) {
          setOpenKebabId(null);
          setDropdownPos(null);
        } else onClose();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose, openKebabId]);

  useEffect(() => {
    if (openKebabId === null) return;
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(`[data-kebab-id="${openKebabId}"]`)) return;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setOpenKebabId(null);
        setDropdownPos(null);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [openKebabId]);

  useEffect(() => {
    if (openKebabId === null) return;
    const close = () => {
      setOpenKebabId(null);
      setDropdownPos(null);
    };
    window.addEventListener('scroll', close, true);
    return () => window.removeEventListener('scroll', close, true);
  }, [openKebabId]);

  const toggleKebab = (
    e: React.MouseEvent<HTMLButtonElement>,
    memberId: number,
  ) => {
    e.stopPropagation();
    if (openKebabId === memberId) {
      setOpenKebabId(null);
      setDropdownPos(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
      setOpenKebabId(memberId);
    }
  };

  const filtered = members.filter((m) => {
    if (!query) return true;
    const q = query.trim().toLowerCase();
    return m.userName.toLowerCase().includes(q) || String(m.hakbun).includes(q);
  });

  const openMember =
    openKebabId !== null
      ? (members.find((m) => m.userId === openKebabId) ?? null)
      : null;

  const handleCopyEmail = async (userId: number) => {
    setOpenKebabId(null);
    setDropdownPos(null);
    try {
      const email = await getMemberEmail(userId);
      await navigator.clipboard.writeText(email);
      toast.success('이메일이 복사되었습니다.');
    } catch {
      toast.error('이메일을 가져오지 못했습니다.');
    }
  };

  const handleRoleChange = async (
    member: Member,
    role: 'LEADER' | 'MENTOR' | 'MENTEE',
  ) => {
    setOpenKebabId(null);
    setDropdownPos(null);
    try {
      await updateMemberRole(member.userId, role);
      setMembers((prev) =>
        prev.map((m) => (m.userId === member.userId ? { ...m, role } : m)),
      );
      toast.success(
        `${member.userName}님을 ${getRoleLabel(role)}로 지정했습니다.`,
      );
    } catch {
      toast.error('역할 변경에 실패했습니다.');
    }
  };

  const handleKick = (member: Member) => {
    setOpenKebabId(null);
    setDropdownPos(null);
    setKickTarget(member);
  };

  return (
    <>
      <S.Overlay onClick={onClose}>
        <S.Modal onClick={(e) => e.stopPropagation()}>
          {/* ─── 검색 헤더 ─── */}
          <S.SearchHeader>
            <S.SearchIcon>
              <GoSearch size={18} />
            </S.SearchIcon>
            <S.SearchInput
              ref={inputRef}
              placeholder="이름이나 학번을 입력하세요"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <S.CloseIconButton type="button" onClick={onClose}>
              <GoX size={18} />
            </S.CloseIconButton>
          </S.SearchHeader>

          {/* ─── 멤버 목록 ─── */}
          <S.MemberList>
            {loading ? (
              <SkeletonTheme baseColor="#f0f0f0" highlightColor="#e0e0e0">
                {Array.from({ length: 4 }).map((_, i) => (
                  <S.MemberRow key={i}>
                    <S.LeftSection>
                      <Skeleton circle width={30} height={30} />
                      <S.MemberInfo>
                        <Skeleton width={70} height={13} />
                        <Skeleton width={95} height={11} />
                      </S.MemberInfo>
                    </S.LeftSection>
                    <S.RoleLabel>
                      <Skeleton width={80} height={12} />
                    </S.RoleLabel>
                    <S.RightSection>
                      <Skeleton width={20} height={20} borderRadius={4} />
                    </S.RightSection>
                  </S.MemberRow>
                ))}
              </SkeletonTheme>
            ) : filtered.length === 0 ? (
              <S.EmptyMessage>검색 결과가 없습니다</S.EmptyMessage>
            ) : (
              filtered.map((member) => (
                <S.MemberRow key={member.userId}>
                  <S.LeftSection>
                    <S.Avatar>
                      {member.profileImageUrl ? (
                        <S.AvatarImage
                          src={member.profileImageUrl}
                          alt={member.userName}
                        />
                      ) : (
                        <S.AvatarFallback>
                          {member.userName.charAt(0)}
                        </S.AvatarFallback>
                      )}
                    </S.Avatar>
                    <S.MemberInfo>
                      <S.MemberName>{member.userName}</S.MemberName>
                      <S.MemberSub>
                        {member.grade}학년 {member.classRoom}반 {member.number}
                        번
                      </S.MemberSub>
                    </S.MemberInfo>
                  </S.LeftSection>
                  <S.RoleLabel>
                    {member.role === 'LEADER' && (
                      <img src={CrownIcon} alt="" width={15} height={15} />
                    )}
                    <span>{getRoleLabel(member.role)}</span>
                    {member.role === 'LEADER' && (
                      <img
                        src={CrownIcon}
                        alt=""
                        width={15}
                        height={15}
                        style={{ visibility: 'hidden' }}
                      />
                    )}
                  </S.RoleLabel>

                  {/* ─── 케밥 버튼 ─── */}
                  <S.RightSection>
                    <S.KebabButton
                      type="button"
                      data-kebab-id={member.userId}
                      onClick={(e) => toggleKebab(e, member.userId)}
                    >
                      <BsThreeDotsVertical size={16} />
                    </S.KebabButton>
                  </S.RightSection>
                </S.MemberRow>
              ))
            )}
          </S.MemberList>

          {/* ─── 하단 바 ─── */}
          <S.Footer>
            <S.FooterCount>
              {loading ? (
                <Skeleton
                  width={90}
                  height={13}
                  baseColor="#f0f0f0"
                  highlightColor="#e0e0e0"
                />
              ) : (
                `멤버 ${filtered.length}명 표시 중`
              )}
            </S.FooterCount>
            <S.ShortcutHint>
              <S.KeyBadge>ESC</S.KeyBadge>
              <span>닫기</span>
            </S.ShortcutHint>
          </S.Footer>
        </S.Modal>
      </S.Overlay>
      {kickTarget && (
        <KickConfirmModal
          member={kickTarget}
          onClose={() => setKickTarget(null)}
          onKicked={(userId) =>
            setMembers((prev) => prev.filter((m) => m.userId !== userId))
          }
        />
      )}
      {openKebabId !== null &&
        dropdownPos &&
        openMember &&
        createPortal(
          <S.DropdownMenu
            ref={dropdownRef}
            style={{ top: dropdownPos.top, right: dropdownPos.right }}
            onClick={(e) => e.stopPropagation()}
          >
            <S.DropdownItem onClick={() => handleCopyEmail(openMember.userId)}>
              이메일 복사
            </S.DropdownItem>
            {openMember.role !== 'MENTOR' && (
              <S.DropdownItem
                onClick={() => handleRoleChange(openMember, 'MENTOR')}
              >
                멘토로 지정하기
              </S.DropdownItem>
            )}
            {openMember.role !== 'MENTEE' && (
              <S.DropdownItem
                onClick={() => handleRoleChange(openMember, 'MENTEE')}
              >
                멘티로 변경하기
              </S.DropdownItem>
            )}
            <S.DropdownDivider />
            {openMember.role !== 'LEADER' && (
              <S.DropdownItem
                $danger
                onClick={() => handleRoleChange(openMember, 'LEADER')}
              >
                부장으로 지정하기
              </S.DropdownItem>
            )}
            <S.DropdownItem $danger onClick={() => handleKick(openMember)}>
              동아리에서 퇴출하기
            </S.DropdownItem>
          </S.DropdownMenu>,
          document.body,
        )}
    </>
  );
}

export default MemberManageModal;
