import { getDeadlines, getSubjects, getUserCompletions } from '@/lib/db';
import { auth } from '@/auth';
import DeadlineFilters from '@/components/DeadlineFilters';
import { Clock, RefreshCw } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tất cả Deadline (ISR - 60s) | Class Deadline Hub',
  description: 'Danh sách tổng hợp toàn bộ deadline các môn học. Được tạo bằng Incremental Static Regeneration (ISR) với chu kỳ làm mới 60 giây.',
};

// ISR (Incremental Static Regeneration): Làm mới dữ liệu sau mỗi 60 giây
export const revalidate = 60;

export default async function DeadlinesPage() {
  const [deadlines, subjects, session] = await Promise.all([
    getDeadlines(),
    getSubjects(),
    auth(),
  ]);

  const userId = session?.user?.id;
  const userCompletions = userId ? await getUserCompletions(userId) : [];
  const completedSet = new Set(userCompletions.map((c) => c.deadlineId));

  // Gắn thông tin Subject và isCompleted vào từng deadline
  const enrichedDeadlines = deadlines.map((dl) => ({
    ...dl,
    subject: subjects.find((s) => s.slug === dl.subjectSlug),
    isCompleted: completedSet.has(dl.id),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <RefreshCw className="w-3.5 h-3.5" />
              Chiến lược ISR (revalidate: 60s)
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Lịch Trình & Danh Sách Deadline
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
            Tổng hợp toàn bộ bài tập và mốc nộp của lớp. Dữ liệu được cache siêu tốc và tự động làm mới định kỳ mỗi 60 giây.
          </p>
        </div>
      </div>

      {/* Client Component Filters & List */}
      <DeadlineFilters
        initialDeadlines={enrichedDeadlines}
        subjects={subjects}
        isLoggedIn={!!session?.user}
      />
    </div>
  );
}
