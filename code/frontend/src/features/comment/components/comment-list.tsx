'use client';

import React, { useState } from 'react';
import { MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTaskComments, useCreateComment, useUpdateComment, useDeleteComment } from '../hooks/use-comment';
import { CommentItem } from './comment-item';
import { CommentForm } from './comment-form';

interface CommentListProps {
  taskId: string;
}

export function CommentList({ taskId }: CommentListProps) {
  const [page, setPage] = useState(0);

  const { data, isLoading } = useTaskComments(taskId, page, 10);
  const createComment = useCreateComment(taskId);
  const updateComment = useUpdateComment(taskId);
  const deleteComment = useDeleteComment(taskId);

  const comments = data?.items || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 0;

  const handleCreate = (content: string) => {
    createComment.mutate({ content });
  };

  const handleUpdate = (id: string, content: string) => {
    updateComment.mutate({ commentId: id, data: { content } });
  };

  const handleDelete = (id: string) => {
    deleteComment.mutate(id);
  };

  return (
    <div className="space-y-4 rounded-xl border border-white/10 bg-gray-950/40 p-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-4 w-4 text-indigo-400" />
          <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Discussion ({totalElements})
          </h3>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center space-x-1.5 text-xs text-gray-400">
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="rounded p-1 border border-white/10 hover:bg-white/10 disabled:opacity-30"
            >
              <ChevronLeft className="h-3 w-3" />
            </button>
            <button
              type="button"
              disabled={data?.last}
              onClick={() => setPage((p) => p + 1)}
              className="rounded p-1 border border-white/10 hover:bg-white/10 disabled:opacity-30"
            >
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/* Comment Creation Form */}
      <CommentForm onSubmit={handleCreate} isLoading={createComment.isPending} />

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-2 py-2">
          <div className="h-16 animate-pulse rounded-xl bg-gray-900/60" />
          <div className="h-16 animate-pulse rounded-xl bg-gray-900/60" />
        </div>
      ) : (
        <div className="space-y-2.5 pt-1">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}

          {comments.length === 0 && (
            <p className="text-center py-4 text-xs text-gray-500 italic">No comments yet. Start the conversation!</p>
          )}
        </div>
      )}
    </div>
  );
}
