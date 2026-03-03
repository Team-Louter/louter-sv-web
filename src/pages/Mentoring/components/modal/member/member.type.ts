export interface Member {
  id: number;
  name: string;
  grade: number;
  class: number;
  number: number;
  role: string;
  profileImg?: string;
  checked: boolean;
}

export interface GradeGroup {
  grade: number;
  members: Member[];
}