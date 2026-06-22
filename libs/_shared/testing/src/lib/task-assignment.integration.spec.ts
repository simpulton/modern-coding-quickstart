import type { Container } from 'inversify';
import { projectsRouter } from '@pm/projects-trpc';
import { createTestContainer } from './test-container';
import { createTestDatabase } from './test-database';
import { seedProject, seedUser } from './seed';
import type { TestDatabase } from './test-database';

// Module 05: written first, red until assignTask is implemented. It asserts the
// contract — a reader can see the assignee — not how assignment is stored.
describe('task assignment (TDD red -> green)', () => {
  let testDb: TestDatabase;
  let container: Container;

  beforeEach(async () => {
    testDb = await createTestDatabase();
    container = createTestContainer(testDb.db);
  });

  afterEach(async () => {
    await testDb.close();
  });

  it('assigns a task to a user and the assignee is visible to a reader', async () => {
    const owner = await seedUser(container, {
      email: 'owner@example.com',
      password: 'Password1!',
      name: 'Owner',
    });
    const project = await seedProject(container, { name: 'Apollo', ownerId: owner.id });
    const actor = { id: owner.id, role: owner.role };
    const caller = projectsRouter.createCaller({ container, actor });

    const task = await caller.addTask({ projectId: project.id, title: 'Write spec' });
    await caller.assignTask({ taskId: task.id, assigneeId: owner.id });

    const detail = await projectsRouter
      .createCaller({ container, actor: null })
      .detail({ projectId: project.id });
    const stored = detail?.tasks.find((t) => t.id === task.id);
    expect(stored?.assigneeId).toBe(owner.id);
  });
});
