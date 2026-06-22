import type { ProjectSummary } from './types';

interface ProjectCardProps {
  project: ProjectSummary;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div data-testid="project-card">
      <h3>{project.name}</h3>
      <p>Owner: {project.ownerId}</p>
      <p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
    </div>
  );
}
