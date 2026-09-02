import type { TaskDto } from '@/features/task/types';

export interface BoardSettingsDto {
  columnWidth?: number;
  showTaskCount?: boolean;
  allowWipLimits?: boolean;
  defaultColor?: string;
}

export interface BoardColumnDto {
  id: string;
  boardId: string;
  name: string;
  color: string;
  position: number;
  wipLimit: number;
  isCollapsed: boolean;
  tasks: TaskDto[];
  createdAt: string;
  updatedAt: string;
}

export interface BoardDto {
  id: string;
  name: string;
  description: string;
  projectId: string;
  settings: BoardSettingsDto;
  columns: BoardColumnDto[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateColumnPayload {
  name: string;
  color?: string;
  position?: number;
  wipLimit?: number;
}

export interface UpdateColumnPayload {
  name?: string;
  color?: string;
  wipLimit?: number;
  isCollapsed?: boolean;
}

export interface ColumnOrderPayload {
  columnId: string;
  position: number;
}

export interface ReorderColumnsPayload {
  orders: ColumnOrderPayload[];
}

export interface MoveTaskPayload {
  taskId: string;
  targetColumnId: string;
  targetPosition: number;
}

export interface UpdateBoardSettingsPayload {
  name?: string;
  description?: string;
  settings?: BoardSettingsDto;
}
