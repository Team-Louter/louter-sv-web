import { useState, useEffect } from "react";
import * as S from "./MemberList.styled";
import type { GradeGroup, Member } from "@/types/mentoring";
import userImg from "@/assets/anonymousProfile.png";
import chevronImg from "@/assets/mentoringImg/Arrow.png";
import checkImg from "@/assets/mentoringImg/check.png";

interface MemberListProps {
  groups: GradeGroup[];
  flatSearchResults: Member[] | null;
  onToggleMember: (id: number) => void;
  onToggleGrade: (grade: number) => void;
  checkedGrades: Set<number>;
  selectedCount: number;
  onClearAll: () => void;
  searchSlot: React.ReactNode;
}

export default function MemberList({
  groups,
  flatSearchResults,
  onToggleMember,
  onToggleGrade,
  checkedGrades,
  selectedCount,
  onClearAll,
  searchSlot,
}: MemberListProps) {
  // 모든 학년이 기본적으로 열려 있도록 초기화
  const [openGrades, setOpenGrades] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (groups.length > 0) {
      setOpenGrades(new Set(groups.map((g) => g.grade)));
    }
  }, [groups]);

  const toggleOpen = (grade: number) => {
    setOpenGrades((prev) => {
      const next = new Set(prev);
      next.has(grade) ? next.delete(grade) : next.add(grade);
      return next;
    });
  };

  const renderMemberRow = (member: Member) => (
    <S.MemberRow key={member.id}>
      <S.ProfileImg src={member.profileImg || userImg} />
      <S.MemberInfo>
        <S.MemberName>{member.name}</S.MemberName>
        <S.MemberSub>
          {member.grade}학년 {member.class}반 {member.number}번
        </S.MemberSub>
      </S.MemberInfo>
      <S.RoleText>{member.role}</S.RoleText>
      <S.Checkbox
        checked={member.checked}
        onClick={() => onToggleMember(member.id)}
      >
        {member.checked && <S.CheckIcon src={checkImg} alt="check" />}
      </S.Checkbox>
    </S.MemberRow>
  );

  return (
    <S.Container>
      <S.SearchWrapper>{searchSlot}</S.SearchWrapper>

      <S.ListArea>
        {flatSearchResults ? (
          // 검색 중 - 폴더 없이 멤버만
          flatSearchResults.length > 0 ? (
            flatSearchResults.map(renderMemberRow)
          ) : (
            <S.EmptyText>검색 결과가 없습니다.</S.EmptyText>
          )
        ) : (
          // 기본 - 학년별 폴더
          groups.map(({ grade, members }) => (
            <S.GradeSection key={grade}>
              <S.GradeHeader onClick={() => toggleOpen(grade)}>
                <S.GradeTitle>{grade}학년</S.GradeTitle>
                <S.GradeRight>
                  <S.Checkbox
                    checked={checkedGrades.has(grade)}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleGrade(grade);
                    }}
                  >
                    {checkedGrades.has(grade) && (
                      <S.CheckIcon src={checkImg} alt="check" />
                    )}
                  </S.Checkbox>
                  <S.ChevronIcon
                    src={chevronImg}
                    isOpen={openGrades.has(grade)}
                    alt="chevron"
                  />
                </S.GradeRight>
              </S.GradeHeader>
              {openGrades.has(grade) && members.map(renderMemberRow)}
            </S.GradeSection>
          ))
        )}
      </S.ListArea>

      <S.Footer>
        <S.SelectedCount>멤버 {selectedCount}명 선택됨</S.SelectedCount>
        <S.ClearAll onClick={onClearAll}>전체 선택 취소</S.ClearAll>
      </S.Footer>
    </S.Container>
  );
}
