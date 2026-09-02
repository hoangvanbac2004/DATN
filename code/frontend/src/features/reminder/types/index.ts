export type ReminderStatus = 'PENDING' | 'TRIGGERED' | 'DISMISSED' | 'CANCELLED';
export type ReminderType = 'SYSTEM' | 'EMAIL' | 'PUSH';

export interface ReminderDto {
  id: string;
  taskId: string;
  userId: string;
  remindAt: string;
  status: ReminderStatus;
  type: ReminderType;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReminderInput {
  remindAt: string;
  type?: ReminderType;
}

export interface UpdateReminderInput {
  remindAt: string;
  status?: ReminderStatus;
  type?: ReminderType;
}
