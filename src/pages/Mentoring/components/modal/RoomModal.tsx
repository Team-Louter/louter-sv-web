import { useState, useMemo } from "react";
import * as S from "./RoomModal.styled";
import cancelIcon from "../../../../assets/mentoringImg/cancel.png";
import MemberList from "./member/MemberList";
import Search from "../SearchBar/SearchBar";
import type { GradeGroup } from "./member/member.type";

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, memberIds: number[]) => void;
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

export default function Mentoring({ isOpen, onClose, onCreate }: RoomModalProps) {
  if (!isOpen) return null;

  const [groups, setGroups] = useState<GradeGroup[]>(DUMMY_GROUPS);
  const [searchValue, setSearchValue] = useState("");
  const [roomName, setRoomName] = useState("");

  const checkedGrades = useMemo(
    () =>
      new Set(
        groups
          .filter(({ members }) => members.length > 0 && members.every((m) => m.checked))
          .map(({ grade }) => grade),
      ),
    [groups],
  );

  const isSearching = searchValue.trim() !== "";

  const filteredGroups = groups.map((g) => ({
    ...g,
    members: g.members.filter(
      (m) =>
        m.name.includes(searchValue) || String(m.number).includes(searchValue),
    ),
  }));

  const flatSearchResults = filteredGroups.flatMap((g) => g.members);
  const selectedMembers = groups.flatMap((g) => g.members).filter((m) => m.checked);
  const selectedCount = selectedMembers.length;

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
    const isCurrentlyAllChecked = checkedGrades.has(grade);
    setGroups((prev) =>
      prev.map((g) =>
        g.grade === grade
          ? {
              ...g,
              members: g.members.map((m) => ({
                ...m,
                checked: !isCurrentlyAllChecked,
              })),
            }
          : g,
      ),
    );
  };

  const handleClearAll = () => {
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        members: g.members.map((m) => ({ ...m, checked: false })),
      })),
    );
  };

  const handleCreate = () => {
    if (!roomName.trim()) return;
    const memberIds = selectedMembers.map((m) => m.id);
    onCreate(roomName, memberIds);
    setRoomName("");
    onClose();
  };

  return (
    <S.Overlay onClick={onClose}>
      <S.container onClick={(e) => e.stopPropagation()}>
        <S.TitleCancelContainer>
          <S.Wrapper />
          <S.Title>멘토링 방 생성</S.Title>
          <S.Cancel src={cancelIcon} onClick={onClose} />
        </S.TitleCancelContainer>

        <S.RoomName 
          placeholder="방 제목을 입력해 주세요." 
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />

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
        <S.DoneButton onClick={handleCreate}>생성</S.DoneButton>
      </S.container>
    </S.Overlay>
  );
}