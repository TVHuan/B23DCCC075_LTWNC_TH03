'use client';

import { useState, useTransition } from 'react';
import { createDeadlineAction } from '@/actions/deadlineActions';
import { Subject } from '@/types';
import { PlusCircle, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface AdminCreateDeadlineFormProps {
  subjects: Subject[];
}

export default function AdminCreateDeadlineForm({ subjects }: AdminCreateDeadlineFormProps) {
  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await createDeadlineAction(formData);
      if (res.success) {
        setSuccessMsg(`Thêm deadline "${res.deadline?.title}" thành công! Hệ thống đã kích hoạt On-demand ISR.`);
        form.reset();
      } else {
        setErrorMsg(res.error || 'Có lỗi xảy ra khi thêm deadline.');
      }
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur shadow-xl mb-10">
      <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
        <PlusCircle className="w-5 h-5 text-red-400" />
        Thêm Deadline mới cho lớp
      </h2>
      <p className="text-xs text-slate-400 mb-6">
        Thông tin deadline mới sẽ được lưu vào hệ thống và kích hoạt On-demand ISR làm mới tức thì trang /deadlines và /deadlines/[id].
      </p>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-400 text-xs sm:text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-400 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Môn học *
            </label>
            <select
              name="subjectSlug"
              required
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition"
            >
              <option value="">-- Chọn môn học --</option>
              {subjects.map((sub) => (
                <option key={sub.slug} value={sub.slug}>
                  {sub.code} - {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Mức độ ưu tiên *
            </label>
            <select
              name="priority"
              required
              defaultValue="medium"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition"
            >
              <option value="low">Thấp (Tự học / Đọc tài liệu)</option>
              <option value="medium">Trung bình (Bài tập tuần / Lab)</option>
              <option value="high">Cao (Bài tập lớn / Báo cáo đồ án)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Hạn chót nộp bài (Due Date) *
            </label>
            <input
              type="datetime-local"
              name="dueDate"
              required
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Tiêu đề Deadline *
          </label>
          <input
            type="text"
            name="title"
            required
            placeholder="Ví dụ: Báo cáo Thực hành 03 - Next.js App Router"
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Mô tả & Yêu cầu chi tiết *
          </label>
          <textarea
            name="description"
            required
            rows={3}
            placeholder="Mô tả nội dung bài tập, danh mục tài liệu cần nộp, lưu ý về định dạng file..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition resize-y"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Đường dẫn nộp bài (Google Classroom / Forms / LMS)
          </label>
          <input
            type="url"
            name="submissionUrl"
            placeholder="https://classroom.google.com/..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang lưu & kích hoạt On-demand ISR...
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                Thêm Deadline vào hệ thống
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
