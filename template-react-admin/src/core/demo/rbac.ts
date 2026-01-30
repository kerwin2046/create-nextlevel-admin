/**
 * RBAC 工具：根据角色/权限列表判断是否拥有某权限
 * 后端若返回用户 permissions 数组，可直接 hasPermission(user.permissions, 'user:write')
 */
export function hasPermission(
  userPermissions: string[] | undefined | null,
  required: string
): boolean {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  if (userPermissions.includes('*')) return true;
  return userPermissions.includes(required);
}

/** 是否拥有任一权限 */
export function hasAnyPermission(
  userPermissions: string[] | undefined | null,
  requiredList: string[]
): boolean {
  return requiredList.some((p) => hasPermission(userPermissions, p));
}
