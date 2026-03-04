import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as S from './ProjectSchema.styled';
import { getSchemas, createSchema, deleteSchema } from '@/api/Project';
import { toast } from '@/store/toastStore';
import type { DbSchema, SqlDialect } from '@/types/project';

function ProjectSchema() {
  const { projectId } = useParams<{ projectId: string }>();
  const pid = Number(projectId);
  const navigate = useNavigate();

  const [schemas, setSchemas] = useState<DbSchema[]>([]);
  const [loading, setLoading] = useState(true);

  // 모달
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dialect, setDialect] = useState<SqlDialect>('MYSQL');

  useEffect(() => {
    getSchemas(pid)
      .then(setSchemas)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pid]);

  const handleCreate = async () => {
    if (!title.trim()) return;
    try {
      const schema = await createSchema(pid, {
        title: title.trim(),
        description: description.trim() || null,
        dialect,
        tables: [],
        relations: [],
      });
      setSchemas((prev) => [...prev, schema]);
      toast.success('스키마가 생성되었습니다.');
      setShowModal(false);
      setTitle('');
      setDescription('');
      navigate(`/project/${pid}/schema/${schema.id}`);
    } catch {
      toast.error('스키마 생성에 실패했습니다.');
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteSchema(pid, id);
      setSchemas((prev) => prev.filter((s) => s.id !== id));
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
        <S.Title>DB 스키마</S.Title>
        <S.ActionButton onClick={() => setShowModal(true)}>+ 새 스키마</S.ActionButton>
      </S.Header>

      {schemas.length === 0 ? (
        <S.EmptyState>스키마가 없습니다. 새 스키마를 만들어 보세요.</S.EmptyState>
      ) : (
        <S.Grid>
          {schemas.map((s) => (
            <S.Card key={s.id} onClick={() => navigate(`/project/${pid}/schema/${s.id}`)}>
              <S.CardTitle>{s.title}</S.CardTitle>
              {s.description && <S.CardDesc>{s.description}</S.CardDesc>}
              <S.CardMeta>
                <S.DialectBadge $dialect={s.dialect}>{s.dialect}</S.DialectBadge>
                <S.DateText>
                  테이블 {s.tables.length}개
                </S.DateText>
                <S.DangerButton
                  style={{ marginLeft: 'auto', padding: '4px 8px', fontSize: '11px' }}
                  onClick={(e) => handleDelete(e, s.id)}
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
            <S.ModalTitle>새 DB 스키마</S.ModalTitle>
            <S.ModalInput
              placeholder="스키마 제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
            <S.ModalTextarea
              placeholder="설명 (선택)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <S.ModalSelect
              value={dialect}
              onChange={(e) => setDialect(e.target.value as SqlDialect)}
            >
              <option value="MYSQL">MySQL</option>
              <option value="POSTGRESQL">PostgreSQL</option>
              <option value="MSSQL">MSSQL</option>
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

export default ProjectSchema;
