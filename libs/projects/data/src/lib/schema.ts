import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  ownerId: text('owner_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const tasks = pgTable(
  'tasks',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    status: text('status', { enum: ['todo', 'doing', 'done'] }).notNull().default('todo'),
    priority: text('priority', { enum: ['low', 'medium', 'high'] }).notNull().default('medium'),
    dueDate: timestamp('due_date', { withTimezone: true }),
    projectId: text('project_id').notNull(),
    assigneeId: text('assignee_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('tasks_project_id_idx').on(table.projectId)],
);
