export interface SecretaryPermissions {
  canDeleteFiles: boolean;
}

export interface Secretary {
  id: string;
  name: string;
  mobile: string;
  online: boolean;
  permissions: SecretaryPermissions;
  createdAt: string;
}