import { createTask } from '@pm/projects-core-model';
import type {
  ProjectRepository,
  Task,
  TaskPriority,
  TaskRepository,
} from '@pm/projects-core-model';
import { NotFoundError } from '@pm/shared-kernel';
import type { Clock, IdGenerator } from '@pm/shared-kernel';

export interface AddTaskInput {
  projectId: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  assigneeId?: string;
  dueDate?: Date;
}

export interface AddTaskDeps {
  projectRepository: ProjectRepository;
  taskRepository: TaskRepository;
  clock: Clock;
  idGenerator: IdGenerator;
}

export async function addTaskUseCase(input: AddTaskInput, deps: AddTaskDeps): Promise<Task> {
  const project = await deps.projectRepository.findById(input.projectId);
  if (!project) {
    throw new NotFoundError('Project', input.projectId);
  }
  const task = createTask({
    id: deps.idGenerator.next(),
    title: input.title,
    description: input.description,
    priority: input.priority,
    assigneeId: input.assigneeId,
    dueDate: input.dueDate,
    projectId: input.projectId,
    now: deps.clock.now(),
  });
  await deps.taskRepository.save(task);
  return task;
}
