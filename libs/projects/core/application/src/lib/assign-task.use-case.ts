import { assignTask } from '@pm/projects-core-model';
import type { Task, TaskRepository } from '@pm/projects-core-model';
import { NotFoundError } from '@pm/shared-kernel';

export interface AssignTaskInput {
  taskId: string;
  assigneeId: string;
}

export interface AssignTaskDeps {
  taskRepository: TaskRepository;
}

export async function assignTaskUseCase(
  input: AssignTaskInput,
  deps: AssignTaskDeps,
): Promise<Task> {
  const task = await deps.taskRepository.findById(input.taskId);
  if (!task) {
    throw new NotFoundError('Task', input.taskId);
  }
  const assigned = assignTask(task, input.assigneeId);
  await deps.taskRepository.save(assigned);
  return assigned;
}
