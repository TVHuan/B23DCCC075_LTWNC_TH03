import { auth } from '@/auth';
import { getDeadlines, getSubjects, getUserCompletions } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import CountdownBadge from '@/components/CountdownBadge';
import MarkCompleteButton from '@/components/MarkCompleteButton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bảng tiến độ cá nhân (SSR) | Class Deadline Hub',
  description: 'Theo dõi tiến độ hoàn thành deadline và quản lý bài tập cá nhân.',
  robots: {
    index: false,
    follow: false,
  },
};

// SSR: Server-Side Rendering trên từng request
export const dynamic = 'force-dynamic';

interface DashboardPageProps {
  searchParams: Promise<{
    tab?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await auth();

  // Phòng thủ tầng Page (Defense in Depth)
  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  const { tab = 'all' } = await searchParams;

  const [deadlines, subjects, completions] = await Promise.all([
    getDeadlines(),
    getSubjects(),
    getUserCompletions(session.user.id),
  ]);

  const completedIds = new Set(completions.map((c) => c.deadlineId));

  // Gắn subject & completion status
  const enriched = deadlines.map((d) => ({
    ...d,
    subject: subjects.find((s) => s.slug === d.subjectSlug),
    isCompleted: completedIds.has(d.id),
  }));

  // Lọc theo tab
  const filtered = enriched.filter((item) => {
    if (tab === 'pending') return !item.isCompleted;
    if (tab === 'completed') return item.isCompleted;
    return true;
  });

  // Thống kê cá nhân
  const total = enriched.length;
  const completedCount = enriched.filter((d) => d.isCompleted).length;
  const pendingCount = total - completedCount;
  const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const now = new Date().getTime();
  const overdueCount = enriched.filter(
    (d) => !d.isCompleted && new Date(d.dueDate).getTime() < now
  ).length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900/80 border border-blue-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Chiến lược SSR (Server-Side Rendering)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Xin chào, {session.user.name || 'Sinh viên'}! 👋
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Dưới đây là tiến độ học tập và các mốc deadline của bạn trong học kỳ này.
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 shrink-0 text-center sm:text-right">
            <span className="text-xs text-slate-400 block font-medium">Tỷ lệ hoàn thành</span>
            <span className="text-3xl font-extrabold text-emerald-400">{percent}%</span>
          </div>
        </div>

        {/* Thanh Progress Bar */}
        <div className="mt-6 w-full bg-slate-950/80 h-3 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
          <div
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* 4 Thẻ Thống kê nhanh */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Tổng deadline</span>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-white">{total}</div>
        </div>

        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Đã hoàn thành</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{completedCount}</div>
        </div>

        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Cần làm tiếp</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400">{pendingCount}</div>
        </div>

        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Đã quá hạn</span>
            <AlertCircle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400">{overdueCount}</div>
        </div>
      </div>

      {/* Danh sách Deadline theo Tab */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            {tab === 'pending'
              ? 'Deadline cần nộp bài'
              : tab === 'completed'
              ? 'Deadline đã hoàn thành'
              : 'Tất cả Deadline môn học'}
            <span className="text-xs font-normal text-slate-400">({filtered.length})</span>
          </h2>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl">
            <CheckCircle2 className="w-10 h-10 text-emerald-500/40 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">Không có mục nào</h3>
            <p className="text-slate-400 text-xs mt-1">
              Bạn không có deadline nào trong danh mục này.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl border transition duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  item.isCompleted
                    ? 'bg-emerald-950/10 border-emerald-500/20'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="pt-0.5">
                    <MarkCompleteButton
                      deadlineId={item.id}
                      initialCompleted={item.isCompleted}
                    />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${item.subject?.badgeBg}`}>
                        {item.subject?.code}
                      </span>
                      <CountdownBadge dueDate={item.dueDate} isCompleted={item.isCompleted} />
                    </div>

                    <h3 className={`text-base font-bold ${item.isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>
                      <Link href={`/deadlines/${item.id}`} className="hover:text-blue-400 transition">
                        {item.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                  <span className="text-xs text-slate-400">
                    Hạn: <strong className="text-slate-200">{new Date(item.dueDate).toLocaleDateString('vi-VN')}</strong>
                  </span>

                  <Link
                    href={`/deadlines/${item.id}`}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 transition"
                  >
                    Chi tiết
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
