import type { inferRouterOutputs } from '@trpc/server';
import type { projectsRouter } from '@pm/projects-trpc';

type ProjectsOutputs = inferRouterOutputs<typeof projectsRouter>;

export type ProjectSummary = ProjectsOutputs['list'][number];
export type ProjectDetail = NonNullable<ProjectsOutputs['detail']>;
export type TaskSummary = ProjectDetail['tasks'][number];
