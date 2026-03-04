import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as S from './ProjectDocs.styled';
import { getDoc } from '@/api/Project';
import { toast } from '@/store/toastStore';
import type { ProjectDoc } from '@/types/project';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';

const md = new MarkdownIt({ html: false, linkify: true, typographer: true });

function ProjectDocDetail() {
  const { projectId, docId } = useParams<{ projectId: string; docId: string }>();
  const navigate = useNavigate();
  const pid = Number(projectId);
  const did = Number(docId);
  const [doc, setDoc] = useState<ProjectDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoc(pid, did)
      .then(setDoc)
      .catch(() => {
        toast.error('문서를 찾을 수 없습니다.');
        navigate(`/project/${pid}/docs`);
      })
      .finally(() => setLoading(false));
  }, [pid, did]);

  if (loading) {
    return (
      <S.ContentArea>
        <S.EmptyState>로딩 중...</S.EmptyState>
      </S.ContentArea>
    );
  }

  if (!doc) return null;

  const html = DOMPurify.sanitize(md.render(doc.content));

  return (
    <S.ContentArea>
      <S.ContentHeader>
        <S.DocTitle>{doc.title}</S.DocTitle>
        <S.ContentActions>
          <S.ActionButton onClick={() => navigate(`/project/${pid}/docs/${did}/edit`)}>
            편집
          </S.ActionButton>
          <S.ActionButton onClick={() => navigate(`/project/${pid}/docs`)}>
            목록
          </S.ActionButton>
        </S.ContentActions>
      </S.ContentHeader>
      <S.EditorArea>
        <S.MarkdownPreview dangerouslySetInnerHTML={{ __html: html }} />
      </S.EditorArea>
      <S.MetaInfo>
        <S.MetaText>최종 수정: {doc.updatedAt}</S.MetaText>
      </S.MetaInfo>
    </S.ContentArea>
  );
}

export default ProjectDocDetail;
