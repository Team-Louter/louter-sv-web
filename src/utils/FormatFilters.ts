import type { Member } from "@/types/member";

export const getGenerations = (members: Member[]|null) => {
    const generations = [...new Set(members?.map(member => member.generation))]
      .sort((a, b) => a - b)
      .map(gen => `${gen}기`);
    
    return ['전체', ...generations];
  };