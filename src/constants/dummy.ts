import type { Member } from '@/types/member';
import type { Post } from '@/types/post';
import type { EventInput } from '@fullcalendar/core';

export const dummyEvents: EventInput[] = [
  { 
    title: '1차 디자인 시작',
    start: '2026-02-01',
    end: '2026-02-01',
    extendedProps: {
      assignees: ['김디자', '이디자', '박디자'],
      description: '1차 디자인 작업을 시작합니다.'
    }
  },
  { 
    title: '1차 디자인 마감',
    start: '2026-02-08',
    end: '2026-02-09',
    extendedProps: {
      assignees: ['이름지', '최담당'],
      description: '오늘까지 1차 디자인을 마감해주세요.'
    }
  },
  { 
    title: '1차 피드백',
    start: '2026-02-08',
    end: '2026-02-08',
    extendedProps: {
      assignees: ['박피드'],
      description: '1차 디자인에 대한 피드백을 진행합니다.'
    }
  },
  { 
    title: '2차 디자인 마감',
    start: '2026-02-12',
    end: '2026-02-13',
    extendedProps: {
      assignees: ['김디자', '이디자', '박디자', '최디자'],
      description: '2차 디자인 수정 작업을 완료해주세요.'
    }
  },
  { 
    title: '2차 피드백',
    start: '2026-02-13',
    end: '2026-02-13',
    extendedProps: {
      assignees: ['최리뷰'],
      description: '최종 디자인 검토 및 피드백'
    }
  },
  { 
    title: '프론트 개발',
    start: '2026-02-18',
    end: '2026-02-25',
    extendedProps: {
      assignees: ['정프론', '김프론', '이프론'],
      description: '프론트엔드 개발 진행'
    }
  },
  { 
    title: '프론트 개발',
    start: '2026-02-25',
    end: '2026-02-28',
    extendedProps: {
      assignees: ['정프론', '김프론', '이프론'],
      description: '프론트엔드 개발 마무리'
    }
  }
];

export const dummyMyPosts: Post[] = [
    {
      id: 1,
      title: '전수안의 리액트 네이티브에서 생존하기',
      viewCount: 361_523
    }
];
  
export const dummyPopularPosts: Post[] = [
    {
      id: 2,
      title: '라우터에서 살아남는 법',
      viewCount: 217_321
    },
    {
      id: 3,
      title: '상태 관리 지옥에서 탈출하기',
      viewCount: 189_004
    },
    {
      id: 4,
      title: '이도연의 키 작아지는 법',
      viewCount: 111_321
    }
  ];
  
export const dummyMembers: Member[] = [
  { id: 1, name: "정민성", generation: 1, role: "LEADER", major: ["Frontend", "Design"] },
  { id: 2, name: "김승우", generation: 2, role: "MENTEE", major: ["Backend"] },
  { id: 3, name: "김용진", generation: 1, role: "MENTOR", major: ["Frontend"] },
  { id: 4, name: "김민준", generation: 1, role: "MENTOR", major: ["Backend"] },
  { id: 5, name: "서진교", generation: 1, role: "LEADER", major: ["Frontend", "Design"] },
  { id: 6, name: "오정민", generation: 1, role: "MENTOR", major: ["Frontend", "Design"] },
  { id: 7, name: "유을", generation: 1, role: "MENTOR", major: ["Frontend"] },
  { id: 8, name: "이다연", generation: 2, role: "MENTOR", major: ["Backend"] },
  { id: 9, name: "이도연", generation: 2, role: "LEADER", major: ["Backend"] },
  { id: 10, name: "이동휘", generation: 1, role: "MENTOR", major: ["Backend"] },
  { id: 11, name: "이윤지", generation: 2, role: "MENTOR", major: ["Frontend", "Design"] },
  { id: 12, name: "전수안", generation: 2, role: "LEADER", major: ["Frontend"] },
  { id: 13, name: "최현수", generation: 2, role: "MENTOR", major: ["Frontend", "Design"] },
  { id: 14, name: "홍지율", generation: 1, role: "MENTOR", major: ["Frontend"] }
];