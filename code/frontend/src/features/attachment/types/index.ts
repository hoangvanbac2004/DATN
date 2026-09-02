export interface AttachmentDto {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  taskId?: string;
  userId?: string;
  mimeType?: string;
  fileExtension?: string;
  storageProvider?: string;
  createdAt?: string;
}
