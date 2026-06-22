import type { TaskSummary } from './types';

// Module 03 starting point: status is read-only. You'll add the onStatusChange
// prop and the <select> back once the command path exists.
interface TaskListProps {
  tasks: TaskSummary[];
}

export function TaskList({ tasks }: TaskListProps) {
  return (
    <ul data-testid="task-list">
      {tasks.map((task) => (
        <li key={task.id} data-testid={`task-item-${task.id}`}>
          <span>{task.title}</span>
          <span> [{task.priority}]</span>
          <span data-testid={`task-status-${task.id}`}>{task.status}</span>
        </li>
      ))}
    </ul>
  );
}
