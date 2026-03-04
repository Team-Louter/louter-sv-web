import { create } from 'zustand';
import type { Project, Task, TaskStatus, DocNode } from '@/types/project';

interface ProjectStore {
  // 현재 열려 있는 프로젝트
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;

  // TASK 인메모리 캐시 (칸반 낙관적 업데이트용)
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  updateTaskStatus: (taskId: number, status: TaskStatus) => void;
  addTask: (task: Task) => void;
  removeTask: (taskId: number) => void;
  updateTask: (taskId: number, data: Partial<Task>) => void;

  // 칸반 보기 필터
  filterAssignee: number | null;
  filterPriority: string | null;
  setFilterAssignee: (id: number | null) => void;
  setFilterPriority: (priority: string | null) => void;

  // 문서 트리
  docTree: DocNode[];
  setDocTree: (tree: DocNode[]) => void;

  // 선택된 TASK (사이드 패널)
  selectedTaskId: number | null;
  setSelectedTaskId: (id: number | null) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  currentProject: null,
  setCurrentProject: (project) => set({ currentProject: project }),

  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  updateTaskStatus: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status } : t
      ),
    })),
  addTask: (task) =>
    set((state) => ({ tasks: [...state.tasks, task] })),
  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    })),
  updateTask: (taskId, data) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, ...data } : t
      ),
    })),

  filterAssignee: null,
  filterPriority: null,
  setFilterAssignee: (id) => set({ filterAssignee: id }),
  setFilterPriority: (priority) => set({ filterPriority: priority }),

  docTree: [],
  setDocTree: (tree) => set({ docTree: tree }),

  selectedTaskId: null,
  setSelectedTaskId: (id) => set({ selectedTaskId: id }),
}));
