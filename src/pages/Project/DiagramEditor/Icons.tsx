/* ═══════════════════════════════════════════════════════════
   Diagram Editor — SVG Icon Components
   모든 아이콘은 currentColor를 상속받아 부모 색상을 따릅니다.
   ═══════════════════════════════════════════════════════════ */

const S = 16; // default size
const p = { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', stroke: 'currentColor' } as const;
const pc = { ...p, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

/* ─── 도구 ─────────────────────────────────────────────── */

/** 선택 (포인터) */
export const IcCursor = ({ size = S }: { size?: number }) => (
  <svg {...p} width={size} height={size} viewBox="0 0 24 24">
    <path d="M5 3l14 9-6.5 1.5L10 20z" fill="currentColor" stroke="none" />
  </svg>
);

/** 이동 (손바닥) */
export const IcHand = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <path d="M18 11V5a2 2 0 00-4 0v1M14 10V3a2 2 0 00-4 0v7M10 10V5a2 2 0 00-4 0v9l-1.8-2.4a1.5 1.5 0 00-2.4 1.8L7 21h11a3 3 0 003-3v-5a2 2 0 00-4 0v-2" />
  </svg>
);

/** 연결 (링크) */
export const IcLink = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
  </svg>
);

/* ─── 편집 ─────────────────────────────────────────────── */

/** 실행 취소 */
export const IcUndo = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <path d="M3 10h13a4 4 0 010 8H7" />
    <polyline points="7 6 3 10 7 14" />
  </svg>
);

/** 다시 실행 */
export const IcRedo = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <path d="M21 10H8a4 4 0 000 8h9" />
    <polyline points="17 6 21 10 17 14" />
  </svg>
);

/** 복사 */
export const IcCopy = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

/** 붙여넣기 */
export const IcPaste = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" />
  </svg>
);

/** 복제 */
export const IcDuplicate = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <rect x="8" y="8" width="13" height="13" rx="2" />
    <path d="M16 8V6a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2h2" />
  </svg>
);

/** 삭제 (휴지통) */
export const IcTrash = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
);

/* ─── 정렬 ─────────────────────────────────────────────── */

/** 왼쪽 정렬 */
export const IcAlignLeft = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <line x1="3" y1="3" x2="3" y2="21" />
    <rect x="7" y="5" width="14" height="4" rx="1" />
    <rect x="7" y="13" width="9" height="4" rx="1" />
  </svg>
);

/** 수평 중앙 */
export const IcAlignCenterH = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <line x1="12" y1="3" x2="12" y2="21" strokeDasharray="2,2" />
    <rect x="5" y="5" width="14" height="4" rx="1" />
    <rect x="7" y="13" width="10" height="4" rx="1" />
  </svg>
);

/** 오른쪽 정렬 */
export const IcAlignRight = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <line x1="21" y1="3" x2="21" y2="21" />
    <rect x="3" y="5" width="14" height="4" rx="1" />
    <rect x="8" y="13" width="9" height="4" rx="1" />
  </svg>
);

/** 위쪽 정렬 */
export const IcAlignTop = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <line x1="3" y1="3" x2="21" y2="3" />
    <rect x="5" y="7" width="4" height="14" rx="1" />
    <rect x="13" y="7" width="4" height="9" rx="1" />
  </svg>
);

/** 수직 중앙 */
export const IcAlignCenterV = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <line x1="3" y1="12" x2="21" y2="12" strokeDasharray="2,2" />
    <rect x="5" y="5" width="4" height="14" rx="1" />
    <rect x="13" y="7" width="4" height="10" rx="1" />
  </svg>
);

/** 아래쪽 정렬 */
export const IcAlignBottom = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <line x1="3" y1="21" x2="21" y2="21" />
    <rect x="5" y="3" width="4" height="14" rx="1" />
    <rect x="13" y="8" width="4" height="9" rx="1" />
  </svg>
);

/* ─── 분배 ─────────────────────────────────────────────── */

/** 가로 균등 분배 */
export const IcDistributeH = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <rect x="4" y="7" width="3" height="10" rx="1" />
    <rect x="10.5" y="7" width="3" height="10" rx="1" />
    <rect x="17" y="7" width="3" height="10" rx="1" />
    <line x1="2" y1="4" x2="2" y2="20" strokeDasharray="2,2" />
    <line x1="22" y1="4" x2="22" y2="20" strokeDasharray="2,2" />
  </svg>
);

/** 세로 균등 분배 */
export const IcDistributeV = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <rect x="7" y="4" width="10" height="3" rx="1" />
    <rect x="7" y="10.5" width="10" height="3" rx="1" />
    <rect x="7" y="17" width="10" height="3" rx="1" />
    <line x1="4" y1="2" x2="20" y2="2" strokeDasharray="2,2" />
    <line x1="4" y1="22" x2="20" y2="22" strokeDasharray="2,2" />
  </svg>
);

/* ─── Z-order ──────────────────────────────────────────── */

/** 맨 앞으로 */
export const IcBringFront = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <rect x="3" y="13" width="8" height="8" rx="1" opacity="0.4" />
    <rect x="9" y="3" width="12" height="12" rx="1" fill="currentColor" fillOpacity="0.1" />
  </svg>
);

/** 맨 뒤로 */
export const IcSendBack = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <rect x="3" y="3" width="12" height="12" rx="1" fill="currentColor" fillOpacity="0.1" />
    <rect x="9" y="9" width="12" height="12" rx="1" opacity="0.4" />
  </svg>
);

/* ─── 잠금 ─────────────────────────────────────────────── */

/** 잠금 */
export const IcLock = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

/** 잠금 해제 */
export const IcUnlock = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M7 11V7a5 5 0 019.9-1" />
  </svg>
);

/* ─── 파일 ─────────────────────────────────────────────── */

/** 내보내기 (다운로드) */
export const IcDownload = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

/** 저장 */
export const IcSave = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

/* ─── 줌 & 뷰 ──────────────────────────────────────────── */

/** 줌 인 */
export const IcZoomIn = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

/** 줌 아웃 */
export const IcZoomOut = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

/** 화면에 맞추기 */
export const IcFitScreen = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

/** 100% 리셋 */
export const IcReset = ({ size = S }: { size?: number }) => (
  <svg {...p} width={size} height={size} viewBox="0 0 24 24">
    <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="600" fill="currentColor" fontFamily="sans-serif">1:1</text>
  </svg>
);

/* ─── 기타 UI ──────────────────────────────────────────── */

/** 뒤로 (화살표) */
export const IcArrowLeft = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

/** 마우스 (상태바) */
export const IcMouse = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <rect x="6" y="3" width="12" height="18" rx="6" />
    <line x1="12" y1="7" x2="12" y2="11" />
  </svg>
);

/** 연필 (편집) */
export const IcEdit = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

/** 전체 선택 (체크박스) */
export const IcSelectAll = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <polyline points="9 11 12 14 22 4" />
  </svg>
);

/* ─── 패널 토글 ────────────────────────────────────────── */

/** 왼쪽 패널 열기 (펼침) */
export const IcChevronRight = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

/** 왼쪽 패널 닫기 (접기) */
export const IcChevronLeft = ({ size = S }: { size?: number }) => (
  <svg {...pc} width={size} height={size} viewBox="0 0 24 24">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

/* ─── 도형 팔레트 아이콘 ───────────────────────────────── */

/** 사각형 */
export const IcShapeRect = ({ size = 22 }: { size?: number }) => (
  <svg {...p} width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="5" width="18" height="14" rx="1" />
  </svg>
);

/** 둥근 사각형 */
export const IcShapeRounded = ({ size = 22 }: { size?: number }) => (
  <svg {...p} width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="5" width="18" height="14" rx="5" />
  </svg>
);

/** 원 */
export const IcShapeCircle = ({ size = 22 }: { size?: number }) => (
  <svg {...p} width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
    <circle cx="12" cy="12" r="9" />
  </svg>
);

/** 다이아몬드 */
export const IcShapeDiamond = ({ size = 22 }: { size?: number }) => (
  <svg {...p} width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
    <polygon points="12,2 22,12 12,22 2,12" />
  </svg>
);

/** 타원 */
export const IcShapeEllipse = ({ size = 22 }: { size?: number }) => (
  <svg {...p} width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
    <ellipse cx="12" cy="12" rx="10" ry="7" />
  </svg>
);

/** 육각형 */
export const IcShapeHexagon = ({ size = 22 }: { size?: number }) => (
  <svg {...p} width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
    <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" />
  </svg>
);

/** 평행사변형 */
export const IcShapeParallel = ({ size = 22 }: { size?: number }) => (
  <svg {...p} width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
    <polygon points="7,5 22,5 17,19 2,19" />
  </svg>
);

/** 삼각형 */
export const IcShapeTriangle = ({ size = 22 }: { size?: number }) => (
  <svg {...p} width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
    <polygon points="12,3 22,21 2,21" />
  </svg>
);

/** 별 */
export const IcShapeStar = ({ size = 22 }: { size?: number }) => (
  <svg {...p} width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
    <polygon points="12,2 15.1,8.3 22,9.3 17,14.1 18.2,21 12,17.8 5.8,21 7,14.1 2,9.3 8.9,8.3" />
  </svg>
);

/** DB 실린더 */
export const IcShapeDB = ({ size = 22 }: { size?: number }) => (
  <svg {...p} width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
    <ellipse cx="12" cy="5" rx="8" ry="3" />
    <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
    <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
  </svg>
);

/** 노트 (접힌 모서리) */
export const IcShapeNote = ({ size = 22 }: { size?: number }) => (
  <svg {...p} width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

/* ─── 도형 이름 → 아이콘 컴포넌트 맵 ───────────────────── */
export const SHAPE_ICON_MAP: Record<string, React.FC<{ size?: number }>> = {
  rectangle: IcShapeRect,
  rounded: IcShapeRounded,
  circle: IcShapeCircle,
  diamond: IcShapeDiamond,
  ellipse: IcShapeEllipse,
  hexagon: IcShapeHexagon,
  parallelogram: IcShapeParallel,
  triangle: IcShapeTriangle,
  star: IcShapeStar,
  database: IcShapeDB,
  note: IcShapeNote,
};
