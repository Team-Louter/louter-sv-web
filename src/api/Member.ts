import type { Member } from '@/types/member';
import instance from './Axios';

// 멤버 가져오기
export const getMember = async (
  gen: string | null,
  key: string | null,
): Promise<Member[]> => {
  const params: Record<string, unknown> = {};
  if (gen !== null && gen !== '전체') {
    params.generation = Number(gen.replace('기', ''));
  }
  if (key !== null && key !== '') {
    params.keyword = key;
  }
  const response = await instance.get<Member[]>('/members', { params });
  return response.data;
};

// 멤버 역할 변경 (PUT /admin/members/role)
export const updateMemberRole = async (
  userId: number,
  role: 'LEADER' | 'MENTOR' | 'MENTEE',
): Promise<void> => {
  await instance.put('/admin/members/role', { userId, role });
};

// 멤버 퇴출 (DELETE /admin/members)
export const kickMember = async (userId: number): Promise<void> => {
  await instance.delete('/admin/members', { data: { userIds: [userId] } });
};

// 멤버 이메일 조회 (GET /admin/members/{userId}/email)
export const getMemberEmail = async (userId: number): Promise<string> => {
  const response = await instance.get<{ email: string }>(
    `/admin/members/${userId}/email`,
  );
  return response.data.email;
};
