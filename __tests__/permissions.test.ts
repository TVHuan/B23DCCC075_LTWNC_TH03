import { can } from '../src/lib/permissions';
import { Role, Action } from '../src/types';

describe('Unit Test: Hàm phân quyền can(role, action)', () => {
  describe('Vai trò Khách (guest)', () => {
    const role: Role = 'guest';

    it('cho phép guest xem deadline', () => {
      expect(can(role, 'view_deadline')).toBe(true);
    });

    it('từ chối guest đánh dấu đã xong', () => {
      expect(can(role, 'mark_completed')).toBe(false);
    });

    it('từ chối guest thêm deadline', () => {
      expect(can(role, 'create_deadline')).toBe(false);
    });

    it('từ chối guest xoá deadline', () => {
      expect(can(role, 'delete_deadline')).toBe(false);
    });
  });

  describe('Vai trò Sinh viên (user)', () => {
    const role: Role = 'user';

    it('cho phép user xem deadline', () => {
      expect(can(role, 'view_deadline')).toBe(true);
    });

    it('cho phép user đánh dấu đã xong', () => {
      expect(can(role, 'mark_completed')).toBe(true);
    });

    it('từ chối user thêm deadline', () => {
      expect(can(role, 'create_deadline')).toBe(false);
    });

    it('từ chối user xoá deadline', () => {
      expect(can(role, 'delete_deadline')).toBe(false);
    });
  });

  describe('Vai trò Lớp trưởng (admin)', () => {
    const role: Role = 'admin';

    it('cho phép admin xem deadline', () => {
      expect(can(role, 'view_deadline')).toBe(true);
    });

    it('cho phép admin đánh dấu đã xong', () => {
      expect(can(role, 'mark_completed')).toBe(true);
    });

    it('cho phép admin thêm deadline', () => {
      expect(can(role, 'create_deadline')).toBe(true);
    });

    it('cho phép admin xoá deadline', () => {
      expect(can(role, 'delete_deadline')).toBe(true);
    });
  });

  describe('Trường hợp biên (Edge Cases)', () => {
    it('mặc định là guest nếu không truyền role', () => {
      expect(can(undefined, 'view_deadline')).toBe(true);
      expect(can(undefined, 'create_deadline')).toBe(false);
    });

    it('trả về false nếu truyền role không hợp lệ', () => {
      // @ts-expect-error kiểm tra role lạ
      expect(can('unknown_role', 'view_deadline')).toBe(false);
    });
  });
});
