/* ═══════════════════════════════════════════════════════════
   Schema Editor — Types, Constants & Utilities
   ═══════════════════════════════════════════════════════════ */

import type {
  ColumnType,
  ColumnConstraint,
  RelationType,
  SchemaColumn,
  SchemaTable,
  SchemaRelation,
  SqlDialect,
} from '@/types/project';

/* ─── re-export ──────────────────────────────────────────── */
export type {
  ColumnType,
  ColumnConstraint,
  RelationType,
  SchemaColumn,
  SchemaTable,
  SchemaRelation,
  SqlDialect,
};

/* ─── 에디터 전용 확장 타입 ──────────────────────────────── */
export type EditorTable = SchemaTable & {
  x: number;
  y: number;
  width: number;
  collapsed: boolean;
};

export type EditorRelation = SchemaRelation & {
  label?: string;
  lineStyle?: 'solid' | 'dashed' | 'dotted';
};

export type EditorData = {
  tables: EditorTable[];
  relations: EditorRelation[];
};

export type ToolMode = 'select' | 'pan' | 'connect' | 'addTable';

export type IndexDef = {
  id: string;
  name: string;
  columns: string[];
  unique: boolean;
};

/* ─── 상수 ─────────────────────────────────────────────── */
export const COLUMN_TYPES: ColumnType[] = [
  'INT', 'BIGINT', 'VARCHAR', 'TEXT', 'BOOLEAN',
  'DATE', 'DATETIME', 'TIMESTAMP',
  'FLOAT', 'DOUBLE', 'DECIMAL',
  'JSON', 'UUID', 'ENUM',
];

export const CONSTRAINTS: { value: ColumnConstraint; label: string; short: string }[] = [
  { value: 'PRIMARY_KEY', label: 'Primary Key', short: 'PK' },
  { value: 'FOREIGN_KEY', label: 'Foreign Key', short: 'FK' },
  { value: 'NOT_NULL', label: 'Not Null', short: 'NN' },
  { value: 'UNIQUE', label: 'Unique', short: 'UQ' },
  { value: 'AUTO_INCREMENT', label: 'Auto Increment', short: 'AI' },
  { value: 'DEFAULT', label: 'Default', short: 'DF' },
];

export const RELATION_TYPES: { value: RelationType; label: string; notation: string }[] = [
  { value: '1:1', label: '1 : 1', notation: '──||──||──' },
  { value: '1:N', label: '1 : N', notation: '──||──<──' },
  { value: 'N:M', label: 'N : M', notation: '──>──<──' },
  { value: 'ONE_TO_ONE', label: 'One-to-One', notation: '1───1' },
  { value: 'ONE_TO_MANY', label: 'One-to-Many', notation: '1───*' },
  { value: 'MANY_TO_MANY', label: 'Many-to-Many', notation: '*───*' },
];

export const DIALECT_OPTIONS: { value: SqlDialect; label: string; color: string }[] = [
  { value: 'MYSQL', label: 'MySQL', color: '#1967D2' },
  { value: 'POSTGRESQL', label: 'PostgreSQL', color: '#137333' },
  { value: 'MSSQL', label: 'MSSQL', color: '#B06D00' },
  { value: 'SQLITE', label: 'SQLite', color: '#6B4FBB' },
];

export const TABLE_COLORS: string[] = [
  '#4B88CE', '#37996B', '#C75450', '#E2A032',
  '#7E57C2', '#26A69A', '#FF7043', '#78909C',
  '#5C6BC0', '#66BB6A', '#EF5350', '#FFA726',
  '#AB47BC', '#29B6F6', '#EC407A', '#8D6E63',
];

export const TABLE_HEADER_H = 36;
export const COL_ROW_H = 26;
export const DEFAULT_TABLE_W = 240;
export const GRID_SIZE = 20;
export const MIN_TABLE_W = 180;
export const MAX_TABLE_W = 400;

/* ─── 유틸 함수 ──────────────────────────────────────────── */
let _id = Date.now();
export const uid = () => `${++_id}`;

export function makeTable(x: number, y: number, index: number): EditorTable {
  return {
    id: `tbl-${uid()}`,
    name: `table_${index}`,
    comment: null,
    colorTag: TABLE_COLORS[index % TABLE_COLORS.length],
    columns: [
      {
        id: `col-${uid()}`,
        name: 'id',
        type: 'BIGINT',
        length: null,
        constraints: ['PRIMARY_KEY', 'AUTO_INCREMENT'],
        defaultValue: null,
        comment: null,
        referencesTable: null,
        referencesColumn: null,
      },
    ],
    position: { x, y },
    x,
    y,
    width: DEFAULT_TABLE_W,
    collapsed: false,
  };
}

export function makeColumn(index: number): SchemaColumn {
  return {
    id: `col-${uid()}`,
    name: `column_${index}`,
    type: 'VARCHAR',
    length: null,
    constraints: [],
    defaultValue: null,
    comment: null,
    referencesTable: null,
    referencesColumn: null,
  };
}

export function makeRelation(
  fromTableId: string,
  fromColumnId: string,
  toTableId: string,
  toColumnId: string,
  type: RelationType = '1:N',
): EditorRelation {
  return {
    id: `rel-${uid()}`,
    sourceTableId: fromTableId,
    sourceColumnId: fromColumnId,
    targetTableId: toTableId,
    targetColumnId: toColumnId,
    relationType: type,
  };
}

export function snap(v: number, grid: number): number {
  return Math.round(v / grid) * grid;
}

export function tableHeight(t: EditorTable): number {
  if (t.collapsed) return TABLE_HEADER_H;
  return TABLE_HEADER_H + t.columns.length * COL_ROW_H + 4;
}

/**
 * 릴레이션 선 좌표 계산 — 테이블 사이의 최적 경로
 */
export function relLineCoords(
  rel: EditorRelation,
  tables: EditorTable[],
): { x1: number; y1: number; x2: number; y2: number; side1: 'left' | 'right'; side2: 'left' | 'right' } | null {
  const fromT = tables.find((t) => t.id === rel.sourceTableId);
  const toT = tables.find((t) => t.id === rel.targetTableId);
  if (!fromT || !toT) return null;

  const fromColIdx = fromT.columns.findIndex((c) => c.id === rel.sourceColumnId);
  const toColIdx = toT.columns.findIndex((c) => c.id === rel.targetColumnId);

  const fromCenterX = fromT.x + fromT.width / 2;
  const toCenterX = toT.x + toT.width / 2;

  // 가장 가까운 변에서 나가도록 결정
  let side1: 'left' | 'right' = 'right';
  let side2: 'left' | 'right' = 'left';

  if (fromCenterX > toCenterX) {
    side1 = 'left';
    side2 = 'right';
  }

  const x1 = side1 === 'right' ? fromT.x + fromT.width : fromT.x;
  const y1 = fromT.collapsed
    ? fromT.y + TABLE_HEADER_H / 2
    : fromT.y + TABLE_HEADER_H + Math.max(0, fromColIdx) * COL_ROW_H + COL_ROW_H / 2;

  const x2 = side2 === 'right' ? toT.x + toT.width : toT.x;
  const y2 = toT.collapsed
    ? toT.y + TABLE_HEADER_H / 2
    : toT.y + TABLE_HEADER_H + Math.max(0, toColIdx) * COL_ROW_H + COL_ROW_H / 2;

  return { x1, y1, x2, y2, side1, side2 };
}

/**
 * 베지어 경로 생성
 */
export function relPath(coords: { x1: number; y1: number; x2: number; y2: number }): string {
  const dx = Math.abs(coords.x2 - coords.x1) * 0.5;
  const cx1 = coords.x1 + (coords.x2 > coords.x1 ? dx : -dx);
  const cx2 = coords.x2 + (coords.x2 > coords.x1 ? -dx : dx);
  return `M${coords.x1},${coords.y1} C${cx1},${coords.y1} ${cx2},${coords.y2} ${coords.x2},${coords.y2}`;
}

/**
 * DDL 생성
 */
export function generateDDL(
  tables: EditorTable[],
  relations: EditorRelation[],
  dialect: SqlDialect,
): string {
  const q = dialect === 'MYSQL' ? '`' : dialect === 'MSSQL' ? '[' : '"';
  const qc = dialect === 'MSSQL' ? ']' : q;

  const lines: string[] = [];

  for (const t of tables) {
    const cols: string[] = [];
    const pks: string[] = [];
    const uniques: string[] = [];

    for (const c of t.columns) {
      let typeDef = c.type;
      if (c.length && ['VARCHAR', 'DECIMAL'].includes(c.type)) {
        typeDef = `${c.type}(${c.length})` as ColumnType;
      }

      let line = `  ${q}${c.name}${qc} ${typeDef}`;

      if (c.constraints.includes('NOT_NULL')) line += ' NOT NULL';
      if (c.constraints.includes('AUTO_INCREMENT')) {
        if (dialect === 'POSTGRESQL') line += ' GENERATED ALWAYS AS IDENTITY';
        else if (dialect === 'MSSQL') line += ' IDENTITY(1,1)';
        else line += ' AUTO_INCREMENT';
      }
      if (c.constraints.includes('UNIQUE')) uniques.push(c.name);
      if (c.constraints.includes('PRIMARY_KEY')) pks.push(c.name);
      if (c.defaultValue) line += ` DEFAULT ${c.defaultValue}`;
      if (c.comment && dialect !== 'MSSQL') line += ` COMMENT '${c.comment}'`;

      cols.push(line);
    }

    if (pks.length > 0) {
      cols.push(`  PRIMARY KEY (${pks.map((n) => `${q}${n}${qc}`).join(', ')})`);
    }
    for (const u of uniques) {
      cols.push(`  UNIQUE (${q}${u}${qc})`);
    }

    // FK 제약
    const tableFKs = relations.filter((r) => r.sourceTableId === t.id);
    for (const fk of tableFKs) {
      const fromCol = t.columns.find((c) => c.id === fk.sourceColumnId);
      const toTable = tables.find((tt) => tt.id === fk.targetTableId);
      const toCol = toTable?.columns.find((c) => c.id === fk.targetColumnId);
      if (fromCol && toTable && toCol) {
        cols.push(
          `  FOREIGN KEY (${q}${fromCol.name}${qc}) REFERENCES ${q}${toTable.name}${qc}(${q}${toCol.name}${qc})`
        );
      }
    }

    let create = `CREATE TABLE ${q}${t.name}${qc} (\n${cols.join(',\n')}\n)`;
    if (dialect === 'MYSQL') create += ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4';
    create += ';';

    if (t.comment && dialect === 'MYSQL') {
      create += `\n\nALTER TABLE ${q}${t.name}${qc} COMMENT = '${t.comment}';`;
    }
    if (t.comment && dialect === 'POSTGRESQL') {
      create += `\n\nCOMMENT ON TABLE ${q}${t.name}${qc} IS '${t.comment}';`;
    }

    lines.push(create);
  }

  return lines.join('\n\n');
}

/**
 * Crow's foot 마커 SVG path
 */
export function crowsFootMarker(type: RelationType, end: 'source' | 'target'): string {
  // source: 릴레이션 시작부분, target: 끝부분
  if (type === '1:1' || type === 'ONE_TO_ONE') return 'one';
  if (type === '1:N' || type === 'ONE_TO_MANY') return end === 'source' ? 'one' : 'many';
  if (type === 'N:M' || type === 'MANY_TO_MANY') return 'many';
  return 'one';
}
