export interface WikiPageDto {
  id: string;
  workspaceId: string;
  projectId?: string;
  parentPageId?: string;
  title: string;
  slug: string;
  content?: string;
  icon: string;
  version: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface WikiPageTreeNodeDto {
  id: string;
  parentPageId?: string;
  title: string;
  slug: string;
  icon: string;
  children: WikiPageTreeNodeDto[];
}

export interface WikiPageVersionDto {
  id: string;
  pageId: string;
  version: number;
  title: string;
  content?: string;
  changeSummary?: string;
  createdAt: string;
  createdBy?: string;
}

export interface CreateWikiPagePayload {
  title: string;
  content?: string;
  parentPageId?: string;
  projectId?: string;
  icon?: string;
}

export interface UpdateWikiPagePayload {
  title: string;
  content?: string;
  changeSummary?: string;
  icon?: string;
}
