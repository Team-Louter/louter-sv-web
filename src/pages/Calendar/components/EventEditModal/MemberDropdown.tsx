import { useState, useRef, useEffect } from "react";
import * as S from "./MemberDropdown.styled";
import type { Member } from "@/types/member";
import { IoIosArrowBack } from "react-icons/io";
import { getGenerations } from "@/utils/FormatFilters";
import { formatAssignees } from "@/utils/FormatAssignee";
import { getMember } from "@/api/Member";

export interface MemberDropdownProps {
  selectedMemberIds: number[];
  onSelectChange: (memberIds: number[]) => void;
  onMembersLoad: (members: Member[]) => void;
}

export default function MemberDropdown({ selectedMemberIds, onSelectChange, onMembersLoad }: MemberDropdownProps) {
    const [isOpen, setIsOpen] = useState(false); // 담당자 선택 드롭다운 열림 여부
    const [expandedGenerations, setExpandedGenerations] = useState<Set<number | 'all'>>(new Set()); // 기수별 드롭다운 열림 여부
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [members, setMembers] = useState<Member[]>([]);
        
    const getMemberInfo = async () => {
        try{
            const data = await getMember(null, null);
            setMembers(data);
            onMembersLoad(data); 
        } catch(err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getMemberInfo();
    }, [])

    const generationLabels = getGenerations(members); // 기수 뽑아내기

    const getGenKey = (label: string): number | 'all' => // map 사용 시 키로 사용하기 위한 변형
        label === '전체' ? 'all' : parseInt(label);

    useEffect(() => {
        // 드롭다운 밖을 클릭 시 전체 드롭다운 닫기
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 기수별 학생 배열 생성
    const getMembersByGeneration = (gen: number | 'all'): Member[] => {
        if (gen === 'all') return members;
        return members.filter(m => m.generation === gen);
    };

    // 특정 기수 선택 시 해당하는 학생이 전부 선택되었는지 확인
    const isGenerationFullySelected = (gen: number | 'all'): boolean => {
        const members = getMembersByGeneration(gen);
        return members.length > 0 && members.every(m => selectedMemberIds.includes(m.userId));
    };

    // 특정 기수 선택 시 해당 기수 학생 전체 선택 / 해제
    const toggleGeneration = (gen: number | 'all') => {
        const members = getMembersByGeneration(gen);
        const memberIds = members.map(m => m.userId);
        const allSelected = isGenerationFullySelected(gen);

        if (allSelected) {
            onSelectChange(selectedMemberIds.filter(id => !memberIds.includes(id)));
        } else {
            const newSelected = new Set([...selectedMemberIds, ...memberIds]);
            onSelectChange(Array.from(newSelected));
        }
    };

    // 개별 학생 선택 시 해당 학생 선택 / 해제
    const toggleMember = (memberId: number) => {
        if (selectedMemberIds.includes(memberId)) {
            onSelectChange(selectedMemberIds.filter(id => id !== memberId));
        } else {
            onSelectChange([...selectedMemberIds, memberId]);
        }
    };

    // 화살표 클릭 시 해당 기수 열기 / 접기
    const toggleExpand = (gen: number | 'all') => {
        const newExpanded = new Set(expandedGenerations);
        if (newExpanded.has(gen)) {
            newExpanded.delete(gen);
        } else {
            newExpanded.add(gen);
        }
        setExpandedGenerations(newExpanded);
    };

    // 선택된 학생 목록을 가공해 표시
    const getDisplayText = (): string => {
        if (selectedMemberIds.length === 0) return '담당자 선택';

        const selectedNames = members
            .filter(m => selectedMemberIds.includes(m.userId))
            .map(m => m.userName);

        return formatAssignees(selectedNames);
    };

    // 기수 하나 (헤더 + 학생) 렌더링
    const renderGenerationGroup = (gen: number | 'all', label: string) => {
        const isSelected = isGenerationFullySelected(gen);
    
        return (
            <div key={gen}>
                <S.GenerationHeader $selected={isSelected}>
                    <S.GenerationLeft onClick={() => toggleGeneration(gen)}>
                        <S.Label $selected={isSelected}>{label}</S.Label>
                    </S.GenerationLeft>
                    <S.ArrowIcon $isOpen={expandedGenerations.has(gen)} onClick={() => toggleExpand(gen)}>
                        <IoIosArrowBack />
                    </S.ArrowIcon>
                </S.GenerationHeader>
    
                {expandedGenerations.has(gen) && (
                    <S.MemberList>
                        {getMembersByGeneration(gen).map(member => {
                            const isMemberSelected = selectedMemberIds.includes(member.userId);
                            return (
                                <S.MemberItem
                                    key={member.userId}
                                    onClick={() => toggleMember(member.userId)}
                                    $selected={isMemberSelected}
                                >
                                    <S.Label $selected={isMemberSelected}>{member.userName}</S.Label>
                                </S.MemberItem>
                            );
                        })}
                    </S.MemberList>
                )}
            </div>
        );
    };

    return (
        <S.Container ref={dropdownRef}>
            <S.DropdownButton
                onClick={() => setIsOpen(!isOpen)}
                $isOpen={isOpen}
                $hasSelection={selectedMemberIds.length > 0}
            >
                <span>{getDisplayText()}</span>
                <S.ArrowIcon $isOpen={isOpen}><IoIosArrowBack /></S.ArrowIcon>
            </S.DropdownButton>

            {isOpen && (
                <S.DropdownMenu>
                    {generationLabels.map(label =>
                        renderGenerationGroup(getGenKey(label), label)
                    )}
                </S.DropdownMenu>
            )}
        </S.Container>
    );
}