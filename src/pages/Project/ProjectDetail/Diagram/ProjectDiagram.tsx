import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as S from './ProjectDiagram.styled';
import { getDiagrams, createDiagram, deleteDiagram } from '@/api/Project';
import { toast } from '@/store/toastStore';
import type { Diagram, DiagramType } from '@/types/project';

const TYPE_LABELS: Record<DiagramType, string> = {
  FLOWCHART: '플로우차트',
  ERD: 'ERD',
  SEQUENCE: '시퀀스',
  MINDMAP: '마인드맵',
};

function ProjectDiagram() {
  const { projectId } = useParams<{ projectId: string }>();
  const pid = Number(projectId);
  const navigate = useNavigate();

  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [loading, setLoading] = useState(true);

  // 모달
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<DiagramType>('FLOWCHART');

  useEffect(() => {
    getDiagrams(pid)
      .then(setDiagrams)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pid]);

  const handleCreate = async () => {
    if (!title.trim()) return;
    try {
      const d = await createDiagram(pid, {
        title: title.trim(),
        description: description.trim() || null,
        type,
        data: type === 'SEQUENCE' ? 'sequenceDiagram\n  Alice->>Bob: Hello' : '{}',
      });
      setDiagrams((prev) => [...prev, d]);
      toast.success('다이어그램이 생성되었습니다.');
      setShowModal(false);
      setTitle('');
      setDescription('');
      navigate(`/project/${pid}/diagram/${d.id}`);
    } catch {
      toast.error('다이어그램 생성에 실패했습니다.');
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteDiagram(pid, id);
      setDiagrams((prev) => prev.filter((d) => d.id !== id));
      toast.success('삭제되었습니다.');
    } catch {
      toast.error('삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <S.Container>
        <S.EmptyState>로딩 중...</S.EmptyState>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.Header>
        <S.Title>다이어그램</S.Title>
        <S.ActionButton onClick={() => setShowModal(true)}>+ 새 다이어그램</S.ActionButton>
      </S.Header>

      {diagrams.length === 0 ? (
        <S.EmptyState>다이어그램이 없습니다. 새 다이어그램을 만들어 보세요.</S.EmptyState>
      ) : (
        <S.Grid>
          {diagrams.map((d) => (
            <S.Card key={d.id} onClick={() => navigate(`/project/${pid}/diagram/${d.id}`)}>
              <S.CardTitle>{d.title}</S.CardTitle>
              {d.description && <S.CardDesc>{d.description}</S.CardDesc>}
              <S.CardMeta>
                <S.TypeBadge $type={d.type}>{TYPE_LABELS[d.type]}</S.TypeBadge>
                <S.DateText>
                  {new Date(d.updatedAt || d.createdAt).toLocaleDateString('ko-KR')}
                </S.DateText>
                <S.DangerButton
                  style={{ marginLeft: 'auto', padding: '4px 8px', fontSize: '11px' }}
                  onClick={(e) => handleDelete(e, d.id)}
                >
                  삭제
                </S.DangerButton>
              </S.CardMeta>
            </S.Card>
          ))}
        </S.Grid>
      )}

      {showModal && (
        <S.ModalOverlay onClick={() => setShowModal(false)}>
          <S.ModalBox onClick={(e) => e.stopPropagation()}>
            <S.ModalTitle>새 다이어그램</S.ModalTitle>
            <S.ModalInput
              placeholder="다이어그램 제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
            <S.ModalTextarea
              placeholder="설명 (선택)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <S.ModalSelect value={type} onChange={(e) => setType(e.target.value as DiagramType)}>
              <option value="FLOWCHART">플로우차트</option>
              <option value="ERD">ERD</option>
              <option value="SEQUENCE">시퀀스</option>
              <option value="MINDMAP">마인드맵</option>
            </S.ModalSelect>
            <S.ModalActions>
              <S.CancelButton onClick={() => setShowModal(false)}>취소</S.CancelButton>
              <S.ActionButton onClick={handleCreate}>만들기</S.ActionButton>
            </S.ModalActions>
          </S.ModalBox>
        </S.ModalOverlay>
      )}
    </S.Container>
  );
}

export default ProjectDiagram;
