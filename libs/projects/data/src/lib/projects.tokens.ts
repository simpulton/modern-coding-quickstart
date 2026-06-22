// DI tokens for the projects subdomain, kept in a dedicated file for discoverability.

export const PROJECTS_TOKENS = {
  ProjectRepository: Symbol.for('pm.projects.ProjectRepository'),
  TaskRepository: Symbol.for('pm.projects.TaskRepository'),
} as const;
