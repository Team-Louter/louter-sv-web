import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import * as S from './ProjectDocs.styled';
import {
  getDocTree,
  getDoc,
  createDoc,
  updateDoc,
  deleteDoc,
  createFolder,
  deleteFolder,
  getDocVersions,
  restoreDocVersion,
} from '@/api/Project';
import { toast } from '@/store/toastStore';
import type { DocNode, ProjectDoc, DocVersion } from '@/types/project';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';

const md = new MarkdownIt({ html: false, linkify: true, typographer: true });

function ProjectDocs() {
  const { projectId } = useParams<{ projectId: string }>();
  const pid = Number(projectId);

  const [tree, setTree] = useState<DocNode[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [currentDoc, setCurrentDoc] = useState<ProjectDoc | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('preview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());

  // 모달
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newName, setNewName] = useState('');

  // 버전 히스토리
  const [showVersions, setShowVersions] = useState(false);
  const [versions, setVersions] = useState<DocVersion[]>([]);

  const fetchTree = useCallback(async () => {
    try {
      const data = await getDocTree(pid);
      setTree(data);
    } catch {
      // 조용히 실패 처리
    } finally {
      setLoading(false);
    }
  }, [pid]);

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  const handleSelectDoc = async (docId: number) => {
    setSelectedDocId(docId);
    try {
      const doc = await getDoc(pid, docId);
      setCurrentDoc(doc);
      setEditContent(doc.content);
      setEditTitle(doc.title);
    } catch {
      toast.error('문서를 불러올 수 없습니다.');
    }
  };

  const handleSave = async () => {
    if (!currentDoc || !selectedDocId) return;
    setSaving(true);
    try {
      await updateDoc(pid, selectedDocId, {
        title: editTitle,
        content: editContent,
      });
      setCurrentDoc({ ...currentDoc, title: editTitle, content: editContent });
      toast.success('문서가 저장되었습니다.');
    } catch {
      toast.error('문서 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateDoc = async () => {
    if (!newName.trim()) return;
    try {
      const doc = await createDoc(pid, {
        title: newName.trim(),
        content: '',
        parentFolderId: null,
      });
      toast.success('문서가 생성되었습니다.');
      setShowNewDocModal(false);
      setNewName('');
      await fetchTree();
      handleSelectDoc(doc.id);
    } catch {
      toast.error('문서 생성에 실패했습니다.');
    }
  };

  const handleCreateFolder = async () => {
    if (!newName.trim()) return;
    try {
      await createFolder(pid, { name: newName.trim(), parentId: null });
      toast.success('폴더가 생성되었습니다.');
      setShowNewFolderModal(false);
      setNewName('');
      await fetchTree();
    } catch {
      toast.error('폴더 생성에 실패했습니다.');
    }
  };

  const handleDeleteDoc = async () => {
    if (!selectedDocId || !confirm('이 문서를 삭제하시겠습니까?')) return;
    try {
      await deleteDoc(pid, selectedDocId);
      toast.success('문서가 삭제되었습니다.');
      setSelectedDocId(null);
      setCurrentDoc(null);
      await fetchTree();
    } catch {
      toast.error('문서 삭제에 실패했습니다.');
    }
  };

  const handleDeleteFolder = async (folderId: number) => {
    if (!confirm('이 폴더를 삭제하시겠습니까? 하위 문서도 삭제됩니다.')) return;
    try {
      await deleteFolder(pid, folderId);
      toast.success('폴더가 삭제되었습니다.');
      await fetchTree();
    } catch {
      toast.error('폴더 삭제에 실패했습니다.');
    }
  };
  void handleDeleteFolder;

  const handleShowVersions = async () => {
    if (!selectedDocId) return;
    try {
      const data = await getDocVersions(pid, selectedDocId);
      setVersions(data);
      setShowVersions(true);
    } catch {
      toast.error('버전 내역을 불러올 수 없습니다.');
    }
  };

  const handleRestoreVersion = async (versionId: number) => {
    if (!selectedDocId || !confirm('이 버전으로 복원하시겠습니까?')) return;
    try {
      await restoreDocVersion(pid, selectedDocId, versionId);
      toast.success('복원되었습니다.');
      setShowVersions(false);
      handleSelectDoc(selectedDocId);
    } catch {
      toast.error('복원에 실패했습니다.');
    }
  };

  const toggleFolder = (id: number) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderTree = (nodes: DocNode[], depth = 0): React.ReactNode => {
    return nodes
      .filter((node) => {
        if (!searchQuery) return true;
        return node.name.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .map((node) => {
        if (node.type === 'folder') {
          const isExpanded = expandedFolders.has(node.id);
          return (
            <div key={`folder-${node.id}`}>
              <S.TreeItem $depth={depth} onClick={() => toggleFolder(node.id)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {isExpanded ? (
                    <polyline points="6 9 12 15 18 9" />
                  ) : (
                    <polyline points="9 18 15 12 9 6" />
                  )}
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
                <S.TreeItemName>{node.name}</S.TreeItemName>
              </S.TreeItem>
              {isExpanded && renderTree(node.children, depth + 1)}
            </div>
          );
        }

        return (
          <S.TreeItem
            key={`doc-${node.id}`}
            $depth={depth}
            $active={selectedDocId === node.id}
            onClick={() => handleSelectDoc(node.id)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <S.TreeItemName>{node.name}</S.TreeItemName>
          </S.TreeItem>
        );
      });
  };

  const renderMarkdown = (content: string) => {
    const html = md.render(content);
    return DOMPurify.sanitize(html);
  };

  return (
    <S.Container>
      {/* 파일 트리 사이드바 */}
      <S.TreeSidebar>
        <S.TreeHeader>
          <S.TreeTitle>문서</S.TreeTitle>
          <S.TreeActions>
            <S.TreeButton
              title="새 문서"
              onClick={() => {
                setNewName('');
                setShowNewDocModal(true);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            </S.TreeButton>
            <S.TreeButton
              title="새 폴더"
              onClick={() => {
                setNewName('');
                setShowNewFolderModal(true);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                <line x1="12" y1="11" x2="12" y2="17" />
                <line x1="9" y1="14" x2="15" y2="14" />
              </svg>
            </S.TreeButton>
          </S.TreeActions>
        </S.TreeHeader>
        <S.TreeSearch
          placeholder="문서 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <S.TreeBody>
          {loading ? (
            <S.EmptyState>로딩 중...</S.EmptyState>
          ) : tree.length === 0 ? (
            <S.EmptyState style={{ padding: 20, fontSize: 13 }}>
              문서가 없습니다.
              <br />
              + 새 문서를 눌러 시작하세요.
            </S.EmptyState>
          ) : (
            renderTree(tree)
          )}
        </S.TreeBody>
      </S.TreeSidebar>

      {/* 메인 컨텐츠 */}
      <S.ContentArea>
        {!currentDoc ? (
          <S.EmptyState>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span>왼쪽 트리에서 문서를 선택하세요</span>
          </S.EmptyState>
        ) : (
          <>
            <S.ContentHeader>
              <S.DocTitle>{editTitle}</S.DocTitle>
              <S.ContentActions>
                <S.ActionButton onClick={handleShowVersions}>
                  버전 히스토리
                </S.ActionButton>
                <S.DangerButton onClick={handleDeleteDoc}>삭제</S.DangerButton>
                <S.PrimaryButton onClick={handleSave} disabled={saving}>
                  {saving ? '저장 중...' : '저장'}
                </S.PrimaryButton>
              </S.ContentActions>
            </S.ContentHeader>
            <S.TabRow>
              <S.Tab
                $active={activeTab === 'edit'}
                onClick={() => setActiveTab('edit')}
              >
                편집
              </S.Tab>
              <S.Tab
                $active={activeTab === 'preview'}
                onClick={() => setActiveTab('preview')}
              >
                미리보기
              </S.Tab>
            </S.TabRow>
            <S.EditorArea>
              {activeTab === 'edit' ? (
                <S.MarkdownEditor
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Markdown으로 작성하세요..."
                />
              ) : (
                <S.MarkdownPreview
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(editContent),
                  }}
                />
              )}
            </S.EditorArea>
            <S.MetaInfo>
              <S.MetaText>최종 수정: {currentDoc.updatedAt}</S.MetaText>
            </S.MetaInfo>
          </>
        )}
      </S.ContentArea>

      {/* 새 문서 모달 */}
      {showNewDocModal && (
        <S.ModalOverlay onClick={() => setShowNewDocModal(false)}>
          <S.ModalBox onClick={(e) => e.stopPropagation()}>
            <S.ModalTitle>새 문서</S.ModalTitle>
            <S.ModalInput
              placeholder="문서 제목"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreateDoc()}
            />
            <S.ModalActions>
              <S.ActionButton onClick={() => setShowNewDocModal(false)}>
                취소
              </S.ActionButton>
              <S.PrimaryButton onClick={handleCreateDoc}>만들기</S.PrimaryButton>
            </S.ModalActions>
          </S.ModalBox>
        </S.ModalOverlay>
      )}

      {/* 새 폴더 모달 */}
      {showNewFolderModal && (
        <S.ModalOverlay onClick={() => setShowNewFolderModal(false)}>
          <S.ModalBox onClick={(e) => e.stopPropagation()}>
            <S.ModalTitle>새 폴더</S.ModalTitle>
            <S.ModalInput
              placeholder="폴더 이름"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
            />
            <S.ModalActions>
              <S.ActionButton onClick={() => setShowNewFolderModal(false)}>
                취소
              </S.ActionButton>
              <S.PrimaryButton onClick={handleCreateFolder}>만들기</S.PrimaryButton>
            </S.ModalActions>
          </S.ModalBox>
        </S.ModalOverlay>
      )}

      {/* 버전 히스토리 패널 */}
      {showVersions && (
        <S.VersionPanel>
          <S.VersionHeader>
            <S.VersionTitle>버전 히스토리</S.VersionTitle>
            <S.CloseButton onClick={() => setShowVersions(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </S.CloseButton>
          </S.VersionHeader>
          <S.VersionList>
            {versions.length === 0 ? (
              <S.EmptyState style={{ padding: 20 }}>
                버전 내역이 없습니다.
              </S.EmptyState>
            ) : (
              versions.map((v) => (
                <S.VersionItem
                  key={v.id}
                  onClick={() => handleRestoreVersion(v.id)}
                >
                  <S.VersionDate>{v.savedAt}</S.VersionDate>
                  <S.VersionBy>저장자: #{v.savedBy}</S.VersionBy>
                </S.VersionItem>
              ))
            )}
          </S.VersionList>
        </S.VersionPanel>
      )}
    </S.Container>
  );
}

export default ProjectDocs;
