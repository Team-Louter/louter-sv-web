/**
 * Project API — 더미 데이터 Mock 구현
 *
 * 실제 API가 준비되면 이 파일을 Project.ts.bak 으로 복원하세요.
 * 모든 CRUD 작업은 in-memory 상태에서 동작하며
 * localStorage에 자동 영속화됩니다.
 */
import type {
  Project,
  ProjectMember,
  Diagram,
  DbSchema,
  DocNode,
  ProjectDoc,
  DocVersion,
  Task,
  ServerTask,
  TaskStatus,
  Epic,
  Sprint,
} from '@/types/project';

// ─── 헬퍼 ───────────────────────────────────────────────────

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));
let _idSeq = 1000;
const nextId = () => ++_idSeq;
const _now = () => new Date().toISOString();

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`mock_project_${key}`);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T) {
  localStorage.setItem(`mock_project_${key}`, JSON.stringify(data));
}

// ─── 기본 더미 멤버 ─────────────────────────────────────────

const dummyMembers: ProjectMember[] = [
  { userId: 1, userName: '김민수', profileImageUrl: '', role: 'OWNER' },
  { userId: 2, userName: '이지현', profileImageUrl: '', role: 'MANAGER' },
  { userId: 3, userName: '박준혁', profileImageUrl: '', role: 'MEMBER' },
  { userId: 4, userName: '최수아', profileImageUrl: '', role: 'MEMBER' },
];

// ─── 초기 더미 데이터 ────────────────────────────────────────

const initProjects: Project[] = [
  {
    id: 1,
    title: 'Louter 웹 플랫폼',
    description: '라우터 스터디 관리 웹 서비스 프로젝트',
    thumbnailUrl: null,
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
    members: dummyMembers,
  },
  {
    id: 2,
    title: '모바일 앱 리뉴얼',
    description: '기존 모바일 앱을 React Native로 전환하는 프로젝트',
    thumbnailUrl: null,
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-02-28T15:30:00Z',
    members: dummyMembers.slice(0, 3),
  },
  {
    id: 3,
    title: 'API 서버 v2',
    description: 'NestJS 기반 백엔드 API 서버 리팩토링',
    thumbnailUrl: null,
    createdAt: '2026-02-10T09:00:00Z',
    updatedAt: '2026-03-02T10:00:00Z',
    members: [dummyMembers[0], dummyMembers[2]],
  },
];

const initTasks: Task[] = [
  {
    id: 101, projectId: 1, epicId: 1, sprintId: 1, parentTaskId: null,
    title: '로그인 페이지 UI 구현', description: '구글 OAuth 로그인 화면 디자인 및 구현',
    status: 'DONE', priority: 'HIGH',
    assignees: [dummyMembers[0]], reporter: dummyMembers[1],
    labels: ['frontend'], startDate: '2026-02-01', dueDate: '2026-02-07',
    storyPoint: 5, createdAt: '2026-02-01T09:00:00Z', updatedAt: '2026-02-07T17:00:00Z',
  },
  {
    id: 102, projectId: 1, epicId: 1, sprintId: 1, parentTaskId: null,
    title: '회원가입 폼 유효성 검증', description: '이메일/비밀번호 등 입력값 검증 로직 구현',
    status: 'DONE', priority: 'MEDIUM',
    assignees: [dummyMembers[2]], reporter: dummyMembers[1],
    labels: ['frontend', 'validation'], startDate: '2026-02-03', dueDate: '2026-02-10',
    storyPoint: 3, createdAt: '2026-02-03T09:00:00Z', updatedAt: '2026-02-10T12:00:00Z',
  },
  {
    id: 103, projectId: 1, epicId: 2, sprintId: 1, parentTaskId: null,
    title: '프로젝트 목록 API 연동', description: 'GET /projects 엔드포인트 연동 및 UI 바인딩',
    status: 'IN_PROGRESS', priority: 'HIGH',
    assignees: [dummyMembers[0], dummyMembers[3]], reporter: dummyMembers[1],
    labels: ['api', 'frontend'], startDate: '2026-02-15', dueDate: '2026-02-25',
    storyPoint: 8, createdAt: '2026-02-15T09:00:00Z', updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 104, projectId: 1, epicId: 2, sprintId: 2, parentTaskId: null,
    title: 'Kanban 보드 드래그 앤 드롭', description: '칸반 보드에서 태스크 카드 DnD 구현',
    status: 'IN_PROGRESS', priority: 'CRITICAL',
    assignees: [dummyMembers[2]], reporter: dummyMembers[0],
    labels: ['frontend', 'ux'], startDate: '2026-02-20', dueDate: '2026-03-05',
    storyPoint: 13, createdAt: '2026-02-20T09:00:00Z', updatedAt: '2026-03-02T14:00:00Z',
  },
  {
    id: 105, projectId: 1, epicId: 2, sprintId: 2, parentTaskId: null,
    title: 'ERD 편집기 개발', description: '캔버스 기반 ERD 테이블/관계선 편집 기능',
    status: 'TODO', priority: 'HIGH',
    assignees: [dummyMembers[3]], reporter: dummyMembers[0],
    labels: ['frontend', 'canvas'], startDate: '2026-03-01', dueDate: '2026-03-15',
    storyPoint: 21, createdAt: '2026-03-01T09:00:00Z', updatedAt: '2026-03-01T09:00:00Z',
  },
  {
    id: 106, projectId: 1, epicId: null, sprintId: 2, parentTaskId: null,
    title: '문서 마크다운 에디터', description: '마크다운 실시간 미리보기 에디터 구현',
    status: 'TODO', priority: 'MEDIUM',
    assignees: [dummyMembers[1]], reporter: dummyMembers[0],
    labels: ['frontend', 'editor'], startDate: '2026-03-05', dueDate: '2026-03-20',
    storyPoint: 8, createdAt: '2026-03-01T09:00:00Z', updatedAt: '2026-03-01T09:00:00Z',
  },
  {
    id: 107, projectId: 1, epicId: 1, sprintId: 2, parentTaskId: null,
    title: 'JWT 토큰 갱신 로직', description: 'Access Token 만료 시 자동 갱신 interceptor',
    status: 'REVIEW', priority: 'HIGH',
    assignees: [dummyMembers[0]], reporter: dummyMembers[1],
    labels: ['backend', 'auth'], startDate: '2026-02-25', dueDate: '2026-03-07',
    storyPoint: 5, createdAt: '2026-02-25T09:00:00Z', updatedAt: '2026-03-03T11:00:00Z',
  },
  {
    id: 108, projectId: 1, epicId: 2, sprintId: null, parentTaskId: null,
    title: 'CI/CD 파이프라인 구축', description: 'GitHub Actions + Vercel 자동 배포',
    status: 'REVIEW', priority: 'MEDIUM',
    assignees: [dummyMembers[2], dummyMembers[3]], reporter: dummyMembers[0],
    labels: ['devops'], startDate: '2026-02-28', dueDate: '2026-03-10',
    storyPoint: 5, createdAt: '2026-02-28T09:00:00Z', updatedAt: '2026-03-04T09:00:00Z',
  },
  {
    id: 109, projectId: 2, epicId: null, sprintId: null, parentTaskId: null,
    title: 'RN 프로젝트 초기 세팅', description: 'React Native + Expo 프로젝트 스캐폴딩',
    status: 'DONE', priority: 'HIGH',
    assignees: [dummyMembers[0]], reporter: dummyMembers[0],
    labels: ['mobile', 'setup'], startDate: '2026-02-01', dueDate: '2026-02-05',
    storyPoint: 3, createdAt: '2026-02-01T09:00:00Z', updatedAt: '2026-02-05T18:00:00Z',
  },
];

const initEpics: Epic[] = [
  {
    id: 1, projectId: 1, title: '인증 시스템',
    description: '로그인/회원가입/토큰 관리 전반', colorTag: '#4B88CE',
    startDate: '2026-02-01', endDate: '2026-03-07', tasks: [],
  },
  {
    id: 2, projectId: 1, title: '프로젝트 관리 기능',
    description: 'Kanban, ERD, 문서, 다이어그램 등 프로젝트 관리 기능 개발', colorTag: '#5DBC86',
    startDate: '2026-02-15', endDate: '2026-03-30', tasks: [],
  },
];

const initSprints: Sprint[] = [
  {
    id: 1, projectId: 1, epicId: 1, title: 'Sprint 1 — 인증 기초',
    startDate: '2026-02-01', endDate: '2026-02-14', status: 'COMPLETED', tasks: [],
  },
  {
    id: 2, projectId: 1, epicId: 2, title: 'Sprint 2 — 프로젝트 관리 MVP',
    startDate: '2026-02-15', endDate: '2026-03-14', status: 'ACTIVE', tasks: [],
  },
];

const initDiagrams: Diagram[] = [
  {
    id: 1, projectId: 1, title: '로그인 플로우차트',
    description: 'Google OAuth 로그인 프로세스',
    type: 'FLOWCHART', data: JSON.stringify({ nodes: [], edges: [] }),
    thumbnailUrl: null, createdBy: 1,
    createdAt: '2026-02-05T10:00:00Z', updatedAt: '2026-02-20T14:00:00Z',
  },
  {
    id: 2, projectId: 1, title: 'DB ERD',
    description: '전체 DB 엔티티 관계도',
    type: 'ERD', data: JSON.stringify({ nodes: [], edges: [] }),
    thumbnailUrl: null, createdBy: 1,
    createdAt: '2026-02-10T09:00:00Z', updatedAt: '2026-03-01T11:00:00Z',
  },
  {
    id: 3, projectId: 1, title: 'API 시퀀스',
    description: '로그인 API 시퀀스 다이어그램',
    type: 'SEQUENCE',
    data: 'sequenceDiagram\n    participant Client\n    participant Server\n    participant Google\n    Client->>Server: POST /auth/google\n    Server->>Google: 토큰 검증\n    Google-->>Server: 사용자 정보\n    Server-->>Client: JWT 토큰',
    thumbnailUrl: null, createdBy: 2,
    createdAt: '2026-02-15T09:00:00Z', updatedAt: '2026-02-28T16:00:00Z',
  },
];

const initSchemas: DbSchema[] = [
  {
    id: 1, projectId: 1, title: '사용자 스키마',
    description: '사용자 인증 관련 테이블',
    tables: [
      {
        id: 't1', name: 'users', comment: '사용자 테이블', colorTag: '#4B88CE',
        position: { x: 50, y: 50 },
        columns: [
          { id: 'c1', name: 'id', type: 'INT', length: null, constraints: ['PK', 'NOT_NULL'], defaultValue: null, comment: '기본키', referencesTable: null, referencesColumn: null },
          { id: 'c2', name: 'email', type: 'VARCHAR', length: 255, constraints: ['UNIQUE', 'NOT_NULL'], defaultValue: null, comment: '이메일', referencesTable: null, referencesColumn: null },
          { id: 'c3', name: 'name', type: 'VARCHAR', length: 100, constraints: ['NOT_NULL'], defaultValue: null, comment: '이름', referencesTable: null, referencesColumn: null },
          { id: 'c4', name: 'created_at', type: 'DATETIME', length: null, constraints: ['NOT_NULL'], defaultValue: 'NOW()', comment: '생성일', referencesTable: null, referencesColumn: null },
        ],
      },
      {
        id: 't2', name: 'sessions', comment: '세션 테이블', colorTag: '#5DBC86',
        position: { x: 400, y: 50 },
        columns: [
          { id: 'c5', name: 'id', type: 'INT', length: null, constraints: ['PK', 'NOT_NULL'], defaultValue: null, comment: '기본키', referencesTable: null, referencesColumn: null },
          { id: 'c6', name: 'user_id', type: 'INT', length: null, constraints: ['FK', 'NOT_NULL'], defaultValue: null, comment: '사용자 FK', referencesTable: 'users', referencesColumn: 'id' },
          { id: 'c7', name: 'token', type: 'TEXT', length: null, constraints: ['NOT_NULL'], defaultValue: null, comment: '리프레시 토큰', referencesTable: null, referencesColumn: null },
          { id: 'c8', name: 'expires_at', type: 'DATETIME', length: null, constraints: ['NOT_NULL'], defaultValue: null, comment: '만료일', referencesTable: null, referencesColumn: null },
        ],
      },
    ],
    relations: [
      {
        id: 'r1', sourceTableId: 't1', sourceColumnId: 'c1',
        targetTableId: 't2', targetColumnId: 'c6', relationType: 'ONE_TO_MANY',
      },
    ],
    dialect: 'MYSQL',
    createdAt: '2026-02-10T09:00:00Z', updatedAt: '2026-03-01T11:00:00Z',
  },
];

const initDocTree: Record<number, DocNode[]> = {
  1: [
    {
      type: 'folder', id: 1, name: '기획 문서', children: [
        { type: 'doc', id: 1, name: '프로젝트 개요', parentId: 1 },
        { type: 'doc', id: 2, name: '기능 명세서', parentId: 1 },
      ],
    },
    {
      type: 'folder', id: 2, name: '기술 문서', children: [
        { type: 'doc', id: 3, name: 'API 가이드', parentId: 2 },
      ],
    },
    { type: 'doc', id: 4, name: '회의록 — 2026.03.01', parentId: null },
  ],
};

const initDocs: ProjectDoc[] = [
  {
    id: 1, projectId: 1, parentFolderId: 1, title: '프로젝트 개요',
    content: '# Louter 웹 플랫폼\n\n## 프로젝트 소개\n\n라우터는 스터디 관리를 위한 올인원 웹 서비스입니다.\n\n## 주요 기능\n\n- **프로젝트 관리**: Kanban 보드, 문서 관리, ERD/다이어그램\n- **커뮤니티**: 게시판, 댓글\n- **캘린더**: 일정 관리\n- **멘토링**: 1:1 멘토링 매칭\n\n## 기술 스택\n\n| 분야 | 기술 |\n|------|------|\n| Frontend | React, TypeScript, styled-components |\n| State | Zustand |\n| Build | Vite |\n| Deploy | Vercel |',
    createdBy: 1, updatedBy: 1,
    createdAt: '2026-02-01T09:00:00Z', updatedAt: '2026-02-20T14:00:00Z',
  },
  {
    id: 2, projectId: 1, parentFolderId: 1, title: '기능 명세서',
    content: '# 기능 명세서\n\n## 1. 인증\n\n- Google OAuth 2.0 로그인\n- JWT Access/Refresh Token\n- 자동 토큰 갱신 (Axios Interceptor)\n\n## 2. 프로젝트 관리\n\n### 2.1 TASK (Kanban)\n\n- TODO / IN_PROGRESS / REVIEW / DONE 4단 칼럼\n- 드래그 앤 드롭으로 상태 변경\n- 우선순위, 담당자, 라벨 지원\n\n### 2.2 ERD 편집기\n\n- 캔버스 기반 테이블 노드\n- 컬럼 추가/삭제, FK 관계선\n- DDL 내보내기 (MySQL, PostgreSQL, SQLite)',
    createdBy: 1, updatedBy: 2,
    createdAt: '2026-02-03T09:00:00Z', updatedAt: '2026-02-25T16:00:00Z',
  },
  {
    id: 3, projectId: 1, parentFolderId: 2, title: 'API 가이드',
    content: '# API 가이드\n\n## Base URL\n\n```\nhttps://api.louter.dev/v1\n```\n\n## 인증 헤더\n\n```\nAuthorization: Bearer <access_token>\n```\n\n## 엔드포인트\n\n### GET /projects\n\n프로젝트 목록을 반환합니다.\n\n**Response:**\n```json\n[\n  {\n    "id": 1,\n    "title": "Louter 웹 플랫폼",\n    "description": "..."\n  }\n]\n```',
    createdBy: 2, updatedBy: 2,
    createdAt: '2026-02-10T09:00:00Z', updatedAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 4, projectId: 1, parentFolderId: null, title: '회의록 — 2026.03.01',
    content: '# 회의록 — 2026.03.01\n\n## 참석자\n\n김민수, 이지현, 박준혁, 최수아\n\n## 안건\n\n1. Sprint 2 중간 점검\n2. Kanban 보드 UX 피드백\n3. ERD 편집기 설계 논의\n\n## 결정사항\n\n- Kanban 보드 DnD는 native HTML5 API 사용\n- ERD 편집기는 SVG 기반으로 개발\n- Sprint 2 마감일부터 Sprint 3 계획 수립',
    createdBy: 1, updatedBy: 1,
    createdAt: '2026-03-01T14:00:00Z', updatedAt: '2026-03-01T15:30:00Z',
  },
];

const initDocVersions: DocVersion[] = [
  { id: 1, docId: 1, content: '# Louter 웹 플랫폼\n\n(초기 초안)', savedBy: 1, savedAt: '2026-02-01T09:00:00Z' },
  { id: 2, docId: 1, content: '# Louter 웹 플랫폼\n\n## 프로젝트 소개\n\n라우터는 스터디 관리 플랫폼입니다.', savedBy: 1, savedAt: '2026-02-10T11:00:00Z' },
  { id: 3, docId: 2, content: '# 기능 명세서\n\n(초기 버전)', savedBy: 1, savedAt: '2026-02-03T09:00:00Z' },
];

// ─── In-memory Store ─────────────────────────────────────────

let projects = load('projects', initProjects);
let tasks = load('tasks', initTasks);
let epics = load('epics', initEpics);
let sprints = load('sprints', initSprints);
let diagrams_ = load('diagrams', initDiagrams);
let schemas_ = load('schemas', initSchemas);
let docTrees = load<Record<number, DocNode[]>>('docTrees', initDocTree);
let docs = load('docs', initDocs);
let docVersions = load('docVersions', initDocVersions);

const persist = () => {
  save('projects', projects);
  save('tasks', tasks);
  save('epics', epics);
  save('sprints', sprints);
  save('diagrams', diagrams_);
  save('schemas', schemas_);
  save('docTrees', docTrees);
  save('docs', docs);
  save('docVersions', docVersions);
};

// ─── 프로젝트 ────────────────────────────────────────────────

export const getProjects = async (): Promise<Project[]> => {
  await delay();
  return [...projects];
};

export const createProject = async (
  data: Pick<Project, 'title' | 'description'>
): Promise<Project> => {
  await delay();
  const p: Project = {
    id: nextId(), title: data.title, description: data.description,
    thumbnailUrl: null, createdAt: _now(), updatedAt: _now(),
    members: [dummyMembers[0]],
  };
  projects = [...projects, p];
  persist();
  return p;
};

export const getProject = async (projectId: number): Promise<Project> => {
  await delay();
  const p = projects.find((x) => x.id === projectId);
  if (!p) throw new Error('프로젝트를 찾을 수 없습니다.');
  return { ...p };
};

export const updateProject = async (
  projectId: number,
  data: Pick<Project, 'title' | 'description'>
): Promise<void> => {
  await delay();
  projects = projects.map((p) =>
    p.id === projectId ? { ...p, ...data, updatedAt: _now() } : p
  );
  persist();
};

export const deleteProject = async (projectId: number): Promise<void> => {
  await delay();
  projects = projects.filter((p) => p.id !== projectId);
  tasks = tasks.filter((t) => t.projectId !== projectId);
  epics = epics.filter((e) => e.projectId !== projectId);
  sprints = sprints.filter((s) => s.projectId !== projectId);
  diagrams_ = diagrams_.filter((d) => d.projectId !== projectId);
  schemas_ = schemas_.filter((s) => s.projectId !== projectId);
  docs = docs.filter((d) => d.projectId !== projectId);
  delete docTrees[projectId];
  persist();
};

export const inviteMember = async (
  projectId: number,
  userId: number,
  role: string
): Promise<void> => {
  await delay();
  projects = projects.map((p) => {
    if (p.id !== projectId) return p;
    if (p.members.find((m) => m.userId === userId)) return p;
    return {
      ...p,
      members: [
        ...p.members,
        { userId, userName: `사용자${userId}`, profileImageUrl: '', role: role as ProjectMember['role'] },
      ],
      updatedAt: _now(),
    };
  });
  persist();
};

export const removeMember = async (
  projectId: number,
  userId: number
): Promise<void> => {
  await delay();
  projects = projects.map((p) =>
    p.id === projectId
      ? { ...p, members: p.members.filter((m) => m.userId !== userId), updatedAt: _now() }
      : p
  );
  persist();
};

// ─── 다이어그램 ──────────────────────────────────────────────

export const getDiagrams = async (projectId: number): Promise<Diagram[]> => {
  await delay();
  return diagrams_.filter((d) => d.projectId === projectId);
};

export const createDiagram = async (
  projectId: number,
  data: Pick<Diagram, 'title' | 'type' | 'data'> & { description?: string | null }
): Promise<Diagram> => {
  await delay();
  const d: Diagram = {
    id: nextId(), projectId, title: data.title,
    description: data.description ?? null, type: data.type, data: data.data,
    thumbnailUrl: null, createdBy: 1, createdAt: _now(), updatedAt: _now(),
  };
  diagrams_ = [...diagrams_, d];
  persist();
  return d;
};

export const getDiagram = async (
  projectId: number,
  diagramId: number
): Promise<Diagram> => {
  await delay();
  const d = diagrams_.find((x) => x.projectId === projectId && x.id === diagramId);
  if (!d) throw new Error('다이어그램을 찾을 수 없습니다.');
  return { ...d };
};

export const updateDiagram = async (
  projectId: number,
  diagramId: number,
  data: Partial<Pick<Diagram, 'title' | 'data'>>
): Promise<void> => {
  await delay();
  diagrams_ = diagrams_.map((d) =>
    d.projectId === projectId && d.id === diagramId
      ? { ...d, ...data, updatedAt: _now() }
      : d
  );
  persist();
};

export const deleteDiagram = async (
  projectId: number,
  diagramId: number
): Promise<void> => {
  await delay();
  diagrams_ = diagrams_.filter((d) => !(d.projectId === projectId && d.id === diagramId));
  persist();
};

// ─── DB 스키마 ───────────────────────────────────────────────

export const getSchemas = async (projectId: number): Promise<DbSchema[]> => {
  await delay();
  return schemas_.filter((s) => s.projectId === projectId);
};

export const createSchema = async (
  projectId: number,
  data: Pick<DbSchema, 'title' | 'tables' | 'relations' | 'dialect'> & { description?: string | null }
): Promise<DbSchema> => {
  await delay();
  const s: DbSchema = {
    id: nextId(), projectId, title: data.title,
    description: data.description ?? null,
    tables: data.tables ?? [], relations: data.relations ?? [],
    dialect: data.dialect, createdAt: _now(), updatedAt: _now(),
  };
  schemas_ = [...schemas_, s];
  persist();
  return s;
};

export const getSchema = async (
  projectId: number,
  schemaId: number
): Promise<DbSchema> => {
  await delay();
  const s = schemas_.find((x) => x.projectId === projectId && x.id === schemaId);
  if (!s) throw new Error('스키마를 찾을 수 없습니다.');
  return JSON.parse(JSON.stringify(s)) as DbSchema;
};

export const updateSchema = async (
  projectId: number,
  schemaId: number,
  data: Partial<Pick<DbSchema, 'title' | 'tables' | 'relations' | 'dialect'>>
): Promise<void> => {
  await delay();
  schemas_ = schemas_.map((s) =>
    s.projectId === projectId && s.id === schemaId
      ? { ...s, ...data, updatedAt: _now() }
      : s
  );
  persist();
};

export const deleteSchema = async (
  projectId: number,
  schemaId: number
): Promise<void> => {
  await delay();
  schemas_ = schemas_.filter((s) => !(s.projectId === projectId && s.id === schemaId));
  persist();
};

export const getSchemaDdl = async (
  projectId: number,
  schemaId: number
): Promise<string> => {
  await delay();
  const schema = schemas_.find((s) => s.projectId === projectId && s.id === schemaId);
  if (!schema) return '-- 스키마를 찾을 수 없습니다.';
  const lines: string[] = [];
  for (const table of schema.tables) {
    lines.push(`CREATE TABLE ${table.name} (`);
    const cols = table.columns.map((col) => {
      let def = `  ${col.name} ${col.type}`;
      if (col.length) def += `(${col.length})`;
      if (col.constraints.includes('NOT_NULL')) def += ' NOT NULL';
      if (col.constraints.includes('PK') || col.constraints.includes('PRIMARY_KEY')) def += ' PRIMARY KEY';
      if (col.constraints.includes('UNIQUE')) def += ' UNIQUE';
      if (col.constraints.includes('AUTO_INCREMENT')) def += ' AUTO_INCREMENT';
      if (col.defaultValue) def += ` DEFAULT ${col.defaultValue}`;
      return def;
    });
    lines.push(cols.join(',\n'));
    lines.push(');\n');
  }
  return lines.join('\n');
};

export const exportDDL = async (
  projectId: number,
  schemaId: number,
  _dialect?: string
): Promise<string> => getSchemaDdl(projectId, schemaId);

// ─── 문서 ────────────────────────────────────────────────────

export const getDocTree = async (projectId: number): Promise<DocNode[]> => {
  await delay();
  return docTrees[projectId] ?? [];
};

export const createDoc = async (
  projectId: number,
  data: { title: string; content: string; parentFolderId: number | null }
): Promise<ProjectDoc> => {
  await delay();
  const doc: ProjectDoc = {
    id: nextId(), projectId, parentFolderId: data.parentFolderId,
    title: data.title, content: data.content,
    createdBy: 1, updatedBy: 1, createdAt: _now(), updatedAt: _now(),
  };
  docs = [...docs, doc];
  const tree = docTrees[projectId] ?? [];
  const newDocNode: DocNode = { type: 'doc', id: doc.id, name: doc.title, parentId: data.parentFolderId };
  if (data.parentFolderId) {
    const addToFolder = (nodes: DocNode[]): DocNode[] =>
      nodes.map((n) => {
        if (n.type === 'folder' && n.id === data.parentFolderId) return { ...n, children: [...n.children, newDocNode] };
        if (n.type === 'folder') return { ...n, children: addToFolder(n.children) };
        return n;
      });
    docTrees[projectId] = addToFolder(tree);
  } else {
    docTrees[projectId] = [...tree, newDocNode];
  }
  persist();
  return doc;
};

export const getDoc = async (
  projectId: number,
  docId: number
): Promise<ProjectDoc> => {
  await delay();
  const doc = docs.find((d) => d.projectId === projectId && d.id === docId)
    ?? docs.find((d) => d.id === docId);
  if (!doc) throw new Error('문서를 찾을 수 없습니다.');
  return { ...doc };
};

export const updateDoc = async (
  projectId: number,
  docId: number,
  data: { title: string; content: string }
): Promise<void> => {
  await delay();
  const existing = docs.find((d) => d.id === docId);
  if (existing) {
    docVersions = [...docVersions, { id: nextId(), docId, content: existing.content, savedBy: 1, savedAt: _now() }];
  }
  docs = docs.map((d) => d.id === docId ? { ...d, ...data, updatedBy: 1, updatedAt: _now() } : d);
  const updateTree = (nodes: DocNode[]): DocNode[] =>
    nodes.map((n) => {
      if (n.type === 'doc' && n.id === docId) return { ...n, name: data.title };
      if (n.type === 'folder') return { ...n, children: updateTree(n.children) };
      return n;
    });
  if (docTrees[projectId]) docTrees[projectId] = updateTree(docTrees[projectId]);
  persist();
};

export const deleteDoc = async (
  projectId: number,
  docId: number
): Promise<void> => {
  await delay();
  docs = docs.filter((d) => d.id !== docId);
  const removeFromTree = (nodes: DocNode[]): DocNode[] =>
    nodes
      .filter((n) => !(n.type === 'doc' && n.id === docId))
      .map((n) => (n.type === 'folder' ? { ...n, children: removeFromTree(n.children) } : n));
  if (docTrees[projectId]) docTrees[projectId] = removeFromTree(docTrees[projectId]);
  persist();
};

export const getDocVersions = async (
  _projectId: number,
  docId: number
): Promise<DocVersion[]> => {
  await delay();
  return docVersions.filter((v) => v.docId === docId);
};

export const restoreDocVersion = async (
  _projectId: number,
  docId: number,
  versionId: number
): Promise<void> => {
  await delay();
  const ver = docVersions.find((v) => v.id === versionId && v.docId === docId);
  if (!ver) throw new Error('버전을 찾을 수 없습니다.');
  docs = docs.map((d) => d.id === docId ? { ...d, content: ver.content, updatedBy: 1, updatedAt: _now() } : d);
  persist();
};

export const createFolder = async (
  projectId: number,
  data: { name: string; parentId: number | null }
): Promise<void> => {
  await delay();
  const folder: DocNode = { type: 'folder', id: nextId(), name: data.name, children: [] };
  const tree = docTrees[projectId] ?? [];
  if (data.parentId) {
    const addToParent = (nodes: DocNode[]): DocNode[] =>
      nodes.map((n) => {
        if (n.type === 'folder' && n.id === data.parentId) return { ...n, children: [...n.children, folder] };
        if (n.type === 'folder') return { ...n, children: addToParent(n.children) };
        return n;
      });
    docTrees[projectId] = addToParent(tree);
  } else {
    docTrees[projectId] = [...tree, folder];
  }
  persist();
};

export const updateFolder = async (
  projectId: number,
  folderId: number,
  data: { name: string }
): Promise<void> => {
  await delay();
  const updateTree = (nodes: DocNode[]): DocNode[] =>
    nodes.map((n) => {
      if (n.type === 'folder' && n.id === folderId) return { ...n, name: data.name };
      if (n.type === 'folder') return { ...n, children: updateTree(n.children) };
      return n;
    });
  if (docTrees[projectId]) docTrees[projectId] = updateTree(docTrees[projectId]);
  persist();
};

export const deleteFolder = async (
  projectId: number,
  folderId: number
): Promise<void> => {
  await delay();
  const collectDocIds = (nodes: DocNode[]): number[] => {
    const ids: number[] = [];
    for (const n of nodes) {
      if (n.type === 'doc') ids.push(n.id);
      if (n.type === 'folder') ids.push(...collectDocIds(n.children));
    }
    return ids;
  };
  const tree = docTrees[projectId] ?? [];
  const findFolder = (nodes: DocNode[]): DocNode | null => {
    for (const n of nodes) {
      if (n.type === 'folder' && n.id === folderId) return n;
      if (n.type === 'folder') { const found = findFolder(n.children); if (found) return found; }
    }
    return null;
  };
  const f = findFolder(tree);
  if (f && f.type === 'folder') {
    const docIds = collectDocIds(f.children);
    docs = docs.filter((d) => !docIds.includes(d.id));
  }
  const removeFolder = (nodes: DocNode[]): DocNode[] =>
    nodes
      .filter((n) => !(n.type === 'folder' && n.id === folderId))
      .map((n) => (n.type === 'folder' ? { ...n, children: removeFolder(n.children) } : n));
  docTrees[projectId] = removeFolder(tree);
  persist();
};

// ─── TASK ────────────────────────────────────────────────────

export const getTasks = async (
  projectId: number,
  params?: {
    assigneeId?: number;
    status?: TaskStatus;
    priority?: string;
    epicId?: number;
    sprintId?: number;
  }
): Promise<Task[]> => {
  await delay();
  let result = tasks.filter((t) => t.projectId === projectId);
  if (params?.assigneeId) result = result.filter((t) => t.assignees.some((a) => a.userId === params.assigneeId));
  if (params?.status) result = result.filter((t) => t.status === params.status);
  if (params?.priority) result = result.filter((t) => t.priority === params.priority);
  if (params?.epicId) result = result.filter((t) => t.epicId === params.epicId);
  if (params?.sprintId) result = result.filter((t) => t.sprintId === params.sprintId);
  return result;
};

export const createTask = async (
  projectId: number,
  data: ServerTask
): Promise<Task> => {
  await delay();
  const project = projects.find((p) => p.id === projectId);
  const assignees = (data.assigneeIds ?? [])
    .map((id) => project?.members.find((m) => m.userId === id))
    .filter(Boolean) as ProjectMember[];
  const t: Task = {
    id: nextId(), projectId, epicId: data.epicId, sprintId: data.sprintId,
    parentTaskId: data.parentTaskId, title: data.title, description: data.description,
    status: data.status, priority: data.priority, assignees,
    reporter: dummyMembers[0], labels: data.labels,
    startDate: data.startDate, dueDate: data.dueDate, storyPoint: data.storyPoint,
    createdAt: _now(), updatedAt: _now(),
  };
  tasks = [...tasks, t];
  persist();
  return t;
};

export const getTask = async (
  projectId: number,
  taskId: number
): Promise<Task> => {
  await delay();
  const t = tasks.find((x) => x.projectId === projectId && x.id === taskId);
  if (!t) throw new Error('태스크를 찾을 수 없습니다.');
  return { ...t };
};

export const updateTask = async (
  projectId: number,
  taskId: number,
  data: Partial<ServerTask>
): Promise<void> => {
  await delay();
  const project = projects.find((p) => p.id === projectId);
  tasks = tasks.map((t) => {
    if (t.projectId !== projectId || t.id !== taskId) return t;
    const updated = { ...t, ...data, updatedAt: _now() };
    if (data.assigneeIds) {
      updated.assignees = data.assigneeIds
        .map((id) => project?.members.find((m) => m.userId === id))
        .filter(Boolean) as ProjectMember[];
    }
    return updated as Task;
  });
  persist();
};

export const updateTaskStatus = async (
  projectId: number,
  taskId: number,
  status: TaskStatus
): Promise<void> => {
  await delay();
  tasks = tasks.map((t) =>
    t.projectId === projectId && t.id === taskId ? { ...t, status, updatedAt: _now() } : t
  );
  persist();
};

export const deleteTask = async (
  projectId: number,
  taskId: number
): Promise<void> => {
  await delay();
  tasks = tasks.filter((t) => !(t.projectId === projectId && t.id === taskId));
  persist();
};

// ─── Epic / Sprint ───────────────────────────────────────────

export const getEpics = async (projectId: number): Promise<Epic[]> => {
  await delay();
  const projectTasks = tasks.filter((t) => t.projectId === projectId);
  return epics
    .filter((e) => e.projectId === projectId)
    .map((e) => ({ ...e, tasks: projectTasks.filter((t) => t.epicId === e.id) }));
};

export const createEpic = async (
  projectId: number,
  data: Pick<Epic, 'title' | 'description' | 'colorTag' | 'startDate' | 'endDate'>
): Promise<Epic> => {
  await delay();
  const e: Epic = {
    id: nextId(), projectId, title: data.title, description: data.description,
    colorTag: data.colorTag, startDate: data.startDate, endDate: data.endDate, tasks: [],
  };
  epics = [...epics, e];
  persist();
  return e;
};

export const updateEpic = async (
  projectId: number,
  epicId: number,
  data: Partial<Pick<Epic, 'title' | 'description' | 'colorTag' | 'startDate' | 'endDate'>>
): Promise<void> => {
  await delay();
  epics = epics.map((e) => e.projectId === projectId && e.id === epicId ? { ...e, ...data } : e);
  persist();
};

export const deleteEpic = async (
  projectId: number,
  epicId: number
): Promise<void> => {
  await delay();
  epics = epics.filter((e) => !(e.projectId === projectId && e.id === epicId));
  tasks = tasks.map((t) => t.projectId === projectId && t.epicId === epicId ? { ...t, epicId: null } : t);
  persist();
};

export const getSprints = async (projectId: number): Promise<Sprint[]> => {
  await delay();
  const projectTasks = tasks.filter((t) => t.projectId === projectId);
  return sprints
    .filter((s) => s.projectId === projectId)
    .map((s) => ({ ...s, tasks: projectTasks.filter((t) => t.sprintId === s.id) }));
};

export const createSprint = async (
  projectId: number,
  data: Pick<Sprint, 'title' | 'startDate' | 'endDate' | 'epicId'>
): Promise<Sprint> => {
  await delay();
  const s: Sprint = {
    id: nextId(), projectId, epicId: data.epicId, title: data.title,
    startDate: data.startDate, endDate: data.endDate, status: 'PLANNING', tasks: [],
  };
  sprints = [...sprints, s];
  persist();
  return s;
};

export const completeSprint = async (
  projectId: number,
  sprintId: number
): Promise<void> => {
  await delay();
  sprints = sprints.map((s) =>
    s.projectId === projectId && s.id === sprintId ? { ...s, status: 'COMPLETED' } : s
  );
  persist();
};
