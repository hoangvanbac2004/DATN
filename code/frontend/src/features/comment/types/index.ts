import type { UserDto } from '@/features/auth/types';

export interface CommentDto {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  author?: UserDto;
  mentionedUserIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCommentInput {
  content: string;
  mentionedUserIds?: string[];
}

export interface UpdateCommentInput {
  content: string;
  mentionedUserIds?: string[];
}

export interface PaginatedCommentsResponse {
  items: CommentDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
