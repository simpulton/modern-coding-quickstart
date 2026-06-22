import { changeTaskStatus } from '@pm/projects-core-model';
import type { Task, TaskRepository, TaskStatus } from '@pm/projects-core-model';
import { NotFoundError } from '@pm/shared-kernel';

export interface UpdateTaskStatusInput {
  taskId: string;
  status: TaskStatus;
}

export interface UpdateTaskStatusDeps {
  taskRepository: TaskRepository;
}

export async function updateTaskStatusUseCase(
  input: UpdateTaskStatusInput,
  deps: UpdateTaskStatusDeps,
): Promise<Task> {
  const task = await deps.taskRepository.findById(input.taskId);
  if (!task) {
    throw new NotFoundError('Task', input.taskId);
  }
  const updated = changeTaskStatus(task, input.status);
  await deps.taskRepository.save(updated);
  return updated;
}
