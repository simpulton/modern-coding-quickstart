import { ProjectAccessError } from '@pm/projects-core-model';
import type { Project, ProjectRepository } from '@pm/projects-core-model';
import { NotFoundError } from '@pm/shared-kernel';
import { updateProjectUseCase } from './update-project.use-case';

function fakeRepository(seed: Project[]): ProjectRepository {
  const store = new Map(seed.map((p) => [p.id, p]));
  return {
    async save(project) {
      store.set(project.id, project);
    },
    async findById(id) {
      return store.get(id) ?? null;
    },
    async delete(id) {
      store.delete(id);
    },
  };
}

const project: Project = {
  id: 'p1',
  name: 'Apollo',
  tags: [],
  ownerId: 'owner',
  createdAt: new Date('2026-06-22T00:00:00Z'),
};

describe('updateProjectUseCase', () => {
  it('lets the owner rename the project', async () => {
    const projectRepository = fakeRepository([project]);
    const updated = await updateProjectUseCase(
      { projectId: 'p1', name: 'Apollo 2', actor: { id: 'owner', role: 'member' } },
      { projectRepository },
    );
    expect(updated.name).toBe('Apollo 2');
  });

  it('rejects a non-owner member (ownership invariant)', async () => {
    const projectRepository = fakeRepository([project]);
    await expect(
      updateProjectUseCase(
        { projectId: 'p1', name: 'Hijacked', actor: { id: 'mallory', role: 'member' } },
        { projectRepository },
      ),
    ).rejects.toBeInstanceOf(ProjectAccessError);
  });

  it('allows an admin who is not the owner', async () => {
    const projectRepository = fakeRepository([project]);
    const updated = await updateProjectUseCase(
      { projectId: 'p1', name: 'By Admin', actor: { id: 'root', role: 'admin' } },
      { projectRepository },
    );
    expect(updated.name).toBe('By Admin');
  });

  it('throws NotFoundError for a missing project', async () => {
    const projectRepository = fakeRepository([]);
    await expect(
      updateProjectUseCase(
        { projectId: 'ghost', actor: { id: 'owner', role: 'admin' } },
        { projectRepository },
      ),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
