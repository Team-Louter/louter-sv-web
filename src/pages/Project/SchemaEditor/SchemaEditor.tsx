import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
  type MouseEvent as RME,
  type WheelEvent as RWE,
  type KeyboardEvent as RKE,
} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as S from './SchemaEditor.styled';
import { getSchema, updateSchema } from '@/api/Project';
import { toast } from '@/store/toastStore';
import { useHistory } from '../DiagramEditor/hooks/useHistory';
import {
  type EditorTable,
  type EditorRelation,
  type EditorData,
  type ToolMode,
  type ColumnType,
  type ColumnConstraint,
  type RelationType,
  type SqlDialect,
  COLUMN_TYPES,
  CONSTRAINTS,
  RELATION_TYPES,
  DIALECT_OPTIONS,
  TABLE_COLORS,
  TABLE_HEADER_H,
  COL_ROW_H,
  DEFAULT_TABLE_W,
  GRID_SIZE,
  MIN_TABLE_W,
  MAX_TABLE_W,
  makeTable,
  makeColumn,
  makeRelation,
  snap,
  tableHeight,
  relLineCoords,
  relPath,
  generateDDL,
  crowsFootMarker,
  uid,
} from './types';
import {
  IcArrowLeft,
  IcPlus,
  IcTrash,
  IcSave,
  IcUndo,
  IcRedo,
  IcCopy,
  IcPaste,
  IcDuplicate,
  IcLink,
  IcCursor,
  IcHand,
  IcZoomIn,
  IcZoomOut,
  IcFitScreen,
  IcReset,
  IcDownload,
  IcCode,
  IcGrid,
  IcAlignLeft,
  IcAlignCenterH,
  IcAlignRight,
  IcDistributeH,
  IcDistributeV,
  IcAutoLayout,
  IcSearch,
  IcChevronRight,
  IcChevronLeft,
  IcChevronDown,
  IcChevronUp,
  IcMouse,
  IcEdit,
  IcKey,
  IcTable,
  IcDatabase,
  IcMinimap,
  IcSelectAll,
  IcExpand,
  IcCollapse,
} from './Icons';
import type { DbSchema } from '@/types/project';

/* ═══════════════════════════════════════════════════════════
   Schema Editor — 풀스크린 DB 스키마(ERD) 에디터
   ═══════════════════════════════════════════════════════════ */

const EMPTY: EditorData = { tables: [], relations: [] };

function SchemaEditor() {
  const { projectId, schemaId } = useParams<{ projectId: string; schemaId: string }>();
  const pid = Number(projectId);
  const sid = Number(schemaId);
  const navigate = useNavigate();

  /* ── 메타 ──────────────────────────────────── */
  const [schema, setSchema] = useState<DbSchema | null>(null);
  const [dialect, setDialect] = useState<SqlDialect>('MYSQL');
  const [loading, setLoading] = useState(true);

  /* ── 에디터 데이터 + 히스토리 ───────────────── */
  const {
    state: data,
    push,
    undo,
    redo,
    canUndo,
    canRedo,
    silentSet,
    reset,
  } = useHistory<EditorData>(EMPTY);

  /* ── 캔버스 상태 ──────────────────────────────── */
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [tool, setTool] = useState<ToolMode>('select');
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);

  /* ── 선택 ─────────────────────────────────────── */
  const [selectedTableIds, setSelectedTableIds] = useState<string[]>([]);
  const [selectedRelId, setSelectedRelId] = useState<string | null>(null);

  /* ── 패널 ─────────────────────────────────────── */
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [rightTab, setRightTab] = useState<'table' | 'relation' | 'canvas'>('table');
  const [searchQuery, setSearchQuery] = useState('');

  /* ── 인터랙션 ─────────────────────────────────── */
  const [dragging, setDragging] = useState<{ ids: string[]; ox: number; oy: number; init: { id: string; x: number; y: number }[] } | null>(null);
  const [panning, setPanning] = useState<{ sx: number; sy: number; ox: number; oy: number } | null>(null);
  const [connecting, setConnecting] = useState<{ fromTableId: string; fromColumnId: string; mx: number; my: number } | null>(null);
  const [resizing, setResizing] = useState<{ tableId: string; startW: number; startX: number } | null>(null);
  const [rubberBand, setRubberBand] = useState<{ sx: number; sy: number; ex: number; ey: number } | null>(null);
  const [editingLabel, setEditingLabel] = useState<{ tableId: string; value: string } | null>(null);

  /* ── 컨텍스트 메뉴 ──────────────────────────── */
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; tableId?: string; relId?: string } | null>(null);

  /* ── 모달 ─────────────────────────────────────── */
  const [showDDL, setShowDDL] = useState(false);
  const [ddlDialect, setDdlDialect] = useState<SqlDialect>('MYSQL');
  const ddlContent = useMemo(() => generateDDL(data.tables, data.relations, ddlDialect), [data.tables, data.relations, ddlDialect]);

  /* ── 클립보드 ──────────────────────────────────── */
  const clipboard = useRef<EditorTable[]>([]);

  /* ── refs ──────────────────────────────────────── */
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  /* ──────────────────────────────────────────────────────────
     데이터 로드
     ────────────────────────────────────────────────────────── */
  useEffect(() => {
    getSchema(pid, sid)
      .then((s) => {
        setSchema(s);
        setDialect(s.dialect);
        const tables: EditorTable[] = s.tables.map((t, i) => ({
          ...t,
          x: t.position?.x ?? 40 + (i % 4) * 280,
          y: t.position?.y ?? 40 + Math.floor(i / 4) * 260,
          width: DEFAULT_TABLE_W,
          collapsed: false,
        }));
        reset({ tables, relations: s.relations as EditorRelation[] });
      })
      .catch(() => toast.error('스키마를 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pid, sid]);

  /* ──────────────────────────────────────────────────────────
     자동 저장
     ────────────────────────────────────────────────────────── */
  const scheduleAutoSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await updateSchema(pid, sid, {
          tables: data.tables.map((t) => ({
            ...t,
            position: { x: t.x, y: t.y },
          })),
          relations: data.relations,
        });
      } catch { /* 무시 */ }
    }, 2500);
  }, [pid, sid, data]);

  useEffect(() => {
    scheduleAutoSave();
  }, [data, scheduleAutoSave]);

  const handleSave = async () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    try {
      await updateSchema(pid, sid, {
        tables: data.tables.map((t) => ({
          ...t,
          position: { x: t.x, y: t.y },
        })),
        relations: data.relations,
      });
      toast.success('저장되었습니다.');
    } catch {
      toast.error('저장에 실패했습니다.');
    }
  };

  /* ──────────────────────────────────────────────────────────
     파생 데이터
     ────────────────────────────────────────────────────────── */
  const tables = data.tables;
  const relations = data.relations;
  const selectedTables = useMemo(
    () => tables.filter((t) => selectedTableIds.includes(t.id)),
    [tables, selectedTableIds],
  );
  const selectedRel = useMemo(
    () => relations.find((r) => r.id === selectedRelId) ?? null,
    [relations, selectedRelId],
  );
  const filteredTables = useMemo(
    () =>
      searchQuery
        ? tables.filter(
            (t) =>
              t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.columns.some((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())),
          )
        : tables,
    [tables, searchQuery],
  );

  /* ──────────────────────────────────────────────────────────
     유틸: 캔버스 좌표 변환
     ────────────────────────────────────────────────────────── */
  const toCanvas = useCallback(
    (clientX: number, clientY: number) => {
      const r = canvasRef.current?.getBoundingClientRect();
      if (!r) return { x: 0, y: 0 };
      return {
        x: (clientX - r.left - pan.x) / zoom,
        y: (clientY - r.top - pan.y) / zoom,
      };
    },
    [pan, zoom],
  );

  /* ──────────────────────────────────────────────────────────
     테이블 CRUD
     ────────────────────────────────────────────────────────── */
  const addTable = useCallback(
    (x?: number, y?: number) => {
      const cx = x ?? (canvasRef.current ? canvasRef.current.clientWidth / 2 / zoom - pan.x / zoom : 300);
      const cy = y ?? (canvasRef.current ? canvasRef.current.clientHeight / 2 / zoom - pan.y / zoom : 200);
      const t = makeTable(
        snapToGrid ? snap(cx, GRID_SIZE) : cx,
        snapToGrid ? snap(cy, GRID_SIZE) : cy,
        tables.length + 1,
      );
      push({ tables: [...tables, t], relations });
      setSelectedTableIds([t.id]);
      setRightTab('table');
    },
    [tables, relations, push, zoom, pan, snapToGrid],
  );

  const updateTable = useCallback(
    (id: string, patch: Partial<EditorTable>) => {
      push({
        tables: tables.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        relations,
      });
    },
    [tables, relations, push],
  );

  const deleteTable = useCallback(
    (id: string) => {
      push({
        tables: tables.filter((t) => t.id !== id),
        relations: relations.filter((r) => r.sourceTableId !== id && r.targetTableId !== id),
      });
      setSelectedTableIds((prev) => prev.filter((tid) => tid !== id));
    },
    [tables, relations, push],
  );

  const deleteSelected = useCallback(() => {
    if (selectedRelId) {
      push({ tables, relations: relations.filter((r) => r.id !== selectedRelId) });
      setSelectedRelId(null);
      return;
    }
    if (selectedTableIds.length === 0) return;
    const ids = new Set(selectedTableIds);
    push({
      tables: tables.filter((t) => !ids.has(t.id)),
      relations: relations.filter((r) => !ids.has(r.sourceTableId) && !ids.has(r.targetTableId)),
    });
    setSelectedTableIds([]);
  }, [selectedTableIds, selectedRelId, tables, relations, push]);

  /* ─── 컬럼 CRUD ──────────────────────────────── */
  const addColumn = useCallback(
    (tableId: string) => {
      const tbl = tables.find((t) => t.id === tableId);
      if (!tbl) return;
      const col = makeColumn(tbl.columns.length + 1);
      push({
        tables: tables.map((t) =>
          t.id === tableId ? { ...t, columns: [...t.columns, col] } : t,
        ),
        relations,
      });
    },
    [tables, relations, push],
  );

  const updateColumn = useCallback(
    (tableId: string, colId: string, patch: Partial<EditorTable['columns'][0]>) => {
      push({
        tables: tables.map((t) =>
          t.id === tableId
            ? {
                ...t,
                columns: t.columns.map((c) => (c.id === colId ? { ...c, ...patch } : c)),
              }
            : t,
        ),
        relations,
      });
    },
    [tables, relations, push],
  );

  const deleteColumn = useCallback(
    (tableId: string, colId: string) => {
      push({
        tables: tables.map((t) =>
          t.id === tableId ? { ...t, columns: t.columns.filter((c) => c.id !== colId) } : t,
        ),
        relations: relations.filter(
          (r) =>
            !(r.sourceTableId === tableId && r.sourceColumnId === colId) &&
            !(r.targetTableId === tableId && r.targetColumnId === colId),
        ),
      });
    },
    [tables, relations, push],
  );

  const moveColumn = useCallback(
    (tableId: string, fromIdx: number, toIdx: number) => {
      push({
        tables: tables.map((t) => {
          if (t.id !== tableId) return t;
          const cols = [...t.columns];
          const [moved] = cols.splice(fromIdx, 1);
          cols.splice(toIdx, 0, moved);
          return { ...t, columns: cols };
        }),
        relations,
      });
    },
    [tables, relations, push],
  );

  const toggleConstraint = useCallback(
    (tableId: string, colId: string, constraint: ColumnConstraint) => {
      const tbl = tables.find((t) => t.id === tableId);
      if (!tbl) return;
      const col = tbl.columns.find((c) => c.id === colId);
      if (!col) return;
      const has = col.constraints.includes(constraint);
      const next = has
        ? col.constraints.filter((c) => c !== constraint)
        : [...col.constraints, constraint];
      updateColumn(tableId, colId, { constraints: next });
    },
    [tables, updateColumn],
  );

  /* ─── 릴레이션 ──────────────────────────────── */
  const addRelation = useCallback(
    (fromTableId: string, fromColId: string, toTableId: string, toColId: string) => {
      if (fromTableId === toTableId) return;
      // 중복 방지
      const exists = relations.some(
        (r) =>
          r.sourceTableId === fromTableId &&
          r.sourceColumnId === fromColId &&
          r.targetTableId === toTableId &&
          r.targetColumnId === toColId,
      );
      if (exists) return;
      const rel = makeRelation(fromTableId, fromColId, toTableId, toColId);
      push({ tables, relations: [...relations, rel] });
      setSelectedRelId(rel.id);
      setRightTab('relation');
    },
    [tables, relations, push],
  );

  const updateRelation = useCallback(
    (id: string, patch: Partial<EditorRelation>) => {
      push({
        tables,
        relations: relations.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      });
    },
    [tables, relations, push],
  );

  const deleteRelation = useCallback(
    (id: string) => {
      push({ tables, relations: relations.filter((r) => r.id !== id) });
      if (selectedRelId === id) setSelectedRelId(null);
    },
    [tables, relations, push, selectedRelId],
  );

  /* ──────────────────────────────────────────────────────────
     복사/붙여넣기/복제
     ────────────────────────────────────────────────────────── */
  const copySelected = useCallback(() => {
    clipboard.current = selectedTables.map((t) => ({ ...t }));
    if (clipboard.current.length > 0) toast.success(`${clipboard.current.length}개 테이블 복사됨`);
  }, [selectedTables]);

  const paste = useCallback(() => {
    if (clipboard.current.length === 0) return;
    const offset = 40;
    const newTables: EditorTable[] = clipboard.current.map((t) => ({
      ...t,
      id: `tbl-${uid()}`,
      x: t.x + offset,
      y: t.y + offset,
      columns: t.columns.map((c) => ({ ...c, id: `col-${uid()}` })),
    }));
    push({ tables: [...tables, ...newTables], relations });
    setSelectedTableIds(newTables.map((t) => t.id));
  }, [tables, relations, push]);

  const duplicate = useCallback(() => {
    if (selectedTables.length === 0) return;
    const offset = 40;
    const newTables: EditorTable[] = selectedTables.map((t) => ({
      ...t,
      id: `tbl-${uid()}`,
      name: `${t.name}_copy`,
      x: t.x + offset,
      y: t.y + offset,
      columns: t.columns.map((c) => ({ ...c, id: `col-${uid()}` })),
    }));
    push({ tables: [...tables, ...newTables], relations });
    setSelectedTableIds(newTables.map((t) => t.id));
  }, [selectedTables, tables, relations, push]);

  /* ──────────────────────────────────────────────────────────
     정렬 / 배치
     ────────────────────────────────────────────────────────── */
  const align = useCallback(
    (dir: 'left' | 'centerH' | 'right') => {
      if (selectedTables.length < 2) return;
      const ref = selectedTables[0];
      const newTables = tables.map((t) => {
        if (!selectedTableIds.includes(t.id)) return t;
        switch (dir) {
          case 'left': return { ...t, x: ref.x };
          case 'right': return { ...t, x: ref.x + ref.width - t.width };
          case 'centerH': return { ...t, x: ref.x + ref.width / 2 - t.width / 2 };
          default: return t;
        }
      });
      push({ tables: newTables, relations });
    },
    [selectedTables, selectedTableIds, tables, relations, push],
  );

  const distribute = useCallback(
    (dir: 'h' | 'v') => {
      if (selectedTables.length < 3) return;
      const sorted = [...selectedTables].sort((a, b) => (dir === 'h' ? a.x - b.x : a.y - b.y));
      const first = sorted[0];
      const last = sorted[sorted.length - 1];
      const total = dir === 'h' ? last.x - first.x : last.y - first.y;
      const step = total / (sorted.length - 1);
      const idMap = new Map<string, number>();
      sorted.forEach((t, i) => idMap.set(t.id, dir === 'h' ? first.x + i * step : first.y + i * step));
      const newTables = tables.map((t) => {
        const val = idMap.get(t.id);
        if (val === undefined) return t;
        return dir === 'h' ? { ...t, x: val } : { ...t, y: val };
      });
      push({ tables: newTables, relations });
    },
    [selectedTables, tables, relations, push],
  );

  const autoLayout = useCallback(() => {
    const gapX = 60;
    const gapY = 40;
    const cols = Math.max(1, Math.ceil(Math.sqrt(tables.length)));
    const newTables = tables.map((t, i) => ({
      ...t,
      x: 40 + (i % cols) * (DEFAULT_TABLE_W + gapX),
      y: 40 + Math.floor(i / cols) * (200 + gapY),
    }));
    push({ tables: newTables, relations });
    toast.success('자동 배치 완료');
  }, [tables, relations, push]);

  /* ──────────────────────────────────────────────────────────
     줌/팬 & 뷰
     ────────────────────────────────────────────────────────── */
  const fitToScreen = useCallback(() => {
    if (tables.length === 0) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const minX = Math.min(...tables.map((t) => t.x));
    const minY = Math.min(...tables.map((t) => t.y));
    const maxX = Math.max(...tables.map((t) => t.x + t.width));
    const maxY = Math.max(...tables.map((t) => t.y + tableHeight(t)));
    const w = maxX - minX + 80;
    const h = maxY - minY + 80;
    const s = Math.min(rect.width / w, rect.height / h, 2);
    setZoom(s);
    setPan({
      x: (rect.width - w * s) / 2 - minX * s + 40 * s,
      y: (rect.height - h * s) / 2 - minY * s + 40 * s,
    });
  }, [tables]);

  const selectAll = useCallback(() => {
    setSelectedTableIds(tables.map((t) => t.id));
  }, [tables]);

  /* ──────────────────────────────────────────────────────────
     마우스 핸들러 — 캔버스
     ────────────────────────────────────────────────────────── */
  const onCanvasMouseDown = useCallback(
    (e: RME) => {
      if (e.button === 2) return; // 우클릭은 context menu
      setCtxMenu(null);
      setEditingLabel(null);

      if (tool === 'pan' || e.button === 1) {
        setPanning({ sx: e.clientX, sy: e.clientY, ox: pan.x, oy: pan.y });
        return;
      }

      if (tool === 'addTable') {
        const pt = toCanvas(e.clientX, e.clientY);
        addTable(pt.x, pt.y);
        setTool('select');
        return;
      }

      // rubber band selection
      if (tool === 'select') {
        const tgt = e.target as SVGElement;
        const isCanvas = tgt === svgRef.current || tgt.tagName === 'rect' && tgt.getAttribute('data-grid') === 'true';
        if (isCanvas) {
          if (!e.shiftKey) {
            setSelectedTableIds([]);
            setSelectedRelId(null);
          }
          setRubberBand({ sx: e.clientX, sy: e.clientY, ex: e.clientX, ey: e.clientY });
        }
      }
    },
    [tool, pan, toCanvas, addTable],
  );

  const onCanvasMouseMove = useCallback(
    (e: RME) => {
      // 패닝
      if (panning) {
        setPan({
          x: panning.ox + (e.clientX - panning.sx),
          y: panning.oy + (e.clientY - panning.sy),
        });
        return;
      }

      // 테이블 드래그
      if (dragging) {
        const dx = (e.clientX - dragging.ox) / zoom;
        const dy = (e.clientY - dragging.oy) / zoom;
        silentSet({
          tables: tables.map((t) => {
            const init = dragging.init.find((i) => i.id === t.id);
            if (!init) return t;
            let nx = init.x + dx;
            let ny = init.y + dy;
            if (snapToGrid) {
              nx = snap(nx, GRID_SIZE);
              ny = snap(ny, GRID_SIZE);
            }
            return { ...t, x: nx, y: ny };
          }),
          relations,
        });
        return;
      }

      // 리사이즈
      if (resizing) {
        const dx = (e.clientX - resizing.startX) / zoom;
        const newW = Math.min(MAX_TABLE_W, Math.max(MIN_TABLE_W, resizing.startW + dx));
        silentSet({
          tables: tables.map((t) =>
            t.id === resizing.tableId ? { ...t, width: newW } : t,
          ),
          relations,
        });
        return;
      }

      // 연결모드 — 마우스 추적
      if (connecting) {
        const pt = toCanvas(e.clientX, e.clientY);
        setConnecting((prev) => prev && { ...prev, mx: pt.x, my: pt.y });
        return;
      }

      // 러버밴드
      if (rubberBand) {
        setRubberBand((prev) => prev && { ...prev, ex: e.clientX, ey: e.clientY });
      }
    },
    [panning, dragging, resizing, connecting, rubberBand, zoom, tables, relations, silentSet, snapToGrid, toCanvas],
  );

  const onCanvasMouseUp = useCallback(
    (e: RME) => {
      if (panning) {
        setPanning(null);
        return;
      }
      if (dragging) {
        push({ tables: data.tables, relations: data.relations });
        setDragging(null);
        return;
      }
      if (resizing) {
        push({ tables: data.tables, relations: data.relations });
        setResizing(null);
        return;
      }
      if (rubberBand) {
        // 범위내 테이블 선택
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const x1 = (Math.min(rubberBand.sx, rubberBand.ex) - rect.left - pan.x) / zoom;
          const y1 = (Math.min(rubberBand.sy, rubberBand.ey) - rect.top - pan.y) / zoom;
          const x2 = (Math.max(rubberBand.sx, rubberBand.ex) - rect.left - pan.x) / zoom;
          const y2 = (Math.max(rubberBand.sy, rubberBand.ey) - rect.top - pan.y) / zoom;

          const hits = tables
            .filter((t) => {
              const h = tableHeight(t);
              return t.x + t.width > x1 && t.x < x2 && t.y + h > y1 && t.y < y2;
            })
            .map((t) => t.id);

          if (e.shiftKey) {
            setSelectedTableIds((prev) => [...new Set([...prev, ...hits])]);
          } else {
            setSelectedTableIds(hits);
          }
        }
        setRubberBand(null);
      }
    },
    [panning, dragging, resizing, rubberBand, data, push, tables, pan, zoom],
  );

  const onWheel = useCallback(
    (e: RWE) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        setZoom((z) => Math.min(4, Math.max(0.1, z + delta)));
      } else {
        setPan((p) => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
      }
    },
    [],
  );

  /* ──────────────────────────────────────────────────────────
     마우스 핸들러 — 테이블 노드
     ────────────────────────────────────────────────────────── */
  const onTableMouseDown = useCallback(
    (e: RME, tableId: string) => {
      e.stopPropagation();
      if (e.button !== 0) return;

      // 연결 모드 — 테이블 클릭은 첫번째 컬럼에 연결
      if (connecting) {
        const tbl = tables.find((t) => t.id === tableId);
        if (tbl && tbl.columns.length > 0) {
          addRelation(connecting.fromTableId, connecting.fromColumnId, tableId, tbl.columns[0].id);
          setConnecting(null);
          setTool('select');
        }
        return;
      }

      const isSelected = selectedTableIds.includes(tableId);
      let ids: string[];
      if (e.shiftKey) {
        ids = isSelected
          ? selectedTableIds.filter((id) => id !== tableId)
          : [...selectedTableIds, tableId];
      } else {
        ids = isSelected ? selectedTableIds : [tableId];
      }
      setSelectedTableIds(ids);
      setSelectedRelId(null);
      setRightTab('table');

      // 시작 드래그
      const initPositions = ids.map((id) => {
        const t = tables.find((tt) => tt.id === id)!;
        return { id, x: t.x, y: t.y };
      });
      setDragging({ ids, ox: e.clientX, oy: e.clientY, init: initPositions });
    },
    [connecting, selectedTableIds, tables, addRelation],
  );

  const onTableDoubleClick = useCallback(
    (e: RME, tableId: string) => {
      e.stopPropagation();
      const tbl = tables.find((t) => t.id === tableId);
      if (!tbl) return;
      setEditingLabel({ tableId, value: tbl.name });
    },
    [tables],
  );

  const onResizeHandleDown = useCallback(
    (e: RME, tableId: string) => {
      e.stopPropagation();
      const tbl = tables.find((t) => t.id === tableId);
      if (!tbl) return;
      setResizing({ tableId, startW: tbl.width, startX: e.clientX });
    },
    [tables],
  );

  /* ─── 컬럼 클릭 — 연결모드 타겟 ────────────── */
  const onColumnClick = useCallback(
    (e: RME, tableId: string, colId: string) => {
      e.stopPropagation();
      if (!connecting) return;
      addRelation(connecting.fromTableId, connecting.fromColumnId, tableId, colId);
      setConnecting(null);
      setTool('select');
    },
    [connecting, addRelation],
  );

  /* ─── 연결 시작 ─────────────────────────────── */
  const startConnect = useCallback(
    (tableId: string, colId: string, mx: number, my: number) => {
      setConnecting({ fromTableId: tableId, fromColumnId: colId, mx, my });
      setTool('connect');
      toast.success('연결할 대상 테이블/컬럼을 클릭하세요');
    },
    [],
  );

  /* ──────────────────────────────────────────────────────────
     릴레이션 클릭
     ────────────────────────────────────────────────────────── */
  const onRelClick = useCallback(
    (e: RME, relId: string) => {
      e.stopPropagation();
      setSelectedRelId(relId);
      setSelectedTableIds([]);
      setRightTab('relation');
    },
    [],
  );

  /* ──────────────────────────────────────────────────────────
     컨텍스트 메뉴
     ────────────────────────────────────────────────────────── */
  const onCtxMenu = useCallback(
    (e: RME, tableId?: string, relId?: string) => {
      e.preventDefault();
      e.stopPropagation();
      if (tableId && !selectedTableIds.includes(tableId)) {
        setSelectedTableIds([tableId]);
      }
      setCtxMenu({ x: e.clientX, y: e.clientY, tableId, relId });
    },
    [selectedTableIds],
  );

  /* ──────────────────────────────────────────────────────────
     키보드
     ────────────────────────────────────────────────────────── */
  const onKeyDown = useCallback(
    (e: RKE) => {
      const meta = e.metaKey || e.ctrlKey;

      if (editingLabel) return; // 편집 중

      if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteSelected();
        return;
      }
      if (meta && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); return; }
      if (meta && e.key === 'z' && e.shiftKey) { e.preventDefault(); redo(); return; }
      if (meta && e.key === 'c') { e.preventDefault(); copySelected(); return; }
      if (meta && e.key === 'v') { e.preventDefault(); paste(); return; }
      if (meta && e.key === 'd') { e.preventDefault(); duplicate(); return; }
      if (meta && e.key === 'a') { e.preventDefault(); selectAll(); return; }
      if (meta && e.key === 's') { e.preventDefault(); handleSave(); return; }

      switch (e.key) {
        case 'v': setTool('select'); break;
        case 'h': setTool('pan'); break;
        case 'c': if (!meta) setTool('connect'); break;
        case 't': addTable(); break;
        case 'Escape':
          setConnecting(null);
          setTool('select');
          setCtxMenu(null);
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editingLabel, deleteSelected, undo, redo, copySelected, paste, duplicate, selectAll, addTable],
  );

  /* ──────────────────────────────────────────────────────────
     SVG 내보내기
     ────────────────────────────────────────────────────────── */
  const exportSVG = useCallback(() => {
    if (!svgRef.current) return;
    const clone = svgRef.current.cloneNode(true) as SVGElement;
    // 그리드 제거
    clone.querySelectorAll('[data-grid]').forEach((el) => el.remove());
    const blob = new Blob([clone.outerHTML], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${schema?.title || 'schema'}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('SVG 내보내기 완료');
  }, [schema]);

  /* ──────────────────────────────────────────────────────────
     테이블 접기/펼치기
     ────────────────────────────────────────────────────────── */
  const toggleCollapse = useCallback(
    (tableId: string) => {
      push({
        tables: tables.map((t) =>
          t.id === tableId ? { ...t, collapsed: !t.collapsed } : t,
        ),
        relations,
      });
    },
    [tables, relations, push],
  );

  const collapseAll = useCallback(() => {
    push({ tables: tables.map((t) => ({ ...t, collapsed: true })), relations });
  }, [tables, relations, push]);

  const expandAll = useCallback(() => {
    push({ tables: tables.map((t) => ({ ...t, collapsed: false })), relations });
  }, [tables, relations, push]);

  /* ──────────────────────────────────────────────────────────
     글로벌 이벤트
     ────────────────────────────────────────────────────────── */
  useEffect(() => {
    const handleClick = () => setCtxMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  /* ──────────────────────────────────────────────────────────
     렌더
     ────────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <S.Root>
        <S.TopBar>
          <S.EditorTitle>로딩 중...</S.EditorTitle>
        </S.TopBar>
      </S.Root>
    );
  }

  return (
    <S.Root tabIndex={0} onKeyDown={onKeyDown}>
      {/* ═══ 상단 툴바 ══════════════════════════════════════ */}
      <S.TopBar>
        <S.TBtn onClick={() => navigate(`/project/${pid}/schema`)}>
          <IcArrowLeft size={14} /> 목록
        </S.TBtn>
        <S.TopBarSep />
        <S.EditorTitle>{schema?.title || 'Schema'}</S.EditorTitle>
        <S.DialectBadge $color={DIALECT_OPTIONS.find((d) => d.value === dialect)?.color}>
          {dialect}
        </S.DialectBadge>
        <S.TopBarSep />

        {/* 도구 모드 */}
        <S.TopBarSection>
          <S.TBtn $active={tool === 'select'} onClick={() => setTool('select')} title="선택 (V)">
            <IcCursor size={14} /> 선택
          </S.TBtn>
          <S.TBtn $active={tool === 'pan'} onClick={() => setTool('pan')} title="이동 (H)">
            <IcHand size={14} /> 이동
          </S.TBtn>
          <S.TBtn $active={tool === 'connect'} onClick={() => { setTool('connect'); setConnecting(null); }} title="연결 (C)">
            <IcLink size={14} /> 연결
          </S.TBtn>
          <S.TBtn $active={tool === 'addTable'} onClick={() => setTool('addTable')} title="테이블 추가 (T)">
            <IcTable size={14} /> 추가
          </S.TBtn>
        </S.TopBarSection>
        <S.TopBarSep />

        {/* 실행취소/다시실행 */}
        <S.TopBarSection>
          <S.TBtn disabled={!canUndo} onClick={undo} title="실행 취소 (⌘Z)"><IcUndo size={14} /></S.TBtn>
          <S.TBtn disabled={!canRedo} onClick={redo} title="다시 실행 (⌘⇧Z)"><IcRedo size={14} /></S.TBtn>
        </S.TopBarSection>
        <S.TopBarSep />

        {/* 편집 */}
        <S.TopBarSection>
          <S.TBtn onClick={copySelected} title="복사 (⌘C)"><IcCopy size={14} /></S.TBtn>
          <S.TBtn onClick={paste} title="붙여넣기 (⌘V)"><IcPaste size={14} /></S.TBtn>
          <S.TBtn onClick={duplicate} title="복제 (⌘D)"><IcDuplicate size={14} /></S.TBtn>
          <S.TBtn onClick={deleteSelected} title="삭제 (Del)"><IcTrash size={14} /></S.TBtn>
        </S.TopBarSection>
        <S.TopBarSep />

        {/* 정렬 */}
        <S.TopBarSection>
          <S.TBtn onClick={() => align('left')} disabled={selectedTables.length < 2} title="왼쪽 정렬"><IcAlignLeft size={14} /></S.TBtn>
          <S.TBtn onClick={() => align('centerH')} disabled={selectedTables.length < 2} title="수평 중앙"><IcAlignCenterH size={14} /></S.TBtn>
          <S.TBtn onClick={() => align('right')} disabled={selectedTables.length < 2} title="오른쪽 정렬"><IcAlignRight size={14} /></S.TBtn>
          <S.TBtn onClick={() => distribute('h')} disabled={selectedTables.length < 3} title="가로 균등"><IcDistributeH size={14} /></S.TBtn>
          <S.TBtn onClick={() => distribute('v')} disabled={selectedTables.length < 3} title="세로 균등"><IcDistributeV size={14} /></S.TBtn>
          <S.TBtn onClick={autoLayout} title="자동 배치"><IcAutoLayout size={14} /></S.TBtn>
        </S.TopBarSection>
        <S.TopBarSep />

        {/* 뷰 토글 */}
        <S.TopBarSection>
          <S.TBtn $active={showGrid} onClick={() => setShowGrid(!showGrid)} title="그리드 토글"><IcGrid size={14} /></S.TBtn>
          <S.TBtn $active={showMinimap} onClick={() => setShowMinimap(!showMinimap)} title="미니맵 토글"><IcMinimap size={14} /></S.TBtn>
          <S.TBtn onClick={collapseAll} title="모두 접기"><IcCollapse size={14} /></S.TBtn>
          <S.TBtn onClick={expandAll} title="모두 펼치기"><IcExpand size={14} /></S.TBtn>
        </S.TopBarSection>

        <div style={{ flex: 1 }} />

        {/* 내보내기 & 저장 */}
        <S.TBtn onClick={exportSVG} title="SVG 내보내기"><IcDownload size={14} /> SVG</S.TBtn>
        <S.TBtn onClick={() => { setDdlDialect(dialect); setShowDDL(true); }} title="DDL 내보내기"><IcCode size={14} /> DDL</S.TBtn>
        <S.PrimaryBtn onClick={handleSave}><IcSave size={14} /> 저장</S.PrimaryBtn>
      </S.TopBar>

      {/* ═══ 바디 ════════════════════════════════════════════ */}
      <S.Body>
        {/* ─── 왼쪽 패널: 테이블 목록 ──────────── */}
        <S.LeftPanel $collapsed={leftCollapsed}>
          <S.PanelToggle onClick={() => setLeftCollapsed(!leftCollapsed)}>
            {leftCollapsed ? <IcChevronRight size={14} /> : <><IcDatabase size={14} /> 테이블</>}
          </S.PanelToggle>
          {!leftCollapsed && (
            <S.PanelContent>
              <S.SearchWrap>
                <IcSearch size={12} />
                <S.SearchInput
                  placeholder="테이블/컬럼 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </S.SearchWrap>

              <S.TBtn onClick={() => addTable()} style={{ width: '100%', justifyContent: 'center' }}>
                <IcPlus size={14} /> 테이블 추가
              </S.TBtn>

              <S.PanelSection>
                <S.PanelSectionTitle>테이블 ({tables.length})</S.PanelSectionTitle>
                {filteredTables.map((t) => (
                  <S.TableListItem
                    key={t.id}
                    $active={selectedTableIds.includes(t.id)}
                    $color={t.colorTag || undefined}
                    onClick={() => {
                      setSelectedTableIds([t.id]);
                      setRightTab('table');
                      // 캔버스에서 해당 테이블로 이동
                      const r = canvasRef.current?.getBoundingClientRect();
                      if (r) {
                        setPan({
                          x: r.width / 2 - t.x * zoom - t.width * zoom / 2,
                          y: r.height / 2 - t.y * zoom - tableHeight(t) * zoom / 2,
                        });
                      }
                    }}
                    onContextMenu={(e) => onCtxMenu(e as unknown as RME, t.id)}
                  >
                    <S.TableListName>{t.name}</S.TableListName>
                    <S.TableListMeta>{t.columns.length}열</S.TableListMeta>
                  </S.TableListItem>
                ))}
              </S.PanelSection>

              <S.PanelSection>
                <S.PanelSectionTitle>릴레이션 ({relations.length})</S.PanelSectionTitle>
                {relations.map((r) => {
                  const from = tables.find((t) => t.id === r.sourceTableId);
                  const to = tables.find((t) => t.id === r.targetTableId);
                  return (
                    <S.TableListItem
                      key={r.id}
                      $active={selectedRelId === r.id}
                      onClick={() => { setSelectedRelId(r.id); setSelectedTableIds([]); setRightTab('relation'); }}
                    >
                      <S.TableListName style={{ fontSize: 11 }}>
                        {from?.name} → {to?.name}
                      </S.TableListName>
                      <S.TableListMeta>{r.relationType}</S.TableListMeta>
                    </S.TableListItem>
                  );
                })}
              </S.PanelSection>
            </S.PanelContent>
          )}
        </S.LeftPanel>

        {/* ─── 캔버스 ─────────────────────────── */}
        <S.CanvasWrap
          ref={canvasRef}
          onMouseDown={onCanvasMouseDown}
          onMouseMove={onCanvasMouseMove}
          onMouseUp={onCanvasMouseUp}
          onWheel={onWheel}
          onContextMenu={(e) => onCtxMenu(e as unknown as RME)}
          style={{
            cursor: tool === 'pan' || panning ? (panning ? 'grabbing' : 'grab')
              : tool === 'connect' || connecting ? 'crosshair'
              : tool === 'addTable' ? 'cell'
              : dragging ? 'grabbing'
              : 'default',
          }}
        >
          <S.SvgCanvas ref={svgRef}>
            <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
              {/* 그리드 */}
              {showGrid && (
                <>
                  <defs>
                    <pattern id="erd-grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
                      <circle cx={1} cy={1} r={0.5} fill="#d0d0d0" />
                    </pattern>
                  </defs>
                  <rect
                    data-grid="true"
                    x={-5000}
                    y={-5000}
                    width={10000}
                    height={10000}
                    fill="url(#erd-grid)"
                  />
                </>
              )}

              {/* 마커 정의 — Crow's foot */}
              <defs>
                <marker id="erd-one" markerWidth="12" markerHeight="12" refX="12" refY="6" orient="auto">
                  <line x1="12" y1="2" x2="12" y2="10" stroke="#888" strokeWidth="2" />
                </marker>
                <marker id="erd-many" markerWidth="16" markerHeight="12" refX="16" refY="6" orient="auto">
                  <path d="M16,6 L4,1 M16,6 L4,11 M16,2 L16,10" stroke="#888" strokeWidth="1.5" fill="none" />
                </marker>
                <marker id="erd-arrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#888" />
                </marker>
              </defs>

              {/* ── 릴레이션 선 ────────────────── */}
              {relations.map((rel) => {
                const coords = relLineCoords(rel, tables);
                if (!coords) return null;
                const d = relPath(coords);
                const isSelected = selectedRelId === rel.id;
                const srcMarker = crowsFootMarker(rel.relationType, 'source');
                const tgtMarker = crowsFootMarker(rel.relationType, 'target');

                return (
                  <g key={rel.id}>
                    {/* 히트 영역 */}
                    <path
                      d={d}
                      fill="none"
                      stroke="transparent"
                      strokeWidth={14}
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => onRelClick(e as unknown as RME, rel.id)}
                      onContextMenu={(e) => onCtxMenu(e as unknown as RME, undefined, rel.id)}
                    />
                    {/* 실제 선 */}
                    <path
                      d={d}
                      fill="none"
                      stroke={isSelected ? '#4B88CE' : '#888'}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      strokeDasharray={rel.lineStyle === 'dashed' ? '6,3' : rel.lineStyle === 'dotted' ? '2,2' : undefined}
                      markerStart={`url(#erd-${srcMarker})`}
                      markerEnd={`url(#erd-${tgtMarker})`}
                    />
                    {/* 타입 라벨 */}
                    <text
                      x={(coords.x1 + coords.x2) / 2}
                      y={(coords.y1 + coords.y2) / 2 - 8}
                      fontSize={10}
                      fill={isSelected ? '#4B88CE' : '#999'}
                      textAnchor="middle"
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      {rel.relationType}
                    </text>
                  </g>
                );
              })}

              {/* ── 연결 중 라인 ───────────────── */}
              {connecting && (() => {
                const fromT = tables.find((t) => t.id === connecting.fromTableId);
                if (!fromT) return null;
                const ci = fromT.columns.findIndex((c) => c.id === connecting.fromColumnId);
                const fx = fromT.x + fromT.width;
                const fy = fromT.y + TABLE_HEADER_H + Math.max(0, ci) * COL_ROW_H + COL_ROW_H / 2;
                return (
                  <line
                    x1={fx}
                    y1={fy}
                    x2={connecting.mx}
                    y2={connecting.my}
                    stroke="#4B88CE"
                    strokeWidth={2}
                    strokeDasharray="6,3"
                    pointerEvents="none"
                  />
                );
              })()}

              {/* ── 테이블 노드 ────────────────── */}
              {tables.map((t) => {
                const h = tableHeight(t);
                const isSelected = selectedTableIds.includes(t.id);
                const headerColor = t.colorTag || '#555';
                return (
                  <g
                    key={t.id}
                    onMouseDown={(e) => onTableMouseDown(e as unknown as RME, t.id)}
                    onDoubleClick={(e) => onTableDoubleClick(e as unknown as RME, t.id)}
                    onContextMenu={(e) => onCtxMenu(e as unknown as RME, t.id)}
                  >
                    {/* 선택 하이라이트 */}
                    {isSelected && (
                      <rect
                        x={t.x - 3}
                        y={t.y - 3}
                        width={t.width + 6}
                        height={h + 6}
                        rx={8}
                        fill="none"
                        stroke="#4B88CE"
                        strokeWidth={2}
                        strokeDasharray="4,2"
                      />
                    )}

                    {/* 배경 */}
                    <rect
                      x={t.x}
                      y={t.y}
                      width={t.width}
                      height={h}
                      rx={6}
                      fill="#fff"
                      stroke={isSelected ? '#4B88CE' : '#ddd'}
                      strokeWidth={isSelected ? 1.5 : 1}
                    />

                    {/* 헤더 배경 */}
                    <rect x={t.x} y={t.y} width={t.width} height={TABLE_HEADER_H} rx={6} fill={headerColor} />
                    <rect x={t.x} y={t.y + TABLE_HEADER_H - 6} width={t.width} height={6} fill={headerColor} />

                    {/* 접기/펴기 버튼 */}
                    <g
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => { e.stopPropagation(); toggleCollapse(t.id); }}
                    >
                      <rect x={t.x + 4} y={t.y + 8} width={20} height={20} fill="transparent" />
                      <g transform={`translate(${t.x + 8}, ${t.y + 10})`}>
                        {t.collapsed ? (
                          <polygon points="0,0 12,8 0,16" fill="rgba(255,255,255,0.8)" transform="scale(0.7)" />
                        ) : (
                          <polygon points="0,0 16,0 8,12" fill="rgba(255,255,255,0.8)" transform="scale(0.7)" />
                        )}
                      </g>
                    </g>

                    {/* 테이블 이름 */}
                    <text
                      x={t.x + 28}
                      y={t.y + TABLE_HEADER_H / 2}
                      dominantBaseline="central"
                      fontSize={13}
                      fontWeight={600}
                      fill="#fff"
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      {t.name}
                    </text>

                    {/* 컬럼 수 (접힌 경우) */}
                    {t.collapsed && (
                      <text
                        x={t.x + t.width - 8}
                        y={t.y + TABLE_HEADER_H / 2}
                        dominantBaseline="central"
                        textAnchor="end"
                        fontSize={10}
                        fill="rgba(255,255,255,0.7)"
                        style={{ pointerEvents: 'none', userSelect: 'none' }}
                      >
                        {t.columns.length}열
                      </text>
                    )}

                    {/* 컬럼 목록 (펼친 경우) */}
                    {!t.collapsed && t.columns.map((col, ci) => {
                      const cy = t.y + TABLE_HEADER_H + ci * COL_ROW_H;
                      const isPK = col.constraints.includes('PRIMARY_KEY');
                      const isFK = col.constraints.includes('FOREIGN_KEY');
                      const isNN = col.constraints.includes('NOT_NULL');
                      const isUQ = col.constraints.includes('UNIQUE');

                      return (
                        <g
                          key={col.id}
                          onClick={(e) => onColumnClick(e as unknown as RME, t.id, col.id)}
                          style={{ cursor: connecting ? 'crosshair' : 'default' }}
                        >
                          <rect
                            x={t.x}
                            y={cy}
                            width={t.width}
                            height={COL_ROW_H}
                            fill={ci % 2 === 0 ? '#fafafa' : '#fff'}
                          />

                          {/* 연결 포트 (좌/우) */}
                          <circle
                            cx={t.x}
                            cy={cy + COL_ROW_H / 2}
                            r={4}
                            fill="#4B88CE"
                            opacity={connecting ? 0.6 : 0}
                            style={{ cursor: 'crosshair' }}
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              const pt = toCanvas(e.clientX, e.clientY);
                              startConnect(t.id, col.id, pt.x, pt.y);
                            }}
                          />
                          <circle
                            cx={t.x + t.width}
                            cy={cy + COL_ROW_H / 2}
                            r={4}
                            fill="#4B88CE"
                            opacity={connecting ? 0.6 : 0}
                            style={{ cursor: 'crosshair' }}
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              const pt = toCanvas(e.clientX, e.clientY);
                              startConnect(t.id, col.id, pt.x, pt.y);
                            }}
                          />

                          {/* 아이콘 영역 */}
                          <text
                            x={t.x + 8}
                            y={cy + COL_ROW_H / 2}
                            dominantBaseline="central"
                            fontSize={10}
                            fill={isPK ? '#E2A032' : isFK ? '#4B88CE' : 'transparent'}
                            style={{ pointerEvents: 'none', userSelect: 'none' }}
                          >
                            {isPK ? 'PK' : isFK ? 'FK' : '　'}
                          </text>

                          {/* 컬럼 이름 */}
                          <text
                            x={t.x + 28}
                            y={cy + COL_ROW_H / 2}
                            dominantBaseline="central"
                            fontSize={11}
                            fill={isPK ? '#B06D00' : isFK ? '#1967D2' : '#333'}
                            fontWeight={isPK ? 700 : 400}
                            style={{ pointerEvents: 'none', userSelect: 'none' }}
                          >
                            {col.name}
                          </text>

                          {/* 제약조건 뱃지 */}
                          {isNN && (
                            <text
                              x={t.x + t.width - 48}
                              y={cy + COL_ROW_H / 2}
                              dominantBaseline="central"
                              textAnchor="end"
                              fontSize={8}
                              fill="#E23737"
                              fontWeight={700}
                              style={{ pointerEvents: 'none', userSelect: 'none' }}
                            >
                              NN
                            </text>
                          )}
                          {isUQ && (
                            <text
                              x={t.x + t.width - 36}
                              y={cy + COL_ROW_H / 2}
                              dominantBaseline="central"
                              textAnchor="end"
                              fontSize={8}
                              fill="#7E57C2"
                              fontWeight={700}
                              style={{ pointerEvents: 'none', userSelect: 'none' }}
                            >
                              UQ
                            </text>
                          )}

                          {/* 타입 */}
                          <text
                            x={t.x + t.width - 8}
                            y={cy + COL_ROW_H / 2}
                            dominantBaseline="central"
                            textAnchor="end"
                            fontSize={10}
                            fill="#999"
                            style={{ pointerEvents: 'none', userSelect: 'none' }}
                          >
                            {col.type}{col.length ? `(${col.length})` : ''}
                          </text>
                        </g>
                      );
                    })}

                    {/* 리사이즈 핸들 */}
                    <rect
                      x={t.x + t.width - 4}
                      y={t.y}
                      width={8}
                      height={h}
                      fill="transparent"
                      style={{ cursor: 'ew-resize' }}
                      onMouseDown={(e) => onResizeHandleDown(e as unknown as RME, t.id)}
                    />
                  </g>
                );
              })}
            </g>
          </S.SvgCanvas>

          {/* ─── 러버밴드 ───────────────── */}
          {rubberBand && (
            <S.SelectionBox
              style={{
                left: Math.min(rubberBand.sx, rubberBand.ex),
                top: Math.min(rubberBand.sy, rubberBand.ey) - (canvasRef.current?.getBoundingClientRect().top ?? 0),
                width: Math.abs(rubberBand.ex - rubberBand.sx),
                height: Math.abs(rubberBand.ey - rubberBand.sy),
              }}
            />
          )}

          {/* ─── 줌 컨트롤 ─────────────── */}
          <S.ZoomControls>
            <S.TBtn onClick={() => setZoom((z) => Math.max(0.1, z - 0.1))}><IcZoomOut size={14} /></S.TBtn>
            <S.ZoomText>{Math.round(zoom * 100)}%</S.ZoomText>
            <S.TBtn onClick={() => setZoom((z) => Math.min(4, z + 0.1))}><IcZoomIn size={14} /></S.TBtn>
            <S.TBtn onClick={fitToScreen} title="화면에 맞추기"><IcFitScreen size={14} /></S.TBtn>
            <S.TBtn onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} title="100% 리셋"><IcReset size={14} /></S.TBtn>
          </S.ZoomControls>

          {/* ─── 미니맵 ────────────────── */}
          {showMinimap && tables.length > 0 && (
            <S.MinimapWrap>
              <svg width="100%" height="100%" viewBox={(() => {
                const minX = Math.min(0, ...tables.map((t) => t.x)) - 20;
                const minY = Math.min(0, ...tables.map((t) => t.y)) - 20;
                const maxX = Math.max(100, ...tables.map((t) => t.x + t.width)) + 20;
                const maxY = Math.max(100, ...tables.map((t) => t.y + tableHeight(t))) + 20;
                return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
              })()}>
                {tables.map((t) => (
                  <rect
                    key={t.id}
                    x={t.x}
                    y={t.y}
                    width={t.width}
                    height={tableHeight(t)}
                    rx={2}
                    fill={selectedTableIds.includes(t.id) ? '#4B88CE' : (t.colorTag || '#ccc')}
                    opacity={0.6}
                  />
                ))}
                {relations.map((r) => {
                  const coords = relLineCoords(r, tables);
                  if (!coords) return null;
                  return (
                    <line
                      key={r.id}
                      x1={coords.x1}
                      y1={coords.y1}
                      x2={coords.x2}
                      y2={coords.y2}
                      stroke="#aaa"
                      strokeWidth={1}
                    />
                  );
                })}
              </svg>
            </S.MinimapWrap>
          )}

          {/* ─── 인라인 편집 ───────────── */}
          {editingLabel && (() => {
            const tbl = tables.find((t) => t.id === editingLabel.tableId);
            if (!tbl) return null;
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return null;
            return (
              <S.InlineInput
                style={{
                  left: rect.left + pan.x + tbl.x * zoom + 24,
                  top: rect.top + pan.y + tbl.y * zoom,
                  width: tbl.width * zoom - 30,
                  height: TABLE_HEADER_H * zoom,
                  fontSize: 13 * zoom,
                  position: 'fixed',
                }}
                value={editingLabel.value}
                onChange={(e) => setEditingLabel({ ...editingLabel, value: e.target.value })}
                onBlur={() => {
                  if (editingLabel.value.trim()) {
                    updateTable(editingLabel.tableId, { name: editingLabel.value.trim() });
                  }
                  setEditingLabel(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                  if (e.key === 'Escape') setEditingLabel(null);
                }}
                autoFocus
              />
            );
          })()}
        </S.CanvasWrap>

        {/* ─── 오른쪽 패널: 속성 편집 ─────────── */}
        <S.RightPanel $collapsed={rightCollapsed}>
          <S.PanelToggle onClick={() => setRightCollapsed(!rightCollapsed)}>
            {rightCollapsed ? <IcChevronLeft size={14} /> : <>속성 <IcChevronRight size={14} /></>}
          </S.PanelToggle>
          {!rightCollapsed && (
            <>
              <S.TabRow>
                <S.Tab $active={rightTab === 'table'} onClick={() => setRightTab('table')}>테이블</S.Tab>
                <S.Tab $active={rightTab === 'relation'} onClick={() => setRightTab('relation')}>릴레이션</S.Tab>
                <S.Tab $active={rightTab === 'canvas'} onClick={() => setRightTab('canvas')}>캔버스</S.Tab>
              </S.TabRow>
              <S.PanelContent>
                {/* ── 테이블 속성 ─────────── */}
                {rightTab === 'table' && selectedTables.length === 1 && (() => {
                  const t = selectedTables[0];
                  return (
                    <>
                      <S.PropGroup>
                        <S.PropLabel>테이블 이름</S.PropLabel>
                        <S.PropInput
                          value={t.name}
                          onChange={(e) => updateTable(t.id, { name: e.target.value })}
                        />
                      </S.PropGroup>

                      <S.PropGroup>
                        <S.PropLabel>코멘트</S.PropLabel>
                        <S.PropTextarea
                          value={t.comment || ''}
                          onChange={(e) => updateTable(t.id, { comment: e.target.value || null })}
                          placeholder="테이블 설명..."
                        />
                      </S.PropGroup>

                      <S.PropGroup>
                        <S.PropLabel>색상</S.PropLabel>
                        <S.ColorGrid>
                          {TABLE_COLORS.map((c) => (
                            <S.ColorDot
                              key={c}
                              $color={c}
                              $active={t.colorTag === c}
                              onClick={() => updateTable(t.id, { colorTag: c })}
                            />
                          ))}
                        </S.ColorGrid>
                      </S.PropGroup>

                      <S.PropGroup>
                        <S.PropRow>
                          <S.PropLabel style={{ flex: 1 }}>
                            컬럼 ({t.columns.length})
                          </S.PropLabel>
                          <S.TBtn onClick={() => addColumn(t.id)}><IcPlus size={12} /> 추가</S.TBtn>
                        </S.PropRow>

                        {t.columns.map((col, ci) => {
                          const isPK = col.constraints.includes('PRIMARY_KEY');
                          const isNN = col.constraints.includes('NOT_NULL');
                          const isUQ = col.constraints.includes('UNIQUE');
                          const isAI = col.constraints.includes('AUTO_INCREMENT');
                          const isFK = col.constraints.includes('FOREIGN_KEY');

                          return (
                            <S.ColumnEditorRow key={col.id}>
                              {/* 드래그 핸들 */}
                              <S.DragHandle
                                onMouseDown={() => {}}
                                title="드래그하여 순서 변경"
                              >
                                ⋮⋮
                              </S.DragHandle>

                              {/* 이름 */}
                              <S.ColInput
                                value={col.name}
                                onChange={(e) => updateColumn(t.id, col.id, { name: e.target.value })}
                                style={{ flex: 1, minWidth: 60 }}
                              />

                              {/* 타입 */}
                              <S.ColSelect
                                value={col.type}
                                onChange={(e) => updateColumn(t.id, col.id, { type: e.target.value as ColumnType })}
                              >
                                {COLUMN_TYPES.map((ct) => (
                                  <option key={ct} value={ct}>{ct}</option>
                                ))}
                              </S.ColSelect>

                              {/* 제약조건 뱃지 */}
                              <S.ColBadge
                                $active={isPK}
                                $color="#E2A032"
                                title="Primary Key"
                                onClick={() => toggleConstraint(t.id, col.id, 'PRIMARY_KEY')}
                              >
                                PK
                              </S.ColBadge>
                              <S.ColBadge
                                $active={isNN}
                                $color="#E23737"
                                title="Not Null"
                                onClick={() => toggleConstraint(t.id, col.id, 'NOT_NULL')}
                              >
                                NN
                              </S.ColBadge>
                              <S.ColBadge
                                $active={isUQ}
                                $color="#7E57C2"
                                title="Unique"
                                onClick={() => toggleConstraint(t.id, col.id, 'UNIQUE')}
                              >
                                UQ
                              </S.ColBadge>
                              <S.ColBadge
                                $active={isAI}
                                $color="#26A69A"
                                title="Auto Increment"
                                onClick={() => toggleConstraint(t.id, col.id, 'AUTO_INCREMENT')}
                              >
                                AI
                              </S.ColBadge>
                              <S.ColBadge
                                $active={isFK}
                                $color="#4B88CE"
                                title="Foreign Key"
                                onClick={() => toggleConstraint(t.id, col.id, 'FOREIGN_KEY')}
                              >
                                FK
                              </S.ColBadge>

                              {/* 연결 */}
                              <S.SmallIconBtn
                                title="릴레이션 시작"
                                onClick={() => {
                                  const pt = { x: t.x + t.width, y: t.y + TABLE_HEADER_H + ci * COL_ROW_H + COL_ROW_H / 2 };
                                  startConnect(t.id, col.id, pt.x, pt.y);
                                }}
                              >
                                <IcLink size={12} />
                              </S.SmallIconBtn>

                              {/* 순서 이동 */}
                              {ci > 0 && (
                                <S.SmallIconBtn
                                  title="위로"
                                  onClick={() => moveColumn(t.id, ci, ci - 1)}
                                >
                                  <IcChevronUp size={10} />
                                </S.SmallIconBtn>
                              )}
                              {ci < t.columns.length - 1 && (
                                <S.SmallIconBtn
                                  title="아래로"
                                  onClick={() => moveColumn(t.id, ci, ci + 1)}
                                >
                                  <IcChevronDown size={10} />
                                </S.SmallIconBtn>
                              )}

                              {/* 삭제 */}
                              <S.SmallIconBtn
                                title="컬럼 삭제"
                                onClick={() => deleteColumn(t.id, col.id)}
                              >
                                <IcTrash size={11} />
                              </S.SmallIconBtn>
                            </S.ColumnEditorRow>
                          );
                        })}
                      </S.PropGroup>

                      {/* 해당 테이블의 릴레이션 */}
                      <S.PropGroup>
                        <S.PropLabel>
                          릴레이션 ({relations.filter((r) => r.sourceTableId === t.id || r.targetTableId === t.id).length})
                        </S.PropLabel>
                        {relations
                          .filter((r) => r.sourceTableId === t.id || r.targetTableId === t.id)
                          .map((r) => {
                            const from = tables.find((tt) => tt.id === r.sourceTableId);
                            const to = tables.find((tt) => tt.id === r.targetTableId);
                            const fromCol = from?.columns.find((c) => c.id === r.sourceColumnId);
                            const toCol = to?.columns.find((c) => c.id === r.targetColumnId);
                            return (
                              <S.RelRow key={r.id}>
                                <span style={{ flex: 1, fontSize: 11 }}>
                                  {from?.name}.{fromCol?.name} → {to?.name}.{toCol?.name}
                                </span>
                                <S.RelBadge>{r.relationType}</S.RelBadge>
                                <S.SmallIconBtn onClick={() => deleteRelation(r.id)}>
                                  <IcTrash size={11} />
                                </S.SmallIconBtn>
                              </S.RelRow>
                            );
                          })}
                      </S.PropGroup>

                      <S.PropGroup>
                        <S.TBtn
                          $danger
                          onClick={() => deleteTable(t.id)}
                          style={{ width: '100%', justifyContent: 'center' }}
                        >
                          <IcTrash size={14} /> 테이블 삭제
                        </S.TBtn>
                      </S.PropGroup>
                    </>
                  );
                })()}

                {rightTab === 'table' && selectedTables.length === 0 && (
                  <S.PropGroup>
                    <S.PropLabel style={{ textAlign: 'center', padding: '40px 0' }}>
                      테이블을 선택하세요
                    </S.PropLabel>
                  </S.PropGroup>
                )}

                {rightTab === 'table' && selectedTables.length > 1 && (
                  <S.PropGroup>
                    <S.PropLabel>{selectedTables.length}개 테이블 선택됨</S.PropLabel>
                    <S.TBtn onClick={() => align('left')}><IcAlignLeft size={12} /> 왼쪽 정렬</S.TBtn>
                    <S.TBtn onClick={() => align('centerH')}><IcAlignCenterH size={12} /> 수평 중앙</S.TBtn>
                    <S.TBtn onClick={() => align('right')}><IcAlignRight size={12} /> 오른쪽 정렬</S.TBtn>
                    <S.TBtn onClick={() => distribute('h')}><IcDistributeH size={12} /> 가로 균등</S.TBtn>
                    <S.TBtn onClick={() => distribute('v')}><IcDistributeV size={12} /> 세로 균등</S.TBtn>
                    <S.TBtn $danger onClick={deleteSelected}><IcTrash size={12} /> 선택 삭제</S.TBtn>
                  </S.PropGroup>
                )}

                {/* ── 릴레이션 속성 ────────── */}
                {rightTab === 'relation' && selectedRel && (() => {
                  const from = tables.find((t) => t.id === selectedRel.sourceTableId);
                  const to = tables.find((t) => t.id === selectedRel.targetTableId);
                  const fromCol = from?.columns.find((c) => c.id === selectedRel.sourceColumnId);
                  const toCol = to?.columns.find((c) => c.id === selectedRel.targetColumnId);
                  return (
                    <>
                      <S.PropGroup>
                        <S.PropLabel>소스</S.PropLabel>
                        <S.PropInput value={`${from?.name}.${fromCol?.name}`} readOnly />
                      </S.PropGroup>
                      <S.PropGroup>
                        <S.PropLabel>타겟</S.PropLabel>
                        <S.PropInput value={`${to?.name}.${toCol?.name}`} readOnly />
                      </S.PropGroup>
                      <S.PropGroup>
                        <S.PropLabel>관계 타입</S.PropLabel>
                        <S.PropSelect
                          value={selectedRel.relationType}
                          onChange={(e) => updateRelation(selectedRel.id, { relationType: e.target.value as RelationType })}
                        >
                          {RELATION_TYPES.map((rt) => (
                            <option key={rt.value} value={rt.value}>{rt.label}</option>
                          ))}
                        </S.PropSelect>
                      </S.PropGroup>
                      <S.PropGroup>
                        <S.PropLabel>선 스타일</S.PropLabel>
                        <S.PropSelect
                          value={selectedRel.lineStyle || 'solid'}
                          onChange={(e) => updateRelation(selectedRel.id, { lineStyle: e.target.value as EditorRelation['lineStyle'] })}
                        >
                          <option value="solid">실선</option>
                          <option value="dashed">파선</option>
                          <option value="dotted">점선</option>
                        </S.PropSelect>
                      </S.PropGroup>
                      <S.PropGroup>
                        <S.TBtn
                          $danger
                          onClick={() => deleteRelation(selectedRel.id)}
                          style={{ width: '100%', justifyContent: 'center' }}
                        >
                          <IcTrash size={14} /> 릴레이션 삭제
                        </S.TBtn>
                      </S.PropGroup>
                    </>
                  );
                })()}

                {rightTab === 'relation' && !selectedRel && (
                  <S.PropGroup>
                    <S.PropLabel style={{ textAlign: 'center', padding: '40px 0' }}>
                      릴레이션을 선택하세요
                    </S.PropLabel>
                  </S.PropGroup>
                )}

                {/* ── 캔버스 설정 ─────────── */}
                {rightTab === 'canvas' && (
                  <>
                    <S.PropGroup>
                      <S.PropLabel>Dialect</S.PropLabel>
                      <S.PropSelect
                        value={dialect}
                        onChange={(e) => setDialect(e.target.value as SqlDialect)}
                      >
                        {DIALECT_OPTIONS.map((d) => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </S.PropSelect>
                    </S.PropGroup>
                    <S.PropGroup>
                      <S.PropRow>
                        <input
                          type="checkbox"
                          checked={showGrid}
                          onChange={(e) => setShowGrid(e.target.checked)}
                        />
                        <S.PropLabel>그리드 표시</S.PropLabel>
                      </S.PropRow>
                      <S.PropRow>
                        <input
                          type="checkbox"
                          checked={snapToGrid}
                          onChange={(e) => setSnapToGrid(e.target.checked)}
                        />
                        <S.PropLabel>그리드 스냅</S.PropLabel>
                      </S.PropRow>
                      <S.PropRow>
                        <input
                          type="checkbox"
                          checked={showMinimap}
                          onChange={(e) => setShowMinimap(e.target.checked)}
                        />
                        <S.PropLabel>미니맵</S.PropLabel>
                      </S.PropRow>
                    </S.PropGroup>
                    <S.PropGroup>
                      <S.PropLabel>통계</S.PropLabel>
                      <S.StatusText>테이블: {tables.length}개</S.StatusText>
                      <S.StatusText>컬럼: {tables.reduce((s, t) => s + t.columns.length, 0)}개</S.StatusText>
                      <S.StatusText>릴레이션: {relations.length}개</S.StatusText>
                    </S.PropGroup>
                  </>
                )}
              </S.PanelContent>
            </>
          )}
        </S.RightPanel>
      </S.Body>

      {/* ═══ 상태 바 ═════════════════════════════════════════ */}
      <S.StatusBar>
        <S.StatusText><IcMouse size={12} /> {tool === 'select' ? '선택' : tool === 'pan' ? '이동' : tool === 'connect' ? '연결' : '추가'}</S.StatusText>
        <S.StatusText>테이블 {tables.length} | 릴레이션 {relations.length}</S.StatusText>
        <S.StatusText>선택 {selectedTableIds.length}</S.StatusText>
        <div style={{ flex: 1 }} />
        <S.StatusText>{dialect}</S.StatusText>
        <S.StatusText>{Math.round(zoom * 100)}%</S.StatusText>
      </S.StatusBar>

      {/* ═══ 컨텍스트 메뉴 ═══════════════════════════════════ */}
      {ctxMenu && (
        <S.CtxMenu $x={ctxMenu.x} $y={ctxMenu.y} onClick={(e) => e.stopPropagation()}>
          {ctxMenu.tableId && (
            <>
              <S.CtxItem onClick={() => {
                const t = tables.find((tt) => tt.id === ctxMenu.tableId);
                if (t) setEditingLabel({ tableId: t.id, value: t.name });
                setCtxMenu(null);
              }}>
                <IcEdit size={14} /> 이름 편집 <S.CtxShortcut>더블클릭</S.CtxShortcut>
              </S.CtxItem>
              <S.CtxItem onClick={() => { addColumn(ctxMenu.tableId!); setCtxMenu(null); }}>
                <IcPlus size={14} /> 컬럼 추가
              </S.CtxItem>
              <S.CtxItem onClick={() => { toggleCollapse(ctxMenu.tableId!); setCtxMenu(null); }}>
                {tables.find((t) => t.id === ctxMenu.tableId)?.collapsed
                  ? <><IcExpand size={14} /> 펼치기</>
                  : <><IcCollapse size={14} /> 접기</>
                }
              </S.CtxItem>
              <S.CtxItem onClick={() => { copySelected(); setCtxMenu(null); }}>
                <IcCopy size={14} /> 복사 <S.CtxShortcut>⌘C</S.CtxShortcut>
              </S.CtxItem>
              <S.CtxItem onClick={() => { duplicate(); setCtxMenu(null); }}>
                <IcDuplicate size={14} /> 복제 <S.CtxShortcut>⌘D</S.CtxShortcut>
              </S.CtxItem>
              <S.CtxSep />
              <S.CtxItem $danger onClick={() => { deleteTable(ctxMenu.tableId!); setCtxMenu(null); }}>
                <IcTrash size={14} /> 삭제 <S.CtxShortcut>Del</S.CtxShortcut>
              </S.CtxItem>
            </>
          )}
          {ctxMenu.relId && (
            <>
              <S.CtxItem onClick={() => {
                setSelectedRelId(ctxMenu.relId!);
                setRightTab('relation');
                setCtxMenu(null);
              }}>
                <IcEdit size={14} /> 릴레이션 편집
              </S.CtxItem>
              <S.CtxSep />
              <S.CtxItem $danger onClick={() => { deleteRelation(ctxMenu.relId!); setCtxMenu(null); }}>
                <IcTrash size={14} /> 삭제
              </S.CtxItem>
            </>
          )}
          {!ctxMenu.tableId && !ctxMenu.relId && (
            <>
              <S.CtxItem onClick={() => {
                const pt = toCanvas(ctxMenu.x, ctxMenu.y);
                addTable(pt.x, pt.y);
                setCtxMenu(null);
              }}>
                <IcPlus size={14} /> 여기에 테이블 추가
              </S.CtxItem>
              <S.CtxItem onClick={() => { paste(); setCtxMenu(null); }}>
                <IcPaste size={14} /> 붙여넣기 <S.CtxShortcut>⌘V</S.CtxShortcut>
              </S.CtxItem>
              <S.CtxItem onClick={() => { selectAll(); setCtxMenu(null); }}>
                <IcSelectAll size={14} /> 전체 선택 <S.CtxShortcut>⌘A</S.CtxShortcut>
              </S.CtxItem>
              <S.CtxSep />
              <S.CtxItem onClick={() => { autoLayout(); setCtxMenu(null); }}>
                <IcAutoLayout size={14} /> 자동 배치
              </S.CtxItem>
              <S.CtxItem onClick={() => { fitToScreen(); setCtxMenu(null); }}>
                <IcFitScreen size={14} /> 화면에 맞추기
              </S.CtxItem>
            </>
          )}
        </S.CtxMenu>
      )}

      {/* ═══ DDL 모달 ════════════════════════════════════════ */}
      {showDDL && (
        <S.ModalOverlay onClick={() => setShowDDL(false)}>
          <S.ModalBox onClick={(e) => e.stopPropagation()}>
            <S.ModalTitle>DDL 내보내기</S.ModalTitle>
            <S.DDLTabs>
              {DIALECT_OPTIONS.map((d) => (
                <S.DDLTab
                  key={d.value}
                  $active={ddlDialect === d.value}
                  onClick={() => setDdlDialect(d.value)}
                >
                  {d.label}
                </S.DDLTab>
              ))}
            </S.DDLTabs>
            <S.DDLBlock>{ddlContent}</S.DDLBlock>
            <S.ModalActions>
              <S.TBtn onClick={() => {
                navigator.clipboard.writeText(ddlContent);
                toast.success('DDL이 클립보드에 복사되었습니다.');
              }}>
                <IcCopy size={14} /> 복사
              </S.TBtn>
              <S.TBtn onClick={() => {
                const blob = new Blob([ddlContent], { type: 'text/sql' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${schema?.title || 'schema'}_${ddlDialect.toLowerCase()}.sql`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success('.sql 파일 다운로드 완료');
              }}>
                <IcDownload size={14} /> .sql 다운로드
              </S.TBtn>
              <S.TBtn onClick={() => setShowDDL(false)}>닫기</S.TBtn>
            </S.ModalActions>
          </S.ModalBox>
        </S.ModalOverlay>
      )}
    </S.Root>
  );
}

export default SchemaEditor;
