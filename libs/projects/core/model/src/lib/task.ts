// Task domain entity: a unit of work belonging to a project.

export type TaskStatus = 'todo' | 'doing' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  projectId: string;
  assigneeId?: string;
  createdAt: Date;
}

export interface NewTaskInput {
  id: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: Date;
  projectId: string;
  assigneeId?: string;
  now: Date;
}

export function createTask(input: NewTaskInput): Task {
  const title = input.title.trim();
  if (title.length === 0) {
    throw new Error('Task title must not be empty');
  }
  return {
    id: input.id,
    title,
    description: input.description?.trim() || undefined,
    status: 'todo',
    priority: input.priority ?? 'medium',
    dueDate: input.dueDate,
    projectId: input.projectId,
    assigneeId: input.assigneeId,
    createdAt: input.now,
  };
}

const ALLOWED_TRANSITIONS: Record<TaskStatus, readonly TaskStatus[]> = {
  todo: ['doing'],
  doing: ['todo', 'done'],
  done: ['doing'],
};

export function changeTaskStatus(task: Task, next: TaskStatus): Task {
  if (task.status === next) {
    return task;
  }
  if (!ALLOWED_TRANSITIONS[task.status].includes(next)) {
    throw new Error(`Cannot move task from ${task.status} to ${next}`);
  }
  return { ...task, status: next };
}

// Repository port implemented by the data layer's Drizzle adapter.
export interface TaskRepository {
  save(task: Task): Promise<void>;
  findById(id: string): Promise<Task | null>;
}
