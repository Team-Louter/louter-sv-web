import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as S from './ProjectSchema.styled';
import { getSchema, updateSchema, exportDDL } from '@/api/Project';
import { toast } from '@/store/toastStore';
import type {
  DbSchema,
  SchemaTable,
  SchemaColumn,
  SchemaRelation,
  ColumnType,
  ColumnConstraint,
  RelationType,
} from '@/types/project';

/* ─── 상수 ─────────────────────────────── */
const COLUMN_TYPES: ColumnType[] = [
  'INT',
  'BIGINT',
  'VARCHAR',
  'TEXT',
  'BOOLEAN',
  'DATE',
  'DATETIME',
  'TIMESTAMP',
  'FLOAT',
  'DOUBLE',
  'DECIMAL',
  'JSON',
  'UUID',
  'ENUM',
];

const TABLE_HEADER_H = 36;
const COL_ROW_H = 22;
const TABLE_W = 220;

/* ─── 컴포넌트 ──────────────────────────── */
function ProjectSchemaDetail() {
  const { projectId, schemaId } = useParams<{
    projectId: string;
    schemaId: string;
  }>();
  const pid = Number(projectId);
  const sid = Number(schemaId);
  const navigate = useNavigate();

  const [schema, setSchema] = useState<DbSchema | null>(null);
  const [tables, setTables] = useState<(SchemaTable & { x: number; y: number })[]>([]);
  const [relations, setRelations] = useState<SchemaRelation[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [dragging, setDragging] = useState<{ id: string; ox: number; oy: number } | null>(null);
  const [connecting, setConnecting] = useState<{
    fromTable: string;
    fromColumn: string;
  } | null>(null);
  const [showDDL, setShowDDL] = useState(false);
  const [ddlContent, setDdlContent] = useState('');
  const [zoom, setZoom] = useState(1);

  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const idCounter = useRef(0);

  useEffect(() => {
    getSchema(pid, sid)
      .then((s) => {
        setSchema(s);
        // 테이블에 위치 부여 (data 안에 저장된 위치 사용 또는 기본 배치)
        const tablesWithPos = s.tables.map((t, i) => ({
          ...t,
          x: t.position?.x ?? 40 + (i % 3) * 260,
          y: t.position?.y ?? 40 + Math.floor(i / 3) * 250,
        }));
        setTables(tablesWithPos);
        setRelations(s.relations);
      })
      .catch(() => toast.error('스키마를 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
  }, [pid, sid]);

  /* ── 자동 저장 ────────────────────── */
  const scheduleAutoSave = useCallback(
    (t: typeof tables, r: SchemaRelation[]) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        try {
          await updateSchema(pid, sid, { tables: t, relations: r });
        } catch {
          /* */
        }
      }, 2000);
    },
    [pid, sid]
  );

  const handleSave = async () => {
    try {
      await updateSchema(pid, sid, { tables, relations });
      toast.success('저장되었습니다.');
    } catch {
      toast.error('저장에 실패했습니다.');
    }
  };

  /* ── 테이블 추가 ──────────────────── */
  const addTable = () => {
    const name = `table_${tables.length + 1}`;
    const newTable: SchemaTable & { x: number; y: number } = {
      id: `tbl-${Date.now()}`,
      name,
      comment: null,
      colorTag: null,
      columns: [
        {
          id: `col-${Date.now()}`,
          name: 'id',
          type: 'BIGINT' as ColumnType,
          length: null,
          constraints: ['PRIMARY_KEY', 'AUTO_INCREMENT'] as ColumnConstraint[],
          defaultValue: null,
          comment: null,
          referencesTable: null,
          referencesColumn: null,
        },
      ],
      position: { x: 100 + Math.random() * 200, y: 80 + Math.random() * 200 },
      x: 100 + Math.random() * 200,
      y: 80 + Math.random() * 200,
    };
    const updated = [...tables, newTable];
    setTables(updated);
    setSelectedTable(newTable.id);
    scheduleAutoSave(updated, relations);
  };

  /* ── 드래그 ────────────────────────── */
  const handleMouseDown = (e: React.MouseEvent, tableId: string) => {
    e.stopPropagation();
    const t = tables.find((tbl) => tbl.id === tableId);
    if (!t) return;

    if (connecting) return; // 연결 모드
    setSelectedTable(tableId);
    setDragging({ id: tableId, ox: e.clientX - t.x * zoom, oy: e.clientY - t.y * zoom });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging) return;
      setTables((prev) =>
        prev.map((t) =>
          t.id === dragging.id
            ? { ...t, x: (e.clientX - dragging.ox) / zoom, y: (e.clientY - dragging.oy) / zoom }
            : t
        )
      );
    },
    [dragging, zoom]
  );

  const handleMouseUp = useCallback(() => {
    if (dragging) {
      scheduleAutoSave(tables, relations);
    }
    setDragging(null);
  }, [dragging, tables, relations, scheduleAutoSave]);

  /* ── 테이블 삭제 ──────────────────── */
  const deleteTable = (id: string) => {
    const updatedTables = tables.filter((t) => t.id !== id);
    const updatedRels = relations.filter((r) => r.sourceTableId !== id && r.targetTableId !== id);
    setTables(updatedTables);
    setRelations(updatedRels);
    setSelectedTable(null);
    scheduleAutoSave(updatedTables, updatedRels);
  };

  /* ── 테이블 이름 수정 ────────────── */
  const renameTable = (id: string, name: string) => {
    const updated = tables.map((t) => (t.id === id ? { ...t, name } : t));
    setTables(updated);
    scheduleAutoSave(updated, relations);
  };

  /* ── 컬럼 CRUD ─────────────────────── */
  const addColumn = (tableId: string) => {
    const updated = tables.map((t) => {
      if (t.id !== tableId) return t;
      return {
        ...t,
        columns: [
          ...t.columns,
          {
            id: `col-${Date.now()}`,
            name: `column_${t.columns.length + 1}`,
            type: 'VARCHAR' as ColumnType,
            length: null,
            constraints: [] as ColumnConstraint[],
            defaultValue: null,
            comment: null,
            referencesTable: null,
            referencesColumn: null,
          },
        ],
      };
    });
    setTables(updated);
    scheduleAutoSave(updated, relations);
  };

  const updateColumn = (
    tableId: string,
    colId: string,
    patch: Partial<SchemaColumn>
  ) => {
    const updated = tables.map((t) => {
      if (t.id !== tableId) return t;
      return {
        ...t,
        columns: t.columns.map((c) => (c.id === colId ? { ...c, ...patch } : c)),
      };
    });
    setTables(updated);
    scheduleAutoSave(updated, relations);
  };

  const deleteColumn = (tableId: string, colId: string) => {
    const updated = tables.map((t) => {
      if (t.id !== tableId) return t;
      return { ...t, columns: t.columns.filter((c) => c.id !== colId) };
    });
    setTables(updated);
    scheduleAutoSave(updated, relations);
  };

  /* ── 릴레이션 생성 ─────────────────── */
  const startConnect = (tableId: string, colId: string) => {
    if (connecting) {
      // 완료
      if (connecting.fromTable !== tableId) {
        idCounter.current += 1;
        const newId = `rel-${idCounter.current}`;
        const rel: SchemaRelation = {
          id: newId,
          sourceTableId: connecting.fromTable,
          sourceColumnId: connecting.fromColumn,
          targetTableId: tableId,
          targetColumnId: colId,
          relationType: '1:N' as RelationType,
        };
        const updated = [...relations, rel];
        setRelations(updated);
        scheduleAutoSave(tables, updated);
      }
      setConnecting(null);
    } else {
      setConnecting({ fromTable: tableId, fromColumn: colId });
      toast.success('연결할 대상 테이블의 컬럼을 클릭하세요.');
    }
  };

  const deleteRelation = (id: string) => {
    const updated = relations.filter((r) => r.id !== id);
    setRelations(updated);
    scheduleAutoSave(tables, updated);
  };

  /* ── DDL 내보내기 ─────────────────── */
  const handleExportDDL = async () => {
    if (!schema) return;
    try {
      const ddl = await exportDDL(pid, sid, schema.dialect);
      setDdlContent(ddl);
      setShowDDL(true);
    } catch {
      // 로컬 DDL 생성
      const lines = tables.map((t) => {
        const cols = t.columns
          .map((c) => {
            let line = `  ${c.name} ${c.type}`;
            if (c.constraints.includes('NOT_NULL')) line += ' NOT NULL';
            if (c.constraints.includes('AUTO_INCREMENT')) line += ' AUTO_INCREMENT';
            if (c.constraints.includes('PRIMARY_KEY')) line += ' PRIMARY KEY';
            if (c.constraints.includes('UNIQUE')) line += ' UNIQUE';
            if (c.defaultValue) line += ` DEFAULT ${c.defaultValue}`;
            return line;
          })
          .join(',\n');
        return `CREATE TABLE ${t.name} (\n${cols}\n);`;
      });
      setDdlContent(lines.join('\n\n'));
      setShowDDL(true);
    }
  };

  /* ── 릴레이션 선 좌표 계산 ──────── */
  const getRelLine = (rel: SchemaRelation) => {
    const fromT = tables.find((t) => t.id === rel.sourceTableId);
    const toT = tables.find((t) => t.id === rel.targetTableId);
    if (!fromT || !toT) return null;

    const fromColIdx = fromT.columns.findIndex((c) => c.id === rel.sourceColumnId);
    const toColIdx = toT.columns.findIndex((c) => c.id === rel.targetColumnId);

    const x1 = fromT.x + TABLE_W;
    const y1 = fromT.y + TABLE_HEADER_H + (fromColIdx >= 0 ? fromColIdx : 0) * COL_ROW_H + COL_ROW_H / 2;
    const x2 = toT.x;
    const y2 = toT.y + TABLE_HEADER_H + (toColIdx >= 0 ? toColIdx : 0) * COL_ROW_H + COL_ROW_H / 2;

    return { x1, y1, x2, y2 };
  };

  const selectedTableData = tables.find((t) => t.id === selectedTable);

  if (loading || !schema) {
    return (
      <S.Container>
        <S.EmptyState>로딩 중...</S.EmptyState>
      </S.Container>
    );
  }

  return (
    <S.EditorContainer>
      <S.EditorTopBar>
        <S.BackButton onClick={() => navigate(`/project/${pid}/schema`)}>
          ← 목록
        </S.BackButton>
        <S.EditorTitle>{schema.title}</S.EditorTitle>
        <S.ToolButton onClick={handleExportDDL}>DDL 내보내기</S.ToolButton>
        <S.ActionButton onClick={handleSave}>저장</S.ActionButton>
      </S.EditorTopBar>

      <S.ToolPanel>
        <S.ToolButton onClick={addTable}>+ 테이블 추가</S.ToolButton>
        <S.ToolButton
          $active={!!connecting}
          onClick={() => setConnecting(connecting ? null : null)}
        >
          {connecting ? '연결 취소' : '🔗 릴레이션'}
        </S.ToolButton>
        <S.ToolButton onClick={() => setZoom((z) => Math.min(z + 0.1, 2))}>확대 +</S.ToolButton>
        <S.ToolButton onClick={() => setZoom((z) => Math.max(z - 0.1, 0.3))}>축소 −</S.ToolButton>
        <S.ToolButton onClick={() => setZoom(1)}>리셋</S.ToolButton>
      </S.ToolPanel>

      <S.CanvasArea
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => {
          if (!dragging) setSelectedTable(null);
        }}
      >
        <svg
          width="100%"
          height="100%"
          style={{ cursor: dragging ? 'grabbing' : connecting ? 'crosshair' : 'default' }}
        >
          <g transform={`scale(${zoom})`}>
            <defs>
              <marker
                id="erd-arrow"
                markerWidth="10"
                markerHeight="7"
                refX="10"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
              </marker>
            </defs>

            {/* 릴레이션 선 */}
            {relations.map((rel) => {
              const line = getRelLine(rel);
              if (!line) return null;
              const midX = (line.x1 + line.x2) / 2;
              return (
                <g key={rel.id}>
                  <path
                    d={`M${line.x1},${line.y1} C${midX},${line.y1} ${midX},${line.y2} ${line.x2},${line.y2}`}
                    fill="none"
                    stroke="#888"
                    strokeWidth={1.5}
                    markerEnd="url(#erd-arrow)"
                  />
                  {/* 타입 라벨 */}
                  <text
                    x={midX}
                    y={(line.y1 + line.y2) / 2 - 6}
                    fontSize={10}
                    fill="#888"
                    textAnchor="middle"
                  >
                    {rel.relationType}
                  </text>
                  {/* 삭제 히트 영역 */}
                  <path
                    d={`M${line.x1},${line.y1} C${midX},${line.y1} ${midX},${line.y2} ${line.x2},${line.y2}`}
                    fill="none"
                    stroke="transparent"
                    strokeWidth={12}
                    style={{ cursor: 'pointer' }}
                    onDoubleClick={() => deleteRelation(rel.id)}
                  />
                </g>
              );
            })}

            {/* 테이블 노드 */}
            {tables.map((t) => {
              const h = TABLE_HEADER_H + t.columns.length * COL_ROW_H + 4;
              const isSelected = selectedTable === t.id;
              return (
                <S.TableNodeGroup
                  key={t.id}
                  onMouseDown={(e) => handleMouseDown(e, t.id)}
                >
                  {/* 배경 */}
                  <rect
                    x={t.x}
                    y={t.y}
                    width={TABLE_W}
                    height={h}
                    rx={6}
                    fill="#fff"
                    stroke={isSelected ? '#4B88CE' : '#ccc'}
                    strokeWidth={isSelected ? 2 : 1}
                  />
                  {/* 헤더 */}
                  <rect
                    x={t.x}
                    y={t.y}
                    width={TABLE_W}
                    height={TABLE_HEADER_H}
                    rx={6}
                    fill={isSelected ? '#4B88CE' : '#555'}
                  />
                  <rect
                    x={t.x}
                    y={t.y + TABLE_HEADER_H - 6}
                    width={TABLE_W}
                    height={6}
                    fill={isSelected ? '#4B88CE' : '#555'}
                  />
                  <text
                    x={t.x + TABLE_W / 2}
                    y={t.y + TABLE_HEADER_H / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={13}
                    fontWeight={600}
                    fill="#fff"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {t.name}
                  </text>

                  {/* 컬럼 */}
                  {t.columns.map((col, ci) => {
                    const cy = t.y + TABLE_HEADER_H + ci * COL_ROW_H;
                    const isPK = col.constraints.includes('PRIMARY_KEY');
                    const isFK = col.constraints.includes('FOREIGN_KEY');
                    return (
                      <g
                        key={col.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (connecting) {
                            startConnect(t.id, col.id);
                          }
                        }}
                        style={{ cursor: connecting ? 'crosshair' : 'default' }}
                      >
                        <rect
                          x={t.x}
                          y={cy}
                          width={TABLE_W}
                          height={COL_ROW_H}
                          fill={ci % 2 === 0 ? '#fafafa' : '#fff'}
                        />
                        <text
                          x={t.x + 8}
                          y={cy + COL_ROW_H / 2}
                          dominantBaseline="central"
                          fontSize={11}
                          fill={isPK ? '#1967D2' : isFK ? '#137333' : '#333'}
                          fontWeight={isPK ? 700 : 400}
                          style={{ pointerEvents: 'none', userSelect: 'none' }}
                        >
                          {isPK ? '🔑 ' : isFK ? '🔗 ' : ''}
                          {col.name}
                        </text>
                        <text
                          x={t.x + TABLE_W - 8}
                          y={cy + COL_ROW_H / 2}
                          dominantBaseline="central"
                          textAnchor="end"
                          fontSize={10}
                          fill="#999"
                          style={{ pointerEvents: 'none', userSelect: 'none' }}
                        >
                          {col.type}
                        </text>
                      </g>
                    );
                  })}
                </S.TableNodeGroup>
              );
            })}
          </g>
        </svg>

        {/* 테이블 편집 패널 */}
        {selectedTableData && (
          <S.TablePanel onClick={(e) => e.stopPropagation()}>
            <S.PanelHeader>
              <S.PanelTitle>테이블 편집</S.PanelTitle>
              <S.DangerButton
                style={{ padding: '4px 10px', fontSize: '11px' }}
                onClick={() => deleteTable(selectedTableData.id)}
              >
                삭제
              </S.DangerButton>
            </S.PanelHeader>

            <S.PanelBody>
              <S.FieldLabel>테이블 이름</S.FieldLabel>
              <S.ModalInput
                value={selectedTableData.name}
                onChange={(e) => renameTable(selectedTableData.id, e.target.value)}
              />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 8,
                }}
              >
                <S.FieldLabel>컬럼</S.FieldLabel>
                <S.ToolButton onClick={() => addColumn(selectedTableData.id)}>
                  + 컬럼
                </S.ToolButton>
              </div>

              {selectedTableData.columns.map((col) => (
                <S.ColumnRow key={col.id}>
                  <S.ColumnInput
                    value={col.name}
                    onChange={(e) =>
                      updateColumn(selectedTableData.id, col.id, { name: e.target.value })
                    }
                    style={{ flex: 1 }}
                  />
                  <S.ColumnSelect
                    value={col.type}
                    onChange={(e) =>
                      updateColumn(selectedTableData.id, col.id, {
                        type: e.target.value as ColumnType,
                      })
                    }
                  >
                    {COLUMN_TYPES.map((ct) => (
                      <option key={ct} value={ct}>
                        {ct}
                      </option>
                    ))}
                  </S.ColumnSelect>
                  <S.SmallIconButton
                    title="PK 토글"
                    onClick={() => {
                      const has = col.constraints.includes('PRIMARY_KEY');
                      updateColumn(selectedTableData.id, col.id, {
                        constraints: has
                          ? col.constraints.filter((c) => c !== 'PRIMARY_KEY')
                          : [...col.constraints, 'PRIMARY_KEY'],
                      });
                    }}
                    style={{
                      color: col.constraints.includes('PRIMARY_KEY') ? '#1967D2' : undefined,
                    }}
                  >
                    🔑
                  </S.SmallIconButton>
                  <S.SmallIconButton
                    title="NOT NULL 토글"
                    onClick={() => {
                      const has = col.constraints.includes('NOT_NULL');
                      updateColumn(selectedTableData.id, col.id, {
                        constraints: has
                          ? col.constraints.filter((c) => c !== 'NOT_NULL')
                          : [...col.constraints, 'NOT_NULL'],
                      });
                    }}
                    style={{
                      color: col.constraints.includes('NOT_NULL') ? '#E23737' : undefined,
                    }}
                  >
                    NN
                  </S.SmallIconButton>
                  <S.SmallIconButton
                    title="연결 시작"
                    onClick={() => startConnect(selectedTableData.id, col.id)}
                  >
                    🔗
                  </S.SmallIconButton>
                  <S.SmallIconButton
                    onClick={() => deleteColumn(selectedTableData.id, col.id)}
                  >
                    ✕
                  </S.SmallIconButton>
                </S.ColumnRow>
              ))}

              {/* 릴레이션 목록 */}
              <S.FieldLabel style={{ marginTop: 12 }}>
                릴레이션 ({relations.filter(
                  (r) =>
                    r.sourceTableId === selectedTableData.id ||
                    r.targetTableId === selectedTableData.id
                ).length})
              </S.FieldLabel>
              {relations
                .filter(
                  (r) =>
                    r.sourceTableId === selectedTableData.id ||
                    r.targetTableId === selectedTableData.id
                )
                .map((r) => {
                  const from = tables.find((t) => t.id === r.sourceTableId);
                  const to = tables.find((t) => t.id === r.targetTableId);
                  return (
                    <S.ColumnRow key={r.id}>
                      <span style={{ fontSize: 11, flex: 1 }}>
                        {from?.name} → {to?.name} ({r.relationType})
                      </span>
                      <S.SmallIconButton onClick={() => deleteRelation(r.id)}>
                        ✕
                      </S.SmallIconButton>
                    </S.ColumnRow>
                  );
                })}
            </S.PanelBody>
          </S.TablePanel>
        )}
      </S.CanvasArea>

      {/* DDL 모달 */}
      {showDDL && (
        <S.ModalOverlay onClick={() => setShowDDL(false)}>
          <S.ModalBox
            onClick={(e) => e.stopPropagation()}
            style={{ width: 600, maxHeight: '80vh' }}
          >
            <S.ModalTitle>DDL 내보내기 — {schema.dialect}</S.ModalTitle>
            <S.DDLBlock>{ddlContent}</S.DDLBlock>
            <S.ModalActions>
              <S.ActionButton
                onClick={() => {
                  navigator.clipboard.writeText(ddlContent);
                  toast.success('복사되었습니다.');
                }}
              >
                복사
              </S.ActionButton>
              <S.CancelButton onClick={() => setShowDDL(false)}>닫기</S.CancelButton>
            </S.ModalActions>
          </S.ModalBox>
        </S.ModalOverlay>
      )}
    </S.EditorContainer>
  );
}

export default ProjectSchemaDetail;
