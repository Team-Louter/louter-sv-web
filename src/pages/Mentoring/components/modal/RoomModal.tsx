import { useState } from "react";
import * as S from "./RoomModal.styled";
import cancelIcon from "../../../../assets/mentoringImg/cancel.png";
import MemberList from "./member/MemberList";
import Search from "../SearchBar/SearchBar";
import type { GradeGroup } from "./member/member.type";

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DUMMY_GROUPS: GradeGroup[] = [
  {
    grade: 1,
    members: [
      {
        id: 1,
        name: "이도연",
        grade: 1,
        class: 4,
        number: 2,
        role: "부장 (Leader)",
        checked: false,
      },
    ],
  },
  {
    grade: 2,
    members: [
      {
        id: 2,
        name: "이도연",
        grade: 2,
        class: 4,
        number: 2,
        role: "부장 (Leader)",
        checked: true,
      },
      {
        id: 3,
        name: "김민준",
        grade: 2,
        class: 4,
        number: 5,
        role: "멤버 (Member)",
        checked: true,
      },
    ],
  },
  {
    grade: 3,
    members: [],
  },
];

export default function Mentoring({ isOpen, onClose }: RoomModalProps) {
  if (!isOpen) return null;
  const [groups, setGroups] = useState<GradeGroup[]>(DUMMY_GROUPS);
  const [checkedGrades, setCheckedGrades] = useState<Set<number>>(new Set([2]));
  const [searchValue, setSearchValue] = useState("");

  const isSearching = searchValue.trim() !== "";

  const filteredGroups = groups.map((g) => ({
    ...g,
    members: g.members.filter(
      (m) =>
        m.name.includes(searchValue) || String(m.number).includes(searchValue),
    ),
  }));

  const flatSearchResults = filteredGroups.flatMap((g) => g.members);
  const selectedCount = groups
    .flatMap((g) => g.members)
    .filter((m) => m.checked).length;

  const handleToggleMember = (id: number) => {
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        members: g.members.map((m) =>
          m.id === id ? { ...m, checked: !m.checked } : m,
        ),
      })),
    );
  };

  const handleToggleGrade = (grade: number) => {
    setCheckedGrades((prev) => {
      const next = new Set(prev);
      if (next.has(grade)) {
        next.delete(grade);
        setGroups((p) =>
          p.map((g) =>
            g.grade === grade
              ? {
                  ...g,
                  members: g.members.map((m) => ({ ...m, checked: false })),
                }
              : g,
          ),
        );
      } else {
        next.add(grade);
        setGroups((p) =>
          p.map((g) =>
            g.grade === grade
              ? {
                  ...g,
                  members: g.members.map((m) => ({ ...m, checked: true })),
                }
              : g,
          ),
        );
      }
      return next;
    });
  };

  const handleClearAll = () => {
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        members: g.members.map((m) => ({ ...m, checked: false })),
      })),
    );
    setCheckedGrades(new Set());
  };

  return (
    <S.Overlay onClick={onClose}>
      <S.container onClick={e => e.stopPropagation()}>
        <S.TitleCancelContainer>
          <S.Wrapper />
          <S.Title>멘토링 방 생성</S.Title>
          <S.Cancel src={cancelIcon} onClick={onClose} />
        </S.TitleCancelContainer>
  
        <S.RoomName placeholder="방 제목을 입력해 주세요." />
  
        <S.AddMemberContainer>
          <MemberList
            groups={filteredGroups}
            flatSearchResults={isSearching ? flatSearchResults : null}
            onToggleMember={handleToggleMember}
            onToggleGrade={handleToggleGrade}
            checkedGrades={checkedGrades}
            selectedCount={selectedCount}
            onClearAll={handleClearAll}
            searchSlot={<Search onSearch={setSearchValue} />}
          />
        </S.AddMemberContainer>
      </S.container>
    </S.Overlay>
  );
}
