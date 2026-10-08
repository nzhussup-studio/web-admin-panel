export const ADMIN_ROLE = "ROLE_ADMIN";

export const hasAdminRole = (roles: string[]) => roles.includes(ADMIN_ROLE);
