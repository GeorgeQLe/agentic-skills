export type EnvVars = Record<string, string>;

export interface BootstrapUserRow {
  id: string;
  name: string;
  email: string;
}

export interface BootstrapOrgRow {
  org_id: string;
  is_primary: boolean;
}

export interface LegacySession {
  sessionToken: string;
  userId: string;
  userName: string;
  userEmail: string;
  orgId: string;
  authenticatedAt: string;
}

export interface LegacyConfig {
  session: LegacySession;
}
