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
import * as S from './DiagramEditor.styled';
import { getDiagram, updateDiagram } from '@/api/Project';
import { toast } from '@/store/toastStore';
import { useHistory } from './hooks/useHistory';
import {
  type DiagramNode,
  type DiagramEdge,
  type EditorData,
  type CanvasSettings,
  type ToolMode,
  type NodeShape,
  type EdgeLineStyle,
  type EdgePathType,
  type ArrowType,
  SHAPES,
  COLOR_PRESETS,
  DEFAULT_SETTINGS,
  makeNode,
  makeEdge,
  portPos,
  smartPorts,
  edgePath,
  snap,
  shapePath,
  dashArray,
} from './types';
import type { Diagram } from '@/types/project';
import {
  IcCursor, IcHand, IcLink,
  IcUndo, IcRedo,
  IcCopy, IcPaste, IcDuplicate, IcTrash,
  IcAlignLeft, IcAlignCenterH, IcAlignRight,
  IcAlignTop, IcAlignCenterV, IcAlignBottom,
  IcDistributeH, IcDistributeV,
  IcBringFront, IcSendBack,
  IcLock, IcUnlock,
  IcDownload, IcSave,
  IcZoomIn, IcZoomOut, IcFitScreen, IcReset,
  IcArrowLeft, IcMouse, IcEdit, IcSelectAll,
  IcChevronRight, IcChevronLeft,
  SHAPE_ICON_MAP,
} from './Icons';

/* ═══════════════════════════════════════════════════════════
   Diagram Editor — 풀스크린 다이어그램 에디터
   ═══════════════════════════════════════════════════════════ */

const EMPTY: EditorData = { nodes: [], edges: [] };

/* ─── 리사이즈 핸들 ──────────────────────────────────────── */
type HandleDir = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';
const HANDLES: HandleDir[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

function handleCursor(h: HandleDir) {
  const m: Record<HandleDir, string> = {
    nw: 'nwse-resize', n: 'ns-resize', ne: 'nesw-resize', e: 'ew-resize',
    se: 'nwse-resize', s: 'ns-resize', sw: 'nesw-resize', w: 'ew-resize',
  };
  return m[h];
}

function handlePos(h: HandleDir, n: DiagramNode) {
  const { x, y, width: w, height: ht } = n;
  const cx = x + w / 2;
  const cy = y + ht / 2;
  const m: Record<HandleDir, { hx: number; hy: number }> = {
    nw: { hx: x, hy: y }, n: { hx: cx, hy: y }, ne: { hx: x + w, hy: y },
    e: { hx: x + w, hy: cy }, se: { hx: x + w, hy: y + ht },
    s: { hx: cx, hy: y + ht }, sw: { hx: x, hy: y + ht }, w: { hx: x, hy: cy },
  };
  return m[h];
}

/* ─── 메인 컴포넌트 ──────────────────────────────────────── */
export default function DiagramEditor() {
  const { projectId, diagramId } = useParams<{ projectId: string; diagramId: string }>();
  const pid = Number(projectId);
  const did = Number(diagramId);
  const navigate = useNavigate();

  /* ── API 데이터 ── */
  const [diagram, setDiagram] = useState<Diagram | null>(null);
  const [loading, setLoading] = useState(true);

  /* ── 에디터 데이터 (undo/redo) ── */
  const { state: data, push, undo, redo, canUndo, canRedo, silentSet, reset } =
    useHistory<EditorData>(EMPTY);

  /* ── 캔버스 설정 ── */
  const [settings, setSettings] = useState<CanvasSettings>(DEFAULT_SETTINGS);

  /* ── 뷰포트 ── */
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  /* ── 도구 & 선택 ── */
  const [tool, setTool] = useState<ToolMode>('select');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedEdgeIds, setSelectedEdgeIds] = useState<Set<string>>(new Set());

  /* ── 인터랙션 상태 ── */
  const [dragging, setDragging] = useState<{
    ids: string[];
    startX: number;
    startY: number;
    origins: Map<string, { x: number; y: number }>;
  } | null>(null);

  const [resizing, setResizing] = useState<{
    id: string;
    handle: HandleDir;
    startX: number;
    startY: number;
    orig: { x: number; y: number; w: number; h: number };
  } | null>(null);

  const [connecting, setConnecting] = useState<{
    fromId: string;
    mx: number;
    my: number;
  } | null>(null);

  const [panning, setPanning] = useState<{ startX: number; startY: number; px: number; py: number } | null>(null);

  const [selBox, setSelBox] = useState<{
    x1: number; y1: number; x2: number; y2: number;
  } | null>(null);

  const [editingLabel, setEditingLabel] = useState<{
    id: string;
    value: string;
  } | null>(null);

  const [ctxMenu, setCtxMenu] = useState<{
    x: number; y: number; nodeId?: string; edgeId?: string;
  } | null>(null);

  /* ── 패널 ── */
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  /* ── 클립보드 ── */
  const clipboard = useRef<{ nodes: DiagramNode[]; edges: DiagramEdge[] } | null>(null);

  /* ── 자동저장 ── */
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [lastSaved, setLastSaved] = useState<string>('');

  /* ── 캔버스 ref ── */
  const canvasRef = useRef<HTMLDivElement>(null);

  /* ─────────────────────────────────────────────────────────
     데이터 로드
     ───────────────────────────────────────────────────────── */
  useEffect(() => {
    getDiagram(pid, did)
      .then((d) => {
        setDiagram(d);
        let parsed: EditorData = EMPTY;
        try {
          const raw = JSON.parse(d.data || '{}');
          if (raw.nodes) parsed = raw as EditorData;
        } catch { /* noop */ }
        reset(parsed);
      })
      .catch(() => toast.error('다이어그램을 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
  }, [pid, did]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─────────────────────────────────────────────────────────
     자동 저장
     ───────────────────────────────────────────────────────── */
  const scheduleAutoSave = useCallback(
    (d: EditorData) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        try {
          await updateDiagram(pid, did, { data: JSON.stringify(d) });
          setLastSaved(new Date().toLocaleTimeString('ko-KR'));
        } catch { /* ignore */ }
      }, 2000);
    },
    [pid, did],
  );

  // data 변경 시 자동저장
  useEffect(() => {
    if (!loading && diagram) scheduleAutoSave(data);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─── 수동 저장 ── */
  const handleSave = async () => {
    try {
      await updateDiagram(pid, did, { data: JSON.stringify(data) });
      setLastSaved(new Date().toLocaleTimeString('ko-KR'));
      toast.success('저장되었습니다.');
    } catch {
      toast.error('저장에 실패했습니다.');
    }
  };

  /* ─────────────────────────────────────────────────────────
     헬퍼
     ───────────────────────────────────────────────────────── */
  /** 마우스 좌표 → 캔버스 좌표 */
  const toCanvas = useCallback(
    (clientX: number, clientY: number) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return { cx: 0, cy: 0 };
      return {
        cx: (clientX - rect.left - pan.x) / zoom,
        cy: (clientY - rect.top - pan.y) / zoom,
      };
    },
    [zoom, pan],
  );

  const selectedNodes = useMemo(
    () => data.nodes.filter((n) => selectedIds.has(n.id)),
    [data.nodes, selectedIds],
  );

  const selectedEdges = useMemo(
    () => data.edges.filter((e) => selectedEdgeIds.has(e.id)),
    [data.edges, selectedEdgeIds],
  );

  /** 가장 높은 zIndex */
  const maxZ = useMemo(
    () => Math.max(0, ...data.nodes.map((n) => n.zIndex)),
    [data.nodes],
  );

  /* ─────────────────────────────────────────────────────────
     노드 추가
     ───────────────────────────────────────────────────────── */
  const addNode = useCallback(
    (shape: NodeShape) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      const cx = rect ? (rect.width / 2 - pan.x) / zoom : 300;
      const cy = rect ? (rect.height / 2 - pan.y) / zoom : 200;
      const node = makeNode(shape, cx - 70, cy - 30);
      node.zIndex = maxZ + 1;
      if (settings.snapToGrid) {
        node.x = snap(node.x, settings.gridSize);
        node.y = snap(node.y, settings.gridSize);
      }
      const next = { ...data, nodes: [...data.nodes, node] };
      push(next);
      setSelectedIds(new Set([node.id]));
      setSelectedEdgeIds(new Set());
    },
    [data, push, zoom, pan, maxZ, settings],
  );

  /* ─────────────────────────────────────────────────────────
     노드 업데이트 (단일 프로퍼티)
     ───────────────────────────────────────────────────────── */
  const updateNode = useCallback(
    (id: string, patch: Partial<DiagramNode>) => {
      const next = {
        ...data,
        nodes: data.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
      };
      push(next);
    },
    [data, push],
  );

  const updateEdge = useCallback(
    (id: string, patch: Partial<DiagramEdge>) => {
      const next = {
        ...data,
        edges: data.edges.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      };
      push(next);
    },
    [data, push],
  );

  /* ─────────────────────────────────────────────────────────
     삭제
     ───────────────────────────────────────────────────────── */
  const deleteSelected = useCallback(() => {
    if (selectedIds.size === 0 && selectedEdgeIds.size === 0) return;
    const nids = selectedIds;
    const eids = selectedEdgeIds;
    const next: EditorData = {
      nodes: data.nodes.filter((n) => !nids.has(n.id)),
      edges: data.edges.filter(
        (e) => !eids.has(e.id) && !nids.has(e.from) && !nids.has(e.to),
      ),
    };
    push(next);
    setSelectedIds(new Set());
    setSelectedEdgeIds(new Set());
  }, [data, push, selectedIds, selectedEdgeIds]);

  /* ─────────────────────────────────────────────────────────
     복사 / 붙여넣기 / 복제
     ───────────────────────────────────────────────────────── */
  const copySelected = useCallback(() => {
    const nids = selectedIds;
    const nodes = data.nodes.filter((n) => nids.has(n.id));
    const edges = data.edges.filter((e) => nids.has(e.from) && nids.has(e.to));
    clipboard.current = { nodes, edges };
  }, [data, selectedIds]);

  const paste = useCallback(() => {
    const clip = clipboard.current;
    if (!clip || clip.nodes.length === 0) return;
    const offset = 40;
    const idMap = new Map<string, string>();
    const newNodes = clip.nodes.map((n) => {
      const nn = { ...n, id: `n${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, x: n.x + offset, y: n.y + offset, zIndex: maxZ + 1 };
      idMap.set(n.id, nn.id);
      return nn;
    });
    const newEdges = clip.edges.map((e) => ({
      ...e,
      id: `e${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      from: idMap.get(e.from) || e.from,
      to: idMap.get(e.to) || e.to,
    }));
    const next = { nodes: [...data.nodes, ...newNodes], edges: [...data.edges, ...newEdges] };
    push(next);
    setSelectedIds(new Set(newNodes.map((n) => n.id)));
    setSelectedEdgeIds(new Set());
  }, [data, push, maxZ]);

  const duplicate = useCallback(() => {
    copySelected();
    setTimeout(paste, 0);
  }, [copySelected, paste]);

  /* ─────────────────────────────────────────────────────────
     전체 선택
     ───────────────────────────────────────────────────────── */
  const selectAll = useCallback(() => {
    setSelectedIds(new Set(data.nodes.map((n) => n.id)));
    setSelectedEdgeIds(new Set(data.edges.map((e) => e.id)));
  }, [data]);

  /* ─────────────────────────────────────────────────────────
     정렬
     ───────────────────────────────────────────────────────── */
  const align = useCallback(
    (dir: 'left' | 'centerH' | 'right' | 'top' | 'centerV' | 'bottom') => {
      if (selectedNodes.length < 2) return;
      const ns = selectedNodes;
      let ref: number;
      switch (dir) {
        case 'left':    ref = Math.min(...ns.map((n) => n.x)); break;
        case 'right':   ref = Math.max(...ns.map((n) => n.x + n.width)); break;
        case 'centerH': ref = ns.reduce((s, n) => s + n.x + n.width / 2, 0) / ns.length; break;
        case 'top':     ref = Math.min(...ns.map((n) => n.y)); break;
        case 'bottom':  ref = Math.max(...ns.map((n) => n.y + n.height)); break;
        case 'centerV': ref = ns.reduce((s, n) => s + n.y + n.height / 2, 0) / ns.length; break;
      }
      const ids = new Set(ns.map((n) => n.id));
      const next = {
        ...data,
        nodes: data.nodes.map((n) => {
          if (!ids.has(n.id)) return n;
          switch (dir) {
            case 'left':    return { ...n, x: ref };
            case 'right':   return { ...n, x: ref - n.width };
            case 'centerH': return { ...n, x: ref - n.width / 2 };
            case 'top':     return { ...n, y: ref };
            case 'bottom':  return { ...n, y: ref - n.height };
            case 'centerV': return { ...n, y: ref - n.height / 2 };
          }
        }),
      };
      push(next);
    },
    [data, push, selectedNodes],
  );

  /* ─── 분배 ────────────────────────────────────────────── */
  const distribute = useCallback(
    (axis: 'h' | 'v') => {
      if (selectedNodes.length < 3) return;
      const ns = [...selectedNodes].sort((a, b) =>
        axis === 'h' ? a.x - b.x : a.y - b.y,
      );
      const first = ns[0];
      const last = ns[ns.length - 1];
      const total = axis === 'h'
        ? (last.x + last.width) - first.x
        : (last.y + last.height) - first.y;
      const sumSize = ns.reduce((s, n) => s + (axis === 'h' ? n.width : n.height), 0);
      const gap = (total - sumSize) / (ns.length - 1);

      let pos = axis === 'h' ? first.x : first.y;
      const updates = new Map<string, number>();
      ns.forEach((n) => {
        updates.set(n.id, pos);
        pos += (axis === 'h' ? n.width : n.height) + gap;
      });

      const ids = new Set(ns.map((n) => n.id));
      const next = {
        ...data,
        nodes: data.nodes.map((n) => {
          if (!ids.has(n.id)) return n;
          return axis === 'h'
            ? { ...n, x: updates.get(n.id) ?? n.x }
            : { ...n, y: updates.get(n.id) ?? n.y };
        }),
      };
      push(next);
    },
    [data, push, selectedNodes],
  );

  /* ─── Z-order ─────────────────────────────────────────── */
  const bringToFront = useCallback(() => {
    if (selectedIds.size === 0) return;
    let z = maxZ;
    const next = {
      ...data,
      nodes: data.nodes.map((n) =>
        selectedIds.has(n.id) ? { ...n, zIndex: ++z } : n,
      ),
    };
    push(next);
  }, [data, push, selectedIds, maxZ]);

  const sendToBack = useCallback(() => {
    if (selectedIds.size === 0) return;
    const minZ = Math.min(0, ...data.nodes.map((n) => n.zIndex));
    let z = minZ - selectedIds.size;
    const next = {
      ...data,
      nodes: data.nodes.map((n) =>
        selectedIds.has(n.id) ? { ...n, zIndex: ++z } : n,
      ),
    };
    push(next);
  }, [data, push, selectedIds]);

  /* ─── 잠금 토글 ──────────────────────────────────────── */
  const toggleLock = useCallback(() => {
    if (selectedIds.size === 0) return;
    const anyLocked = selectedNodes.some((n) => n.locked);
    const next = {
      ...data,
      nodes: data.nodes.map((n) =>
        selectedIds.has(n.id) ? { ...n, locked: !anyLocked } : n,
      ),
    };
    push(next);
  }, [data, push, selectedIds, selectedNodes]);

  /* ─────────────────────────────────────────────────────────
     마우스 핸들러 — 캔버스
     ───────────────────────────────────────────────────────── */
  const handleCanvasMouseDown = useCallback(
    (e: RME<HTMLDivElement>) => {
      if (e.button === 2) return; // right-click → ctxMenu
      setCtxMenu(null);

      // Middle-click or pan tool → start pan
      if (e.button === 1 || tool === 'pan') {
        setPanning({ startX: e.clientX, startY: e.clientY, px: pan.x, py: pan.y });
        return;
      }

      // Selection box (click on empty space)
      if (tool === 'select') {
        const { cx, cy } = toCanvas(e.clientX, e.clientY);
        setSelBox({ x1: cx, y1: cy, x2: cx, y2: cy });
        if (!e.shiftKey) {
          setSelectedIds(new Set());
          setSelectedEdgeIds(new Set());
        }
      }
    },
    [tool, pan, toCanvas],
  );

  const handleCanvasMouseMove = useCallback(
    (e: RME<HTMLDivElement>) => {
      // Panning
      if (panning) {
        setPan({
          x: panning.px + (e.clientX - panning.startX),
          y: panning.py + (e.clientY - panning.startY),
        });
        return;
      }

      // Selection box
      if (selBox) {
        const { cx, cy } = toCanvas(e.clientX, e.clientY);
        setSelBox((b) => (b ? { ...b, x2: cx, y2: cy } : null));
        return;
      }

      // Dragging nodes
      if (dragging) {
        const dx = (e.clientX - dragging.startX) / zoom;
        const dy = (e.clientY - dragging.startY) / zoom;
        const next = {
          ...data,
          nodes: data.nodes.map((n) => {
            const orig = dragging.origins.get(n.id);
            if (!orig || n.locked) return n;
            let nx = orig.x + dx;
            let ny = orig.y + dy;
            if (settings.snapToGrid) {
              nx = snap(nx, settings.gridSize);
              ny = snap(ny, settings.gridSize);
            }
            return { ...n, x: nx, y: ny };
          }),
        };
        silentSet(next);
        return;
      }

      // Resizing
      if (resizing) {
        const dx = (e.clientX - resizing.startX) / zoom;
        const dy = (e.clientY - resizing.startY) / zoom;
        const { x, y, w, h } = resizing.orig;
        let nx = x, ny = y, nw = w, nh = h;
        const hd = resizing.handle;
        if (hd.includes('e')) nw = Math.max(30, w + dx);
        if (hd.includes('w')) { nw = Math.max(30, w - dx); nx = x + (w - nw); }
        if (hd.includes('s')) nh = Math.max(20, h + dy);
        if (hd.includes('n')) { nh = Math.max(20, h - dy); ny = y + (h - nh); }
        if (settings.snapToGrid) {
          nx = snap(nx, settings.gridSize);
          ny = snap(ny, settings.gridSize);
          nw = snap(nw, settings.gridSize) || settings.gridSize;
          nh = snap(nh, settings.gridSize) || settings.gridSize;
        }
        const next = {
          ...data,
          nodes: data.nodes.map((n) =>
            n.id === resizing.id ? { ...n, x: nx, y: ny, width: nw, height: nh } : n,
          ),
        };
        silentSet(next);
        return;
      }

      // Connecting
      if (connecting) {
        const { cx, cy } = toCanvas(e.clientX, e.clientY);
        setConnecting((c) => (c ? { ...c, mx: cx, my: cy } : null));
        return;
      }
    },
    [panning, selBox, dragging, resizing, connecting, data, zoom, settings, toCanvas, silentSet],
  );

  const handleCanvasMouseUp = useCallback(
    (e: RME<HTMLDivElement>) => {
      // End panning
      if (panning) { setPanning(null); return; }

      // End selection box
      if (selBox) {
        const x1 = Math.min(selBox.x1, selBox.x2);
        const y1 = Math.min(selBox.y1, selBox.y2);
        const x2 = Math.max(selBox.x1, selBox.x2);
        const y2 = Math.max(selBox.y1, selBox.y2);
        if (Math.abs(x2 - x1) > 5 || Math.abs(y2 - y1) > 5) {
          const hit = data.nodes.filter(
            (n) => n.x + n.width > x1 && n.x < x2 && n.y + n.height > y1 && n.y < y2,
          );
          setSelectedIds((prev) => {
            const next = new Set(prev);
            hit.forEach((n) => next.add(n.id));
            return next;
          });
        }
        setSelBox(null);
        return;
      }

      // End dragging → push to history
      if (dragging) {
        push(data);
        setDragging(null);
        return;
      }

      // End resizing → push
      if (resizing) {
        push(data);
        setResizing(null);
        return;
      }

      // End connecting
      if (connecting) {
        // Find node under cursor
        const { cx, cy } = toCanvas(e.clientX, e.clientY);
        const target = [...data.nodes].reverse().find(
          (n) => cx >= n.x && cx <= n.x + n.width && cy >= n.y && cy <= n.y + n.height,
        );
        if (target && target.id !== connecting.fromId) {
          const edge = makeEdge(connecting.fromId, target.id);
          push({ ...data, edges: [...data.edges, edge] });
        }
        setConnecting(null);
      }
    },
    [panning, selBox, dragging, resizing, connecting, data, push, toCanvas],
  );

  /* ─── 마우스 휠 (줌) ─────────────────────────────────── */
  const handleWheel = useCallback(
    (e: RWE<HTMLDivElement>) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.92 : 1.08;
      const newZoom = Math.min(4, Math.max(0.1, zoom * factor));
      // zoom towards cursor
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        setPan({
          x: mx - (mx - pan.x) * (newZoom / zoom),
          y: my - (my - pan.y) * (newZoom / zoom),
        });
      }
      setZoom(newZoom);
    },
    [zoom, pan],
  );

  /* ─── 노드 클릭 / 드래그 시작 ───────────────────────── */
  const handleNodeMouseDown = useCallback(
    (e: RME<SVGElement>, nodeId: string) => {
      e.stopPropagation();
      setCtxMenu(null);

      const node = data.nodes.find((n) => n.id === nodeId);
      if (!node) return;

      // Connect mode
      if (tool === 'connect') {
        const { cx, cy } = toCanvas(e.clientX, e.clientY);
        setConnecting({ fromId: nodeId, mx: cx, my: cy });
        return;
      }

      // Select
      if (e.shiftKey) {
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.has(nodeId) ? next.delete(nodeId) : next.add(nodeId);
          return next;
        });
      } else if (!selectedIds.has(nodeId)) {
        setSelectedIds(new Set([nodeId]));
        setSelectedEdgeIds(new Set());
      }

      // Start drag
      if (!node.locked) {
        const ids = selectedIds.has(nodeId) ? [...selectedIds] : [nodeId];
        const origins = new Map<string, { x: number; y: number }>();
        ids.forEach((id) => {
          const n = data.nodes.find((nn) => nn.id === id);
          if (n && !n.locked) origins.set(id, { x: n.x, y: n.y });
        });
        setDragging({ ids, startX: e.clientX, startY: e.clientY, origins });
      }
    },
    [data, tool, selectedIds, toCanvas],
  );

  /* ─── 더블클릭 → 라벨 편집 ──────────────────────────── */
  const handleNodeDblClick = useCallback(
    (e: RME<SVGElement>, nodeId: string) => {
      e.stopPropagation();
      const node = data.nodes.find((n) => n.id === nodeId);
      if (!node) return;
      setEditingLabel({ id: nodeId, value: node.label });
    },
    [data],
  );

  const commitLabel = useCallback(() => {
    if (!editingLabel) return;
    updateNode(editingLabel.id, { label: editingLabel.value });
    setEditingLabel(null);
  }, [editingLabel, updateNode]);

  /* ─── 리사이즈 핸들 마우스다운 ──────────────────────── */
  const handleResizeDown = useCallback(
    (e: RME<SVGRectElement>, nodeId: string, handle: HandleDir) => {
      e.stopPropagation();
      const node = data.nodes.find((n) => n.id === nodeId);
      if (!node || node.locked) return;
      setResizing({
        id: nodeId,
        handle,
        startX: e.clientX,
        startY: e.clientY,
        orig: { x: node.x, y: node.y, w: node.width, h: node.height },
      });
    },
    [data],
  );

  /* ─── 엣지 클릭 ─────────────────────────────────────── */
  const handleEdgeClick = useCallback(
    (e: RME<SVGElement>, edgeId: string) => {
      e.stopPropagation();
      setCtxMenu(null);
      if (e.shiftKey) {
        setSelectedEdgeIds((prev) => {
          const next = new Set(prev);
          next.has(edgeId) ? next.delete(edgeId) : next.add(edgeId);
          return next;
        });
      } else {
        setSelectedEdgeIds(new Set([edgeId]));
        setSelectedIds(new Set());
      }
    },
    [],
  );

  /* ─── 컨텍스트 메뉴 ─────────────────────────────────── */
  const handleContextMenu = useCallback(
    (e: RME<HTMLDivElement>) => {
      e.preventDefault();
      const { cx, cy } = toCanvas(e.clientX, e.clientY);
      // Find node at position
      const node = [...data.nodes].reverse().find(
        (n) => cx >= n.x && cx <= n.x + n.width && cy >= n.y && cy <= n.y + n.height,
      );
      // Find edge nearby
      setCtxMenu({
        x: e.clientX,
        y: e.clientY,
        nodeId: node?.id,
      });
      if (node && !selectedIds.has(node.id)) {
        setSelectedIds(new Set([node.id]));
        setSelectedEdgeIds(new Set());
      }
    },
    [data, toCanvas, selectedIds],
  );

  /* ─────────────────────────────────────────────────────────
     키보드 단축키
     ───────────────────────────────────────────────────────── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // 라벨 편집 중에는 무시
      if (editingLabel) return;
      const isMeta = e.metaKey || e.ctrlKey;

      if (isMeta && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if (isMeta && e.key === 'z' && e.shiftKey) { e.preventDefault(); redo(); }
      if (isMeta && e.key === 'y') { e.preventDefault(); redo(); }
      if (isMeta && e.key === 'c') { e.preventDefault(); copySelected(); }
      if (isMeta && e.key === 'v') { e.preventDefault(); paste(); }
      if (isMeta && e.key === 'd') { e.preventDefault(); duplicate(); }
      if (isMeta && e.key === 'a') { e.preventDefault(); selectAll(); }
      if (isMeta && e.key === 's') { e.preventDefault(); handleSave(); }
      if (e.key === 'Delete' || e.key === 'Backspace') { deleteSelected(); }
      if (e.key === 'Escape') {
        setSelectedIds(new Set());
        setSelectedEdgeIds(new Set());
        setConnecting(null);
        setCtxMenu(null);
        setTool('select');
      }
      if (e.key === 'v' || e.key === 'V') { if (!isMeta) setTool('select'); }
      if (e.key === 'h' || e.key === 'H') { setTool('pan'); }
      if (e.key === 'c' || e.key === 'C') { if (!isMeta) setTool('connect'); }
      if (e.key === '=' || e.key === '+') { setZoom((z) => Math.min(4, z + 0.1)); }
      if (e.key === '-') { setZoom((z) => Math.max(0.1, z - 0.1)); }
      if (e.key === '0') {
        setZoom(1);
        setPan({ x: 0, y: 0 });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [editingLabel, undo, redo, copySelected, paste, duplicate, selectAll, deleteSelected]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─────────────────────────────────────────────────────────
     Fit to screen
     ───────────────────────────────────────────────────────── */
  const fitToScreen = useCallback(() => {
    if (data.nodes.length === 0) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const minX = Math.min(...data.nodes.map((n) => n.x));
    const minY = Math.min(...data.nodes.map((n) => n.y));
    const maxX = Math.max(...data.nodes.map((n) => n.x + n.width));
    const maxY = Math.max(...data.nodes.map((n) => n.y + n.height));
    const w = maxX - minX + 80;
    const h = maxY - minY + 80;
    const zx = rect.width / w;
    const zy = rect.height / h;
    const z = Math.min(zx, zy, 2);
    setZoom(z);
    setPan({
      x: (rect.width - w * z) / 2 - minX * z + 40 * z,
      y: (rect.height - h * z) / 2 - minY * z + 40 * z,
    });
  }, [data]);

  /* ─────────────────────────────────────────────────────────
     Export SVG
     ───────────────────────────────────────────────────────── */
  const exportSVG = useCallback(() => {
    const svgEl = canvasRef.current?.querySelector('svg');
    if (!svgEl) return;
    const clone = svgEl.cloneNode(true) as SVGSVGElement;
    const blob = new Blob([clone.outerHTML], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${diagram?.title || 'diagram'}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, [diagram]);

  /* ─────────────────────────────────────────────────────────
     렌더: SVG 도형
     ───────────────────────────────────────────────────────── */
  const renderShape = (n: DiagramNode) => {
    const common = {
      fill: n.fillColor + '22',
      stroke: selectedIds.has(n.id) ? n.fillColor : n.borderColor,
      strokeWidth: selectedIds.has(n.id) ? 2.5 : n.borderWidth,
      opacity: n.opacity,
    };

    switch (n.shape) {
      case 'rounded':
        return <rect x={n.x} y={n.y} width={n.width} height={n.height} rx={12} ry={12} {...common} />;
      case 'circle':
        return (
          <ellipse
            cx={n.x + n.width / 2}
            cy={n.y + n.height / 2}
            rx={Math.min(n.width, n.height) / 2}
            ry={Math.min(n.width, n.height) / 2}
            {...common}
          />
        );
      case 'ellipse':
        return (
          <ellipse
            cx={n.x + n.width / 2}
            cy={n.y + n.height / 2}
            rx={n.width / 2}
            ry={n.height / 2}
            {...common}
          />
        );
      case 'database': {
        const ry = n.height * 0.12;
        return (
          <g>
            <path
              d={`M${n.x},${n.y + ry} L${n.x},${n.y + n.height - ry} A${n.width / 2},${ry} 0 0 0 ${n.x + n.width},${n.y + n.height - ry} L${n.x + n.width},${n.y + ry}`}
              {...common}
              fill={n.fillColor + '22'}
            />
            <ellipse
              cx={n.x + n.width / 2}
              cy={n.y + ry}
              rx={n.width / 2}
              ry={ry}
              {...common}
            />
            <ellipse
              cx={n.x + n.width / 2}
              cy={n.y + n.height - ry}
              rx={n.width / 2}
              ry={ry}
              {...common}
              fill="none"
            />
          </g>
        );
      }
      default: {
        const d = shapePath(n.shape, n.x, n.y, n.width, n.height);
        if (d) return <path d={d} {...common} />;
        return <rect x={n.x} y={n.y} width={n.width} height={n.height} {...common} />;
      }
    }
  };

  /* ─────────────────────────────────────────────────────────
     렌더: 포트 표시 (호버/선택 시)
     ───────────────────────────────────────────────────────── */
  const renderPorts = (n: DiagramNode) => {
    if (!selectedIds.has(n.id) && tool !== 'connect') return null;
    const ports: Array<{ dir: 'top' | 'right' | 'bottom' | 'left'; x: number; y: number }> = [
      { dir: 'top', ...portPos(n, 'top') },
      { dir: 'right', ...portPos(n, 'right') },
      { dir: 'bottom', ...portPos(n, 'bottom') },
      { dir: 'left', ...portPos(n, 'left') },
    ];
    return ports.map((p) => (
      <circle
        key={p.dir}
        cx={p.x}
        cy={p.y}
        r={4}
        fill="#fff"
        stroke={tool === 'connect' ? '#4B88CE' : '#999'}
        strokeWidth={1.5}
        style={{ cursor: 'crosshair' }}
      />
    ));
  };

  /* ─────────────────────────────────────────────────────────
     렌더: 리사이즈 핸들
     ───────────────────────────────────────────────────────── */
  const renderHandles = (n: DiagramNode) => {
    if (!selectedIds.has(n.id) || n.locked || selectedIds.size > 1) return null;
    return HANDLES.map((h) => {
      const { hx, hy } = handlePos(h, n);
      return (
        <rect
          key={h}
          x={hx - 4}
          y={hy - 4}
          width={8}
          height={8}
          fill="#fff"
          stroke="#4B88CE"
          strokeWidth={1.5}
          rx={1.5}
          style={{ cursor: handleCursor(h) }}
          onMouseDown={(e) => handleResizeDown(e, n.id, h)}
        />
      );
    });
  };

  /* ─────────────────────────────────────────────────────────
     렌더: 엣지
     ───────────────────────────────────────────────────────── */
  const renderEdge = (edge: DiagramEdge) => {
    const fromNode = data.nodes.find((n) => n.id === edge.from);
    const toNode = data.nodes.find((n) => n.id === edge.to);
    if (!fromNode || !toNode) return null;

    const { fp, tp } = smartPorts(fromNode, toNode);
    const p1 = portPos(fromNode, fp);
    const p2 = portPos(toNode, tp);
    const d = edgePath(p1.x, p1.y, p2.x, p2.y, edge.pathType);
    const isSelected = selectedEdgeIds.has(edge.id);

    const startMarkerId = `marker-start-${edge.id}`;
    const endMarkerId = `marker-end-${edge.id}`;

    return (
      <g key={edge.id}>
        {/* 마커 정의 */}
        <defs>
          {edge.endArrow === 'arrow' && (
            <marker id={endMarkerId} markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill={isSelected ? '#4B88CE' : edge.color} />
            </marker>
          )}
          {edge.endArrow === 'diamond' && (
            <marker id={endMarkerId} markerWidth="12" markerHeight="8" refX="12" refY="4" orient="auto">
              <polygon points="0 4, 6 0, 12 4, 6 8" fill={isSelected ? '#4B88CE' : edge.color} />
            </marker>
          )}
          {edge.endArrow === 'circle' && (
            <marker id={endMarkerId} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <circle cx="4" cy="4" r="3" fill={isSelected ? '#4B88CE' : edge.color} />
            </marker>
          )}
          {edge.startArrow === 'arrow' && (
            <marker id={startMarkerId} markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="10 0, 0 3.5, 10 7" fill={isSelected ? '#4B88CE' : edge.color} />
            </marker>
          )}
          {edge.startArrow === 'diamond' && (
            <marker id={startMarkerId} markerWidth="12" markerHeight="8" refX="0" refY="4" orient="auto">
              <polygon points="0 4, 6 0, 12 4, 6 8" fill={isSelected ? '#4B88CE' : edge.color} />
            </marker>
          )}
          {edge.startArrow === 'circle' && (
            <marker id={startMarkerId} markerWidth="8" markerHeight="8" refX="2" refY="4" orient="auto">
              <circle cx="4" cy="4" r="3" fill={isSelected ? '#4B88CE' : edge.color} />
            </marker>
          )}
        </defs>

        {/* 실제 엣지 */}
        <path
          d={d}
          fill="none"
          stroke={isSelected ? '#4B88CE' : edge.color}
          strokeWidth={isSelected ? edge.width + 1 : edge.width}
          strokeDasharray={dashArray(edge.lineStyle)}
          markerEnd={edge.endArrow !== 'none' ? `url(#${endMarkerId})` : undefined}
          markerStart={edge.startArrow !== 'none' ? `url(#${startMarkerId})` : undefined}
        />
        {/* 히트 영역 */}
        <path
          d={d}
          fill="none"
          stroke="transparent"
          strokeWidth={14}
          style={{ cursor: 'pointer' }}
          onClick={(e) => handleEdgeClick(e, edge.id)}
          onDoubleClick={(e) => {
            e.stopPropagation();
            const label = prompt('엣지 라벨:', edge.label);
            if (label !== null) updateEdge(edge.id, { label });
          }}
        />
        {/* 엣지 라벨 */}
        {edge.label && (
          <text
            x={(p1.x + p2.x) / 2}
            y={(p1.y + p2.y) / 2 - 8}
            textAnchor="middle"
            fontSize={11}
            fill={edge.color}
            style={{ pointerEvents: 'none' }}
          >
            {edge.label}
          </text>
        )}
      </g>
    );
  };

  /* ─────────────────────────────────────────────────────────
     렌더: 그리드
     ───────────────────────────────────────────────────────── */
  const renderGrid = () => {
    if (!settings.showGrid) return null;
    const g = settings.gridSize;
    const patternId = 'editor-grid';

    if (settings.gridType === 'dots') {
      return (
        <defs>
          <pattern id={patternId} width={g} height={g} patternUnits="userSpaceOnUse">
            <circle cx={g / 2} cy={g / 2} r={0.8} fill="#ccc" />
          </pattern>
          <rect x={-10000} y={-10000} width={20000} height={20000} fill={`url(#${patternId})`} />
        </defs>
      );
    }
    return (
      <defs>
        <pattern id={patternId} width={g} height={g} patternUnits="userSpaceOnUse">
          <path d={`M ${g} 0 L 0 0 0 ${g}`} fill="none" stroke="#e0e0e0" strokeWidth={0.5} />
        </pattern>
        <rect x={-10000} y={-10000} width={20000} height={20000} fill={`url(#${patternId})`} />
      </defs>
    );
  };

  /* ─────────────────────────────────────────────────────────
     렌더: 미니맵
     ───────────────────────────────────────────────────────── */
  const renderMinimap = () => {
    if (data.nodes.length === 0) return null;
    const minX = Math.min(...data.nodes.map((n) => n.x)) - 20;
    const minY = Math.min(...data.nodes.map((n) => n.y)) - 20;
    const maxX = Math.max(...data.nodes.map((n) => n.x + n.width)) + 20;
    const maxY = Math.max(...data.nodes.map((n) => n.y + n.height)) + 20;
    const vw = maxX - minX || 1;
    const vh = maxY - minY || 1;

    // viewport in canvas coords
    const rect = canvasRef.current?.getBoundingClientRect();
    const cw = rect ? rect.width : 800;
    const ch = rect ? rect.height : 600;
    const vpX = -pan.x / zoom;
    const vpY = -pan.y / zoom;
    const vpW = cw / zoom;
    const vpH = ch / zoom;

    return (
      <S.MinimapWrap onClick={(e) => {
        const mr = e.currentTarget.getBoundingClientRect();
        const rx = (e.clientX - mr.left) / mr.width;
        const ry = (e.clientY - mr.top) / mr.height;
        const targetX = minX + vw * rx;
        const targetY = minY + vh * ry;
        setPan({ x: -targetX * zoom + cw / 2, y: -targetY * zoom + ch / 2 });
      }}>
        <svg width="100%" height="100%" viewBox={`${minX} ${minY} ${vw} ${vh}`} preserveAspectRatio="xMidYMid meet">
          <rect x={minX} y={minY} width={vw} height={vh} fill="#f8f9fa" />
          {data.nodes.map((n) => (
            <rect
              key={n.id}
              x={n.x}
              y={n.y}
              width={n.width}
              height={n.height}
              fill={n.fillColor + '44'}
              stroke={n.fillColor}
              strokeWidth={vw / 120}
              rx={2}
            />
          ))}
          {data.edges.map((edge) => {
            const fn = data.nodes.find((n) => n.id === edge.from);
            const tn = data.nodes.find((n) => n.id === edge.to);
            if (!fn || !tn) return null;
            return (
              <line
                key={edge.id}
                x1={fn.x + fn.width / 2}
                y1={fn.y + fn.height / 2}
                x2={tn.x + tn.width / 2}
                y2={tn.y + tn.height / 2}
                stroke="#aaa"
                strokeWidth={vw / 200}
              />
            );
          })}
          <rect
            x={vpX}
            y={vpY}
            width={vpW}
            height={vpH}
            fill="rgba(75,136,206,0.08)"
            stroke="#4B88CE"
            strokeWidth={vw / 120}
          />
        </svg>
      </S.MinimapWrap>
    );
  };

  /* ─── 커넥팅 라인 ─────────────────────────────────────── */
  const renderConnectingLine = () => {
    if (!connecting) return null;
    const fromNode = data.nodes.find((n) => n.id === connecting.fromId);
    if (!fromNode) return null;
    const fx = fromNode.x + fromNode.width / 2;
    const fy = fromNode.y + fromNode.height / 2;
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
  };

  /* ─────────────────────────────────────────────────────────
     Loading
     ───────────────────────────────────────────────────────── */
  if (loading || !diagram) {
    return (
      <S.Root>
        <S.TopBar>
          <S.TBtn onClick={() => navigate(-1)}>← 뒤로</S.TBtn>
        </S.TopBar>
        <S.Body>
          <S.CanvasWrap style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
            다이어그램 로딩 중...
          </S.CanvasWrap>
        </S.Body>
      </S.Root>
    );
  }

  /* ─────────────────────────────────────────────────────────
     선택된 항목 정보 (for property panel)
     ───────────────────────────────────────────────────────── */
  const sel = selectedNodes.length === 1 ? selectedNodes[0] : null;
  const selEdge = selectedEdges.length === 1 ? selectedEdges[0] : null;

  /* ═══════════════════════════════════════════════════════════
     Main JSX
     ═══════════════════════════════════════════════════════════ */
  return (
    <S.Root tabIndex={-1}>
      {/* ─── Top Bar ─────────────────────────────────────── */}
      <S.TopBar>
        <S.TBtn onClick={() => navigate(`/project/${pid}/diagram`)}><IcArrowLeft size={14} /> 목록</S.TBtn>
        <S.TopBarSep />
        <S.TopBarTitle
          value={diagram.title}
          onChange={(e) => setDiagram({ ...diagram, title: e.target.value })}
          onBlur={() => {
            updateDiagram(pid, did, { title: diagram.title }).catch(() => {});
          }}
        />
        <S.TopBarSep />

        {/* 도구 */}
        <S.TopBarSection>
          <S.TBtn $active={tool === 'select'} onClick={() => setTool('select')} title="선택 (V)">
            <IcCursor size={14} /> 선택
          </S.TBtn>
          <S.TBtn $active={tool === 'pan'} onClick={() => setTool('pan')} title="이동 (H)">
            <IcHand size={14} /> 이동
          </S.TBtn>
          <S.TBtn $active={tool === 'connect'} onClick={() => setTool('connect')} title="연결 (C)">
            <IcLink size={14} /> 연결
          </S.TBtn>
        </S.TopBarSection>
        <S.TopBarSep />

        {/* Undo / Redo */}
        <S.TopBarSection>
          <S.TBtn disabled={!canUndo} onClick={undo} title="실행 취소 (⌘Z)"><IcUndo size={14} /></S.TBtn>
          <S.TBtn disabled={!canRedo} onClick={redo} title="다시 실행 (⌘⇧Z)"><IcRedo size={14} /></S.TBtn>
        </S.TopBarSection>
        <S.TopBarSep />

        {/* Edit */}
        <S.TopBarSection>
          <S.TBtn onClick={copySelected} title="복사 (⌘C)"><IcCopy size={14} /></S.TBtn>
          <S.TBtn onClick={paste} title="붙여넣기 (⌘V)"><IcPaste size={14} /></S.TBtn>
          <S.TBtn onClick={duplicate} title="복제 (⌘D)"><IcDuplicate size={14} /></S.TBtn>
          <S.TBtn onClick={deleteSelected} title="삭제 (Del)"><IcTrash size={14} /></S.TBtn>
        </S.TopBarSection>
        <S.TopBarSep />

        {/* Align */}
        <S.TopBarSection>
          <S.TBtn onClick={() => align('left')} title="왼쪽 정렬" disabled={selectedNodes.length < 2}><IcAlignLeft size={14} /></S.TBtn>
          <S.TBtn onClick={() => align('centerH')} title="수평 중앙" disabled={selectedNodes.length < 2}><IcAlignCenterH size={14} /></S.TBtn>
          <S.TBtn onClick={() => align('right')} title="오른쪽 정렬" disabled={selectedNodes.length < 2}><IcAlignRight size={14} /></S.TBtn>
          <S.TBtn onClick={() => align('top')} title="위쪽 정렬" disabled={selectedNodes.length < 2}><IcAlignTop size={14} /></S.TBtn>
          <S.TBtn onClick={() => align('centerV')} title="수직 중앙" disabled={selectedNodes.length < 2}><IcAlignCenterV size={14} /></S.TBtn>
          <S.TBtn onClick={() => align('bottom')} title="아래쪽 정렬" disabled={selectedNodes.length < 2}><IcAlignBottom size={14} /></S.TBtn>
        </S.TopBarSection>
        <S.TopBarSep />

        {/* Distribute */}
        <S.TopBarSection>
          <S.TBtn onClick={() => distribute('h')} title="가로 균등 분배" disabled={selectedNodes.length < 3}><IcDistributeH size={14} /></S.TBtn>
          <S.TBtn onClick={() => distribute('v')} title="세로 균등 분배" disabled={selectedNodes.length < 3}><IcDistributeV size={14} /></S.TBtn>
        </S.TopBarSection>
        <S.TopBarSep />

        {/* Z-order / Lock */}
        <S.TopBarSection>
          <S.TBtn onClick={bringToFront} title="맨 앞으로"><IcBringFront size={14} /></S.TBtn>
          <S.TBtn onClick={sendToBack} title="맨 뒤로"><IcSendBack size={14} /></S.TBtn>
          <S.TBtn onClick={toggleLock} title="잠금 토글">
            {selectedNodes.some((n) => n.locked) ? <IcLock size={14} /> : <IcUnlock size={14} />}
          </S.TBtn>
        </S.TopBarSection>

        <S.TopBarSpacer />

        <S.SaveInfo>{lastSaved ? `저장됨 ${lastSaved}` : ''}</S.SaveInfo>
        <S.TBtn onClick={exportSVG} title="SVG 내보내기"><IcDownload size={14} /> SVG</S.TBtn>
        <S.PrimaryBtn onClick={handleSave}><IcSave size={14} /> 저장</S.PrimaryBtn>
      </S.TopBar>

      {/* ─── Body ────────────────────────────────────────── */}
      <S.Body>
        {/* ─── Left Panel (Shapes) ───────────────────────── */}
        <S.LeftPanel $collapsed={leftCollapsed}>
          <S.PanelToggle onClick={() => setLeftCollapsed(!leftCollapsed)}>
            {leftCollapsed ? <IcChevronRight size={14} /> : <><IcChevronLeft size={14} /> 도형</>}
          </S.PanelToggle>
          {!leftCollapsed && (
            <>
              <S.PanelTitle>기본 도형</S.PanelTitle>
              <S.ShapeGrid>
                {SHAPES.map((s) => {
                  const Ic = SHAPE_ICON_MAP[s.shape];
                  return (
                    <S.ShapeItem key={s.shape} onClick={() => addNode(s.shape)} title={s.label}>
                      <S.ShapeIcon>{Ic ? <Ic /> : null}</S.ShapeIcon>
                      <S.ShapeLabel>{s.label}</S.ShapeLabel>
                    </S.ShapeItem>
                  );
                })}
              </S.ShapeGrid>
            </>
          )}
        </S.LeftPanel>

        {/* ─── Canvas ────────────────────────────────────── */}
        <S.CanvasWrap
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onWheel={handleWheel}
          onContextMenu={handleContextMenu}
          style={{
            cursor: tool === 'pan' || panning
              ? (panning ? 'grabbing' : 'grab')
              : tool === 'connect'
                ? 'crosshair'
                : 'default',
            background: settings.backgroundColor,
          }}
        >
          <S.SvgCanvas>
            <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
              {renderGrid()}

              {/* 엣지 */}
              {[...data.edges]
                .sort((a, b) => (selectedEdgeIds.has(a.id) ? 1 : 0) - (selectedEdgeIds.has(b.id) ? 1 : 0))
                .map(renderEdge)}

              {renderConnectingLine()}

              {/* 노드 (zIndex 순) */}
              {[...data.nodes]
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((n) => (
                  <g key={n.id}>
                    {renderShape(n)}
                    {/* 라벨 */}
                    <text
                      x={n.x + n.width / 2}
                      y={n.y + n.height / 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={n.fontSize}
                      fontWeight={n.fontWeight}
                      fill={n.textColor}
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      {n.label}
                    </text>
                    {/* 인터랙션 히트 영역 */}
                    <rect
                      x={n.x}
                      y={n.y}
                      width={n.width}
                      height={n.height}
                      fill="transparent"
                      style={{ cursor: n.locked ? 'not-allowed' : tool === 'connect' ? 'crosshair' : 'move' }}
                      onMouseDown={(e) => handleNodeMouseDown(e, n.id)}
                      onDoubleClick={(e) => handleNodeDblClick(e, n.id)}
                    />
                    {renderPorts(n)}
                    {renderHandles(n)}
                  </g>
                ))}
            </g>
          </S.SvgCanvas>

          {/* 셀렉션 박스 */}
          {selBox && (
            <S.SelectionBox
              style={{
                left: Math.min(selBox.x1, selBox.x2) * zoom + pan.x,
                top: Math.min(selBox.y1, selBox.y2) * zoom + pan.y,
                width: Math.abs(selBox.x2 - selBox.x1) * zoom,
                height: Math.abs(selBox.y2 - selBox.y1) * zoom,
              }}
            />
          )}

          {/* 인라인 라벨 에디터 */}
          {editingLabel && (() => {
            const en = data.nodes.find((n) => n.id === editingLabel.id);
            if (!en) return null;
            return (
              <S.InlineInput
                style={{
                  left: en.x * zoom + pan.x,
                  top: en.y * zoom + pan.y,
                  width: en.width * zoom,
                  height: en.height * zoom,
                  fontSize: en.fontSize * zoom,
                }}
                value={editingLabel.value}
                onChange={(e) => setEditingLabel({ ...editingLabel, value: e.target.value })}
                onBlur={commitLabel}
                onKeyDown={(e: RKE<HTMLInputElement>) => { if (e.key === 'Enter') commitLabel(); if (e.key === 'Escape') setEditingLabel(null); }}
                autoFocus
              />
            );
          })()}

          {/* 미니맵 */}
          {renderMinimap()}

          {/* 줌 컨트롤 */}
          <S.ZoomControls>
            <S.TBtn onClick={() => setZoom((z) => Math.max(0.1, z - 0.1))}><IcZoomOut size={14} /></S.TBtn>
            <S.ZoomText>{Math.round(zoom * 100)}%</S.ZoomText>
            <S.TBtn onClick={() => setZoom((z) => Math.min(4, z + 0.1))}><IcZoomIn size={14} /></S.TBtn>
            <S.TBtn onClick={fitToScreen} title="화면에 맞추기"><IcFitScreen size={14} /></S.TBtn>
            <S.TBtn onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} title="100% 리셋"><IcReset size={14} /></S.TBtn>
          </S.ZoomControls>
        </S.CanvasWrap>

        {/* ─── Right Panel (Properties) ──────────────────── */}
        <S.RightPanel $collapsed={rightCollapsed}>
          <S.PanelToggle onClick={() => setRightCollapsed(!rightCollapsed)}>
            {rightCollapsed ? <IcChevronLeft size={14} /> : <>속성 <IcChevronRight size={14} /></>}
          </S.PanelToggle>
          {!rightCollapsed && (
            <S.PropScroll>
              {/* === 노드 속성 === */}
              {sel ? (
                <>
                  <S.PanelTitle>노드 속성</S.PanelTitle>
                  <S.PropSection>
                    <S.PropLabel>라벨</S.PropLabel>
                    <S.PropInput
                      value={sel.label}
                      onChange={(e) => updateNode(sel.id, { label: e.target.value })}
                    />
                  </S.PropSection>

                  <S.PropSection>
                    <S.PropLabel>도형</S.PropLabel>
                    <S.PropSelect
                      value={sel.shape}
                      onChange={(e) => updateNode(sel.id, { shape: e.target.value as NodeShape })}
                    >
                      {SHAPES.map((s) => (
                        <option key={s.shape} value={s.shape}>{s.label}</option>
                      ))}
                    </S.PropSelect>
                  </S.PropSection>

                  <S.PropSection>
                    <S.PropLabel>위치 & 크기</S.PropLabel>
                    <S.PropRow>
                      <span style={{ fontSize: 11, color: '#888' }}>X</span>
                      <S.PropNumber type="number" value={Math.round(sel.x)} onChange={(e) => updateNode(sel.id, { x: +e.target.value })} />
                      <span style={{ fontSize: 11, color: '#888' }}>Y</span>
                      <S.PropNumber type="number" value={Math.round(sel.y)} onChange={(e) => updateNode(sel.id, { y: +e.target.value })} />
                    </S.PropRow>
                    <S.PropRow>
                      <span style={{ fontSize: 11, color: '#888' }}>W</span>
                      <S.PropNumber type="number" value={Math.round(sel.width)} onChange={(e) => updateNode(sel.id, { width: Math.max(20, +e.target.value) })} />
                      <span style={{ fontSize: 11, color: '#888' }}>H</span>
                      <S.PropNumber type="number" value={Math.round(sel.height)} onChange={(e) => updateNode(sel.id, { height: Math.max(20, +e.target.value) })} />
                    </S.PropRow>
                  </S.PropSection>

                  <S.PropSection>
                    <S.PropLabel>채우기 색상</S.PropLabel>
                    <S.PropRow>
                      <S.PropColor type="color" value={sel.fillColor} onChange={(e) => updateNode(sel.id, { fillColor: e.target.value })} />
                      <S.PropInput value={sel.fillColor} onChange={(e) => updateNode(sel.id, { fillColor: e.target.value })} style={{ flex: 1 }} />
                    </S.PropRow>
                    <S.ColorPresets>
                      {COLOR_PRESETS.map((c) => (
                        <S.ColorDot key={c} $c={c} $active={sel.fillColor === c} onClick={() => updateNode(sel.id, { fillColor: c })} />
                      ))}
                    </S.ColorPresets>
                  </S.PropSection>

                  <S.PropSection>
                    <S.PropLabel>테두리 색상</S.PropLabel>
                    <S.PropRow>
                      <S.PropColor type="color" value={sel.borderColor} onChange={(e) => updateNode(sel.id, { borderColor: e.target.value })} />
                      <span style={{ fontSize: 11, color: '#888' }}>두께</span>
                      <S.PropNumber type="number" value={sel.borderWidth} min={0} max={10} step={0.5} onChange={(e) => updateNode(sel.id, { borderWidth: +e.target.value })} />
                    </S.PropRow>
                  </S.PropSection>

                  <S.PropSection>
                    <S.PropLabel>텍스트</S.PropLabel>
                    <S.PropRow>
                      <S.PropColor type="color" value={sel.textColor} onChange={(e) => updateNode(sel.id, { textColor: e.target.value })} />
                      <span style={{ fontSize: 11, color: '#888' }}>크기</span>
                      <S.PropNumber type="number" value={sel.fontSize} min={8} max={48} onChange={(e) => updateNode(sel.id, { fontSize: +e.target.value })} />
                      <S.TBtn
                        $active={sel.fontWeight === 'bold'}
                        onClick={() => updateNode(sel.id, { fontWeight: sel.fontWeight === 'bold' ? 'normal' : 'bold' })}
                        style={{ fontWeight: 'bold' }}
                      >
                        B
                      </S.TBtn>
                    </S.PropRow>
                  </S.PropSection>

                  <S.PropSection>
                    <S.PropLabel>투명도</S.PropLabel>
                    <input
                      type="range"
                      min={0.1}
                      max={1}
                      step={0.1}
                      value={sel.opacity}
                      onChange={(e) => updateNode(sel.id, { opacity: +e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </S.PropSection>

                  <S.PropSection>
                    <S.PropCheck>
                      <input type="checkbox" checked={sel.locked} onChange={(e) => updateNode(sel.id, { locked: e.target.checked })} />
                      잠금
                    </S.PropCheck>
                  </S.PropSection>

                  <S.TBtn $danger onClick={() => deleteSelected()} style={{ width: '100%', justifyContent: 'center' }}>
                    <IcTrash size={14} /> 노드 삭제
                  </S.TBtn>
                </>
              ) : selEdge ? (
                /* === 엣지 속성 === */
                <>
                  <S.PanelTitle>엣지 속성</S.PanelTitle>
                  <S.PropSection>
                    <S.PropLabel>라벨</S.PropLabel>
                    <S.PropInput value={selEdge.label} onChange={(e) => updateEdge(selEdge.id, { label: e.target.value })} />
                  </S.PropSection>

                  <S.PropSection>
                    <S.PropLabel>선 스타일</S.PropLabel>
                    <S.PropSelect value={selEdge.lineStyle} onChange={(e) => updateEdge(selEdge.id, { lineStyle: e.target.value as EdgeLineStyle })}>
                      <option value="solid">실선</option>
                      <option value="dashed">대시</option>
                      <option value="dotted">점선</option>
                    </S.PropSelect>
                  </S.PropSection>

                  <S.PropSection>
                    <S.PropLabel>경로 타입</S.PropLabel>
                    <S.PropSelect value={selEdge.pathType} onChange={(e) => updateEdge(selEdge.id, { pathType: e.target.value as EdgePathType })}>
                      <option value="bezier">베지어</option>
                      <option value="straight">직선</option>
                      <option value="step">꺾은선</option>
                    </S.PropSelect>
                  </S.PropSection>

                  <S.PropSection>
                    <S.PropLabel>색상 & 두께</S.PropLabel>
                    <S.PropRow>
                      <S.PropColor type="color" value={selEdge.color} onChange={(e) => updateEdge(selEdge.id, { color: e.target.value })} />
                      <S.PropNumber type="number" value={selEdge.width} min={1} max={10} step={0.5} onChange={(e) => updateEdge(selEdge.id, { width: +e.target.value })} />
                    </S.PropRow>
                  </S.PropSection>

                  <S.PropSection>
                    <S.PropLabel>시작 화살표</S.PropLabel>
                    <S.PropSelect value={selEdge.startArrow} onChange={(e) => updateEdge(selEdge.id, { startArrow: e.target.value as ArrowType })}>
                      <option value="none">없음</option>
                      <option value="arrow">화살표</option>
                      <option value="diamond">다이아몬드</option>
                      <option value="circle">원</option>
                    </S.PropSelect>
                  </S.PropSection>

                  <S.PropSection>
                    <S.PropLabel>끝 화살표</S.PropLabel>
                    <S.PropSelect value={selEdge.endArrow} onChange={(e) => updateEdge(selEdge.id, { endArrow: e.target.value as ArrowType })}>
                      <option value="none">없음</option>
                      <option value="arrow">화살표</option>
                      <option value="diamond">다이아몬드</option>
                      <option value="circle">원</option>
                    </S.PropSelect>
                  </S.PropSection>

                  <S.TBtn $danger onClick={() => deleteSelected()} style={{ width: '100%', justifyContent: 'center' }}>
                    <IcTrash size={14} /> 엣지 삭제
                  </S.TBtn>
                </>
              ) : (
                /* === 캔버스 설정 === */
                <>
                  <S.PanelTitle>캔버스 설정</S.PanelTitle>
                  <S.PropSection>
                    <S.PropCheck>
                      <input type="checkbox" checked={settings.showGrid} onChange={(e) => setSettings({ ...settings, showGrid: e.target.checked })} />
                      그리드 표시
                    </S.PropCheck>
                    <S.PropCheck>
                      <input type="checkbox" checked={settings.snapToGrid} onChange={(e) => setSettings({ ...settings, snapToGrid: e.target.checked })} />
                      그리드에 스냅
                    </S.PropCheck>
                  </S.PropSection>

                  <S.PropSection>
                    <S.PropLabel>그리드 크기</S.PropLabel>
                    <S.PropNumber type="number" value={settings.gridSize} min={5} max={100} step={5} onChange={(e) => setSettings({ ...settings, gridSize: +e.target.value })} />
                  </S.PropSection>

                  <S.PropSection>
                    <S.PropLabel>그리드 타입</S.PropLabel>
                    <S.PropSelect value={settings.gridType} onChange={(e) => setSettings({ ...settings, gridType: e.target.value as 'dots' | 'lines' })}>
                      <option value="dots">점</option>
                      <option value="lines">선</option>
                    </S.PropSelect>
                  </S.PropSection>

                  <S.PropSection>
                    <S.PropLabel>배경색</S.PropLabel>
                    <S.PropColor type="color" value={settings.backgroundColor} onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })} />
                  </S.PropSection>

                  <S.PropSection>
                    <S.PropLabel>요약</S.PropLabel>
                    <S.StatusText>노드 {data.nodes.length}개 · 엣지 {data.edges.length}개</S.StatusText>
                  </S.PropSection>
                </>
              )}
            </S.PropScroll>
          )}
        </S.RightPanel>
      </S.Body>

      {/* ─── Status Bar ──────────────────────────────────── */}
      <S.StatusBar>
        <S.StatusText><IcMouse size={12} /> {tool === 'select' ? '선택' : tool === 'pan' ? '이동' : '연결'}</S.StatusText>
        <S.StatusText>확대 {Math.round(zoom * 100)}%</S.StatusText>
        <S.StatusText>노드 {data.nodes.length}</S.StatusText>
        <S.StatusText>엣지 {data.edges.length}</S.StatusText>
        <S.StatusText>선택 {selectedIds.size + selectedEdgeIds.size}</S.StatusText>
        <S.TopBarSpacer />
        <S.StatusText>V: 선택 · H: 이동 · C: 연결 · ⌘Z: 취소 · ⌘S: 저장 · Del: 삭제</S.StatusText>
      </S.StatusBar>

      {/* ─── Context Menu ────────────────────────────────── */}
      {ctxMenu && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 99 }}
            onClick={() => setCtxMenu(null)}
            onContextMenu={(e) => { e.preventDefault(); setCtxMenu(null); }}
          />
          <S.CtxMenu style={{ left: ctxMenu.x, top: ctxMenu.y }}>
            {ctxMenu.nodeId ? (
              <>
                <S.CtxItem onClick={() => { setEditingLabel({ id: ctxMenu.nodeId!, value: data.nodes.find((n) => n.id === ctxMenu.nodeId)?.label || '' }); setCtxMenu(null); }}>
                  <IcEdit size={14} /> 라벨 편집 <S.CtxShortcut>더블클릭</S.CtxShortcut>
                </S.CtxItem>
                <S.CtxItem onClick={() => { copySelected(); setCtxMenu(null); }}>
                  <IcCopy size={14} /> 복사 <S.CtxShortcut>⌘C</S.CtxShortcut>
                </S.CtxItem>
                <S.CtxItem onClick={() => { duplicate(); setCtxMenu(null); }}>
                  <IcDuplicate size={14} /> 복제 <S.CtxShortcut>⌘D</S.CtxShortcut>
                </S.CtxItem>
                <S.CtxItem onClick={() => { setConnecting({ fromId: ctxMenu.nodeId!, mx: 0, my: 0 }); setTool('connect'); setCtxMenu(null); }}>
                  <IcLink size={14} /> 연결 시작
                </S.CtxItem>
                <S.CtxItem onClick={() => { bringToFront(); setCtxMenu(null); }}>
                  <IcBringFront size={14} /> 맨 앞으로
                </S.CtxItem>
                <S.CtxItem onClick={() => { sendToBack(); setCtxMenu(null); }}>
                  <IcSendBack size={14} /> 맨 뒤로
                </S.CtxItem>
                <S.CtxItem onClick={() => { toggleLock(); setCtxMenu(null); }}>
                  <IcLock size={14} /> 잠금 토글
                </S.CtxItem>
                <S.CtxSep />
                <S.CtxItem $danger onClick={() => { deleteSelected(); setCtxMenu(null); }}>
                  <IcTrash size={14} /> 삭제 <S.CtxShortcut>Del</S.CtxShortcut>
                </S.CtxItem>
              </>
            ) : (
              <>
                <S.CtxItem onClick={() => { paste(); setCtxMenu(null); }}>
                  <IcPaste size={14} /> 붙여넣기 <S.CtxShortcut>⌘V</S.CtxShortcut>
                </S.CtxItem>
                <S.CtxItem onClick={() => { selectAll(); setCtxMenu(null); }}>
                  <IcSelectAll size={14} /> 전체 선택 <S.CtxShortcut>⌘A</S.CtxShortcut>
                </S.CtxItem>
                <S.CtxSep />
                <S.CtxItem onClick={() => { fitToScreen(); setCtxMenu(null); }}>
                  <IcFitScreen size={14} /> 화면에 맞추기
                </S.CtxItem>
                <S.CtxItem onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); setCtxMenu(null); }}>
                  1:1 줌 리셋
                </S.CtxItem>
              </>
            )}
          </S.CtxMenu>
        </>
      )}
    </S.Root>
  );
}
