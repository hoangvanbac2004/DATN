export interface UserSettingsDto {
  userId: string;
  theme: string;
  language: string;
  timezone: string;
  dateFormat: string;
  emailNotifications: boolean;
  desktopNotifications: boolean;
  weeklyDigest: boolean;
}

export interface UpdateUserSettingsInput {
  theme?: string;
  language?: string;
  timezone?: string;
  dateFormat?: string;
  emailNotifications?: boolean;
  desktopNotifications?: boolean;
  weeklyDigest?: boolean;
}
