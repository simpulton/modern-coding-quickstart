import type { Container } from 'inversify';
import { projectsRouter } from '@pm/projects-trpc';
import { createTestContainer } from './test-container';
import { createTestDatabase } from './test-database';
import { seedProject, seedUser } from './seed';
import type { TestDatabase } from './test-database';

describe('project comments (capstone vertical)', () => {
  let testDb: TestDatabase;
  let container: Container;

  beforeEach(async () => {
    testDb = await createTestDatabase();
    container = createTestContainer(testDb.db);
  });

  afterEach(async () => {
    await testDb.close();
  });

  it('adds a comment (command) and reads it back (query)', async () => {
    const author = await seedUser(container, {
      email: 'author@example.com',
      password: 'Password1!',
      name: 'Author',
    });
    const project = await seedProject(container, { name: 'Apollo', ownerId: author.id });
    const caller = projectsRouter.createCaller({
      container,
      actor: { id: author.id, role: author.role },
    });

    await caller.addComment({ projectId: project.id, body: 'First!' });

    const comments = await projectsRouter
      .createCaller({ container, actor: null })
      .comments({ projectId: project.id });
    expect(comments.map((c) => c.body)).toEqual(['First!']);
    expect(comments[0]?.authorId).toBe(author.id);
  });

  it('rejects an unauthenticated comment', async () => {
    const author = await seedUser(container, {
      email: 'author@example.com',
      password: 'Password1!',
      name: 'Author',
    });
    const project = await seedProject(container, { name: 'Apollo', ownerId: author.id });

    await expect(
      projectsRouter
        .createCaller({ container, actor: null })
        .addComment({ projectId: project.id, body: 'nope' }),
    ).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
  });
});
