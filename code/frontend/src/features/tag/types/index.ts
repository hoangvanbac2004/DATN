export interface TagDto {
  id: string;
  name: string;
  color: string;
  workspaceId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTagInput {
  name: string;
  color?: string;
}

export interface UpdateTagInput {
  name: string;
  color?: string;
}
