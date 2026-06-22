import { inject, injectable } from 'inversify';
import { SHARED_TOKENS } from '@pm/shared-kernel';
import type { Comment, CommentRepository } from '@pm/projects-core-model';
import type { Database } from './database';
import { comments } from './schema';

@injectable()
export class DrizzleCommentRepository implements CommentRepository {
  constructor(@inject(SHARED_TOKENS.Database) private readonly db: Database) {}

  async save(comment: Comment): Promise<void> {
    await this.db.insert(comments).values({
      id: comment.id,
      projectId: comment.projectId,
      authorId: comment.authorId,
      body: comment.body,
      createdAt: comment.createdAt,
    });
  }
}
