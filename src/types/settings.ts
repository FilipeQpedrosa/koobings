export interface EmailSettings {
  from: string;
  server: string;
  port: string;
}

export interface SecuritySettings {
  sessionTimeout: number;
  requireMFA: boolean;
  enforcePasswordPolicy: boolean;
}

export interface BusinessSettings {
  maxActive: number;
  autoApprove: boolean;
}

export interface SystemSettings {
  email: EmailSettings;
  security: SecuritySettings;
  business: BusinessSettings;
}

export interface SystemSettingRecord {
  key: string;
  value: any;
  lastModifiedBy: string;
  lastModifiedByAdmin: {
    name: string;
  };
} 