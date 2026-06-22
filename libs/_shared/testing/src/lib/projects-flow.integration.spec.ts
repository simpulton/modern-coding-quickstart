import type { Container } from 'inversify';
import { projectsRouter } from '@pm/projects-trpc';
import type { AuthActor } from '@pm/shared-kernel';
import { createTestContainer } from './test-container';
import { createTestDatabase } from './test-database';
import { seedProject, seedUser } from './seed';
import type { TestDatabase } from './test-database';

describe('projects flow (tRPC -> use case -> Drizzle -> PGLite)', () => {
  let testDb: TestDatabase;
  let container: Container;

  beforeEach(async () => {
    testDb = await createTestDatabase();
    container = createTestContainer(testDb.db);
  });

  afterEach(async () => {
    await testDb.close();
  });

  function caller(actor: AuthActor | null) {
    return projectsRouter.createCaller({ container, actor });
  }

  it('creates a project through the protected mutation and reads it back via the query', async () => {
    const owner = await seedUser(container, {
      email: 'owner@example.com',
      password: 'Password1!',
      name: 'Owner',
    });

    const created = await caller({ id: owner.id, role: owner.role }).create({ name: 'Apollo' });
    expect(created.ownerId).toBe(owner.id);

    const list = await caller(null).list();
    expect(list.map((p) => p.name)).toContain('Apollo');
  });

  it('enforces the ownership invariant across the boundary', async () => {
    const owner = await seedUser(container, {
      email: 'owner@example.com',
      password: 'Password1!',
      name: 'Owner',
    });
    const mallory = await seedUser(container, {
      email: 'mallory@example.com',
      password: 'Password1!',
      name: 'Mallory',
    });
    const project = await seedProject(container, { name: 'Apollo', ownerId: owner.id });

    await expect(
      caller({ id: mallory.id, role: 'member' }).update({ projectId: project.id, name: 'Hijacked' }),
    ).rejects.toMatchObject({ code: 'FORBIDDEN' });
  });

  it('rejects unauthenticated writes', async () => {
    await expect(caller(null).create({ name: 'Nope' })).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
    });
  });

  it('adds a task and lists it under the project', async () => {
    const owner = await seedUser(container, {
      email: 'owner@example.com',
      password: 'Password1!',
      name: 'Owner',
    });
    const project = await seedProject(container, { name: 'Apollo', ownerId: owner.id });
    const actor = { id: owner.id, role: owner.role };

    await caller(actor).addTask({ projectId: project.id, title: 'Write spec' });
    const detail = await caller(null).detail({ projectId: project.id });
    expect(detail?.tasks.map((t) => t.title)).toEqual(['Write spec']);
  });
});
