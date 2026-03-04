/* ═══════════════════════════════════════════════════════════════
   Diagram Editor — 타입 & 유틸리티
   ═══════════════════════════════════════════════════════════════ */

// ─── Node Shape ─────────────────────────────────────────────
export type NodeShape =
  | 'rectangle'
  | 'rounded'
  | 'circle'
  | 'diamond'
  | 'ellipse'
  | 'hexagon'
  | 'parallelogram'
  | 'triangle'
  | 'star'
  | 'database'
  | 'note';

// ─── Edge ───────────────────────────────────────────────────
export type EdgeLineStyle = 'solid' | 'dashed' | 'dotted';
export type ArrowType = 'arrow' | 'none' | 'diamond' | 'circle';
export type EdgePathType = 'straight' | 'bezier' | 'step';

// ─── Tool ───────────────────────────────────────────────────
export type ToolMode = 'select' | 'pan' | 'connect';

export type PortDir = 'top' | 'right' | 'bottom' | 'left';

// ─── Node ───────────────────────────────────────────────────
export interface DiagramNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  shape: NodeShape;
  label: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  textColor: string;
  fillColor: string;
  borderColor: string;
  borderWidth: number;
  opacity: number;
  locked: boolean;
  zIndex: number;
}

// ─── Edge ───────────────────────────────────────────────────
export interface DiagramEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  lineStyle: EdgeLineStyle;
  color: string;
  width: number;
  pathType: EdgePathType;
  startArrow: ArrowType;
  endArrow: ArrowType;
}

// ─── 전체 데이터 ────────────────────────────────────────────
export interface EditorData {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

// ─── 캔버스 설정 ────────────────────────────────────────────
export interface CanvasSettings {
  gridSize: number;
  snapToGrid: boolean;
  showGrid: boolean;
  backgroundColor: string;
  gridType: 'dots' | 'lines';
}

export const DEFAULT_SETTINGS: CanvasSettings = {
  gridSize: 20,
  snapToGrid: true,
  showGrid: true,
  backgroundColor: '#f8f9fa',
  gridType: 'dots',
};

// ─── 도형 카탈로그 ──────────────────────────────────────────
export interface ShapeDef {
  shape: NodeShape;
  label: string;
  w: number;
  h: number;
}

export const SHAPES: ShapeDef[] = [
  { shape: 'rectangle', label: '사각형', w: 140, h: 60 },
  { shape: 'rounded', label: '둥근 사각형', w: 140, h: 60 },
  { shape: 'circle', label: '원', w: 80, h: 80 },
  { shape: 'diamond', label: '다이아몬드', w: 100, h: 100 },
  { shape: 'ellipse', label: '타원', w: 140, h: 80 },
  { shape: 'hexagon', label: '육각형', w: 120, h: 100 },
  { shape: 'parallelogram', label: '평행사변형', w: 150, h: 70 },
  { shape: 'triangle', label: '삼각형', w: 100, h: 90 },
  { shape: 'star', label: '별', w: 100, h: 100 },
  { shape: 'database', label: 'DB', w: 100, h: 120 },
  { shape: 'note', label: '노트', w: 140, h: 100 },
];

export const COLOR_PRESETS = [
  '#4B88CE', '#1A73E8', '#34A853', '#137333',
  '#FFD600', '#F9AB00', '#E23737', '#D93025',
  '#7627BB', '#9334E6', '#E91E63', '#FF6D00',
  '#00BCD4', '#009688', '#607D8B', '#795548',
  '#333333', '#666666', '#999999', '#CCCCCC',
  '#FFFFFF',
];

// ─── 팩토리 ─────────────────────────────────────────────────
let _seq = 0;
const uid = () => `n${Date.now()}-${++_seq}`;
const eid = () => `e${Date.now()}-${++_seq}`;

export function makeNode(shape: NodeShape, x: number, y: number): DiagramNode {
  const def = SHAPES.find((s) => s.shape === shape) ?? SHAPES[0];
  return {
    id: uid(),
    x,
    y,
    width: def.w,
    height: def.h,
    shape,
    label: def.label,
    fontSize: 13,
    fontWeight: 'normal',
    textColor: '#333333',
    fillColor: '#4B88CE',
    borderColor: '#C0C0C0',
    borderWidth: 1.5,
    opacity: 1,
    locked: false,
    zIndex: 0,
  };
}

export function makeEdge(from: string, to: string): DiagramEdge {
  return {
    id: eid(),
    from,
    to,
    label: '',
    lineStyle: 'solid',
    color: '#666666',
    width: 2,
    pathType: 'bezier',
    startArrow: 'none',
    endArrow: 'arrow',
  };
}

// ─── 포트 위치 ──────────────────────────────────────────────
export function portPos(n: DiagramNode, port: PortDir) {
  const cx = n.x + n.width / 2;
  const cy = n.y + n.height / 2;
  switch (port) {
    case 'top':    return { x: cx, y: n.y };
    case 'right':  return { x: n.x + n.width, y: cy };
    case 'bottom': return { x: cx, y: n.y + n.height };
    case 'left':   return { x: n.x, y: cy };
  }
}

/** 두 노드의 가장 가까운 포트 자동 선택 */
export function smartPorts(a: DiagramNode, b: DiagramNode): { fp: PortDir; tp: PortDir } {
  const ax = a.x + a.width / 2, ay = a.y + a.height / 2;
  const bx = b.x + b.width / 2, by = b.y + b.height / 2;
  const dx = bx - ax, dy = by - ay;
  if (Math.abs(dx) > Math.abs(dy)) {
    return { fp: dx > 0 ? 'right' : 'left', tp: dx > 0 ? 'left' : 'right' };
  }
  return { fp: dy > 0 ? 'bottom' : 'top', tp: dy > 0 ? 'top' : 'bottom' };
}

// ─── 엣지 패스 ──────────────────────────────────────────────
export function edgePath(
  x1: number, y1: number,
  x2: number, y2: number,
  type: EdgePathType,
): string {
  switch (type) {
    case 'straight':
      return `M${x1},${y1} L${x2},${y2}`;
    case 'bezier': {
      const dx = Math.abs(x2 - x1) * 0.5;
      const dy = Math.abs(y2 - y1) * 0.5;
      if (Math.abs(x2 - x1) > Math.abs(y2 - y1)) {
        return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
      }
      return `M${x1},${y1} C${x1},${y1 + dy} ${x2},${y2 - dy} ${x2},${y2}`;
    }
    case 'step': {
      const mx = (x1 + x2) / 2;
      return `M${x1},${y1} L${mx},${y1} L${mx},${y2} L${x2},${y2}`;
    }
  }
}

// ─── 스냅 ───────────────────────────────────────────────────
export function snap(v: number, g: number) {
  return Math.round(v / g) * g;
}

// ─── 도형 SVG path ──────────────────────────────────────────
export function shapePath(shape: NodeShape, x: number, y: number, w: number, h: number): string {
  switch (shape) {
    case 'rectangle':
      return `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`;
    case 'diamond': {
      const cx = x + w / 2, cy = y + h / 2;
      return `M${cx},${y} L${x + w},${cy} L${cx},${y + h} L${x},${cy} Z`;
    }
    case 'hexagon': {
      const q = w / 4;
      return `M${x + q},${y} L${x + w - q},${y} L${x + w},${y + h / 2} L${x + w - q},${y + h} L${x + q},${y + h} L${x},${y + h / 2} Z`;
    }
    case 'parallelogram': {
      const s = w * 0.2;
      return `M${x + s},${y} L${x + w},${y} L${x + w - s},${y + h} L${x},${y + h} Z`;
    }
    case 'triangle': {
      const cx = x + w / 2;
      return `M${cx},${y} L${x + w},${y + h} L${x},${y + h} Z`;
    }
    case 'star': {
      const cx = x + w / 2, cy = y + h / 2;
      const or = Math.min(w, h) / 2, ir = or * 0.4;
      const pts: string[] = [];
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? or : ir;
        const a = (Math.PI / 5) * i - Math.PI / 2;
        pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
      }
      return `M${pts[0]} ${pts.slice(1).map((p) => `L${p}`).join(' ')} Z`;
    }
    case 'note': {
      const fold = Math.min(20, w * 0.15, h * 0.15);
      return `M${x},${y} L${x + w - fold},${y} L${x + w},${y + fold} L${x + w},${y + h} L${x},${y + h} Z M${x + w - fold},${y} L${x + w - fold},${y + fold} L${x + w},${y + fold}`;
    }
    default:
      return '';
  }
}

// ─── 엣지 대시 배열 ────────────────────────────────────────
export function dashArray(style: EdgeLineStyle): string {
  switch (style) {
    case 'dashed': return '8,4';
    case 'dotted': return '2,4';
    default:       return '';
  }
}
