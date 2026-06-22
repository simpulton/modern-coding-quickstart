import { createComment } from '@pm/projects-core-model';
import type { Comment, CommentRepository, ProjectRepository } from '@pm/projects-core-model';
import { NotFoundError } from '@pm/shared-kernel';
import type { Clock, IdGenerator } from '@pm/shared-kernel';

export interface AddCommentInput {
  projectId: string;
  authorId: string;
  body: string;
}

export interface AddCommentDeps {
  projectRepository: ProjectRepository;
  commentRepository: CommentRepository;
  clock: Clock;
  idGenerator: IdGenerator;
}

export async function addCommentUseCase(
  input: AddCommentInput,
  deps: AddCommentDeps,
): Promise<Comment> {
  const project = await deps.projectRepository.findById(input.projectId);
  if (!project) {
    throw new NotFoundError('Project', input.projectId);
  }
  const comment = createComment({
    id: deps.idGenerator.next(),
    projectId: input.projectId,
    authorId: input.authorId,
    body: input.body,
    now: deps.clock.now(),
  });
  await deps.commentRepository.save(comment);
  return comment;
}
