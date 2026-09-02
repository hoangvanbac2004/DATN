'use client';

import React, { useState } from 'react';
import { Edit2, Trash2, User as UserIcon } from 'lucide-react';
import type { CommentDto } from '../types';
import { CommentForm } from './comment-form';
import { useAuthStore } from '@/store/auth-store';

interface CommentItemProps {
  comment: CommentDto;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

function renderContentWithMentions(content: string) {
  if (!content) return '';
  const parts = content.split(/(@[^\s]+)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('@')) {
      return (
        <span key={idx} className="rounded bg-indigo-500/20 px-1 py-0.5 font-semibold text-indigo-400 border border-indigo-500/30">
          {part}
        </span>
      );
    }
    return part;
  });
}

export function CommentItem({ comment, onUpdate, onDelete }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const currentUser = useAuthStore((state) => state.user);

  const isOwner = currentUser?.id === comment.userId;
  const authorName = comment.author?.fullName || 'TaskFlow User';
  const initial = authorName.charAt(0).toUpperCase();

  const formattedDate = comment.createdAt
    ? new Date(comment.createdAt).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const handleUpdate = (newContent: string) => {
    onUpdate(comment.id, newContent);
    setIsEditing(false);
  };

  return (
    <div className="group flex items-start space-x-3 rounded-xl border border-white/5 bg-gray-900/40 p-3.5 text-xs transition hover:border-white/10 hover:bg-gray-900/70">
      {/* User Avatar */}
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600/30 text-indigo-400 font-bold text-xs border border-indigo-500/20">
        {comment.author?.avatarUrl ? (
          <img src={comment.author.avatarUrl} alt={authorName} className="h-full w-full rounded-full object-cover" />
        ) : (
          <span>{initial}</span>
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        {/* Header: Author Name & Timestamp */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white">{authorName}</span>
            <span className="text-[10px] text-gray-500">{formattedDate}</span>
          </div>

          {isOwner && !isEditing && (
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded p-1 text-gray-400 hover:bg-white/10 hover:text-indigo-400"
                title="Edit comment"
              >
                <Edit2 className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(comment.id)}
                className="rounded p-1 text-gray-400 hover:bg-red-500/20 hover:text-red-400"
                title="Delete comment"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        {/* Content or Edit Form */}
        {isEditing ? (
          <CommentForm
            initialValue={comment.content}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            submitLabel="Save"
          />
        ) : (
          <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
            {renderContentWithMentions(comment.content)}
          </p>
        )}
      </div>
    </div>
  );
}
