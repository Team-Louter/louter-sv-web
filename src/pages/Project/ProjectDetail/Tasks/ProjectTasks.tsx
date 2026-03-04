import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import * as S from './ProjectTasks.styled';
import {
  getTasks,
  createTask,
  updateTaskStatus as apiUpdateTaskStatus,
  updateTask as apiUpdateTask,
  deleteTask,
} from '@/api/Project';
import { useProjectStore } from '@/store/projectStore';
import { toast } from '@/store/toastStore';
import type { Task, TaskStatus, TaskPriority, ServerTask } from '@/types/project';

const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'TODO', label: 'TODO', color: '#8A95A0' },
  { status: 'IN_PROGRESS', label: 'IN PROGRESS', color: '#4B88CE' },
  { status: 'REVIEW', label: 'REVIEW', color: '#FFD600' },
  { status: 'DONE', label: 'DONE', color: '#5DBC86' },
];

const PRIORITIES: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

function ProjectTasks() {
  const { projectId } = useParams<{ projectId: string }>();
  const pid = Number(projectId);
  const { tasks, setTasks, selectedTaskId, setSelectedTaskId, currentProject } =
    useProjectStore();
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterAssignee, setFilterAssignee] = useState<number | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('');

  // 드래그 상태
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);

  // 새 TASK 폼
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('MEDIUM');
  const [newDueDate, setNewDueDate] = useState('');
  const [newLabels, setNewLabels] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const data = await getTasks(pid);
      setTasks(data);
    } catch {
      toast.error('TASK 목록을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  }, [pid, setTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = tasks.filter((t) => {
    if (filterAssignee && !t.assignees.some((a) => a.userId === filterAssignee))
      return false;
    if (filterPriority && t.priority !== filterPriority) return false;
    return true;
  });

  const tasksByStatus = (status: TaskStatus) =>
    filteredTasks.filter((t) => t.status === status);

  // ── 드래그 & 드롭 ────────────────────
  const handleDragStart = (taskId: number) => {
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetStatus: TaskStatus) => {
    if (!draggedTaskId) return;
    const task = tasks.find((t) => t.id === draggedTaskId);
    if (!task || task.status === targetStatus) {
      setDraggedTaskId(null);
      return;
    }

    // 낙관적 업데이트
    useProjectStore.getState().updateTaskStatus(draggedTaskId, targetStatus);
    setDraggedTaskId(null);

    try {
      await apiUpdateTaskStatus(pid, draggedTaskId, targetStatus);
    } catch {
      toast.error('상태 변경에 실패했습니다.');
      fetchTasks(); // 롤백
    }
  };

  // ── TASK 생성 ────────────────────────
  const handleCreateTask = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const serverTask: ServerTask = {
        projectId: pid,
        epicId: null,
        sprintId: null,
        parentTaskId: null,
        title: newTitle.trim(),
        description: newDesc.trim() || null,
        status: 'TODO',
        priority: newPriority,
        labels: newLabels
          .split(',')
          .map((l) => l.trim())
          .filter(Boolean),
        startDate: null,
        dueDate: newDueDate || null,
        storyPoint: null,
        assigneeIds: [],
      };
      const created = await createTask(pid, serverTask);
      useProjectStore.getState().addTask(created);
      toast.success('TASK가 생성되었습니다.');
      setShowCreateModal(false);
      resetForm();
    } catch {
      toast.error('TASK 생성에 실패했습니다.');
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setNewTitle('');
    setNewDesc('');
    setNewPriority('MEDIUM');
    setNewDueDate('');
    setNewLabels('');
  };

  // ── TASK 삭제 ────────────────────────
  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('이 TASK를 삭제하시겠습니까?')) return;
    try {
      await deleteTask(pid, taskId);
      useProjectStore.getState().removeTask(taskId);
      setSelectedTaskId(null);
      toast.success('TASK가 삭제되었습니다.');
    } catch {
      toast.error('TASK 삭제에 실패했습니다.');
    }
  };

  // ── 선택된 TASK 패널 ─────────────────
  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  // 패널 내 TASK 업데이트
  const [editingTask, setEditingTask] = useState<Partial<Task>>({});

  useEffect(() => {
    if (selectedTask) {
      setEditingTask({
        title: selectedTask.title,
        description: selectedTask.description,
        status: selectedTask.status,
        priority: selectedTask.priority,
        dueDate: selectedTask.dueDate,
        labels: selectedTask.labels,
      });
    }
  }, [selectedTaskId]);

  const handleSaveTask = async () => {
    if (!selectedTaskId || !editingTask.title?.trim()) return;
    try {
      await apiUpdateTask(pid, selectedTaskId, {
        title: editingTask.title!.trim(),
        description: editingTask.description ?? null,
        status: editingTask.status as TaskStatus,
        priority: editingTask.priority as TaskPriority,
        dueDate: editingTask.dueDate ?? null,
        labels: editingTask.labels ?? [],
        projectId: pid,
        epicId: selectedTask?.epicId ?? null,
        sprintId: selectedTask?.sprintId ?? null,
        parentTaskId: selectedTask?.parentTaskId ?? null,
        startDate: selectedTask?.startDate ?? null,
        storyPoint: selectedTask?.storyPoint ?? null,
        assigneeIds: selectedTask?.assignees.map((a) => a.userId) ?? [],
      });
      useProjectStore.getState().updateTask(selectedTaskId, editingTask);
      toast.success('TASK가 수정되었습니다.');
      setSelectedTaskId(null);
    } catch {
      toast.error('TASK 수정에 실패했습니다.');
    }
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  // ── 리스트 뷰: 담당자별 묶음 ──────────
  const groupedByAssignee = () => {
    const map = new Map<string, Task[]>();
    filteredTasks.forEach((task) => {
      if (task.assignees.length === 0) {
        const key = '미지정';
        map.set(key, [...(map.get(key) || []), task]);
      } else {
        task.assignees.forEach((a) => {
          map.set(a.userName, [...(map.get(a.userName) || []), task]);
        });
      }
    });
    return map;
  };

  if (loading) {
    return (
      <S.Container>
        <S.Header>
          <S.Title>Tasks</S.Title>
        </S.Header>
        <S.EmptyState>로딩 중...</S.EmptyState>
      </S.Container>
    );
  }

  return (
    <S.Container>
      {/* 상단 툴바 */}
      <S.Header>
        <S.Title>Tasks</S.Title>
        <S.ToolRow>
          <S.ViewToggle
            $active={view === 'kanban'}
            onClick={() => setView('kanban')}
          >
            칸반
          </S.ViewToggle>
          <S.ViewToggle
            $active={view === 'list'}
            onClick={() => setView('list')}
          >
            리스트
          </S.ViewToggle>
          <S.FilterSelect
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value || '')}
          >
            <option value="">우선순위 전체</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </S.FilterSelect>
          {currentProject && currentProject.members.length > 0 && (
            <S.FilterSelect
              value={filterAssignee ?? ''}
              onChange={(e) =>
                setFilterAssignee(e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">담당자 전체</option>
              {currentProject.members.map((m) => (
                <option key={m.userId} value={m.userId}>
                  {m.userName}
                </option>
              ))}
            </S.FilterSelect>
          )}
          <S.AddButton onClick={() => setShowCreateModal(true)}>
            + 새 TASK
          </S.AddButton>
        </S.ToolRow>
      </S.Header>

      {/* 칸반 뷰 */}
      {view === 'kanban' && (
        <S.BoardWrapper>
          {COLUMNS.map(({ status, label, color }) => {
            const columnTasks = tasksByStatus(status);
            return (
              <S.Column key={status}>
                <S.ColumnHeader $color={color}>
                  <S.ColumnTitle>{label}</S.ColumnTitle>
                  <S.ColumnCount>{columnTasks.length}</S.ColumnCount>
                </S.ColumnHeader>
                <S.ColumnBody
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(status)}
                >
                  {columnTasks.map((task) => (
                    <S.TaskCard
                      key={task.id}
                      $dragging={draggedTaskId === task.id}
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                      onClick={() => setSelectedTaskId(task.id)}
                    >
                      <S.TaskTitle>{task.title}</S.TaskTitle>
                      <S.TaskMeta>
                        <S.PriorityBadge $priority={task.priority}>
                          {task.priority}
                        </S.PriorityBadge>
                        {task.labels.slice(0, 2).map((l) => (
                          <S.LabelTag key={l}>{l}</S.LabelTag>
                        ))}
                      </S.TaskMeta>
                      <S.TaskFooter>
                        <S.AssigneeAvatars>
                          {task.assignees.slice(0, 3).map((a) => (
                            <img
                              key={a.userId}
                              src={a.profileImageUrl}
                              alt={a.userName}
                              title={a.userName}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ccc"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 00-16 0"/></svg>';
                              }}
                            />
                          ))}
                        </S.AssigneeAvatars>
                        {task.dueDate && (
                          <S.DueDate $overdue={isOverdue(task.dueDate)}>
                            ~{task.dueDate}
                          </S.DueDate>
                        )}
                      </S.TaskFooter>
                    </S.TaskCard>
                  ))}
                  <S.ColumnAddButton onClick={() => setShowCreateModal(true)}>
                    + 추가
                  </S.ColumnAddButton>
                </S.ColumnBody>
              </S.Column>
            );
          })}
        </S.BoardWrapper>
      )}

      {/* 리스트 뷰 */}
      {view === 'list' && (
        <S.ListView>
          {filteredTasks.length === 0 ? (
            <S.EmptyState>등록된 TASK가 없습니다.</S.EmptyState>
          ) : (
            Array.from(groupedByAssignee().entries()).map(
              ([assigneeName, assigneeTasks]) => (
                <S.ListGroup key={assigneeName}>
                  <S.ListGroupTitle>
                    담당자: {assigneeName} ({assigneeTasks.length})
                  </S.ListGroupTitle>
                  {assigneeTasks.map((task) => (
                    <S.ListRow
                      key={task.id}
                      onClick={() => setSelectedTaskId(task.id)}
                    >
                      <S.PriorityBadge $priority={task.priority}>
                        {task.priority}
                      </S.PriorityBadge>
                      <S.ListTitle>{task.title}</S.ListTitle>
                      <S.ListStatus>{task.status}</S.ListStatus>
                      <S.ListDue>
                        {task.dueDate ? `~${task.dueDate}` : '-'}
                      </S.ListDue>
                    </S.ListRow>
                  ))}
                </S.ListGroup>
              )
            )
          )}
        </S.ListView>
      )}

      {/* TASK 생성 모달 */}
      {showCreateModal && (
        <S.ModalOverlay onClick={() => setShowCreateModal(false)}>
          <S.ModalBox onClick={(e) => e.stopPropagation()}>
            <S.ModalTitle>새 TASK 만들기</S.ModalTitle>
            <S.PanelInput
              placeholder="TASK 제목"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
            />
            <S.PanelTextarea
              placeholder="설명 (선택)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
            <S.PanelField>
              <S.PanelFieldLabel>우선순위</S.PanelFieldLabel>
              <S.PanelSelect
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </S.PanelSelect>
            </S.PanelField>
            <S.PanelField>
              <S.PanelFieldLabel>마감일</S.PanelFieldLabel>
              <S.PanelInput
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
              />
            </S.PanelField>
            <S.PanelField>
              <S.PanelFieldLabel>라벨 (쉼표로 구분)</S.PanelFieldLabel>
              <S.PanelInput
                placeholder="backend, api, design"
                value={newLabels}
                onChange={(e) => setNewLabels(e.target.value)}
              />
            </S.PanelField>
            <S.ModalActions>
              <S.PanelCancelButton onClick={() => setShowCreateModal(false)}>
                취소
              </S.PanelCancelButton>
              <S.PanelSaveButton
                disabled={!newTitle.trim() || creating}
                onClick={handleCreateTask}
              >
                {creating ? '생성 중...' : '만들기'}
              </S.PanelSaveButton>
            </S.ModalActions>
          </S.ModalBox>
        </S.ModalOverlay>
      )}

      {/* TASK 상세 사이드 패널 */}
      {selectedTask && (
        <>
          <S.PanelOverlay onClick={() => setSelectedTaskId(null)} />
          <S.Panel>
            <S.PanelHeader>
              <S.PanelTitle
                value={editingTask.title ?? ''}
                onChange={(e) =>
                  setEditingTask((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="TASK 제목"
              />
              <S.PanelCloseButton onClick={() => setSelectedTaskId(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </S.PanelCloseButton>
            </S.PanelHeader>
            <S.PanelBody>
              <S.PanelField>
                <S.PanelFieldLabel>상태</S.PanelFieldLabel>
                <S.PanelSelect
                  value={editingTask.status ?? 'TODO'}
                  onChange={(e) =>
                    setEditingTask((prev) => ({
                      ...prev,
                      status: e.target.value as TaskStatus,
                    }))
                  }
                >
                  {COLUMNS.map(({ status, label }) => (
                    <option key={status} value={status}>
                      {label}
                    </option>
                  ))}
                </S.PanelSelect>
              </S.PanelField>

              <S.PanelField>
                <S.PanelFieldLabel>우선순위</S.PanelFieldLabel>
                <S.PanelSelect
                  value={editingTask.priority ?? 'MEDIUM'}
                  onChange={(e) =>
                    setEditingTask((prev) => ({
                      ...prev,
                      priority: e.target.value as TaskPriority,
                    }))
                  }
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </S.PanelSelect>
              </S.PanelField>

              <S.PanelField>
                <S.PanelFieldLabel>담당자</S.PanelFieldLabel>
                <S.AssigneeAvatars>
                  {selectedTask.assignees.map((a) => (
                    <img
                      key={a.userId}
                      src={a.profileImageUrl}
                      alt={a.userName}
                      title={a.userName}
                      style={{ width: 28, height: 28 }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ccc"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 00-16 0"/></svg>';
                      }}
                    />
                  ))}
                  {selectedTask.assignees.length === 0 && (
                    <span style={{ fontSize: 13, color: '#8A95A0' }}>
                      미지정
                    </span>
                  )}
                </S.AssigneeAvatars>
              </S.PanelField>

              <S.PanelField>
                <S.PanelFieldLabel>마감일</S.PanelFieldLabel>
                <S.PanelInput
                  type="date"
                  value={editingTask.dueDate ?? ''}
                  onChange={(e) =>
                    setEditingTask((prev) => ({
                      ...prev,
                      dueDate: e.target.value || null,
                    }))
                  }
                />
              </S.PanelField>

              <S.PanelField>
                <S.PanelFieldLabel>라벨</S.PanelFieldLabel>
                <S.LabelsRow>
                  {(editingTask.labels ?? []).map((label, i) => (
                    <S.LabelTag key={i}>{label}</S.LabelTag>
                  ))}
                </S.LabelsRow>
              </S.PanelField>

              <S.PanelField>
                <S.PanelFieldLabel>설명</S.PanelFieldLabel>
                <S.PanelTextarea
                  value={editingTask.description ?? ''}
                  onChange={(e) =>
                    setEditingTask((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="상세 설명을 입력하세요..."
                />
              </S.PanelField>

              {/* 서브 TASK - 부모의 하위 TASK들 */}
              {tasks.filter((t) => t.parentTaskId === selectedTask.id).length >
                0 && (
                <S.PanelField>
                  <S.PanelFieldLabel>서브 TASK</S.PanelFieldLabel>
                  <S.SubTaskList>
                    {tasks
                      .filter((t) => t.parentTaskId === selectedTask.id)
                      .map((sub) => (
                        <S.SubTaskItem key={sub.id}>
                          <input
                            type="checkbox"
                            checked={sub.status === 'DONE'}
                            onChange={async () => {
                              const newStatus =
                                sub.status === 'DONE' ? 'TODO' : 'DONE';
                              useProjectStore
                                .getState()
                                .updateTaskStatus(sub.id, newStatus);
                              try {
                                await apiUpdateTaskStatus(
                                  pid,
                                  sub.id,
                                  newStatus
                                );
                              } catch {
                                fetchTasks();
                              }
                            }}
                          />
                          <span
                            style={{
                              textDecoration:
                                sub.status === 'DONE'
                                  ? 'line-through'
                                  : 'none',
                            }}
                          >
                            {sub.title}
                          </span>
                        </S.SubTaskItem>
                      ))}
                  </S.SubTaskList>
                </S.PanelField>
              )}

              {/* 메타 정보 */}
              <S.PanelField>
                <S.PanelFieldLabel>생성자</S.PanelFieldLabel>
                <span style={{ fontSize: 14, color: '#333' }}>
                  {selectedTask.reporter?.userName ?? '-'}
                </span>
              </S.PanelField>
              <S.PanelField>
                <S.PanelFieldLabel>생성일</S.PanelFieldLabel>
                <span style={{ fontSize: 14, color: '#8A95A0' }}>
                  {selectedTask.createdAt}
                </span>
              </S.PanelField>
            </S.PanelBody>

            <S.PanelFooter>
              <S.PanelDeleteButton
                onClick={() => handleDeleteTask(selectedTask.id)}
              >
                삭제
              </S.PanelDeleteButton>
              <S.PanelCancelButton onClick={() => setSelectedTaskId(null)}>
                취소
              </S.PanelCancelButton>
              <S.PanelSaveButton onClick={handleSaveTask}>
                저장
              </S.PanelSaveButton>
            </S.PanelFooter>
          </S.Panel>
        </>
      )}
    </S.Container>
  );
}

export default ProjectTasks;
