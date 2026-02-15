export interface Member {
    id: number;
    name: string;
    generation: number;
    role: string;
    major: string[];
}

interface MemberProps {
    memberInfo: Member;
  }