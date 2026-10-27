'use server';

import { auth } from '@/auth';
import { can } from '@/lib/permissions';
import {
  createDeadline,
  deleteDeadline,
  toggleDeadlineCompletion,
} from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Zod Schema kiểm tra hợp lệ dữ liệu đầu vào khi tạo deadline (Phòng thủ đa tầng)
const CreateDeadlineSchema = z.object({
  subjectSlug: z.string().min(1, 'Vui lòng chọn môn học'),
  title: z.string().min(5, 'Tiêu đề deadline phải có ít nhất 5 ký tự').max(200, 'Tiêu đề quá dài'),
  description: z.string().min(10, 'Mô tả deadline phải có ít nhất 10 ký tự'),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Hạn nộp không hợp lệ',
  }),
  priority: z.enum(['low', 'medium', 'high'], {
    message: 'Mức độ ưu tiên không hợp lệ',
  }),
  submissionUrl: z
    .string()
    .url('Đường dẫn nộp bài phải là URL hợp lệ')
    .optional()
    .or(z.literal('')),
});

/**
 * Server Action: Đánh dấu hoàn thành / chưa hoàn thành deadline
 */
export async function toggleCompleteAction(deadlineId: string) {
  const session = await auth();

  if (!session?.user) {
    return { success: false, error: 'Vui lòng đăng nhập để thực hiện thao tác này!' };
  }

  // Tự kiểm tra quyền phân tầng logic:
  if (!can(session.user.role, 'mark_completed')) {
    return { success: false, error: 'Bạn không có quyền đánh dấu hoàn thành!' };
  }

  try {
    const result = await toggleDeadlineCompletion(session.user.id, deadlineId);
    // Revalidate dashboard để cập nhật danh sách
    revalidatePath('/dashboard');
    return { success: true, completed: result.completed };
  } catch (err) {
    console.error('Error toggling completion:', err);
    return { success: false, error: 'Không thể cập nhật trạng thái deadline.' };
  }
}

/**
 * Server Action: Thêm deadline mới (Chỉ dành cho Admin / Lớp trưởng)
 */
export async function createDeadlineAction(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập!' };
  }

  // Tự thẩm định quyền (Defense in Depth)
  if (!can(session.user.role, 'create_deadline')) {
    return { success: false, error: '403: Chỉ Lớp trưởng (Admin) mới có quyền thêm deadline!' };
  }

  const rawData = {
    subjectSlug: formData.get('subjectSlug'),
    title: formData.get('title'),
    description: formData.get('description'),
    dueDate: formData.get('dueDate'),
    priority: formData.get('priority'),
    submissionUrl: formData.get('submissionUrl') || undefined,
  };

  const validation = CreateDeadlineSchema.safeParse(rawData);
  if (!validation.success) {
    const errorMsg = validation.error.issues.map((i) => i.message).join(', ');
    return { success: false, error: errorMsg };
  }

  try {
    const newDeadline = await createDeadline({
      subjectSlug: validation.data.subjectSlug,
      title: validation.data.title,
      description: validation.data.description,
      dueDate: new Date(validation.data.dueDate).toISOString(),
      priority: validation.data.priority,
      submissionUrl: validation.data.submissionUrl || undefined,
    });

    // On-demand Revalidation: Làm mới tức thì các route công khai và chi tiết
    revalidatePath('/deadlines');
    revalidatePath(`/deadlines/${newDeadline.id}`);
    revalidatePath(`/subjects/${newDeadline.subjectSlug}`);
    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/admin');

    return { success: true, deadline: newDeadline };
  } catch (err) {
    console.error('Error creating deadline:', err);
    return { success: false, error: 'Lỗi khi lưu dữ liệu deadline.' };
  }
}

/**
 * Server Action: Xóa deadline (Chỉ dành cho Admin / Lớp trưởng)
 */
export async function deleteDeadlineAction(id: string) {
  const session = await auth();

  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập!' };
  }

  // Tự thẩm định quyền (Defense in Depth)
  if (!can(session.user.role, 'delete_deadline')) {
    return { success: false, error: '403: Chỉ Lớp trưởng (Admin) mới có quyền xóa deadline!' };
  }

  try {
    const success = await deleteDeadline(id);
    if (!success) {
      return { success: false, error: 'Deadline không tồn tại hoặc đã bị xóa.' };
    }

    // On-demand Revalidation tức thì
    revalidatePath('/deadlines');
    revalidatePath(`/deadlines/${id}`);
    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/admin');

    return { success: true };
  } catch (err) {
    console.error('Error deleting deadline:', err);
    return { success: false, error: 'Lỗi máy chủ khi xóa deadline.' };
  }
}
