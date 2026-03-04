import { useEffect } from 'react';
import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom';
import * as S from './ProjectLayout.styled';
import { getProject } from '@/api/Project';
import { useProjectStore } from '@/store/projectStore';
import { toast } from '@/store/toastStore';

const NAV = [
  {
    label: 'Overview',
    path: '',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: '다이어그램',
    path: 'diagram',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="3" x2="6" y2="15" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="M18 9a9 9 0 0 1-9 9" />
      </svg>
    ),
  },
  {
    label: 'DB 스키마',
    path: 'schema',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  {
    label: '문서',
    path: 'docs',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    label: 'Tasks',
    path: 'tasks',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    label: '진행도',
    path: 'progress',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
];

function ProjectLayout() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentProject, setCurrentProject } = useProjectStore();

  useEffect(() => {
    if (!projectId) return;
    const id = Number(projectId);
    if (Number.isNaN(id)) {
      navigate('/project');
      return;
    }

    getProject(id)
      .then(setCurrentProject)
      .catch(() => {
        toast.error('프로젝트를 불러올 수 없습니다.');
        navigate('/project');
      });

    return () => setCurrentProject(null);
  }, [projectId]);

  const basePath = `/project/${projectId}`;

  const isActive = (subPath: string) => {
    const full = subPath ? `${basePath}/${subPath}` : basePath;
    if (subPath === '') {
      return location.pathname === basePath || location.pathname === `${basePath}/`;
    }
    return location.pathname.startsWith(full);
  };

  return (
    <S.Wrapper>
      <S.Sidebar>
        <S.ProjectTitle>{currentProject?.title ?? '프로젝트'}</S.ProjectTitle>
        <S.NavList>
          {NAV.map(({ label, path, icon }) => (
            <S.NavItem
              key={path}
              $active={isActive(path)}
              onClick={() => navigate(path ? `${basePath}/${path}` : basePath)}
            >
              {icon}
              {label}
            </S.NavItem>
          ))}
        </S.NavList>

        {currentProject && currentProject.members.length > 0 && (
          <S.MemberSection>
            <S.MemberLabel>팀원 ({currentProject.members.length})</S.MemberLabel>
            <S.MemberList>
              {currentProject.members.slice(0, 6).map((m) => (
                <S.MemberItem key={m.userId}>
                  <S.MemberAvatar
                    src={m.profileImageUrl}
                    alt={m.userName}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ccc"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 00-16 0"/></svg>';
                    }}
                  />
                  <S.MemberName>{m.userName}</S.MemberName>
                  <S.RoleBadge>{m.role}</S.RoleBadge>
                </S.MemberItem>
              ))}
            </S.MemberList>
          </S.MemberSection>
        )}
      </S.Sidebar>
      <S.Content>
        <Outlet />
      </S.Content>
    </S.Wrapper>
  );
}

export default ProjectLayout;
