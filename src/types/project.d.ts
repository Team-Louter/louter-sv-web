// ─── 공통 ───────────────────────────────────────────────────
export type ProjectRole = 'OWNER' | 'MANAGER' | 'MEMBER' | 'VIEWER';

export type Project = {
  id: number;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  createdAt: string;
  updatedAt: string;
  members: ProjectMember[];
};

export type ProjectMember = {
  userId: number;
  userName: string;
  profileImageUrl: string;
  role: ProjectRole;
};

// ─── 다이어그램 ──────────────────────────────────────────────
export type DiagramType = 'FLOWCHART' | 'ERD' | 'SEQUENCE' | 'MINDMAP';

export type Diagram = {
  id: number;
  projectId: number;
  title: string;
  description: string | null;
  type: DiagramType;
  data: string;
  thumbnailUrl: string | null;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
};

// ─── DB 스키마 ───────────────────────────────────────────────
export type ColumnType = 'INT' | 'BIGINT' | 'VARCHAR' | 'TEXT' | 'BOOLEAN' | 'DATE' | 'DATETIME' | 'TIMESTAMP' | 'FLOAT' | 'DOUBLE' | 'DECIMAL' | 'JSON' | 'UUID' | 'ENUM';
export type ColumnConstraint = 'PK' | 'FK' | 'NOT_NULL' | 'UNIQUE' | 'DEFAULT' | 'PRIMARY_KEY' | 'FOREIGN_KEY' | 'AUTO_INCREMENT';
export type RelationType = 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_MANY' | '1:1' | '1:N' | 'N:M';
export type SqlDialect = 'MYSQL' | 'POSTGRESQL' | 'SQLITE' | 'MSSQL';

export type SchemaColumn = {
  id: string;
  name: string;
  type: ColumnType;
  length: number | null;
  constraints: ColumnConstraint[];
  defaultValue: string | null;
  comment: string | null;
  referencesTable: string | null;
  referencesColumn: string | null;
};

export type SchemaTable = {
  id: string;
  name: string;
  comment: string | null;
  colorTag: string | null;
  columns: SchemaColumn[];
  position: { x: number; y: number };
};

export type SchemaRelation = {
  id: string;
  sourceTableId: string;
  sourceColumnId: string;
  targetTableId: string;
  targetColumnId: string;
  relationType: RelationType;
  /** Alias — 사용 편의 */
  fromTableId?: string;
  fromColumnId?: string;
  toTableId?: string;
  toColumnId?: string;
  type?: RelationType;
};

export type DbSchema = {
  id: number;
  projectId: number;
  title: string;
  description: string | null;
  tables: SchemaTable[];
  relations: SchemaRelation[];
  dialect: SqlDialect;
  createdAt: string;
  updatedAt: string;
};

// ─── 문서 ────────────────────────────────────────────────────
export type DocNode =
  | { type: 'folder'; id: number; name: string; children: DocNode[] }
  | { type: 'doc'; id: number; name: string; parentId: number | null };

export type ProjectDoc = {
  id: number;
  projectId: number;
  parentFolderId: number | null;
  title: string;
  content: string;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
};

export type DocVersion = {
  id: number;
  docId: number;
  content: string;
  savedBy: number;
  savedAt: string;
};

// ─── TASK ────────────────────────────────────────────────────
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type Task = {
  id: number;
  projectId: number;
  epicId: number | null;
  sprintId: number | null;
  parentTaskId: number | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignees: ProjectMember[];
  reporter: ProjectMember;
  labels: string[];
  startDate: string | null;
  dueDate: string | null;
  storyPoint: number | null;
  createdAt: string;
  updatedAt: string;
};

export type ServerTask = Omit<Task, 'id' | 'reporter' | 'assignees' | 'createdAt' | 'updatedAt'> & {
  assigneeIds: number[];
};

// ─── Epic / Sprint ───────────────────────────────────────────
export type Epic = {
  id: number;
  projectId: number;
  title: string;
  description: string | null;
  colorTag: string;
  startDate: string | null;
  endDate: string | null;
  tasks: Task[];
};

export type Sprint = {
  id: number;
  projectId: number;
  epicId: number | null;
  title: string;
  startDate: string;
  endDate: string;
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED';
  tasks: Task[];
};
