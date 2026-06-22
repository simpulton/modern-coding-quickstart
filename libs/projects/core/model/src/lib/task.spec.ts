import { changeTaskStatus, createTask } from './task';
import type { Task } from './task';

describe('createTask', () => {
  const base = { id: 't1', projectId: 'p1', now: new Date('2026-06-22T00:00:00Z') };

  it('defaults status to todo and priority to medium', () => {
    const task = createTask({ ...base, title: 'Write spec' });
    expect(task.status).toBe('todo');
    expect(task.priority).toBe('medium');
  });

  it('rejects an empty title', () => {
    expect(() => createTask({ ...base, title: '  ' })).toThrow(/title must not be empty/);
  });
});

describe('changeTaskStatus', () => {
  const task: Task = {
    id: 't1',
    title: 'Write spec',
    status: 'todo',
    priority: 'medium',
    projectId: 'p1',
    createdAt: new Date('2026-06-22T00:00:00Z'),
  };

  it('allows todo -> doing -> done', () => {
    const doing = changeTaskStatus(task, 'doing');
    expect(doing.status).toBe('doing');
    expect(changeTaskStatus(doing, 'done').status).toBe('done');
  });

  it('rejects an illegal transition todo -> done', () => {
    expect(() => changeTaskStatus(task, 'done')).toThrow(/Cannot move task/);
  });

  it('is a no-op when the status is unchanged', () => {
    expect(changeTaskStatus(task, 'todo')).toBe(task);
  });
});
