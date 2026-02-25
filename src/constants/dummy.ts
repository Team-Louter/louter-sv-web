import type { Member } from '@/types/member';
import type { Comment, MainPost, Post } from '@/types/post';
import type { EventInput } from '@fullcalendar/core';

export const dummyEvents: EventInput[] = [
  { 
    title: '1차 디자인 시작',
    start: '2026-02-01',
    end: '2026-02-02',
    extendedProps: {
      assignees: [
        { id: 1, name: '정민성' },
        { id: 6, name: '오정민' },
        { id: 11, name: '이윤지' }
      ],
      description: '1차 디자인 작업을 시작합니다.'
    }
  },
  { 
    title: '1차 디자인 마감',
    start: '2026-02-08',
    end: '2026-02-09',
    extendedProps: {
      assignees: [
        { id: 5, name: '서진교' },
        { id: 13, name: '최현수' }
      ],
      description: '오늘까지 1차 디자인을 마감해주세요.'
    }
  },
  { 
    title: '1차 피드백',
    start: '2026-02-08',
    end: '2026-02-09',
    extendedProps: {
      assignees: [
        { id: 3, name: '김용진' }
      ],
      description: '1차 디자인에 대한 피드백을 진행합니다.'
    }
  },
  { 
    title: '2차 디자인 마감',
    start: '2026-02-12',
    end: '2026-02-13',
    extendedProps: {
      assignees: [
        { id: 1, name: '정민성' },
        { id: 6, name: '오정민' },
        { id: 11, name: '이윤지' },
        { id: 13, name: '최현수' }
      ],
      description: '2차 디자인 수정 작업을 완료해주세요.'
    }
  },
  { 
    title: '2차 피드백',
    start: '2026-02-13',
    end: '2026-02-14',
    extendedProps: {
      assignees: [
        { id: 9, name: '이도연' }
      ],
      description: '최종 디자인 검토 및 피드백'
    }
  },
  { 
    title: '프론트 개발',
    start: '2026-02-18',
    end: '2026-02-25',
    extendedProps: {
      assignees: [
        { id: 12, name: '전수안' },
        { id: 7, name: '유을' },
        { id: 14, name: '홍지율' }
      ],
      description: '프론트엔드 개발 진행'
    }
  },
  { 
    title: '프론트 개발',
    start: '2026-02-25',
    end: '2026-02-28',
    extendedProps: {
      assignees: [
        { id: 12, name: '전수안' },
        { id: 7, name: '유을' },
        { id: 14, name: '홍지율' }
      ],
      description: '프론트엔드 개발 마무리'
    }
  }
];

export const dummyMyPosts: MainPost[] = [
    {
      id: 1,
      title: '전수안의 리액트 네이티브에서 생존하기',
      viewCount: 361_523
    }
];
  
export const dummyPopularPosts: MainPost[] = [
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

export const dummyPosts: Post[] = [
  {
    id: 1,
    category: "공지사항",
    tag: "",
    title: "커뮤니티 이용 규칙 안내",
    content: "깨끗한 커뮤니티 환경을 위해 공지사항을 반드시 숙지해 주세요.",
    views: 1250,
    likes: 85,
    comments: 0,
    author: "관리자",
    createdAt: "2026-02-18T16:57:36.911Z",
    isPinned: true,
    isHearted: false
  },
  {
    id: 2,
    category: "정보 공유",
    tag: "프론트엔드",
    title: "2026년 프론트엔드 학습 로드맵 공유",
    content: "최신 트렌드를 반영한 프론트엔드 공부 순서입니다.",
    views: 450,
    likes: 120,
    comments: 15,
    author: "데브마스터",
    createdAt: "2026-02-19T02:15:20.123Z",
    isPinned: false,
    isHearted: true
  },
  {
    id: 3,
    category: "질문",
    tag: "백엔드 질문",
    title: "Spring Boot DB 연결 에러 해결 방법?",
    content: "datasource 설정 시 자꾸 에러가 나는데 원인을 모르겠어요.",
    views: 89,
    likes: 3,
    comments: 4,
    author: "코린이1호",
    createdAt: "2026-02-19T05:10:45.555Z",
    isPinned: false,
    isHearted: false
  },
  {
    id: 4,
    category: "대회",
    tag: "알고리즘",
    title: "백준 골드 달성 기념 문제 추천",
    content: "구현 위주의 문제들인데 같이 풀어봐요.",
    views: 890,
    likes: 210,
    comments: 45,
    author: "알고킹",
    createdAt: "2026-02-19T08:00:00.000Z",
    isPinned: false,
    isHearted: true
  },
  {
    id: 5,
    category: "로드맵",
    tag: "기타 전공",
    title: "비전공자를 위한 데이터 분석 입문 가이드",
    content: "비전공자도 충분히 할 수 있습니다. 이 로드맵을 따라오세요.",
    views: 320,
    likes: 55,
    comments: 12,
    author: "데이터왕",
    createdAt: "2026-02-19T10:45:12.999Z",
    isPinned: true,
    isHearted: false
  },
  {
    id: 6,
    category: "자유게시판",
    tag: "",
    title: "오늘 점심 메뉴 추천받아요",
    content: "결정장애가 왔습니다.. 맛있는 거 추천해주세요!",
    views: 120,
    likes: 5,
    comments: 22,
    author: "배고픈개발자",
    createdAt: "2026-02-19T11:30:12.888Z",
    isPinned: false,
    isHearted: false
  }
];

export const dummyComments: Comment[] = [
  {
    id: 1,
    postId: 3,
    author: "backend_dev",
    content: "혹시 DB 드라이버 의존성은 제대로 추가하셨나요? pom.xml이나 build.gradle 확인해보세요.",
    createdAt: "2026-02-19T06:05:12.111Z"
  },
  {
    id: 2,
    postId: 3,
    author: "error_hunter",
    content: "로컬에서 테스트 중이시면 DB 서버(MySQL 등)가 실제로 실행 중인지도 체크해보시길!",
    createdAt: "2026-02-19T06:15:45.222Z"
  },
  {
    id: 3,
    postId: 3,
    author: "코린이1호", // 원작자 추가 질문
    content: "@backend_dev 네! 의존성은 넣었는데 계속 'Access denied for user'라고 뜨네요 ㅠㅠ",
    createdAt: "2026-02-19T06:20:30.333Z"
  },
  {
    id: 4,
    postId: 3,
    author: "java_master",
    content: "Access denied면 DB 계정 아이디나 비밀번호가 틀린 겁니다. application.yml 다시 확인하세요.",
    createdAt: "2026-02-19T06:45:10.444Z"
  },
  {
    id: 5,
    postId: 3,
    author: "spring_runner",
    content: "환경 변수(ENV)로 주입하고 계신 거면 오타가 났을 확률이 99%입니다.",
    createdAt: "2026-02-19T07:10:05.555Z"
  },
  {
    id: 6,
    postId: 3,
    author: "db_admin_kim",
    content: "권한 문제일 수도 있으니 GRANT 문으로 유저 권한 한 번 더 확인해보는 것도 방법이에요.",
    createdAt: "2026-02-19T07:30:22.666Z"
  },
  {
    id: 7,
    postId: 3,
    author: "코린이1호", // 해결 후 감사 인사
    content: "헉, 비밀번호에 특수문자 따옴표 처리를 안 해서 그랬네요! 해결됐습니다 다들 감사합니다!!",
    createdAt: "2026-02-19T08:12:44.777Z"
  },
  {
    id: 8,
    postId: 3,
    author: "backend_dev",
    content: "오 해결되셨다니 다행입니다! 즐코하세요 ㅎㅎ",
    createdAt: "2026-02-19T08:20:15.888Z"
  },

  // --- 2번 게시글 (정보 공유) 댓글 ---
  {
    id: 9,
    postId: 2,
    author: "frontend_lover",
    content: "로드맵 깔끔하네요. 북마크 해놓고 두고두고 보겠습니다!",
    createdAt: "2026-02-19T09:00:00.000Z"
  },
  {
    id: 10,
    postId: 2,
    author: "junior_dev",
    content: "Next.js 15 버전 기준으로 봐도 무방할까요?",
    createdAt: "2026-02-19T10:15:30.999Z"
  }
];