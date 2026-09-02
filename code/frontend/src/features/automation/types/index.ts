export type TriggerType =
  | 'TASK_STATUS_CHANGED'
  | 'TASK_COMPLETED'
  | 'DUE_DATE_PASSED'
  | 'TASK_CREATED'
  | 'MEMBER_ASSIGNED';

export type ActionType =
  | 'MOVE_TASK_TO_COLUMN'
  | 'UPDATE_STATUS'
  | 'SEND_NOTIFICATION'
  | 'ASSIGN_USER';

export interface AutomationRuleDto {
  id: string;
  workspaceId: string;
  projectId?: string;
  name: string;
  description?: string;
  triggerType: TriggerType;
  triggerConfigJson?: string;
  conditionConfigJson?: string;
  actionType: ActionType;
  actionConfigJson: string;
  isEnabled: boolean;
  executionCount: number;
  lastExecutedAt?: string;
  createdAt: string;
}

export interface AutomationLogDto {
  id: string;
  ruleId: string;
  status: string;
  message?: string;
  createdAt: string;
}

export interface CreateRulePayload {
  name: string;
  description?: string;
  projectId?: string;
  triggerType: TriggerType;
  triggerConfigJson?: string;
  conditionConfigJson?: string;
  actionType: ActionType;
  actionConfigJson: string;
  isEnabled?: boolean;
}
