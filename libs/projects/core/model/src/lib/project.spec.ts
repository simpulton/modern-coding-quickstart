import { assertCanModifyProject, createProject, ProjectAccessError } from './project';
import type { Project } from './project';

describe('createProject', () => {
  const base = { id: 'p1', ownerId: 'u1', now: new Date('2026-06-22T00:00:00Z') };

  it('trims the name and builds a project', () => {
    const project = createProject({ ...base, name: '  Apollo  ' });
    expect(project.name).toBe('Apollo');
    expect(project.ownerId).toBe('u1');
    expect(project.createdAt).toEqual(base.now);
  });

  it('rejects an empty name', () => {
    expect(() => createProject({ ...base, name: '   ' })).toThrow(/name must not be empty/);
  });

  it('normalizes a blank description to undefined', () => {
    const project = createProject({ ...base, name: 'Apollo', description: '   ' });
    expect(project.description).toBeUndefined();
  });
});

describe('assertCanModifyProject', () => {
  const project: Project = {
    id: 'p1',
    name: 'Apollo',
    ownerId: 'owner',
    createdAt: new Date('2026-06-22T00:00:00Z'),
  };

  it('allows the owner', () => {
    expect(() => assertCanModifyProject(project, { id: 'owner', role: 'member' })).not.toThrow();
  });

  it('allows an admin who is not the owner', () => {
    expect(() => assertCanModifyProject(project, { id: 'someone', role: 'admin' })).not.toThrow();
  });

  it('rejects a non-owner member', () => {
    expect(() => assertCanModifyProject(project, { id: 'someone', role: 'member' })).toThrow(
      ProjectAccessError,
    );
  });
});
