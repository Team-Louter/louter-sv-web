import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as S from './ProjectOverview.styled';
import { useProjectStore } from '@/store/projectStore';
import { getTasks, getEpics } from '@/api/Project';
import { toast } from '@/store/toastStore';
import { deleteProject, updateProject } from '@/api/Project';
import type { Task, Epic } from '@/types/project';

function ProjectOverview() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { currentProject, setCurrentProject } = useProjectStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const pid = Number(projectId);

  useEffect(() => {
    if (!pid) return;
    Promise.all([getTasks(pid), getEpics(pid)])
      .then(([t, e]) => {
        setTasks(t);
        setEpics(e);
      })
      .catch(() => {
        // 조용히 실패 처리
      })
      .finally(() => setLoading(false));
  }, [pid]);

  const doneTasks = tasks.filter((t) => t.status === 'DONE').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const reviewTasks = tasks.filter((t) => t.status === 'REVIEW').length;
  const _todoTasks = tasks.filter((t) => t.status === 'TODO').length;
  void _todoTasks;
  const totalPct = tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0;

  const handleDelete = async () => {
    if (!confirm('프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    try {
      await deleteProject(pid);
      toast.success('프로젝트가 삭제되었습니다.');
      navigate('/project');
    } catch {
      toast.error('프로젝트 삭제에 실패했습니다.');
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setEditTitle(currentProject?.title ?? '');
    setEditDesc(currentProject?.description ?? '');
  };

  const handleSaveEdit = async () => {
    try {
      await updateProject(pid, {
        title: editTitle.trim(),
        description: editDesc.trim() || null,
      });
      if (currentProject) {
        setCurrentProject({
          ...currentProject,
          title: editTitle.trim(),
          description: editDesc.trim() || null,
        });
      }
      toast.success('프로젝트 정보가 수정되었습니다.');
      setEditing(false);
    } catch {
      toast.error('수정에 실패했습니다.');
    }
  };

  return (
    <S.Container>
      <S.Header>
        {editing ? (
          <S.EditableTitle
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
          />
        ) : (
          <S.Title>{currentProject?.title ?? '프로젝트'}</S.Title>
        )}
        <S.Actions>
          {editing ? (
            <>
              <S.ActionButton onClick={() => setEditing(false)}>취소</S.ActionButton>
              <S.ActionButton onClick={handleSaveEdit}>저장</S.ActionButton>
            </>
          ) : (
            <>
              <S.ActionButton onClick={handleEdit}>편집</S.ActionButton>
              <S.DangerButton onClick={handleDelete}>삭제</S.DangerButton>
            </>
          )}
        </S.Actions>
      </S.Header>

      {/* 설명 */}
      {editing ? (
        <S.DescriptionArea
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          placeholder="프로젝트 설명을 입력하세요"
        />
      ) : (
        <S.Description>
          {currentProject?.description || '프로젝트 설명이 없습니다.'}
        </S.Description>
      )}

      {/* 통계 카드 */}
      <S.StatsGrid>
        <S.StatCard>
          <S.StatLabel>전체 TASK</S.StatLabel>
          <S.StatValue>{tasks.length}</S.StatValue>
        </S.StatCard>
        <S.StatCard>
          <S.StatLabel>완료</S.StatLabel>
          <S.StatValue>{doneTasks}</S.StatValue>
        </S.StatCard>
        <S.StatCard>
          <S.StatLabel>진행중</S.StatLabel>
          <S.StatValue>{inProgressTasks}</S.StatValue>
        </S.StatCard>
        <S.StatCard>
          <S.StatLabel>검토</S.StatLabel>
          <S.StatValue>{reviewTasks}</S.StatValue>
        </S.StatCard>
      </S.StatsGrid>

      {/* 전체 진행률 */}
      <S.Section>
        <S.SectionTitle>전체 진행률</S.SectionTitle>
        <S.ProgressBarWrapper>
          <S.ProgressLabel>
            <S.ProgressLabelText>
              {doneTasks} / {tasks.length} 완료
            </S.ProgressLabelText>
            <S.ProgressPct>{totalPct}%</S.ProgressPct>
          </S.ProgressLabel>
          <S.ProgressTrack>
            <S.ProgressFill $pct={totalPct} />
          </S.ProgressTrack>
        </S.ProgressBarWrapper>
      </S.Section>

      <S.TwoCol>
        {/* 최근 TASK */}
        <S.Section>
          <S.SectionTitle>최근 TASK</S.SectionTitle>
          {tasks.length === 0 && !loading ? (
            <S.EmptyBox>등록된 TASK가 없습니다.</S.EmptyBox>
          ) : (
            <S.RecentList>
              {tasks.slice(0, 5).map((task) => (
                <S.RecentItem
                  key={task.id}
                  onClick={() => navigate(`/project/${pid}/tasks`)}
                >
                  <S.RecentIcon>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 11 12 14 22 4" />
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                  </S.RecentIcon>
                  <S.RecentInfo>
                    <S.RecentTitle>{task.title}</S.RecentTitle>
                    <S.RecentMeta>
                      {task.status} · {task.priority}
                      {task.dueDate ? ` · ~${task.dueDate}` : ''}
                    </S.RecentMeta>
                  </S.RecentInfo>
                </S.RecentItem>
              ))}
            </S.RecentList>
          )}
        </S.Section>

        {/* Epic별 진행률 */}
        <S.Section>
          <S.SectionTitle>Epic별 진행률</S.SectionTitle>
          {epics.length === 0 && !loading ? (
            <S.EmptyBox>등록된 Epic이 없습니다.</S.EmptyBox>
          ) : (
            <S.RecentList>
              {epics.map((epic) => {
                const epicDone = epic.tasks.filter((t) => t.status === 'DONE').length;
                const epicPct = epic.tasks.length > 0 ? Math.round((epicDone / epic.tasks.length) * 100) : 0;
                return (
                  <S.ProgressBarWrapper key={epic.id}>
                    <S.ProgressLabel>
                      <S.ProgressLabelText>
                        {epic.title}
                      </S.ProgressLabelText>
                      <S.ProgressPct>
                        {epicDone}/{epic.tasks.length} ({epicPct}%)
                      </S.ProgressPct>
                    </S.ProgressLabel>
                    <S.ProgressTrack>
                      <S.ProgressFill $pct={epicPct} />
                    </S.ProgressTrack>
                  </S.ProgressBarWrapper>
                );
              })}
            </S.RecentList>
          )}
        </S.Section>
      </S.TwoCol>

      {/* 팀원 목록 */}
      <S.Section>
        <S.SectionTitle>팀원</S.SectionTitle>
        {currentProject && currentProject.members.length > 0 ? (
          <S.MemberGrid>
            {currentProject.members.map((m) => (
              <S.MemberCard key={m.userId}>
                <S.Avatar
                  src={m.profileImageUrl}
                  alt={m.userName}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ccc"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 00-16 0"/></svg>';
                  }}
                />
                <S.MemberInfo>
                  <S.MemberName>{m.userName}</S.MemberName>
                  <S.MemberRole>{m.role}</S.MemberRole>
                </S.MemberInfo>
              </S.MemberCard>
            ))}
          </S.MemberGrid>
        ) : (
          <S.EmptyBox>팀원이 없습니다.</S.EmptyBox>
        )}
      </S.Section>
    </S.Container>
  );
}

export default ProjectOverview;
