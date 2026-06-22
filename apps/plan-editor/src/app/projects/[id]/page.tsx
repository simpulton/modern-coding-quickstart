'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { trpc } from '../../../trpc/client';
import { TaskList } from '@pm/projects-ui';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params['id'] as string;
  const utils = trpc.useUtils();

  const project = trpc.projects.detail.useQuery({ projectId });
  const addTask = trpc.projects.addTask.useMutation({
    onSuccess: () => {
      void utils.projects.detail.invalidate({ projectId });
      setTitle('');
    },
  });
  const updateStatus = trpc.projects.updateTaskStatus.useMutation({
    onSuccess: () => {
      void utils.projects.detail.invalidate({ projectId });
    },
  });
  const comments = trpc.projects.comments.useQuery({ projectId });
  const addComment = trpc.projects.addComment.useMutation({
    onSuccess: () => {
      void utils.projects.comments.invalidate({ projectId });
      setBody('');
    },
  });

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  if (project.isLoading) {
    return <p>Loading project…</p>;
  }

  if (!project.data) {
    return <p>Project not found.</p>;
  }

  const { name, description, tags, tasks } = project.data;

  return (
    <section>
      <h1 data-testid="project-name">{name}</h1>
      {description && <p data-testid="project-description">{description}</p>}
      {tags.length > 0 && (
        <ul data-testid="project-tags" className="tags">
          {tags.map((tag) => (
            <li key={tag}>#{tag}</li>
          ))}
        </ul>
      )}

      <TaskList
        tasks={tasks}
        onStatusChange={(taskId, status) => {
          updateStatus.mutate({ taskId, status });
        }}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (title.trim()) {
            addTask.mutate({ projectId, title: title.trim() });
          }
        }}
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task title"
          data-testid="add-task-title"
          required
        />
        <button type="submit" data-testid="add-task-submit" disabled={addTask.isPending}>
          Add task
        </button>
      </form>

      <h2>Comments</h2>
      <ul data-testid="comment-list">
        {comments.data?.map((comment) => (
          <li key={comment.id} data-testid={`comment-${comment.id}`}>
            {comment.body}
          </li>
        ))}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (body.trim()) {
            addComment.mutate({ projectId, body: body.trim() });
          }
        }}
      >
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment"
          data-testid="add-comment-body"
          required
        />
        <button type="submit" data-testid="add-comment-submit" disabled={addComment.isPending}>
          Comment
        </button>
      </form>
    </section>
  );
}
