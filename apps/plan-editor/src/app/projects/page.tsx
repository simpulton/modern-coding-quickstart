'use client';

import Link from 'next/link';
import { trpc } from '../../trpc/client';

export default function ProjectsPage() {
  const projects = trpc.projects.list.useQuery();

  if (projects.isLoading) {
    return <p>Loading projects…</p>;
  }
  return (
    <section>
      <h1>Projects</h1>
      <ul data-testid="project-list">
        {projects.data?.map((project) => (
          <li key={project.id}>
            <Link href={`/projects/${project.id}`}>{project.name}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
