export interface Integration {
  id: number;
  name: string;
  active: boolean;
}

export interface Role {
  id: number;
  name: string;
  users: number;
  description: string;
  permissions: string[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface GeneralSettings {
  fullName: string;
  email: string;
  mobile: string;
  company: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  securityAlerts: boolean;
  weeklyReports: boolean;
}

export type SettingsTab =
  | "general"
  | "notifications"
  | "integrations"
  | "roles";
