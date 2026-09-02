'use client';

import React from 'react';
import {
  useTaskChecklists,
  useChecklistProgress,
  useCreateChecklist,
  useUpdateChecklist,
  useToggleChecklistComplete,
  useDeleteChecklist,
  useBatchUpdateChecklists,
} from '../hooks/use-checklist';
import { ChecklistProgress } from './checklist-progress';
import { ChecklistItem } from './checklist-item';
import { AddChecklistItemForm } from './add-checklist-item-form';

interface ChecklistComponentProps {
  taskId: string;
}

export function ChecklistComponent({ taskId }: ChecklistComponentProps) {
  const { data: items = [], isLoading: isLoadingItems } = useTaskChecklists(taskId);
  const { data: progress, isLoading: isLoadingProgress } = useChecklistProgress(taskId);

  const createItem = useCreateChecklist(taskId);
  const updateItem = useUpdateChecklist(taskId);
  const toggleItem = useToggleChecklistComplete(taskId);
  const deleteItem = useDeleteChecklist(taskId);
  const batchUpdate = useBatchUpdateChecklists(taskId);

  const handleAddItem = (title: string) => {
    createItem.mutate({ title });
  };

  const handleToggle = (id: string, completed: boolean) => {
    toggleItem.mutate({ checklistId: id, completed });
  };

  const handleUpdateTitle = (id: string, title: string) => {
    updateItem.mutate({ checklistId: id, data: { title } });
  };

  const handleDelete = (id: string) => {
    deleteItem.mutate(id);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Recalculate positions based on array indices
    const updates = newItems.map((item, idx) => ({
      id: item.id,
      position: (idx + 1) * 1000,
    }));

    batchUpdate.mutate({ items: updates });
  };

  return (
    <div className="space-y-3 rounded-xl border border-white/10 bg-gray-950/40 p-4">
      <ChecklistProgress progress={progress} isLoading={isLoadingProgress} />

      {isLoadingItems ? (
        <div className="space-y-2 py-2">
          <div className="h-8 animate-pulse rounded-lg bg-gray-900/60" />
          <div className="h-8 animate-pulse rounded-lg bg-gray-900/60" />
        </div>
      ) : (
        <div className="space-y-1.5 py-1">
          {items.map((item, index) => (
            <ChecklistItem
              key={item.id}
              item={item}
              isFirst={index === 0}
              isLast={index === items.length - 1}
              onToggle={handleToggle}
              onUpdateTitle={handleUpdateTitle}
              onDelete={handleDelete}
              onMoveUp={() => handleMove(index, 'up')}
              onMoveDown={() => handleMove(index, 'down')}
            />
          ))}

          {items.length === 0 && (
            <p className="text-center py-2 text-xs text-gray-500 italic">No checklist items yet.</p>
          )}
        </div>
      )}

      <AddChecklistItemForm onAdd={handleAddItem} isLoading={createItem.isPending} />
    </div>
  );
}
