export type WhiteboardElementType = 'STICKY_NOTE' | 'SHAPE_RECT' | 'SHAPE_CIRCLE' | 'CONNECTOR';

export interface WhiteboardElementDto {
  id: string;
  whiteboardId: string;
  type: WhiteboardElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content?: string;
  styleJson?: string;
  startElementId?: string;
  endElementId?: string;
  zIndex: number;
}

export interface WhiteboardDto {
  id: string;
  workspaceId: string;
  projectId?: string;
  title: string;
  description?: string;
  backgroundColor: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  elements: WhiteboardElementDto[];
}

export interface CreateWhiteboardPayload {
  title: string;
  description?: string;
  projectId?: string;
  backgroundColor?: string;
}

export interface UpdateWhiteboardPayload {
  title: string;
  description?: string;
  backgroundColor?: string;
}

export interface SyncElementsPayload {
  elements: WhiteboardElementDto[];
}
