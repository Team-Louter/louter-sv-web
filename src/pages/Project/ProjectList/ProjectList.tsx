import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './ProjectList.styled';
import { getProjects, createProject } from '@/api/Project';
import { toast } from '@/store/toastStore';
import type { Project } from '@/types/project';

function ProjectList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch {
      toast.error('프로젝트 목록을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setCreating(true);
    try {
      const project = await createProject({
        title: title.trim(),
        description: description.trim() || null,
      });
      toast.success('프로젝트가 생성되었습니다.');
      setShowModal(false);
      setTitle('');
      setDescription('');
      navigate(`/project/${project.id}`);
    } catch {
      toast.error('프로젝트 생성에 실패했습니다.');
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <S.Container>
      <S.Inner>
        <S.Header>
          <S.Title>내 프로젝트</S.Title>
          <S.CreateButton onClick={() => setShowModal(true)}>
            + 새 프로젝트
          </S.CreateButton>
        </S.Header>

        {loading ? (
          <S.Grid>
            {Array.from({ length: 4 }).map((_, i) => (
              <S.SkeletonCard key={i}>
                <S.SkeletonLine $width="70%" $height="20px" />
                <S.SkeletonLine $width="100%" $height="14px" />
                <S.SkeletonLine $width="60%" $height="14px" />
                <S.SkeletonLine $width="40%" $height="12px" />
              </S.SkeletonCard>
            ))}
          </S.Grid>
        ) : projects.length === 0 ? (
          <S.EmptyState>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <span>아직 프로젝트가 없어요. 첫 번째 프로젝트를 만들어보세요!</span>
          </S.EmptyState>
        ) : (
          <S.Grid>
            {projects.map((project) => (
              <S.Card
                key={project.id}
                onClick={() => navigate(`/project/${project.id}`)}
              >
                <S.CardTitle>{project.title}</S.CardTitle>
                <S.CardDescription>
                  {project.description || '설명이 없습니다.'}
                </S.CardDescription>
                <S.CardFooter>
                  <S.MemberAvatars>
                    {project.members.slice(0, 4).map((m) => (
                      <img
                        key={m.userId}
                        src={m.profileImageUrl}
                        alt={m.userName}
                        title={m.userName}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ccc"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 00-16 0"/></svg>';
                        }}
                      />
                    ))}
                    {project.members.length > 4 && (
                      <span style={{ fontSize: 12, color: '#8A95A0', marginLeft: 4 }}>
                        +{project.members.length - 4}
                      </span>
                    )}
                  </S.MemberAvatars>
                  <S.DateText>{formatDate(project.updatedAt)}</S.DateText>
                </S.CardFooter>
              </S.Card>
            ))}
          </S.Grid>
        )}
      </S.Inner>

      {/* 프로젝트 생성 모달 */}
      {showModal && (
        <S.ModalOverlay onClick={() => setShowModal(false)}>
          <S.ModalBox onClick={(e) => e.stopPropagation()}>
            <S.ModalTitle>새 프로젝트 만들기</S.ModalTitle>
            <S.Input
              placeholder="프로젝트 이름"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <S.Textarea
              placeholder="프로젝트 설명 (선택)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <S.ModalActions>
              <S.CancelButton onClick={() => setShowModal(false)}>
                취소
              </S.CancelButton>
              <S.SubmitButton
                disabled={!title.trim() || creating}
                onClick={handleCreate}
              >
                {creating ? '생성 중...' : '만들기'}
              </S.SubmitButton>
            </S.ModalActions>
          </S.ModalBox>
        </S.ModalOverlay>
      )}
    </S.Container>
  );
}

export default ProjectList;
