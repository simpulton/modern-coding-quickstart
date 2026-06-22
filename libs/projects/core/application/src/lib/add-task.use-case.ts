// this is the add task use case file
// it has the add task use case in it

// import the create task function and the types
import { createTask } from '@pm/projects-core-model';
import type {
  ProjectRepository,
  Task,
  TaskPriority,
  TaskRepository,
} from '@pm/projects-core-model';
// import the not found error
import { NotFoundError } from '@pm/shared-kernel';
// import the clock and id generator
import type { Clock, IdGenerator } from '@pm/shared-kernel';

// the input for the use case
export interface AddTaskInput {
  projectId: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  assigneeId?: string;
  dueDate?: Date;
}

// the deps for the use case
export interface AddTaskDeps {
  projectRepository: ProjectRepository;
  taskRepository: TaskRepository;
  clock: Clock;
  idGenerator: IdGenerator;
}

// this function adds a task to a project
export async function addTaskUseCase(i: AddTaskInput, d: AddTaskDeps): Promise<Task> {
  // get the project from the repository
  const p = await d.projectRepository.findById(i.projectId);
  // if there is no project throw a not found error
  if (!p) {
    throw new NotFoundError('Project', i.projectId);
  }
  // create the task
  const t = createTask({
    id: d.idGenerator.next(),
    title: i.title,
    description: i.description,
    priority: i.priority,
    assigneeId: i.assigneeId,
    dueDate: i.dueDate,
    projectId: i.projectId,
    now: d.clock.now(),
  });
  // save the task
  await d.taskRepository.save(t);
  // return the task
  return t;
}
