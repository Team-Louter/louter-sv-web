import type { Member } from "@/types/member";

export const formatAssignees = (assignees?: { userName: string }[] | string[]): string => {
  if (!assignees || assignees.length === 0) return '-';
  
  const names = assignees.map(a => typeof a === 'string' ? a : a.userName);
  
  if (names.length === 1) return names[0];
  return `${names[0]} 외 ${names.length - 1}명`;
};

type ScheduleTarget = 'ALL' | 'GENERATION' | 'PERSONAL';

type ScheduleTargetResult = {
    scheduleTarget: ScheduleTarget;
    generations: number[];
    userIds: number[];
};

export const getScheduleTarget = (selectedMemberIds: number[], allMembers: Member[]): ScheduleTargetResult => {
    // 전체 선택
    if (selectedMemberIds.length === allMembers.length && allMembers.length > 0) {
        return { scheduleTarget: 'ALL', generations: [], userIds: [] };
    }

    const selectedMembers = allMembers.filter(m => selectedMemberIds.includes(m.userId));
    const selectedGenerations = [...new Set(selectedMembers.map(m => m.generation))];

    // 완전히 선택된 기수 추출
    const fullySelectedGenerations = selectedGenerations.filter(gen => {
        const genMembers = allMembers.filter(m => m.generation === gen);
        return genMembers.every(m => selectedMemberIds.includes(m.userId));
    });

    // 기수 선택 후 추가로 개별 선택된 멤버
    const partialMembers = selectedMembers
        .filter(m => !fullySelectedGenerations.includes(m.generation))
        .map(m => m.userId);

    if (fullySelectedGenerations.length > 0) {
        return {
            scheduleTarget: 'GENERATION',
            generations: fullySelectedGenerations,
            userIds: partialMembers,
        };
    }

    // 개별 선택만
    return { scheduleTarget: 'PERSONAL', generations: [], userIds: selectedMemberIds };
};