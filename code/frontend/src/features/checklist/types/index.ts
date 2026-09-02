export interface ChecklistDto {
  id: string;
  title: string;
  completed: boolean;
  taskId: string;
  position: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChecklistProgressDto {
  taskId: string;
  totalItems: number;
  completedItems: number;
  percentage: number;
}

export interface CreateChecklistInput {
  title: string;
  completed?: boolean;
  position?: number;
}

export interface UpdateChecklistInput {
  title: string;
  completed?: boolean;
}

export interface BatchUpdateChecklistItem {
  id: string;
  title?: string;
  completed?: boolean;
  position?: number;
}

export interface BatchUpdateChecklistInput {
  items: BatchUpdateChecklistItem[];
}
