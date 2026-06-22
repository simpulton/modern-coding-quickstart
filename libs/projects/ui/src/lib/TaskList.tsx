'use client';

import type { TaskSummary } from './types';

type TaskStatus = 'todo' | 'doing' | 'done';

interface TaskListProps {
  tasks: TaskSummary[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

export function TaskList({ tasks, onStatusChange }: TaskListProps) {
  return (
    <ul data-testid="task-list">
      {tasks.map((task) => (
        <li key={task.id} data-testid={`task-item-${task.id}`}>
          <span>{task.title}</span>
          <span> [{task.priority}]</span>
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
            data-testid={`task-status-${task.id}`}
          >
            <option value="todo">Todo</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </select>
        </li>
      ))}
    </ul>
  );
}
