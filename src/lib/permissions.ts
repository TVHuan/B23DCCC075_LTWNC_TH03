import { Role, Action } from '@/types';

/**
 * Ma trận phân quyền tập trung duy nhất của toàn hệ thống Class Deadline Hub.
 * Tuân thủ yêu cầu Đề bài phần D.
 */
export const PERMISSION_MATRIX: Record<Role, Record<Action, boolean>> = {
  guest: {
    view_deadline: true,
    mark_completed: false,
    create_deadline: false,
    delete_deadline: false,
  },
  user: {
    view_deadline: true,
    mark_completed: true,
    create_deadline: false,
    delete_deadline: false,
  },
  admin: {
    view_deadline: true,
    mark_completed: true,
    create_deadline: true,
    delete_deadline: true,
  },
};

/**
 * Hàm kiểm tra quyền can(role, action)
 * @param role - Vai trò của người dùng ('admin' | 'user' | 'guest')
 * @param action - Hành động cần kiểm tra ('view_deadline' | 'mark_completed' | 'create_deadline' | 'delete_deadline')
 * @returns boolean - true nếu có quyền, ngược lại false
 */
export function can(role: Role = 'guest', action: Action): boolean {
  if (!role || !PERMISSION_MATRIX[role]) {
    return false;
  }
  return PERMISSION_MATRIX[role][action] ?? false;
}
