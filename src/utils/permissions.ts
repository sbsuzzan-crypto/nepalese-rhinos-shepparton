
export type UserRole = 'admin' | 'moderator';

export interface Permission {
  create?: boolean;
  read?: boolean;
  update?: boolean;
  delete?: boolean;
}

export const rolePermissions: Record<UserRole, Record<string, Permission>> = {
  admin: {
    // Full access to everything
    news: { create: true, read: true, update: true, delete: true },
    announcements: { create: true, read: true, update: true, delete: true },
    events: { create: true, read: true, update: true, delete: true },
    players: { create: true, read: true, update: true, delete: true },
    teams: { create: true, read: true, update: true, delete: true },
    fixtures: { create: true, read: true, update: true, delete: true },
    gallery: { create: true, read: true, update: true, delete: true },
    sponsors: { create: true, read: true, update: true, delete: true },
    messages: { create: true, read: true, update: true, delete: true },
    supporters: { create: true, read: true, update: true, delete: true },
    joinRequests: { create: true, read: true, update: true, delete: true },
    contactForms: { create: true, read: true, update: true, delete: true },
    documents: { create: true, read: true, update: true, delete: true },
    siteSettings: { create: true, read: true, update: true, delete: true },
    staff: { create: true, read: true, update: true, delete: true },
    users: { create: true, read: true, update: true, delete: true },
  },
  moderator: {
    // Content management with some restrictions
    news: { create: true, read: true, update: true, delete: false }, // Can't delete
    announcements: { create: true, read: true, update: true, delete: false },
    events: { create: true, read: true, update: true, delete: false },
    players: { create: true, read: true, update: true, delete: false },
    teams: { create: true, read: true, update: true, delete: false },
    fixtures: { create: true, read: true, update: true, delete: false },
    gallery: { create: true, read: true, update: true, delete: false },
    sponsors: { create: true, read: true, update: true, delete: false },
    messages: { create: false, read: true, update: true, delete: false }, // Can only read and mark as read
    supporters: { create: false, read: true, update: true, delete: false },
    joinRequests: { create: false, read: true, update: true, delete: false },
    contactForms: { create: false, read: true, update: true, delete: false },
    documents: { create: true, read: true, update: true, delete: false },
    // No access to these admin-only features
    siteSettings: { create: false, read: false, update: false, delete: false },
    staff: { create: false, read: false, update: false, delete: false },
    users: { create: false, read: false, update: false, delete: false },
  },
};

export const hasPermission = (
  userRole: UserRole | undefined,
  resource: string,
  action: keyof Permission
): boolean => {
  if (!userRole || !rolePermissions[userRole] || !rolePermissions[userRole][resource]) {
    return false;
  }
  
  return rolePermissions[userRole][resource][action] === true;
};

export const canAccess = (userRole: UserRole | undefined, resource: string): boolean => {
  return hasPermission(userRole, resource, 'read');
};

export const getResourcePermissions = (
  userRole: UserRole | undefined,
  resource: string
): Permission => {
  if (!userRole || !rolePermissions[userRole] || !rolePermissions[userRole][resource]) {
    return { create: false, read: false, update: false, delete: false };
  }
  
  return rolePermissions[userRole][resource];
};
