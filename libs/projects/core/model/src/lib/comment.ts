// Comment domain entity: a note left on a project.

export interface Comment {
  id: string;
  projectId: string;
  authorId: string;
  body: string;
  createdAt: Date;
}

export interface NewCommentInput {
  id: string;
  projectId: string;
  authorId: string;
  body: string;
  now: Date;
}

export function createComment(input: NewCommentInput): Comment {
  const body = input.body.trim();
  if (body.length === 0) {
    throw new Error('Comment body must not be empty');
  }
  return {
    id: input.id,
    projectId: input.projectId,
    authorId: input.authorId,
    body,
    createdAt: input.now,
  };
}

// Repository port implemented by the data layer's Drizzle adapter.
export interface CommentRepository {
  save(comment: Comment): Promise<void>;
}
