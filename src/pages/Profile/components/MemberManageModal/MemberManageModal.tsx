import { useState, useEffect, useRef } from 'react';
import { GoSearch, GoX, GoKebabHorizontal } from 'react-icons/go';
import * as S from './MemberManageModal.styled';
import {
  getMember,
  updateMemberRole,
  kickMember,
  getMemberEmail,
} from '@/api/Member';
import { toast } from '@/store/toastStore';
import type { Member } from '@/types/member';

type MemberManageModalProps = {
  onClose: () => void;
};

const ROLE_LABEL: Record<string, string> = {
  LEADER: '부장 (Leader)',
  MENTOR: '멘토 (Mentor)',
  MENTEE: '멘티 (Mentee)',
};

function getRoleLabel(role: string) {
  return ROLE_LABEL[role] ?? '멘티 (Mentee)';
}

function MemberManageModal({ onClose }: MemberManageModalProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [openKebabId, setOpenKebabId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const kebabRef = useRef<HTMLDivElement>(null);

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
        if (openKebabId !== null) setOpenKebabId(null);
        else onClose();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose, openKebabId]);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    if (openKebabId === null) return;
    const handleClick = (e: MouseEvent) => {
      if (kebabRef.current && !kebabRef.current.contains(e.target as Node)) {
        setOpenKebabId(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openKebabId]);

  const filtered = members.filter((m) => {
    if (!query) return true;
    const q = query.trim().toLowerCase();
    return m.userName.toLowerCase().includes(q) || String(m.hakbun).includes(q);
  });

  const toggleSelect = (userId: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(userId) ? next.delete(userId) : next.add(userId);
      return next;
    });
  };

  const handleCopyEmail = async (userId: number) => {
    setOpenKebabId(null);
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

  const handleKick = async (member: Member) => {
    setOpenKebabId(null);
    if (!window.confirm(`${member.userName}님을 동아리에서 퇴출하시겠습니까?`))
      return;
    try {
      await kickMember(member.userId);
      setMembers((prev) => prev.filter((m) => m.userId !== member.userId));
      toast.success(`${member.userName}님이 퇴출되었습니다.`);
    } catch {
      toast.error('퇴출에 실패했습니다.');
    }
  };

  return (
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
            <S.EmptyMessage>불러오는 중...</S.EmptyMessage>
          ) : filtered.length === 0 ? (
            <S.EmptyMessage>검색 결과가 없습니다</S.EmptyMessage>
          ) : (
            filtered.map((member) => (
              <S.MemberRow
                key={member.userId}
                onClick={() => toggleSelect(member.userId)}
              >
                <S.Checkbox
                  type="checkbox"
                  checked={selected.has(member.userId)}
                  onChange={() => toggleSelect(member.userId)}
                  onClick={(e) => e.stopPropagation()}
                />
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
                    {member.grade}학년 {member.classRoom}반 {member.number}번
                  </S.MemberSub>
                </S.MemberInfo>
                <S.RoleLabel>{getRoleLabel(member.role)}</S.RoleLabel>

                {/* ─── 케밥 메뉴 ─── */}
                <S.KebabWrapper
                  ref={openKebabId === member.userId ? kebabRef : null}
                >
                  <S.KebabButton
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenKebabId((prev) =>
                        prev === member.userId ? null : member.userId,
                      );
                    }}
                  >
                    <GoKebabHorizontal size={16} />
                  </S.KebabButton>
                  {openKebabId === member.userId && (
                    <S.DropdownMenu onClick={(e) => e.stopPropagation()}>
                      <S.DropdownItem
                        onClick={() => handleCopyEmail(member.userId)}
                      >
                        이메일 복사
                      </S.DropdownItem>
                      {member.role !== 'MENTOR' && (
                        <S.DropdownItem
                          onClick={() => handleRoleChange(member, 'MENTOR')}
                        >
                          멘토로 지정하기
                        </S.DropdownItem>
                      )}
                      {member.role !== 'LEADER' && (
                        <S.DropdownItem
                          onClick={() => handleRoleChange(member, 'LEADER')}
                        >
                          부장으로 지정하기
                        </S.DropdownItem>
                      )}
                      {member.role !== 'MENTEE' && (
                        <S.DropdownItem
                          onClick={() => handleRoleChange(member, 'MENTEE')}
                        >
                          멘티로 변경하기
                        </S.DropdownItem>
                      )}
                      <S.DropdownDivider />
                      <S.DropdownItem
                        $danger
                        onClick={() => handleKick(member)}
                      >
                        동아리에서 퇴출하기
                      </S.DropdownItem>
                    </S.DropdownMenu>
                  )}
                </S.KebabWrapper>
              </S.MemberRow>
            ))
          )}
        </S.MemberList>

        {/* ─── 하단 바 ─── */}
        <S.Footer>
          <S.FooterCount>멤버 {filtered.length}명 표시 중</S.FooterCount>
          <S.FooterButtons>
            <S.FooterButton type="button" onClick={onClose}>
              ESC
            </S.FooterButton>
            <S.FooterButton type="button" onClick={onClose}>
              닫기
            </S.FooterButton>
          </S.FooterButtons>
        </S.Footer>
      </S.Modal>
    </S.Overlay>
  );
}

export default MemberManageModal;
