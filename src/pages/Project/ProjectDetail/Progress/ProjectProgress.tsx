import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import * as S from './ProjectProgress.styled';
import { getTasks, getEpics, getSprints, createEpic, createSprint } from '@/api/Project';
import { toast } from '@/store/toastStore';
import { useProjectStore } from '@/store/projectStore';
import type { Task, Epic, Sprint } from '@/types/project';

type TabType = 'overview' | 'gantt' | 'burndown' | 'stats';

function ProjectProgress() {
  const { projectId } = useParams<{ projectId: string }>();
  const pid = Number(projectId);
  const { currentProject } = useProjectStore();

  const [tab, setTab] = useState<TabType>('overview');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [_sprints, setSprints] = useState<Sprint[]>([]);
  void _sprints;
  const [loading, setLoading] = useState(true);

  // 모달
  const [showEpicModal, setShowEpicModal] = useState(false);
  const [showSprintModal, setShowSprintModal] = useState(false);
  const [epicTitle, setEpicTitle] = useState('');
  const [epicColor, setEpicColor] = useState('#FFD600');
  const [sprintTitle, setSprintTitle] = useState('');
  const [sprintStart, setSprintStart] = useState('');
  const [sprintEnd, setSprintEnd] = useState('');

  useEffect(() => {
    Promise.all([getTasks(pid), getEpics(pid), getSprints(pid)])
      .then(([t, e, s]) => {
        setTasks(t);
        setEpics(e);
        setSprints(s);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pid]);

  const doneTasks = tasks.filter((t) => t.status === 'DONE').length;
  const totalPct = tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0;

  // ── Epic 생성 ────────────────────
  const handleCreateEpic = async () => {
    if (!epicTitle.trim()) return;
    try {
      const epic = await createEpic(pid, {
        title: epicTitle.trim(),
        description: null,
        colorTag: epicColor,
        startDate: null,
        endDate: null,
      });
      setEpics((prev) => [...prev, epic]);
      toast.success('Epic이 생성되었습니다.');
      setShowEpicModal(false);
      setEpicTitle('');
    } catch {
      toast.error('Epic 생성에 실패했습니다.');
    }
  };

  // ── Sprint 생성 ──────────────────
  const handleCreateSprint = async () => {
    if (!sprintTitle.trim() || !sprintStart || !sprintEnd) return;
    try {
      const sprint = await createSprint(pid, {
        title: sprintTitle.trim(),
        startDate: sprintStart,
        endDate: sprintEnd,
        epicId: null,
      });
      setSprints((prev) => [...prev, sprint]);
      toast.success('Sprint가 생성되었습니다.');
      setShowSprintModal(false);
      setSprintTitle('');
    } catch {
      toast.error('Sprint 생성에 실패했습니다.');
    }
  };

  // ── 간트 차트 데이터 ──────────────
  const ganttData = useMemo(() => {
    const allDates = tasks.flatMap((t) => [t.startDate, t.dueDate].filter(Boolean) as string[]);
    if (allDates.length === 0) return { days: [], tasks: [], startDate: '' };

    const sorted = allDates.sort();
    const start = new Date(sorted[0]);
    const end = new Date(sorted[sorted.length - 1]);
    // 여유 추가
    start.setDate(start.getDate() - 2);
    end.setDate(end.getDate() + 2);

    const days: { label: string; date: Date; isWeekend: boolean }[] = [];
    const cur = new Date(start);
    while (cur <= end) {
      days.push({
        label: `${cur.getMonth() + 1}/${cur.getDate()}`,
        date: new Date(cur),
        isWeekend: cur.getDay() === 0 || cur.getDay() === 6,
      });
      cur.setDate(cur.getDate() + 1);
    }

    const startMs = start.getTime();
    const rangeMs = end.getTime() - startMs;

    const mapped = tasks
      .filter((t) => t.startDate || t.dueDate)
      .map((t) => {
        const s = t.startDate ? new Date(t.startDate).getTime() : new Date(t.dueDate!).getTime();
        const e = t.dueDate ? new Date(t.dueDate).getTime() : s + 86400000;
        const leftPct = ((s - startMs) / rangeMs) * 100;
        const widthPct = Math.max(((e - s) / rangeMs) * 100, 2);
        return { ...t, leftPct, widthPct };
      });

    return { days, tasks: mapped, startDate: start.toISOString().slice(0, 10) };
  }, [tasks]);

  // ── 번다운 차트 데이터 ────────────
  const burndownData = useMemo(() => {
    if (tasks.length === 0) return { points: [], idealPoints: [] };

    // 전체 기간 기준으로 매일 남은 TASK 수 계산
    const allDates = tasks.flatMap((t) => [t.startDate, t.dueDate, t.createdAt].filter(Boolean) as string[]);
    if (allDates.length === 0) return { points: [], idealPoints: [] };

    const sorted = allDates.map((d) => d.slice(0, 10)).sort();
    const start = sorted[0];
    const end = sorted[sorted.length - 1];

    const days: string[] = [];
    const cur = new Date(start);
    const endDate = new Date(end);
    while (cur <= endDate) {
      days.push(cur.toISOString().slice(0, 10));
      cur.setDate(cur.getDate() + 1);
    }

    if (days.length === 0) return { points: [], idealPoints: [] };

    const total = tasks.length;
    // 이상적인 번다운
    const idealPoints = days.map((_, i) => ({
      x: i,
      y: total - (total / (days.length - 1)) * i,
    }));

    // 실제 번다운 — 각 날짜까지 DONE 상태인 TASK 수
    const points = days.map((day, i) => {
      const doneByDay = tasks.filter(
        (t) => t.status === 'DONE' && t.updatedAt && t.updatedAt.slice(0, 10) <= day
      ).length;
      return { x: i, y: total - doneByDay };
    });

    return { points, idealPoints, days, total };
  }, [tasks]);

  // ── 팀원별 기여도 ────────────────
  const memberStats = useMemo(() => {
    if (!currentProject) return [];
    return currentProject.members.map((m) => {
      const memberTasks = tasks.filter((t) =>
        t.assignees.some((a) => a.userId === m.userId)
      );
      const done = memberTasks.filter((t) => t.status === 'DONE').length;
      const inProgress = memberTasks.filter((t) => t.status === 'IN_PROGRESS').length;
      const todo = memberTasks.filter(
        (t) => t.status === 'TODO' || t.status === 'REVIEW'
      ).length;
      const pct = memberTasks.length > 0 ? Math.round((done / memberTasks.length) * 100) : 0;
      return { ...m, total: memberTasks.length, done, inProgress, todo, pct };
    });
  }, [tasks, currentProject]);

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
        <S.Title>진행도 관리</S.Title>
        <S.TabRow>
          {(['overview', 'gantt', 'burndown', 'stats'] as TabType[]).map((t) => (
            <S.TabButton key={t} $active={tab === t} onClick={() => setTab(t)}>
              {t === 'overview' ? '개요' : t === 'gantt' ? '간트 차트' : t === 'burndown' ? '번다운' : '기여도'}
            </S.TabButton>
          ))}
          <S.ActionButton onClick={() => setShowEpicModal(true)}>
            + Epic
          </S.ActionButton>
          <S.ActionButton onClick={() => setShowSprintModal(true)}>
            + Sprint
          </S.ActionButton>
        </S.TabRow>
      </S.Header>

      {/* ── 개요 탭 ──────────────────── */}
      {tab === 'overview' && (
        <S.OverviewSection>
          <S.ProgressCard>
            <S.ProgressTitle>프로젝트 전체 진행률</S.ProgressTitle>
            <S.ProgressBarRow>
              <S.ProgressTrack>
                <S.ProgressFill $pct={totalPct} />
              </S.ProgressTrack>
              <S.ProgressPct>{totalPct}%</S.ProgressPct>
            </S.ProgressBarRow>
          </S.ProgressCard>

          <S.SectionTitle>Epic별 달성률</S.SectionTitle>
          {epics.length === 0 ? (
            <S.EmptyState>등록된 Epic이 없습니다.</S.EmptyState>
          ) : (
            <S.EpicList>
              {epics.map((epic) => {
                const epicDone = epic.tasks.filter((t) => t.status === 'DONE').length;
                const epicPct = epic.tasks.length > 0 ? Math.round((epicDone / epic.tasks.length) * 100) : 0;
                return (
                  <S.EpicRow key={epic.id}>
                    <S.EpicHeader>
                      <S.EpicTitle>
                        {epic.title}
                        {epicPct === 100 && <S.DoneTag>✅</S.DoneTag>}
                      </S.EpicTitle>
                      <S.EpicMeta>
                        TASK {epicDone}/{epic.tasks.length}
                      </S.EpicMeta>
                    </S.EpicHeader>
                    <S.ProgressBarRow>
                      <S.ProgressTrack>
                        <S.ProgressFill $pct={epicPct} $color={epic.colorTag} />
                      </S.ProgressTrack>
                      <S.ProgressPct>{epicPct}%</S.ProgressPct>
                    </S.ProgressBarRow>
                  </S.EpicRow>
                );
              })}
            </S.EpicList>
          )}
        </S.OverviewSection>
      )}

      {/* ── 간트 차트 탭 ────────────── */}
      {tab === 'gantt' && (
        <>
          {ganttData.days.length === 0 ? (
            <S.EmptyState>날짜가 있는 TASK가 없습니다.</S.EmptyState>
          ) : (
            <S.GanttWrapper>
              <S.GanttTable>
                <S.GanttHeaderRow>
                  <S.GanttLabelCol>TASK</S.GanttLabelCol>
                  <S.GanttTimelineHeader>
                    {ganttData.days.map((d, i) => (
                      <S.GanttDayCell key={i} $isWeekend={d.isWeekend}>
                        {d.label}
                      </S.GanttDayCell>
                    ))}
                  </S.GanttTimelineHeader>
                </S.GanttHeaderRow>
                {ganttData.tasks.map((task) => (
                  <S.GanttRow key={task.id}>
                    <S.GanttRowLabel $indent={task.parentTaskId ? 1 : 0}>
                      {task.title}
                    </S.GanttRowLabel>
                    <S.GanttTimeline>
                      {ganttData.days.map((d, i) => (
                        <S.GanttDayBg key={i} $isWeekend={d.isWeekend} />
                      ))}
                      <S.GanttBar
                        $left={task.leftPct}
                        $width={task.widthPct}
                        $color={task.priority === 'CRITICAL' ? '#E23737' : task.priority === 'HIGH' ? '#FFD600' : '#4B88CE'}
                        $done={task.status === 'DONE'}
                      />
                    </S.GanttTimeline>
                  </S.GanttRow>
                ))}
              </S.GanttTable>
            </S.GanttWrapper>
          )}
        </>
      )}

      {/* ── 번다운 차트 탭 ──────────── */}
      {tab === 'burndown' && (
        <S.ChartCard>
          <S.ChartTitle>번다운 차트</S.ChartTitle>
          {burndownData.points.length === 0 ? (
            <S.EmptyState>데이터가 부족합니다.</S.EmptyState>
          ) : (
            <S.ChartSvg viewBox="0 0 600 260" preserveAspectRatio="xMidYMid meet">
              {/* 그리드 */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={`grid-${i}`}
                  className="grid-line"
                  x1="40"
                  y1={40 + i * 50}
                  x2="580"
                  y2={40 + i * 50}
                />
              ))}

              {/* Y축 라벨 */}
              {burndownData.total !== undefined &&
                [0, 1, 2, 3, 4].map((i) => {
                  const val = Math.round(
                    burndownData.total! - (burndownData.total! / 4) * i
                  );
                  return (
                    <text
                      key={`y-${i}`}
                      className="axis-label"
                      x="35"
                      y={45 + i * 50}
                      textAnchor="end"
                      fontSize="10"
                    >
                      {val}
                    </text>
                  );
                })}

              {/* 이상적인 선 */}
              <polyline
                className="ideal-line"
                fill="none"
                points={burndownData.idealPoints
                  .map((p) => {
                    const x = 40 + (p.x / (burndownData.points.length - 1 || 1)) * 540;
                    const y = 40 + ((burndownData.total! - p.y) / burndownData.total!) * 200;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />

              {/* 실제 선 */}
              <polyline
                className="actual-line"
                fill="none"
                points={burndownData.points
                  .map((p) => {
                    const x = 40 + (p.x / (burndownData.points.length - 1 || 1)) * 540;
                    const y = 40 + ((burndownData.total! - p.y) / burndownData.total!) * 200;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />

              {/* 범례 */}
              <line x1="420" y1="250" x2="440" y2="250" className="ideal-line" />
              <text x="445" y="254" className="axis-label" fontSize="10">이상적</text>
              <line x1="490" y1="250" x2="510" y2="250" className="actual-line" />
              <text x="515" y="254" className="axis-label" fontSize="10">실제</text>
            </S.ChartSvg>
          )}
        </S.ChartCard>
      )}

      {/* ── 기여도 탭 ────────────────── */}
      {tab === 'stats' && (
        <>
          <S.SectionTitle>팀원별 기여도</S.SectionTitle>
          {memberStats.length === 0 ? (
            <S.EmptyState>팀원 데이터가 없습니다.</S.EmptyState>
          ) : (
            <S.StatsTable>
              <thead>
                <tr>
                  <th>팀원</th>
                  <th>담당 TASK</th>
                  <th>완료</th>
                  <th>진행중</th>
                  <th>TODO</th>
                  <th>달성률</th>
                </tr>
              </thead>
              <tbody>
                {memberStats.map((m) => (
                  <tr key={m.userId}>
                    <td>{m.userName}</td>
                    <td>{m.total}</td>
                    <td>{m.done}</td>
                    <td>{m.inProgress}</td>
                    <td>{m.todo}</td>
                    <td>
                      <S.SmallBar>
                        <S.SmallTrack>
                          <S.SmallFill $pct={m.pct} />
                        </S.SmallTrack>
                        <S.SmallPct>{m.pct}%</S.SmallPct>
                      </S.SmallBar>
                    </td>
                  </tr>
                ))}
              </tbody>
            </S.StatsTable>
          )}
        </>
      )}

      {/* Epic 생성 모달 */}
      {showEpicModal && (
        <S.ModalOverlay onClick={() => setShowEpicModal(false)}>
          <S.ModalBox onClick={(e) => e.stopPropagation()}>
            <S.ModalTitle>새 Epic</S.ModalTitle>
            <S.ModalInput
              placeholder="Epic 제목"
              value={epicTitle}
              onChange={(e) => setEpicTitle(e.target.value)}
              autoFocus
            />
            <S.FormField>
              <S.FieldLabel>컬러 태그</S.FieldLabel>
              <input
                type="color"
                value={epicColor}
                onChange={(e) => setEpicColor(e.target.value)}
              />
            </S.FormField>
            <S.ModalActions>
              <S.CancelButton onClick={() => setShowEpicModal(false)}>
                취소
              </S.CancelButton>
              <S.ActionButton onClick={handleCreateEpic}>만들기</S.ActionButton>
            </S.ModalActions>
          </S.ModalBox>
        </S.ModalOverlay>
      )}

      {/* Sprint 생성 모달 */}
      {showSprintModal && (
        <S.ModalOverlay onClick={() => setShowSprintModal(false)}>
          <S.ModalBox onClick={(e) => e.stopPropagation()}>
            <S.ModalTitle>새 Sprint</S.ModalTitle>
            <S.ModalInput
              placeholder="Sprint 제목"
              value={sprintTitle}
              onChange={(e) => setSprintTitle(e.target.value)}
              autoFocus
            />
            <S.FormField>
              <S.FieldLabel>시작일</S.FieldLabel>
              <S.ModalInput
                type="date"
                value={sprintStart}
                onChange={(e) => setSprintStart(e.target.value)}
              />
            </S.FormField>
            <S.FormField>
              <S.FieldLabel>종료일</S.FieldLabel>
              <S.ModalInput
                type="date"
                value={sprintEnd}
                onChange={(e) => setSprintEnd(e.target.value)}
              />
            </S.FormField>
            <S.ModalActions>
              <S.CancelButton onClick={() => setShowSprintModal(false)}>
                취소
              </S.CancelButton>
              <S.ActionButton onClick={handleCreateSprint}>만들기</S.ActionButton>
            </S.ModalActions>
          </S.ModalBox>
        </S.ModalOverlay>
      )}
    </S.Container>
  );
}

export default ProjectProgress;
