import { z } from 'zod';
import type { Container } from 'inversify';
import { protectedProcedure, publicProcedure, router } from '@pm/shared-trpc';
import { SHARED_TOKENS } from '@pm/shared-kernel';
import type { Clock, IdGenerator } from '@pm/shared-kernel';
import type { ProjectRepository, TaskRepository } from '@pm/projects-core-model';
import {
  addCommentUseCase,
  addTaskUseCase,
  assignTaskUseCase,
  createProjectUseCase,
  deleteProjectUseCase,
  updateProjectUseCase,
  updateTaskStatusUseCase,
} from '@pm/projects-core-application';
import {
  getProjectDetail,
  listComments,
  listProjects,
  listTasks,
  PROJECTS_TOKENS,
} from '@pm/projects-data';
import type { Database } from '@pm/projects-data';
import type { CommentRepository } from '@pm/projects-core-model';

function db(container: Container): Database {
  return container.get<Database>(SHARED_TOKENS.Database);
}

function projectRepository(container: Container): ProjectRepository {
  return container.get<ProjectRepository>(PROJECTS_TOKENS.ProjectRepository);
}

function taskRepository(container: Container): TaskRepository {
  return container.get<TaskRepository>(PROJECTS_TOKENS.TaskRepository);
}

function commentRepository(container: Container): CommentRepository {
  return container.get<CommentRepository>(PROJECTS_TOKENS.CommentRepository);
}

function clock(container: Container): Clock {
  return container.get<Clock>(SHARED_TOKENS.Clock);
}

function idGenerator(container: Container): IdGenerator {
  return container.get<IdGenerator>(SHARED_TOKENS.IdGenerator);
}

const taskPriority = z.enum(['low', 'medium', 'high']);
const taskStatus = z.enum(['todo', 'doing', 'done']);

export const projectsRouter = router({
  list: publicProcedure.query(({ ctx }) => listProjects(db(ctx.container))),

  detail: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(({ ctx, input }) => getProjectDetail(db(ctx.container), input.projectId)),

  tasks: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(({ ctx, input }) => listTasks(db(ctx.container), input.projectId)),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
      }),
    )
    .mutation(({ ctx, input }) =>
      createProjectUseCase(
        { name: input.name, description: input.description, tags: input.tags, actorId: ctx.actor.id },
        {
          projectRepository: projectRepository(ctx.container),
          clock: clock(ctx.container),
          idGenerator: idGenerator(ctx.container),
        },
      ),
    ),

  update: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) =>
      updateProjectUseCase(
        { ...input, actor: ctx.actor },
        { projectRepository: projectRepository(ctx.container) },
      ),
    ),

  delete: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await deleteProjectUseCase(
        { projectId: input.projectId, actor: ctx.actor },
        { projectRepository: projectRepository(ctx.container) },
      );
      return { deleted: true };
    }),

  addTask: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        title: z.string().min(1),
        description: z.string().optional(),
        priority: taskPriority.optional(),
        assigneeId: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) =>
      addTaskUseCase(input, {
        projectRepository: projectRepository(ctx.container),
        taskRepository: taskRepository(ctx.container),
        clock: clock(ctx.container),
        idGenerator: idGenerator(ctx.container),
      }),
    ),

  updateTaskStatus: protectedProcedure
    .input(z.object({ taskId: z.string(), status: taskStatus }))
    .mutation(({ ctx, input }) =>
      updateTaskStatusUseCase(input, { taskRepository: taskRepository(ctx.container) }),
    ),

  assignTask: protectedProcedure
    .input(z.object({ taskId: z.string(), assigneeId: z.string() }))
    .mutation(({ ctx, input }) =>
      assignTaskUseCase(input, { taskRepository: taskRepository(ctx.container) }),
    ),

  comments: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(({ ctx, input }) => listComments(db(ctx.container), input.projectId)),

  addComment: protectedProcedure
    .input(z.object({ projectId: z.string(), body: z.string().min(1) }))
    .mutation(({ ctx, input }) =>
      addCommentUseCase(
        { projectId: input.projectId, authorId: ctx.actor.id, body: input.body },
        {
          projectRepository: projectRepository(ctx.container),
          commentRepository: commentRepository(ctx.container),
          clock: clock(ctx.container),
          idGenerator: idGenerator(ctx.container),
        },
      ),
    ),
});
