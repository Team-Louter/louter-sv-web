import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as S from './ProjectDocs.styled';
import { getDoc, createDoc, updateDoc } from '@/api/Project';
import { toast } from '@/store/toastStore';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';

const md = new MarkdownIt({ html: false, linkify: true, typographer: true });

function ProjectDocEdit() {
  const { projectId, docId } = useParams<{ projectId: string; docId: string }>();
  const navigate = useNavigate();
  const pid = Number(projectId);
  const isNew = !docId;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (!isNew && docId) {
      getDoc(pid, Number(docId))
        .then((doc) => {
          setTitle(doc.title);
          setContent(doc.content);
        })
        .catch(() => {
          toast.error('문서를 불러올 수 없습니다.');
          navigate(`/project/${pid}/docs`);
        })
        .finally(() => setLoading(false));
    }
  }, [pid, docId, isNew]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.warning('제목을 입력해주세요.');
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        const doc = await createDoc(pid, {
          title: title.trim(),
          content,
          parentFolderId: null,
        });
        toast.success('문서가 생성되었습니다.');
        navigate(`/project/${pid}/docs/${doc.id}`);
      } else {
        await updateDoc(pid, Number(docId), { title: title.trim(), content });
        toast.success('문서가 저장되었습니다.');
        navigate(`/project/${pid}/docs/${docId}`);
      }
    } catch {
      toast.error('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <S.ContentArea>
        <S.EmptyState>로딩 중...</S.EmptyState>
      </S.ContentArea>
    );
  }

  const html = DOMPurify.sanitize(md.render(content));

  return (
    <S.ContentArea>
      <S.ContentHeader>
        <input
          style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            border: 'none',
            outline: 'none',
            flex: 1,
            padding: 0,
            background: 'transparent',
          }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="문서 제목"
        />
        <S.ContentActions>
          <S.ActionButton onClick={() => navigate(`/project/${pid}/docs`)}>
            취소
          </S.ActionButton>
          <S.PrimaryButton onClick={handleSave} disabled={saving || !title.trim()}>
            {saving ? '저장 중...' : isNew ? '만들기' : '저장'}
          </S.PrimaryButton>
        </S.ContentActions>
      </S.ContentHeader>
      <S.TabRow>
        <S.Tab $active={activeTab === 'edit'} onClick={() => setActiveTab('edit')}>
          편집
        </S.Tab>
        <S.Tab $active={activeTab === 'preview'} onClick={() => setActiveTab('preview')}>
          미리보기
        </S.Tab>
      </S.TabRow>
      <S.EditorArea>
        {activeTab === 'edit' ? (
          <S.MarkdownEditor
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Markdown으로 작성하세요..."
          />
        ) : (
          <S.MarkdownPreview dangerouslySetInnerHTML={{ __html: html }} />
        )}
      </S.EditorArea>
    </S.ContentArea>
  );
}

export default ProjectDocEdit;
