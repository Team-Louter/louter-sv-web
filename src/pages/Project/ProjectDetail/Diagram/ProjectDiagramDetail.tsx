import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as S from './ProjectDiagram.styled';
import { getDiagram, updateDiagram } from '@/api/Project';
import { toast } from '@/store/toastStore';
import type { Diagram } from '@/types/project';

/* ─── 노드 / 엣지 타입 (간이 캔버스용) ──── */
interface CanvasNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  color: string;
}

interface CanvasEdge {
  id: string;
  from: string;
  to: string;
}

interface CanvasData {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

const defaultCanvasData: CanvasData = { nodes: [], edges: [] };

/* ─── 컴포넌트 ──────────────────────────── */
function ProjectDiagramDetail() {
  const { projectId, diagramId } = useParams<{
    projectId: string;
    diagramId: string;
  }>();
  const pid = Number(projectId);
  const did = Number(diagramId);
  const navigate = useNavigate();

  const [diagram, setDiagram] = useState<Diagram | null>(null);
  const [loading, setLoading] = useState(true);

  // Mermaid / 캔버스
  const [mermaidCode, setMermaidCode] = useState('');
  const [canvasData, setCanvasData] = useState<CanvasData>(defaultCanvasData);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [dragging, setDragging] = useState<{ id: string; ox: number; oy: number } | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);

  const canvasRef = useRef<SVGSVGElement>(null);
  const idCounter = useRef(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // 저장 디바운스
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const dirty = useRef(false);

  useEffect(() => {
    getDiagram(pid, did)
      .then((d) => {
        setDiagram(d);
        if (d.type === 'SEQUENCE') {
          setMermaidCode(d.data || 'sequenceDiagram\n  Alice->>Bob: Hello');
        } else {
          try {
            setCanvasData(JSON.parse(d.data || '{}') as CanvasData || defaultCanvasData);
          } catch {
            setCanvasData(defaultCanvasData);
          }
        }
      })
      .catch(() => toast.error('다이어그램을 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
  }, [pid, did]);

  /* ── 자동 저장 ────────────────────── */
  const scheduleAutoSave = useCallback(
    (data: string) => {
      dirty.current = true;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        try {
          await updateDiagram(pid, did, { data });
          dirty.current = false;
        } catch {
          /* ignore */
        }
      }, 1500);
    },
    [pid, did]
  );

  const handleSave = async () => {
    if (!diagram) return;
    const data =
      diagram.type === 'SEQUENCE'
        ? mermaidCode
        : JSON.stringify(canvasData);
    try {
      await updateDiagram(pid, did, { data });
      dirty.current = false;
      toast.success('저장되었습니다.');
    } catch {
      toast.error('저장에 실패했습니다.');
    }
  };

  /* ── 캔버스: 노드 추가 ───────────── */
  const addNode = () => {
    const id = `node-${Date.now()}`;
    const colors = ['#4B88CE', '#34A853', '#FFD600', '#E23737', '#7627BB'];
    const newNode: CanvasNode = {
      id,
      x: 200 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      width: 140,
      height: 60,
      label: '새 노드',
      color: colors[canvasData.nodes.length % colors.length],
    };
    const updated = { ...canvasData, nodes: [...canvasData.nodes, newNode] };
    setCanvasData(updated);
    setSelectedNode(id);
    scheduleAutoSave(JSON.stringify(updated));
  };

  /* ── 캔버스: 노드 드래그 ──────────── */
  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const node = canvasData.nodes.find((n) => n.id === nodeId);
    if (!node) return;

    if (connecting) {
      // 연결 모드 → 엣지 추가
      if (connecting !== nodeId) {
        idCounter.current += 1;
        const edgeId = `edge-${idCounter.current}`;
        const edge: CanvasEdge = {
          id: edgeId,
          from: connecting,
          to: nodeId,
        };
        const updated = { ...canvasData, edges: [...canvasData.edges, edge] };
        setCanvasData(updated);
        scheduleAutoSave(JSON.stringify(updated));
      }
      setConnecting(null);
      return;
    }

    setSelectedNode(nodeId);
    setDragging({ id: nodeId, ox: e.clientX - node.x, oy: e.clientY - node.y });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging) return;
      const updated = {
        ...canvasData,
        nodes: canvasData.nodes.map((n) =>
          n.id === dragging.id
            ? { ...n, x: (e.clientX - dragging.ox) / zoom, y: (e.clientY - dragging.oy) / zoom }
            : n
        ),
      };
      setCanvasData(updated);
    },
    [dragging, canvasData, zoom]
  );

  const handleMouseUp = useCallback(() => {
    if (dragging) {
      scheduleAutoSave(JSON.stringify(canvasData));
    }
    setDragging(null);
  }, [dragging, canvasData, scheduleAutoSave]);

  /* ── 캔버스: 노드 삭제 ───────────── */
  const deleteNode = (id: string) => {
    const updated = {
      nodes: canvasData.nodes.filter((n) => n.id !== id),
      edges: canvasData.edges.filter((e) => e.from !== id && e.to !== id),
    };
    setCanvasData(updated);
    setSelectedNode(null);
    scheduleAutoSave(JSON.stringify(updated));
  };

  /* ── 캔버스: 엣지 삭제 ───────────── */
  const deleteEdge = (id: string) => {
    const updated = { ...canvasData, edges: canvasData.edges.filter((e) => e.id !== id) };
    setCanvasData(updated);
    scheduleAutoSave(JSON.stringify(updated));
  };

  /* ── 노드 라벨 수정 ──────────────── */
  const updateNodeLabel = (id: string, label: string) => {
    const updated = {
      ...canvasData,
      nodes: canvasData.nodes.map((n) => (n.id === id ? { ...n, label } : n)),
    };
    setCanvasData(updated);
    scheduleAutoSave(JSON.stringify(updated));
  };

  /* ── Mermaid 프리뷰 ──────────────── */
  const renderMermaid = (code: string) => {
    // 간단한 시퀀스 다이어그램 텍스트 렌더링
    // 실제로는 mermaid 라이브러리를 사용하지만, 여기서는 pre 태그로 표시
    return code;
  };

  if (loading || !diagram) {
    return (
      <S.Container>
        <S.EmptyState>로딩 중...</S.EmptyState>
      </S.Container>
    );
  }

  /* ── 시퀀스 다이어그램 (Mermaid 코드 에디터) ── */
  if (diagram.type === 'SEQUENCE') {
    return (
      <S.EditorContainer>
        <S.EditorTopBar>
          <S.BackButton onClick={() => navigate(`/project/${pid}/diagram`)}>
            ← 목록
          </S.BackButton>
          <S.EditorTitle>{diagram.title}</S.EditorTitle>
          <S.ActionButton onClick={handleSave}>저장</S.ActionButton>
        </S.EditorTopBar>
        <S.MermaidWrapper>
          <S.MermaidEditor
            value={mermaidCode}
            onChange={(e) => {
              setMermaidCode(e.target.value);
              scheduleAutoSave(e.target.value);
            }}
            spellCheck={false}
          />
          <S.MermaidPreview>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 13 }}>
              {renderMermaid(mermaidCode)}
            </pre>
          </S.MermaidPreview>
        </S.MermaidWrapper>
      </S.EditorContainer>
    );
  }

  /* ── 캔버스 기반 에디터 (FLOWCHART / ERD / MINDMAP) ── */
  const selectedNodeData = canvasData.nodes.find((n) => n.id === selectedNode);

  return (
    <S.EditorContainer>
      <S.EditorTopBar>
        <S.BackButton onClick={() => navigate(`/project/${pid}/diagram`)}>
          ← 목록
        </S.BackButton>
        <S.EditorTitle>{diagram.title}</S.EditorTitle>
        <S.ActionButton onClick={handleSave}>저장</S.ActionButton>
      </S.EditorTopBar>

      <S.ToolPanel>
        <S.ToolButton onClick={addNode}>+ 노드 추가</S.ToolButton>
        <S.ToolButton
          $active={!!connecting}
          onClick={() => setConnecting(connecting ? null : '__start__')}
        >
          {connecting ? '연결 취소' : '🔗 연결'}
        </S.ToolButton>
        <S.ToolButton onClick={() => setZoom((z) => Math.min(z + 0.1, 2))}>
          확대 +
        </S.ToolButton>
        <S.ToolButton onClick={() => setZoom((z) => Math.max(z - 0.1, 0.3))}>
          축소 −
        </S.ToolButton>
        <S.ToolButton onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>
          리셋
        </S.ToolButton>
      </S.ToolPanel>

      <S.CanvasArea
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => { if (!dragging) setSelectedNode(null); }}
      >
        <svg
          ref={canvasRef}
          width="100%"
          height="100%"
          style={{ cursor: dragging ? 'grabbing' : connecting ? 'crosshair' : 'default' }}
        >
          <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
            {/* 엣지 */}
            {canvasData.edges.map((edge) => {
              const fromNode = canvasData.nodes.find((n) => n.id === edge.from);
              const toNode = canvasData.nodes.find((n) => n.id === edge.to);
              if (!fromNode || !toNode) return null;
              const x1 = fromNode.x + fromNode.width / 2;
              const y1 = fromNode.y + fromNode.height / 2;
              const x2 = toNode.x + toNode.width / 2;
              const y2 = toNode.y + toNode.height / 2;
              return (
                <g key={edge.id}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#999"
                    strokeWidth={2}
                    markerEnd="url(#arrowhead)"
                  />
                  {/* 삭제 히트 영역 */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="transparent"
                    strokeWidth={12}
                    style={{ cursor: 'pointer' }}
                    onDoubleClick={() => deleteEdge(edge.id)}
                  />
                </g>
              );
            })}

            {/* Arrow marker */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="10"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#999" />
              </marker>
            </defs>

            {/* 노드 */}
            {canvasData.nodes.map((node) => (
              <g
                key={node.id}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
                style={{ cursor: connecting ? 'crosshair' : 'grab' }}
              >
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.width}
                  height={node.height}
                  rx={8}
                  fill={node.color + '22'}
                  stroke={selectedNode === node.id ? node.color : '#ccc'}
                  strokeWidth={selectedNode === node.id ? 2.5 : 1.5}
                />
                <text
                  x={node.x + node.width / 2}
                  y={node.y + node.height / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={13}
                  fill="#333"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {node.label}
                </text>
              </g>
            ))}
          </g>
        </svg>

        {/* 노드 속성 패널 */}
        {selectedNodeData && (
          <S.NodePanel onClick={(e) => e.stopPropagation()}>
            <S.NodePanelTitle>노드 속성</S.NodePanelTitle>
            <S.FieldLabel>라벨</S.FieldLabel>
            <S.ModalInput
              value={selectedNodeData.label}
              onChange={(e) => updateNodeLabel(selectedNodeData.id, e.target.value)}
            />
            <S.FieldLabel>색상</S.FieldLabel>
            <input
              type="color"
              value={selectedNodeData.color}
              onChange={(e) => {
                const updated = {
                  ...canvasData,
                  nodes: canvasData.nodes.map((n) =>
                    n.id === selectedNodeData.id ? { ...n, color: e.target.value } : n
                  ),
                };
                setCanvasData(updated);
                scheduleAutoSave(JSON.stringify(updated));
              }}
            />
            <div style={{ flex: 1 }} />
            <S.ToolButton
              onClick={() => {
                setConnecting(selectedNodeData.id);
                toast.success('연결할 노드를 클릭하세요.');
              }}
            >
              🔗 연결 시작
            </S.ToolButton>
            <S.DangerButton onClick={() => deleteNode(selectedNodeData.id)}>
              노드 삭제
            </S.DangerButton>
          </S.NodePanel>
        )}
      </S.CanvasArea>
    </S.EditorContainer>
  );
}

export default ProjectDiagramDetail;
